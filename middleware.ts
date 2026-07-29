

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected route paths define karein
const protectedPaths = [
  "/dashboard",
  "/projects",
  "/kanban",
  "/interviews",
  "/achievements",
  "/journal",
  "/analytics",
  "/aitasks",
  "/resume",
  "/heatmap",
  "/settings",
  "/api/ai",
];

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Check karein ki current path protected list mein hai ya nahi
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Agar route protected hai aur user logged-in NAHI hai
  if (isProtected && !userId) {
    const homeUrl = new URL("/", req.url);
    homeUrl.searchParams.set("auth_error", "please_login");

    return NextResponse.redirect(homeUrl);
  }

  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  return response;
});

export const config = {
  matcher: [
    // Ignore Next.js internals & static assets
    "/((?!_next|.*\\..*).*)",

    // Run middleware for API routes
    "/api/:path*",
  ],
};