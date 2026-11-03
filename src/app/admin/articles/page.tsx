import Link from 'next/link';
import { Eye, Edit, Trash2, ExternalLink, Plus, Filter } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Article, Category } from '@/models';
import { Badge } from '@/components/ui/Badge';
import { AdminArticleDeleteButton } from '@/components/admin/AdminArticleDeleteButton';

export const revalidate = 0; // Dynamic

interface AdminArticlesPageProps {
  searchParams: Promise<{ status?: string; category?: string; q?: string }>;
}

export default async function AdminArticlesPage({ searchParams }: AdminArticlesPageProps) {
  const { status, category, q } = await searchParams;
  await connectDB();

  let filter: Record<string, unknown> = {};
  if (status && status !== 'all') filter.status = status;
  if (category) filter.category = category;
  if (q && q.trim()) {
    filter.title = { $regex: q.trim(), $options: 'i' };
  }

  const [articles, categories] = await Promise.all([
    Article.find(filter)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .lean(),
    Category.find().select('name _id').lean(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
            Article Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, schedule, and curate cybersecurity stories across all verticals
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A2540] hover:bg-[#123659] text-white text-xs font-semibold rounded shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap items-center gap-3 text-xs">
        <form method="GET" action="/admin/articles" className="flex flex-wrap items-center gap-3 w-full">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Filter by title..."
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
          />

          <select
            name="status"
            defaultValue={status || 'all'}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>

          <select
            name="category"
            defaultValue={category || ''}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id.toString()} value={c._id.toString()}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 text-white font-medium rounded hover:bg-slate-700"
          >
            Apply Filters
          </button>

          {(status || category || q) && (
            <Link href="/admin/articles" className="text-xs text-rose-600 hover:underline ml-auto">
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Title &amp; Vertical</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((art) => (
                <tr key={art._id.toString()} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="max-w-md">
                      <Link
                        href={`/admin/articles/${art._id}/edit`}
                        className="font-bold text-slate-900 hover:text-[#0E7490] line-clamp-1"
                      >
                        {art.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>{(art.category as any)?.name}</span>
                        {art.isFeatured && (
                          <span className="text-purple-600 font-semibold">• Featured</span>
                        )}
                        {art.isTrending && (
                          <span className="text-rose-600 font-semibold">• Trending</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {(art.author as any)?.name || 'Staff'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        art.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : art.status === 'scheduled'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {art.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {art.severity && art.severity !== 'none' ? (
                      <Badge severity={art.severity} size="sm">
                        {art.severity}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">
                    {art.views?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(art.publishedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/articles/${art.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-[#0A2540] hover:bg-slate-100 rounded"
                        title="View Live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/articles/${art._id}/edit`}
                        className="p-1.5 text-slate-400 hover:text-[#0E7490] hover:bg-slate-100 rounded"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <AdminArticleDeleteButton articleId={art._id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

