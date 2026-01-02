import { type NextRequest, NextResponse } from "next/server";
import { fileStorage } from "@/lib/storage";
import os from "os";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params;

    // Try in-memory first.
    const storedFile = fileStorage.getUploadedFile(fileId);
    if (storedFile) {
      return new NextResponse(new Uint8Array(storedFile.buffer), {
        headers: {
          "Content-Type": storedFile.mimeType || "application/pdf",
          "Content-Disposition": `inline; filename="${storedFile.fileName}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Fallback to disk (tmp) for dev / multi-worker setups.
    const uploadDir = path.join(os.tmpdir(), "pont-facturx", "uploaded");
    const pdfPath = path.join(uploadDir, `${fileId}.pdf`);
    const metaPath = path.join(uploadDir, `${fileId}.json`);

    const [pdfBuffer, metaRaw] = await Promise.all([
      fs.readFile(pdfPath),
      fs.readFile(metaPath, "utf-8"),
    ]);

    const meta = JSON.parse(metaRaw) as {
      fileName?: string;
      mimeType?: string;
    };
    const fileName = meta.fileName ?? `${fileId}.pdf`;
    const mimeType = meta.mimeType ?? "application/pdf";

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[Uploaded] Error:", error);
    const message = error instanceof Error ? error.message : "Download failed";
    return new NextResponse(message, { status: 500 });
  }
}
