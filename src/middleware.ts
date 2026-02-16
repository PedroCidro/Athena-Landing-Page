import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyAuthCookie(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get("dashboard-auth");
  if (!cookie?.value) return false;

  const secret = process.env.NEXTAUTH_SECRET || process.env.DASHBOARD_PASSWORD || "";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode("authenticated"));
  const expected = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return cookie.value === expected;
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Detect app subdomain: app.athenastudios.com.br or app.localhost
  const isAppSubdomain =
    hostname.startsWith("app.") ||
    hostname.startsWith("app.localhost");

  if (isAppSubdomain) {
    // Rewrite app subdomain requests to /dashboard/*
    // Skip if already targeting /dashboard
    if (pathname.startsWith("/dashboard")) {
      return handleDashboardAuth(request, pathname);
    }

    // Rewrite / -> /dashboard, /projects -> /dashboard/projects, etc.
    const dashboardPath = pathname === "/" ? "/dashboard" : `/dashboard${pathname}`;

    // Check auth for the rewritten path too
    if (dashboardPath !== "/dashboard/login") {
      if (!(await verifyAuthCookie(request))) {
        return NextResponse.redirect(new URL("/dashboard/login", request.url));
      }
    }

    return NextResponse.rewrite(new URL(dashboardPath, request.url));
  }

  // For main domain, check dashboard auth
  if (pathname.startsWith("/dashboard")) {
    return handleDashboardAuth(request, pathname);
  }

  return NextResponse.next();
}

async function handleDashboardAuth(request: NextRequest, pathname: string): Promise<NextResponse> {
  // Allow login page without auth
  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  // Check auth cookie
  if (!(await verifyAuthCookie(request))) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
