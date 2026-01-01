import { NextResponse } from "next/server"
import crypto from "node:crypto"

export const runtime = "nodejs"

export async function GET() {
  const sessionId = crypto.randomUUID()
  return NextResponse.json({ sessionId })
}
