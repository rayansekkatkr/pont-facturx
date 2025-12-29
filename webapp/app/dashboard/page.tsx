import { DashboardHeader } from "@/components/dashboard-header"
import { ConversionHistory } from "@/components/conversion-history"
import { CreditsCard } from "@/components/credits-card"
import { QuickStats } from "@/components/quick-stats"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground">Gérez vos conversions Factur-X</p>
          </div>
          <Link href="/upload">
            <Button size="lg" className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Convertir des factures
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <QuickStats />
          </div>
          <div>
            <CreditsCard />
          </div>
        </div>

        <div className="mt-8">
          <ConversionHistory />
        </div>
      </main>
    </div>
  )
}
