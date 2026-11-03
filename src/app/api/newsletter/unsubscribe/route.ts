import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Subscriber } from '@/models';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    await connectDB();

    const sub = await Subscriber.findOne({ token });
    if (!sub) {
      return NextResponse.json(
        { message: 'Invalid or expired unsubscribe link' },
        { status: 404 }
      );
    }

    sub.status = 'unsubscribed';
    await sub.save();

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from THEREALCISO mailings.',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

