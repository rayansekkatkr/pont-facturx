# Configuration de MISTRAL_API_KEY en Production

## Problème

L'erreur "Could not get file" (code 3001) vient de l'API Mistral. La clé API `MISTRAL_API_KEY` n'est pas configurée dans l'environnement de production de la webapp sur Vercel.

## Solution

### 1. Configurer la variable d'environnement sur Vercel

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionner le projet `pont-facturx`
3. Aller dans **Settings** → **Environment Variables**
4. Ajouter une nouvelle variable:
   - **Name**: `MISTRAL_API_KEY`
   - **Value**: `BW976vXiooOZ3ONiM0bEuQ6KS7HDz6tY` (ou votre clé Mistral)
   - **Environments**: Sélectionner `Production`, `Preview`, et `Development`
5. Cliquer sur **Save**

### 2. Redéployer la webapp

Après avoir ajouté la variable d'environnement, vous devez redéployer:

Option A - Redéploiement automatique:
```bash
git commit --allow-empty -m "Trigger redeploy for env vars"
git push origin main
```

Option B - Redéploiement manuel:
1. Aller dans l'onglet **Deployments** sur Vercel
2. Cliquer sur les 3 points à côté du dernier déploiement
3. Sélectionner **Redeploy**

### 3. Vérifier que ça fonctionne

Une fois redéployé, testez à nouveau la conversion avec le profil EN16931.

## Améliorations apportées

J'ai ajouté des logs détaillés dans `webapp/lib/mistral-ocr.ts` pour mieux diagnostiquer les problèmes:

- Validation du buffer PDF avant upload
- Vérification de l'en-tête PDF (magic number)
- Logs à chaque étape (upload, OCR, cleanup)
- Meilleure capture des erreurs de l'API Mistral

Ces logs vous aideront à identifier rapidement tout problème futur.

## Note importante

La variable `MISTRAL_API_KEY` doit être définie à la fois:
- **En local**: dans `webapp/.env.local` (déjà fait ✅)
- **En production**: dans les paramètres Vercel (à faire ⚠️)

Les fichiers `.env.local` ne sont jamais déployés en production pour des raisons de sécurité.
