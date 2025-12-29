import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: NextRequest, { params }: { params: { fileId: string; type: string } }) {
  try {
    const { fileId, type } = params

    console.log("[v0] Download request:", fileId, type)

    // In production, this would:
    // 1. Verify user has access to this file
    // 2. Fetch file from blob storage
    // 3. Stream file to response with correct headers

    // For now, return a mock response
    const mimeTypes: Record<string, string> = {
      "facturx.pdf": "application/pdf",
      "invoice.xml": "application/xml",
      "validation-report.pdf": "application/pdf",
    }

    const mimeType = mimeTypes[type] || "application/octet-stream"

    return new NextResponse("Mock file content", {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${type}"`,
      },
    })
  } catch (error) {
    console.error("[v0] Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
