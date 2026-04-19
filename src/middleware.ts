import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access dashboard/trainings and no session -> Login
  if (!session && (pathname.startsWith("/dashboard") || pathname.startsWith("/trainings") || pathname.startsWith("/profile"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If already logged in and trying to access login/register -> Dashboard
  if (session && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Sliding Session - Refresh the 20-minute timer on every active request
  const response = NextResponse.next();
  if (session) {
    response.cookies.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1200, // Refresh to 20 minutes
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/trainings/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/",
  ],
};
