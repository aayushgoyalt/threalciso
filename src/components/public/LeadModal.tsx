'use client';

import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    _id: string;
    title: string;
    slug: string;
    type: string;
    pagesCount: number;
    authorOrPublisher: string;
  };
}

export function LeadModal({ isOpen, onClose, resource }: LeadModalProps) {
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
          resourceId: resource._id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setDownloadUrl(data.downloadUrl);
      // Auto-trigger secure download
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDownloadUrl(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={`Download ${resource.type.toUpperCase()}`}
      maxWidth="md"
    >
      {downloadUrl ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 font-serif-headline">
            Your Download Is Ready
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            Thank you for requesting <strong>{resource.title}</strong>. Your secure download has started. If it didn&apos;t begin automatically, click the link below.
          </p>
          <div className="pt-2">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#123659] rounded"
            >
              <Download className="w-4 h-4" />
              Download Document ({resource.pagesCount} pages)
            </a>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md mb-5">
            <FileText className="w-6 h-6 text-[#0E7490] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#0A2540] truncate">{resource.title}</h4>
              <p className="text-[11px] text-slate-500">
                {resource.authorOrPublisher} • {resource.pagesCount} pages • Executive Edition
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Priya Nair"
              />
              <Input
                label="Work Email *"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="priya@enterprise.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Job Title *"
                required
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="Chief Information Security Officer"
              />
              <Input
                label="Company Name *"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Tata Digital / HDFC"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Size
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-900 rounded focus:outline-none focus:border-[#0A2540]"
                >
                  <option value="1-100">1 - 100 Employees</option>
                  <option value="101-500">101 - 500 Employees</option>
                  <option value="501-2000">501 - 2,000 Employees</option>
                  <option value="2000+">2,000+ Enterprise</option>
                </select>
              </div>
              <Input
                label="Phone (Optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded text-[#0A2540] focus:ring-0"
                />
                <span className="text-[11px] text-slate-500 leading-tight">
                  I consent to THEREALCISO processing my corporate credentials to access this research under the DPDP Act.
                </span>
              </label>
            </div>

            {error && (
              <p className="text-xs text-rose-600 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </p>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-[#0A2540] hover:bg-[#123659] text-white py-2.5 font-semibold text-xs uppercase tracking-wider"
              >
                Access Research Document
              </Button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}

