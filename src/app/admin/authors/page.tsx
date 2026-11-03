import { connectDB } from '@/lib/db';
import { Author } from '@/models';
import { AdminAuthorManager } from '@/components/admin/AdminAuthorManager';

export const revalidate = 0;

export default async function AdminAuthorsPage() {
  await connectDB();
  const authors = await Author.find().sort({ name: 1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Authors &amp; Contributors
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage cybersecurity fellows, investigative reporters, and research contributors
        </p>
      </div>

      <AdminAuthorManager
        initialAuthors={authors.map((a) => ({
          _id: a._id.toString(),
          name: a.name,
          slug: a.slug,
          roleTitle: a.roleTitle,
          bio: a.bio,
          avatar: a.avatar,
          socialLinks: a.socialLinks,
        }))}
      />
    </div>
  );
}

