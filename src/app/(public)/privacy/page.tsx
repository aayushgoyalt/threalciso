import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy (DPDP Act) | THEREALCISO',
  description: 'THEREALCISO Privacy Policy formulated under the Digital Personal Data Protection Act, 2023 of India.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-[#0E7490] uppercase tracking-wider">
          Compliance & Data Governance
        </span>
        <h1 className="text-3xl font-bold font-serif-headline text-[#0A2540] mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Last revised: November 2026 • Formulated under the Digital Personal Data Protection (DPDP) Act, 2023
        </p>
      </div>

      <div className="article-prose space-y-6 text-sm text-slate-700 leading-relaxed">
        <p>
          At <strong>THEREALCISO</strong>, we believe data privacy is not merely a compliance checkbox, but a foundational tenet of cybersecurity leadership. As a digital newsroom and research institution, we are committed to upholding transparency, data minimization, and purposeful processing.
        </p>

        <h2>1. Scope & Applicable Law</h2>
        <p>
          This policy governs the processing of personal data collected through the THEREALCISO platform, newsletter subscriptions, gated research downloads, and executive events. Our operations strictly conform to the <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em> and applicable Indian cybersecurity directives.
        </p>

        <h2>2. Data Principals and Information Collected</h2>
        <p>We collect only the minimum necessary information required to serve our professional audience:</p>
        <ul>
          <li><strong>Executive Newsletter Subscribers:</strong> Work email address, preferred dispatch frequency (daily or weekly), and an automated verification token.</li>
          <li><strong>Gated Research Downloaders (Leads):</strong> Full name, professional work email, job title, company name, and company size for research distribution and sponsor lead reporting where explicitly consented.</li>
          <li><strong>Confidential Newsroom Inquiries:</strong> Name, contact details, and submitted message content.</li>
        </ul>

        <h2>3. Consent and Withdrawal of Consent</h2>
        <p>
          In accordance with Section 6 of the DPDP Act, all data is collected based on clear, affirmative consent. You maintain the absolute right to withdraw consent at any time. Every email dispatch contains an authenticated one-click unsubscribe mechanism that immediately halts processing.
        </p>

        <h2>4. Data Minimization & Third-Party Disclosure</h2>
        <p>
          We do not sell, rent, or trade subscriber credentials. Where a gated whitepaper is produced in collaboration with an identified research sponsor, your contact details are shared exclusively if you gave explicit affirmative consent during download.
        </p>

        <h2>5. Data Principal Rights & Grievance Redressal</h2>
        <p>Under the DPDP Act, you have the right to access a summary of personal data held, demand correction or erasure of outdated data, and nominate a representative. For privacy inquiries or grievances, contact our designated Data Protection Officer:</p>
        <p>
          <strong>Data Protection Officer (DPO)</strong><br />
          THEREALCISO Editorial Bureau<br />
          Email: <a href="mailto:dpo@therealciso.in">dpo@therealciso.in</a><br />
          New Delhi, India
        </p>
      </div>
    </div>
  );
}

