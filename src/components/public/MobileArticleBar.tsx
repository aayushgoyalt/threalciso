'use client';

import { useState, useEffect } from 'react';
import { Share2, Check, ArrowUp, MessageCircle, Linkedin } from 'lucide-react';

interface MobileArticleBarProps {
  title: string;
  url: string;
  categoryName?: string;
  readTime?: number;
}

export function MobileArticleBar({
  title,
  url,
  categoryName,
  readTime,
}: MobileArticleBarProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only after scrolling down 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    handleCopy();
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `*${title}*\nRead cybersecurity briefing: ${url}`
  )}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 px-3 py-2 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full shadow-lg px-4 py-2 flex items-center justify-between pointer-events-auto">
        {/* Info label */}
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {categoryName && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E7490] truncate max-w-[100px]">
              {categoryName}
            </span>
          )}
          {readTime && (
            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
              • {readTime}m read
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="p-1.5 rounded-full text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600/10" />
          </a>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="p-1.5 rounded-full text-blue-700 hover:bg-blue-50 active:scale-95 transition-all"
          >
            <Linkedin className="w-4 h-4 fill-blue-700/10" />
          </a>

          <button
            onClick={handleNativeShare}
            aria-label="Share article"
            className="p-1.5 rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all relative"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-medium rounded shadow-xs whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>

          <span className="w-px h-4 bg-slate-200 mx-0.5" />

          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
