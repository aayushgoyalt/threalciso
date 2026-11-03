export function calculateReadingTime(htmlOrText: string): number {
  if (!htmlOrText) return 1;
  // Strip HTML tags
  const plainText = htmlOrText.replace(/<[^>]*>/g, ' ');
  // Count words
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  // Standard reading speed is 200 words per minute
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
}

