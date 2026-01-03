# Deploy backend (API + Worker + Postgres + Redis)

This folder provides a production Docker Compose setup with HTTPS via Caddy.

## 1) Prereqs
- A VPS (Ubuntu 22.04+ recommended)
- A domain name (e.g. `api.pont-facturx.com`) pointing to the VPS
- Docker + Docker Compose installed

## 2) Copy repo to server
Clone or upload this repository to the VPS.

## 3) Create a production env file
Copy the example and fill it:

```
cp .env.example .env
```

Then edit `deploy/.env` on the VPS (do not commit):

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me
POSTGRES_DB=pontfacturx
DATABASE_URL=postgresql+psycopg2://postgres:change-me@db:5432/pontfacturx
REDIS_URL=redis://redis:6379/0

JWT_SECRET=change-me
GOOGLE_CLIENT_ID=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
WEBAPP_URL=https://pont-facturx.vercel.app

# JSON array recommended
CORS_ORIGINS=["https://pont-facturx.vercel.app","http://localhost:3000"]
```

## 4) Configure Caddy domain
Edit `deploy/Caddyfile` and replace `api.pont-facturx.com` with your domain.

## 5) Start
From the repo root on the VPS:

```
cd deploy
docker compose --env-file .env -f docker-compose.prod.yml up --build -d
```

## 6) Connect Vercel to backend
In Vercel project env vars:
- `BACKEND_URL=https://api.pont-facturx.com`

## 7) Stripe webhook
In Stripe Dashboard, set webhook endpoint:
- `https://api.pont-facturx.com/v1/billing/webhook`

Subscribe to events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## CI deployment (optional)
If you want automatic deployments on each push to `main`, see [deploy/CI_DEPLOY.md](deploy/CI_DEPLOY.md).
