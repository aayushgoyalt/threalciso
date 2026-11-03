'use client';

import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ResourceLeadFormProps {
  resourceId: string;
  resourceTitle: string;
}

export function ResourceLeadForm({ resourceId, resourceTitle }: ResourceLeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    jobTitle: '',
    companyName: '',
    companySize: '500-1000',
    phone: '',
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setDownloadUrl(data.downloadUrl);
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (downloadUrl) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 font-serif-headline">
          Verification Complete
        </h4>
        <p className="text-xs text-slate-600">
          Your secure, time-limited download link is generated.
        </p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#123659] rounded w-full justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Click to Open PDF Document</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <Input
        label="Full Name *"
        required
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        placeholder="Aditya Verma"
      />
      <Input
        label="Corporate Work Email *"
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="aditya@enterprise.com"
      />
      <Input
        label="Job Title / Role *"
        required
        value={formData.jobTitle}
        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
        placeholder="CISO / IT Risk Director"
      />
      <Input
        label="Company / Institution *"
        required
        value={formData.companyName}
        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        placeholder="HDFC Life / Infosys"
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Org Size
          </label>
          <select
            value={formData.companySize}
            onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-900 rounded focus:outline-none focus:border-[#0A2540]"
          >
            <option value="1-100">1-100</option>
            <option value="101-500">101-500</option>
            <option value="501-2000">501-2000</option>
            <option value="2000+">2000+ Enterprise</option>
          </select>
        </div>
        <Input
          label="Phone (Optional)"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+91..."
        />
      </div>

      <div className="pt-1">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-0.5 rounded text-[#0A2540]"
          />
          <span className="text-[11px] text-slate-500 leading-tight">
            I agree to receive research intelligence from THEREALCISO under DPDP Act provisions.
          </span>
        </label>
      </div>

      {error && (
        <p className="text-xs text-rose-600 flex items-center gap-1.5 pt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}

      <Button
        type="submit"
        isLoading={loading}
        className="w-full bg-[#0A2540] hover:bg-[#123659] text-white py-2.5 font-semibold text-xs uppercase tracking-wider"
      >
        Instant Document Access
      </Button>
    </form>
  );
}

