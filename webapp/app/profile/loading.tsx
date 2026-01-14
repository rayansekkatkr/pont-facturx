import { ProfilePanelSkeleton } from "@/components/profile/profile-panel-skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <ProfilePanelSkeleton />
      </main>
    </div>
  );
}
