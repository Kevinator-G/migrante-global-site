import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/dedup-blog?secret=<CRON_SECRET>
// Finds posts with duplicate titles, keeps the OLDEST one per title, deletes the rest.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all posts ordered by creation date (oldest first)
  const all = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, title: true, createdAt: true, slug: true },
  });

  // Group by title
  const seen = new Map<string, string>(); // title → first id (to keep)
  const toDelete: string[] = [];

  for (const post of all) {
    const key = post.title.trim().toLowerCase();
    if (seen.has(key)) {
      toDelete.push(post.id); // duplicate — schedule for deletion
    } else {
      seen.set(key, post.id); // first occurrence — keep
    }
  }

  if (toDelete.length === 0) {
    return NextResponse.json({ message: 'No duplicates found', deleted: 0 });
  }

  // Delete duplicates in batches
  await prisma.blogPost.deleteMany({ where: { id: { in: toDelete } } });

  return NextResponse.json({
    message: `Cleanup complete`,
    deleted: toDelete.length,
    kept: seen.size,
  });
}
