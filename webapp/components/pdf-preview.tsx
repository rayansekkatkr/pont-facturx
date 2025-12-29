import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export function PDFPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aperçu du PDF</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted">
          {/* Placeholder for PDF preview */}
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground">INV-2024-001.pdf</p>
              <p className="text-sm text-muted-foreground">Facture du 28/12/2024</p>
            </div>
          </div>
          {/* In production, render actual PDF here using a library like react-pdf */}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Le PDF original est affiché ici pour faciliter la vérification des données extraites.
        </p>
      </CardContent>
    </Card>
  )
}
