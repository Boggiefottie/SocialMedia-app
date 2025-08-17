import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function POST(req: NextRequest) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  await prisma.notification.updateMany({ where: { recipientId: me.id, isRead: false }, data: { isRead: true } });
  return json({ message: 'ok' });
}
