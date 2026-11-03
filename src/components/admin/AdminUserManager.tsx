'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  bio?: string;
  createdAt: string;
}

export function AdminUserManager({ initialUsers }: { initialUsers: UserItem[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'editor' | 'admin'>('editor');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, bio }),
      });

      const data = await res.json();
      if (res.ok) {
        setName('');
        setEmail('');
        setPassword('');
        setBio('');
        router.refresh();
      } else {
        alert(data.message || 'Error creating user');
      }
    } catch {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Users List */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Registered Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialUsers.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{u.name}</div>
                  <div className="text-[11px] text-slate-500">{u.email}</div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                      u.role === 'admin'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register Staff Form */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
          <UserPlus className="w-4 h-4 text-[#0E7490]" />
          <span>Provision Staff Account</span>
        </h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Full Name *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ananya Roy"
          />

          <Input
            label="Corporate Email *"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ananya@therealciso.in"
          />

          <Input
            label="Initial Password *"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Privilege Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
            >
              <option value="editor">Editor (Write &amp; Publish Articles)</option>
              <option value="admin">Admin (Full System Control)</option>
            </select>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-[#0A2540] hover:bg-[#123659] text-white py-2 text-xs font-semibold"
          >
            Create Staff Account
          </Button>
        </form>
      </div>
    </div>
  );
}

