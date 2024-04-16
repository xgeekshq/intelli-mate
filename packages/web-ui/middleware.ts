import { NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/admin', /^\/admin\/.*/],
  beforeAuth(req) {
    const requestHeaders = new Headers(req.headers);

    const url = new URL(req.url);
    const pathname = url.pathname;

    requestHeaders.set('url-path', pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
