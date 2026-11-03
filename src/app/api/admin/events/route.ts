import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Event } from '@/models';
import { getSession } from '@/lib/auth';
import slugify from 'slugify';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, type, startDate, endDate, location, description, coverImage, registrationUrl, speakers } = body;

    if (!title || !startDate || !description) {
      return NextResponse.json({ message: 'Title, start date, and description required' }, { status: 400 });
    }

    await connectDB();

    const slug = slugify(title, { lower: true, strict: true });
    const event = await Event.create({
      title,
      slug,
      type: type || 'webinar',
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      location: location || 'Virtual',
      description,
      coverImage: coverImage || '',
      registrationUrl: registrationUrl || '',
      speakers: speakers || [],
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

