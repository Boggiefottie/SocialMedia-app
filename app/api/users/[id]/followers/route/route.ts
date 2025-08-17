import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json } from '@/app/api/_helpers';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const followers = await prisma.follow.findMany({ where: { followingId: params.id }, include: { follower: true } });
  return json({ followers });
}
