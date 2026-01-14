import { Suspense } from "react";
import { requireAuth } from "@/lib/require-auth";
import { ProfilePanel } from "@/components/profile/profile-panel";
import { ProfilePanelSkeleton } from "@/components/profile/profile-panel-skeleton";

export default async function ProfilePage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Compte
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Profil utilisateur</h1>
          <p className="text-muted-foreground">
            Ajustez vos informations d'identité, d'entreprise et vos préférences
          </p>
        </div>

        <Suspense fallback={<ProfilePanelSkeleton />}>
          <ProfilePanel />
        </Suspense>
      </main>
    </div>
  );
}
