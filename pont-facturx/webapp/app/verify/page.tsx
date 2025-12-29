import { DashboardHeader } from "@/components/dashboard-header"
import { VerificationInterface } from "@/components/verification-interface"

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Vérification des données</h1>
          <p className="text-muted-foreground">
            Vérifiez et corrigez les informations extraites avant la génération du Factur-X
          </p>
        </div>

        <VerificationInterface />
      </main>
    </div>
  )
}
