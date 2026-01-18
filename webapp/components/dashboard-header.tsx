"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { CreditCard, FileText, Lock, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

type AuthMeResponse = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
};

type BillingCreditsResponse = {
  plan?: string | null;
};

export function DashboardHeader() {
  const router = useRouter();
  const [userLabel, setUserLabel] = useState("Mon compte");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [planLabel, setPlanLabel] = useState("Compte gratuit");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }

    try {
      sessionStorage.removeItem("uploadedFiles");
      sessionStorage.removeItem("uploadProfile");
      sessionStorage.removeItem("processedResults");
    } catch {
      // ignore
    }

    // Hard reload to guarantee cookies are re-read and no cached authed UI remains.
    window.location.assign("/");
  };

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const res = await fetch("/api/proxy/v1/auth/me", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const body = (await res.json()) as AuthMeResponse;
        const name = [body.first_name, body.last_name].filter(Boolean).join(" ");
        const label = name.trim() || body.email || "Mon compte";
        if (!cancelled && label) setUserLabel(label);
        if (!cancelled) setUserEmail(body.email ?? null);
      } catch {
        // ignore
      }
    }

    async function loadPlan() {
      try {
        const res = await fetch("/api/proxy/v1/billing/credits", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const body = (await res.json()) as BillingCreditsResponse;
        const plan = (body.plan || "").trim();
        if (!cancelled) {
          const normalized = plan.toLowerCase();
          if (!plan || normalized.includes("gratuit")) {
            setPlanLabel("Compte gratuit");
            return;
          }
          const match = plan.match(/abonnement\s+(.+)$/i);
          if (match && match[1]) {
            setPlanLabel(match[1].trim());
            return;
          }
          setPlanLabel(plan);
        }
      } catch {
        // ignore
      }
    }

    loadUser();
    loadPlan();
    return () => {
      cancelled = true;
    };
  }, []);

  const planDisplay = useMemo(() => {
    const normalized = (planLabel || "").trim();
    if (!normalized || normalized.toLowerCase().includes("gratuit")) {
      return "FREE PLAN";
    }
    return `${normalized.toUpperCase()} PLAN`;
  }, [planLabel]);

  const planBadge = useMemo(() => {
    const normalized = (planLabel || "").trim();
    if (!normalized || normalized.toLowerCase().includes("gratuit")) {
      return "FREE";
    }
    return normalized.split(" ")[0].toUpperCase();
  }, [planLabel]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <FileText className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <span className="text-base md:text-xl font-extrabold tracking-tight text-slate-900">
            Factur-X <span className="text-sky-500">Convert</span>
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/dashboard" className="border-b-2 border-sky-500 pb-1 text-primary">
              Dashboard
            </Link>
          </nav>
          <div className="hidden h-8 w-px bg-slate-200 md:block" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-4 px-1 py-1 hover:bg-transparent">
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-bold text-slate-700">
                    {userLabel}
                  </span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {planDisplay}
                  </span>
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-sky-400 bg-white">
                  <User className="h-5 w-5 text-slate-500" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 rounded-2xl border border-slate-200 bg-white/90 p-0 shadow-2xl backdrop-blur"
            >
              <div className="border-b border-slate-100 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Mon compte
                  </p>
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-500">
                    {planBadge}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">{userLabel}</p>
                <p className="text-xs text-slate-500 truncate">{userEmail || ""}</p>
              </div>
              <div className="p-2">
                <DropdownMenuItem
                  className="group relative gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100"
                  onSelect={(event) => {
                    event.preventDefault();
                    router.push("/profile");
                  }}
                >
                  <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-sky-500 transition-all duration-300 group-hover:h-6" />
                  <User className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-500" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="group relative gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100"
                >
                  <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-sky-500 transition-all duration-300 group-hover:h-6" />
                  <Settings className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-500" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="group relative gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100"
                  onSelect={(event) => {
                    event.preventDefault();
                    router.push("/billing");
                  }}
                >
                  <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-sky-500 transition-all duration-300 group-hover:h-6" />
                  <CreditCard className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-500" />
                  Facturation
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="group relative gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100"
                >
                  <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-sky-500 transition-all duration-300 group-hover:h-6" />
                  <Lock className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-500" />
                  Sécurité
                </DropdownMenuItem>
              </div>
              <div className="border-t border-slate-100 p-2">
                <DropdownMenuItem
                  className="gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-red-50 hover:text-red-600"
                  onSelect={(e) => {
                    e.preventDefault();
                    void handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500" />
                  Déconnexion
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
