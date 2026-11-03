'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface ResourceItem {
  _id: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  fileUrl: string;
  authorOrPublisher: string;
  pagesCount: number;
  downloadsCount: number;
  coverImage?: string;
}

export function AdminResourceManager({
  initialResources,
}: {
  initialResources: ResourceItem[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('whitepaper');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [authorOrPublisher, setAuthorOrPublisher] = useState('THEREALCISO Lab');
  const [pagesCount, setPagesCount] = useState(24);
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          description,
          fileUrl,
          authorOrPublisher,
          pagesCount: Number(pagesCount),
          coverImage,
        }),
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setFileUrl('');
        setCoverImage('');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || 'Error creating resource');
      }
    } catch {
      alert('Network failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Resource List */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Document Title</th>
              <th className="py-3 px-4">Publisher / Type</th>
              <th className="py-3 px-4">Pages</th>
              <th className="py-3 px-4">Downloads</th>
              <th className="py-3 px-4 text-right">Protected Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialResources.map((res) => (
              <tr key={res._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                  {res.title}
                </td>
                <td className="py-3 px-4">
                  <div className="text-slate-700 font-medium">{res.authorOrPublisher}</div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {res.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 font-mono">{res.pagesCount}p</td>
                <td className="py-3 px-4 text-slate-600 font-semibold font-mono">
                  {res.downloadsCount.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                  {res.fileUrl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Resource Form */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#0E7490]" />
          <span>Upload Gated Asset</span>
        </h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Title *"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="2026 State of Cybersecurity..."
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              >
                <option value="whitepaper">Whitepaper</option>
                <option value="report">Benchmark Report</option>
                <option value="playbook">CISO Playbook</option>
                <option value="survey">Industry Survey</option>
              </select>
            </div>
            <Input
              label="Pages Count"
              type="number"
              value={pagesCount}
              onChange={(e) => setPagesCount(Number(e.target.value))}
            />
          </div>

          <Input
            label="Author / Publisher"
            value={authorOrPublisher}
            onChange={(e) => setAuthorOrPublisher(e.target.value)}
            placeholder="THEREALCISO Threat Lab"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Executive summary of research findings..."
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
            />
          </div>

          <Input
            label="Secure Document File Path / URL *"
            required
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="/downloads/sample-report.pdf"
            helperText="Hidden from public API. Served via short-lived signed tokens."
          />

          <ImageUploader label="Cover Image" value={coverImage} onChange={setCoverImage} />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-[#0A2540] hover:bg-[#123659] text-white py-2 text-xs font-semibold"
          >
            Create Gated Asset
          </Button>
        </form>
      </div>
    </div>
  );
}

