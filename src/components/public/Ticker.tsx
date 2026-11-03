import Link from 'next/link';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface TickerProps {
  notice?: string;
  link?: string;
}

export function Ticker({
  notice = 'CRITICAL ALERT: CERT-In issues urgent advisory on active exploitation of enterprise SSL VPN gateways across Indian BFSI networks.',
  link = '/articles/cert-in-issues-high-severity-alert-over-active-zero-day-ssl-vpn',
}: TickerProps) {
  if (!notice) return null;

  return (
    <div className="bg-rose-50 border-b border-rose-200 text-rose-950 py-2 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center gap-1 font-bold text-rose-700 uppercase tracking-wider text-[11px] shrink-0 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Advisory
          </span>
          <p className="truncate font-medium text-slate-800">{notice}</p>
        </div>

        {link && (
          <Link
            href={link}
            className="shrink-0 flex items-center text-xs font-semibold text-rose-800 hover:text-rose-950 underline underline-offset-2 ml-2"
          >
            <span>Read Details</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

