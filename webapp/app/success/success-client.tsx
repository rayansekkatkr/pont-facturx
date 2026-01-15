"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useRouter } from "next/navigation";

type Props = {
  sessionId: string;
};

export default function SuccessClient({ sessionId }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const getDetail = (value: unknown): string | undefined => {
    if (!value || typeof value !== "object") return undefined;
    const rec = value as Record<string, unknown>;
    const detail = rec.detail;
    const message = rec.message;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (typeof message === "string" && message.trim()) return message;
    return undefined;
  };

  const getErrorMessage = (e: unknown): string => {
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;
    return "Erreur inattendue";
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      let effectiveSessionId = sessionId;
      if (!effectiveSessionId && typeof window !== "undefined") {
        try {
          const fromQuery = new URLSearchParams(window.location.search).get(
            "session_id",
          );
          const fromStorage = sessionStorage.getItem(
            "pfxt_last_checkout_session_id",
          );
          effectiveSessionId = (fromQuery || fromStorage || "").trim();
        } catch {
          // ignore
        }
      }

      if (!effectiveSessionId) {
        router.replace("/dashboard");
        return;
      }

      try {
        const res = await fetch("/api/proxy/v1/billing/sync-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: effectiveSessionId }),
        });

        if (res.status === 401) {
          router.replace("/auth");
          return;
        }

        const bodyText = await res.text();
        let body: unknown = null;
        try {
          body = bodyText ? JSON.parse(bodyText) : null;
        } catch {
          body = null;
        }

        if (!res.ok) {
          const detail = getDetail(body);
          throw new Error(
            typeof detail === "string" && detail.trim()
              ? detail
              : `Erreur de synchronisation (HTTP ${res.status})`,
          );
        }

        if (!cancelled) {
          try {
            sessionStorage.removeItem("pfxt_last_checkout_session_id");
          } catch {
            // ignore
          }
          router.replace("/dashboard?checkout=success");
        }
      } catch (e: unknown) {
        if (!cancelled) setError(getErrorMessage(e));
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [router, sessionId]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Finalisation du paiement…</h1>
        <p className="mt-4 text-muted-foreground">
          {error
            ? "Impossible de mettre à jour votre compte automatiquement."
            : "Nous mettons à jour vos crédits / abonnement."}
        </p>

        {error ? (
          <div className="mt-6">
            <p className="text-sm text-destructive">{error}</p>
            <a className="mt-4 inline-block underline" href="/dashboard">
              Aller au dashboard
            </a>
          </div>
        ) : null}
      </main>
    </div>
  );
}
