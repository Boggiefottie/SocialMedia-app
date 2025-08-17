import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { json, requireUser } from '@/app/api/_helpers';
import { postCreateSchema } from '@/lib/validators';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { username: true } },
      comments: { include: { author: { select: { username: true } } }, orderBy: { createdAt: 'desc' } }
    }
  });
  if (!post) return json({ error: 'Not found' }, 404);
  return json({ post });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  const body = await req.json();
  const parsed = postCreateSchema.partial().safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);
  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing || existing.authorId !== me.id) return json({ error: 'Forbidden' }, 403);
  const post = await prisma.post.update({ where: { id: params.id }, data: {
    content: parsed.data.content ?? undefined,
    imageUrl: parsed.data.image_url ?? undefined,
    category: parsed.data.category ?? undefined
  }});
  return json({ post });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await requireUser(req);
  if (!me) return json({ error: 'Unauthorized' }, 401);
  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing || existing.authorId !== me.id) return json({ error: 'Forbidden' }, 403);
  await prisma.post.delete({ where: { id: params.id } });
  return json({ message: 'deleted' });
}
