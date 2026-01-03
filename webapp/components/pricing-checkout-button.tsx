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

  const getErrorDetail = (body: unknown): string | undefined => {
    if (!body || typeof body !== "object") return undefined;
    const detail = (body as { detail?: unknown }).detail;
    return typeof detail === "string" ? detail : undefined;
  };

  const getCheckoutUrl = (body: unknown): string | undefined => {
    if (!body || typeof body !== "object") return undefined;
    const url = (body as { checkout_url?: unknown }).checkout_url;
    return typeof url === "string" ? url : undefined;
  };

  const onClick = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("/api/proxy/v1/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kind, sku }),
      });

      if (res.status === 401) {
        router.push("/auth");
        return;
      }

      const body: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          getErrorDetail(body) || "Impossible de démarrer le paiement",
        );
      }

      const checkoutUrl = getCheckoutUrl(body);
      if (!checkoutUrl) {
        throw new Error("Stripe a renvoyé une URL invalide");
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
