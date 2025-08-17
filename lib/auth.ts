import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';
import { prisma } from './db';
import type { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';

export type JWTPayload = { id: string; role: Role };

export function signAccessToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}
export function signRefreshToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
}
export function verifyToken(token: string): JWTPayload | null {
  try { return jwt.verify(token, JWT_SECRET) as JWTPayload; } catch { return null; }
}

export async function getAuthUser() {
  const h = headers();
  const auth = h.get('authorization');
  let token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
  if (!token) {
    // fallback to cookie
    const c = cookies().get('access_token');
    token = c?.value;
  }
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.id }, include: { profile: true } });
  return user;
}

export function requireRole(role: Role, userRole: Role) {
  if (userRole !== role) throw new Error('Forbidden');
}
