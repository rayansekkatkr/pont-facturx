"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type BillingCreditsResponse = {
  plan: string;
  credits_available: number;
  renewal_date: string | null;
  renewal_label?: string | null;
  breakdown: {
    free_quota: number;
    free_used: number;
    free_remaining: number;
    subscription_quota: number;
    subscription_used: number;
    subscription_remaining: number;
    paid_credits: number;
  };
};

const LAST_CHECKOUT_SESSION_KEY = "pfxt_last_checkout_session_id";

function getErrorDetail(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const detail = (body as { detail?: unknown }).detail;
  return typeof detail === "string" ? detail : undefined;
}

export function CreditsCard() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<BillingCreditsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);

        // If the user just returned from Stripe, try to sync immediately.
        try {
          const qp = new URLSearchParams(window.location.search);
          const checkout = qp.get("checkout");
          if (checkout === "success") {
            const sessionId = sessionStorage.getItem(LAST_CHECKOUT_SESSION_KEY) || "";
            if (sessionId) {
              // Best-effort: remove to avoid looping on failures.
              sessionStorage.removeItem(LAST_CHECKOUT_SESSION_KEY);
              await fetch("/api/proxy/v1/billing/sync-session", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({ session_id: sessionId }),
              }).catch(() => null);
            }
          }
        } catch {
          // ignore
        }

        const res = await fetch("/api/proxy/v1/billing/credits", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (res.status === 401) {
          router.push("/");
          return;
        }

        const body: unknown = await res.json().catch(() => null);
        console.info("[credits-card] billing/credits response", {
          status: res.status,
          ok: res.ok,
          body,
        });
        if (!res.ok) {
          throw new Error(getErrorDetail(body) || "Impossible de charger les crédits");
        }

        if (!cancelled) setData(body as BillingCreditsResponse);
      } catch (err: unknown) {
        console.error(err);
        toast({
          title: "Crédits",
          description:
            err instanceof Error
              ? err.message
              : "Erreur lors du chargement des crédits",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [router, toast]);

  useEffect(() => {
    if (data) {
      console.info("[credits-card] state", {
        plan: data.plan,
        renewal_date: data.renewal_date,
        renewal_label: data.renewal_label,
        credits_available: data.credits_available,
      });
    }
  }, [data]);

  const creditsAvailable = data?.credits_available ?? 0;
  const creditsUsed =
    (data?.breakdown?.free_used ?? 0) + (data?.breakdown?.subscription_used ?? 0);
  const creditsTotal =
    (data?.breakdown?.free_quota ?? 0) +
    (data?.breakdown?.subscription_quota ?? 0) +
    (data?.breakdown?.paid_credits ?? 0);

  const percentage = useMemo(() => {
    const denom =
      (data?.breakdown?.free_quota ?? 0) + (data?.breakdown?.subscription_quota ?? 0);
    if (!denom) return 0;
    return Math.min(100, Math.max(0, (creditsUsed / denom) * 100));
  }, [creditsUsed, data?.breakdown?.free_quota, data?.breakdown?.subscription_quota]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex-1 overflow-hidden rounded-3xl border border-white bg-white p-8 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.08)]">
      <div className="relative z-10">
        <h3 className="text-xl font-extrabold text-slate-900">Crédits disponibles</h3>
        <p className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          {data?.plan || "—"}
        </p>

        <div className="relative mb-8 flex flex-col items-center justify-center py-6">
          <div className="relative h-40 w-40">
            <svg className="h-full w-full -rotate-90">
              <circle
                className="text-slate-100"
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={12}
              />
              <circle
                className="text-sky-500 drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={12}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-slate-900">
                {loading ? "…" : creditsAvailable}
              </span>
              <span className="text-xs font-bold text-slate-400">
                SUR {creditsTotal}
              </span>
            </div>
          </div>
        </div>

        <p className="mb-6 text-center text-sm font-medium text-slate-500">
          {loading
            ? "Chargement…"
            : `Vous avez utilisé ${creditsUsed} crédits ce mois.`}
        </p>

        <Button
          asChild
          className="w-full rounded-2xl bg-slate-900 py-6 text-sm font-bold text-white shadow-xl shadow-slate-200 hover:bg-slate-800"
        >
          <Link href="/#pricing">
            <CreditCard className="mr-2 h-4 w-4" />
            Acheter des crédits
          </Link>
        </Button>
      </div>
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-sky-100 blur-3xl" />
    </div>
  );
}
