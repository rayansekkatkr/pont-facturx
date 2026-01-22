"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { ConversionHistory } from "@/components/conversion-history";
import { CreditsCard } from "@/components/credits-card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  Bolt,
  FileUp,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [creditsAvailable, setCreditsAvailable] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalConversions: 0,
    monthConversions: 0,
    savingsEuros: 0,
    monthGoal: 200,
  });

  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch("/api/proxy/v1/billing/credits", {
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setCreditsAvailable(data.credits_available ?? 0);
        }
      } catch {
        // ignore
      }
    }
    fetchCredits();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/proxy/v1/conversions/stats", {
          headers: { Accept: "application/json" },
        });
        console.log('Stats response:', res.status);
        if (res.ok) {
          const data = await res.json();
          console.log('Stats data:', data);
          setStats({
            totalConversions: data.total_conversions || 0,
            monthConversions: data.month_conversions || 0,
            savingsEuros: data.savings_euros || 0,
            monthGoal: data.month_goal || 200,
          });
        } else {
          console.error('Stats fetch failed:', res.status, await res.text());
        }
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    }
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total convertis",
      value: stats.totalConversions.toLocaleString('fr-FR'),
      accent: stats.totalConversions > 0 ? "+12%" : "0%",
      icon: BarChart3,
      iconBg: "bg-blue-50 text-blue-600",
      badge: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Volume ce mois",
      value: stats.monthConversions.toString(),
      accent: `Objectif: ${stats.monthGoal}`,
      icon: Activity,
      iconBg: "bg-purple-50 text-purple-600",
      badge: "bg-slate-50 text-slate-400",
    },
    {
      title: "Économies réalisées",
      value: `${stats.savingsEuros.toFixed(2)} €`,
      accent: "Premium",
      icon: Sparkles,
      iconBg: "bg-emerald-50 text-emerald-600",
      badge: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Status Système",
      value: "Active",
      accent: "Live",
      icon: Bolt,
      iconBg: "bg-amber-50 text-amber-600",
      badge: "text-slate-500",
    },
  ];

  const backgroundPattern = {
    backgroundImage:
      "radial-gradient(circle at 2px 2px, rgba(15, 23, 42, 0.05) 1px, transparent 0)",
    backgroundSize: "32px 32px",
  } as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={backgroundPattern}>
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
        <div className="mb-8 md:mb-10 flex flex-col gap-4 md:gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Tableau de bord
            </h1>
            <p className="mt-1.5 md:mt-2 text-sm md:text-base font-medium text-slate-500">
              Propulsez votre facturation avec le standard Factur-X.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl md:rounded-2xl bg-sky-400/30 blur opacity-25 transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
            {creditsAvailable === 0 ? (
              <div className="relative">
                <Button 
                  disabled 
                  className="relative inline-flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl bg-slate-300 px-6 md:px-8 py-5 md:py-6 text-xs md:text-sm font-bold text-slate-500 shadow-lg cursor-not-allowed opacity-60"
                >
                  <FileUp className="h-4 w-4 md:h-5 md:w-5" />
                  Convertir des factures
                </Button>
                <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-red-600 font-medium">
                  Aucun crédit disponible
                </p>
              </div>
            ) : (
              <Link href="/upload" className="relative inline-flex">
                <Button className="relative inline-flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl bg-sky-500 px-6 md:px-8 py-5 md:py-6 text-xs md:text-sm font-bold text-white shadow-lg shadow-sky-400/30 ring-1 ring-white/20 transition-all hover:scale-[1.02] hover:bg-sky-500">
                  <FileUp className="h-4 w-4 md:h-5 md:w-5" />
                  Convertir des factures
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="mb-8 md:mb-10 grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white bg-white p-6 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.08)] transition-all hover:border-slate-200"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg}`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div
                  className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.badge}`}
                >
                  {item.accent}
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{item.value}</div>
              <p className="mt-1 text-xs md:text-sm font-medium text-slate-500">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ConversionHistory />
          </div>
          <div className="flex flex-col gap-6 md:gap-8" style={{ height: "fit-content" }}>
            <CreditsCard />
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-2xl">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-white/10">
                  <HelpCircle className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <h4 className="mb-2 md:mb-3 text-lg md:text-xl font-extrabold">Besoin d&apos;aide ?</h4>
                <p className="mb-4 md:mb-6 text-xs md:text-sm font-medium text-slate-300">
                  Consultez notre guide interactif pour maîtriser l&apos;export PDF/A-3 en quelques minutes.
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-sky-400 transition-colors hover:text-white"
                >
                  Voir les tutoriels
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
