import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { requireUser } from '@/app/api/_helpers';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const me = await requireUser(req);
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 });

  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    return NextResponse.json({ error: 'Only PNG/JPEG allowed' }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'Max 2MB' }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const path = `${me.id}/${Date.now()}-${file.name}`;
  const sb = supabaseServer();
  const { data, error } = await sb.storage.from(process.env.SUPABASE_STORAGE_BUCKET!).upload(path, arrayBuffer, {
    contentType: file.type, upsert: false
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data: pub } = sb.storage.from(process.env.SUPABASE_STORAGE_BUCKET!).getPublicUrl(path);
  return NextResponse.json({ url: pub.publicUrl });
}
