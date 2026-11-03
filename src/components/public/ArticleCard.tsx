import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';
import { Badge, SeverityType } from '@/components/ui/Badge';

interface ArticleCardProps {
  article: {
    _id?: string;
    title: string;
    slug: string;
    summary: string;
    coverImage?: {
      url: string;
      caption?: string;
      alt?: string;
    };
    category?: {
      name: string;
      slug: string;
      colorHex?: string;
    };
    author?: {
      name: string;
      slug: string;
      avatar?: string;
      roleTitle?: string;
    };
    publishedAt: string | Date;
    readTime: number;
    views?: number;
    severity?: SeverityType;
    isFeatured?: boolean;
    isTrending?: boolean;
  };
  variant?: 'featured' | 'standard' | 'compact' | 'horizontal';
}

export function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const categoryName = article.category?.name || 'Cybersecurity';
  const categorySlug = article.category?.slug || 'news';
  const authorName = article.author?.name || 'Editorial Staff';
  const authorSlug = article.author?.slug || '';
  const coverUrl =
    article.coverImage?.url ||
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';

  if (variant === 'featured') {
    return (
      <article className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 relative aspect-[16/10] w-full lg:aspect-auto min-h-[300px] overflow-hidden bg-slate-100" style={{ position: 'relative', minHeight: 300 }}>
            <Image
              src={coverUrl}
              alt={article.coverImage?.alt || article.title}
              fill
              priority
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Link
                href={`/category/${categorySlug}`}
                className="px-2.5 py-1 text-xs font-bold tracking-wider text-white bg-[#0A2540]/90 backdrop-blur-xs rounded uppercase hover:bg-[#0A2540]"
              >
                {categoryName}
              </Link>
              {article.severity && article.severity !== 'none' && (
                <Badge severity={article.severity}>{article.severity}</Badge>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="font-semibold text-rose-700 tracking-wider uppercase text-[11px]">
                  Featured Story
                </span>
                <span>•</span>
                <span>{publishedDate}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime} min read
                </span>
              </div>

              <Link href={`/articles/${article.slug}`}>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-headline text-[#0A2540] group-hover:text-[#0E7490] transition-colors leading-tight mb-3">
                  {article.title}
                </h2>
              </Link>

              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                {article.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                {article.author?.avatar && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0" style={{ position: 'relative', width: 32, height: 32 }}>
                    <Image
                      src={article.author.avatar}
                      alt={authorName}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <Link
                    href={`/authors/${authorSlug}`}
                    className="text-xs font-semibold text-slate-800 hover:text-[#0E7490] transition-colors block"
                  >
                    {authorName}
                  </Link>
                  <span className="text-[11px] text-slate-500 line-clamp-1">
                    {article.author?.roleTitle || 'Threat Analyst'}
                  </span>
                </div>
              </div>

              {typeof article.views === 'number' && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  {article.views.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex flex-col sm:flex-row gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:shadow-xs transition-shadow">
        <div className="relative w-full sm:w-44 h-32 shrink-0 rounded overflow-hidden bg-slate-100" style={{ position: 'relative', minHeight: 128 }}>
          <Image
            src={coverUrl}
            alt={article.coverImage?.alt || article.title}
            fill
            sizes="(max-width: 640px) 100vw, 180px"
            className="object-cover group-hover:scale-102 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Link
                href={`/category/${categorySlug}`}
                className="text-[11px] font-bold text-[#0E7490] hover:underline uppercase tracking-wider"
              >
                {categoryName}
              </Link>
              {article.severity && article.severity !== 'none' && (
                <Badge severity={article.severity} size="sm">
                  {article.severity}
                </Badge>
              )}
            </div>
            <Link href={`/articles/${article.slug}`}>
              <h3 className="text-base font-bold font-serif-headline text-[#0A2540] group-hover:text-[#0E7490] transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {article.summary}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            <span>By {authorName}</span>
            <div className="flex items-center gap-2">
              <span>{publishedDate}</span>
              <span>•</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group border-b border-slate-100 py-3.5 last:border-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/category/${categorySlug}`}
            className="text-[10px] font-bold text-[#0E7490] uppercase tracking-wider hover:underline"
          >
            {categoryName}
          </Link>
          {article.severity && article.severity !== 'none' && (
            <Badge severity={article.severity} size="sm">
              {article.severity}
            </Badge>
          )}
        </div>
        <Link href={`/articles/${article.slug}`}>
          <h4 className="text-sm font-bold font-serif-headline text-[#0A2540] group-hover:text-[#0E7490] transition-colors leading-snug line-clamp-2">
            {article.title}
          </h4>
        </Link>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>{publishedDate}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}m
          </span>
        </div>
      </article>
    );
  }

  // Standard vertical card
  return (
    <article className="group flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow">
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden" style={{ position: 'relative', minHeight: 180 }}>
        <Image
          src={coverUrl}
          alt={article.coverImage?.alt || article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Link
            href={`/category/${categorySlug}`}
            className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-white bg-[#0A2540]/90 backdrop-blur-xs rounded uppercase hover:bg-[#0A2540]"
          >
            {categoryName}
          </Link>
          {article.severity && article.severity !== 'none' && (
            <Badge severity={article.severity} size="sm">
              {article.severity}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
            <span>{publishedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min read
            </span>
          </div>

          <Link href={`/articles/${article.slug}`}>
            <h3 className="text-lg font-bold font-serif-headline text-[#0A2540] group-hover:text-[#0E7490] transition-colors leading-snug mb-2 line-clamp-2">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
            {article.summary}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <Link
            href={`/authors/${authorSlug}`}
            className="font-medium text-slate-700 hover:text-[#0E7490] transition-colors truncate max-w-[140px]"
          >
            By {authorName}
          </Link>

          {typeof article.views === 'number' && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Eye className="w-3 h-3" />
              {article.views.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

