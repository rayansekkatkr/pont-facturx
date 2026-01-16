"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InvoiceData {
  vendorName: string;
  vendorSIRET: string;
  vendorVAT: string;
  vendorAddress: string;
  clientName: string;
  clientSIREN: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amountHT: string;
  vatRate: string;
  vatAmount: string;
  amountTTC: string;
  iban: string;
  bic: string;
  paymentTerms: string;
  deliveryAddress?: string;
}

interface InvoiceFormProps {
  fieldsToVerify?: string[];
  initialData?: InvoiceData;
  onChange?: (data: InvoiceData) => void;
}

const EMPTY_INVOICE_DATA: InvoiceData = {
  vendorName: "",
  vendorSIRET: "",
  vendorVAT: "",
  vendorAddress: "",
  clientName: "",
  clientSIREN: "",
  clientAddress: "",
  invoiceNumber: "",
  invoiceDate: "",
  dueDate: "",
  amountHT: "",
  vatRate: "",
  vatAmount: "",
  amountTTC: "",
  iban: "",
  bic: "",
  paymentTerms: "",
  deliveryAddress: "",
};

function isSameInvoiceData(a: InvoiceData, b: InvoiceData): boolean {
  return (
    a.vendorName === b.vendorName &&
    a.vendorSIRET === b.vendorSIRET &&
    a.vendorVAT === b.vendorVAT &&
    a.vendorAddress === b.vendorAddress &&
    a.clientName === b.clientName &&
    a.clientSIREN === b.clientSIREN &&
    a.clientAddress === b.clientAddress &&
    a.invoiceNumber === b.invoiceNumber &&
    a.invoiceDate === b.invoiceDate &&
    a.dueDate === b.dueDate &&
    a.amountHT === b.amountHT &&
    a.vatRate === b.vatRate &&
    a.vatAmount === b.vatAmount &&
    a.amountTTC === b.amountTTC &&
    a.iban === b.iban &&
    a.bic === b.bic &&
    a.paymentTerms === b.paymentTerms &&
    (a.deliveryAddress ?? "") === (b.deliveryAddress ?? "")
  );
}

export function InvoiceForm({
  fieldsToVerify = [],
  initialData,
  onChange,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceData>(() => {
    if (!initialData) return EMPTY_INVOICE_DATA;
    return { ...EMPTY_INVOICE_DATA, ...initialData };
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (!initialData) return;

    const merged = { ...EMPTY_INVOICE_DATA, ...initialData };
    setFormData((prev) => (isSameInvoiceData(prev, merged) ? prev : merged));
  }, [initialData]);

  const handleFieldChange = (field: keyof InvoiceData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const needsVerification = (field: string) => {
    return fieldsToVerify.includes(field);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sky-500">■</span>
          <h2 className="text-lg font-bold text-slate-900">Vendeur & Client</h2>
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Informations du vendeur
            </Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="vendorName" className="text-sm font-medium">
                  Nom de l'entreprise
                </Label>
                <Input
                  id="vendorName"
                  value={formData.vendorName}
                  onChange={(e) => handleFieldChange("vendorName", e.target.value)}
                  className="rounded-lg border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorSIRET" className="text-sm font-medium">
                  SIREN / SIRET
                </Label>
                <Input
                  id="vendorSIRET"
                  value={formData.vendorSIRET}
                  onChange={(e) => handleFieldChange("vendorSIRET", e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorVAT" className="text-sm font-medium">
                  Numéro de TVA
                </Label>
                <Input
                  id="vendorVAT"
                  value={formData.vendorVAT}
                  onChange={(e) => handleFieldChange("vendorVAT", e.target.value)}
                  className="border-slate-200"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Informations du client
            </Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium">
                  Nom du client
                </Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleFieldChange("clientName", e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSIREN" className="text-sm font-medium">
                  SIREN
                </Label>
                <Input
                  id="clientSIREN"
                  value={formData.clientSIREN}
                  onChange={(e) => handleFieldChange("clientSIREN", e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="clientAddress" className="text-sm font-medium">
                  Adresse
                </Label>
                <Textarea
                  id="clientAddress"
                  value={formData.clientAddress}
                  onChange={(e) => handleFieldChange("clientAddress", e.target.value)}
                  rows={2}
                  className="border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sky-500">■</span>
          <h2 className="text-lg font-bold text-slate-900">Détails de la facture</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber" className="text-sm font-medium">
              Numéro
            </Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) => handleFieldChange("invoiceNumber", e.target.value)}
              className="border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceDate" className="text-sm font-medium">
              Date de facture
            </Label>
            <Input
              id="invoiceDate"
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => handleFieldChange("invoiceDate", e.target.value)}
              className="border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Date d'échéance
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleFieldChange("dueDate", e.target.value)}
              className="border-slate-200"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sky-500">■</span>
          <h2 className="text-lg font-bold text-slate-900">Montants</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="amountHT" className="text-sm font-medium">
              Montant HT (€)
            </Label>
            <Input
              id="amountHT"
              type="number"
              step="0.01"
              value={formData.amountHT}
              onChange={(e) => handleFieldChange("amountHT", e.target.value)}
              className="border-slate-200 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vatRate" className="text-sm font-medium">
              Taux de TVA (%)
            </Label>
            <Input
              id="vatRate"
              type="number"
              step="0.01"
              value={formData.vatRate}
              onChange={(e) => handleFieldChange("vatRate", e.target.value)}
              className="border-slate-200 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vatAmount" className="text-sm font-medium">
              Montant TVA (€)
            </Label>
            <Input
              id="vatAmount"
              type="number"
              step="0.01"
              value={formData.vatAmount}
              onChange={(e) => handleFieldChange("vatAmount", e.target.value)}
              className="border-slate-200 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amountTTC" className="text-sm font-bold">
              Total TTC (€)
            </Label>
            <Input
              id="amountTTC"
              type="number"
              step="0.01"
              value={formData.amountTTC}
              onChange={(e) => handleFieldChange("amountTTC", e.target.value)}
              className="border-slate-200 bg-slate-50 font-mono font-semibold"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sky-500">■</span>
          <h2 className="text-lg font-bold text-slate-900">Informations de paiement</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="iban" className="text-sm font-medium">
              IBAN
            </Label>
            <Input
              id="iban"
              value={formData.iban}
              onChange={(e) => handleFieldChange("iban", e.target.value)}
              className="border-slate-200 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bic" className="text-sm font-medium">
              BIC
            </Label>
            <Input
              id="bic"
              value={formData.bic}
              onChange={(e) => handleFieldChange("bic", e.target.value)}
              className="border-slate-200 font-mono"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="paymentTerms" className="text-sm font-medium">
              Conditions de paiement
            </Label>
            <Input
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => handleFieldChange("paymentTerms", e.target.value)}
              className="border-slate-200"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 opacity-80 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-slate-400">■</span>
          <h2 className="text-lg font-bold text-slate-500">Livraison (optionnel)</h2>
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliveryAddress" className="text-sm font-medium">
            Adresse de livraison si différente
          </Label>
          <Textarea
            id="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={(e) => handleFieldChange("deliveryAddress", e.target.value)}
            rows={2}
            placeholder="Laisser vide si identique à l'adresse du client"
            className="border-slate-200 italic"
          />
        </div>
      </section>
    </div>
  );
}
