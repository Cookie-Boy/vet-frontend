import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenExpired } from "./lib/auth/refresh-token";

export default withAuth(
  async function middleware(req: NextRequest) {
    const { getToken } = await import("next-auth/jwt");
    const token = await getToken({ req });
    
    // Если токена нет — редирект на логин (обработает withAuth)
    if (!token) {
      return NextResponse.next();
    }
    
    const accessToken = token.accessToken as string;
    
    // Если access token истёк — редиректим на /login
    if (accessToken && isTokenExpired(accessToken)) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    // Исключаем /register, /api/auth/* и статику
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|login|register|qr-scan).*)",
  ],
};