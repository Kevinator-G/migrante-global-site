import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { adaptContentForSocials } from '@/lib/social/content-adapter'
import { publishToInstagram } from '@/lib/social/instagram'
import { publishToFacebook, publishVideoToFacebook } from '@/lib/social/facebook'
import { textToSpeech } from '@/lib/social/elevenlabs'
import { generateVideo } from '@/lib/social/video-generator'
import { pickVideoMedia } from '@/lib/social/media-library'
import { getInstagramToken } from '@/lib/social/meta-token'
import { publishToTikTok } from '@/lib/social/tiktok'
import { publishToYouTube } from '@/lib/social/youtube'

const prisma = new PrismaClient()

// La distribución completa (render de video incluido) puede tardar varios minutos
export const maxDuration = 300

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const authHeader = req.headers.get('authorization')
  if (authHeader === `Bearer ${secret}`) return true
  const querySecret = req.nextUrl.searchParams.get('secret')
  if (querySecret === secret) return true
  const headerSecret = req.headers.get('x-cron-secret')
  if (headerSecret === secret) return true
  return false
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { blogPostId } = body as { blogPostId?: string }

  if (!blogPostId) {
    return NextResponse.json({ error: 'blogPostId required' }, { status: 400 })
  }

  return distributeBlogPost(blogPostId)
}

// Lógica compartida por POST (id explícito) y GET (último post publicado).
// Corre en el mismo proceso — la versión anterior se llamaba a sí misma por HTTP
// con NEXT_PUBLIC_SITE_URL sin definir (localhost) y la distribución nunca corría.
async function distributeBlogPost(blogPostId: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id: blogPostId },
    include: { socialPosts: { select: { platform: true, status: true } } },
  })

  if (!post) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  }

  // Solo lo PUBLICADO cuenta como distribuido — los intentos fallidos se reintentan
  const alreadyDistributed = post.socialPosts
    .filter((s) => s.status === 'published')
    .map((s) => s.platform)
  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://migranteglobal.ch'}/blog/${post.slug}`

  let adapted
  try {
    adapted = await adaptContentForSocials(
      post.title,
      post.excerpt,
      post.content,
      post.category,
      blogUrl,
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Content adaptation failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }

  const results: Record<string, unknown> = {}

  // ── Instagram — image post ─────────────────────────────────────────────────
  if (!alreadyDistributed.includes('instagram')) {
    let igStatus = 'failed'
    let igPlatformId: string | undefined
    let igPlatformUrl: string | undefined
    let igError: string | undefined

    if (post.imageUrl) {
      const igResult = await publishToInstagram(
        post.imageUrl,
        adapted.instagram.caption,
        adapted.instagram.hashtags,
      )
      igStatus = igResult.success ? 'published' : 'failed'
      igPlatformId = igResult.platformId
      igPlatformUrl = igResult.platformUrl
      igError = igResult.error
    } else {
      igStatus = 'skipped'
      igError = 'No image available for Instagram post'
    }

    await prisma.socialPost.create({
      data: {
        blogPostId: post.id,
        platform: 'instagram',
        status: igStatus,
        caption: adapted.instagram.caption,
        hashtags: adapted.instagram.hashtags,
        platformId: igPlatformId,
        platformUrl: igPlatformUrl,
        error: igError,
        publishedAt: igStatus === 'published' ? new Date() : undefined,
      },
    })

    results.instagram = { status: igStatus, url: igPlatformUrl, error: igError }
  }

  // ── Facebook — image post ──────────────────────────────────────────────────
  if (!alreadyDistributed.includes('facebook')) {
    let fbStatus = 'failed'
    let fbPlatformId: string | undefined
    let fbPlatformUrl: string | undefined
    let fbError: string | undefined

    if (post.imageUrl) {
      const fbResult = await publishToFacebook(
        post.imageUrl,
        adapted.instagram.caption,
        adapted.instagram.hashtags,
      )
      fbStatus = fbResult.success ? 'published' : 'failed'
      fbPlatformId = fbResult.platformId
      fbPlatformUrl = fbResult.platformUrl
      fbError = fbResult.error
    } else {
      fbStatus = 'skipped'
      fbError = 'No image available for Facebook post'
    }

    await prisma.socialPost.create({
      data: {
        blogPostId: post.id,
        platform: 'facebook',
        status: fbStatus,
        caption: adapted.instagram.caption,
        hashtags: adapted.instagram.hashtags,
        platformId: fbPlatformId,
        platformUrl: fbPlatformUrl,
        error: fbError,
        publishedAt: fbStatus === 'published' ? new Date() : undefined,
      },
    })

    results.facebook = { status: fbStatus, url: fbPlatformUrl, error: fbError }
  }

  // ── Video pipeline — TikTok + YouTube Shorts + Instagram Reels ────────────
  const needsVideo =
    !alreadyDistributed.includes('tiktok') ||
    !alreadyDistributed.includes('youtube') ||
    !alreadyDistributed.includes('instagram_reel') ||
    !alreadyDistributed.includes('facebook_video')

  if (needsVideo && post.imageUrl) {
    // 1. Generate voiceover — el guion de voz sigue las escenas del video
    let audioUrl: string | undefined
    const voiceScript = adapted.video
      ? `${adapted.video.gancho}. ${adapted.video.puntos.join('. ')}. ${adapted.video.cta}`
      : adapted.tiktok.script ?? `${post.title}. ${post.excerpt}`
    const audioResult = await textToSpeech(voiceScript)

    if (audioResult.success && audioResult.audioBuffer) {
      // Alojar el MP3 en Vercel Blob para que Shotstack pueda accederlo
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(`social/voz-${post.id}.mp3`, audioResult.audioBuffer, {
          access: 'public',
          contentType: 'audio/mpeg',
          allowOverwrite: true,
        })
        audioUrl = blob.url
      } catch {
        // no fatal — el video sale sin voz
      }
    }

    // 2. Imágenes por escena: material propio de la biblioteca primero,
    // Unsplash de relleno (excluyendo la foto que ya usa el post)
    const propio = await pickVideoMedia(post.category)
    const necesitaUnsplash = propio.fotos.length < 4
    const extraUnsplash = necesitaUnsplash
      ? (await fetchUnsplashImages(adapted.video?.keywords ?? [post.category])).filter(
          (u) => u.split('?')[0] !== post.imageUrl?.split('?')[0],
        )
      : []

    // 3. Generate video with Shotstack
    const videoResult = await generateVideo({
      title: post.title,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl,
      imageUrls: [...propio.fotos, ...extraUnsplash],
      clipUrl: propio.clip,
      gancho: adapted.video?.gancho,
      puntos: adapted.video?.puntos,
      cta: adapted.video?.cta,
      audioUrl,
    })

    results.video = {
      success: videoResult.success,
      renderId: videoResult.renderId,
      videoUrl: videoResult.videoUrl,
      error: videoResult.error,
    }

    // 3. Distribute video to platforms
    if (videoResult.success && videoResult.videoUrl) {
      const videoUrl = videoResult.videoUrl

      // ── TikTok ────────────────────────────────────────────────────────────
      if (!alreadyDistributed.includes('tiktok')) {
        const ttResult = await publishToTikTok(
          videoUrl,
          adapted.tiktok.script.slice(0, 300),
          adapted.tiktok.hashtags,
        )

        await prisma.socialPost.create({
          data: {
            blogPostId: post.id,
            platform: 'tiktok',
            status: ttResult.success ? 'published' : 'failed',
            script: adapted.tiktok.script,
            hashtags: adapted.tiktok.hashtags,
            platformId: ttResult.platformId,
            platformUrl: ttResult.platformUrl,
            error: ttResult.error,
            publishedAt: ttResult.success ? new Date() : undefined,
          },
        })

        results.tiktok = { status: ttResult.success ? 'published' : 'failed', error: ttResult.error }
      }

      // ── YouTube Shorts ────────────────────────────────────────────────────
      if (!alreadyDistributed.includes('youtube')) {
        const ytResult = await publishToYouTube(
          videoUrl,
          post.title,
          adapted.youtube.description,
          adapted.youtube.tags,
        )

        await prisma.socialPost.create({
          data: {
            blogPostId: post.id,
            platform: 'youtube',
            status: ytResult.success ? 'published' : 'failed',
            script: adapted.youtube.script,
            caption: adapted.youtube.description,
            hashtags: adapted.youtube.tags,
            platformId: ytResult.platformId,
            platformUrl: ytResult.platformUrl,
            error: ytResult.error,
            publishedAt: ytResult.success ? new Date() : undefined,
          },
        })

        results.youtube = {
          status: ytResult.success ? 'published' : 'failed',
          url: ytResult.platformUrl,
          error: ytResult.error,
        }
      }

      // ── Facebook video ────────────────────────────────────────────────────
      if (!alreadyDistributed.includes('facebook_video')) {
        const fbVideoResult = await publishVideoToFacebook(
          videoUrl,
          adapted.instagram.caption,
          adapted.instagram.hashtags,
        )

        await prisma.socialPost.create({
          data: {
            blogPostId: post.id,
            platform: 'facebook_video',
            status: fbVideoResult.success ? 'published' : 'failed',
            caption: adapted.instagram.caption,
            hashtags: adapted.instagram.hashtags,
            platformId: fbVideoResult.platformId,
            platformUrl: fbVideoResult.platformUrl,
            error: fbVideoResult.error,
            publishedAt: fbVideoResult.success ? new Date() : undefined,
          },
        })

        results.facebook_video = {
          status: fbVideoResult.success ? 'published' : 'failed',
          url: fbVideoResult.platformUrl,
          error: fbVideoResult.error,
        }
      }

      // ── Instagram Reel ────────────────────────────────────────────────────
      if (!alreadyDistributed.includes('instagram_reel')) {
        const igReelResult = await publishReelToInstagram(
          videoUrl,
          adapted.instagram.caption,
          adapted.instagram.hashtags,
        )

        await prisma.socialPost.create({
          data: {
            blogPostId: post.id,
            platform: 'instagram_reel',
            status: igReelResult.success ? 'published' : 'failed',
            caption: adapted.instagram.caption,
            hashtags: adapted.instagram.hashtags,
            platformId: igReelResult.platformId,
            platformUrl: igReelResult.platformUrl,
            error: igReelResult.error,
            publishedAt: igReelResult.success ? new Date() : undefined,
          },
        })

        results.instagram_reel = {
          status: igReelResult.success ? 'published' : 'failed',
          url: igReelResult.platformUrl,
          error: igReelResult.error,
        }
      }
    } else {
      // Video render failed — save scripts for manual posting
      if (!alreadyDistributed.includes('tiktok')) {
        await prisma.socialPost.create({
          data: {
            blogPostId: post.id,
            platform: 'tiktok',
            status: 'pending_script',
            script: adapted.tiktok.script,
            hashtags: adapted.tiktok.hashtags,
            error: videoResult.error,
          },
        })
        results.tiktok = { status: 'pending_script', error: videoResult.error }
      }
      if (!alreadyDistributed.includes('youtube')) {
        await prisma.socialPost.create({
          data: {
            blogPostId: post.id,
            platform: 'youtube',
            status: 'pending_script',
            script: adapted.youtube.script,
            caption: adapted.youtube.description,
            hashtags: adapted.youtube.tags,
            error: videoResult.error,
          },
        })
        results.youtube = { status: 'pending_script', error: videoResult.error }
      }
    }
  } else if (needsVideo && !post.imageUrl) {
    // No image — save scripts for manual posting
    for (const platform of ['tiktok', 'youtube'] as const) {
      if (!alreadyDistributed.includes(platform)) {
        await prisma.socialPost.create({
          data: {
            blogPostId: post.id,
            platform,
            status: 'skipped',
            error: 'No image available for video generation',
          },
        })
        results[platform] = { status: 'skipped' }
      }
    }
  }

  return NextResponse.json({ success: true, blogPostId, results })
}

// Busca hasta 3 fotos verticales en Unsplash para variar las escenas del video.
// No fatal: si falla, el video reutiliza la imagen del blog.
async function fetchUnsplashImages(keywords: string[]): Promise<string[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey || keywords.length === 0) return []

  try {
    const query = encodeURIComponent(keywords.slice(0, 3).join(' '))
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=3&orientation=portrait`,
      { headers: { Authorization: `Client-ID ${accessKey}` } },
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.results ?? [])
      .map((r: { urls?: { regular?: string } }) => r.urls?.regular)
      .filter((u: string | undefined): u is string => Boolean(u))
  } catch {
    return []
  }
}

// Instagram Reels — two-step: create container → publish
async function publishReelToInstagram(
  videoUrl: string,
  caption: string,
  hashtags: string[],
): Promise<{ success: boolean; platformId?: string; platformUrl?: string; error?: string }> {
  const token = await getInstagramToken()
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID
  if (!token || !accountId) {
    return { success: false, error: 'Token de Instagram no disponible o INSTAGRAM_ACCOUNT_ID not set' }
  }

  const BASE = 'https://graph.facebook.com/v19.0'
  const fullCaption = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`

  try {
    // 1. Create Reel container
    const containerRes = await fetch(`${BASE}/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'REELS',
        video_url: videoUrl,
        caption: fullCaption,
        access_token: token,
      }),
    })
    const containerData = await containerRes.json()
    const containerId: string = containerData.id
    if (!containerId) {
      throw new Error(containerData.error?.message ?? 'No container ID')
    }

    // 2. Poll until container is ready (up to 90s)
    const deadline = Date.now() + 90_000
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 5000))
      const statusRes = await fetch(
        `${BASE}/${containerId}?fields=status_code&access_token=${token}`,
      )
      const statusData = await statusRes.json()
      if (statusData.status_code === 'FINISHED') break
      if (statusData.status_code === 'ERROR') {
        throw new Error('Instagram container processing failed')
      }
    }

    // 3. Publish
    const publishRes = await fetch(`${BASE}/${accountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: containerId, access_token: token }),
    })
    const publishData = await publishRes.json()
    const mediaId: string = publishData.id
    if (!mediaId) throw new Error(publishData.error?.message ?? 'No media ID on publish')

    return {
      success: true,
      platformId: mediaId,
      platformUrl: `https://www.instagram.com/p/${mediaId}/`,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown Instagram Reel error',
    }
  }
}

// GET — distribuye el último post publicado (lo invoca el cron de Vercel a diario)
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const latest = await prisma.blogPost.findFirst({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  })

  if (!latest) {
    return NextResponse.json({ error: 'No published posts found' }, { status: 404 })
  }

  const res = await distributeBlogPost(latest.id)
  const data = await res.json()
  return NextResponse.json({ post: latest.title, ...data }, { status: res.status })
}
