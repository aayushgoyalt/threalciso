import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Clock, Calendar, ShieldCheck, ArrowLeft } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Article, IArticle, IAuthor, ICategory, ITag } from '@/models';
import { Badge } from '@/components/ui/Badge';
import { ShareButtons } from '@/components/public/ShareButtons';
import { ViewCounter } from '@/components/public/ViewCounter';
import { ArticleCard } from '@/components/public/ArticleCard';
import { NewsletterBox } from '@/components/public/NewsletterBox';

export const revalidate = 60;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();

  const article = await Article.findOne(Article.getPublicFilter({ slug }))
    .populate('category', 'name')
    .lean();

  if (!article) {
    return { title: 'Article Not Found | THEREALCISO' };
  }

  const title = article.seo?.metaTitle || `${article.title} | THEREALCISO`;
  const description = article.seo?.metaDescription || article.summary;
  const ogImage = article.seo?.ogImage || article.coverImage?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: new Date(article.publishedAt).toISOString(),
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  await connectDB();

  // Enforces status=published AND publishedAt <= now (Requirement 2)
  const article = await Article.findOne(Article.getPublicFilter({ slug }))
    .populate('category', 'name slug colorHex')
    .populate('author', 'name slug avatar roleTitle bio socialLinks')
    .populate('tags', 'name slug')
    .lean();

  if (!article) {
    notFound();
  }

  // Fetch related articles by category or tags
  const relatedArticles = await Article.find({
    ...Article.getPublicFilter({
      _id: { $ne: article._id },
      $or: [
        { category: (article.category as any)?._id },
        { tags: { $in: article.tags?.map((t: any) => t._id) || [] } },
      ],
    }),
  })
    .populate('category', 'name slug')
    .populate('author', 'name slug')
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const category = article.category as unknown as ICategory;
  const author = article.author as unknown as IAuthor;
  const tags = (article.tags || []) as unknown as ITag[];

  const currentUrl = `${process.env.NEXTAUTH_URL || 'https://therealciso.in'}/articles/${article.slug}`;

  // JSON-LD NewsArticle Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [article.coverImage?.url],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt || article.publishedAt).toISOString(),
    author: [
      {
        '@type': 'Person',
        name: author?.name || 'THEREALCISO Editorial Staff',
        jobTitle: author?.roleTitle || 'Cybersecurity Analyst',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'THEREALCISO',
      logo: {
        '@type': 'ImageObject',
        url: 'https://therealciso.in/favicon.ico',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  };

  return (
    <>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb Back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0A2540] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Briefings</span>
          </Link>

          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-xs font-bold uppercase tracking-wider text-[#0E7490] hover:underline"
            >
              {category.name}
            </Link>
          )}
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {article.severity && article.severity !== 'none' && (
              <Badge severity={article.severity} size="md">
                {article.severity} Severity
              </Badge>
            )}
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">{publishedDate}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-headline text-[#0A2540] leading-tight tracking-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-serif-headline leading-relaxed italic border-l-2 border-slate-300 pl-4 py-1">
            {article.summary}
          </p>

          {/* Author Byline & Live View Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              {author?.avatar && (
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0" style={{ position: 'relative', width: 44, height: 44 }}>
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <Link
                  href={`/authors/${author?.slug}`}
                  className="text-sm font-bold text-slate-900 hover:text-[#0E7490] transition-colors"
                >
                  {author?.name || 'THEREALCISO Staff'}
                </Link>
                <p className="text-xs text-slate-500">{author?.roleTitle || 'Threat Intelligence Analyst'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Dynamic View Counter with bot filtering and deduplication */}
              <ViewCounter slug={article.slug} initialViews={article.views} />
              <ShareButtons title={article.title} url={currentUrl} />
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage?.url && (
          <figure className="mb-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
            <div className="relative aspect-video w-full" style={{ position: 'relative', minHeight: 300 }}>
              <Image
                src={article.coverImage.url}
                alt={article.coverImage.alt || article.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
            {article.coverImage.caption && (
              <figcaption className="p-3 text-xs text-slate-500 bg-white border-t border-slate-100 text-center italic">
                {article.coverImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Body Content (Sanitized Rich Text) */}
        <div
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                Tags:
              </span>
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        {author && (
          <div className="mt-8 p-6 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row gap-4 items-start shadow-xs">
            {author.avatar && (
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200" style={{ position: 'relative', width: 56, height: 56 }}>
                <Image src={author.avatar} alt={author.name} fill sizes="56px" className="object-cover" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0E7490]" />
                <h3 className="text-base font-bold text-[#0A2540]">{author.name}</h3>
              </div>
              <p className="text-xs text-slate-500 mb-2 font-medium">{author.roleTitle}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{author.bio}</p>
              <div className="mt-3">
                <Link
                  href={`/authors/${author.slug}`}
                  className="text-xs font-semibold text-[#0E7490] hover:underline"
                >
                  Read all investigations by {author.name} →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter In-Article Box */}
        <div className="mt-10">
          <NewsletterBox variant="inline" />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-slate-200">
            <h3 className="text-lg font-bold font-serif-headline text-[#0A2540] mb-6">
              Related Cybersecurity Intelligence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel._id?.toString()} article={rel as any} variant="standard" />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

