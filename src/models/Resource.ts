import mongoose, { Schema, Document, Model } from 'mongoose';

export type ResourceType = 'whitepaper' | 'report' | 'playbook' | 'survey';

export interface IResource extends Document {
  title: string;
  slug: string;
  type: ResourceType;
  description: string;
  coverImage: string;
  fileUrl: string; // Excluded by default for public security
  authorOrPublisher: string;
  pagesCount: number;
  downloadsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema<IResource> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: {
      type: String,
      enum: ['whitepaper', 'report', 'playbook', 'survey'],
      default: 'whitepaper',
    },
    description: { type: String, required: true },
    coverImage: { type: String, default: '' },
    // fileUrl is strictly protected and never leaked in public projections
    fileUrl: { type: String, required: true, select: false },
    authorOrPublisher: { type: String, default: 'THEREALCISO Intelligence Lab' },
    pagesCount: { type: Number, default: 12 },
    downloadsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Resource: Model<IResource> =
  mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);

