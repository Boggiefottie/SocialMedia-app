import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json } from '@/app/api/_helpers';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const following = await prisma.follow.findMany({ where: { followerId: params.id }, include: { following: true } });
  return json({ following });
}
