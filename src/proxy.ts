import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'therealciso_jwt_fallback_secret_key_32chars_minimum!'
);

const COOKIE_NAME = 'therealciso_session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const token = request.cookies.get(COOKIE_NAME)?.value;

    let payload: { role?: string; email?: string } | null = null;
    if (token) {
      try {
        const verified = await jwtVerify(token, JWT_SECRET);
        payload = verified.payload as { role?: string; email?: string };
      } catch {
        payload = null;
      }
    }

    // If logged in and on login page, redirect to dashboard
    if (isLoginPage && payload) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // If unauthenticated and trying to access protected admin pages
    if (!isLoginPage && !payload) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin-only areas
    const adminOnlyRoutes = ['/admin/users', '/admin/settings'];
    if (adminOnlyRoutes.some((route) => pathname.startsWith(route)) && payload?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

