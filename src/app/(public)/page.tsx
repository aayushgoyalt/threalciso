import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, Calendar, FileText, ShieldAlert } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Article, Event, Resource, Category } from '@/models';
import { ArticleCard } from '@/components/public/ArticleCard';
import { NewsletterBox } from '@/components/public/NewsletterBox';
import { Badge } from '@/components/ui/Badge';

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  await connectDB();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Requirement 2: filter public queries by status=published AND publishedAt <= now
  const publicFilter = Article.getPublicFilter();

  const [
    featuredArticles,
    trendingArticles,
    latestArticles,
    upcomingEvents,
    featuredResource,
    categories,
  ] = await Promise.all([
    // Hero featured article
    Article.find(Article.getPublicFilter({ isFeatured: true }))
      .populate('category', 'name slug colorHex')
      .populate('author', 'name slug avatar roleTitle')
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean(),

    // Trending articles in last 7 days sorted by views
    Article.find({
      ...publicFilter,
      publishedAt: { $gte: sevenDaysAgo, $lte: now },
    })
      .populate('category', 'name slug colorHex')
      .populate('author', 'name slug avatar')
      .sort({ views: -1 })
      .limit(5)
      .lean(),

    // Latest news stream
    Article.find(publicFilter)
      .populate('category', 'name slug colorHex')
      .populate('author', 'name slug avatar roleTitle')
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean(),

    // Upcoming events derived at query time: startDate > now (Requirement 3)
    Event.find({ startDate: { $gt: now } })
      .sort({ startDate: 1 })
      .limit(3)
      .lean(),

    // Top resource
    Resource.findOne()
      .sort({ downloadsCount: -1 })
      .lean(),

    Category.find().sort({ order: 1 }).lean(),
  ]);

  const heroArticle = featuredArticles[0] || latestArticles[0];
  const secondaryHero = featuredArticles.slice(1, 3);

  // Category specific articles
  const breachesCat = categories.find((c) => c.slug === 'breaches-attacks');
  const threatsCat = categories.find((c) => c.slug === 'threats-vulnerabilities');
  const privacyCat = categories.find((c) => c.slug === 'privacy-compliance');

  const [breachesArticles, threatsArticles, privacyArticles] = await Promise.all([
    breachesCat
      ? Article.find(Article.getPublicFilter({ category: breachesCat._id }))
          .populate('category', 'name slug colorHex')
          .populate('author', 'name slug')
          .sort({ publishedAt: -1 })
          .limit(4)
          .lean()
      : [],
    threatsCat
      ? Article.find(Article.getPublicFilter({ category: threatsCat._id }))
          .populate('category', 'name slug colorHex')
          .populate('author', 'name slug')
          .sort({ publishedAt: -1 })
          .limit(4)
          .lean()
      : [],
    privacyCat
      ? Article.find(Article.getPublicFilter({ category: privacyCat._id }))
          .populate('category', 'name slug colorHex')
          .populate('author', 'name slug')
          .sort({ publishedAt: -1 })
          .limit(4)
          .lean()
      : [],
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      {/* 1. TOP EDITORIAL HERO GRID */}
      {heroArticle && (
        <section aria-label="Lead Story and Highlights">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Primary Hero */}
            <div className="lg:col-span-8 flex flex-col">
              <ArticleCard article={heroArticle as any} variant="featured" />
            </div>

            {/* Trending & Most Read (Last 7 Days) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A2540]">
                      Trending (7 Days)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">By Verified Reads</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {trendingArticles.map((article, idx) => (
                    <div key={article._id?.toString()} className="py-3 flex items-start gap-3 group">
                      <span className="text-xl font-bold font-serif-headline text-slate-300 group-hover:text-[#0E7490] transition-colors leading-none pt-0.5">
                        0{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link href={`/articles/${article.slug}`}>
                          <h4 className="text-xs font-bold font-serif-headline text-slate-800 group-hover:text-[#0E7490] transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span>{(article.category as any)?.name}</span>
                          <span>•</span>
                          <span>{article.views?.toLocaleString()} reads</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-2">
                <Link
                  href="/category/news"
                  className="text-xs font-semibold text-[#0E7490] hover:text-[#0A2540] flex items-center justify-between transition-colors"
                >
                  <span>Explore All Breaking News</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. SECONDARY FEATURED ROW */}
      {secondaryHero.length > 0 && (
        <section aria-label="Key Investigations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryHero.map((art) => (
              <ArticleCard key={art._id?.toString()} article={art as any} variant="horizontal" />
            ))}
          </div>
        </section>
      )}

      {/* 3. LATEST DISPATCHES & EDITORIAL SIDEBAR */}
      <section aria-label="Latest News and Analysis">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column: Latest Dispatches Stream */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#0A2540] pb-2">
              <h2 className="text-lg font-bold font-serif-headline text-[#0A2540] uppercase tracking-wide">
                Latest News & Threat Intel
              </h2>
              <span className="text-xs font-medium text-slate-500">Live Continuous Stream</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latestArticles.slice(0, 6).map((article) => (
                <ArticleCard key={article._id?.toString()} article={article as any} variant="standard" />
              ))}
            </div>
          </div>

          {/* Sidebar Column: Events, Newsletter & Gated Research */}
          <div className="lg:col-span-4 space-y-8">
            {/* Newsletter widget */}
            <NewsletterBox variant="sidebar" />

            {/* Upcoming Executive Webinars & Summits */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0E7490]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
                    Executive Summits & Webinars
                  </h3>
                </div>
                <Link href="/events" className="text-[11px] font-semibold text-[#0E7490] hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((evt) => {
                  const evtDate = new Date(evt.startDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <div key={evt._id?.toString()} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700">
                          {evt.type}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{evtDate}</span>
                      </div>
                      <Link href="/events">
                        <h4 className="text-xs font-bold font-serif-headline text-slate-900 hover:text-[#0E7490] transition-colors leading-snug">
                          {evt.title}
                        </h4>
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{evt.location}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Featured Gated Resource */}
            {featuredResource && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <div className="flex items-center gap-2 text-[#0E7490] text-xs font-bold uppercase tracking-wider mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Featured Intelligence Report</span>
                </div>
                <h4 className="text-sm font-bold font-serif-headline text-[#0A2540] leading-snug">
                  {featuredResource.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 mb-4 line-clamp-3 leading-relaxed">
                  {featuredResource.description}
                </p>
                <Link
                  href={`/resources/${featuredResource.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#123659] rounded transition-colors w-full justify-center"
                >
                  <span>Download Free Copy ({featuredResource.pagesCount}p)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. CATEGORY SPOTLIGHT SECTION: BREACHES & ATTACKS */}
      {breachesArticles.length > 0 && (
        <section aria-label="Breaches and Ransomware">
          <div className="border-t-2 border-rose-600 pt-4 mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h2 className="text-xl font-bold font-serif-headline text-[#0A2540]">
                  Breaches & Ransomware Investigations
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Forensic breakdowns of active corporate compromises and extortion campaigns
              </p>
            </div>
            <Link
              href="/category/breaches-attacks"
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
            >
              <span>More Breaches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {breachesArticles.map((article) => (
              <ArticleCard key={article._id?.toString()} article={article as any} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* 5. CATEGORY SPOTLIGHT SECTION: PRIVACY & DPDP ACT */}
      {privacyArticles.length > 0 && (
        <section aria-label="Privacy and DPDP Act">
          <div className="border-t-2 border-emerald-600 pt-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif-headline text-[#0A2540]">
                DPDP Act, Privacy & Regulatory Compliance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Navigating Data Protection Board directives, consent audits, and statutory compliance
              </p>
            </div>
            <Link
              href="/category/privacy-compliance"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>More Regulatory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {privacyArticles.map((article) => (
              <ArticleCard key={article._id?.toString()} article={article as any} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* 6. FULL-WIDTH NEWSLETTER SUBSCRIPTION CALLOUT */}
      <section aria-label="Executive Briefing Subscription">
        <NewsletterBox variant="banner" />
      </section>
    </div>
  );
}
