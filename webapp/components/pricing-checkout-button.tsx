"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Props = {
  kind: "pack" | "subscription";
  sku: string;
  label: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
};

const LAST_CHECKOUT_SESSION_KEY = "pfxt_last_checkout_session_id";

export function PricingCheckoutButton({
  kind,
  sku,
  label,
  variant = "default",
  className,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getCheckoutUrl = (body: unknown): string | undefined => {
    if (!body || typeof body !== "object") return undefined;
    const url = (body as { checkout_url?: unknown }).checkout_url;
    return typeof url === "string" ? url : undefined;
  };

  const getSessionId = (body: unknown): string | undefined => {
    if (!body || typeof body !== "object") return undefined;
    const sessionId = (body as { session_id?: unknown }).session_id;
    return typeof sessionId === "string" ? sessionId : undefined;
  };

  const onClick = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const origin = window.location.origin;
      const success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancel_url = `${origin}/dashboard?checkout=cancel`;

      const res = await fetch("/api/proxy/v1/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kind, sku, success_url, cancel_url }),
      });

      if (res.status === 401) {
        router.push("/auth");
        return;
      }

      const raw = await res.text();
      let body: unknown = undefined;
      try {
        body = raw ? JSON.parse(raw) : undefined;
      } catch {
        body = raw;
      }

      const getErrorMessage = (value: unknown): string | undefined => {
        if (!value || typeof value !== "object") return undefined;
        const record = value as Record<string, unknown>;
        const msg = record.message;
        const detail = record.detail;
        if (typeof detail === "string" && detail.trim()) return detail;
        if (typeof msg === "string" && msg.trim()) return msg;
        return undefined;
      };
      if (!res.ok) {
        const msg = getErrorMessage(body) ?? `HTTP ${res.status}`;
        throw new Error(`${msg}\n${typeof raw === "string" ? raw : ""}`.trim());
      }

      const checkoutUrl = getCheckoutUrl(body);
      if (!checkoutUrl) {
        throw new Error("Stripe a renvoyé une URL invalide");
      }

      const sessionId = getSessionId(body);
      if (sessionId) {
        try {
          sessionStorage.setItem(LAST_CHECKOUT_SESSION_KEY, sessionId);
        } catch {
          // ignore
        }
      }

      window.location.assign(checkoutUrl);
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "Paiement",
        description:
          err instanceof Error
            ? err.message
            : "Erreur lors du démarrage du paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      className={className}
      variant={variant}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Redirection…" : label}
    </Button>
  );
}
