import { connectDB } from '@/lib/db';
import { Resource } from '@/models';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export const revalidate = 0;

export default async function AdminResourcesPage() {
  await connectDB();
  // In admin context, select fileUrl so editors can review it
  const resources = await Resource.find().select('+fileUrl').sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Gated Resources &amp; Whitepapers
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage research reports, playbooks, and lead generation documents
        </p>
      </div>

      <AdminResourceManager
        initialResources={resources.map((r) => ({
          _id: r._id.toString(),
          title: r.title,
          slug: r.slug,
          type: r.type,
          description: r.description,
          fileUrl: r.fileUrl,
          authorOrPublisher: r.authorOrPublisher,
          pagesCount: r.pagesCount,
          downloadsCount: r.downloadsCount,
          coverImage: r.coverImage,
        }))}
      />
    </div>
  );
}

