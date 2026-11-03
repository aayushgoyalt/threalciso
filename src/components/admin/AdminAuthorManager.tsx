'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface AuthorItem {
  _id: string;
  name: string;
  slug: string;
  roleTitle: string;
  bio: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
}

export function AdminAuthorManager({ initialAuthors }: { initialAuthors: AuthorItem[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, roleTitle, bio, avatar, twitter, linkedin }),
      });
      if (res.ok) {
        setName('');
        setRoleTitle('');
        setBio('');
        setAvatar('');
        setTwitter('');
        setLinkedin('');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || 'Error creating author');
      }
    } catch {
      alert('Network failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Authors List */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Editorial Contributors ({initialAuthors.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialAuthors.map((a) => (
            <div key={a._id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
              {a.avatar ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300" style={{ position: 'relative' }}>
                  <Image src={a.avatar} alt={a.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {a.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{a.name}</h4>
                <p className="text-[11px] text-[#0E7490] font-medium truncate">{a.roleTitle}</p>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{a.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Author Form */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-[#0E7490]" />
          <span>Add New Contributor</span>
        </h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Full Name *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Rajesh Grover"
          />

          <Input
            label="Role / Title *"
            required
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="Senior Threat Intelligence Fellow"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Biography *
            </label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Credentials, background in CERT-In, enterprise experience..."
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
            />
          </div>

          <ImageUploader label="Profile Avatar" value={avatar} onChange={setAvatar} />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Twitter / X"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://x.com/..."
            />
            <Input
              label="LinkedIn"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-[#0A2540] hover:bg-[#123659] text-white py-2 text-xs font-semibold"
          >
            Register Contributor
          </Button>
        </form>
      </div>
    </div>
  );
}

