# BThwani Local Docker Runtime

## Architecture

The root `docker-compose.local.yml` is a **Root Orchestrator** — it uses `include` directives only and owns no service definitions. Each domain owns its own compose file:

| File | Owner | Services |
|---|---|---|
| `dsh/backend/docker-compose.local.yml` | DSH | `dsh-postgres`, `auth-service`, `dsh-api` |
| `wlt/backend/docker-compose.local.yml` | WLT | `wlt-postgres`, `wlt-api` |
| `infra/local/mongo/docker-compose.local.yml` | infra | `mongo` (profile: `mongo`) |
| `infra/local/redis/docker-compose.local.yml` | infra | `redis` (profile: `redis`) |

No service is defined in more than one Compose file. Resource name conflicts surface as errors (not silent merges).

## Standard Port Map

| Service | Host Port | Container Port | Note |
|---|---|---|---|
| DSH Postgres | `15432` | `5432` | DSH-owned DB |
| WLT Postgres | `15433` | `5432` | WLT-owned DB — never share schemas with DSH |
| DSH API | `8080` | `8080` | Reserved for DSH only — not Expo/Metro |
| Auth Service | `18082` | `8082` | Avoids Expo app-partner port 8082 |
| WLT API | `18083` | `8083` | Avoids Expo app-captain port 8083 |
| MongoDB | `27017` | `27017` | Optional — profile: `mongo` |
| Redis | `6379` | `6379` | Optional — profile: `redis` |

**Expo/Metro reserved ports (8081–8084, 3000):** no backend Docker service may publish on these.

## Starting the Stack

### Option A — docker/local.ps1 (recommended)

```powershell
# Validate compose config
.\docker\local.ps1 config

# Start all core services
.\docker\local.ps1 up -d --build

# Check status
.\docker\local.ps1 ps

# Stream logs for a service
.\docker\local.ps1 logs -f dsh-api

# Rebuild a single service without recreating volumes
.\docker\local.ps1 rebuild wlt-api

# Run smoke checks
.\docker\local.ps1 smoke
```

The script forces standardized port env vars so stale machine-level environment variables cannot override compose defaults.

### Option B — docker compose directly

```powershell
# From repo root
docker compose -f .\docker-compose.local.yml config
docker compose -f .\docker-compose.local.yml up -d --build
docker compose -f .\docker-compose.local.yml ps
```

### With optional addons

```powershell
# Start with MongoDB
docker compose -f .\docker-compose.local.yml --profile mongo up -d

# Start with Redis
docker compose -f .\docker-compose.local.yml --profile redis up -d

# Both
docker compose -f .\docker-compose.local.yml --profile mongo --profile redis up -d
```

## What is NOT Dockerized

### Expo / Mobile Apps

`app-client`, `app-partner`, `app-captain`, `app-field` run outside Docker via **Expo Development Build + Metro**. Do not Dockerize mobile apps.

### nginx / Edge Gateway

nginx is **not required** for local development. An edge gateway (nginx, TLS, CORS, cookie-domain simulation) is deferred to a future phase:

```
infra/local/edge/docker-compose.local.yml
infra/local/edge/nginx.conf
profile: edge
```

Do not add nginx to any current Compose file.

## media-fixtures

`dsh/frontend/media-fixtures/` is a **dev/demo media source only** — not production storage. It is not copied into any Docker image (see `Dockerfile.dsh-api` COPY directives and `/media-fixtures/` note). Images in this directory are excluded from git via `.gitignore`. If static media serving is needed in Docker, plan a dedicated static/CDN slice — do not bind-mount media-fixtures into production images.

## Mongo and Redis — Optional Only

Mongo and Redis are optional local addons activated by profiles. They are not started by default. Neither service has assigned ownership (DSH or WLT) until a future slice assigns it with evidence.

## Environment Files

| File | Purpose | In Git? |
|---|---|---|
| `infra/local/env/.env.local.example` | Template — copy to repo root | Yes |
| `.env.local` | Local machine overrides | **No** (excluded by `.env.*` in `.gitignore`) |

Never commit `.env.local`. Never bake secrets into Docker images (`.dockerignore` excludes all `.env*` files).

## Docker Hub / Deploy Policy

- **No automatic deploy** on push to any branch.
- Docker publish requires `workflow_dispatch` trigger + `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `DOCKERHUB_NAMESPACE` secrets.
- Deploy to VPS requires `VPS_HOST`, `VPS_SSH_KEY` secrets and explicit human trigger.
- The `deploy.yml` workflow is a manual-only stub — it will fail until secrets are provisioned and deploy steps are implemented.
- Do not push images to Docker Hub during local development.

## auth-service Ownership Note

`auth-service` is temporarily owned by `dsh/backend/docker-compose.local.yml` because the implementation lives under `dsh/backend/`. Extract to an auth-owned compose file only in a dedicated Auth extraction phase.
