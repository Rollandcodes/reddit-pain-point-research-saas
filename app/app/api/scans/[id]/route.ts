import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const scan = await prisma.scanJob.findUnique({
      where: { id: params.id },
      include: {
        clusters: {
          include: {
            examples: true,
          },
          orderBy: { opportunityScore: "desc" },
        },
      },
    })

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Check ownership
    if (scan.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ scan })
  } catch (error) {
    console.error("Get scan error:", error)
    return NextResponse.json(
      { error: "Failed to fetch scan" },
      { status: 500 }
    )
  }
}
