import Link from 'next/link';
import { Search as SearchIcon, Filter, AlertCircle } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Article, Category } from '@/models';
import { ArticleCard } from '@/components/public/ArticleCard';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    severity?: string;
    date?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '', category = '', severity = '', date = '' } = await searchParams;

  await connectDB();

  const categories = await Category.find().sort({ order: 1 }).lean();

  let filter = Article.getPublicFilter();

  if (q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  if (category) {
    const matchedCat = categories.find((c) => c.slug === category);
    if (matchedCat) {
      filter.category = matchedCat._id;
    }
  }

  if (severity && severity !== 'all') {
    filter.severity = severity;
  }

  if (date === '7d') {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    filter.publishedAt = {
      ...(typeof filter.publishedAt === 'object' && filter.publishedAt !== null ? (filter.publishedAt as Record<string, unknown>) : {}),
      $gte: sevenDaysAgo,
    };
  } else if (date === '30d') {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    filter.publishedAt = {
      ...(typeof filter.publishedAt === 'object' && filter.publishedAt !== null ? (filter.publishedAt as Record<string, unknown>) : {}),
      $gte: thirtyDaysAgo,
    };
  }

  let articles: any[] = [];
  if (q.trim() || category || severity || date) {
    articles = await Article.find(filter)
      .populate('category', 'name slug colorHex')
      .populate('author', 'name slug avatar')
      .sort({ publishedAt: -1 })
      .limit(24)
      .lean();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Search Header Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540] mb-4">
          Search Cybersecurity Intelligence Archive
        </h1>

        <form method="GET" action="/search" className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by keywords, CVE, DPDP, ransomware, company name..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540] transition-all"
            />
            <SearchIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Filter className="w-3.5 h-3.5 text-[#0E7490]" />
              <span>Refine:</span>
            </div>

            {/* Category Dropdown */}
            <select
              name="category"
              defaultValue={category}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#0A2540]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Severity Filter */}
            <select
              name="severity"
              defaultValue={severity}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#0A2540]"
            >
              <option value="all">Any Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Date Filter */}
            <select
              name="date"
              defaultValue={date}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#0A2540]"
            >
              <option value="">Any Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#123659] rounded transition-colors ml-auto"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            {q || category || severity || date ? (
              <span>
                Search Results ({articles.length} stories matched)
              </span>
            ) : (
              <span>Recent Dispatches</span>
            )}
          </h2>
          {(q || category || severity || date) && (
            <Link
              href="/search"
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Clear filters
            </Link>
          )}
        </div>

        {articles.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700">No stories matched your criteria.</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your query or resetting the filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id?.toString()} article={article as any} variant="standard" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
