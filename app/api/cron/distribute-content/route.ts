import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { adaptContentForSocials } from '@/lib/social/content-adapter'
import { publishToInstagram } from '@/lib/social/instagram'
import { publishToFacebook } from '@/lib/social/facebook'
import { textToSpeech } from '@/lib/social/elevenlabs'
import { generateVideo } from '@/lib/social/video-generator'
import { publishToTikTok } from '@/lib/social/tiktok'
import { publishToYouTube } from '@/lib/social/youtube'

const prisma = new PrismaClient()

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

  const post = await prisma.blogPost.findUnique({
    where: { id: blogPostId },
    include: { socialPosts: { select: { platform: true } } },
  })

  if (!post) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  }

  const alreadyDistributed = post.socialPosts.map((s) => s.platform)
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
    !alreadyDistributed.includes('instagram_reel')

  if (needsVideo && post.imageUrl) {
    // 1. Generate voiceover
    let audioUrl: string | undefined
    const voiceScript = adapted.tiktok.script ?? `${post.title}. ${post.excerpt}`
    const audioResult = await textToSpeech(voiceScript)

    if (audioResult.success && audioResult.audioBuffer) {
      // Upload audio buffer to a public URL via Vercel's own API route
      // so Shotstack can access it. We store it as base64 and serve it.
      // For now we pass undefined if no dedicated audio hosting is configured.
      // Set AUDIO_HOSTING_URL env var to enable (see docs/VIDEO_SETUP.md)
      const audioHostingUrl = process.env.AUDIO_HOSTING_URL
      if (audioHostingUrl) {
        try {
          const uploadRes = await fetch(`${audioHostingUrl}/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'audio/mpeg' },
            body: audioResult.audioBuffer,
          })
          if (uploadRes.ok) {
            const { url } = await uploadRes.json()
            audioUrl = url
          }
        } catch {
          // non-fatal — video will use background music only
        }
      }
    }

    // 2. Generate video with Shotstack
    const videoResult = await generateVideo({
      title: post.title,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl,
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

// Instagram Reels — two-step: create container → publish
async function publishReelToInstagram(
  videoUrl: string,
  caption: string,
  hashtags: string[],
): Promise<{ success: boolean; platformId?: string; platformUrl?: string; error?: string }> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID
  if (!token || !accountId) {
    return { success: false, error: 'INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID not set' }
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

// GET — manually distribute the most recent blog post
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

  const internalUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/cron/distribute-content`
  const res = await fetch(internalUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
    body: JSON.stringify({ blogPostId: latest.id }),
  })

  const data = await res.json()
  return NextResponse.json({ post: latest.title, ...data })
}
