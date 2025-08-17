import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

// GET /api/users (admin only) with basic search
export async function GET(req: NextRequest) {
  const me = await requireUser(req);
  if (!me || me.role !== 'ADMIN') return json({ error: 'Forbidden' }, 403);
  const q = new URL(req.url).searchParams.get('q') || '';
  const users = await prisma.user.findMany({
    where: q ? { OR: [{ email: { contains: q, mode: 'insensitive' } }, { username: { contains: q, mode: 'insensitive' } }] } : {},
    select: { id: true, email: true, username: true, isActive: true, role: true, createdAt: true }
  });
  return json({ users });
}
