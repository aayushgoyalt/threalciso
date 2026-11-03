import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Event } from '@/models';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Executive Summits, Roundtables & Webinars | THEREALCISO',
  description: 'Join premier cybersecurity summits, peer roundtables, and technical webinars tailored for CISOs and risk executives in India.',
};

interface EventsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { tab = 'upcoming' } = await searchParams;
  await connectDB();

  const now = new Date();

  // Requirement 3: Derive event status from dates at query time instead of storing it
  const isPast = tab === 'past';
  const filter = isPast ? { startDate: { $lte: now } } : { startDate: { $gt: now } };
  const sort = isPast ? { startDate: -1 } : { startDate: 1 };

  const events = await Event.find(filter).sort(sort as any).lean();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#0E7490] uppercase tracking-wider">
            Leadership Calendar
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-headline text-[#0A2540] mt-1">
            Cybersecurity Summits & Webinars
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Exclusive executive forums, peer roundtables, and threat briefing sessions convening industry leaders and national regulatory bodies.
          </p>
        </div>

        {/* Upcoming vs Past Tabs (Derived at query time) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <Link
            href="/events?tab=upcoming"
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              !isPast
                ? 'bg-white text-[#0A2540] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming Events
          </Link>
          <Link
            href="/events?tab=past"
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              isPast
                ? 'bg-white text-[#0A2540] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Archives
          </Link>
        </div>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-medium text-slate-700">No {tab} events scheduled at this moment.</p>
          <p className="text-xs text-slate-400 mt-1">
            Check back soon or subscribe to the briefing to receive calendar invitations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const startFormatted = new Date(evt.startDate).toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const timeFormatted = new Date(evt.startDate).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={evt._id?.toString()}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {evt.coverImage && (
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden" style={{ position: 'relative' }}>
                      <Image
                        src={evt.coverImage}
                        alt={evt.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-[#0A2540]/90 text-white backdrop-blur-xs">
                          {evt.type}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="space-y-1.5 mb-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 text-[#0E7490] font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{startFormatted} • {timeFormatted} IST</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold font-serif-headline text-[#0A2540] leading-snug mb-2">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {evt.description}
                    </p>

                    {/* Speakers */}
                    {evt.speakers && evt.speakers.length > 0 && (
                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Featured Speakers
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {evt.speakers.map((spk, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {spk.avatar && (
                                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200" style={{ position: 'relative' }}>
                                  <Image src={spk.avatar} alt={spk.name} fill className="object-cover" />
                                </div>
                              )}
                              <span className="text-xs text-slate-700 font-medium">
                                {spk.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href={evt.registrationUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded transition-colors text-white bg-[#0A2540] hover:bg-[#123659]"
                  >
                    <span>{isPast ? 'Access Recorded Archive' : 'Register for Session'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

