'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { LeadModal } from '@/components/public/LeadModal';

interface ResourceCardProps {
  resource: {
    _id: string;
    title: string;
    slug: string;
    type: string;
    description: string;
    coverImage: string;
    authorOrPublisher: string;
    pagesCount: number;
    downloadsCount?: number;
  };
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden" style={{ position: 'relative' }}>
            {resource.coverImage ? (
              <Image
                src={resource.coverImage}
                alt={resource.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                <FileText className="w-12 h-12" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-[#0A2540]/90 text-white backdrop-blur-xs">
                {resource.type}
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span>{resource.authorOrPublisher}</span>
              <span>•</span>
              <span>{resource.pagesCount} Pages</span>
            </div>

            <Link href={`/resources/${resource.slug}`}>
              <h3 className="text-base font-bold font-serif-headline text-[#0A2540] hover:text-[#0E7490] transition-colors leading-snug mb-2 line-clamp-2">
                {resource.title}
              </h3>
            </Link>

            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
              {resource.description}
            </p>
          </div>
        </div>

        <div className="p-5 pt-0">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded transition-colors text-white bg-[#0A2540] hover:bg-[#123659]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Executive Report</span>
          </button>
        </div>
      </div>

      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        resource={resource}
      />
    </>
  );
}

