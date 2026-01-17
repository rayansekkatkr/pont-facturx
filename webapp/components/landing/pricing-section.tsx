"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PricingCheckoutButton } from "@/components/pricing-checkout-button";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "annual";

type SubscriptionPlan = {
  title: string;
  description: string;
  highlight?: boolean;
  perks: string[];
  monthlyPrice: string;
  annualPrice: string;
  monthlySku: string;
  annualSku: string;
};

type CreditPack = {
  title: string;
  sku: string;
  price: string;
};

type PricingSectionProps = {
  subscriptions: SubscriptionPlan[];
  creditPacks: CreditPack[];
};

export function PricingSection({ subscriptions, creditPacks }: PricingSectionProps) {
  const [cycle, setCycle] = useState<BillingCycle>("annual");
  const isAnnual = cycle === "annual";

  return (
    <section id="pricing" className="bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-display font-bold text-primary dark:text-white">
            Tarifs simples et transparents
          </h2>
          <div className="mt-8 mx-auto grid w-full max-w-[360px] grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm font-medium text-slate-500">
            <button
              type="button"
              onClick={() => setCycle("monthly")}
              className={cn(
                "justify-self-end self-center transition-colors",
                cycle === "monthly" ? "text-slate-900" : "hover:text-slate-700"
              )}
            >
              Mensuel
            </button>

            <button
              type="button"
              onClick={() => setCycle(isAnnual ? "monthly" : "annual")}
              className="relative h-11 w-[84px] justify-self-center rounded-full border border-slate-900/30 bg-slate-900/95 px-1 shadow-inner transition"
              aria-pressed={isAnnual}
            >
              <span
                className={cn(
                  "absolute top-1 bottom-1 w-10 rounded-full bg-cyan-400 shadow-lg transition-all",
                  isAnnual ? "right-1" : "left-1"
                )}
              />
              <span className="sr-only">Basculer la période de facturation</span>
            </button>

            <div className="flex items-center gap-2 justify-self-start self-center">
              <button
                type="button"
                onClick={() => setCycle("annual")}
                className={cn(
                  "transition-colors",
                  cycle === "annual" ? "text-slate-900" : "hover:text-slate-700"
                )}
              >
                Annuel
              </button>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-600">
                -20%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {subscriptions.map((plan) => {
            const price = cycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
            const sku = isAnnual ? plan.annualSku : plan.monthlySku;
            return (
              <div
                key={plan.title}
                className={`relative rounded-[2rem] border p-8 shadow-sm transition-all ${
                  plan.highlight
                    ? "border-primary bg-primary text-primary-foreground shadow-2xl"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute right-6 top-6 rounded-full bg-sky-400 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Recommandé
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.title}</h3>
                <p className={`mt-1 text-sm ${plan.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{price}</span>
                  <span className={plan.highlight ? "text-white/80" : "text-muted-foreground"}>/mois</span>
                </div>
                <ul className="mt-8 space-y-4 text-sm">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3">
                      <CheckCircle2
                        className={`h-5 w-5 ${plan.highlight ? "text-accent" : "text-sky-500"}`}
                      />
                      <span className={plan.highlight ? "text-white" : "text-slate-600 dark:text-slate-300"}>{perk}</span>
                    </li>
                  ))}
                </ul>
                <PricingCheckoutButton
                  className={`mt-8 w-full ${plan.highlight ? "bg-accent text-primary hover:bg-white" : ""}`}
                  kind="subscription"
                  sku={sku}
                  label={plan.highlight ? "Choisir Pro" : `Choisir ${plan.title}`}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Packs de crédits à la demande
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {creditPacks.map((pack) => (
              <div
                key={pack.sku}
                className="flex items-center gap-6 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-left shadow-sm transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">{pack.title}</p>
                  <p className="text-xs text-muted-foreground">{pack.price}</p>
                </div>
                <PricingCheckoutButton
                  className="text-xs font-bold text-sky-600"
                  variant="ghost"
                  kind="pack"
                  sku={pack.sku}
                  label="Acheter"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
