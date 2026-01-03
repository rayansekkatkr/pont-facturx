import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { fileId, isScanned } = (await request.json()) as {
      fileId: string;
      isScanned: boolean;
    };

    if (!fileId) {
      return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
    }

    console.log("[v0] Extracting data from:", fileId, "OCR:", isScanned);

    // In production, this would:
    // 1. Load PDF from storage
    // 2. If scanned: Run OCR (Tesseract/Cloud Vision)
    // 3. Extract text from PDF
    // 4. Use rules + regex for structured data (dates, amounts, SIRET, etc.)
    // 5. Use LLM (Gemini/GPT) for complex fields (addresses, names)
    // 6. Calculate confidence scores for each field
    // 7. Return structured invoice data + confidence scores

    // Simulate extraction time
    await new Promise((resolve) =>
      setTimeout(resolve, isScanned ? 5000 : 2000),
    );

    // Mock extracted data
    const extractedData = {
      vendorName: "Entreprise ABC SAS",
      vendorSIRET: "12345678900012",
      vendorVAT: "FR12345678900",
      vendorAddress: "123 Rue de la République\n75001 Paris, France",
      clientName: "Client XYZ SARL",
      clientSIREN: "98765432100",
      clientAddress: "456 Avenue des Champs\n69000 Lyon, France",
      invoiceNumber: "INV-2024-001",
      invoiceDate: "2024-12-28",
      dueDate: "2025-01-28",
      amountHT: "1041.67",
      vatRate: "20",
      vatAmount: "208.33",
      amountTTC: "1250.00",
      iban: "FR76 1234 5678 9012 3456 7890 123",
      bic: "BNPAFRPPXXX",
      paymentTerms: "30 jours nets",
      deliveryAddress: "",
    };

    const confidenceScores = {
      vendorSIRET: 75,
      clientSIREN: 68,
      vendorVAT: 92,
      invoiceNumber: 98,
      amountTTC: 95,
      invoiceDate: 94,
      amountHT: 93,
    };

    // Fields that need verification (confidence < 80%)
    const fieldsToVerify = Object.entries(confidenceScores)
      .filter(([_, score]) => score < 80)
      .map(([field]) => field);

    return NextResponse.json({
      success: true,
      data: extractedData,
      confidenceScores,
      fieldsToVerify,
    });
  } catch (error) {
    console.error("[v0] Extraction error:", error);
    return NextResponse.json({ error: "Extraction failed" }, { status: 500 });
  }
}
