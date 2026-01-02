import "server-only";

type InvoiceData = {
  vendorName: string;
  vendorSIRET: string;
  vendorVAT: string;
  vendorAddress: string;
  clientName: string;
  clientSIREN: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amountHT: string;
  vatRate: string;
  vatAmount: string;
  amountTTC: string;
  iban: string;
  bic: string;
  paymentTerms: string;
  deliveryAddress?: string;
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function safeJsonParse<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Common failure mode: model returns fenced JSON
    const cleaned = raw
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return JSON.parse(cleaned) as T;
  }
}

function coerceInvoiceData(
  partial: Partial<InvoiceData>,
  fileName: string,
): InvoiceData {
  const today = new Date().toISOString().split("T")[0];

  return {
    vendorName: partial.vendorName ?? "",
    vendorSIRET: partial.vendorSIRET ?? "",
    vendorVAT: partial.vendorVAT ?? "",
    vendorAddress: partial.vendorAddress ?? "",
    clientName: partial.clientName ?? "",
    clientSIREN: partial.clientSIREN ?? "",
    clientAddress: partial.clientAddress ?? "",
    invoiceNumber:
      partial.invoiceNumber ??
      fileName.replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9]/g, "-"),
    invoiceDate: partial.invoiceDate ?? today,
    dueDate: partial.dueDate ?? today,
    amountHT: partial.amountHT ?? "",
    vatRate: partial.vatRate ?? "",
    vatAmount: partial.vatAmount ?? "",
    amountTTC: partial.amountTTC ?? "",
    iban: partial.iban ?? "",
    bic: partial.bic ?? "",
    paymentTerms: partial.paymentTerms ?? "",
    deliveryAddress: partial.deliveryAddress ?? "",
  };
}

export async function extractInvoiceDataWithMistralOcr(params: {
  pdfBuffer: Buffer;
  fileName: string;
  ocrModel?: string;
  extractionModel?: string;
}): Promise<{ invoiceData: InvoiceData; ocrMarkdown: string }> {
  const apiKey = getEnv("MISTRAL_API_KEY");

  // Lazy import so the dependency is only required in the Node runtime.
  const { Mistral } = await import("@mistralai/mistralai");

  const client = new Mistral({ apiKey });

  const ocrModel = params.ocrModel ?? "mistral-ocr-latest";

  // Mistral OCR expects a file reference (fileId). So we upload first, then OCR.
  // This matches the SDK example in node_modules/@mistralai/mistralai/examples.
  const uploadedPdf = await client.files.upload({
    file: {
      fileName: params.fileName,
      content: params.pdfBuffer,
    },
    purpose: "ocr",
  });

  let ocrResult: any;
  try {
    ocrResult = await client.ocr.process({
      model: ocrModel,
      document: {
        type: "file",
        fileId: uploadedPdf.id,
      },
      // Keep it simple for downstream parsing
      tableFormat: "markdown",
      includeImageBase64: false,
    });
  } finally {
    // Best-effort cleanup: the OCR file upload is temporary.
    try {
      await client.files.delete({ fileId: uploadedPdf.id });
    } catch {
      // ignore cleanup failures
    }
  }

  const pages = Array.isArray(ocrResult?.pages) ? ocrResult.pages : [];
  const ocrMarkdown = pages
    .map((p: any) => (typeof p?.markdown === "string" ? p.markdown : ""))
    .filter(Boolean)
    .join("\n\n---\n\n");

  if (!ocrMarkdown.trim()) {
    // If OCR returns nothing, don't call the extraction model (it would hallucinate).
    const invoiceData = coerceInvoiceData({}, params.fileName);
    return { invoiceData, ocrMarkdown: "" };
  }

  // Second pass: convert OCR markdown into the exact shape the app expects.
  const extractionModel = params.extractionModel ?? "mistral-small-latest";

  const system =
    "You are an invoice data extraction engine. " +
    "The input is OCR markdown from a French invoice PDF. " +
    "Extract the seller (vendeur/fournisseur) and buyer (client) details, invoice dates, totals, and bank info. " +
    "If there are multiple candidates, pick the most plausible. " +
    "Never invent values: if unknown, return empty string.";

  const prompt =
    `Return ONLY a JSON object with EXACT keys:\n` +
    `vendorName, vendorSIRET, vendorVAT, vendorAddress, clientName, clientSIREN, clientAddress,\n` +
    `invoiceNumber, invoiceDate, dueDate, amountHT, vatRate, vatAmount, amountTTC, iban, bic, paymentTerms, deliveryAddress.\n\n` +
    `Rules:\n` +
    `- Use empty string if missing/unknown.\n` +
    `- Dates: YYYY-MM-DD if possible, else empty string.\n` +
    `- amountHT/vatAmount/amountTTC: strings with 2 decimals using '.' (e.g. 1200.00).\n` +
    `- vatRate: percent as string with 2 decimals (e.g. 20.00).\n` +
    `- vendorSIRET is usually 14 digits; clientSIREN is usually 9 digits (France).\n` +
    `- vendorVAT often starts with 'FR'.\n\n` +
    `File name: ${params.fileName}\n\n` +
    `OCR markdown:\n${ocrMarkdown.slice(0, 120_000)}`;

  // Use the SDK structured parser (Zod) for maximum consistency.
  const { z } = await import("zod");
  const zString = z.preprocess((v) => (v == null ? "" : String(v)), z.string());
  const InvoiceDataSchema = z.object({
    vendorName: zString,
    vendorSIRET: zString,
    vendorVAT: zString,
    vendorAddress: zString,
    clientName: zString,
    clientSIREN: zString,
    clientAddress: zString,
    invoiceNumber: zString,
    invoiceDate: zString,
    dueDate: zString,
    amountHT: zString,
    vatRate: zString,
    vatAmount: zString,
    amountTTC: zString,
    iban: zString,
    bic: zString,
    paymentTerms: zString,
    deliveryAddress: zString,
  });

  let parsed: Partial<InvoiceData>;
  try {
    const parsedResponse = await client.chat.parse({
      model: extractionModel,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      responseFormat: InvoiceDataSchema,
    });

    const structured = parsedResponse?.choices?.[0]?.message?.parsed;
    parsed = structured ?? {};
  } catch {
    // Fallback: still try to parse a json_object response.
    const completion = await client.chat.complete({
      model: extractionModel,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      responseFormat: { type: "json_object" },
    });
    const content = completion?.choices?.[0]?.message?.content;
    const raw = typeof content === "string" ? content : JSON.stringify(content);
    parsed = safeJsonParse<Partial<InvoiceData>>(raw);
  }

  const invoiceData = coerceInvoiceData(parsed, params.fileName);

  return { invoiceData, ocrMarkdown };
}
