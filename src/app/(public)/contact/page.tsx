'use client';

import React, { useState } from 'react';
import { Mail, Shield, MapPin, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to deliver message');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-[#0E7490] uppercase tracking-wider">
          Editorial & Investigations
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-headline text-[#0A2540] mt-1">
          Contact the Newsroom
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Submit confidential vulnerability disclosures, news tips, interview requests, or general inquiries to the THEREALCISO editorial board.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif-headline text-[#0A2540]">
                Message Delivered Securely
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Thank you for contacting THEREALCISO. Our editorial desk reviews incoming inquiries continuously and will respond promptly.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-xs font-semibold text-[#0E7490] hover:underline pt-2 inline-block"
              >
                Send Another Inbound Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Karan Malhotra"
                />
                <Input
                  label="Email Address *"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="karan@company.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Organization / Agency"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. State Bank of India"
                />
                <Input
                  label="Subject *"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Confidential Tip / CVE Discovery"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Message or Leak Details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide comprehensive context, affected systems, disclosure timelines, or interview queries..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540] transition-all"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </p>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-[#0A2540] hover:bg-[#123659] text-white py-2.5 font-semibold text-xs uppercase tracking-wider"
              >
                Dispatch to Editors
              </Button>
            </form>
          )}
        </div>

        {/* Right Column: Newsroom Info & PGP */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A2540] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0E7490]" />
              Secure Newsroom Desks
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">General Editorial:</span>
                  <a href="mailto:editorial@therealciso.in" className="text-[#0E7490] hover:underline">
                    editorial@therealciso.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Confidential Whistleblower Tips:</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    tips@therealciso.in (PGP Fingerprint: 4E91 F821 3D84 92AB)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Physical Bureau:</span>
                  <span className="text-slate-500">
                    Cyber Operations Desk, Connaught Place, New Delhi 110001, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 text-xs text-slate-500 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Whistleblower Protection</h4>
            <p className="leading-relaxed">
              THEREALCISO strictly adheres to source confidentiality. We protect identity under journalistic shield protocols and never preserve unencrypted IP metadata on investigative tip inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

