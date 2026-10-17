import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/student", "/instructor"];

const authRoutes = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const hasRefreshToken = request.cookies.has("refreshToken");

  if (isProtectedRoute && !hasRefreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && hasRefreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/instructor/:path*", "/login", "/signup"],
};
