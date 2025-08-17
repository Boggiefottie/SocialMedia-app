'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ email:'', username:'', password:'', first_name:'', last_name:'' });
  const [msg, setMsg] = useState('');
  const set = (k:string,v:string)=>setForm(s=>({...s,[k]:v}));
  return (
    <div className="card space-y-3">
      <h1 className="text-xl font-semibold">Register</h1>
      <input className="input" placeholder="Email" onChange={e=>set('email', e.target.value)} />
      <input className="input" placeholder="Username" onChange={e=>set('username', e.target.value)} />
      <input className="input" placeholder="First name" onChange={e=>set('first_name', e.target.value)} />
      <input className="input" placeholder="Last name" onChange={e=>set('last_name', e.target.value)} />
      <input className="input" placeholder="Password" type="password" onChange={e=>set('password', e.target.value)} />
      <button className="btn btn-primary" onClick={async ()=>{
        setMsg('');
        const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(form) });
        const data = await res.json();
        if (!res.ok) { setMsg(data?.error || 'Error'); return; }
        alert('Registered! Check email verification endpoint (simulated token in response).');
        location.href = '/login';
      }}>Create account</button>
      <div className="text-red-600 text-sm">{msg}</div>
    </div>
  );
}
