# BThwani Docker local helper — standardizes port env vars before any compose command.
# Overrides stale machine-level env vars set by older workarounds.
#
# Usage:
#   .\docker\local.ps1 config
#   .\docker\local.ps1 up -d
#   .\docker\local.ps1 up -d --build
#   .\docker\local.ps1 build
#   .\docker\local.ps1 rebuild <service>
#   .\docker\local.ps1 ps
#   .\docker\local.ps1 logs <service>
#   .\docker\local.ps1 logs -f
#   .\docker\local.ps1 down
#   .\docker\local.ps1 smoke
#
# BLOCKED commands (destructive — will not pass through):
#   down -v         (destroys volumes)
#   system prune    (destroys all local Docker state)

param(
    [Parameter(Position = 0)]
    [string]$Command,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ExtraArgs
)

# --- Standardized port policy (always override machine-level env) ---
$env:POSTGRES_PORT              = "15432"
$env:WLT_POSTGRES_PORT          = "15433"
$env:DSH_AUTH_SERVICE_HOST_PORT = "18082"
$env:DSH_API_HOST_PORT          = "8080"
$env:WLT_HOST_PORT              = "18083"
$env:WLT_DSH_BASE_URL           = "http://dsh-api:8080"

$ComposeFile = Join-Path $PSScriptRoot "..\docker-compose.local.yml"

# --- Safety: block destructive passthrough args ---
$AllArgs = @($Command) + $ExtraArgs
$ArgStr  = ($AllArgs -join " ").ToLower()

if ($ArgStr -match "down\s+-v" -or $ArgStr -match "-v\s+down") {
    Write-Error "BLOCKED: 'down -v' destroys volumes. Use 'down' only if you want to stop services. Use 'docker volume rm' explicitly if volume removal is intentional."
    exit 1
}
if ($ArgStr -match "system\s+prune") {
    Write-Error "BLOCKED: 'system prune' is not allowed via this script. Run manually and explicitly if intentional."
    exit 1
}

# --- Subcommand dispatch ---
switch ($Command) {
    "config" {
        docker compose -f $ComposeFile config
    }
    "rebuild" {
        if (-not $ExtraArgs -or $ExtraArgs.Count -eq 0) {
            Write-Error "Usage: .\docker\local.ps1 rebuild <service-name>"
            exit 1
        }
        $Service = $ExtraArgs[0]
        docker compose -f $ComposeFile build --no-cache $Service
        docker compose -f $ComposeFile up -d $Service
    }
    "smoke" {
        $Failures = @()

        Write-Host "--- Smoke: DSH API /stores ---"
        try {
            $r = Invoke-WebRequest "http://127.0.0.1:8080/stores" -UseBasicParsing -TimeoutSec 10
            Write-Host "DSH /stores: $($r.StatusCode) OK"
        } catch {
            Write-Host "DSH /stores FAILED: $_"
            $Failures += "DSH /stores"
        }

        Write-Host "--- Smoke: Auth /health ---"
        try {
            $r = Invoke-WebRequest "http://127.0.0.1:18082/health" -UseBasicParsing -TimeoutSec 10
            Write-Host "Auth /health: $($r.StatusCode) OK"
        } catch {
            Write-Host "Auth /health FAILED: $_"
            $Failures += "Auth /health"
        }

        Write-Host "--- Smoke: WLT /health ---"
        try {
            $r = Invoke-WebRequest "http://127.0.0.1:18083/health" -UseBasicParsing -TimeoutSec 10
            Write-Host "WLT /health: $($r.StatusCode) OK"
        } catch {
            Write-Host "WLT /health FAILED: $_"
            $Failures += "WLT /health"
        }

        Write-Host "--- Port reachability ---"
        foreach ($port in @(15432, 15433, 8080, 18082, 18083)) {
            $conn = Test-NetConnection 127.0.0.1 -Port $port -WarningAction SilentlyContinue
            $status = if ($conn.TcpTestSucceeded) { "OPEN" } else { "CLOSED"; $Failures += ":$port unreachable" }
            Write-Host "  :$port -> $status"
        }

        if ($Failures.Count -gt 0) {
            Write-Host ""
            Write-Host "SMOKE: FAIL — $($Failures.Count) check(s) failed: $($Failures -join ', ')"
            exit 1
        }
        Write-Host ""
        Write-Host "SMOKE: PASS"
        exit 0
    }
    default {
        # Pass all args through to docker compose
        docker compose -f $ComposeFile $Command @ExtraArgs
    }
}
