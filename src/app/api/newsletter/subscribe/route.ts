import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Subscriber } from '@/models';
import { NewsletterSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/newsletter';

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Rate limiting: 5 subscriptions per 10 minutes per IP
    const rateCheck = await checkRateLimit(`newsletter:${ip}`, 5, 600);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { message: 'Too many subscription requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = NewsletterSchema.parse(body);

    await connectDB();

    const existing = await Subscriber.findOne({ email: validated.email.toLowerCase() });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        existing.frequency = validated.frequency;
        await existing.save();
        return NextResponse.json({ message: 'Welcome back! Your subscription is reactivated.' });
      }
      return NextResponse.json(
        { message: 'This email is already subscribed to THEREALCISO briefings.' },
        { status: 200 }
      );
    }

    const newSub = await Subscriber.create({
      email: validated.email.toLowerCase(),
      frequency: validated.frequency,
      status: 'active',
    });

    // Send confirmation email via Resend (Requirement 10)
    const unsubscribeLink = `${
      process.env.NEXTAUTH_URL || 'http://localhost:3000'
    }/newsletter/unsubscribe?token=${newSub.token}`;

    await sendEmail({
      to: validated.email,
      subject: 'Welcome to THEREALCISO Executive Briefings',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0F172A;">
          <h2 style="color: #0A2540; margin-bottom: 8px;">THEREALCISO Intelligence</h2>
          <p style="font-size: 16px; line-height: 1.6;">You are confirmed for the <strong>${validated.frequency.toUpperCase()}</strong> Executive Briefing.</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">You will receive timely threat intelligence, zero-day alerts, and regulatory analysis curated specifically for cybersecurity leadership in India.</p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94A3B8;">To manage your preferences or unsubscribe at any time, <a href="${unsubscribeLink}" style="color: #0E7490;">click here</a>.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription successful! Please check your inbox.',
    });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json(
      { message: err.message || 'Subscription failed' },
      { status: 400 }
    );
  }
}

