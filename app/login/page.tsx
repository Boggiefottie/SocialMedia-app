'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  return (
    <div className="card space-y-3">
      <h1 className="text-xl font-semibold">Login</h1>
      <input className="input" placeholder="Email or username" value={id} onChange={e=>setId(e.target.value)} />
      <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn btn-primary" onClick={async ()=>{
        setMsg('');
        const body = id.includes('@') ? { email: id, password } : { username: id, password };
        const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) { setMsg(data?.error || 'Error'); return; }
        document.cookie = `access_token=${data.access}; path=/`;
        document.cookie = `refresh_token=${data.refresh}; path=/`;
        location.href = '/';
      }}>Login</button>
      <div className="text-red-600 text-sm">{msg}</div>
    </div>
  );
}
