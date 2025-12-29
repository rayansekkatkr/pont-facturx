import { type NextRequest, NextResponse } from "next/server"
import { fileStorage } from "@/lib/storage"

export const runtime = "nodejs"

/**
 * Upload endpoint - stores PDFs temporarily and extracts basic data
 * Step 1 of the process: Upload multiple invoice PDFs
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const profile = formData.get("profile") as string || "basic-wl"
    const requiresOCR = formData.get("requiresOCR") === "true"

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    console.log(`[Upload] Received ${files.length} file(s)`)

    const uploadedFiles = []

    for (const file of files) {
      // Generate unique ID
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Read file buffer
      const buffer = Buffer.from(await file.arrayBuffer())
      
      // Store in memory
      fileStorage.storeUploadedFile(fileId, file.name, buffer, file.type)

      // Extract text and parse invoice data (simplified version)
      const extractedData = await extractInvoiceData(buffer, file.name, requiresOCR)

      uploadedFiles.push({
        fileId,
        fileName: file.name,
        fileSize: file.size,
        extractedData,
      })

      console.log(`[Upload] Stored file: ${fileId} - ${file.name}`)
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      profile,
    })
  } catch (error) {
    console.error("[Upload] Error:", error)
    const message = error instanceof Error ? error.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 500 })
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
  requiresOCR: boolean
): Promise<any> {
  // Simulate extraction with mock data
  // In production, implement real PDF parsing here
  
  return {
    vendorName: "ACME Corporation",
    vendorSIRET: "12345678901234",
    vendorVAT: "FR12345678901",
    vendorAddress: "123 Rue de la Paix, 75001 Paris",
    clientName: "Client SAS",
    clientSIREN: "987654321",
    clientAddress: "456 Avenue des Champs, 69001 Lyon",
    invoiceNumber: fileName.replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9]/g, "-"),
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    amountHT: "1000.00",
    vatRate: "20.00",
    vatAmount: "200.00",
    amountTTC: "1200.00",
    iban: "FR7612345678901234567890123",
    bic: "BNPAFRPPXXX",
    paymentTerms: "30 jours",
    deliveryAddress: "",
  }
}
