"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PDFPreview } from "@/components/pdf-preview"
import { InvoiceForm } from "@/components/invoice-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function VerificationInterface() {
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(false)
  const [fieldsToVerify] = useState(["vendorSIRET", "clientSIREN"])

  const handleValidate = async () => {
    setIsValidating(true)

    // Simulate validation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to results
    router.push("/results")
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Certains champs nécessitent votre attention. Veuillez vérifier les informations marquées en orange avant de
          continuer.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <PDFPreview />
        </div>

        <div>
          <InvoiceForm fieldsToVerify={fieldsToVerify} />

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
