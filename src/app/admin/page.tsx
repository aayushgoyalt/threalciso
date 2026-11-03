import Link from 'next/link';
import {
  FileText,
  Eye,
  Users,
  Download,
  ArrowRight,
  TrendingUp,
  Clock,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Article, Subscriber, Lead, Message, Event } from '@/models';

export default async function AdminDashboardPage() {
  await connectDB();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalArticles,
    draftArticles,
    totalSubscribers,
    totalLeads,
    totalMessages,
    topArticles,
    recentLeads,
    recentMessages,
  ] = await Promise.all([
    Article.countDocuments(),
    Article.countDocuments({ status: 'draft' }),
    Subscriber.countDocuments({ status: 'active' }),
    Lead.countDocuments(),
    Message.countDocuments({ status: 'unread' }),
    Article.find().sort({ views: -1 }).limit(5).lean(),
    Lead.find().populate('resource', 'title').sort({ createdAt: -1 }).limit(5).lean(),
    Message.find().sort({ createdAt: -1 }).limit(4).lean(),
  ]);

  // Aggregate total views
  const viewsAggregation = await Article.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' } } },
  ]);
  const totalViews = viewsAggregation[0]?.totalViews || 0;

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
            Newsroom Operational Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time content telemetry, executive readership, and inbound inquiries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 bg-[#0A2540] hover:bg-[#123659] text-white text-xs font-semibold rounded shadow-xs transition-colors"
          >
            + Publish Article
          </Link>
          <Link
            href="/admin/events"
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded transition-colors"
          >
            + Add Event
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Articles
            </span>
            <div className="text-2xl font-bold font-serif-headline text-[#0A2540] mt-1">
              {totalArticles}
            </div>
            <span className="text-[11px] text-amber-600 font-medium">
              {draftArticles} drafts pending
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Verified Article Reads
            </span>
            <div className="text-2xl font-bold font-serif-headline text-[#0A2540] mt-1">
              {totalViews.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Bot-filtered &amp; deduped
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Subscribers
            </span>
            <div className="text-2xl font-bold font-serif-headline text-[#0A2540] mt-1">
              {totalSubscribers}
            </div>
            <Link
              href="/admin/subscribers"
              className="text-[11px] text-[#0E7490] hover:underline font-medium"
            >
              Export CSV →
            </Link>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Gated Research Leads
            </span>
            <div className="text-2xl font-bold font-serif-headline text-[#0A2540] mt-1">
              {totalLeads}
            </div>
            <Link
              href="/admin/leads"
              className="text-[11px] text-[#0E7490] hover:underline font-medium"
            >
              Export CSV →
            </Link>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Top Articles + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Top Articles by Views */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0E7490]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A2540]">
                Top Read Intelligence Stories
              </h2>
            </div>
            <Link
              href="/admin/articles"
              className="text-xs text-[#0E7490] hover:underline font-medium"
            >
              All Articles
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {topArticles.map((art) => (
              <div key={art._id?.toString()} className="py-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/articles/${art._id}/edit`}
                    className="text-xs font-bold text-slate-800 hover:text-[#0E7490] block truncate"
                  >
                    {art.title}
                  </Link>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold uppercase ${
                        art.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {art.status}
                    </span>
                    <span>•</span>
                    <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 shrink-0">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{art.views?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Gated Asset Leads */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A2540]">
                Recent Research Leads
              </h2>
            </div>
            <Link href="/admin/leads" className="text-xs text-[#0E7490] hover:underline font-medium">
              View All ({totalLeads})
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead._id?.toString()}
                className="p-3 bg-slate-50 border border-slate-100 rounded text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{lead.fullName}</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {lead.jobTitle} • {lead.companyName}
                </div>
                <div className="text-[10px] text-[#0E7490] truncate font-medium">
                  {(lead.resource as any)?.title || 'Cybersecurity Report'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

