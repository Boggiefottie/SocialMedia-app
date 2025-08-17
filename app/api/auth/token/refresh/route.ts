import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { issueTokens } from '@/app/api/_helpers';

export async function POST(req: NextRequest) {
  const { refresh } = await req.json();
  if (!refresh) return NextResponse.json({ error: 'refresh required' }, { status: 400 });
  const payload = verifyToken(refresh);
  if (!payload) return NextResponse.json({ error: 'invalid refresh' }, { status: 401 });
  const black = await prisma.refreshToken.findUnique({ where: { token: refresh } });
  if (black?.blacklisted) return NextResponse.json({ error: 'blacklisted' }, { status: 401 });
  const { access } = issueTokens(payload);
  return NextResponse.json({ access });
}
