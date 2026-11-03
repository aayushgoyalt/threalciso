'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function AdminSettingsForm({ initialSettings }: { initialSettings: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    siteName: initialSettings?.siteName || 'THEREALCISO',
    tagline: initialSettings?.tagline || 'Cybersecurity Intelligence & Executive Risk Insights',
    tickerNotice:
      initialSettings?.tickerNotice ||
      'CRITICAL ALERT: CERT-In issues urgent advisory on active exploitation of enterprise SSL VPN gateways.',
    contactEmail: initialSettings?.contactEmail || 'editorial@therealciso.in',
    footerText: initialSettings?.footerText || '',
    socialLinks: {
      linkedin: initialSettings?.socialLinks?.linkedin || '',
      twitter: initialSettings?.socialLinks?.twitter || '',
      youtube: initialSettings?.socialLinks?.youtube || '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Site settings saved successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
          Platform Identity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Site Name *"
            required
            value={formData.siteName}
            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
          />
          <Input
            label="Contact Email *"
            type="email"
            required
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          />
        </div>

        <Input
          label="Tagline / Masthead Subtitle"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
          Breaking Advisory Ticker
        </h3>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Active Warning Bar Notice
          </label>
          <textarea
            rows={2}
            value={formData.tickerNotice}
            onChange={(e) => setFormData({ ...formData, tickerNotice: e.target.value })}
            placeholder="Critical CERT-In alert or national security advisory text..."
            className="w-full px-3.5 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
          Social Channels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="LinkedIn"
            value={formData.socialLinks.linkedin}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
              })
            }
          />
          <Input
            label="Twitter / X"
            value={formData.socialLinks.twitter}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, twitter: e.target.value },
              })
            }
          />
          <Input
            label="YouTube"
            value={formData.socialLinks.youtube}
            onChange={(e) =>
              setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, youtube: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button
          type="submit"
          isLoading={loading}
          className="bg-[#0A2540] hover:bg-[#123659] text-white px-6 py-2.5 font-semibold text-xs uppercase tracking-wider"
        >
          Save Configuration
        </Button>
      </div>
    </form>
  );
}

