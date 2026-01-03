import { DashboardHeader } from "@/components/dashboard-header";
import { ResultsDisplay } from "@/components/results-display";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Résultats de la conversion
          </h1>
          <p className="text-muted-foreground">
            Téléchargez vos fichiers Factur-X et consultez le rapport de
            validation
          </p>
        </div>

        <ResultsDisplay />
      </main>
    </div>
  );
}
