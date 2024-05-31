import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // add accessToken cookie and use refreshToken as httponly credential cookie on each request

}
//   return NextResponse.redirect(new URL('/', request.url));

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*',
};
