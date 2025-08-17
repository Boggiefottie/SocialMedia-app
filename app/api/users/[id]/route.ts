import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';
import { profileUpdateSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  const counters = await prisma.$transaction([
    prisma.follow.count({ where: { followingId: user.id } }),
    prisma.follow.count({ where: { followerId: user.id } }),
    prisma.post.count({ where: { authorId: user.id } }),
  ]);
  return json({ user, profile, followers_count: counters[0], following_count: counters[1], posts_count: counters[2] });
}

export async function PATCH(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const body = await req.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);
  const p = parsed.data;
  const profile = await prisma.profile.update({ where: { userId: user.id }, data: {
    bio: p.bio ?? undefined,
    avatarUrl: p.avatar_url ?? undefined,
    website: p.website ?? undefined,
    location: p.location ?? undefined,
    visibility: p.visibility ?? undefined,
  }});
  return json({ profile });
}
