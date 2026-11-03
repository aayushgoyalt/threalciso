import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ShieldCheck, Globe } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Author, Article } from '@/models';
import { ArticleCard } from '@/components/public/ArticleCard';

export const revalidate = 60;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const author = await Author.findOne({ slug }).lean();
  if (!author) return { title: 'Author Not Found | THEREALCISO' };

  return {
    title: `${author.name} (${author.roleTitle}) | THEREALCISO`,
    description: author.bio,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  await connectDB();

  const author = await Author.findOne({ slug }).lean();
  if (!author) notFound();

  const articles = await Article.find(Article.getPublicFilter({ author: author._id }))
    .populate('category', 'name slug colorHex')
    .sort({ publishedAt: -1 })
    .lean();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Author Bio Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
        {author.avatar && (
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border-2 border-slate-200 bg-slate-100" style={{ position: 'relative', width: 112, height: 112 }}>
            <Image src={author.avatar} alt={author.name} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0E7490]" />
                <h1 className="text-2xl sm:text-3xl font-bold font-serif-headline text-[#0A2540]">
                  {author.name}
                </h1>
              </div>
              <p className="text-sm font-semibold text-[#0E7490] mt-0.5">{author.roleTitle}</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {author.socialLinks?.twitter && (
                <a
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-slate-200 rounded text-slate-600 hover:text-[#0A2540] hover:bg-slate-50 transition-colors"
                  aria-label="Twitter Profile"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {author.socialLinks?.linkedin && (
                <a
                  href={author.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-slate-200 rounded text-slate-600 hover:text-[#0A2540] hover:bg-slate-50 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {author.socialLinks?.website && (
                <a
                  href={author.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-slate-200 rounded text-slate-600 hover:text-[#0A2540] hover:bg-slate-50 transition-colors"
                  aria-label="Personal Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">{author.bio}</p>

          <div className="pt-2 text-xs text-slate-500 font-medium">
            <span>{articles.length} Published Intelligence Reports & Commentary</span>
          </div>
        </div>
      </div>

      {/* Articles by this Author */}
      <section>
        <h2 className="text-xl font-bold font-serif-headline text-[#0A2540] border-b border-slate-200 pb-3 mb-6">
          Investigations & Articles by {author.name}
        </h2>

        {articles.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
            <p>No published articles found for this author.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article._id?.toString()}
                article={{ ...article, author } as any}
                variant="standard"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
