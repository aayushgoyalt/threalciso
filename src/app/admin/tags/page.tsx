import { connectDB } from '@/lib/db';
import { Tag } from '@/models';
import { AdminTagManager } from '@/components/admin/AdminTagManager';

export const revalidate = 0;

export default async function AdminTagsPage() {
  await connectDB();
  const tags = await Tag.find().sort({ name: 1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Topic Tags
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage granular keywords for threat vectors, regulations, and technologies
        </p>
      </div>

      <AdminTagManager
        initialTags={tags.map((t) => ({
          _id: t._id.toString(),
          name: t.name,
          slug: t.slug,
          description: t.description,
        }))}
      />
    </div>
  );
}

