import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Article, Category, Author, Tag } from '@/models';
import { ArticleForm } from '@/components/admin/ArticleForm';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  await connectDB();

  const [article, categories, authors, tags] = await Promise.all([
    Article.findById(id).lean(),
    Category.find().select('name _id').sort({ order: 1 }).lean(),
    Author.find().select('name _id').sort({ name: 1 }).lean(),
    Tag.find().select('name _id').sort({ name: 1 }).lean(),
  ]);

  if (!article) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Edit Intelligence Article
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Modify draft or update live published story metadata and body
        </p>
      </div>

      <ArticleForm
        initialData={JSON.parse(JSON.stringify(article))}
        categories={categories.map((c) => ({ _id: c._id.toString(), name: c.name }))}
        authors={authors.map((a) => ({ _id: a._id.toString(), name: a.name }))}
        tags={tags.map((t) => ({ _id: t._id.toString(), name: t.name }))}
      />
    </div>
  );
}

