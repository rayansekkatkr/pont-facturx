import { requireAuth } from "@/lib/require-auth";
import { DashboardHeader } from "@/components/dashboard-header";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { BillingPanel } from "@/components/billing/billing-panel";

export default async function BillingPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-start gap-12 lg:flex-row">
          <SettingsSidebar active="billing" />
          <BillingPanel />
        </div>
      </main>
    </div>
  );
}
