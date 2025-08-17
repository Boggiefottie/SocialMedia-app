import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me || me.role !== 'ADMIN') return json({ error: 'Forbidden' }, 403);
  await prisma.post.delete({ where: { id: params.id } });
  return json({ message: 'deleted' });
}
