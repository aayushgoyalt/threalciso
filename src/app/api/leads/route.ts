import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Resource, Lead } from '@/models';
import { LeadSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';
import { createDownloadToken } from '@/lib/download-token';

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Rate limiting: 10 lead downloads per hour per IP (Requirement 4)
    const rateCheck = await checkRateLimit(`lead:${ip}`, 10, 3600);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { message: 'Download request limit reached. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = LeadSchema.parse(body);

    await connectDB();

    const resource = await Resource.findById(validated.resourceId);
    if (!resource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    // Save lead
    await Lead.create({
      resource: resource._id,
      fullName: validated.fullName,
      email: validated.email,
      jobTitle: validated.jobTitle,
      companyName: validated.companyName,
      companySize: validated.companySize,
      phone: validated.phone || '',
      consent: Boolean(validated.consent),
    });

    // Increment downloads count
    await Resource.findByIdAndUpdate(resource._id, { $inc: { downloadsCount: 1 } });

    // Generate short-lived signed token valid for 15 minutes (Requirement 6)
    const token = await createDownloadToken({
      resourceId: resource._id.toString(),
      email: validated.email,
      slug: resource.slug,
    });

    const downloadUrl = `/api/resources/${resource.slug}/download?token=${token}`;

    return NextResponse.json({
      success: true,
      downloadUrl,
      message: 'Lead captured successfully',
    });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json(
      { message: err.message || 'Validation failed' },
      { status: 400 }
    );
  }
}
