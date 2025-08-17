import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function GET(req: NextRequest) {
  const me = await requireUser(req);
  if (!me || me.role !== 'ADMIN') return json({ error: 'Forbidden' }, 403);
  const [users, posts, activeToday] = await prisma.$transaction([
    prisma.user.count(),
    prisma.post.count(),
    prisma.user.count({ where: { lastLoginAt: { gte: new Date(new Date().toDateString()) } } })
  ]);
  return json({ total_users: users, total_posts: posts, active_today: activeToday });
}
