import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Lead, Subscriber, Resource } from '@/models';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;
    await connectDB();

    if (type === 'leads') {
      const leads = await Lead.find().populate('resource', 'title').sort({ createdAt: -1 });

      const header = ['Full Name', 'Email', 'Job Title', 'Company', 'Size', 'Phone', 'Resource', 'Downloaded At'];
      const rows = leads.map((l) => [
        `"${(l.fullName || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.jobTitle || '').replace(/"/g, '""')}"`,
        `"${(l.companyName || '').replace(/"/g, '""')}"`,
        `"${(l.companySize || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${((l.resource as unknown as typeof Resource & { title?: string })?.title || '').replace(/"/g, '""')}"`,
        `"${new Date(l.createdAt).toISOString()}"`,
      ]);

      const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="therealciso-leads-${Date.now()}.csv"`,
        },
      });
    }

    if (type === 'subscribers') {
      const subscribers = await Subscriber.find().sort({ createdAt: -1 });

      const header = ['Email', 'Frequency', 'Status', 'Subscribed At'];
      const rows = subscribers.map((s) => [
        `"${(s.email || '').replace(/"/g, '""')}"`,
        `"${s.frequency}"`,
        `"${s.status}"`,
        `"${new Date(s.createdAt).toISOString()}"`,
      ]);

      const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="therealciso-subscribers-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ message: 'Invalid export type' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ message: 'Export failed' }, { status: 500 });
  }
}

