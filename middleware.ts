import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Si intenta acceder a /admin (excepto /admin/login y /admin/bootstrap,
    // que tienen su propia protección por secreto) sin ser admin
    if (
      pathname.startsWith('/admin') &&
      pathname !== '/admin/login' &&
      pathname !== '/admin/bootstrap'
    ) {
      if (!token || token.role !== 'admin') {
        const loginUrl = new URL('/admin/login', req.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Dejar que el middleware corra en rutas /admin aunque no haya sesión
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
