import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Detect app subdomain: app.athenastudios.com.br or app.localhost
  const isAppSubdomain =
    hostname.startsWith("app.") ||
    hostname.startsWith("app.localhost");

  if (isAppSubdomain) {
    // Rewrite app subdomain requests to /dashboard/*
    // Skip if already targeting /dashboard or api/auth
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    // Rewrite / -> /dashboard, /projects -> /dashboard/projects, etc.
    const dashboardPath = pathname === "/" ? "/dashboard" : `/dashboard${pathname}`;
    return NextResponse.rewrite(new URL(dashboardPath, request.url));
  }

  // For main domain, block direct access to /dashboard (except for dev)
  // In production, /dashboard should only be accessed via subdomain
  // In dev, allow direct access for convenience

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
