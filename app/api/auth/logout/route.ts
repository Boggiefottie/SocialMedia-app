import { NextRequest, NextResponse } from 'next/server';
import { blacklistRefresh } from '@/app/api/_helpers';

export async function POST(req: NextRequest) {
  const { refresh } = await req.json();
  if (refresh) await blacklistRefresh(refresh);
  return NextResponse.json({ message: 'Logged out' });
}
