import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { generateSolutionIdeas } from "@/lib/ai"
import { isAIAvailable } from "@/lib/ai"

/**
 * POST /api/clusters/[id]/solutions
 * Generate AI-powered solution ideas for a cluster
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if AI is available
    if (!isAIAvailable()) {
      return NextResponse.json(
        { error: "AI service is not configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY." },
        { status: 503 }
      )
    }

    // Get cluster with examples
    const cluster = await prisma.cluster.findUnique({
      where: { id: params.id },
      include: {
        scanJob: true,
        examples: true,
      },
    })

    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" }, { status: 404 })
    }

    // Check ownership
    if (cluster.scanJob.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Prepare data for AI
    const items = cluster.examples.map((ex) => ({
      text: ex.quoteText,
      score: 1, // Default score for examples
    }))

    // Generate solution ideas
    const solution = await generateSolutionIdeas(
      cluster.name,
      cluster.description || "",
      items
    )

    return NextResponse.json({
      success: true,
      solution,
    })
  } catch (error) {
    console.error("Solution generation error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate solution ideas",
      },
      { status: 500 }
    )
  }
}

