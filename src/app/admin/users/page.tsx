import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { getSession } from '@/lib/auth';
import { AdminUserManager } from '@/components/admin/AdminUserManager';

export const revalidate = 0;

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/admin');
  }

  await connectDB();
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Staff &amp; Role-Based Access Control
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage editorial privileges and system administrators (Admin only)
        </p>
      </div>

      <AdminUserManager
        initialUsers={users.map((u) => ({
          _id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          bio: u.bio,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}

