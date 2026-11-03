'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface EventItem {
  _id: string;
  title: string;
  slug: string;
  type: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  registrationUrl: string;
  coverImage?: string;
}

export function AdminEventManager({ initialEvents }: { initialEvents: EventItem[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('webinar');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('Virtual (Online)');
  const [description, setDescription] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          startDate,
          endDate: endDate || undefined,
          location,
          description,
          registrationUrl,
          coverImage,
        }),
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setRegistrationUrl('');
        setCoverImage('');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || 'Error creating event');
      }
    } catch {
      alert('Network failure');
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Event List */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Event &amp; Type</th>
              <th className="py-3 px-4">Derived Status</th>
              <th className="py-3 px-4">Date &amp; Location</th>
              <th className="py-3 px-4 text-right">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialEvents.map((evt) => {
              const start = new Date(evt.startDate);
              const isUpcoming = start > now;

              return (
                <tr key={evt._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 line-clamp-1">{evt.title}</div>
                    <span className="text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700 px-1.5 py-0.5">
                      {evt.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        isUpcoming
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isUpcoming ? 'Upcoming' : 'Past'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{start.toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-400">{evt.location}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {evt.registrationUrl && (
                      <a
                        href={evt.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0E7490] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Event Form */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#0E7490]" />
          <span>Schedule New Event</span>
        </h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Event Title *"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="India CISO Summit 2026..."
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
              >
                <option value="webinar">Webinar</option>
                <option value="roundtable">Roundtable</option>
                <option value="summit">Summit</option>
                <option value="conference">Conference</option>
              </select>
            </div>
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Virtual / Mumbai"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Start Date/Time *
              </label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                End Date/Time
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Executive agenda & topics..."
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#0A2540]"
            />
          </div>

          <Input
            label="Registration URL *"
            type="url"
            required
            value={registrationUrl}
            onChange={(e) => setRegistrationUrl(e.target.value)}
            placeholder="https://..."
          />

          <ImageUploader label="Banner Image" value={coverImage} onChange={setCoverImage} />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-[#0A2540] hover:bg-[#123659] text-white py-2 text-xs font-semibold"
          >
            Publish Event
          </Button>
        </form>
      </div>
    </div>
  );
}

