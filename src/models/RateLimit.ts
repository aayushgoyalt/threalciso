import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRateLimit extends Document {
  key: string;
  points: number;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RateLimitSchema: Schema<IRateLimit> = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    points: { type: Number, required: true, default: 1 },
    expireAt: { type: Date, required: true, index: { expires: '0s' } },
  },
  { timestamps: true }
);

export const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit || mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);

