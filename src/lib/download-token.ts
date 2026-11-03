import { SignJWT, jwtVerify } from 'jose';

const DOWNLOAD_SECRET = new TextEncoder().encode(
  process.env.DOWNLOAD_TOKEN_SECRET || 'therealciso_download_secret_token_default_key_2026'
);

export interface DownloadTokenPayload {
  resourceId: string;
  email: string;
  slug: string;
}

export async function createDownloadToken(payload: DownloadTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m') // Valid for 15 minutes only
    .sign(DOWNLOAD_SECRET);
}

export async function verifyDownloadToken(token: string): Promise<DownloadTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, DOWNLOAD_SECRET);
    return payload as unknown as DownloadTokenPayload;
  } catch {
    return null;
  }
}

