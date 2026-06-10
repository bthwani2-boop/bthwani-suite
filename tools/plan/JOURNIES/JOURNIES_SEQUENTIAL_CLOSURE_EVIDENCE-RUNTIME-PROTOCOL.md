# 03 — Evidence and Runtime Protocol

## Evidence root

```text
C:\bthwani-suite\tools\registry\runs\{SESSION_ID}
```

## Required files

```text
01-context.txt
02-implementation.txt
03-verification.txt
04-final-decision.txt
screenshots/
runtime/
{SESSION_ID}.zip
```

## Approved local runtime baseline

Use the user's adopted local DSH commands unless repo evidence changes them:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite\dsh\backend"
docker compose -f .\docker-compose.local.yml up -d

$env:PORT = "8080"
$env:DATABASE_URL = "postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable"
go run ./cmd/dsh-api

Invoke-WebRequest "http://127.0.0.1:8080/stores" -UseBasicParsing
```

Mobile ports:
- app-client: 8081
- app-partner: 8082
- app-captain: 8083
- app-field: 8084

Control panel:
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
$env:NEXT_PUBLIC_DSH_API_BASE_URL = "http://localhost:8080"
pnpm --dir control-panel/runtime dev --port 3000
```

## Final ZIP naming

Do not use `_HANDOFF.zip`.

Use:

```text
tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip
```

## Minimal post-change verification

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

When Go backend touched:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite\dsh\backend"
go test ./...
```
