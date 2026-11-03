import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { SiteSettings } from '@/models';
import { getSession } from '@/lib/auth';
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/admin');
  }

  await connectDB();
  const settings = await SiteSettings.findOne().lean();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Site Settings &amp; Global Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure site name, ticker advisory banner, branding, and social connections (Admin only)
        </p>
      </div>

      <AdminSettingsForm initialSettings={JSON.parse(JSON.stringify(settings || {}))} />
    </div>
  );
}

