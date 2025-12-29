# Factur-X Implementation Roadmap

## Phase 1: Foundation (✅ Completed)

### 1.1 XML Generation
- [x] Generate EN 16931 compliant XML (CII D22B format)
- [x] Support BASIC WL profile
- [x] Include all required invoice fields
- [x] Proper namespace declarations
- [x] Date formatting (YYYYMMDD)

### 1.2 XMP Metadata
- [x] Generate XMP template structure
- [x] Declare Factur-X profile
- [x] Document identification
- [x] PDF/A-3 compliance info
- [x] Embedded file relationships

### 1.3 Project Structure
- [x] Create `process/route.ts` API endpoint
- [x] Implement `generateFacturXXml()` function
- [x] Implement `generateFacturXXmpMetadata()` function
- [x] Create function stubs for PDF/A-3 conversion
- [x] Document requirements in FACTUR_X_SPEC.md

---

## Phase 2: PDF/A-3 Conversion (🔄 In Progress)

### 2.1 Dependencies Installation

```bash
cd /Users/rayansekkat/Desktop/rayan_project/pont-facturx/webapp

# Install pdf-lib for PDF manipulation
npm install pdf-lib

# Install pdf-parse for PDF reading (alternative)
npm install pdf-parse

# Optional: Schematron validation
npm install libxslt
```

### 2.2 PDF Processing Function

Implement `convertToPdfA3WithFacturX()` to:

```typescript
async function convertToPdfA3WithFacturX(
  originalPdfBuffer: Buffer,
  facturXXml: string,
  invoiceData: InvoiceData,
  profile: string
): Promise<Buffer> {
  // 1. Load PDF
  // 2. Add readable content (if needed)
  // 3. Embed XML file
  // 4. Add XMP metadata
  // 5. Set PDF/A-3 conformance
  // 6. Add ICC color profile
  // 7. Embed output intent
  // 8. Return PDF buffer
}
```

### 2.3 Readable Content Addition

When OCR PDF lacks clarity, create overlay:

```typescript
// Pseudocode for adding readable invoice to PDF
function enhanceReadablePdf(pdfDoc, invoiceData) {
  const page = pdfDoc.addPage([612, 792]) // 8.5" x 11"
  
  // Header
  page.drawText(`INVOICE ${invoiceData.invoiceNumber}`, {
    x: 50, y: 700, size: 18, font: 'Helvetica-Bold'
  })
  
  // Vendor info
  page.drawText(`${invoiceData.vendorName}`, { x: 50, y: 650 })
  page.drawText(`SIREN: ${invoiceData.vendorSIRET.slice(0, 9)}`, { x: 50, y: 630 })
  page.drawText(`VAT: ${invoiceData.vendorVAT}`, { x: 50, y: 610 })
  page.drawText(invoiceData.vendorAddress, { x: 50, y: 590 })
  
  // Customer info
  page.drawText(`Bill To: ${invoiceData.clientName}`, { x: 320, y: 650 })
  page.drawText(`SIREN: ${invoiceData.clientSIREN}`, { x: 320, y: 630 })
  page.drawText(invoiceData.clientAddress, { x: 320, y: 610 })
  
  // Dates
  page.drawText(`Invoice Date: ${invoiceData.invoiceDate}`, { x: 50, y: 480 })
  page.drawText(`Due Date: ${invoiceData.dueDate}`, { x: 320, y: 480 })
  
  // Amounts
  page.drawText(`Amount (HT): ${invoiceData.amountHT} EUR`, { x: 50, y: 400 })
  page.drawText(`VAT Rate: ${invoiceData.vatRate}%`, { x: 320, y: 400 })
  page.drawText(`VAT Amount: ${invoiceData.vatAmount} EUR`, { x: 50, y: 380 })
  page.drawText(`TOTAL (TTC): ${invoiceData.amountTTC} EUR`, { 
    x: 50, y: 360, size: 14, font: 'Helvetica-Bold' 
  })
  
  // Payment info
  page.drawText(`IBAN: ${invoiceData.iban}`, { x: 50, y: 300 })
  page.drawText(`BIC: ${invoiceData.bic}`, { x: 320, y: 300 })
  page.drawText(`Payment Terms: ${invoiceData.paymentTerms}`, { x: 50, y: 280 })
}
```

### 2.4 XML Embedding

```typescript
// Embed XML as file attachment
const xmlBuffer = Buffer.from(facturXXml, 'utf-8')
const attachment = await pdfDoc.embedFile(
  xmlBuffer,
  'invoice.xml',  // File name
  'application/xml'  // MIME type
)

// Associate attachment with document
pdfDoc.setAttachment({
  name: 'invoice.xml',
  mimeType: 'application/xml',
  data: xmlBuffer
})
```

### 2.5 XMP Metadata Injection

```typescript
// Set XMP metadata in PDF
const xmpMetadata = generateFacturXXmpMetadata(profile, invoiceData)
pdfDoc.setXmpMetadata(xmpMetadata)

// Required fields:
// - pdf:Producer
// - pdf:CreationDate
// - pdfaid:part (3)
// - pdfaid:conformance (B)
// - facturx:ConformanceLevel (BASIC WL)
// - facturx:DocumentFileName (invoice.xml)
```

### 2.6 PDF/A-3 Conformance

```typescript
// Set conformance level
pdfDoc.setConformanceLevel('PDF/A-3-b')

// Embed ICC color profile (sRGB)
// Required for PDF/A-3 compliance
const sRgbProfile = fs.readFileSync('sRGB.icc')
pdfDoc.addICCProfile(sRgbProfile)

// Set output intent
pdfDoc.setOutputIntent({
  name: 'sRGB',
  type: 'RGB',
  profile: sRgbProfile
})

// Ensure all fonts embedded
pdfDoc.embedFont('Helvetica')  // Will fail if not available
pdfDoc.embedFont('Times-Roman')
```

---

## Phase 3: Validation (📋 Next)

### 3.1 PDF/A-3 Validation

Install and integrate veraPDF:

```bash
# Download veraPDF validator
curl -L https://downloads.verapdf.org/verapdf-installer.zip -o verapdf.zip
unzip verapdf.zip

# Run validation
./verapdf --profile /path/to/factur-x.pdf
```

Or use Node.js wrapper:

```typescript
async function validatePdfA3(pdfBuffer: Buffer): Promise<{
  valid: boolean
  errors: string[]
  warnings: string[]
}> {
  // 1. Check PDF header and structure
  // 2. Verify XMP metadata
  // 3. Confirm ICC color profile
  // 4. Check all fonts embedded
  // 5. Validate embedded XML
}
```

### 3.2 EN 16931 Validation

Validate XML against Schematron rules:

```typescript
async function validateEN16931(xmlString: string): Promise<{
  valid: boolean
  errors: string[]
}> {
  // Use Schematron validation rules
  // Check:
  // ✓ Required fields present
  // ✓ Amount calculations correct
  // ✓ Date formats valid
  // ✓ Currency codes valid
  // ✓ Party identifiers valid (SIREN, VAT, etc.)
}
```

### 3.3 Factur-X Compliance

```typescript
async function validateFacturX(pdfBuffer: Buffer): Promise<{
  pdfA3Valid: boolean
  xmlValid: boolean
  facturXValid: boolean
  profile: string
  errors: string[]
  warnings: string[]
}> {
  // 1. Extract embedded XML
  // 2. Validate XML structure
  // 3. Check XMP metadata
  // 4. Verify profile declaration
  // 5. Run all validators
  // 6. Return comprehensive report
}
```

---

## Phase 4: Testing (📋 Next)

### 4.1 Unit Tests

```typescript
// tests/factur-x.test.ts

describe('Factur-X Generation', () => {
  it('should generate valid XML', () => {
    const xml = generateFacturXXml(invoiceData)
    expect(xml).toContain('CrossIndustryInvoice')
    expect(xml).toContain('invoice-id')
  })

  it('should generate XMP metadata', () => {
    const xmp = generateFacturXXmpMetadata('BASIC WL', invoiceData)
    expect(xmp).toContain('facturx:ConformanceLevel')
    expect(xmp).toContain('BASIC WL')
  })

  it('should convert to PDF/A-3', async () => {
    const result = await convertToPdfA3WithFacturX(
      pdfBuffer, xmlString, invoiceData, 'BASIC WL'
    )
    expect(result).toBeInstanceOf(Buffer)
  })
})
```

### 4.2 Integration Tests

```typescript
// tests/integration.test.ts

describe('Complete Workflow', () => {
  it('should process invoice end-to-end', async () => {
    // 1. Upload PDF
    // 2. Extract data
    // 3. Process with API
    // 4. Validate output
    // 5. Download files
  })
})
```

### 4.3 Validation Tests

```typescript
// Test with official validators
describe('Factur-X Validation', () => {
  it('should pass veraPDF validation', async () => {
    const result = await validatePdfA3(facturXPdf)
    expect(result.valid).toBe(true)
  })

  it('should pass Schematron validation', async () => {
    const result = await validateEN16931(invoiceXml)
    expect(result.valid).toBe(true)
  })
})
```

---

## Phase 5: Production Hardening (📋 Next)

### 5.1 Error Handling

```typescript
// Comprehensive error handling
try {
  const pdfBuffer = await convertToPdfA3WithFacturX(...)
} catch (error) {
  if (error instanceof PdfLibError) {
    // Handle PDF library errors
  } else if (error instanceof ValidationError) {
    // Handle validation errors
  } else {
    // Handle unexpected errors
  }
}
```

### 5.2 Security

- [ ] Validate XML for injection attacks
- [ ] Sanitize invoice data
- [ ] Check file sizes
- [ ] Rate limit API calls
- [ ] Add authentication

### 5.3 Performance

- [ ] Cache ICC color profile
- [ ] Optimize PDF processing
- [ ] Implement job queue for large batches
- [ ] Add progress tracking
- [ ] Monitor memory usage

### 5.4 Monitoring

- [ ] Add logging for all operations
- [ ] Track conversion success rate
- [ ] Monitor validation errors
- [ ] Log performance metrics
- [ ] Alert on failures

---

## Dependencies to Install

```bash
# PDF manipulation
npm install pdf-lib

# PDF parsing (optional, for enhanced extraction)
npm install pdf-parse pdfjs-dist

# XML validation (optional)
npm install libxslt xmllint

# Async utilities
npm install p-queue p-limit

# Testing
npm install --save-dev jest ts-jest @types/jest
npm install --save-dev supertest

# Logging
npm install winston
```

---

## File Structure

```
webapp/
├── app/api/process/
│   └── route.ts              # Main conversion endpoint
├── lib/
│   ├── storage.ts            # File storage
│   ├── factur-x/
│   │   ├── xml-generator.ts  # XML generation
│   │   ├── xmp-generator.ts  # XMP metadata
│   │   ├── pdf-converter.ts  # PDF/A-3 conversion
│   │   └── validator.ts      # Validation logic
│   └── icc-profiles/
│       └── sRGB.icc          # Color profile
├── tests/
│   ├── factur-x.test.ts
│   ├── integration.test.ts
│   └── validation.test.ts
└── FACTUR_X_SPEC.md          # This specification
```

---

## Timeline Estimate

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Foundation | ✅ Completed | Done |
| Phase 2: PDF/A-3 Conversion | 🔄 2-3 days | In Progress |
| Phase 3: Validation | 📋 2-3 days | Not Started |
| Phase 4: Testing | 📋 3-4 days | Not Started |
| Phase 5: Production | 📋 2-3 days | Not Started |

**Total: ~12-16 days** from current state

---

## Success Criteria

- [ ] PDF/A-3 compliant output (passes veraPDF)
- [ ] EN 16931 valid XML (passes Schematron)
- [ ] Factur-X compliant (validates with official tools)
- [ ] All 4 profiles supported (BASIC, BASIC WL, EN 16931, EXTENDED)
- [ ] 99%+ conversion success rate
- [ ] <5s average processing time
- [ ] Comprehensive test coverage (>80%)
- [ ] Production-ready error handling
- [ ] Full documentation

---

## Next Immediate Steps

1. **Install dependencies**
   ```bash
   npm install pdf-lib
   ```

2. **Implement `convertToPdfA3WithFacturX()`**
   - Load PDF using pdf-lib
   - Add readable content if needed
   - Embed XML
   - Add XMP metadata
   - Set PDF/A-3 conformance

3. **Test with sample invoice**
   - Verify PDF/A-3 structure
   - Check embedded XML
   - Validate XMP metadata

4. **Integrate with API**
   - Update error handling
   - Add validation reporting
   - Test end-to-end flow

