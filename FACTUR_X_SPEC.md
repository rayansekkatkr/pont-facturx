# Factur-X Format Implementation Guide

Based on French Government Guidelines (EN 16931-1 & Factur-X Standard)

## Overview

Factur-X is a standardized format for electronic invoicing combining:
- **PDF/A-3 file**: Readable representation + envelope for structured data
- **Embedded XML**: EN 16931 compliant structured invoice data
- **XMP metadata**: Declares Factur-X profile and document properties

## Key Requirements

### 1. File Format: PDF/A-3

A Factur-X invoice is a **PDF/A-3 file** that serves as both:
- **Human-readable representation**: The visual invoice document
- **Data container**: Envelope for XML and attachments

#### PDF/A-3 Characteristics
- All fonts must be embedded (no system fonts)
- No external resources or links
- Valid color spaces (RGB, CMYK, Grayscale)
- ICC color profile required
- XMP metadata required (not optional)
- Output intent must be defined
- No transparency or special effects

### 2. Embedded XML (Structured Data)

The XML file (`invoice.xml` or `factur-x.xml`) contains:
- Only **automation-essential information** for processing
- Data that is **already in the readable PDF**
- NO supplementary information

Key XML nodes (Cross-Industry Invoice - CII):
```xml
<rsm:CrossIndustryInvoice>
  <rsm:ExchangedDocumentContext>
    <!-- Profile declaration (BASIC, BASIC WL, EN 16931, EXTENDED) -->
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <!-- Invoice ID, type, date -->
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
    <!-- Seller/Buyer info, amounts, taxes, payment terms -->
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>
```

### 3. XMP Metadata

XMP (Extensible Metadata Platform) declares:

```xml
<facturx:ConformanceLevel>BASIC WL</facturx:ConformanceLevel>
<facturx:DocumentFileName>invoice.xml</facturx:DocumentFileName>
<pdfaid:part>3</pdfaid:part>
<pdfaid:conformance>B</pdfaid:conformance>
```

## Supported Profiles

Only these 4 profiles are allowed:

| Profile | Use Case | Complexity |
|---------|----------|-----------|
| **BASIC** | Simple invoices, minimal fields | Minimum |
| **BASIC WL** | Standard invoices with line items | Recommended |
| **EN 16931** | Full EN 16931 compliance | High |
| **EXTENDED** | Complex scenarios, multiple attachments | Maximum |

Currently implementing: **BASIC WL**

## Data Handling Rules

### All Data in Readable PDF
> "L'ensemble des données de la facture doit être portée par le lisible PDF"
> *All invoice data must be carried by the readable PDF*

When converting from OCR'd PDFs:
1. **Original PDF content** may be insufficient or unclear
2. **Add overlay or new page** with formatted invoice data
3. **Ensure all fields are visible**:
   - Vendor details (name, SIREN, VAT, address)
   - Customer details (name, SIREN, address)
   - Invoice number and date
   - Line items (description, quantity, amount)
   - Totals (HT, VAT, TTC)
   - Payment terms and due date
   - Payment details (IBAN, BIC)

### XML Contains Only Essential Data
> "le fichier de données structurées ne contient que les informations nécessaires à l'automatisation"
> *The structured data file contains only information necessary for automation*

The XML embeds only fields needed for automated processing:
- Will NOT duplicate display-only information
- Will contain invoice totals, parties, dates, payment info
- Will NOT contain detailed line descriptions (if not needed for processing)

### Attachments
> "L'ensemble des pièces jointes sont à ce titre des pièces jointes complémentaires (type = 02)"
> *All attachments are supplementary attachments (type = 02)*

Attachments can be stored in:
1. **PDF/A-3 metadata (XMP)** - Preferred, part of the PDF
2. **Structured XML data** - Alternative

## Implementation Steps

### Phase 1: PDF/A-3 Conversion (In Progress)

```javascript
// 1. Load original PDF
const originalPdf = PDFDocument.load(pdfBuffer)

// 2. Ensure readable representation
// If OCR PDF lacks clarity, add new page with formatted invoice

// 3. Embed XML as file attachment
const xmlBuffer = Buffer.from(facturXXml)
pdfDoc.embedFile(xmlBuffer, 'invoice.xml', 'application/xml')

// 4. Add XMP metadata
const xmpMetadata = generateXmpMetadata(profile)
pdfDoc.setXmpMetadata(xmpMetadata)

// 5. Set PDF/A-3 conformance
pdfDoc.setConformanceLevel('PDF/A-3b')

// 6. Add ICC color profile (required for PDF/A-3)
const iccProfile = fs.readFileSync('sRGB.icc')
pdfDoc.addICCProfile(iccProfile)

// 7. Save and return
return pdfDoc.save()
```

### Phase 2: Validation

```javascript
// Validate PDF/A-3 compliance using:
// 1. veraPDF (official PDF/A validator)
// 2. Schematron rules for EN 16931
// 3. Custom Factur-X validation

// Check:
// ✓ PDF/A-3 structure
// ✓ Embedded file (XML)
// ✓ XMP metadata
// ✓ All required fields present
// ✓ ISO 20022 standards for payment data
```

## Library Requirements

To properly implement Factur-X generation:

```bash
npm install pdf-lib pdfkit xml2js
```

Or use specialized libraries:
```bash
npm install factur-x  # If available
npm install pypdf2 python-library  # For advanced PDF ops
```

## Current Implementation Status

### ✅ Completed
- EN 16931 XML generation (CII D22B format)
- XMP metadata template generation
- Profile support (BASIC WL structure)
- Validation report generation

### ⏳ In Progress
- PDF/A-3 conversion function (`convertToPdfA3WithFacturX`)
- XML embedding mechanism
- XMP metadata injection
- ICC color profile handling

### 📋 TODO
1. Install `pdf-lib` dependency
2. Implement PDF/A-3 conversion logic
3. Add readable content if needed (OCR overlay)
4. Validate PDF/A-3 compliance (veraPDF)
5. Test with official Factur-X validators
6. Add support for attachments
7. Implement Schematron validation

## Testing the Implementation

```javascript
// Mock test with current placeholder
const invoiceData = {
  vendorName: "ACME Corp",
  vendorVAT: "FR12345678900",
  invoiceNumber: "INV-2024-001",
  amountHT: "1000",
  vatRate: "20",
  vatAmount: "200",
  amountTTC: "1200",
  // ... other fields
}

const result = await POST(request)
// Returns:
{
  success: true,
  result: {
    id: "fileId",
    status: "success",
    facturXPdfUrl: "/api/download/fileId/facturx.pdf",
    xmlUrl: "/api/download/fileId/invoice.xml",
    validation: {
      pdfA3Valid: true,
      xmlValid: true,
      facturXValid: true
    }
  }
}
```

## References

- [EN 16931-1 Standard](https://www.en-standard.eu/en-16931-1-electronic-invoicing)
- [Factur-X Official Spec](http://www.factur-x.info/)
- [French Government Factur-X Documentation](https://www.impots.gouv.fr/factur-x)
- [PDF/A-3 Specification](https://www.iso.org/standard/54684.html)
- [XMP Specification](https://github.com/adobe/xmp-docs)

## Implementation Notes

### Why XMP Metadata?
XMP is Adobe's standard metadata format embedded in PDFs. It allows applications to:
- Identify the file as Factur-X
- Know which embedded file contains the invoice data
- Extract processing instructions
- Validate conformance level

### Why PDF/A-3?
- **PDF/A-3-b**: Binary conformance level (allows embedded files, fonts, colors)
- Ensures long-term archival (unlike regular PDF/A-1 or A-2)
- Legally compliant in France and EU
- Supports structured data embedding

### Readable vs Structured Data
- **Readable PDF**: Visual representation (human reads with PDF viewer)
- **Structured XML**: Machine-readable invoice (ERP systems import)
- Both are required and synchronized

## Error Handling

Common issues and solutions:

| Issue | Cause | Solution |
|-------|-------|----------|
| PDF not PDF/A-3 | Missing XMP metadata | Add XMP before saving |
| Fonts not embedded | Using system fonts | Embed all fonts explicitly |
| XML not found | Attachment not created | Use proper PDF library API |
| Validation fails | Missing ICC profile | Add sRGB ICC profile |

## Production Checklist

- [ ] Install pdf-lib and dependencies
- [ ] Implement `convertToPdfA3WithFacturX` fully
- [ ] Add ICC color profile (sRGB.icc file)
- [ ] Test with veraPDF validator
- [ ] Test with Factur-X official validators
- [ ] Add comprehensive error handling
- [ ] Add logging for debugging
- [ ] Document file size limits
- [ ] Implement rate limiting
- [ ] Add security checks for XML injection

