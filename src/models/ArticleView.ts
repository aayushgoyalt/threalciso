import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IArticleView extends Document {
  articleId: Types.ObjectId;
  visitorHash: string;
  expireAt: Date;
  createdAt: Date;
}

const ArticleViewSchema: Schema<IArticleView> = new Schema(
  {
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
    visitorHash: { type: String, required: true, index: true },
    expireAt: { type: Date, required: true, index: { expires: '0s' } },
  },
  { timestamps: true }
);

ArticleViewSchema.index({ articleId: 1, visitorHash: 1 }, { unique: true });

export const ArticleView: Model<IArticleView> =
  mongoose.models.ArticleView || mongoose.model<IArticleView>('ArticleView', ArticleViewSchema);

