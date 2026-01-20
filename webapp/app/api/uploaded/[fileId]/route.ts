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
    console.log(`[Uploaded] Request for fileId: ${fileId}`);

    // In production with multiple workers, always read from disk
    const uploadDir = path.join(os.tmpdir(), "pont-facturx", "uploaded");
    const pdfPath = path.join(uploadDir, `${fileId}.pdf`);
    const metaPath = path.join(uploadDir, `${fileId}.json`);

    try {
      console.log(`[Uploaded] Looking for file at: ${pdfPath}`);
      
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

      console.log(`[Uploaded] Found on disk: ${fileName}`);
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `inline; filename="${fileName}"`,
          "Cache-Control": "no-store",
        },
      });
    } catch (diskError) {
      // Fallback to in-memory if disk read fails
      console.log(`[Uploaded] Disk read failed, trying memory for: ${fileId}`);
      const storedFile = fileStorage.getUploadedFile(fileId);
      if (storedFile) {
        console.log(`[Uploaded] Found in memory: ${fileId}`);
        return new NextResponse(new Uint8Array(storedFile.buffer), {
          headers: {
            "Content-Type": storedFile.mimeType || "application/pdf",
            "Content-Disposition": `inline; filename="${storedFile.fileName}"`,
            "Cache-Control": "no-store",
          },
        });
      }
      throw diskError;
    }
  } catch (error) {
    console.error("[Uploaded] Error:", error);
    console.error("[Uploaded] Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      code: (error as any)?.code,
    });
    const message = error instanceof Error ? error.message : "Download failed";
    return new NextResponse(message, { status: 500 });
  }
}
