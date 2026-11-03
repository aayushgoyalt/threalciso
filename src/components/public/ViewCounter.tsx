'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
  initialViews: number;
}

export function ViewCounter({ slug, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState<number>(initialViews);

  useEffect(() => {
    let isMounted = true;

    async function recordView() {
      try {
        const res = await fetch(`/api/articles/${slug}/view`, {
          method: 'POST',
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.views === 'number') {
            setViews(data.views);
          }
        }
      } catch {
        // Silently tolerate network failures
      }
    }

    recordView();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
      <Eye className="w-4 h-4 text-slate-400" />
      <span>{views.toLocaleString()} views</span>
    </span>
  );
}

