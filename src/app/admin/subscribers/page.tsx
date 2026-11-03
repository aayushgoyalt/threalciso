import { Download, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Subscriber } from '@/models';

export const revalidate = 0;

export default async function AdminSubscribersPage() {
  await connectDB();
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active and past recipients of the THEREALCISO daily and weekly executive briefing
          </p>
        </div>

        <a
          href="/api/admin/export/subscribers"
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export All Subscribers (CSV)</span>
        </a>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Corporate Email</th>
              <th className="py-3 px-4">Cadence</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Subscribed At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscribers.map((sub) => (
              <tr key={sub._id.toString()} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-medium text-slate-800">{sub.email}</td>
                <td className="py-3 px-4 uppercase text-[11px] font-semibold text-slate-600">
                  {sub.frequency}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                      sub.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {sub.status === 'active' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-400" />
                    )}
                    {sub.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

