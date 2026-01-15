"use client";

import Link from "next/link";
import { Bell, CreditCard, LifeBuoy, Lock, User } from "lucide-react";

type SettingsSection = "profile" | "billing" | "security" | "notifications";

type SettingsSidebarProps = {
  active: SettingsSection;
};

export function SettingsSidebar({ active }: SettingsSidebarProps) {
  const nav = [
    { key: "profile", label: "Profil", href: "/profile", icon: User },
    { key: "billing", label: "Facturation", href: "/billing", icon: CreditCard },
    { key: "security", label: "Sécurité", href: "/dashboard", icon: Lock },
    { key: "notifications", label: "Notifications", href: "/dashboard", icon: Bell },
  ] as const;

  return (
    <aside className="w-full flex-shrink-0 lg:sticky lg:top-32 lg:w-72">
      <div
        className="rounded-3xl border border-slate-200/50 bg-slate-50/60 p-4"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.05) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <nav className="space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={
                  isActive
                    ? "flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white px-5 py-3.5 text-sm font-bold text-teal-600 shadow-sm"
                    : "flex items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-500 transition-all hover:bg-white hover:text-sky-500"
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50 to-sky-50 px-5 py-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
            Support premium
          </p>
          <p className="text-xs text-slate-600">
            Besoin d'aide avec vos abonnements ?
          </p>
          <button className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-sky-500 hover:underline">
            Contacter un expert
            <LifeBuoy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
