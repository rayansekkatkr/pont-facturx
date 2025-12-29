"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface InvoiceData {
  vendorName: string
  vendorSIRET: string
  vendorVAT: string
  vendorAddress: string
  clientName: string
  clientSIREN: string
  clientAddress: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  amountHT: string
  vatRate: string
  vatAmount: string
  amountTTC: string
  iban: string
  bic: string
  paymentTerms: string
  deliveryAddress?: string
}

interface InvoiceFormProps {
  fieldsToVerify?: string[]
  initialData?: InvoiceData
  onChange?: (data: InvoiceData) => void
}

export function InvoiceForm({ fieldsToVerify = [], initialData, onChange }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceData>({
    vendorName: "Entreprise ABC SAS",
    vendorSIRET: "12345678900012",
    vendorVAT: "FR12345678900",
    vendorAddress: "123 Rue de la République\n75001 Paris, France",
    clientName: "Client XYZ SARL",
    clientSIREN: "98765432100",
    clientAddress: "456 Avenue des Champs\n69000 Lyon, France",
    invoiceNumber: "INV-2024-001",
    invoiceDate: "2024-12-28",
    dueDate: "2025-01-28",
    amountHT: "1041.67",
    vatRate: "20",
    vatAmount: "208.33",
    amountTTC: "1250.00",
    iban: "FR76 1234 5678 9012 3456 7890 123",
    bic: "BNPAFRPPXXX",
    paymentTerms: "30 jours nets",
    deliveryAddress: "",
  })

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const [confidenceScores] = useState({
    vendorSIRET: 75,
    clientSIREN: 68,
    vendorVAT: 92,
    invoiceNumber: 98,
    amountTTC: 95,
  })

  const handleFieldChange = (field: keyof InvoiceData, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    if (onChange) {
      onChange(newData)
    }
  }

  const getConfidenceBadge = (field: keyof typeof confidenceScores) => {
    const score = confidenceScores[field]
    if (!score) return null

    if (score >= 90) {
      return (
        <Badge variant="default" className="bg-chart-2 text-xs text-white">
          {score}% confiance
        </Badge>
      )
    } else if (score >= 70) {
      return (
        <Badge variant="secondary" className="bg-chart-4 text-xs text-foreground">
          {score}% confiance
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive" className="text-xs">
          {score}% confiance
        </Badge>
      )
    }
  }

  const needsVerification = (field: string) => {
    return fieldsToVerify.includes(field)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations du vendeur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendorName">Nom de l'entreprise</Label>
            <Input
              id="vendorName"
              value={formData.vendorName}
              onChange={(e) => handleFieldChange("vendorName", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="vendorSIRET" className="flex items-center gap-2">
                  SIREN / SIRET
                  {needsVerification("vendorSIRET") && (
                    <AlertCircle className="h-4 w-4 text-chart-4" title="À vérifier" />
                  )}
                </Label>
                {getConfidenceBadge("vendorSIRET")}
              </div>
              <Input
                id="vendorSIRET"
                value={formData.vendorSIRET}
                onChange={(e) => handleFieldChange("vendorSIRET", e.target.value)}
                className={needsVerification("vendorSIRET") ? "border-chart-4" : ""}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="vendorVAT">Numéro de TVA</Label>
                {getConfidenceBadge("vendorVAT")}
              </div>
              <Input
                id="vendorVAT"
                value={formData.vendorVAT}
                onChange={(e) => handleFieldChange("vendorVAT", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendorAddress">Adresse</Label>
            <Textarea
              id="vendorAddress"
              value={formData.vendorAddress}
              onChange={(e) => handleFieldChange("vendorAddress", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations du client</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nom du client</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => handleFieldChange("clientName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="clientSIREN" className="flex items-center gap-2">
                SIREN
                {needsVerification("clientSIREN") && (
                  <AlertCircle className="h-4 w-4 text-chart-4" title="À vérifier" />
                )}
              </Label>
              {getConfidenceBadge("clientSIREN")}
            </div>
            <Input
              id="clientSIREN"
              value={formData.clientSIREN}
              onChange={(e) => setFormData({ ...formData, clientSIREN: e.target.value })}
              className={needsVerification("clientSIREN") ? "border-chart-4" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress">Adresse</Label>
            <Textarea
              id="clientAddress"
              value={formData.clientAddress}
              onChange={(e) => handleFieldChange("clientAddress", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Détails de la facture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="invoiceNumber">Numéro</Label>
                {getConfidenceBadge("invoiceNumber")}
              </div>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Date de facture</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleFieldChange("invoiceDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleFieldChange("dueDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Montants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amountHT">Montant HT (€)</Label>
              <Input
                id="amountHT"
                type="number"
                step="0.01"
                value={formData.amountHT}
                onChange={(e) => handleFieldChange("amountHT", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatRate">Taux de TVA (%)</Label>
              <Input
                id="vatRate"
                type="number"
                step="0.01"
                value={formData.vatRate}
                onChange={(e) => handleFieldChange("vatRate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatAmount">Montant TVA (€)</Label>
              <Input
                id="vatAmount"
                type="number"
                step="0.01"
                value={formData.vatAmount}
                onChange={(e) => handleFieldChange("vatAmount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amountTTC">Montant TTC (€)</Label>
                {getConfidenceBadge("amountTTC")}
              </div>
              <Input
                id="amountTTC"
                type="number"
                step="0.01"
                value={formData.amountTTC}
                onChange={(e) => setFormData({ ...formData, amountTTC: e.target.value })}
                className="font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={formData.iban}
                onChange={(e) => handleFieldChange("iban", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bic">BIC</Label>
              <Input
                id="bic"
                value={formData.bic}
                onChange={(e) => handleFieldChange("bic", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Conditions de paiement</Label>
            <Input
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => handleFieldChange("paymentTerms", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Livraison (optionnel)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Adresse de livraison si différente</Label>
            <Textarea
              id="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              rows={3}
              placeholder="Laisser vide si identique à l'adresse du client"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
