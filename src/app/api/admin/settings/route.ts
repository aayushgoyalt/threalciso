import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteSettings } from '@/models';
import { getSession } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    const body = await request.json();
    await connectDB();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    if (body.siteName) settings.siteName = body.siteName;
    if (body.tagline) settings.tagline = body.tagline;
    if (body.tickerNotice !== undefined) settings.tickerNotice = body.tickerNotice;
    if (body.contactEmail) settings.contactEmail = body.contactEmail;
    if (body.footerText) settings.footerText = body.footerText;
    if (body.socialLinks) settings.socialLinks = body.socialLinks;

    await settings.save();

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

