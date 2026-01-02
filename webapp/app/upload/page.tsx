import { DashboardHeader } from "@/components/dashboard-header";
import { UploadZone } from "@/components/upload-zone";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Convertir des factures
          </h1>
          <p className="text-muted-foreground">
            Téléchargez vos PDF de factures pour les convertir en format
            Factur-X
          </p>
        </div>

        <UploadZone />
      </main>
    </div>
  );
}
