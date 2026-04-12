import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Можно добавить кастомную логику, например проверку ролей
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt (common static files)
     * - login page (public)
     * - qr scan public page (we'll set it up later)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|login|qr-scan).*)",
  ],
};