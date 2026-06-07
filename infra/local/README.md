# BThwani Local Infra Addons

This folder owns shared optional local-only infrastructure addons.

## Ownership rules

- DSH service-owned dependencies remain under `dsh/backend`.
- WLT service-owned dependencies remain under `wlt/backend`.
- Root `docker-compose.local.yml` is the only Docker entrypoint for scripts and humans.
- This folder is only for shared optional addons such as MongoDB, Redis/Valkey, Mailpit, MinIO, or local observability.
- Do not move DSH/WLT Postgres, migrations, or seeds here.
- Do not store production secrets here.

## Current addons

```text
mongo
redis
```

## Activation

Addons are activated only through Docker Compose profiles from the root compose entrypoint.

Examples:

```powershell
docker compose --env-file .\.env.local -f .\docker-compose.local.yml --profile mongo up -d mongo
docker compose --env-file .\.env.local -f .\docker-compose.local.yml --profile redis up -d redis
```
