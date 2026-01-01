import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export function PDFPreview(props: { fileId?: string; fileName?: string }) {
  // Hide built-in PDF viewer UI (works in most browsers' native PDF viewers)
  const src = props.fileId
    ? `/api/uploaded/${props.fileId}#toolbar=0&navpanes=0&scrollbar=0`
    : ""

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aperçu du PDF</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted">
          {src ? (
            <iframe
              title={props.fileName ? `Aperçu ${props.fileName}` : "Aperçu PDF"}
              src={src}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Aucun PDF à afficher</p>
                <p className="text-sm text-muted-foreground">Retournez à l'upload et réessayez.</p>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Le PDF original est affiché ici pour faciliter la vérification des données extraites.
        </p>
      </CardContent>
    </Card>
  )
}
