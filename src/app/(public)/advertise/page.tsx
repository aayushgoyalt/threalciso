import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, Users, Mail, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Partner & Advertise | THEREALCISO',
  description: 'Connect with 18,000+ validated cybersecurity executives, CISOs, and enterprise IT risk decision-makers across India and APAC.',
};

export default function AdvertisePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="border-b border-slate-200 pb-8 text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#0E7490] uppercase tracking-wider">
          Enterprise Partnerships
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-headline text-[#0A2540]">
          Reach the Highest Concentration of Cybersecurity Decision-Makers in India
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Align your security solutions, threat intelligence platforms, and advisory services with the country&apos;s most credible independent cybersecurity newsroom.
        </p>
      </div>

      {/* Audience Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-2 shadow-xs">
          <Users className="w-6 h-6 text-[#0E7490] mx-auto" />
          <div className="text-2xl font-bold font-serif-headline text-[#0A2540]">18,500+</div>
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Verified Cyber Leaders
          </div>
          <p className="text-[11px] text-slate-500">CISOs, CIOs, DPOs, and Head of Infosec across BFSI, IT/ITeS, Healthcare & Telecom.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-2 shadow-xs">
          <Mail className="w-6 h-6 text-emerald-600 mx-auto" />
          <div className="text-2xl font-bold font-serif-headline text-[#0A2540]">42.8%</div>
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Executive Open Rate
          </div>
          <p className="text-[11px] text-slate-500">Daily and weekly executive threat briefing distribution to corporate mailboxes.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-2 shadow-xs">
          <BarChart3 className="w-6 h-6 text-purple-600 mx-auto" />
          <div className="text-2xl font-bold font-serif-headline text-[#0A2540]">84%</div>
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Enterprise Tier
          </div>
          <p className="text-[11px] text-slate-500">Organizations with 1,000+ employees and annual IT budgets exceeding ₹100 Crore.</p>
        </div>
      </div>

      {/* Partnership Opportunities */}
      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold font-serif-headline text-[#0A2540]">
          Sponsorship & Co-Branded Intelligence Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
              Co-Authored Industry Benchmark Reports
            </h3>
            <p className="leading-relaxed">
              Partner with the THEREALCISO Research Lab to survey CISOs, compile actionable analytics, and generate high-intent gated executive leads.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
              Closed-Door Executive Roundtables
            </h3>
            <p className="leading-relaxed">
              Curate Chatham House rule virtual or in-person dinner roundtables with 12-15 targeted enterprise CISOs in Mumbai, Bengaluru, or Delhi NCR.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
              Executive Briefing Sponsorships
            </h3>
            <p className="leading-relaxed">
              Prominently position your threat intelligence research or product capabilities inside our weekly executive email dispatches.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
              Custom Technical Webinars & Demos
            </h3>
            <p className="leading-relaxed">
              Lead technical demonstrations highlighting real-world threat simulation, cloud microsegmentation, or DPDP Act technical architectures.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#0A2540]">Request Media Kit & Rate Card</h4>
            <p className="text-xs text-slate-500">Contact our enterprise partnerships desk for scheduling and demographics.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#123659] rounded transition-colors whitespace-nowrap"
          >
            Inquire With Partnerships Desk
          </Link>
        </div>
      </div>
    </div>
  );
}

