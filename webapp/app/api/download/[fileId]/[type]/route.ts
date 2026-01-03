import { type NextRequest, NextResponse } from "next/server";
import { fileStorage } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string; type: string }> },
) {
  try {
    const { fileId, type } = await params;

    console.log("[Download] Request:", fileId, type);

    // Get processed file from storage
    const processedFile = fileStorage.getProcessedFile(fileId);

    if (!processedFile) {
      return new NextResponse("File not found", { status: 404 });
    }

    let content: Buffer | string;
    let filename: string;
    let mimeType: string;

    switch (type) {
      case "facturx.pdf":
        if (!processedFile.facturXPdf) {
          return new NextResponse("PDF not found", { status: 404 });
        }
        content = processedFile.facturXPdf;
        filename = `facturx_${processedFile.originalFileName}`;
        mimeType = "application/pdf";
        break;
      case "invoice.xml":
        if (!processedFile.facturXXml) {
          return new NextResponse("XML not found", { status: 404 });
        }
        content = processedFile.facturXXml;
        filename = `invoice_${fileId}.xml`;
        mimeType = "application/xml";
        break;
      case "validation-report.pdf":
        if (!processedFile.validationReport) {
          return new NextResponse("Report not found", { status: 404 });
        }
        // Generate PDF from validation report text
        content = generateValidationReportPdf(processedFile.validationReport);
        filename = `validation_${fileId}.pdf`;
        mimeType = "application/pdf";
        break;
      default:
        return new NextResponse("Invalid file type", { status: 400 });
    }

    // Convert Buffer to Uint8Array for NextResponse
    const bodyContent =
      typeof content === "string" ? content : new Uint8Array(content);

    return new NextResponse(bodyContent, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[Download] Error:", error);
    const message = error instanceof Error ? error.message : "Download failed";
    return new NextResponse(message, { status: 500 });
  }
}

function generateValidationReportPdf(reportText: string): Buffer {
  // In production, use pdf-lib or pdfkit to generate a proper PDF
  // For now, return a simple text-based PDF
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length ${reportText.length + 20}
>>
stream
BT
/F1 10 Tf
50 700 Td
${reportText
  .split("\n")
  .map((line, i) => `(${line}) Tj 0 -15 Td`)
  .join(" ")}
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000200 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${284 + reportText.length}
%%EOF`;

  return Buffer.from(pdfContent, "utf-8");
}
