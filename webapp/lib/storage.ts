// Simple in-memory storage for uploaded files
// In production, use Redis, S3, or a proper database

interface StoredFile {
  id: string
  fileName: string
  buffer: Buffer
  mimeType: string
  uploadedAt: Date
}

interface ExtractedData {
  vendorName: string
  vendorSIRET: string
  vendorVAT: string
  vendorAddress: string
  clientName: string
  clientSIREN: string
  clientAddress: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  amountHT: string
  vatRate: string
  vatAmount: string
  amountTTC: string
  iban: string
  bic: string
  paymentTerms: string
}

interface ProcessedFile {
  id: string
  originalFileName: string
  extractedData: ExtractedData
  facturXPdf?: Buffer
  facturXXml?: string
  validationReport?: string
}

class FileStorage {
  private uploadedFiles = new Map<string, StoredFile>()
  private processedFiles = new Map<string, ProcessedFile>()

  storeUploadedFile(id: string, fileName: string, buffer: Buffer, mimeType: string): void {
    this.uploadedFiles.set(id, {
      id,
      fileName,
      buffer,
      mimeType,
      uploadedAt: new Date(),
    })
  }

  getUploadedFile(id: string): StoredFile | undefined {
    return this.uploadedFiles.get(id)
  }

  storeProcessedFile(data: ProcessedFile): void {
    this.processedFiles.set(data.id, data)
  }

  getProcessedFile(id: string): ProcessedFile | undefined {
    return this.processedFiles.get(id)
  }

  deleteUploadedFile(id: string): void {
    this.uploadedFiles.delete(id)
  }

  deleteProcessedFile(id: string): void {
    this.processedFiles.delete(id)
  }

  // Cleanup old files (older than 1 hour)
  cleanup(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    for (const [id, file] of this.uploadedFiles.entries()) {
      if (file.uploadedAt < oneHourAgo) {
        this.uploadedFiles.delete(id)
      }
    }
  }
}

// Singleton instance
export const fileStorage = new FileStorage()

// Run cleanup every 10 minutes
if (typeof window === "undefined") {
  setInterval(() => fileStorage.cleanup(), 10 * 60 * 1000)
}
