'use client';
import useSWR from 'swr';
import { apiFetch } from '@/lib/http';
import { useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase';

type Post = {
  id: string; content: string; imageUrl?: string | null;
  createdAt: string; author: { username: string };
  likeCount: number; commentCount: number;
  liked?: boolean;
};

export default function HomePage() {
  const { data, mutate } = useSWR<{ posts: Post[] }>('/api/feed', apiFetch);
  useEffect(() => {
    // Realtime notifications
    const sb = supabaseBrowser();
    const channel = sb.channel('realtime:notifications')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Notification' },
        (payload) => { console.log('Notification:', payload.new); })
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, []);

  if (!data) return <div>Loading...</div>;
  return (
    <div className="space-y-4">
      {data.posts.map(p => (
        <div key={p.id} className="card">
          <div className="text-sm text-gray-500">@{p.author.username} • {new Date(p.createdAt).toLocaleString()}</div>
          <p className="my-2 whitespace-pre-wrap">{p.content}</p>
          {p.imageUrl && <img src={p.imageUrl} alt="" className="rounded-xl max-h-80 w-auto" />}
          <div className="flex gap-3 text-sm mt-3">
            <button className="btn" onClick={async () => {
              if (p.liked) {
                await apiFetch(`/api/posts/${p.id}/like`, { method: 'DELETE' });
              } else {
                await apiFetch(`/api/posts/${p.id}/like`, { method: 'POST' });
              }
              mutate();
            }}>{p.liked ? 'Unlike' : 'Like'} ({p.likeCount})</button>
            <a className="btn" href={`/posts/${p.id}`}>Comments ({p.commentCount})</a>
          </div>
        </div>
      ))}
    </div>
  );
}
