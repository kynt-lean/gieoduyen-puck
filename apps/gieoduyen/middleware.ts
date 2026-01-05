import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Simple admin authentication check
// TODO: Implement proper authentication for production
function isAdmin(request: NextRequest): boolean {
  // Check for admin session cookie
  const adminSession = request.cookies.get("gieoduyen-admin-session");

  // Check role from cookie
  const role = adminSession?.value;
  const hasAdminRole = role === "admin" || role === "authenticated"; // Support legacy "authenticated" value

  return hasAdminRole;
}

// Simple user authentication check
// TODO: Implement proper authentication for production
function isUser(request: NextRequest): boolean {
  const userSession = request.cookies.get("gieoduyen-user-session");
  const role = userSession?.value;
  return role === "user";
}

// Check if user is authenticated (either admin or user)
function isAuthenticated(request: NextRequest): boolean {
  return isAdmin(request) || isUser(request);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude login routes from protection (public routes)
  // Login routes are now at /login and /api/login (not nested in admin)
  const isLoginRoute = 
    pathname === "/login" ||
    pathname === "/api/login";

  if (isLoginRoute) {
    return NextResponse.next();
  }

  // Protect admin routes (only admin can access)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAdmin(request)) {
      // Redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect edit routes (any authenticated user can access)
  // Edit routes are identified by path ending with /edit
  if (pathname.endsWith("/edit")) {
    if (!isAuthenticated(request)) {
      // Redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/login/:path*",
    "/api/login/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|templates).*)", // Match all routes except static files and public templates
  ],
};

