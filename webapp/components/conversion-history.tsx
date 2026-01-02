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
import { loadConversions, type StoredConversion } from "@/lib/conversion-store";

type Conversion = StoredConversion;

export function ConversionHistory() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      setConversions(loadConversions());
    } finally {
      setLoading(false);
    }
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
    if (status === "success") {
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
    const url =
      kind === "pdf"
        ? `/api/download/${fileId}/facturx.pdf`
        : `/api/download/${fileId}/invoice.xml`;
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
                      {formatDate(c.createdAt)}
                    </TableCell>
                    <TableCell>{c.fileName.replace(/\.pdf$/i, "")}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell className="text-right">—</TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.profile}</Badge>
                    </TableCell>
                    <TableCell>{statusBadge(c.status)}</TableCell>
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
