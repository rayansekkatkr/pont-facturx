"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PDFPreview } from "@/components/pdf-preview";
import { InvoiceForm } from "@/components/invoice-form";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

interface UploadedFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  extractedData: any;
  base64?: string;
}

export function VerificationInterface() {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [invoiceDataList, setInvoiceDataList] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function readApiErrorMessage(res: Response): Promise<string> {
    try {
      const data = await res.json();
      const msg =
        (data as any)?.error || (data as any)?.message || (data as any)?.detail;
      if (typeof msg === "string" && msg.trim()) return msg;
      return JSON.stringify(data);
    } catch {
      try {
        const text = await res.text();
        return text || `HTTP ${res.status}`;
      } catch {
        return `HTTP ${res.status}`;
      }
    }
  }

  useEffect(() => {
    const filesData = sessionStorage.getItem("uploadedFiles");
    if (!filesData) {
      router.push("/upload");
      return;
    }

    try {
      const files: UploadedFile[] = JSON.parse(filesData);
      if (!Array.isArray(files) || files.length === 0) {
        router.push("/upload");
        return;
      }
      setUploadedFiles(files);
      setInvoiceDataList(files.map((f) => f?.extractedData ?? {}));
      setCurrentFileIndex(0);
    } catch (e) {
      console.error("Failed to parse uploadedFiles from sessionStorage", e);
      setError("Impossible de charger les fichiers uploadés. Merci de réessayer.");
      router.push("/upload");
    }
  }, [router]);

  const handleInvoiceDataChange = (data: any) => {
    const newList = [...invoiceDataList];
    newList[currentFileIndex] = data;
    setInvoiceDataList(newList);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    setError("");

    try {
      const profile =
        sessionStorage
          .getItem("uploadProfile")
          ?.replace(/-/g, "_")
          ?.toUpperCase() ?? "BASIC_WL";

      const results = [] as Array<{ id: string; fileName: string } & Record<string, any>>;

      for (let index = 0; index < uploadedFiles.length; index += 1) {
        const file = uploadedFiles[index];
        const res = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileId: file.fileId,
            fileName: file.fileName,
            fileBase64: file.base64,
            invoiceData: invoiceDataList[index],
            profile,
          }),
        });

        if (!res.ok) {
          const msg = await readApiErrorMessage(res);
          throw new Error(`Processing failed (${res.status}): ${msg}`);
        }

        const data = await res.json();
        const result = (data as any)?.result ?? data;
        results.push({
          ...result,
          id: result?.id ?? file.fileId,
          fileName: file.fileName,
        });
      }

      sessionStorage.setItem("processedResults", JSON.stringify(results));
      router.push("/results");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de validation";
      setError(message);
      console.error("Validation error:", err);
    } finally {
      setIsValidating(false);
    }
  };

  if (uploadedFiles.length === 0) {
    return <div>Chargement...</div>;
  }

  const currentFile = uploadedFiles[currentFileIndex];
  const fieldsToVerify = ["vendorSIRET", "clientSIREN"];

  return (
    <div className="space-y-6">
      {uploadedFiles.length > 1 && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <AlertCircle className="mr-2 inline h-4 w-4 text-slate-400" />
          Fichier {currentFileIndex + 1} sur {uploadedFiles.length}: {currentFile.fileName}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mr-2 inline h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-5 lg:sticky lg:top-28">
          <PDFPreview fileId={currentFile?.fileId} fileName={currentFile?.fileName} />
        </aside>

        <section className="lg:col-span-7 space-y-6">
          <InvoiceForm
            fieldsToVerify={fieldsToVerify}
            initialData={invoiceDataList[currentFileIndex]}
            onChange={handleInvoiceDataChange}
          />

          {uploadedFiles.length > 1 && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentFileIndex(Math.max(0, currentFileIndex - 1))}
                disabled={currentFileIndex === 0}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentFileIndex(Math.min(uploadedFiles.length - 1, currentFileIndex + 1))
                }
                disabled={currentFileIndex === uploadedFiles.length - 1}
              >
                Suivant
              </Button>
            </div>
          )}

          <div className="flex flex-col items-start justify-between gap-6 pt-2 md:flex-row md:items-center">
            <div className="flex items-center gap-3 rounded-lg border border-sky-200/60 bg-sky-50 px-4 py-2 text-sm text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-sky-500" />
              Temps de vérification estimé : <span className="font-bold text-sky-500">30-60s</span>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
              <Button variant="outline" onClick={() => router.push("/upload")}>
                Retour
              </Button>
              <Button
                onClick={handleValidate}
                disabled={isValidating}
                className="bg-sky-500 text-white shadow-lg shadow-sky-200"
              >
                {isValidating ? "Validation en cours..." : "Valider et générer"}
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-transform hover:scale-110"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
