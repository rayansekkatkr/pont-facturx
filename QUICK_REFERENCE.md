# Factur-X Quick Reference

## French Government Requirements (Summarized)

> **Factur-X** = PDF/A-3 file containing both **readable invoice** + **embedded XML data**

### Key Rules

✅ **DO This**
- Put ALL invoice data in readable PDF
- Include only essential data in XML
- Use PDF/A-3 format exclusively  
- Embed XML with proper MIME type
- Add XMP metadata declaring Factur-X
- Support BASIC, BASIC WL, EN 16931, or EXTENDED profiles

❌ **DON'T Do This**
- Create PDF/A-1 or PDF/A-2 (must be PDF/A-3)
- Rely solely on embedded XML (needs readable PDF)
- Use unsupported profiles
- Omit XMP metadata
- Leave fonts unembedded
- Mix display and automation data without clear rules

---

## Current Implementation Status

### 📊 Completion Matrix

```
Phase 1: Foundation                ████████████████░░  90%
├─ XML Generation                  ✅ COMPLETE
├─ XMP Metadata                     ✅ COMPLETE
├─ Validation Report                ✅ COMPLETE
└─ Documentation                    ✅ COMPLETE

Phase 2: PDF/A-3 Conversion        ░░░░░░░░░░░░░░░░░░   5%
├─ PDF Library Integration          🔄 READY
├─ XML Embedding                    ⏳ PENDING
├─ Readable Content                 ⏳ PENDING
└─ Conformance Setting              ⏳ PENDING

Phase 3: Validation                ░░░░░░░░░░░░░░░░░░   0%
├─ PDF/A-3 Validator               📋 PLANNED
├─ EN 16931 Validator              📋 PLANNED
└─ Factur-X Compliance             📋 PLANNED

Phase 4: Testing                   ░░░░░░░░░░░░░░░░░░   0%
Phase 5: Production                ░░░░░░░░░░░░░░░░░░   0%
```

---

## Installation Guide

### Install Dependencies

```bash
cd webapp

# Required for PDF/A-3 conversion
npm install pdf-lib

# Optional but recommended
npm install pdf-parse  # For enhanced PDF reading
npm install validator # For XML validation
```

---

## Function Reference

### 1. `generateFacturXXml(invoiceData)` ✅ READY

**Input:**
```typescript
{
  vendorName: string
  vendorSIRET: string
  vendorVAT: string
  vendorAddress: string
  clientName: string
  clientSIREN: string
  clientAddress: string
  invoiceNumber: string
  invoiceDate: string      // Format: YYYY-MM-DD
  dueDate: string          // Format: YYYY-MM-DD
  amountHT: string         // Amount before tax
  vatRate: string          // Percentage (e.g., "20")
  vatAmount: string
  amountTTC: string        // Total amount including tax
  iban: string
  bic: string
  paymentTerms: string
  deliveryAddress?: string
}
```

**Output:** EN 16931 compliant XML string

**Usage:**
```typescript
const xml = generateFacturXXml(invoiceData)
// Returns: <?xml version="1.0"...><rsm:CrossIndustryInvoice>...</rsm:CrossIndustryInvoice>
```

---

### 2. `generateFacturXXmpMetadata(profile, invoiceData)` ✅ READY

**Input:**
- `profile`: "BASIC" | "BASIC WL" | "EN 16931" | "EXTENDED"
- `invoiceData`: Same as above

**Output:** XMP metadata XML string

**Usage:**
```typescript
const xmp = generateFacturXXmpMetadata("BASIC WL", invoiceData)
// Returns: XMP metadata with Factur-X declarations
```

---

### 3. `convertToPdfA3WithFacturX(pdfBuffer, xml, data, profile)` 🔄 STUB

**Status:** Function skeleton implemented, awaiting pdf-lib code

**Input:**
- `pdfBuffer`: Original PDF file as Buffer
- `xml`: Generated Factur-X XML string
- `data`: Invoice data object
- `profile`: Factur-X profile

**Output:** PDF/A-3 file as Buffer

**Implementation Notes:**
- Will use pdf-lib to manipulate PDF
- Will embed XML as file attachment
- Will add XMP metadata
- Will set PDF/A-3 conformance
- Will add ICC color profile

**TODO Implementation:**
```typescript
// Step 1: Load PDF
const pdfDoc = await PDFDocument.load(pdfBuffer)

// Step 2: Add readable content if needed
const page = pdfDoc.addPage([612, 792])
page.drawText(`Invoice: ${data.invoiceNumber}`, {...})
// ... add all invoice details

// Step 3: Embed XML
const xmlBuffer = Buffer.from(xml)
await pdfDoc.embedFile(xmlBuffer, 'invoice.xml', 'application/xml')

// Step 4: Add XMP metadata
const xmp = generateFacturXXmpMetadata(profile, data)
pdfDoc.setXmpMetadata(xmp)

// Step 5: Set PDF/A-3
pdfDoc.setConformanceLevel('PDF/A-3-b')

// Step 6: Add ICC profile
const iccProfile = fs.readFileSync('sRGB.icc')
pdfDoc.addICCProfile(iccProfile)

// Step 7: Save
const pdfBytes = await pdfDoc.save()
return Buffer.from(pdfBytes)
```

---

## API Usage

### POST `/api/process`

**Request:**
```json
{
  "fileId": "1234567890-abc",
  "invoiceData": {
    "vendorName": "ACME Corp",
    "vendorSIRET": "123456789",
    ...
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "result": {
    "id": "1234567890-abc",
    "status": "success",
    "facturXPdfUrl": "/api/download/1234567890-abc/facturx.pdf",
    "xmlUrl": "/api/download/1234567890-abc/invoice.xml",
    "reportUrl": "/api/download/1234567890-abc/validation-report.pdf",
    "validation": {
      "pdfA3Valid": true,
      "xmlValid": true,
      "facturXValid": true,
      "errors": [],
      "warnings": []
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message explaining what went wrong"
}
```

---

## Invoice Data Fields (20 Total)

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| vendorName | ✅ | String | "Entreprise ABC SARL" |
| vendorSIRET | ✅ | 14 digits | "12345678900012" |
| vendorVAT | ✅ | String | "FR12345678900" |
| vendorAddress | ✅ | String | "123 Rue de la République\n75001 Paris" |
| clientName | ✅ | String | "Client XYZ SARL" |
| clientSIREN | ✅ | 9 digits | "987654321" |
| clientAddress | ✅ | String | "456 Avenue des Champs\n69000 Lyon" |
| invoiceNumber | ✅ | String | "INV-2024-001" |
| invoiceDate | ✅ | YYYY-MM-DD | "2024-12-29" |
| dueDate | ✅ | YYYY-MM-DD | "2025-01-28" |
| amountHT | ✅ | Decimal | "1000.00" |
| vatRate | ✅ | Percentage | "20" |
| vatAmount | ✅ | Decimal | "200.00" |
| amountTTC | ✅ | Decimal | "1200.00" |
| iban | ✅ | String | "FR76 1234 5678 9012..." |
| bic | ✅ | String | "BNPAFRPPXXX" |
| paymentTerms | ✅ | String | "30 jours nets" |
| deliveryAddress | ⚠️ | String | Same format as address |
| clientSIREN* | 🔄 | 9 digits | Used in XML generation |
| vendorSIRET* | 🔄 | 14 digits | Used in XML generation |

*For XML compliance

---

## Common Issues & Solutions

### Issue: PDF is not PDF/A-3

**Cause:** Missing XMP metadata or ICC profile

**Fix:**
```typescript
// Ensure these are called:
pdfDoc.setXmpMetadata(xmpString)
pdfDoc.setConformanceLevel('PDF/A-3-b')
pdfDoc.addICCProfile(iccProfileBuffer)
```

### Issue: XML not found in PDF

**Cause:** Embedding failed

**Fix:**
```typescript
const xmlBuffer = Buffer.from(xml, 'utf-8')
// Use proper pdf-lib API
await pdfDoc.embedFile(xmlBuffer, 'invoice.xml', 'application/xml')
```

### Issue: XMP metadata invalid

**Cause:** Malformed XML namespaces

**Fix:** Check that all namespace URIs are correct:
- `rdf`: http://www.w3.org/1999/02/22-rdf-syntax-ns#
- `facturx`: urn:factur-x:pdfa:CrossIndustryInvoiceType
- `pdfaid`: http://www.aiim.org/pdfa/xmp/xmpProperties#

### Issue: Fonts not embedded

**Cause:** Using system fonts

**Fix:** Embed fonts explicitly
```typescript
const font = await pdfDoc.embedFont('Helvetica')
page.drawText(text, { font })
```

---

## Files to Check

- **Main Implementation:** `/webapp/app/api/process/route.ts`
- **Specification:** `/FACTUR_X_SPEC.md`
- **Roadmap:** `/IMPLEMENTATION_ROADMAP.md`
- **Summary:** `/IMPLEMENTATION_SUMMARY.md`
- **Storage Layer:** `/webapp/lib/storage.ts`

---

## Validation Checklist

Before considering complete, verify:

- [ ] XML generates without errors
- [ ] XMP metadata is well-formed
- [ ] PDF/A-3 conformance level is set
- [ ] Readable PDF contains all invoice data
- [ ] Embedded XML contains automation data
- [ ] ICC color profile is embedded
- [ ] Output intent is defined
- [ ] All fonts are embedded
- [ ] No external references exist
- [ ] Passes official Factur-X validator

---

## Testing Quick Start

```typescript
import { generateFacturXXml, generateFacturXXmpMetadata } from '@/app/api/process/route'

const testData = {
  vendorName: "Test Corp",
  vendorSIRET: "12345678900012",
  // ... fill in other required fields
}

// Test XML generation
const xml = generateFacturXXml(testData)
console.log("XML generated:", xml.length, "bytes")

// Test XMP generation
const xmp = generateFacturXXmpMetadata("BASIC WL", testData)
console.log("XMP generated:", xmp.length, "bytes")

// Verify they're valid XML
console.assert(xml.includes("CrossIndustryInvoice"))
console.assert(xmp.includes("facturx:ConformanceLevel"))
```

---

## Links & References

- [Factur-X Official](http://www.factur-x.info/)
- [EN 16931 Standard](https://www.en-standard.eu/en-16931-1)
- [French Government Factur-X](https://www.impots.gouv.fr/factur-x)
- [PDF/A-3 ISO 19005-3](https://www.iso.org/standard/54684.html)
- [pdf-lib Documentation](https://pdfme.org/)
- [XMP Specification](https://github.com/adobe/xmp-docs)

---

## Quick Command Reference

```bash
# Install dependencies
npm install pdf-lib

# Run tests (once implemented)
npm test -- factur-x

# Type check
tsc --noEmit

# Lint
eslint app/api/process/

# Generate PDF (once implemented)
curl -X POST http://localhost:3000/api/process \
  -H "Content-Type: application/json" \
  -d '{"fileId":"123","invoiceData":{...}}'
```

---

**Last Updated:** 2025-12-29  
**Status:** Foundation Complete, PDF/A-3 Conversion Ready for Implementation  
**Next Step:** Implement `convertToPdfA3WithFacturX()` with pdf-lib
