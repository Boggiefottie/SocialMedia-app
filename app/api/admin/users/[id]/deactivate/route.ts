import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function GET(req: NextRequest) {
  const me = await requireUser(req);
  if (!me || me.role !== 'ADMIN') return json({ error: 'Forbidden' }, 403);
  const users = await prisma.user.findMany({ select: { id: true, email: true, username: true, isActive: true, role: true } });
  return json({ users });
}
