import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const isScanned = formData.get("isScanned") === "true"
    const profile = formData.get("profile") as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // In production, this would:
    // 1. Store files in blob storage (S3/Vercel Blob)
    // 2. Queue processing jobs (BullMQ/Celery)
    // 3. Return job IDs for status tracking

    const uploadedFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      profile,
      isScanned,
      status: "uploaded",
    }))

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${files.length} file(s) uploaded successfully`,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
