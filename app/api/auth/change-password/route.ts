import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { json, requireUser } from '@/app/api/_helpers';

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { current_password, new_password } = await req.json();
  const ok = await bcrypt.compare(current_password, user.passwordHash);
  if (!ok) return json({ error: 'Invalid current password' }, 400);
  const hash = await bcrypt.hash(new_password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
  return json({ message: 'Password changed' });
}
