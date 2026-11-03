import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface ISubscriber extends Document {
  email: string;
  status: 'active' | 'unsubscribed';
  frequency: 'daily' | 'weekly';
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema: Schema<ISubscriber> = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active', index: true },
    frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    token: {
      type: String,
      default: () => crypto.randomBytes(24).toString('hex'),
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

