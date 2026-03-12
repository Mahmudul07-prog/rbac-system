import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/forbidden'];
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const ROUTE_PERMISSIONS: Record<string, string> = {
  '/dashboard': 'dashboard:view',
  '/users': 'users:view',
  '/leads': 'leads:view',
  '/tasks': 'tasks:view',
  '/reports': 'reports:view',
  '/audit': 'audit:view',
  '/settings': 'settings:view',
  '/portal': 'portal:view',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static assets
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect root to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check for refresh token cookie
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify session with backend
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const data = await response.json();
    const userPermissions: string[] = data.user?.permissions || [];

    // Check route permission
    const basePath = '/' + pathname.split('/')[1];
    const requiredPermission = ROUTE_PERMISSIONS[basePath];

    if (requiredPermission && !userPermissions.includes(requiredPermission)) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }

    // Set the new refresh token cookie from backend response
    const res = NextResponse.next();

    // Forward any Set-Cookie from the backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      res.headers.set('set-cookie', setCookieHeader);
    }

    return res;
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};