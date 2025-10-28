import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/" || pathname.startsWith("/api/")) {
    // Skip auth check for login page and auth API routes
    if (pathname === "/login" || pathname.startsWith("/api/auth/")) {
      return NextResponse.next()
    }

    // Check for admin authentication cookie
    const authCookie = request.cookies.get("admin_auth")

    if (!authCookie || authCookie.value !== "authenticated") {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/api/:path*"],
}
