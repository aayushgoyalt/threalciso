import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Author } from '@/models';
import { getSession } from '@/lib/auth';
import slugify from 'slugify';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { name, roleTitle, bio, avatar, twitter, linkedin } = await request.json();
    if (!name || !roleTitle || !bio) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const slug = slugify(name, { lower: true, strict: true });
    const author = await Author.create({
      name,
      slug,
      roleTitle,
      bio,
      avatar: avatar || '',
      socialLinks: {
        twitter: twitter || '',
        linkedin: linkedin || '',
      },
    });

    return NextResponse.json({ success: true, author });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

