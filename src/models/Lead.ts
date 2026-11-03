import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ILead extends Document {
  resource: Types.ObjectId;
  fullName: string;
  email: string;
  jobTitle: string;
  companyName: string;
  companySize?: string;
  phone?: string;
  consent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema<ILead> = new Schema(
  {
    resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    companySize: { type: String, default: '500-1000' },
    phone: { type: String, default: '' },
    consent: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

