# CI Deploy (GitHub Actions -> VPS)

This repo includes a GitHub Actions workflow that deploys the backend stack (Caddy + API + worker + Postgres + Redis) on a VPS by SSH.

## How it works
- Trigger: push to `main` (and manual `workflow_dispatch`)
- Action: SSH into your VPS, `git pull`, then run `docker compose up --build -d` from `deploy/`.

## Prerequisites on the VPS
1) The repository is already cloned on the VPS (example path: `/srv/pont-facturx`).
2) `deploy/.env` exists on the VPS and contains production values.
3) Docker + Docker Compose are installed.

## Configure GitHub Secrets
In GitHub repo: Settings → Secrets and variables → Actions → New repository secret

Required:
- `VPS_HOST`: VPS IP or hostname
- `VPS_USER`: SSH username (e.g. `root`, `ubuntu`)
- `VPS_SSH_KEY`: private key contents (ed25519 or rsa)
- `VPS_DEPLOY_DIR`: absolute path to the repo on the VPS (e.g. `/srv/pont-facturx`)

Optional:
- `VPS_PORT`: SSH port (default 22)
- `VPS_DEPLOY_BRANCH`: branch to deploy (default `main`)

## First-time setup flow
1) Clone repo on VPS
2) Create `deploy/.env` on VPS
3) Run once manually on VPS:

```bash
cd /srv/pont-facturx/deploy
docker compose --env-file .env -f docker-compose.prod.yml up --build -d
```

4) Add GitHub secrets
5) Push to `main` → CI deploy runs

## Notes
- This approach builds images on the VPS. If you prefer building in CI and pulling from a registry (GHCR), we can switch to an image-based compose.
