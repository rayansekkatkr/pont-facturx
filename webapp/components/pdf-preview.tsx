import { FileText, Maximize2, Minus, Plus } from "lucide-react";

export function PDFPreview(props: { fileId?: string; fileName?: string }) {
  // Hide built-in PDF viewer UI (works in most browsers' native PDF viewers)
  const src = props.fileId
    ? `/api/uploaded/${props.fileId}#toolbar=0&navpanes=0&scrollbar=0`
    : "";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200/70 bg-slate-50/70 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Aperçu du PDF
        </span>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-slate-500">
          <button type="button" className="rounded p-1 hover:bg-slate-100">
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-2 text-[10px] font-semibold text-slate-500">
            100%
          </span>
          <button type="button" className="rounded p-1 hover:bg-slate-100">
            <Plus className="h-4 w-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-slate-200" />
          <button type="button" className="rounded p-1 hover:bg-slate-100">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex h-[680px] items-center justify-center overflow-auto bg-slate-200 p-6">
        <div className="w-full max-w-[480px] overflow-hidden rounded-sm border border-slate-300 bg-white shadow-2xl">
          {src ? (
            <iframe
              title={props.fileName ? `Aperçu ${props.fileName}` : "Aperçu PDF"}
              src={src}
              className="h-[640px] w-full"
            />
          ) : (
            <div className="flex h-[640px] flex-col items-center justify-center gap-4 p-8 text-center">
              <FileText className="h-16 w-16 text-slate-400" />
              <div>
                <p className="font-medium text-slate-500">Aucun PDF à afficher</p>
                <p className="text-sm text-slate-400">
                  Retournez à l'upload et réessayez.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="px-4 py-3 text-center text-xs text-slate-400">
        Le PDF original est affiché ici pour faciliter la vérification des données extraites.
      </p>
    </div>
  );
}
