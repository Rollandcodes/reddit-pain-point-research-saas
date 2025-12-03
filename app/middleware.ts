import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Only run middleware on specific paths, exclude _not-found and other internals
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - _not-found (Next.js internal)
     */
    "/((?!_next/static|_next/image|favicon.ico|_not-found|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
