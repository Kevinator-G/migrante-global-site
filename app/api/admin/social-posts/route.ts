import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const posts = await prisma.socialPost.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      blogPost: { select: { id: true, title: true, slug: true, imageUrl: true, category: true } },
    },
  })

  const instagram = posts.filter((p) => p.platform === 'instagram')
  const tiktok = posts.filter((p) => p.platform === 'tiktok')
  const youtube = posts.filter((p) => p.platform === 'youtube')

  const stats = {
    instagram: {
      published: instagram.filter((p) => p.status === 'published').length,
      failed: instagram.filter((p) => p.status === 'failed').length,
      skipped: instagram.filter((p) => p.status === 'skipped').length,
    },
    tiktok: { pending: tiktok.filter((p) => p.status === 'pending_script').length },
    youtube: { pending: youtube.filter((p) => p.status === 'pending_script').length },
    total: posts.length,
  }

  return NextResponse.json({ posts, stats })
}
