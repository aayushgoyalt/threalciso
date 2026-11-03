import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import { Article, Category, Tag, Author } from '@/models';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://therealciso.in';

  await connectDB();

  // Public articles
  const articles = await Article.find(Article.getPublicFilter())
    .select('slug updatedAt publishedAt')
    .limit(1000)
    .lean();

  const [categories, tags, authors] = await Promise.all([
    Category.find().select('slug updatedAt').lean(),
    Tag.find().select('slug updatedAt').lean(),
    Author.find().select('slug updatedAt').lean(),
  ]);

  const articleEntries: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/articles/${art.slug}`,
    lastModified: new Date(art.updatedAt || art.publishedAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(cat.updatedAt || Date.now()),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${baseUrl}/tag/${t.slug}`,
    lastModified: new Date(t.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  const authorEntries: MetadataRoute.Sitemap = authors.map((a) => ({
    url: `${baseUrl}/authors/${a.slug}`,
    lastModified: new Date(a.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/newsletter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/advertise`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  return [...staticEntries, ...articleEntries, ...categoryEntries, ...tagEntries, ...authorEntries];
}

