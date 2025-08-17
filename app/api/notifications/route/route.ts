import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';

export async function GET(req: NextRequest) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  const rows = await prisma.notification.findMany({
    where: { recipientId: me.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  return json({ notifications: rows });
}
