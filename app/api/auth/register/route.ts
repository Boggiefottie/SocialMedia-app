import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { registerSchema, usernameSchema } from '@/lib/validators';
import bcrypt from 'bcryptjs';
import { json } from '@/app/api/_helpers';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

  const { email, username, password, first_name, last_name } = parsed.data;
  const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (exists) return json({ error: 'Email or username already in use' }, 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email, username, passwordHash,
      firstName: first_name, lastName: last_name,
      profile: { create: {} }
    }
  });

  // Simulate email verification by returning token (in real app send email)
  const token = Math.random().toString(36).slice(2);
  await prisma.verificationToken.create({ data: { userId: user.id, token } });

  return json({ message: 'Registered. Verify email using /api/auth/verify-email', verification_token: token });
}
