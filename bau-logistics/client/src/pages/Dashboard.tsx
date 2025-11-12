import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            navigate('/', { replace: true });
            return;
          }
          const message = await response.json().catch(() => ({ message: 'Unable to load users' }));
          throw new Error(message.message || 'Unable to load users');
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load users');
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">Welcome to Bau Logistics.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Sign out
        </button>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-600">Accounts currently registered in the system.</p>
        </div>
        <div className="px-6 py-4">
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-slate-600">No users found. Seed an admin to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium uppercase tracking-wide text-slate-500">ID</th>
                    <th className="px-3 py-2 text-left font-medium uppercase tracking-wide text-slate-500">Username</th>
                    <th className="px-3 py-2 text-left font-medium uppercase tracking-wide text-slate-500">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="odd:bg-white even:bg-slate-50">
                      <td className="px-3 py-2 font-medium text-slate-700">{user.id}</td>
                      <td className="px-3 py-2 text-slate-700">{user.username}</td>
                      <td className="px-3 py-2 text-slate-700">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
