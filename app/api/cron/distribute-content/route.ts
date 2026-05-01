import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { adaptContentForSocials } from '@/lib/social/content-adapter'
import { publishToInstagram } from '@/lib/social/instagram'

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

  // ── Instagram ──────────────────────────────────────────────────────────────
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

  // ── TikTok (script saved, manual posting) ─────────────────────────────────
  if (!alreadyDistributed.includes('tiktok')) {
    await prisma.socialPost.create({
      data: {
        blogPostId: post.id,
        platform: 'tiktok',
        status: 'pending_script',
        script: adapted.tiktok.script,
        hashtags: adapted.tiktok.hashtags,
      },
    })
    results.tiktok = { status: 'pending_script' }
  }

  // ── YouTube (full script saved, Kevin records) ────────────────────────────
  if (!alreadyDistributed.includes('youtube')) {
    await prisma.socialPost.create({
      data: {
        blogPostId: post.id,
        platform: 'youtube',
        status: 'pending_script',
        script: adapted.youtube.script,
        caption: adapted.youtube.description,
        hashtags: adapted.youtube.tags,
      },
    })
    results.youtube = { status: 'pending_script' }
  }

  return NextResponse.json({ success: true, blogPostId, results })
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
