import { Suspense } from "react";
import { requireAuth } from "@/lib/require-auth";
import { DashboardHeader } from "@/components/dashboard-header";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { SecurityPanel } from "@/components/profile/security-panel";

export default async function SecurityPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-start gap-12 lg:flex-row">
          <SettingsSidebar active="security" />

          <div className="w-full flex-1 space-y-10">
            <div>
              <nav className="mb-4 flex text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Réglages</span>
                <span className="mx-2">/</span>
                <span className="text-sky-500">Sécurité</span>
              </nav>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Sécurité
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-500">
                Gérez vos paramètres de sécurité, mot de passe et sessions actives.
              </p>
            </div>

            <Suspense fallback={<div>Chargement...</div>}>
              <SecurityPanel />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
