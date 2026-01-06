"use client";

import { useEffect, useState } from "react";
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
      if (!sessionId) {
        router.replace("/");
        return;
      }

      try {
        const res = await fetch("/api/proxy/v1/billing/sync-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
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
  );
}
