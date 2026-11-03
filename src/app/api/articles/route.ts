import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Article } from '@/models';
import { getSession } from '@/lib/auth';
import { ArticleSchema } from '@/lib/validations';
import { sanitizeContent } from '@/lib/sanitizer';
import { calculateReadingTime } from '@/lib/reading-time';
import slugify from 'slugify';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const author = searchParams.get('author');
    const severity = searchParams.get('severity');
    const sort = searchParams.get('sort') || 'latest';
    const isAdminQuery = searchParams.get('admin') === 'true';

    // Session check for admin queries
    const session = isAdminQuery ? await getSession() : null;

    let filter: Record<string, unknown> = {};

    if (!session) {
      // Public queries strictly enforce published AND publishedAt <= now (Requirement 2)
      filter = Article.getPublicFilter();
    } else {
      const status = searchParams.get('status');
      if (status) filter.status = status;
    }

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (author) filter.author = author;
    if (severity && severity !== 'all') filter.severity = severity;

    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    let sortOptions: Record<string, 1 | -1> = { publishedAt: -1 };
    if (sort === 'views') {
      sortOptions = { views: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { publishedAt: 1 };
    }

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('category', 'name slug colorHex')
        .populate('author', 'name slug avatar roleTitle')
        .populate('tags', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(filter),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Articles fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = ArticleSchema.parse(body);

    await connectDB();

    // 1. Sanitize HTML server-side before saving (Requirement 7)
    const sanitizedHtml = sanitizeContent(validated.content);

    // 2. Auto-calculate reading time
    const readTime = calculateReadingTime(sanitizedHtml);

    // 3. Generate unique slug
    let baseSlug = slugify(validated.title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await Article.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newArticle = await Article.create({
      title: validated.title,
      slug: uniqueSlug,
      summary: validated.summary,
      content: sanitizedHtml,
      coverImage: {
        url: validated.coverImageUrl,
        caption: validated.coverImageCaption || '',
      },
      category: validated.categoryId,
      tags: validated.tagIds,
      author: validated.authorId,
      status: validated.status,
      publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : new Date(),
      readTime,
      views: 0,
      isFeatured: validated.isFeatured,
      isTrending: validated.isTrending,
      severity: validated.severity,
      seo: {
        metaTitle: validated.metaTitle || validated.title,
        metaDescription: validated.metaDescription || validated.summary,
        canonicalUrl: validated.canonicalUrl || '',
      },
    });

    return NextResponse.json({
      success: true,
      article: newArticle,
    });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json(
      { message: err.message || 'Creation failed' },
      { status: 400 }
    );
  }
}

