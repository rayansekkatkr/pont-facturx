"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Download, FileText, FileCode2, FileCheck, AlertCircle, Archive } from "lucide-react"

interface ConversionResult {
  id: string
  fileName: string
  status: "success" | "error"
  profile: string
  validationReport: ValidationReport
}

interface ValidationReport {
  pdfA3Valid: boolean
  xmlValid: boolean
  facturXValid: boolean
  errors: string[]
  warnings: string[]
}

export function ResultsDisplay() {
  const router = useRouter()
  const [results] = useState<ConversionResult[]>([
    {
      id: "1",
      fileName: "INV-2024-001.pdf",
      status: "success",
      profile: "BASIC WL",
      validationReport: {
        pdfA3Valid: true,
        xmlValid: true,
        facturXValid: true,
        errors: [],
        warnings: ["Date d'échéance dans le passé (non bloquant)"],
      },
    },
    {
      id: "2",
      fileName: "INV-2024-002.pdf",
      status: "success",
      profile: "BASIC WL",
      validationReport: {
        pdfA3Valid: true,
        xmlValid: true,
        facturXValid: true,
        errors: [],
        warnings: [],
      },
    },
  ])

  const handleDownloadAll = () => {
    // In production, trigger download of all files as ZIP
    console.log("Downloading all files...")
  }

  const handleDownload = (type: "pdf" | "xml" | "report", fileName: string) => {
    // In production, trigger specific file download
    console.log(`Downloading ${type} for ${fileName}`)
  }

  const successCount = results.filter((r) => r.status === "success").length
  const errorCount = results.filter((r) => r.status === "error").length

  return (
    <div className="space-y-6">
      <Alert className="border-chart-2 bg-chart-2/10">
        <CheckCircle2 className="h-5 w-5 text-chart-2" />
        <AlertDescription className="text-chart-2">
          <span className="font-semibold">Conversion terminée avec succès!</span>
          <br />
          {successCount} fichier{successCount > 1 ? "s" : ""} converti{successCount > 1 ? "s" : ""} en Factur-X
          {errorCount > 0 && `, ${errorCount} erreur${errorCount > 1 ? "s" : ""}`}
        </AlertDescription>
      </Alert>

      {results.length > 1 && (
        <div className="flex justify-end">
          <Button onClick={handleDownloadAll} size="lg">
            <Archive className="mr-2 h-4 w-4" />
            Télécharger tout (ZIP)
          </Button>
        </div>
      )}

      {results.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {result.fileName}
                </CardTitle>
                <CardDescription>Profil {result.profile}</CardDescription>
              </div>
              <Badge variant="default" className="bg-chart-2 text-white">
                Validé
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Validation Report */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Rapport de validation</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-chart-2" />
                    <div>
                      <p className="font-medium">PDF/A-3</p>
                      <p className="text-xs text-muted-foreground">Format PDF validé</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-chart-2 text-white">
                    Valide
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-chart-2" />
                    <div>
                      <p className="font-medium">XML CII D22B</p>
                      <p className="text-xs text-muted-foreground">Structure XML conforme</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-chart-2 text-white">
                    Valide
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-chart-2" />
                    <div>
                      <p className="font-medium">Factur-X 1.08</p>
                      <p className="text-xs text-muted-foreground">Norme Factur-X respectée</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-chart-2 text-white">
                    Valide
                  </Badge>
                </div>
              </div>

              {result.validationReport.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-semibold">Avertissements:</span>
                    <ul className="mt-2 list-inside list-disc space-y-1">
                      {result.validationReport.warnings.map((warning, index) => (
                        <li key={index} className="text-sm">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            {/* Download Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Téléchargements disponibles</p>

              <div className="grid gap-3 sm:grid-cols-3">
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  onClick={() => handleDownload("pdf", result.fileName)}
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  PDF Factur-X
                </Button>

                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  onClick={() => handleDownload("xml", result.fileName)}
                >
                  <FileCode2 className="mr-2 h-4 w-4" />
                  XML seul
                </Button>

                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  onClick={() => handleDownload("report", result.fileName)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Rapport complet
                </Button>
              </div>
            </div>

            {/* Technical Details */}
            <details className="rounded-lg border bg-muted/30 p-4">
              <summary className="cursor-pointer text-sm font-medium">Détails techniques</summary>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format de sortie:</span>
                  <span className="font-medium">PDF/A-3 avec XML embarqué</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profil Factur-X:</span>
                  <span className="font-medium">{result.profile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schéma XML:</span>
                  <span className="font-medium">UN/CEFACT CII D22B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version Factur-X:</span>
                  <span className="font-medium">1.08 (compatible 15/01/2026)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Validation:</span>
                  <span className="font-medium">veraPDF + Schematron EN16931</span>
                </div>
              </div>
            </details>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Retour au tableau de bord
        </Button>
        <Button onClick={() => router.push("/upload")}>Convertir d'autres factures</Button>
      </div>
    </div>
  )
}
