# BThwani Docker local helper — guarantees standardized port values before any compose command.
# Usage: .\docker\local.ps1 up -d
#        .\docker\local.ps1 down
#        .\docker\local.ps1 ps
#        .\docker\local.ps1 logs -f
#        .\docker\local.ps1 build
# This script overrides any stale system env vars that may have been set by older workarounds.

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$DockerArgs
)

$env:POSTGRES_PORT              = "15432"
$env:WLT_POSTGRES_PORT          = "15433"
$env:DSH_AUTH_SERVICE_HOST_PORT = "18082"
$env:WLT_HOST_PORT              = "18083"
$env:DSH_API_HOST_PORT          = "8080"
$env:WLT_DSH_BASE_URL           = "http://dsh-api:8080"

$ComposeFile = Join-Path $PSScriptRoot "..\docker-compose.local.yml"

docker compose -f $ComposeFile @DockerArgs
