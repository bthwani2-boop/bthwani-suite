# DSH Backend

Status: ACTIVE_SCAFFOLD

DSH backend entrypoints live here as service-local scaffolds.
Root `api-types` and `api-clients` packages now bridge to these files.

Current compact layout:

```text
backend/contracts.ts
backend/client.ts
backend/src
backend/tests
```
No backend business truth is claimed yet.

## Local Start Command

To start the local Go API server on port 8080, run the following PowerShell command:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite\dsh\backend"
$env:PORT = "8080"
$env:DATABASE_URL = "postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable"
go run ./cmd/dsh-api
```
