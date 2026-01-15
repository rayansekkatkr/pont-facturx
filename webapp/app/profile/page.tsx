import { Suspense } from "react";
import { requireAuth } from "@/lib/require-auth";
import { DashboardHeader } from "@/components/dashboard-header";
import { ProfilePanel } from "@/components/profile/profile-panel";
import { ProfilePanelSkeleton } from "@/components/profile/profile-panel-skeleton";
import { SettingsSidebar } from "@/components/settings-sidebar";

export default async function ProfilePage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-start gap-12 lg:flex-row">
          <SettingsSidebar active="profile" />

          <div className="w-full flex-1 space-y-10">
            <div>
              <nav className="mb-4 flex text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Réglages</span>
                <span className="mx-2">/</span>
                <span className="text-sky-500">Profil utilisateur</span>
              </nav>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Profil utilisateur
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-500">
                Gérez vos informations personnelles et les détails de votre entreprise pour une facturation conforme.
              </p>
            </div>

            <Suspense fallback={<ProfilePanelSkeleton />}>
              <ProfilePanel />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
