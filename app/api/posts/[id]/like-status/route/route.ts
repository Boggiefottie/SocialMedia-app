import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ liked: false });
  const like = await prisma.like.findUnique({ where: { userId_postId: { userId: me.id, postId: params.id } } }).catch(()=>null);
  return json({ liked: !!like });
}
