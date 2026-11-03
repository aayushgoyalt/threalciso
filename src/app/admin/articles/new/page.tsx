import { connectDB } from '@/lib/db';
import { Category, Author, Tag } from '@/models';
import { ArticleForm } from '@/components/admin/ArticleForm';

export default async function NewArticlePage() {
  await connectDB();

  const [categories, authors, tags] = await Promise.all([
    Category.find().select('name _id').sort({ order: 1 }).lean(),
    Author.find().select('name _id').sort({ name: 1 }).lean(),
    Tag.find().select('name _id').sort({ name: 1 }).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Create New Cybersecurity Dispatch
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Compose investigative reports, advisories, interviews, or executive opinion pieces
        </p>
      </div>

      <ArticleForm
        categories={categories.map((c) => ({ _id: c._id.toString(), name: c.name }))}
        authors={authors.map((a) => ({ _id: a._id.toString(), name: a.name }))}
        tags={tags.map((t) => ({ _id: t._id.toString(), name: t.name }))}
      />
    </div>
  );
}

