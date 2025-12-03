import { clerkMiddleware } from "@clerk/nextjs/server"

// Make all routes public to test if Clerk is working
export default clerkMiddleware()

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
