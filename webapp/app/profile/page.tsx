import { Suspense } from "react";
import { requireAuth } from "@/lib/require-auth";
import { DashboardHeader } from "@/components/dashboard-header";
import { ProfilePanel } from "@/components/profile/profile-panel";
import { ProfilePanelSkeleton } from "@/components/profile/profile-panel-skeleton";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  Lock,
  User,
  LifeBuoy,
} from "lucide-react";

export default async function ProfilePage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-start gap-12 lg:flex-row">
          <aside className="w-full flex-shrink-0 lg:sticky lg:top-32 lg:w-72">
            <div
              className="rounded-3xl border border-slate-200/50 bg-slate-50/60 p-4"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.05) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            >
              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white px-5 py-3.5 text-sm font-bold text-teal-600 shadow-sm"
                >
                  <User className="h-5 w-5" />
                  Profil
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-500 transition-all hover:bg-white hover:text-sky-500"
                >
                  <CreditCard className="h-5 w-5" />
                  Facturation
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-500 transition-all hover:bg-white hover:text-sky-500"
                >
                  <Lock className="h-5 w-5" />
                  Sécurité
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-500 transition-all hover:bg-white hover:text-sky-500"
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                </Link>
              </nav>
              <div className="mt-8 rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50 to-sky-50 px-5 py-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
                  Support premium
                </p>
                <p className="text-xs text-slate-600">
                  Besoin d'aide avec vos exports Factur-X ?
                </p>
                <button className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-sky-500 hover:underline">
                  Contacter un expert
                  <LifeBuoy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>

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
