import { DashboardHeader } from "@/components/dashboard-header";
import { VerificationInterface } from "@/components/verification-interface";
import { CheckCircle2 } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardHeader />

      <main className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Vérification des données
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Vérifiez et corrigez les informations extraites avant la génération du Factur-X
            </p>
          </div>
        </div>

        <VerificationInterface />
      </main>
    </div>
  );
}
