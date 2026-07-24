import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { adaptContentForSocials } from '@/lib/social/content-adapter'
import { publishToInstagram } from '@/lib/social/instagram'
import { publishToFacebook } from '@/lib/social/facebook'

const prisma = new PrismaClient()

export const maxDuration = 60

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
// Solo publica imagen + caption en Instagram y Facebook, enlazando al blog.
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

  return NextResponse.json({ success: true, blogPostId, results })
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
