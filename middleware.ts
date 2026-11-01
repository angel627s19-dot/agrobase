import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  // Protected Admin Routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Simplified cookie check for demo
    const cookieHeader = request.headers.get('cookie') || '';
    const hasToken = cookieHeader.includes('auth-token=');
    
    if (!hasToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // API Routes CORS & Headers
  if (pathname.startsWith('/api')) {
    const res = NextResponse.next();
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
