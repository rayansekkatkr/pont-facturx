"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, FileText, Rocket, History, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BillingSubscriptionSummary = {
  plan?: string | null;
  status?: string | null;
  is_active?: boolean;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
  amount?: number | null;
  currency?: string | null;
  interval?: string | null;
  interval_count?: number | null;
};

type BillingInvoiceSummary = {
  id: string;
  number?: string | null;
  status?: string | null;
  amount_paid?: number | null;
  currency?: string | null;
  hosted_invoice_url?: string | null;
  invoice_pdf?: string | null;
  created?: string | null;
};

type BillingOverviewResponse = {
  subscription?: BillingSubscriptionSummary | null;
  invoices?: BillingInvoiceSummary[];
};

function formatMoney(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount == null || !currency) return "—";
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function statusLabel(status?: string | null) {
  if (!status) return "—";
  const normalized = status.toLowerCase();
  if (normalized === "paid") return "Payée";
  if (normalized === "open") return "En attente";
  if (normalized === "void") return "Annulée";
  if (normalized === "draft") return "Brouillon";
  return status;
}

export function BillingPanel() {
  const router = useRouter();
  const [data, setData] = useState<BillingOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/proxy/v1/billing/overview", {
          headers: { Accept: "application/json" },
        });
        if (res.status === 401) {
          router.push("/auth");
          return;
        }
        const body = (await res.json()) as BillingOverviewResponse;
        if (!cancelled) setData(body);
      } catch {
        if (!cancelled) setData({ subscription: null, invoices: [] });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const subscription = data?.subscription ?? null;
  const invoices = data?.invoices ?? [];

  const planTitle = useMemo(() => {
    if (!subscription?.plan) return "Free Plan";
    return `${subscription.plan} Plan`;
  }, [subscription?.plan]);

  const nextBilling = useMemo(() => {
    if (!subscription?.current_period_end) return "—";
    return formatDate(subscription.current_period_end);
  }, [subscription?.current_period_end]);

  const statusText = subscription?.is_active ? "Actif" : "Inactif";
  const statusClass = subscription?.is_active
    ? "bg-teal-50 text-teal-600 border border-teal-200"
    : "bg-slate-100 text-slate-500 border border-slate-200";

  return (
    <div className="flex-1 space-y-8">
      <div>
        <nav className="mb-4 flex text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <span>Réglages</span>
          <span className="mx-2">/</span>
          <span className="text-sky-500">Facturation</span>
        </nav>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Gestion du compte
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-500">
          Gérez votre abonnement et téléchargez vos factures passées.
        </p>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/30 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-teal-500" />
              <h2 className="text-xl font-bold text-slate-900">Abonnement actuel</h2>
            </div>
            <p className="text-sm text-slate-500">
              Détails de votre offre de service Factur-X.
            </p>
          </div>
          <span className={cn("inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold", statusClass)}>
            <span
              className={cn(
                "mr-2 h-1.5 w-1.5 rounded-full",
                subscription?.is_active ? "bg-teal-500" : "bg-slate-400",
              )}
            />
            {statusText}
          </span>
        </div>
        <div className="p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Rocket className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {planTitle}
                </h3>
                <p className="text-sm text-slate-500">
                  {loading
                    ? "Chargement…"
                    : subscription?.amount
                      ? `${formatMoney(subscription.amount, subscription.currency)} / ${subscription.interval ?? "mois"}`
                      : "—"}
                  {subscription?.current_period_end
                    ? ` • Prochain prélèvement le ${nextBilling}`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" disabled className="rounded-xl">
                Annuler
              </Button>
              <Button asChild className="rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                <Link href="/#pricing">Changer d'offre</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <div className="border-b border-slate-100 bg-slate-50/30 p-8">
          <div className="mb-1 flex items-center gap-3">
            <History className="h-5 w-5 text-teal-500" />
            <h2 className="text-xl font-bold text-slate-900">Historique des factures</h2>
          </div>
          <p className="text-sm text-slate-500">
            Consultez et téléchargez vos justificatifs de paiement.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-8 py-5">Référence</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Montant</th>
                <th className="px-8 py-5">Statut</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-6 text-sm text-slate-500">
                    Chargement…
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-6 text-sm text-slate-500">
                    Aucune facture disponible.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const link = inv.invoice_pdf || inv.hosted_invoice_url || "";
                  return (
                    <tr key={inv.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-8 py-6 text-sm font-bold text-slate-900">
                        {inv.number || inv.id}
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-500">
                        {formatDate(inv.created)}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-900">
                        {formatMoney(inv.amount_paid, inv.currency)}
                      </td>
                      <td className="px-8 py-6">
                        <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-bold text-green-600">
                          {statusLabel(inv.status)}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:text-sky-500"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300">
                            <FileText className="h-4 w-4" />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 text-center">
          <button className="text-sm font-bold text-sky-500 hover:underline">
            Voir tout l'historique
          </button>
        </div>
      </section>

      <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-10 text-slate-500 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <CreditCard className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium">Facturation sécurisée. Tous droits réservés.</p>
        </div>
        <Button className="rounded-2xl bg-slate-900 px-8 py-5 text-sm font-bold text-white shadow-xl shadow-slate-200">
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
