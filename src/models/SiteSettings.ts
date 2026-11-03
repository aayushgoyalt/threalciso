import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  heroArticleId?: Types.ObjectId;
  tickerNotice?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    rss?: string;
  };
  contactEmail: string;
  footerText: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema<ISiteSettings> = new Schema(
  {
    siteName: { type: String, default: 'THEREALCISO' },
    tagline: {
      type: String,
      default: 'Cybersecurity Intelligence & Executive Risk Insights for Indian Leaders',
    },
    logoUrl: { type: String, default: '' },
    heroArticleId: { type: Schema.Types.ObjectId, ref: 'Article' },
    tickerNotice: {
      type: String,
      default:
        'CRITICAL ALERT: CERT-In issues urgent advisory on active exploitation of critical enterprise VPN vulnerabilities.',
    },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      rss: { type: String, default: '/rss.xml' },
    },
    contactEmail: { type: String, default: 'editorial@therealciso.in' },
    footerText: {
      type: String,
      default: '© 2026 THEREALCISO. All rights reserved. The independent journal for cybersecurity and risk leadership.',
    },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

