"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, FileText, X, Archive } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
}

export function UploadZone() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isScanned, setIsScanned] = useState(false)
  const [profile, setProfile] = useState("basic-wl")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleConvert = async () => {
    setIsProcessing(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to verification screen
    router.push("/verify")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Téléchargement des fichiers</CardTitle>
          <CardDescription>Glissez-déposez vos fichiers PDF ou ZIP, ou cliquez pour sélectionner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50",
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
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">Glissez-déposez vos fichiers ici</p>
                <p className="text-sm text-muted-foreground">ou cliquez pour parcourir</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center gap-1">
                  <Archive className="h-4 w-4" />
                  <span>ZIP</span>
                </div>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Fichiers sélectionnés ({files.length})</Label>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Options de conversion</CardTitle>
          <CardDescription>Configurez les paramètres pour votre conversion Factur-X</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Profil Factur-X</Label>
            <RadioGroup value={profile} onValueChange={setProfile}>
              <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4">
                <RadioGroupItem value="basic-wl" id="basic-wl" />
                <div className="flex-1">
                  <Label htmlFor="basic-wl" className="cursor-pointer font-medium">
                    BASIC WL (Recommandé)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Profil standard avec données essentielles. Convient à la plupart des factures sans gérer les lignes
                    de détail.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4">
                <RadioGroupItem value="minimum" id="minimum" />
                <div className="flex-1">
                  <Label htmlFor="minimum" className="cursor-pointer font-medium">
                    MINIMUM
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Profil minimal avec informations de base uniquement. Pour les cas simples.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2 rounded-lg border bg-muted/50 p-4">
            <Checkbox
              id="scanned"
              checked={isScanned}
              onCheckedChange={(checked) => setIsScanned(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="scanned" className="cursor-pointer font-medium">
                Mes PDFs sont scannés (OCR requis)
              </Label>
              <p className="text-sm text-muted-foreground">
                Cochez cette option si vos factures sont des images scannées nécessitant une reconnaissance de texte.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Annuler
        </Button>
        <Button onClick={handleConvert} disabled={files.length === 0 || isProcessing} size="lg">
          {isProcessing ? "Traitement en cours..." : `Convertir ${files.length} fichier${files.length > 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  )
}
