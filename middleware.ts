import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected Routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/projects(.*)",
  "/kanban(.*)",
  "/interviews(.*)",
  "/achievements(.*)",
  "/journal(.*)",
  "/analytics(.*)",
  "/aitasks(.*)",
  "/resume(.*)",
  "/heatmap(.*)",
  "/settings(.*)",

  // Only AI API should be protected
  "/api/ai(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Agar route protected hai aur user logged-in NAHI hai
  if (isProtectedRoute(req) && !userId) {
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

    // Run middleware for AI API
    "/api/:path*",
  ],
};