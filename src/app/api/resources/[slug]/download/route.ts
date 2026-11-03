import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Resource } from '@/models';
import { verifyDownloadToken } from '@/lib/download-token';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Missing download authorization token' },
        { status: 401 }
      );
    }

    const payload = await verifyDownloadToken(token);
    if (!payload || payload.slug !== slug) {
      return NextResponse.json(
        { error: 'Invalid or expired download token. Please request the document again.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Explicitly select the protected fileUrl
    const resource = await Resource.findById(payload.resourceId).select('+fileUrl');
    if (!resource || !resource.fileUrl) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Redirect to authenticated file or download path
    return NextResponse.redirect(new URL(resource.fileUrl, request.url));
  } catch (error) {
    console.error('Download verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

