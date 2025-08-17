'use client';

import useSWR from 'swr';
import { apiFetch } from '@/lib/http';

export default function AdminPage() {
  const { data: stats } = useSWR<any>('/api/admin/stats', apiFetch);
  const users = useSWR<any[]>('/api/admin/users', apiFetch);

  return (
    <div className="space-y-4">
      {/* Stats card */}
      <div className="card">
        <h1 className="text-xl font-semibold">Admin</h1>
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(stats, null, 2)}
        </pre>
      </div>

      {/* Users card */}
      <div className="card">
        <h2 className="font-semibold mb-2">Users</h2>
        {!users.data ? (
          'Loading...'
        ) : (
          users.data.map((u: any) => (
            <div
              key={u.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div>
                @{u.username ?? u.email} ({u.email})
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await apiFetch(`/api/admin/users/${u.id}/deactivate`, {
                    method: 'POST',
                  });
                  users.mutate(); // refresh user list
                }}
              >
                <button
                  type="submit"
                  className="btn"
                  disabled={!u.isActive}
                >
                  {u.isActive ? 'Deactivate' : 'Deactivated'}
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
