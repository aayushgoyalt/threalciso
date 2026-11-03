import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FileText, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Resource } from '@/models';
import { ResourceLeadForm } from '@/components/public/ResourceLeadForm';

export const revalidate = 60;

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const resource = await Resource.findOne({ slug }).lean();
  if (!resource) return { title: 'Resource Not Found | THEREALCISO' };

  return {
    title: `${resource.title} (${resource.type.toUpperCase()}) | THEREALCISO`,
    description: resource.description,
  };
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const { slug } = await params;
  await connectDB();

  // Notice: fileUrl is NOT selected (Requirement 6)
  const resource = await Resource.findOne({ slug }).lean();
  if (!resource) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0A2540] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Executive Library</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase rounded bg-[#0A2540] text-white">
              {resource.type}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {resource.authorOrPublisher}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif-headline text-[#0A2540] leading-tight">
            {resource.title}
          </h1>

          {resource.coverImage && (
            <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-xs" style={{ position: 'relative' }}>
              <Image
                src={resource.coverImage}
                alt={resource.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold font-serif-headline text-[#0A2540]">
              Executive Summary & Scope
            </h2>
            <p>{resource.description}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#0E7490]" />
              Key Architectural Takeaways Included
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Actionable implementation checklists audited against Indian compliance baselines</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Vendor-neutral evaluation matrices for enterprise IAM, EDR, and SOAR tooling</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Incident response timelines, forensic log schemas, and board briefing decks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Lead Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-sm sticky top-8">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0E7490]">
              <FileText className="w-4 h-4" />
              <span>Gated Asset • {resource.pagesCount} Pages</span>
            </div>
            <h3 className="text-base font-bold font-serif-headline text-[#0A2540] mt-1">
              Request Your Free Copy
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide corporate details below to receive a secure, verified download link.
            </p>
          </div>

          <ResourceLeadForm resourceId={resource._id.toString()} resourceTitle={resource.title} />
        </div>
      </div>
    </div>
  );
}

