import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { Resource } from '@/models';
import { ResourceCard } from '@/components/public/ResourceCard';
import { Shield, BookOpen } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Executive Whitepapers & Benchmark Reports | THEREALCISO',
  description: 'Download authoritative research reports, technical compliance blueprints, and CISO playbooks on DPDP Act, Zero Trust, and Ransomware defense.',
};

export default async function ResourcesPage() {
  await connectDB();

  // Notice: fileUrl is NOT selected (select: false on schema) - Requirement 6
  const resources = await Resource.find().sort({ downloadsCount: -1 }).lean();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#0A2540] text-white rounded-lg p-6 sm:p-10 border border-slate-700 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Executive Intelligence Library
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif-headline leading-tight">
            Research Reports, Technical Frameworks & CISO Playbooks
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 pt-1 leading-relaxed">
            Data-driven research from the THEREALCISO Threat Intelligence Lab and partner institutions to empower informed architectural and governance decisions.
          </p>
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <ResourceCard
            key={res._id?.toString()}
            resource={{
              _id: res._id.toString(),
              title: res.title,
              slug: res.slug,
              type: res.type,
              description: res.description,
              coverImage: res.coverImage,
              authorOrPublisher: res.authorOrPublisher,
              pagesCount: res.pagesCount,
              downloadsCount: res.downloadsCount,
            }}
          />
        ))}
      </div>
    </div>
  );
}

