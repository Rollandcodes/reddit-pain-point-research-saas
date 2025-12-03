import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/waitlist(.*)",
  "/sample-report(.*)",
  "/health(.*)",
])

export default clerkMiddleware((auth, request) => {
  // Allow public routes without authentication
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }
  
  // Protect non-public routes
  auth().protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
