import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  const n = await prisma.notification.findUnique({ where: { id: params.id } });
  if (!n || n.recipientId !== me.id) return json({ error: 'Forbidden' }, 403);
  await prisma.notification.update({ where: { id: params.id }, data: { isRead: true } });
  return json({ message: 'ok' });
}
