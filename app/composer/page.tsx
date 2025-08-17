'use client';
import { useState } from 'react';

export default function ComposerPage() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File|undefined>();
  const [msg, setMsg] = useState('');

  return (
    <div className="card space-y-3">
      <h1 className="text-xl font-semibold">Create Post</h1>
      <textarea className="input" rows={4} maxLength={280} placeholder="What's happening?" value={content} onChange={e=>setContent(e.target.value)} />
      <input type="file" accept="image/png,image/jpeg" onChange={e=>setImage(e.target.files?.[0]||undefined)} />
      <button className="btn btn-primary" onClick={async ()=>{
        try {
          let image_url = null;
          if (image) {
            const form = new FormData();
            form.append('file', image);
            const up = await fetch('/api/storage/upload', { method: 'POST', body: form });
            const d = await up.json();
            if (!up.ok) throw new Error(d?.error||'upload failed');
            image_url = d.url;
          }
          const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ content, image_url }) });
          if (!res.ok) throw new Error(await res.text());
          location.href = '/';
        } catch (e:any) { setMsg(String(e.message||e)); }
      }}>Post</button>
      <div className="text-red-600 text-sm">{msg}</div>
    </div>
  );
}
