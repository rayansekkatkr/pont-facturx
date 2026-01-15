"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, MoreHorizontal, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type ConversionStatus = "ready" | "success" | "error" | "processing";

type Conversion = {
  id: string;
  file_name: string;
  invoice_number?: string | null;
  client_name?: string | null;
  amount_total?: string | null;
  currency?: string | null;
  profile: string;
  status: ConversionStatus;
  created_at: string;
};

export function ConversionHistory() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFromBackend() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/proxy/v1/conversions", {
          signal: controller.signal,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const body = (await res.json()) as { items?: Conversion[] };
        setConversions(Array.isArray(body?.items) ? body.items : []);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        console.error("[ConversionHistory] fetch error", err);
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement",
        );
      } finally {
        setLoading(false);
      }
    }

    loadFromBackend();
    return () => controller.abort();
  }, []);

  const formatDate = useMemo(() => {
    return (iso: string) => {
      try {
        return new Date(iso).toLocaleDateString("fr-FR");
      } catch {
        return iso;
      }
    };
  }, []);

  const filteredConversions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversions;
    return conversions.filter((c) => {
      const invoice = (c.invoice_number || c.file_name || "").toLowerCase();
      const client = (c.client_name || "").toLowerCase();
      const profile = (c.profile || "").toLowerCase();
      return invoice.includes(q) || client.includes(q) || profile.includes(q);
    });
  }, [conversions, query]);

  function statusBadge(status: Conversion["status"]) {
    if (status === "success" || status === "ready") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
          Validé
        </span>
      );
    }
    if (status === "error") {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-700">
          Erreur
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700">
        En cours
      </span>
    );
  }

  function download(fileId: string, kind: "pdf" | "xml") {
    const url = `/api/proxy/v1/conversions/${fileId}/${kind}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const totalItems = filteredConversions.length;
  const displayCount = Math.min(totalItems, 4);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-[0_10px_40px_-10px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-6 border-b border-slate-100 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            Historique des conversions
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Gestion de vos factures numériques.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher..."
            className="h-12 w-full rounded-2xl border-none bg-slate-50 pl-12 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
          />
        </div>
      </div>

      <div className="grow overflow-x-auto">
        {error && (
          <p className="px-8 pb-4 pt-6 text-sm text-red-600">
            {error || "Erreur lors du chargement"}
          </p>
        )}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Numéro</th>
              <th className="px-8 py-5">Client</th>
              <th className="px-8 py-5">Montant</th>
              <th className="px-8 py-5 text-center">Profil</th>
              <th className="px-8 py-5 text-right">Statut</th>
              <th className="px-8 py-5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-8 py-6 text-sm text-slate-400">
                  Chargement...
                </td>
              </tr>
            ) : filteredConversions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-6 text-sm text-slate-400">
                  Aucune conversion pour le moment.
                </td>
              </tr>
            ) : (
              filteredConversions.map((c) => (
                <tr key={c.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-8 py-5 text-sm font-semibold text-slate-600">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-400">
                    {(c.invoice_number || c.file_name || "").replace(/\.pdf$/i, "")}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-800">
                    {c.client_name || "—"}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-900">
                    {c.amount_total ? `${c.amount_total} ${c.currency || "EUR"}` : "—"}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold uppercase text-slate-600">
                      {(c.profile || "BASIC_WL").replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {statusBadge(c.status as Conversion["status"])}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => download(c.id, "pdf")}>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => download(c.id, "xml")}>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger XML
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-8 py-6">
        <span className="text-sm font-medium text-slate-500">
          Affichage de <span className="font-bold text-slate-900">1-{displayCount}</span> sur{" "}
          <span className="font-bold text-slate-900">{totalItems}</span>
        </span>
        <div className="flex gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold shadow-sm transition-all hover:bg-slate-50">
            Précédent
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold shadow-sm transition-all hover:bg-slate-50">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
