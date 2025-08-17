import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json } from '@/app/api/_helpers';

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return json({ error: 'token required' }, 400);
  const row = await prisma.verificationToken.findUnique({ where: { token } });
  if (!row) return json({ error: 'invalid token' }, 400);
  await prisma.user.update({ where: { id: row.userId }, data: { emailVerified: true } });
  await prisma.verificationToken.delete({ where: { token } });
  return json({ message: 'Email verified' });
}
