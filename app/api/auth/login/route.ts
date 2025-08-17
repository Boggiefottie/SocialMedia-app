import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validators';
import { issueTokens } from '@/app/api/_helpers';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { email, username, password } = parsed.data;
  const user = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  if (!user.isActive) return NextResponse.json({ error: 'Account disabled' }, { status: 403 });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const { access, refresh } = issueTokens({ id: user.id, role: user.role });
  return NextResponse.json({ access, refresh, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
}
