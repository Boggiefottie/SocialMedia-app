import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  await prisma.like.create({ data: { userId: me.id, postId: params.id } }).catch(()=>{});
  const count = await prisma.like.count({ where: { postId: params.id } });
  await prisma.post.update({ where: { id: params.id }, data: { likeCount: count } });

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (post && post.authorId !== me.id) {
    await prisma.notification.create({ data: {
      recipientId: post.authorId, senderId: me.id, notificationType: 'LIKE', postId: post.id,
      message: 'Your post got a like'
    }});
  }

  return json({ like_count: count });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  await prisma.like.deleteMany({ where: { userId: me.id, postId: params.id } });
  const count = await prisma.like.count({ where: { postId: params.id } });
  await prisma.post.update({ where: { id: params.id }, data: { likeCount: count } });
  return json({ like_count: count });
}
