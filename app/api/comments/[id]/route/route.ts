import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  const row = await prisma.comment.findUnique({ where: { id: params.id } });
  if (!row || row.authorId !== me.id) return json({ error: 'Forbidden' }, 403);
  await prisma.comment.update({ where: { id: params.id }, data: { isActive: false } });
  const count = await prisma.comment.count({ where: { postId: row.postId, isActive: true } });
  await prisma.post.update({ where: { id: row.postId }, data: { commentCount: count } });
  return json({ message: 'deleted' });
}
