import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  try {
    // Only protect dashboard routes, everything else is public
    if (isProtectedRoute(req)) {
      await auth.protect()
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // Don't block the request on middleware errors for public routes
    if (!isProtectedRoute(req)) {
      return NextResponse.next()
    }
    throw error
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
