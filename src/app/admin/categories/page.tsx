import { connectDB } from '@/lib/db';
import { Category } from '@/models';
import { AdminCategoryManager } from '@/components/admin/AdminCategoryManager';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  await connectDB();
  const categories = await Category.find().sort({ order: 1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Verticals &amp; Categories
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Organize editorial streams across cybersecurity topics and regulatory domains
        </p>
      </div>

      <AdminCategoryManager
        initialCategories={categories.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          description: c.description,
          order: c.order,
          colorHex: c.colorHex,
        }))}
      />
    </div>
  );
}

