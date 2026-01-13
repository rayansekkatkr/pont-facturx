"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, MoreHorizontal } from "lucide-react";
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

  function statusBadge(status: Conversion["status"]) {
    if (status === "success" || status === "ready") {
      return (
        <Badge variant="default" className="bg-chart-2 text-white">
          Validé
        </Badge>
      );
    }
    if (status === "error") return <Badge variant="destructive">Erreur</Badge>;
    return <Badge variant="secondary">En cours</Badge>;
  }

  function download(fileId: string, kind: "pdf" | "xml") {
    const url = `/api/proxy/v1/conversions/${fileId}/${kind}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des conversions</CardTitle>
        <CardDescription>
          Consultez et gérez vos factures converties
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error || "Erreur lors du chargement"}
          </p>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Profil</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-sm text-muted-foreground"
                  >
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : conversions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-sm text-muted-foreground"
                  >
                    Aucune conversion pour le moment.
                  </TableCell>
                </TableRow>
              ) : (
                conversions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {formatDate(c.created_at)}
                    </TableCell>
                    <TableCell>
                      {(c.invoice_number || c.file_name || "").replace(
                        /\.pdf$/i,
                        "",
                      )}
                    </TableCell>
                    <TableCell>{c.client_name || "—"}</TableCell>
                    <TableCell className="text-right">
                      {c.amount_total
                        ? `${c.amount_total} ${c.currency || "EUR"}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {(c.profile || "BASIC_WL").replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{statusBadge(c.status as Conversion["status"])}</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
