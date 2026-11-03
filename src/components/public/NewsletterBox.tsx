'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NewsletterBoxProps {
  variant?: 'inline' | 'sidebar' | 'banner';
}

export function NewsletterBox({ variant = 'inline' }: NewsletterBoxProps) {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frequency }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
        <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <h4 className="text-base font-bold text-emerald-900 font-serif-headline">
          Subscription Confirmed
        </h4>
        <p className="text-xs text-emerald-700 mt-1">
          You are now subscribed to THEREALCISO Executive Briefings. You may modify your preferences or unsubscribe at any time.
        </p>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-slate-900 text-white rounded-lg p-5 border border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-cyan-400">
          <Mail className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">CISO Intelligence</span>
        </div>
        <h4 className="text-base font-bold font-serif-headline leading-tight">
          Executive Security Brief
        </h4>
        <p className="text-xs text-slate-400 mt-1.5 mb-4 leading-relaxed">
          Critical vulnerabilities, DPDP directives, and boardroom risk briefings every morning.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ciso@enterprise.com"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />

          <div className="flex items-center justify-between text-xs text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                checked={frequency === 'daily'}
                onChange={() => setFrequency('daily')}
                className="text-cyan-500"
              />
              <span>Daily Brief</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                checked={frequency === 'weekly'}
                onChange={() => setFrequency('weekly')}
                className="text-cyan-500"
              />
              <span>Weekly Digest</span>
            </label>
          </div>

          {error && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="sm"
            isLoading={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
          >
            Subscribe Free
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#0A2540] text-white rounded-lg p-6 sm:p-8 border border-slate-700 shadow-md">
      <div className="max-w-2xl">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Join 8,500+ Security Executives
        </span>
        <h3 className="text-xl sm:text-2xl font-bold font-serif-headline mt-1 mb-2">
          Receive Verified Cybersecurity Intelligence Direct to Your Inbox
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Zero marketing fluff. Only actionable CVE advisories, regulatory analysis, and breach breakdowns curated specifically for Indian CISOs and risk teams.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your corporate email address"
            className="flex-1 px-4 py-2.5 bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-400 rounded focus:outline-none focus:border-cyan-400"
          />

          <Button
            type="submit"
            isLoading={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-2.5 whitespace-nowrap"
          >
            Get Briefed
          </Button>
        </form>

        {error && (
          <p className="text-xs text-rose-300 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        <p className="text-[11px] text-slate-400 mt-3">
          Strictly confidential. No spam. One-click unsubscribe whenever you desire.
        </p>
      </div>
    </div>
  );
}

