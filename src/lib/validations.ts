import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please provide a valid corporate email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const ArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(500),
  content: z.string().min(20, 'Content is required'),
  coverImageUrl: z.string().url('Must be a valid image URL'),
  coverImageCaption: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tagIds: z.array(z.string()).default([]),
  authorId: z.string().min(1, 'Author is required'),
  status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
  publishedAt: z.string().optional(),
  severity: z.enum(['none', 'low', 'medium', 'high', 'critical']).default('none'),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

export const LeadSchema = z.object({
  resourceId: z.string().min(1, 'Resource ID is required'),
  fullName: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Valid corporate email is required'),
  jobTitle: z.string().min(2, 'Job title is required').max(100),
  companyName: z.string().min(2, 'Company name is required').max(100),
  companySize: z.string().optional(),
  phone: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to receiving the requested document',
  }),
});

export const NewsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  frequency: z.enum(['daily', 'weekly']).default('daily'),
});

export const ContactSchema = z.object({
  name: z.string().min(2, 'Your name is required').max(100),
  email: z.string().email('A valid email address is required'),
  organization: z.string().max(100).optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(150),
  message: z.string().min(15, 'Message must be at least 15 characters').max(3000),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(60),
  slug: z.string().optional(),
  description: z.string().optional(),
  order: z.number().default(0),
  colorHex: z.string().default('#0284c7'),
});

export const AuthorSchema = z.object({
  name: z.string().min(2, 'Author name is required').max(100),
  slug: z.string().optional(),
  roleTitle: z.string().min(2, 'Role title is required'),
  bio: z.string().min(10, 'Bio is required'),
  avatar: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

export const EventSchema = z.object({
  title: z.string().min(5, 'Event title is required').max(200),
  slug: z.string().optional(),
  type: z.enum(['webinar', 'roundtable', 'summit', 'conference']).default('webinar'),
  startDate: z.string().min(1, 'Start date and time are required'),
  endDate: z.string().optional(),
  location: z.string().default('Virtual'),
  description: z.string().min(10, 'Description is required'),
  coverImage: z.string().optional(),
  registrationUrl: z.string().url('Must be a valid registration link'),
  speakers: z
    .array(
      z.object({
        name: z.string(),
        title: z.string(),
        company: z.string(),
        avatar: z.string().optional(),
      })
    )
    .default([]),
});

export const ResourceSchema = z.object({
  title: z.string().min(5, 'Resource title is required').max(200),
  slug: z.string().optional(),
  type: z.enum(['whitepaper', 'report', 'playbook', 'survey']).default('whitepaper'),
  description: z.string().min(10, 'Description is required'),
  coverImage: z.string().default(''),
  fileUrl: z.string().min(1, 'File URL or path is required'),
  authorOrPublisher: z.string().default('THEREALCISO Intelligence Lab'),
  pagesCount: z.number().default(10),
});

export const SiteSettingsSchema = z.object({
  siteName: z.string().min(2).max(100),
  tagline: z.string().max(200),
  logoUrl: z.string().optional(),
  tickerNotice: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  contactEmail: z.string().email(),
  footerText: z.string().optional(),
});

