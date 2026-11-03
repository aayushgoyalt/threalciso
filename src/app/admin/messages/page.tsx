import { Mail, MessageSquare, Clock } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Message } from '@/models';

export const revalidate = 0;

export default async function AdminMessagesPage() {
  await connectDB();
  const messages = await Message.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-headline text-[#0A2540]">
          Newsroom Inquiries &amp; Tips
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inbound reader tips, whistleblower submissions, and corporate contact inquiries
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 text-xs">
            No inquiries received yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id.toString()}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0E7490]" />
                  <h3 className="text-sm font-bold text-slate-900">{msg.subject}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                      msg.status === 'unread'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4">
                <span>
                  <strong>From:</strong> {msg.name} ({msg.email})
                </span>
                {msg.organization && (
                  <span>
                    <strong>Org:</strong> {msg.organization}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                {msg.message}
              </p>

              <div className="flex justify-end gap-2">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="px-3 py-1 bg-[#0A2540] hover:bg-[#123659] text-white text-xs font-semibold rounded"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

