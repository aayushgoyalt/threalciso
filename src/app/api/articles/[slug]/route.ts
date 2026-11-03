import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Article } from '@/models';
import { getSession } from '@/lib/auth';
import { ArticleSchema } from '@/lib/validations';
import { sanitizeContent } from '@/lib/sanitizer';
import { calculateReadingTime } from '@/lib/reading-time';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const isId = mongoose.isValidObjectId(slug);
    const query = isId ? { _id: slug } : { slug };

    const article = await Article.findOne(query)
      .populate('category')
      .populate('author')
      .populate('tags');

    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Fetch article error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const validated = ArticleSchema.parse(body);

    await connectDB();

    const isId = mongoose.isValidObjectId(slug);
    const query = isId ? { _id: slug } : { slug };

    const article = await Article.findOne(query);
    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    // Sanitize HTML server-side before updating (Requirement 7)
    const sanitizedHtml = sanitizeContent(validated.content);
    const readTime = calculateReadingTime(sanitizedHtml);

    article.title = validated.title;
    article.summary = validated.summary;
    article.content = sanitizedHtml;
    article.coverImage = {
      url: validated.coverImageUrl,
      caption: validated.coverImageCaption || '',
    };
    article.category = validated.categoryId as unknown as typeof article.category;
    article.tags = validated.tagIds as unknown as typeof article.tags;
    article.author = validated.authorId as unknown as typeof article.author;
    article.status = validated.status;
    if (validated.publishedAt) {
      article.publishedAt = new Date(validated.publishedAt);
    }
    article.readTime = readTime;
    article.isFeatured = validated.isFeatured;
    article.isTrending = validated.isTrending;
    article.severity = validated.severity;
    article.seo = {
      metaTitle: validated.metaTitle || validated.title,
      metaDescription: validated.metaDescription || validated.summary,
      canonicalUrl: validated.canonicalUrl || '',
    };

    await article.save();

    return NextResponse.json({ success: true, article });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json(
      { message: err.message || 'Update failed' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    await connectDB();

    const isId = mongoose.isValidObjectId(slug);
    const query = isId ? { _id: slug } : { slug };

    const deleted = await Article.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

