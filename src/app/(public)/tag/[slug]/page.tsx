import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { Tag, Article } from '@/models';
import { ArticleCard } from '@/components/public/ArticleCard';

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const tag = await Tag.findOne({ slug }).lean();
  if (!tag) return { title: 'Tag Not Found | THEREALCISO' };

  return {
    title: `#${tag.name} Articles | THEREALCISO`,
    description: `Browse all cybersecurity intelligence and analysis tagged under ${tag.name}.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  await connectDB();

  const tag = await Tag.findOne({ slug }).lean();
  if (!tag) notFound();

  const filter = Article.getPublicFilter({ tags: tag._id });

  const articles = await Article.find(filter)
    .populate('category', 'name slug colorHex')
    .populate('author', 'name slug avatar')
    .sort({ publishedAt: -1 })
    .lean();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Topic Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-headline text-[#0A2540] mt-1">
          #{tag.name}
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          {articles.length} verified cybersecurity articles indexed under this topic.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          <p>No articles tagged with #{tag.name} yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id?.toString()} article={article as any} variant="standard" />
          ))}
        </div>
      )}
    </div>
  );
}

