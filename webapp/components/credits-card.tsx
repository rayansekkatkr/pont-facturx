"use client";

import { useMemo } from "react";
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
import { countSuccessfulConversionsThisMonth } from "@/lib/conversion-store";
import Link from "next/link";

type CreditsData = {
  plan: string;
  credits_total: number;
  credits_used: number;
  credits_available: number;
  renewal_date: string;
  price_per_conversion_eur: number;
};

export function CreditsCard() {
  const data: CreditsData = useMemo(() => {
    const credits_total = 3;
    const credits_used = countSuccessfulConversionsThisMonth();
    const credits_available = Math.max(0, credits_total - credits_used);

    const now = new Date();
    const renewal = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return {
      plan: "Plan gratuit",
      credits_total,
      credits_used,
      credits_available,
      renewal_date: renewal.toISOString(),
      price_per_conversion_eur: 0,
    };
  }, []);

  const creditsTotal = data.credits_total;
  const creditsUsed = data.credits_used;
  const creditsAvailable = data.credits_available;
  const percentage = useMemo(() => {
    if (!creditsTotal) return 0;
    return Math.min(100, Math.max(0, (creditsUsed / creditsTotal) * 100));
  }, [creditsTotal, creditsUsed]);

  const renewalLabel = useMemo(() => {
    if (!data.renewal_date) return "—";
    try {
      return new Date(data.renewal_date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return data.renewal_date;
    }
  }, [data.renewal_date]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Crédits disponibles</CardTitle>
        <CardDescription>{data.plan}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold">
              {creditsAvailable}
            </span>
            <span className="text-sm text-muted-foreground">
              / {creditsTotal} crédits
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {`${creditsUsed} crédits utilisés ce mois`}
          </p>
        </div>

        <div className="space-y-2 rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Prix par conversion</span>
            <span className="font-medium">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(data.price_per_conversion_eur)}
            </span>
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
