import { connectDB } from '@/lib/db';
import { Event } from '@/models';
import { AdminEventManager } from '@/components/admin/AdminEventManager';

export const revalidate = 0;

export default async function AdminEventsPage() {
  await connectDB();
  const events = await Event.find().sort({ startDate: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Events &amp; Webinars Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Schedule upcoming summits, virtual webinars, and executive roundtables
        </p>
      </div>

      <AdminEventManager
        initialEvents={events.map((e) => ({
          _id: e._id.toString(),
          title: e.title,
          slug: e.slug,
          type: e.type,
          startDate: e.startDate.toISOString(),
          endDate: e.endDate ? e.endDate.toISOString() : undefined,
          location: e.location,
          description: e.description,
          registrationUrl: e.registrationUrl,
          coverImage: e.coverImage,
        }))}
      />
    </div>
  );
}

