import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { Category, Article } from '@/models';
import { ArticleCard } from '@/components/public/ArticleCard';

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return { title: 'Category Not Found | THEREALCISO' };

  return {
    title: `${category.name} | THEREALCISO Intelligence`,
    description: category.description || `Read latest cybersecurity intelligence and news in ${category.name}.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageStr = '1', sort = 'latest' } = await searchParams;

  const page = Math.max(1, parseInt(pageStr, 10));
  const limit = 9;

  await connectDB();

  const category = await Category.findOne({ slug }).lean();
  if (!category) notFound();

  // Public query filter enforcing scheduled publishing
  const filter = Article.getPublicFilter({ category: category._id });

  let sortCriteria: Record<string, 1 | -1> = { publishedAt: -1 };
  if (sort === 'views') {
    sortCriteria = { views: -1 };
  }

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .populate('category', 'name slug colorHex')
      .populate('author', 'name slug avatar')
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Article.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.colorHex || '#0284c7' }}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Intelligence Vertical
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-headline text-[#0A2540]">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-sm text-slate-600 max-w-2xl mt-2 leading-relaxed">
            {category.description}
          </p>
        )}

        {/* Sort & Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Showing <strong>{articles.length}</strong> of <strong>{total}</strong> verified stories
          </span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <Link
              href={`/category/${slug}?sort=latest`}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                sort === 'latest'
                  ? 'bg-[#0A2540] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Latest
            </Link>
            <Link
              href={`/category/${slug}?sort=views`}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                sort === 'views'
                  ? 'bg-[#0A2540] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Most Read
            </Link>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          <p>No articles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id?.toString()} article={article as any} variant="standard" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {page > 1 && (
            <Link
              href={`/category/${slug}?page=${page - 1}&sort=${sort}`}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
            >
              ← Previous
            </Link>
          )}
          <span className="text-xs text-slate-500 px-3">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/category/${slug}?page=${page + 1}&sort=${sort}`}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

