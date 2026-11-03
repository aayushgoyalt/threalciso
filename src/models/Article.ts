import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type ArticleStatus = 'draft' | 'scheduled' | 'published';
export type ArticleSeverity = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface IArticle extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: {
    url: string;
    caption?: string;
    alt?: string;
  };
  category: Types.ObjectId;
  tags: Types.ObjectId[];
  author: Types.ObjectId;
  status: ArticleStatus;
  publishedAt: Date;
  readTime: number; // in minutes
  views: number;
  isFeatured: boolean;
  isTrending: boolean;
  severity: ArticleSeverity;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ArticleModelInterface extends Model<IArticle> {
  getPublicFilter(additionalFilter?: Record<string, unknown>): Record<string, unknown>;
}

const ArticleSchema: Schema<IArticle> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: {
      url: { type: String, required: true },
      caption: { type: String, default: '' },
      alt: { type: String, default: '' },
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', index: true }],
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true, index: true },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published'],
      default: 'draft',
      index: true,
    },
    publishedAt: { type: Date, default: Date.now, index: true },
    readTime: { type: Number, default: 4 },
    views: { type: Number, default: 0, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    severity: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'critical'],
      default: 'none',
      index: true,
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      canonicalUrl: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Compound indexes for optimal feed filtering
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1, status: 1, publishedAt: -1 });
ArticleSchema.index({ isFeatured: 1, status: 1, publishedAt: -1 });

// Full-text search index across title, summary, and content
ArticleSchema.index(
  { title: 'text', summary: 'text', content: 'text' },
  { weights: { title: 10, summary: 5, content: 1 }, name: 'ArticleTextSearchIndex' }
);

// Static method to enforce pull-based scheduled filtering
ArticleSchema.statics.getPublicFilter = function (
  additionalFilter: Record<string, unknown> = {}
) {
  return {
    status: 'published',
    publishedAt: { $lte: new Date() },
    ...additionalFilter,
  };
};

export const Article =
  (mongoose.models.Article as ArticleModelInterface) ||
  mongoose.model<IArticle, ArticleModelInterface>('Article', ArticleSchema);

