import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Resource } from '@/models';
import { getSession } from '@/lib/auth';
import slugify from 'slugify';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, type, description, coverImage, fileUrl, authorOrPublisher, pagesCount } = body;

    if (!title || !description || !fileUrl) {
      return NextResponse.json({ message: 'Title, description, and file URL required' }, { status: 400 });
    }

    await connectDB();

    const slug = slugify(title, { lower: true, strict: true });
    const resource = await Resource.create({
      title,
      slug,
      type: type || 'whitepaper',
      description,
      coverImage: coverImage || '',
      fileUrl, // securely saved, not returned in public selections
      authorOrPublisher: authorOrPublisher || 'THEREALCISO Lab',
      pagesCount: pagesCount || 10,
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

