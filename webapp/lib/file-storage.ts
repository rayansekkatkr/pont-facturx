// Shared file storage for demo purposes
// In production, use a proper storage solution like AWS S3, Vercel Blob, etc.

interface StoredFile {
  id: string;
  originalName: string;
  content: string;
  processedContent?: string;
  uploadedAt: Date;
  metadata?: any;
}

class FileStorage {
  private files = new Map<string, StoredFile>();

  set(id: string, file: StoredFile) {
    this.files.set(id, file);
  }

  get(id: string): StoredFile | undefined {
    return this.files.get(id);
  }

  delete(id: string) {
    this.files.delete(id);
  }

  list(): StoredFile[] {
    return Array.from(this.files.values());
  }
}

export const fileStorage = new FileStorage();

export async function storeUploadedFile(fileId: string, file: File) {
  const content = await file.arrayBuffer();
  const storedFile: StoredFile = {
    id: fileId,
    originalName: file.name,
    content: Buffer.from(content).toString("base64"), // Store as base64 for demo
    uploadedAt: new Date(),
  };
  fileStorage.set(fileId, storedFile);
}
