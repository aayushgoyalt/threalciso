import { connectDB } from './db';
import { RateLimit } from '@/models/RateLimit';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export async function checkRateLimit(
  key: string,
  maxPoints: number = 5,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  await connectDB();

  const now = new Date();
  const expireAt = new Date(now.getTime() + windowSeconds * 1000);

  try {
    // Atomically find and increment, or insert if not present
    const record = await RateLimit.findOneAndUpdate(
      { key },
      {
        $inc: { points: 1 },
        $setOnInsert: { expireAt },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    const remaining = Math.max(0, maxPoints - record.points);
    const resetInSeconds = Math.max(0, Math.ceil((record.expireAt.getTime() - Date.now()) / 1000));

    if (record.points > maxPoints) {
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds,
      };
    }

    return {
      allowed: true,
      remaining,
      resetInSeconds,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // On unexpected DB error, fail-safe allow to avoid blocking valid traffic
    return {
      allowed: true,
      remaining: 1,
      resetInSeconds: windowSeconds,
    };
  }
}

