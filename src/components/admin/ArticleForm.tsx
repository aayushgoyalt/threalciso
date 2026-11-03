'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ArticleFormProps {
  initialData?: any;
  categories: Array<{ _id: string; name: string }>;
  authors: Array<{ _id: string; name: string }>;
  tags: Array<{ _id: string; name: string }>;
}

export function ArticleForm({
  initialData,
  categories,
  authors,
  tags,
}: ArticleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?._id);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    coverImageUrl: initialData?.coverImage?.url || '',
    coverImageCaption: initialData?.coverImage?.caption || '',
    categoryId: initialData?.category?._id || initialData?.category || categories[0]?._id || '',
    authorId: initialData?.author?._id || initialData?.author || authors[0]?._id || '',
    tagIds: initialData?.tags?.map((t: any) => t._id || t) || [],
    status: initialData?.status || 'draft',
    publishedAt: initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    severity: initialData?.severity || 'none',
    isFeatured: initialData?.isFeatured || false,
    isTrending: initialData?.isTrending || false,
    metaTitle: initialData?.seo?.metaTitle || '',
    metaDescription: initialData?.seo?.metaDescription || '',
    canonicalUrl: initialData?.seo?.canonicalUrl || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing ? `/api/articles/${initialData._id}` : '/api/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      router.push('/admin/articles');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => {
      const exists = prev.tagIds.includes(tagId);
      return {
        ...prev,
        tagIds: exists ? prev.tagIds.filter((id: string) => id !== tagId) : [...prev.tagIds, tagId],
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0A2540]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Articles</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/articles')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={loading}
            className="bg-[#0A2540] hover:bg-[#123659] text-white font-semibold"
          >
            {isEditing ? 'Save Changes' : 'Publish / Schedule'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Editor Column */}
        <div className="lg:col-span-8 space-y-6">
          <Input
            label="Article Headline *"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="CERT-In Issues Urgent High-Severity Advisory On..."
            className="text-base font-bold"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Deck / Executive Summary *
            </label>
            <textarea
              required
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="A concise 2-sentence executive summary detailing the threat vector, affected systems, and impact..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Article Content (Rich Text) *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
            />
          </div>

          {/* SEO Metadata Group */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Search Engine Optimization (SEO) &amp; Open Graph
            </h3>
            <Input
              label="Meta Title (Optional override)"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="Leave blank to use headline"
            />
            <Input
              label="Meta Description (Optional override)"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="Leave blank to use summary deck"
            />
          </div>
        </div>

        {/* Sidebar Metadata Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Status Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Publishing Controls
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Workflow Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              >
                <option value="draft">Draft (Work in Progress)</option>
                <option value="scheduled">Scheduled (Auto-Publish at Date)</option>
                <option value="published">Published (Live to Audience)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Publish Date &amp; Time (IST)
              </label>
              <input
                type="datetime-local"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Articles with future dates remain hidden from public feed until the target time elapses (pull-based scheduling).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Severity Rating
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              >
                <option value="none">None (Standard Analysis)</option>
                <option value="low">Low Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="high">High Severity</option>
                <option value="critical">Critical Advisory</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-[#0A2540]"
                />
                <span>Feature in Primary Hero Slot</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isTrending}
                  onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                  className="rounded text-[#0A2540]"
                />
                <span>Promote in Trending Stream</span>
              </label>
            </div>
          </div>

          {/* Cover Media Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Featured Cover Image
            </h3>
            <ImageUploader
              value={formData.coverImageUrl}
              onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
            />
            <Input
              label="Image Caption / Source"
              value={formData.coverImageCaption}
              onChange={(e) => setFormData({ ...formData, coverImageCaption: e.target.value })}
              placeholder="e.g. Threat telemetry graph courtesy CERT-In"
            />
          </div>

          {/* Taxonomy & Author Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Taxonomy &amp; Contributor
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Vertical *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Byline Contributor *
              </label>
              <select
                required
                value={formData.authorId}
                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              >
                {authors.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Topic Tags
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded bg-slate-50">
                {tags.map((t) => {
                  const isSelected = formData.tagIds.includes(t._id);
                  return (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => handleTagToggle(t._id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#0A2540] text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

