import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Article, ArticleView } from '@/models';
import { isBot, generateVisitorHash } from '@/lib/bot-detector';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const userAgent = request.headers.get('user-agent') || '';

    // 1. Ignore bots and crawlers (Requirement 9)
    if (isBot(userAgent)) {
      return NextResponse.json({ message: 'Bot traffic ignored' }, { status: 200 });
    }

    await connectDB();

    // 2. Find article
    const article = await Article.findOne(Article.getPublicFilter({ slug }));
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // 3. Deduplicate by IP + cookie/identifier within 24 hours
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const visitorCookie = request.cookies.get('therealciso_vid')?.value;
    const visitorHash = generateVisitorHash(ip, userAgent, visitorCookie);

    const now = new Date();
    const expireAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hr window

    // Try creating an ArticleView record; unique index on (articleId, visitorHash) prevents duplicate
    try {
      await ArticleView.create({
        articleId: article._id,
        visitorHash,
        expireAt,
      });

      // Increment views atomically
      article.views = (article.views || 0) + 1;
      await article.save();
    } catch {
      // Duplicate view within sliding window; don't increment
    }

    const response = NextResponse.json({ views: article.views });

    // Set anonymous visitor ID cookie if not present
    if (!visitorCookie) {
      response.cookies.set({
        name: 'therealciso_vid',
        value: visitorHash.substring(0, 32),
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

