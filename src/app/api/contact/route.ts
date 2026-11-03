import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Message } from '@/models';
import { ContactSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Rate limiting: 5 contact messages per hour per IP (Requirement 4)
    const rateCheck = await checkRateLimit(`contact:${ip}`, 5, 3600);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { message: 'Too many messages sent. Please wait before contacting again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = ContactSchema.parse(body);

    await connectDB();

    await Message.create({
      name: validated.name,
      email: validated.email.toLowerCase(),
      organization: validated.organization || '',
      subject: validated.subject,
      message: validated.message,
      status: 'unread',
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been delivered to the editorial newsroom.',
    });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json(
      { message: err.message || 'Validation failed' },
      { status: 400 }
    );
  }
}

