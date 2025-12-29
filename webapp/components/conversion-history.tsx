"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ConversionStatus = "success" | "processing" | "error"

interface Conversion {
  id: string
  date: string
  client: string
  amount: string
  status: ConversionStatus
  profile: string
}

export function ConversionHistory() {
  const [conversions] = useState<Conversion[]>([
    {
      id: "INV-2024-001",
      date: "2024-12-28",
      client: "Entreprise ABC",
      amount: "1 250,00 €",
      status: "success",
      profile: "BASIC WL",
    },
    {
      id: "INV-2024-002",
      date: "2024-12-27",
      client: "Société XYZ",
      amount: "3 450,00 €",
      status: "success",
      profile: "BASIC WL",
    },
    {
      id: "INV-2024-003",
      date: "2024-12-27",
      client: "Cabinet Conseil",
      amount: "850,00 €",
      status: "processing",
      profile: "MINIMUM",
    },
    {
      id: "INV-2024-004",
      date: "2024-12-26",
      client: "Tech Solutions",
      amount: "5 200,00 €",
      status: "success",
      profile: "BASIC WL",
    },
    {
      id: "INV-2024-005",
      date: "2024-12-26",
      client: "Retail Group",
      amount: "2 100,00 €",
      status: "error",
      profile: "BASIC WL",
    },
  ])

  const getStatusBadge = (status: ConversionStatus) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-chart-2 text-white">
            Validé
          </Badge>
        )
      case "processing":
        return <Badge variant="secondary">En cours</Badge>
      case "error":
        return <Badge variant="destructive">Erreur</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des conversions</CardTitle>
        <CardDescription>Consultez et gérez vos factures converties</CardDescription>
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
              {conversions.map((conversion) => (
                <TableRow key={conversion.id}>
                  <TableCell className="font-medium">{conversion.date}</TableCell>
                  <TableCell>{conversion.id}</TableCell>
                  <TableCell>{conversion.client}</TableCell>
                  <TableCell className="text-right">{conversion.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{conversion.profile}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(conversion.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger XML
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
