"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Archive, CheckCircle2, FileText, Scan, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export function UploadZone() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isScanned, setIsScanned] = useState(false);
  const [profile, setProfile] = useState("basic-wl");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setError("");
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleConvert = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const readAsBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(new Error("Impossible de lire le fichier"));
          reader.readAsDataURL(file);
        });

      // Create FormData with all files
      const formData = new FormData();

      // Add all files
      files.forEach((uploadedFile) => {
        formData.append("files", uploadedFile.file);
      });

      // Add conversion options
      formData.append("profile", profile);
      formData.append("requiresOCR", String(isScanned));

      // Send to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'upload");
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      const base64List = await Promise.all(
        files.map((uploadedFile) => readAsBase64(uploadedFile.file)),
      );

      const enrichedFiles = Array.isArray(data?.files)
        ? data.files.map((fileInfo: any, index: number) => ({
            ...fileInfo,
            base64: base64List[index],
          }))
        : data.files;

      // Store uploaded files data in sessionStorage for /verify page
      sessionStorage.setItem("uploadedFiles", JSON.stringify(enrichedFiles));
      sessionStorage.setItem("uploadProfile", data.profile);

      // Redirect to verification screen
      router.push("/verify");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
      console.error("Upload error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const fileCountLabel = `${files.length} fichier${files.length > 1 ? "s" : ""}`;

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-12 text-center shadow-sm transition-all",
            isDragging
              ? "border-sky-400 bg-sky-50/40"
              : "border-slate-300 hover:border-sky-400 hover:bg-sky-50/30",
          )}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 cursor-pointer opacity-0"
            accept=".pdf,.zip"
            multiple
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-500">
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-800">
                Glissez-déposez vos fichiers ici
              </p>
              <p className="mt-1 text-sm text-slate-500">
                ou cliquez pour parcourir vos dossiers
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-widest text-slate-400">
                Formats acceptés : PDF, ZIP (Max 50Mo)
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <FileText className="h-4 w-4 text-slate-400" />
              Fichiers sélectionnés
            </h3>
            <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-bold uppercase tracking-wider text-sky-500">
              {fileCountLabel}
            </span>
          </div>
          {files.length === 0 ? (
            <div className="px-6 py-6 text-sm text-slate-500">
              Aucun fichier ajouté pour le moment.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {files.map((file) => (
                <li key={file.id} className="group flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {file.name}
                      </p>
                      <p className="text-xs uppercase text-slate-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                    title="Supprimer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="space-y-10">
        <div>
          <div className="mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800">
              Profil Factur-X
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                value: "basic-wl",
                title: "BASIC WL (Recommandé)",
                description:
                  "Profil standard incluant les données essentielles pour l'automatisation comptable.",
              },
              {
                value: "minimum",
                title: "MINIMUM",
                description:
                  "Profil allégé contenant uniquement les informations fiscales obligatoires.",
              },
            ].map((option) => {
              const selected = profile === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm transition-all",
                    selected
                      ? "border-sky-400 bg-sky-50/50 shadow-[0_0_0_1px_rgba(56,189,248,0.5)]"
                      : "border-slate-200 hover:border-slate-300",
                  )}
                >
                  <input
                    type="radio"
                    name="profile"
                    value={option.value}
                    checked={selected}
                    onChange={() => setProfile(option.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-bold uppercase tracking-tight text-slate-800">
                      {option.title}
                    </span>
                    <CheckCircle2
                      className={cn(
                        "h-5 w-5 text-sky-500 transition-opacity",
                        selected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {option.description}
                  </p>
                </label>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Scan className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Options avancées</h3>
                <p className="text-sm text-slate-500">
                  Mes PDFs sont scannés (OCR requis)
                </p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isScanned}
                onChange={(e) => setIsScanned(e.target.checked)}
              />
              <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all peer-checked:bg-sky-400 peer-checked:after:translate-x-full" />
            </label>
          </div>
        </div>
      </section>

      <footer className="sticky bottom-0 z-20 w-full">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="px-6 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
              onClick={() => router.push("/dashboard")}
            >
              Annuler
            </button>
            <Button
              onClick={handleConvert}
              disabled={files.length === 0 || isProcessing}
              className="bg-sky-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 hover:bg-sky-500/90"
            >
              {isProcessing ? "Traitement en cours..." : `Convertir ${fileCountLabel}`}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
