# Factur-X Conversion Platform

Convertissez n'importe quel PDF de facture en Factur-X (PDF/A-3 + XML) avec rapport de validation, prêt à transmettre via votre plateforme.

## Architecture

### Frontend (Next.js 16)
- **Authentication**: Multi-tenant (Entreprise/Cabinet) avec 2FA optionnel
- **Dashboard**: Historique, statistiques, gestion des crédits
- **Upload**: Drag-and-drop, batch processing, configuration OCR
- **Verification**: Interface de validation avec aperçu PDF et formulaire structuré
- **Results**: Téléchargement des fichiers et rapports de validation

### Backend API Routes
- `/api/upload` - Upload de fichiers PDF/ZIP
- `/api/extract` - Extraction de données (OCR + Rules + AI)
- `/api/process` - Génération Factur-X et validation
- `/api/download` - Téléchargement des résultats

## Pipeline Technique

### 1. Extraction (Hybride)
- **PDF natif**: Extraction de texte avec pdf-parse
- **PDF scanné**: OCR avec Tesseract/Cloud Vision
- **Règles + Regex**: Extraction de champs structurés (SIRET, dates, montants)
- **IA (LLM)**: Extraction de champs complexes (adresses, noms)
- **Output**: `invoice.json` normalisé + scores de confiance

### 2. Génération XML Factur-X
- Format: **UN/CEFACT CII D22B** (compatible Factur-X 1.08)
- Profils supportés: **MINIMUM** et **BASIC WL**
- Validation: Schematron EN16931

### 3. Production PDF/A-3
- Conversion PDF → PDF/A-3 (via Ghostscript)
- Embedding XML dans le PDF/A-3
- Validation avec veraPDF

### 4. Validation Complète
- ✅ PDF/A-3 (veraPDF)
- ✅ XML CII (Schematron EN16931)
- ✅ Factur-X global (FNFE-MPE validator)

## Technologies Recommandées

### Production Stack
- **Frontend**: Next.js 16 + React + Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Jobs**: BullMQ ou Celery (pour OCR et conversions lourdes)
- **Storage**: Vercel Blob ou S3
- **Database**: PostgreSQL (factures, utilisateurs, crédits)
- **PDF Processing**: 
  - Python: `factur-x` (Akretion), `pypdf`, `reportlab`
  - Node: `pdf-lib`, ou appels à scripts Python
- **OCR**: Tesseract, Google Cloud Vision, AWS Textract
- **AI**: Gemini/GPT pour extraction assistée
- **Validation**: veraPDF, Schematron validators

### Intégrations Futures
- Base de données pour persistance (Supabase/Neon recommandé)
- Authentification réelle avec sessions sécurisées
- Queue de jobs pour traitement asynchrone
- Monitoring et logs (Sentry, Datadog)

## Conformité

✅ **Factur-X 1.08** (entre en vigueur 15 janvier 2026)  
✅ **CII D22B** (rétrocompatible D16B)  
✅ **EN16931** (norme européenne de facturation électronique)  
✅ **PDF/A-3** (archivage long terme)  

## Pricing Suggéré

- **Pay-as-you-go**: 0,50€ / conversion
- **Pro**: 19€ / 200 crédits, 49€ / 1000 crédits
- **Cabinet**: Multi-dossiers + batch + export + facturation mensuelle

## Installation

### Mistral OCR (optionnel)

Pour pré-remplir l'étape `/verify` à partir de l'OCR (Mistral), configurez :

- `MISTRAL_API_KEY`

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Next Steps for Production

1. **Intégrer une base de données** (Supabase/Neon)
2. **Implémenter l'authentification réelle** (Supabase Auth ou custom)
3. **Ajouter le traitement PDF réel** (intégration factur-x library)
4. **Configurer la queue de jobs** (BullMQ pour jobs asynchrones)
5. **Ajouter OCR** (Tesseract ou API cloud)
6. **Implémenter la validation** (veraPDF + Schematron)
7. **Configurer le stockage** (Vercel Blob/S3)
8. **Ajouter le système de paiement** (Stripe)
9. **Mettre en place le monitoring** (Sentry, logs)
10. **Tests et validation** sur cas réels

## References

- [Factur-X 1.08 Specification](https://fnfe-mpe.org/factur-x/)
- [UN/CEFACT CII D22B](https://unece.org/trade/uncefact/xml-schemas)
- [EN16931 Standard](https://ec.europa.eu/digital-building-blocks/wikis/display/DIGITAL/EN16931)
- [veraPDF](https://verapdf.org/)
- [FNFE-MPE Tools](https://fnfe-mpe.org/)
