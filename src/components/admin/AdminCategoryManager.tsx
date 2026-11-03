'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  colorHex?: string;
}

export function AdminCategoryManager({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colorHex, setColorHex] = useState('#0284c7');
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, colorHex, order: Number(order) }),
      });
      const data = await res.json();
      if (res.ok) {
        setName('');
        setDescription('');
        router.refresh();
      } else {
        alert(data.message || 'Error creating category');
      }
    } catch {
      alert('Network failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Category List */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Color</th>
              <th className="py-3 px-4">Name &amp; Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50">
                <td className="py-3 px-4">
                  <span
                    className="w-4 h-4 rounded-full inline-block border border-slate-300"
                    style={{ backgroundColor: c.colorHex || '#0284c7' }}
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">/category/{c.slug}</div>
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{c.description || '—'}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{c.order ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Form */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
          <FolderTree className="w-4 h-4 text-[#0E7490]" />
          <span>Add New Category</span>
        </h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Name *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Identity & Access"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Topic summary..."
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Accent Color"
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
            />
            <Input
              label="Sort Order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-[#0A2540] hover:bg-[#123659] text-white py-2 text-xs font-semibold"
          >
            Create Category
          </Button>
        </form>
      </div>
    </div>
  );
}

