import crypto from 'crypto';

const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /mediapartners/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /postman/i,
  /headlesschrome/i,
  /lighthouse/i,
  /semrush/i,
  /ahrefs/i,
  /yandex/i,
  /bingbot/i,
  /googlebot/i,
  /duckduckbot/i,
  /baiduspider/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
];

export function isBot(userAgent?: string | null): boolean {
  if (!userAgent) return true; // Missing user agent is typically automated
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function generateVisitorHash(ip: string, userAgent: string, cookieId?: string): string {
  const raw = `${ip}_${userAgent}_${cookieId || 'nocookie'}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

