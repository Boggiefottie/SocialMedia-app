import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signAccessToken, signRefreshToken, verifyToken } from '@/lib/auth';
import type { JWTPayload } from '@/lib/auth';

export function json(data: any, init: number = 200) {
  return NextResponse.json(data, { status: init });
}

export async function requireUser(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : req.cookies.get('access_token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  return user;
}

export function issueTokens(payload: JWTPayload) {
  const access = signAccessToken(payload);
  const refresh = signRefreshToken(payload);
  return { access, refresh };
}

export async function blacklistRefresh(token: string) {
  const payload = verifyToken(token) as JWTPayload | null;
  if (!payload) return;
  await prisma.refreshToken.create({ data: { userId: payload.id, token, blacklisted: true } });
}

export async function validatePassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}
