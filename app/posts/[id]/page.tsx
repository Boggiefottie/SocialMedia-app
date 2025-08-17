'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/http';
import { useParams } from 'next/navigation';

export default function PostDetail() {
  const params = useParams();
  const id = params?.id as string;
  const { data, mutate } = useSWR<any>(`/api/posts/${id}`, apiFetch);
  const [text, setText] = useState('');

  if (!data) return <div>Loading...</div>;
  const p = data.post;
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="text-sm text-gray-500">@{p.author.username} • {new Date(p.createdAt).toLocaleString()}</div>
        <p className="my-2">{p.content}</p>
        {p.imageUrl && <img src={p.imageUrl} className="rounded-xl max-h-80" />}
      </div>
      <div className="card space-y-2">
        <h2 className="font-semibold">Comments</h2>
        <div className="flex gap-2">
          <input className="input" placeholder="Write a comment..." value={text} onChange={e=>setText(e.target.value)} />
          <button className="btn btn-primary" onClick={async ()=>{
            await apiFetch(`/api/posts/${id}/comments`, { method:'POST', body: JSON.stringify({ content: text }) });
            setText(''); mutate();
          }}>Send</button>
        </div>
        <div className="divide-y">
          {p.comments.map((c:any)=>(
            <div key={c.id} className="py-2 text-sm">
              <span className="font-medium">@{c.author.username}</span> {c.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
