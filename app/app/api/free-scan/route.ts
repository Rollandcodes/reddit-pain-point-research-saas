import { NextRequest, NextResponse } from "next/server"

/**
 * Free Scan API Endpoint
 * 
 * This endpoint will return 5 sample pain points for a given keyword.
 * Currently returns mock data - replace with actual data source when ready.
 * 
 * @param request - Next.js request object
 * @returns JSON response with pain points array
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const keyword = searchParams.get("keyword")

    if (!keyword || keyword.trim().length === 0) {
      return NextResponse.json(
        { error: "Keyword parameter is required" },
        { status: 400 }
      )
    }

    // TODO: Replace with actual data source (JSON file, database, etc.)
    // For now, return mock data
    const mockPainPoints = [
      {
        title: "Sample pain point 1",
        severity: 85,
        quote: "Sample quote from Reddit user",
        mentions: 200,
      },
      {
        title: "Sample pain point 2",
        severity: 78,
        quote: "Another sample quote",
        mentions: 150,
      },
      {
        title: "Sample pain point 3",
        severity: 72,
        quote: "Third sample quote",
        mentions: 120,
      },
      {
        title: "Sample pain point 4",
        severity: 68,
        quote: "Fourth sample quote",
        mentions: 100,
      },
      {
        title: "Sample pain point 5",
        severity: 65,
        quote: "Fifth sample quote",
        mentions: 90,
      },
    ]

    // Return 5 pain points (limit as requested)
    return NextResponse.json({
      keyword: keyword.trim(),
      painPoints: mockPainPoints.slice(0, 5),
      totalFound: mockPainPoints.length,
    })
  } catch (error) {
    console.error("Error in free-scan API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

