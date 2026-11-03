import type { Metadata } from 'next';
import { Mail, CheckCircle2, Shield } from 'lucide-react';
import { NewsletterBox } from '@/components/public/NewsletterBox';

export const metadata: Metadata = {
  title: 'Subscribe to CISO Executive Briefings | THEREALCISO',
  description: 'Join thousands of senior cybersecurity executives receiving our verified intelligence dispatches on critical vulnerabilities, DPDP directives, and cloud security.',
};

export default function NewsletterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#0E7490] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Mail className="w-4 h-4" />
          The Executive Dispatch
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-headline text-[#0A2540]">
          Direct Threat Intelligence for CISOs & Enterprise Risk Leaders
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Delivered every morning at 07:30 IST. We filter the signal from the noise so you arrive at the boardroom prepared.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <NewsletterBox variant="banner" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
          <Shield className="w-5 h-5 text-[#0E7490]" />
          <h3 className="text-sm font-bold text-[#0A2540]">Zero Sponsored Disguise</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict editorial independence. We do not publish pay-for-play PR or vendor-disguised articles.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-[#0A2540]">Verified Technical Detail</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every CVE advisory includes actionable IoCs, affected firmware ranges, and mitigation steps.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
          <Mail className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-[#0A2540]">One-Click Unsubscribe</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Full compliance with DPDP Act and international data privacy norms. No barriers to opt-out.
          </p>
        </div>
      </div>
    </div>
  );
}

