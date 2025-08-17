import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function GET(req: NextRequest) {
  const me = await requireUser(req);
  if (!me) return json({ posts: [] }, 200);
  const page = parseInt(new URL(req.url).searchParams.get('page') || '1');
  const size = 20;
  // users I follow + myself
  const following = await prisma.follow.findMany({ where: { followerId: me.id }, select: { followingId: true } });
  const ids = [me.id, ...following.map(f => f.followingId)];
  const posts = await prisma.post.findMany({
    where: { authorId: { in: ids }, isActive: true },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page-1)*size,
    take: size
  });

  // liked status
  const liked = await prisma.like.findMany({ where: { userId: me.id, postId: { in: posts.map(p=>p.id) } } });
  const likedSet = new Set(liked.map(l=>l.postId));

  return json({ posts: posts.map(p => ({ ...p, liked: likedSet.has(p.id) })) });
}
