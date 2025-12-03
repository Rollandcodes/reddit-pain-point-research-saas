import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { waitlistSchema } from "@/lib/validations"
import { trackServerEvent } from "@/lib/analytics"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = waitlistSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, role, useCase } = result.data

    // Check if email already exists
    const existing = await prisma.waitlistSignup.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 }
      )
    }

    // Create signup
    const signup = await prisma.waitlistSignup.create({
      data: {
        email,
        role,
        useCase,
      },
    })

    // Track event
    await trackServerEvent("waitlist_signup_submitted", undefined, {
      role,
      hasUseCase: !!useCase,
    })

    return NextResponse.json(
      { success: true, id: signup.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Waitlist signup error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
