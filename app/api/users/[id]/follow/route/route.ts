import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  if (me.id === params.id) return json({ error: 'Cannot follow yourself' }, 400);
  await prisma.follow.create({ data: { followerId: me.id, followingId: params.id } }).catch(()=>{});

  // Notification
  await prisma.notification.create({ data: {
    recipientId: params.id,
    senderId: me.id,
    notificationType: 'FOLLOW',
    message: `${me.username} started following you`
  }});

  return json({ message: 'followed' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  await prisma.follow.deleteMany({ where: { followerId: me.id, followingId: params.id } });
  return json({ message: 'unfollowed' });
}
