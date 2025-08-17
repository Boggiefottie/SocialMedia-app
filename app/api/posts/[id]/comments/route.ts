import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';
import { commentCreateSchema } from '@/lib/validators';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const comments = await prisma.comment.findMany({
    where: { postId: params.id, isActive: true },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return json({ comments });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  const body = await req.json();
  const parsed = commentCreateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

  const c = await prisma.comment.create({ data: { content: parsed.data.content, authorId: me.id, postId: params.id } });
  const count = await prisma.comment.count({ where: { postId: params.id, isActive: true } });
  await prisma.post.update({ where: { id: params.id }, data: { commentCount: count } });

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (post && post.authorId !== me.id) {
    await prisma.notification.create({ data: {
      recipientId: post.authorId, senderId: me.id, notificationType: 'COMMENT', postId: post.id,
      message: 'New comment on your post'
    }});
  }

  return json({ comment: c });
}
