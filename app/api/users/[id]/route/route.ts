import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, username: true, firstName: true, lastName: true, role: true, profile: true }
  });
  if (!user) return json({ error: 'Not found' }, 404);
  const [followers, following, posts] = await prisma.$transaction([
    prisma.follow.count({ where: { followingId: id } }),
    prisma.follow.count({ where: { followerId: id } }),
    prisma.post.count({ where: { authorId: id } }),
  ]);
  return json({ user, followers_count: followers, following_count: following, posts_count: posts });
}
