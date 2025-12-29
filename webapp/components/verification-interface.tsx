"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PDFPreview } from "@/components/pdf-preview"
import { InvoiceForm } from "@/components/invoice-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface UploadedFile {
  fileId: string
  fileName: string
  fileSize: number
  extractedData: any
}

export function VerificationInterface() {
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [invoiceDataList, setInvoiceDataList] = useState<any[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    // Load uploaded files from sessionStorage
    const filesData = sessionStorage.getItem("uploadedFiles")
    if (filesData) {
      const files: UploadedFile[] = JSON.parse(filesData)
      setUploadedFiles(files)
      setInvoiceDataList(files.map((f) => f.extractedData))
    } else {
      // No data, redirect back to upload
      router.push("/upload")
    }
  }, [router])

  const handleInvoiceDataChange = (data: any) => {
    const newList = [...invoiceDataList]
    newList[currentFileIndex] = data
    setInvoiceDataList(newList)
  }

  const handleValidate = async () => {
    setIsValidating(true)
    setError("")

    try {
      // Process each file with its validated data
      const promises = uploadedFiles.map((file, index) => {
        return fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileId: file.fileId,
            invoiceData: invoiceDataList[index],
          }),
        })
      })

      const responses = await Promise.all(promises)
      
      // Check if all succeeded
      const results = await Promise.all(
        responses.map(async (res, index) => {
          if (!res.ok) throw new Error(`Processing failed: ${res.status}`)
          const data = await res.json()
          // Add fileName to result for display purposes
          return {
            ...data.result,
            fileName: uploadedFiles[index].fileName,
          }
        })
      )

      console.log("All files processed:", results)

      // Store results for /results page
      sessionStorage.setItem("processedResults", JSON.stringify(results))

      // Redirect to results
      router.push("/results")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de validation"
      setError(message)
      console.error("Validation error:", err)
    } finally {
      setIsValidating(false)
    }
  }

  if (uploadedFiles.length === 0) {
    return <div>Chargement...</div>
  }

  const currentFile = uploadedFiles[currentFileIndex]
  const fieldsToVerify = ["vendorSIRET", "clientSIREN"]

  return (
    <div className="space-y-6">
      {uploadedFiles.length > 1 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fichier {currentFileIndex + 1} sur {uploadedFiles.length}: {currentFile.fileName}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <PDFPreview />
        </div>

        <div>
          <InvoiceForm 
            fieldsToVerify={fieldsToVerify}
            initialData={invoiceDataList[currentFileIndex]}
            onChange={handleInvoiceDataChange}
          />

          {uploadedFiles.length > 1 && (
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentFileIndex(Math.max(0, currentFileIndex - 1))}
                disabled={currentFileIndex === 0}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentFileIndex(Math.min(uploadedFiles.length - 1, currentFileIndex + 1))}
                disabled={currentFileIndex === uploadedFiles.length - 1}
              >
                Suivant
              </Button>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.push("/upload")}>
              Retour
            </Button>
            <Button onClick={handleValidate} disabled={isValidating} size="lg">
              {isValidating ? "Validation en cours..." : "Valider et générer"}
            </Button>
          </div>

          <Alert className="mt-6 border-chart-2 bg-chart-2/10">
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
            <AlertDescription className="text-chart-2">
              Temps de vérification estimé : 30-60 secondes par facture
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
