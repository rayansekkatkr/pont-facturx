import { type NextRequest, NextResponse } from "next/server";
import { fileStorage } from "@/lib/storage";
import { extractInvoiceDataWithMistralOcr } from "@/lib/mistral-ocr";
import os from "os";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

/**
 * Upload endpoint - stores PDFs temporarily and extracts basic data
 * Step 1 of the process: Upload multiple invoice PDFs
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const profile = (formData.get("profile") as string) || "basic-wl";
    const requiresOCR = formData.get("requiresOCR") === "true";

    const hasMistralKey = Boolean(process.env.MISTRAL_API_KEY);
    if (requiresOCR && !hasMistralKey) {
      return NextResponse.json(
        {
          error:
            "OCR requis, mais MISTRAL_API_KEY n'est pas configurée. Ajoute-la dans webapp/.env.local puis relance pnpm dev.",
        },
        { status: 400 },
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    console.log(`[Upload] Received ${files.length} file(s)`);

    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Generate unique ID (no longer needed for preview, but kept for backend processing)
      const fileId = `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;

      // Read file buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // NO LONGER STORING ON DISK - Using Blob URLs on client side for preview
      // Files will only be sent to backend API when user confirms the conversion

      // Extract text and parse invoice data (simplified version)
      const extractedData = await extractInvoiceData(
        buffer,
        file.name,
        requiresOCR,
      );

      const usedOcr =
        Boolean(process.env.MISTRAL_API_KEY) &&
        (requiresOCR || Boolean(process.env.MISTRAL_API_KEY));
      console.log(
        `[Upload] Extraction for ${file.name}: ${usedOcr ? "mistral_ocr" : "mock"} (requiresOCR=${requiresOCR}, hasKey=${Boolean(
          process.env.MISTRAL_API_KEY,
        )})`,
      );

      uploadedFiles.push({
        fileId,
        fileName: file.name,
        fileSize: file.size,
        extractedData,
        extractionMeta: {
          usedOcr,
          provider: usedOcr ? "mistral" : "mock",
        },
      });

      console.log(`[Upload] Processed file: ${fileId} - ${file.name} (using client-side blob for preview)`);
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      profile,
    });
  } catch (error) {
    console.error("[Upload] Error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Extract invoice data from PDF
 * This is a simplified version - in production you'd use:
 * - pdf-parse or pdfjs-dist for text extraction
 * - Regex patterns to find invoice fields
 * - ML/AI for better accuracy
 */
async function extractInvoiceData(
  buffer: Buffer,
  fileName: string,
  requiresOCR: boolean,
): Promise<any> {
  // If the user flagged the PDF as scanned, we run OCR.
  // If they didn't, we still prefer OCR when the API key is configured,
  // because it gives better prefill for /verify without changing any UX.
  const hasMistralKey = Boolean(process.env.MISTRAL_API_KEY);
  const shouldUseOcr = requiresOCR || hasMistralKey;

  if (shouldUseOcr && hasMistralKey) {
    const { invoiceData } = await extractInvoiceDataWithMistralOcr({
      pdfBuffer: buffer,
      fileName,
    });
    return invoiceData;
  }

  // Fallback: keep previous mock extraction so the app still works without API keys.
  return {
    vendorName: "ACME Corporation",
    vendorSIRET: "12345678901234",
    vendorVAT: "FR12345678901",
    vendorAddress: "123 Rue de la Paix, 75001 Paris",
    clientName: "Client SAS",
    clientSIREN: "987654321",
    clientAddress: "456 Avenue des Champs, 69001 Lyon",
    invoiceNumber: fileName
      .replace(/\.pdf$/i, "")
      .replace(/[^a-zA-Z0-9]/g, "-"),
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    amountHT: "1000.00",
    vatRate: "20.00",
    vatAmount: "200.00",
    amountTTC: "1200.00",
    iban: "FR7612345678901234567890123",
    bic: "BNPAFRPPXXX",
    paymentTerms: "30 jours",
    deliveryAddress: "",
  };
}
