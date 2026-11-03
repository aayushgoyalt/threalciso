import Link from 'next/link';
import { Download, Users, Mail, Building, Phone } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Lead } from '@/models';

export const revalidate = 0;

export default async function AdminLeadsPage() {
  await connectDB();
  const leads = await Lead.find().populate('resource', 'title').sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
            Gated Research Leads
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise executives who requested whitepapers and benchmark reports
          </p>
        </div>

        <a
          href="/api/admin/export/leads"
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export All Leads (CSV)</span>
        </a>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Executive Name &amp; Email</th>
                <th className="py-3 px-4">Title &amp; Company</th>
                <th className="py-3 px-4">Org Size</th>
                <th className="py-3 px-4">Resource Requested</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No leads collected yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id.toString()} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{lead.fullName}</div>
                      <div className="text-[11px] text-slate-500">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {lead.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{lead.jobTitle}</div>
                      <div className="text-[11px] text-slate-500">{lead.companyName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {lead.companySize || '—'}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#0E7490] max-w-xs truncate">
                      {(lead.resource as any)?.title || 'Cybersecurity Report'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

