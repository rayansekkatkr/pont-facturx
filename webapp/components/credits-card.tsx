"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type BillingCreditsResponse = {
  plan: string;
  credits_available: number;
  renewal_date: string;
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

  const renewalLabel = useMemo(() => {
    if (!data?.renewal_date) return "—";
    try {
      return new Date(data.renewal_date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return data?.renewal_date || "—";
    }
  }, [data?.renewal_date]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Crédits disponibles</CardTitle>
        <CardDescription>{data?.plan || "—"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold">
              {loading ? "…" : creditsAvailable}
            </span>
            <span className="text-sm text-muted-foreground">
              / {creditsTotal} crédits
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {loading ? "Chargement…" : `${creditsUsed} crédits utilisés ce mois`}
          </p>
        </div>

        <div className="space-y-2 rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Prix par conversion</span>
            <span className="font-medium">—</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Renouvellement</span>
            <span className="font-medium">{renewalLabel}</span>
          </div>
        </div>

        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/#pricing">
            <CreditCard className="mr-2 h-4 w-4" />
            Acheter des crédits
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
