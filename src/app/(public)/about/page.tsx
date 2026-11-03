import type { Metadata } from 'next';
import { Shield, Target, Users, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About THEREALCISO | Independent Cybersecurity Journal',
  description: 'THEREALCISO is the premier independent cybersecurity journalism, threat intelligence, and risk leadership platform for CISOs in India.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold text-[#0E7490] uppercase tracking-wider">
          Our Editorial Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-headline text-[#0A2540] mt-1">
          Independent Intelligence for the Modern Cyber Executive
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed font-serif-headline italic">
          "Cybersecurity leadership in India has matured beyond tactical patching. It is now central to sovereign economic resilience, regulatory accountability, and shareholder trust."
        </p>
      </div>

      <div className="article-prose space-y-6 text-slate-700">
        <p>
          Founded in 2026, <strong>THEREALCISO</strong> was built from the ground up to address a persistent void in Indian technology media: the lack of rigorously verified, vendor-neutral reporting tailored to Chief Information Security Officers, Data Protection Officers, and enterprise risk committees.
        </p>
        <p>
          Traditional IT publications frequently blur the line between objective journalism and paid promotional placements. At THEREALCISO, our editorial team operates under strict Chatham House and ethical reporting standards. Our investigative reporting is guided exclusively by technical accuracy, national security imperatives, and executive relevance.
        </p>

        <h2 className="text-2xl font-bold font-serif-headline text-[#0A2540] mt-8 mb-4">
          Core Editorial Pillars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose my-6">
          <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-2">
            <Target className="w-5 h-5 text-[#0E7490]" />
            <h3 className="text-base font-bold text-[#0A2540]">Technical Depth Over Hype</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We dissect threat vectors, reverse-engineer exploit chains, and analyze proof-of-concepts rather than repeating vendor panic narratives.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-2">
            <Shield className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-[#0A2540]">Indian Regulatory Grounding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deep, nuanced coverage of the Digital Personal Data Protection (DPDP) Act, CERT-In directions, RBI Cyber Security Frameworks, and SEBI cyber resilience rules.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-[#0A2540]">Peer-to-Peer Community</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real voices from CISOs on the front lines. Candid conversations regarding board friction, budget allocations, and stress containment.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-2">
            <BookOpen className="w-5 h-5 text-cyan-600" />
            <h3 className="text-base font-bold text-[#0A2540]">Actionable Guidance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Publishing reproducible incident response playbooks, procurement checklists, and architecture blueprints for high-scale enterprise stacks.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold font-serif-headline text-[#0A2540] mt-8 mb-4">
          Editorial Governance
        </h2>
        <p>
          THEREALCISO does not accept sponsored content disguised as news. All corporate partnerships, webinar sponsorships, and research whitepapers are transparently demarcated. Our newsroom maintains complete editorial independence from commercial operations.
        </p>
      </div>
    </div>
  );
}

