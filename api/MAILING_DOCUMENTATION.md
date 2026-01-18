# Système de Mailing - Documentation

## Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```bash
# Resend API (pour l'envoi d'emails)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Factur-X Convert <noreply@pont-facturx.com>"
```

### 2. Obtenir une clé API Resend

1. Créez un compte sur [resend.com](https://resend.com)
2. Vérifiez votre domaine (ou utilisez le domaine de test)
3. Générez une clé API dans les paramètres
4. Copiez la clé dans `RESEND_API_KEY`

**Gratuit jusqu'à 3000 emails/mois** (parfait pour commencer)

### 3. Migration de la base de données

Exécutez la migration SQL pour ajouter le champ `email_verified` :

```bash
cd api
psql $DATABASE_URL < migrations_add_email_verified.sql
```

Ou manuellement :
```sql
ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE users SET email_verified = TRUE WHERE google_sub IS NOT NULL;
```

## Fonctionnalités implémentées

### ✅ 1. Email de vérification de compte

**Quand ?** À la création d'un compte (signup)

**Endpoints :**
- `POST /auth/signup` - Envoie automatiquement l'email
- `POST /auth/verify-email?token=xxx` - Vérifie l'email
- `POST /auth/resend-verification` - Renvoie l'email (authentifié)

**Template :** Email moderne avec bouton CTA, valide 24h

### ✅ 2. Email de confirmation d'achat

**Quand ?** Après paiement Stripe (webhook + checkout)

**Types d'achats :**
- **Packs de crédits** - Confirmation avec nombre de crédits
- **Abonnements** - Confirmation avec nom du plan

**Template :** Email professionnel avec détails de l'achat, montant, CTA vers dashboard

### ✅ 3. Templates HTML professionnels

- Design moderne avec dégradés
- Responsive (mobile-friendly)
- Compatible tous clients email
- Couleurs cohérentes avec la charte graphique
- Footer avec liens légaux

## Utilisation

### Vérification d'email lors du signup

```typescript
// webapp/app/auth/signup
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password',
    first_name: 'John',
    // ...
  })
});

// L'email est automatiquement envoyé
// L'utilisateur reçoit un lien : /verify?token=xxx
```

### Page de vérification

Créez `webapp/app/verify/page.tsx` :

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`, { method: 'POST' })
      .then(res => {
        if (res.ok) setStatus('success');
        else setStatus('error');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div>
      {status === 'loading' && <p>Vérification en cours...</p>}
      {status === 'success' && <p>✅ Email vérifié ! Vous pouvez vous connecter.</p>}
      {status === 'error' && <p>❌ Lien invalide ou expiré.</p>}
    </div>
  );
}
```

### Renvoyer l'email de vérification

```typescript
// Si l'utilisateur n'a pas reçu l'email
const resendVerification = async () => {
  await fetch('/api/auth/resend-verification', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  alert('Email renvoyé !');
};
```

## Emails envoyés automatiquement

### 1. Création de compte
- ✉️ Email de bienvenue avec lien de vérification
- 🔗 Lien valide 24 heures
- 🔒 Token JWT sécurisé

### 2. Achat de pack de crédits
- ✉️ Confirmation avec nombre de crédits
- 💰 Montant payé
- 🎯 CTA vers le dashboard

### 3. Souscription d'abonnement
- ✉️ Confirmation avec nom du plan
- 💰 Montant mensuel/annuel
- 📊 Quota mensuel
- 🎯 CTA vers le dashboard

## Modèle User mis à jour

```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, nullable=False, unique=True, index=True)
    email_verified = Column(Boolean, nullable=False, default=False)  # ✨ NOUVEAU
    # ... autres champs
```

## Détails techniques

### Service Email (`api/app/email_service.py`)

**Fonctions principales :**
- `create_verification_token(email)` - Génère un token JWT
- `verify_verification_token(token)` - Vérifie et extrait l'email
- `send_verification_email(email, first_name, url)` - Envoie l'email de vérification
- `send_purchase_confirmation_email(...)` - Envoie l'email de confirmation d'achat

**Sécurité :**
- Tokens JWT signés avec `jwt_secret`
- Expiration 24h pour vérification email
- Protection contre rejeu (idempotence)

### Intégration Stripe

Les emails de confirmation sont envoyés automatiquement lors du traitement des webhooks Stripe :
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

Les métadonnées du checkout doivent contenir :
- `user_id`
- `kind` (pack ou subscription)
- `credits` (pour les packs)
- `amount` (montant en centimes)
- `plan` (pour les abonnements)

## Prochaines étapes recommandées

1. **Frontend :**
   - [ ] Créer la page `/verify`
   - [ ] Ajouter un banner "Veuillez vérifier votre email"
   - [ ] Bouton "Renvoyer l'email" dans les settings

2. **Design :**
   - [ ] Personnaliser les couleurs des emails
   - [ ] Ajouter le logo dans les emails
   - [ ] Tester sur différents clients (Gmail, Outlook, etc.)

3. **Fonctionnalités additionnelles :**
   - [ ] Email de réinitialisation de mot de passe
   - [ ] Email de notification de conversion terminée
   - [ ] Email de rappel d'expiration de crédits
   - [ ] Newsletter / emails marketing

4. **Production :**
   - [ ] Configurer le domaine avec Resend
   - [ ] Vérifier les enregistrements SPF/DKIM
   - [ ] Monitorer la délivrabilité
   - [ ] Mettre en place des webhooks Resend (bounces, opens, clicks)

## Troubleshooting

### L'email n'arrive pas

1. Vérifiez que `RESEND_API_KEY` est configuré
2. Vérifiez les logs de l'API : `✅ Email de vérification envoyé`
3. Vérifiez le spam/courrier indésirable
4. En dev, utilisez le domaine de test Resend : `onboarding@resend.dev`

### Token expiré

- Les tokens de vérification expirent après 24h
- L'utilisateur doit utiliser "Renvoyer l'email"
- Vérifiez l'horloge système du serveur

### Email ne contient pas le bon domaine

- Mettez à jour `WEBAPP_URL` dans `.env`
- Ex: `WEBAPP_URL=https://pont-facturx.com` en production

## Conformité RGPD

✅ Les emails sont conformes RGPD :
- Liens de désinscription dans le footer
- Respect de la vie privée
- Données minimales collectées
- Transparence sur l'utilisation des données

---

**Fait avec ❤️ pour Factur-X Convert**
