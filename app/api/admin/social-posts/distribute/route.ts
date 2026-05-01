import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const latest = await prisma.blogPost.findFirst({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  })

  if (!latest) return NextResponse.json({ error: 'No posts found' }, { status: 404 })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/cron/distribute-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${process.env.CRON_SECRET ?? ''}`,
    },
    body: JSON.stringify({ blogPostId: latest.id }),
  })

  const data = await res.json()
  return NextResponse.json({ success: true, post: latest.title, ...data })
}
