'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUnsubscribe = async () => {
    if (!token) {
      setError('Invalid or missing unsubscribe token.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to unsubscribe');
      }

      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs">
        {success ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-serif-headline text-slate-900">
              Unsubscribed Successfully
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your email address has been removed from all future executive briefing distributions. We are sorry to see you go.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="text-xs font-semibold text-[#0E7490] hover:underline"
              >
                Return to THEREALCISO Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif-headline text-[#0A2540]">
              Confirm Unsubscribe
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you wish to stop receiving the THEREALCISO Executive Daily and Weekly threat intelligence briefings?
            </p>

            {error && (
              <p className="text-xs text-rose-600 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}

            <div className="pt-2">
              <Button
                onClick={handleUnsubscribe}
                isLoading={loading}
                variant="danger"
                className="w-full text-xs font-semibold"
              >
                Unsubscribe From All Briefings
              </Button>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel and return
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-16 text-center text-xs text-slate-500">
          Loading unsubscription preferences...
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
