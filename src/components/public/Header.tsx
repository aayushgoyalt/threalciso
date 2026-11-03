import Link from 'next/link';
import { Shield, Search, Lock, BellRing } from 'lucide-react';

interface HeaderProps {
  categories?: Array<{ name: string; slug: string }>;
}

export function Header({ categories = [] }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const defaultCategories = [
    { name: 'News', slug: 'news' },
    { name: 'Breaches & Attacks', slug: 'breaches-attacks' },
    { name: 'Threats & Vulnerabilities', slug: 'threats-vulnerabilities' },
    { name: 'Privacy & Compliance', slug: 'privacy-compliance' },
    { name: 'Cloud & Identity', slug: 'cloud-identity' },
    { name: 'AI & Security', slug: 'ai-security' },
    { name: 'Policy & Regulation', slug: 'policy-regulation' },
    { name: 'Opinion', slug: 'opinion' },
    { name: 'Interviews', slug: 'interviews' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <header className="border-b border-slate-200 bg-white">
      {/* Top Utility Bar */}
      <div className="border-b border-slate-100 bg-[#0A2540] text-slate-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-200">{currentDate}</span>
            <span className="text-slate-500">|</span>
            <span className="inline-flex items-center gap-1.5 text-rose-300 font-semibold tracking-wide uppercase text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
              Live Threat Telemetry
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/newsletter"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <BellRing className="w-3.5 h-3.5 text-cyan-400" />
              <span>Executive Briefing</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/admin"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-[#0A2540] text-white flex items-center justify-center font-bold text-lg tracking-tighter shadow-xs">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540] font-serif-headline group-hover:text-cyan-800 transition-colors">
                    THEREAL<span className="text-[#0E7490]">CISO</span>
                  </span>
                  <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-500 uppercase mt-0.5">
                    Cybersecurity Intelligence & Executive Risk Journal
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              Events & Summits
            </Link>
            <Link
              href="/resources"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#123659] rounded transition-colors"
            >
              Whitepapers & Reports
            </Link>
            <Link
              href="/search"
              aria-label="Search articles"
              className="p-2 text-slate-600 hover:text-[#0A2540] hover:bg-slate-100 rounded transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none text-xs font-medium">
            <Link
              href="/"
              className="px-3 py-1 text-slate-900 hover:text-[#0E7490] font-semibold whitespace-nowrap"
            >
              Home
            </Link>
            {displayCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-2.5 py-1 text-slate-600 hover:text-[#0A2540] hover:bg-slate-50 rounded whitespace-nowrap transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

