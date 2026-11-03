'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TagItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export function AdminTagManager({ initialTags }: { initialTags: TagItem[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setName('');
        setDescription('');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || 'Error creating tag');
      }
    } catch {
      alert('Network failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Tag List */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
          All Active Tags ({initialTags.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {initialTags.map((t) => (
            <div
              key={t._id}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 flex items-center gap-1.5"
            >
              <TagIcon className="w-3 h-3 text-[#0E7490]" />
              <span className="font-semibold">#{t.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({t.slug})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Tag Form */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 mb-4">
          Add New Tag
        </h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Tag Name *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Zero Trust"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tag scope..."
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
            />
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-[#0A2540] hover:bg-[#123659] text-white py-2 text-xs font-semibold"
          >
            Create Tag
          </Button>
        </form>
      </div>
    </div>
  );
}

