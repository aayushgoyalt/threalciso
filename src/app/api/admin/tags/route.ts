import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Tag } from '@/models';
import { getSession } from '@/lib/auth';
import slugify from 'slugify';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { name, description } = await request.json();
    if (!name) return NextResponse.json({ message: 'Name is required' }, { status: 400 });

    await connectDB();

    const slug = slugify(name, { lower: true, strict: true });
    const tag = await Tag.create({
      name,
      slug,
      description: description || '',
    });

    return NextResponse.json({ success: true, tag });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

