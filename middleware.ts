import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply IP restriction to /tv route
  if (request.nextUrl.pathname.startsWith("/tv")) {
    // Get the client IP address
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const clientIp = forwardedFor?.split(",")[0] || realIp || "unknown"

    // Get allowed IPs from environment variable
    const allowedIps = process.env.ALLOWED_TV_IPS?.split(",").map((ip) => ip.trim()) || []

    // If no IPs are configured, allow all (for development)
    if (allowedIps.length === 0) {
      console.log("[v0] No ALLOWED_TV_IPS configured, allowing all access to /tv")
      return NextResponse.next()
    }

    // Check if client IP is in the allowed list
    if (!allowedIps.includes(clientIp)) {
      console.log(`[v0] Access denied to /tv from IP: ${clientIp}`)
      return new NextResponse("Access Denied: Your IP address is not authorized to view this page.", {
        status: 403,
        headers: {
          "Content-Type": "text/plain",
        },
      })
    }

    console.log(`[v0] Access granted to /tv from IP: ${clientIp}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/tv/:path*"],
}
