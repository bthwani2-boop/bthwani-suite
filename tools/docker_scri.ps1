Set-Location -LiteralPath "C:\bthwani-suite"

# غيّر هذه فقط عند الحاجة:
$Action = "up"      # up | restart | status | logs | stop | clean-stale
$Stack  = "core"    # core | dsh | wlt
$Build  = $true
$Tail   = 120

$ComposeFile = ".\docker-compose.local.yml"
$EnvFile = ".\.env.local"
$ExpectedProject = "bthwani-suite-local"

if (!(Test-Path -LiteralPath $ComposeFile)) {
  throw "Missing root compose file: $ComposeFile"
}

if (!(Test-Path -LiteralPath $EnvFile)) {
  throw "Missing env file: $EnvFile"
}

$ServiceSets = @{
  dsh  = @("dsh-postgres", "auth-service", "dsh-api")
  wlt  = @("dsh-postgres", "auth-service", "dsh-api", "wlt-postgres", "wlt-api")
  core = @("dsh-postgres", "auth-service", "dsh-api", "wlt-postgres", "wlt-api")
}

if (!$ServiceSets.ContainsKey($Stack)) {
  throw "Invalid Stack: $Stack. Use: core | dsh | wlt"
}

$Services = $ServiceSets[$Stack]

$ContainerByService = @{
  "dsh-postgres" = "bthwani-dsh-postgres-local"
  "auth-service" = "bthwani-auth-service-local"
  "dsh-api"      = "bthwani-dsh-api-local"
  "wlt-postgres" = "bthwani-wlt-postgres-local"
  "wlt-api"      = "bthwani-wlt-api-local"
}

function Invoke-RootCompose {
  param([string[]]$ComposeArgs)

  & docker @(
    "compose",
    "--env-file", $EnvFile,
    "-f", $ComposeFile
  ) @ComposeArgs
}

function Remove-StaleContainerConflicts {
  param([string[]]$TargetServices)

  foreach ($Service in $TargetServices) {
    $Name = $ContainerByService[$Service]
    if (!$Name) { continue }

    $Line = docker ps -a --filter "name=^/$Name$" --format '{{.Names}}|{{.Label "com.docker.compose.project"}}'

    if (!$Line) { continue }

    $Parts = $Line -split "\|", 2
    $ExistingName = $Parts[0]
    $Project = if ($Parts.Count -gt 1) { $Parts[1] } else { "" }

    if ($Project -eq $ExpectedProject) {
      Write-Host "KEEP root-managed container: $ExistingName"
      continue
    }

    Write-Host "REMOVE stale/conflicting container: $ExistingName project=[$Project]"
    docker rm -f $ExistingName | Out-Host
  }
}

function Wait-ContainerHealthy {
  param(
    [string[]]$TargetServices,
    [int]$TimeoutSeconds = 120
  )

  foreach ($Service in $TargetServices) {
    $Name = $ContainerByService[$Service]
    if (!$Name) { continue }

    $Deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $Deadline) {
      $State = docker inspect -f '{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' $Name 2>$null

      if ($LASTEXITCODE -eq 0 -and $State) {
        $Parts = $State -split "\|", 2
        $RunState = $Parts[0]
        $HealthState = if ($Parts.Count -gt 1) { $Parts[1] } else { "none" }

        if ($RunState -eq "running" -and ($HealthState -eq "healthy" -or $HealthState -eq "none")) {
          Write-Host "OK: $Name state=$RunState health=$HealthState"
          break
        }
      }

      Start-Sleep -Seconds 3
    }

    $Final = docker inspect -f '{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' $Name 2>$null
    if (!$Final -or ($Final -notmatch "running\|(healthy|none)")) {
      Write-Host "FAILED: $Name final=[$Final]"
      docker logs --tail 120 $Name
      throw "Container did not become healthy: $Name"
    }
  }
}

function Test-Http {
  param(
    [string]$Name,
    [string]$Url,
    [int]$Retries = 20
  )

  for ($i = 1; $i -le $Retries; $i++) {
    try {
      $Response = Invoke-WebRequest $Url -UseBasicParsing -TimeoutSec 5
      if ($Response.StatusCode -ge 200 -and $Response.StatusCode -lt 300) {
        Write-Host "OK: $Name => $($Response.StatusCode) $Url"
        return
      }
    } catch {
      Start-Sleep -Seconds 3
    }
  }

  throw "HTTP check failed: $Name $Url"
}

switch ($Action) {
  "clean-stale" {
    Remove-StaleContainerConflicts -TargetServices $Services
    Invoke-RootCompose @("ps")
  }

  "up" {
    Remove-StaleContainerConflicts -TargetServices $Services

    $Args = @("up", "-d")
    if ($Build) { $Args += "--build" }
    $Args += $Services

    Invoke-RootCompose $Args
    Wait-ContainerHealthy -TargetServices $Services

    if ($Services -contains "auth-service") { Test-Http "auth-service" "http://127.0.0.1:18082/health" }
    if ($Services -contains "dsh-api")      { Test-Http "dsh-api"      "http://127.0.0.1:8080/stores" }
    if ($Services -contains "wlt-api")      { Test-Http "wlt-api"      "http://127.0.0.1:18083/health" }

    Invoke-RootCompose @("ps")
  }

  "restart" {
    Invoke-RootCompose (@("stop") + $Services) | Out-Host

    Remove-StaleContainerConflicts -TargetServices $Services

    $Args = @("up", "-d")
    if ($Build) { $Args += "--build" }
    $Args += $Services

    Invoke-RootCompose $Args
    Wait-ContainerHealthy -TargetServices $Services

    if ($Services -contains "auth-service") { Test-Http "auth-service" "http://127.0.0.1:18082/health" }
    if ($Services -contains "dsh-api")      { Test-Http "dsh-api"      "http://127.0.0.1:8080/stores" }
    if ($Services -contains "wlt-api")      { Test-Http "wlt-api"      "http://127.0.0.1:18083/health" }

    Invoke-RootCompose @("ps")
  }

  "status" {
    Invoke-RootCompose @("ps")

    if ($Services -contains "auth-service") { Test-Http "auth-service" "http://127.0.0.1:18082/health" }
    if ($Services -contains "dsh-api")      { Test-Http "dsh-api"      "http://127.0.0.1:8080/stores" }
    if ($Services -contains "wlt-api")      { Test-Http "wlt-api"      "http://127.0.0.1:18083/health" }
  }

  "logs" {
    Invoke-RootCompose (@("logs", "-f", "--tail=$Tail") + $Services)
  }

  "stop" {
    Invoke-RootCompose (@("stop") + $Services)
    Invoke-RootCompose @("ps")
  }

  default {
    throw "Invalid Action: $Action. Use: up | restart | status | logs | stop | clean-stale"
  }
}
