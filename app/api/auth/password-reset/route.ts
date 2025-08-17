import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json } from '@/app/api/_helpers';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return json({ message: 'If exists, email sent' });
  const token = Math.random().toString(36).slice(2);
  await prisma.passwordResetToken.create({ data: { userId: user.id, token } });
  return json({ message: 'Reset created', reset_token: token });
}
