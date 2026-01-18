import { DashboardHeader } from "@/components/dashboard-header";
import { UploadZone } from "@/components/upload-zone";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardHeader />

      <main className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Convertir des factures
          </h1>
          <p className="mt-1.5 md:mt-2 text-base md:text-lg text-slate-500">
            Téléchargez vos PDF pour les transformer au format Factur-X
          </p>
        </header>

        <UploadZone />
      </main>
    </div>
  );
}
