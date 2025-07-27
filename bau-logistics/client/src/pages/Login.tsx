import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-4 border rounded">
        <div className="mb-2">
          <label className="block">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} className="border p-1" />
        </div>
        <div className="mb-2">
          <label className="block">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border p-1" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-2 py-1">Login</button>
      </form>
    </div>
  );
}
