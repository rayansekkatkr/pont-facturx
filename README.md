# Pont Factur‑X (Python + FastAPI) — V1 “prêt à coder”

Objectif V1 : **convertir un PDF de facture “classique” en PDF Factur‑X (BASIC WL)** :
1) upload d’un PDF
2) extraction “best‑effort” (regex/pdfminer) → JSON
3) génération d’un XML CII **BASIC WL** (sans lignes)
4) “wrap” PDF + XML en Factur‑X via la lib Python `factur-x`
5) (optionnel) validations XSD / Schematron EN16931 / PDF/A via veraPDF

> Rappel : une facture Factur‑X est un **PDF/A‑3** avec un XML embarqué.  
> Le profil BASIC WL est identifié par `urn:factur-x.eu:1p0:basicwl`.  
> (cf doc AFNOR/impots.gouv).  

---

## Démarrage (dev)

### 1) Lancer la stack
```bash
docker compose up --build
```

### 2) Ouvrir l’API
- Swagger UI : `http://localhost:8000/docs`
- Healthcheck : `GET http://localhost:8000/health`

---

## Endpoints (V1)

### `POST /v1/invoices`
Multipart form:
- `file` : PDF
- `profile` : (par défaut `BASIC_WL`)
- `needs_review` : `true|false` (par défaut `false`)
  - `false` → pipeline auto (extraction + xml + wrap + validation)
  - `true` → stop après extraction, status `NEEDS_REVIEW`

### `GET /v1/invoices/{job_id}`
Récupère le statut + JSON + URLs de sortie.

### `POST /v1/invoices/{job_id}/confirm`
Body JSON : `{ "final_json": {...} }`  
Relance la finalisation (XML + wrap + validation) à partir de `final_json`.

### `GET /v1/invoices/{job_id}/download`
Télécharge le PDF Factur‑X final.

---

## Activer les validateurs (optionnel)

### EN16931 (Schematron)
Télécharger les artefacts officiels (CII/UBL) :
```bash
./scripts/bootstrap_en16931.sh
```

Puis activer :
- `ENABLE_SCHEMATRON=1` (dans docker-compose.yml ou env)

### veraPDF (PDF/A)
- Installer `verapdf` dans l’image worker (ou le rendre dispo dans PATH)
- Puis activer :
  - `ENABLE_VERAPDF=1`

### PDF/A‑3 conversion (Ghostscript)
- L’image worker contient `ghostscript` + profils ICC (best effort)
- Activer :
  - `ENABLE_PDFA_CONVERT=1`

> Important : la conversion PDF → PDF/A est **le morceau le plus fragile**.  
> Beaucoup de PDFs réels (fonts, transparence, couleurs) font échouer Ghostscript/veraPDF.
> En V1, on garde ça optionnel et on observe les cas clients.

---

## Structure du projet

- `api/app/main.py` : FastAPI
- `api/app/routes/invoices.py` : endpoints
- `api/app/workers/tasks.py` : Celery tasks
- `api/app/pipeline/` :
  - `extract.py` : extraction V1 (pdfminer + regex)
  - `cii_builder.py` + `templates/` : génération XML
  - `facturx_wrap.py` : embed XML dans PDF via `factur-x`
  - `validate.py` : XSD + Schematron + veraPDF (optionnel)
  - `pdfa.py` : conversion PDF/A‑3 (optionnel)
- `api/app/validators/` : répertoire de validateurs (gitignored côté artefacts)

---

## Next steps “business”
- Ajouter un écran “Review / correction” du JSON (front) + mapping plus riche (SIREN/SIRET, TVA multi‑taux, adresses, refs commande…)
- Supporter BASIC / EN16931 / EXTENDED
- Ajout auth + quotas (pay‑as‑you‑go)
