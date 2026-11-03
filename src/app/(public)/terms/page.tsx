import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | THEREALCISO',
  description: 'Terms and conditions governing access to THEREALCISO cybersecurity journalism, reports, and events.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-[#0E7490] uppercase tracking-wider">
          Legal Agreement
        </span>
        <h1 className="text-3xl font-bold font-serif-headline text-[#0A2540] mt-1">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Effective date: November 2026
        </p>
      </div>

      <div className="article-prose space-y-6 text-sm text-slate-700 leading-relaxed">
        <p>
          Welcome to <strong>THEREALCISO</strong>. By accessing or using our websites, intelligence feeds, whitepapers, or events, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h2>1. Proprietary Content & Fair Use</h2>
        <p>
          All investigative articles, proprietary benchmark reports, editorial analysis, infographics, and database compilations published on THEREALCISO are the intellectual property of THEREALCISO and protected under Indian and international copyright laws.
        </p>
        <p>
          You are permitted to quote brief excerpts (up to 150 words) for non-commercial commentary or internal executive briefings, provided prominent credit and an active hyperlink to the original THEREALCISO URL are included.
        </p>

        <h2>2. Technical Disclosures & Defensive Use Only</h2>
        <p>
          Information security advisories, vulnerability disclosures, and proof-of-concept discussions published on THEREALCISO are provided strictly for defensive research, hardening, and threat mitigation purposes. Any weaponization of disclosed telemetry or techniques against unauthorized computer systems is illegal and explicitly prohibited.
        </p>

        <h2>3. Disclaimer of Advisory Opinion</h2>
        <p>
          Articles and commentary on THEREALCISO represent journalistic analysis and professional commentary. They do not constitute formal legal counsel, regulatory audit certification, or specific enterprise architectural warranty. Organizations must evaluate technical mitigations in consultation with their respective legal and security advisors.
        </p>

        <h2>4. Governing Law and Jurisdiction</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
        </p>
      </div>
    </div>
  );
}

