import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';
import { postCreateSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  const page = parseInt(new URL(req.url).searchParams.get('page') || '1');
  const size = 20;
  const posts = await prisma.post.findMany({
    where: { isActive: true },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page-1)*size,
    take: size
  });
  return json({ posts });
}

export async function POST(req: NextRequest) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  const body = await req.json();
  const parsed = postCreateSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

  const p = parsed.data;
  const post = await prisma.post.create({ data: {
    authorId: me.id, content: p.content, imageUrl: p.image_url ?? undefined, category: p.category
  }});
  return json({ post }, 201);
}
