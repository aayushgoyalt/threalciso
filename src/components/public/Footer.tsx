import Link from 'next/link';
import { Shield, Mail, ArrowRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-16">
      {/* Top newsletter banner in footer */}
      <div className="bg-slate-50 border-b border-slate-200 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-[#0E7490] tracking-widest uppercase">
              The Real CISO Executive Dispatch
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-headline font-bold text-[#0A2540] mt-1">
              Stay ahead of emerging nation-state threats, zero-days, and regulatory mandates.
            </h3>
            <p className="text-sm text-slate-500 mt-1.5">
              Delivered every Tuesday and Thursday morning directly to cybersecurity leaders across India and APAC.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Link
              href="/newsletter"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0A2540] hover:bg-[#123659] rounded transition-all shadow-xs"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Subscribe to Briefing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#0A2540] text-white flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0A2540] font-serif-headline">
                THEREAL<span className="text-[#0E7490]">CISO</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed pr-4">
              THEREALCISO is the premier independent cybersecurity newsroom, threat intelligence journal, and risk leadership platform dedicated to Chief Information Security Officers, Data Protection Officers, and enterprise IT risk executives.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Independent Editorial Governance • Verified Sources • Zero Sponsored Disguise</p>
              <p>Headquartered in New Delhi, India with correspondents across Bengaluru, Mumbai, and Hyderabad.</p>
            </div>
          </div>

          {/* Intelligence Topics */}
          <div>
            <h4 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-3">
              Intelligence Verticals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/news" className="hover:text-[#0A2540] transition-colors">
                  Cyber News & Alerts
                </Link>
              </li>
              <li>
                <Link href="/category/breaches-attacks" className="hover:text-[#0A2540] transition-colors">
                  Breaches & Ransomware
                </Link>
              </li>
              <li>
                <Link href="/category/threats-vulnerabilities" className="hover:text-[#0A2540] transition-colors">
                  Zero-Days & CVEs
                </Link>
              </li>
              <li>
                <Link href="/category/privacy-compliance" className="hover:text-[#0A2540] transition-colors">
                  DPDP Act & Privacy
                </Link>
              </li>
              <li>
                <Link href="/category/cloud-identity" className="hover:text-[#0A2540] transition-colors">
                  Cloud Security & IAM
                </Link>
              </li>
              <li>
                <Link href="/category/ai-security" className="hover:text-[#0A2540] transition-colors">
                  AI Defense & LLM Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Strategic Hubs */}
          <div>
            <h4 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-3">
              Executive Hubs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="hover:text-[#0A2540] transition-colors">
                  CISO Summits & Webinars
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#0A2540] transition-colors">
                  Research & Benchmark Reports
                </Link>
              </li>
              <li>
                <Link href="/category/interviews" className="hover:text-[#0A2540] transition-colors">
                  Executive Interviews
                </Link>
              </li>
              <li>
                <Link href="/category/opinion" className="hover:text-[#0A2540] transition-colors">
                  Boardroom Perspective
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="hover:text-[#0A2540] transition-colors">
                  Weekly Intelligence Brief
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional & Legal */}
          <div>
            <h4 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-3">
              Corporate
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#0A2540] transition-colors">
                  About THEREALCISO
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0A2540] transition-colors">
                  Contact Newsroom
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-[#0A2540] transition-colors">
                  Sponsorship & Media Kit
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#0A2540] transition-colors">
                  Privacy Policy (DPDP)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0A2540] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} THEREALCISO. All rights reserved.</p>
          <p className="text-slate-400">
            Engineered with Next.js & MongoDB Atlas. Security Architecture verified.
          </p>
        </div>
      </div>
    </footer>
  );
}

