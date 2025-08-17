import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { json } from '@/app/api/_helpers';

export async function POST(req: NextRequest) {
  const { token, new_password } = await req.json();
  const row = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!row) return json({ error: 'Invalid token' }, 400);
  const hash = await bcrypt.hash(new_password, 10);
  await prisma.user.update({ where: { id: row.userId }, data: { passwordHash: hash } });
  await prisma.passwordResetToken.delete({ where: { token } });
  return json({ message: 'Password updated' });
}
