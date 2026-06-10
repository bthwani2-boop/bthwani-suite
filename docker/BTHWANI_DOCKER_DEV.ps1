Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

# Daily Docker Dev Script
# Actions:
# dev        = start DBs only + verify ports + run DSH backend tests
# core       = start full core stack without build
# status     = show containers + health endpoints
# logs       = show/follow logs
# restart    = restart full core without build
# rebuild    = full build after pulling base images
# pull-base  = pull Docker base images only
# stop       = stop core services
# clean      = remove stale conflicting containers only
# doctor     = environment diagnostics
# evidence   = collect evidence only
#
# Safety:
# - No volume deletion.
# - No git commit.
# - No push.
# - No PR.
# - Build is not default.

$Action = "dev"
$Stack = "core"
$Tail = 160
$FollowLogs = $false
$RunTests = $true
$HealthTimeoutSeconds = 180
$HttpRetries = 30

$i = 0
while ($i -lt $args.Count) {
  $Arg = [string]$args[$i]

  switch ($Arg) {
    "-Action" {
      if (($i + 1) -ge $args.Count) { throw "Missing value for -Action" }
      $i++
      $Action = [string]$args[$i]
    }

    "-Stack" {
      if (($i + 1) -ge $args.Count) { throw "Missing value for -Stack" }
      $i++
      $Stack = [string]$args[$i]
    }

    "-Tail" {
      if (($i + 1) -ge $args.Count) { throw "Missing value for -Tail" }
      $i++
      $Tail = [int]$args[$i]
    }

    "-FollowLogs" {
      $FollowLogs = $true
    }

    "-NoTests" {
      $RunTests = $false
    }

    "-HealthTimeoutSeconds" {
      if (($i + 1) -ge $args.Count) { throw "Missing value for -HealthTimeoutSeconds" }
      $i++
      $HealthTimeoutSeconds = [int]$args[$i]
    }

    "-HttpRetries" {
      if (($i + 1) -ge $args.Count) { throw "Missing value for -HttpRetries" }
      $i++
      $HttpRetries = [int]$args[$i]
    }

    default {
      throw "Unknown argument: $Arg"
    }
  }

  $i++
}

$ValidActions = @("dev", "core", "status", "logs", "restart", "rebuild", "pull-base", "stop", "clean", "doctor", "evidence")
if ($Action -notin $ValidActions) {
  throw "Invalid Action: $Action. Use: $($ValidActions -join ' | ')"
}

$ValidStacks = @("core", "dsh", "wlt", "db")
if ($Stack -notin $ValidStacks) {
  throw "Invalid Stack: $Stack. Use: core | dsh | wlt | db"
}

$ComposeFile = ".\docker-compose.local.yml"
$EnvFile = ".\.env.local"
$ExpectedProject = "bthwani-suite-local"

if (!(Test-Path -LiteralPath $ComposeFile)) {
  throw "Missing root compose file: $ComposeFile"
}

if (!(Test-Path -LiteralPath $EnvFile)) {
  throw "Missing env file: $EnvFile"
}

$IssueCode = "DOCKER_DEV"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"
$SummaryFile = Join-Path $RunRoot "SUMMARY.md"
$EvidenceFile = Join-Path $RunRoot "evidence.json"
$StatusFile = Join-Path $RunRoot "status.txt"
$HandoffZip = Join-Path $RunRoot "_HANDOFF.zip"

$ScriptStatus = "RUNNING"
$ScriptError = ""

$ServiceSets = @{
  db   = @("dsh-postgres", "wlt-postgres")
  dsh  = @("dsh-postgres", "auth-service", "dsh-api")
  wlt  = @("wlt-postgres", "wlt-api")
  core = @("dsh-postgres", "auth-service", "dsh-api", "wlt-postgres", "wlt-api")
}

$ContainerByService = @{
  "dsh-postgres" = "bthwani-dsh-postgres-local"
  "auth-service" = "bthwani-auth-service-local"
  "dsh-api"      = "bthwani-dsh-api-local"
  "wlt-postgres" = "bthwani-wlt-postgres-local"
  "wlt-api"      = "bthwani-wlt-api-local"
}

$Services = $ServiceSets[$Stack]

function Add-Log {
  param([string]$Message)

  $Line = "[$((Get-Date).ToString('o'))] $Message"
  Add-Content -LiteralPath $CommandLog -Value $Line -Encoding UTF8
  Write-Host $Message
}

function Invoke-ExternalLogged {
  param(
    [string]$Name,
    [string]$Exe,
    [string[]]$CommandArgs,
    [switch]$AllowFail
  )

  $SafeName = ($Name -replace '[^\w\.-]+', '_')
  $OutFile = Join-Path $RunRoot "$SafeName.txt"

  Add-Log "RUN: $Exe $($CommandArgs -join ' ')"

  & $Exe @CommandArgs *>&1 | Tee-Object -FilePath $OutFile
  $Code = $LASTEXITCODE

  if ($null -eq $Code) { $Code = 0 }

  Add-Log "EXIT: $Name => $Code"

  if ($Code -ne 0 -and -not $AllowFail) {
    throw "Command failed: $Name exit=$Code output=$OutFile"
  }

  return $Code
}

function Invoke-Compose {
  param(
    [string]$Name,
    [string[]]$ComposeArgs,
    [switch]$AllowFail
  )

  $DockerArgs = @(
    "compose",
    "--env-file", $EnvFile,
    "-f", $ComposeFile
  ) + $ComposeArgs

  Invoke-ExternalLogged -Name $Name -Exe "docker" -CommandArgs $DockerArgs -AllowFail:$AllowFail
}

function Test-Docker {
  Invoke-ExternalLogged -Name "docker-version" -Exe "docker" -CommandArgs @("version") | Out-Null
  Invoke-ExternalLogged -Name "docker-compose-version" -Exe "docker" -CommandArgs @("compose", "version") | Out-Null
}

function Remove-StaleContainerConflicts {
  param([string[]]$TargetServices)

  foreach ($Service in $TargetServices) {
    $Name = $ContainerByService[$Service]
    if (!$Name) { continue }

    $ExistingName = docker ps -a --filter "name=^/$Name$" --format "{{.Names}}" | Select-Object -First 1

    if (!$ExistingName) {
      Add-Log "NO CONFLICT: $Name"
      continue
    }

    $LabelsJson = docker inspect --format '{{json .Config.Labels}}' $ExistingName 2>$null
    $Project = ""

    if ($LASTEXITCODE -eq 0 -and $LabelsJson) {
      try {
        $Labels = $LabelsJson | ConvertFrom-Json
        if ($Labels.PSObject.Properties.Name -contains "com.docker.compose.project") {
          $Project = $Labels.'com.docker.compose.project'
        }
      } catch {
        $Project = ""
      }
    }

    if ($Project -eq $ExpectedProject) {
      Add-Log "KEEP root-managed container: $ExistingName project=[$Project]"
      continue
    }

    Add-Log "REMOVE stale/conflicting container: $ExistingName project=[$Project]"
    Invoke-ExternalLogged -Name "docker-rm-$ExistingName" -Exe "docker" -CommandArgs @("rm", "-f", $ExistingName) | Out-Null
  }
}

function Wait-Containers {
  param(
    [string[]]$TargetServices,
    [int]$TimeoutSeconds = 180
  )

  foreach ($Service in $TargetServices) {
    $Name = $ContainerByService[$Service]
    if (!$Name) { continue }

    $Deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    $Ok = $false

    while ((Get-Date) -lt $Deadline) {
      $State = docker inspect -f '{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' $Name 2>$null

      if ($LASTEXITCODE -eq 0 -and $State) {
        $Parts = $State -split "\|", 2
        $RunState = $Parts[0]
        $HealthState = if ($Parts.Count -gt 1) { $Parts[1] } else { "none" }

        if ($RunState -eq "running" -and ($HealthState -eq "healthy" -or $HealthState -eq "none")) {
          Add-Log "OK: $Name state=$RunState health=$HealthState"
          $Ok = $true
          break
        }

        Add-Log "WAIT: $Name state=$RunState health=$HealthState"
      } else {
        Add-Log "WAIT: $Name inspect unavailable"
      }

      Start-Sleep -Seconds 3
    }

    if (-not $Ok) {
      $Final = docker inspect -f '{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}|{{.State.ExitCode}}|{{.State.Error}}' $Name 2>$null
      Set-Content -LiteralPath (Join-Path $RunRoot "failed-$Name-state.txt") -Value "$Final" -Encoding UTF8
      docker logs --tail 200 $Name *>&1 | Tee-Object -FilePath (Join-Path $RunRoot "failed-$Name-logs.txt")
      throw "Container did not become healthy: $Name final=[$Final]"
    }
  }
}

function Test-Http {
  param(
    [string]$Name,
    [string]$Url,
    [int]$Retries = 30
  )

  $HttpLog = Join-Path $RunRoot "http-checks.txt"

  for ($Attempt = 1; $Attempt -le $Retries; $Attempt++) {
    try {
      Add-Content -LiteralPath $HttpLog -Value "TRY $Attempt/$Retries $Name $Url" -Encoding UTF8

      $Response = Invoke-WebRequest $Url -UseBasicParsing -TimeoutSec 5

      Add-Content -LiteralPath $HttpLog -Value "STATUS $Name $($Response.StatusCode)" -Encoding UTF8

      if ($Response.StatusCode -ge 200 -and $Response.StatusCode -lt 300) {
        Add-Log "OK: $Name => $($Response.StatusCode) $Url"
        return
      }
    } catch {
      Add-Content -LiteralPath $HttpLog -Value "ERROR $Name $($_.Exception.Message)" -Encoding UTF8
      Start-Sleep -Seconds 3
    }
  }

  throw "HTTP check failed: $Name $Url"
}

function Test-HealthEndpoints {
  param([string[]]$TargetServices)

  if ($TargetServices -contains "auth-service") {
    Test-Http "auth-service" "http://127.0.0.1:18082/health" -Retries $HttpRetries
  }

  if ($TargetServices -contains "dsh-api") {
    Test-Http "dsh-api" "http://127.0.0.1:8080/stores" -Retries $HttpRetries
  }

  if ($TargetServices -contains "wlt-api") {
    Test-Http "wlt-api" "http://127.0.0.1:18083/health" -Retries $HttpRetries
  }
}

function Get-ComposePort {
  param(
    [string]$Service,
    [int]$ContainerPort
  )

  $Line = docker compose --env-file $EnvFile -f $ComposeFile port $Service $ContainerPort 2>$null
  if (!$Line) { return "" }

  return (($Line -split ":")[-1]).Trim()
}

function Test-DbPorts {
  $DshPort = Get-ComposePort "dsh-postgres" 5432
  $WltPort = Get-ComposePort "wlt-postgres" 5432

  Add-Log "DSH_DB_PORT=$DshPort"
  Add-Log "WLT_DB_PORT=$WltPort"

  if (!$DshPort) { throw "Could not detect dsh-postgres published port." }
  if (!$WltPort) { throw "Could not detect wlt-postgres published port." }

  Invoke-ExternalLogged -Name "test-dsh-port" -Exe "powershell" -CommandArgs @("-NoProfile", "-Command", "Test-NetConnection 127.0.0.1 -Port $DshPort") | Out-Null
  Invoke-ExternalLogged -Name "test-wlt-port" -Exe "powershell" -CommandArgs @("-NoProfile", "-Command", "Test-NetConnection 127.0.0.1 -Port $WltPort") | Out-Null

  return @{
    dsh = $DshPort
    wlt = $WltPort
  }
}

function Invoke-DshTests {
  $Ports = Test-DbPorts
  $DshPort = $Ports.dsh

  Push-Location ".\dsh\backend"
  try {
    $env:DATABASE_URL = "postgres://dsh_local:dsh_local_password@localhost:$DshPort/dsh_local?sslmode=disable"
    Add-Log "DSH_TEST_DATABASE_URL=postgres://dsh_local:***@localhost:$DshPort/dsh_local?sslmode=disable"

    Invoke-ExternalLogged -Name "go-test-dsh-backend" -Exe "go" -CommandArgs @("test", "./...") | Out-Null
  } finally {
    Pop-Location
  }
}

function Pull-BaseImages {
  $Images = @(
    "postgres:16-alpine",
    "alpine:3.20",
    "golang:1.24-alpine",
    "minio/minio:latest",
    "minio/mc:latest"
  )

  foreach ($Image in $Images) {
    Invoke-ExternalLogged -Name "docker-pull-$($Image -replace '[:/]', '-')" -Exe "docker" -CommandArgs @("pull", $Image) | Out-Null
  }
}

function Save-Evidence {
  Invoke-ExternalLogged -Name "git-branch" -Exe "git" -CommandArgs @("branch", "--show-current") -AllowFail | Out-Null
  Invoke-ExternalLogged -Name "git-status-short" -Exe "git" -CommandArgs @("--no-pager", "status", "--short") -AllowFail | Out-Null
  Invoke-ExternalLogged -Name "git-diff-stat" -Exe "git" -CommandArgs @("--no-pager", "diff", "--stat") -AllowFail | Out-Null
  Invoke-ExternalLogged -Name "git-diff-check" -Exe "git" -CommandArgs @("--no-pager", "diff", "--check") -AllowFail | Out-Null
  Invoke-Compose -Name "docker-compose-ps-final" -ComposeArgs @("ps", "-a") -AllowFail | Out-Null
}

try {
  Add-Log "SESSION: $SessionId"
  Add-Log "ACTION: $Action"
  Add-Log "STACK: $Stack"
  Add-Log "RUN_ROOT: $RunRoot"

  Test-Docker

  switch ($Action) {
    "dev" {
      Remove-StaleContainerConflicts -TargetServices $ServiceSets["db"]
      Invoke-Compose -Name "compose-up-db" -ComposeArgs (@("up", "-d") + $ServiceSets["db"]) | Out-Null
      Wait-Containers -TargetServices $ServiceSets["db"] -TimeoutSeconds $HealthTimeoutSeconds
      Test-DbPorts | Out-Null

      if ($RunTests) {
        Invoke-DshTests
      }

      Invoke-Compose -Name "compose-ps-db" -ComposeArgs @("ps", "-a", "dsh-postgres", "wlt-postgres") | Out-Null
    }

    "core" {
      Remove-StaleContainerConflicts -TargetServices $ServiceSets["core"]
      Invoke-Compose -Name "compose-up-core-nobuild" -ComposeArgs (@("up", "-d") + $ServiceSets["core"]) | Out-Null
      Wait-Containers -TargetServices $ServiceSets["core"] -TimeoutSeconds $HealthTimeoutSeconds
      Test-HealthEndpoints -TargetServices $ServiceSets["core"]
      Invoke-Compose -Name "compose-ps-core" -ComposeArgs @("ps", "-a") | Out-Null
    }

    "status" {
      Invoke-Compose -Name "compose-ps-status" -ComposeArgs @("ps", "-a") | Out-Null
      Test-HealthEndpoints -TargetServices $ServiceSets["core"]
    }

    "logs" {
      $Args = @("logs", "--tail=$Tail")
      if ($FollowLogs) { $Args += "-f" }
      $Args += $Services

      Invoke-Compose -Name "compose-logs" -ComposeArgs $Args | Out-Null
    }

    "restart" {
      Invoke-Compose -Name "compose-restart-core" -ComposeArgs (@("restart") + $ServiceSets["core"]) -AllowFail | Out-Null
      Wait-Containers -TargetServices $ServiceSets["core"] -TimeoutSeconds $HealthTimeoutSeconds
      Test-HealthEndpoints -TargetServices $ServiceSets["core"]
    }

    "rebuild" {
      Pull-BaseImages
      Remove-StaleContainerConflicts -TargetServices $ServiceSets["core"]
      Invoke-Compose -Name "compose-up-core-build" -ComposeArgs (@("up", "-d", "--build") + $ServiceSets["core"]) | Out-Null
      Wait-Containers -TargetServices $ServiceSets["core"] -TimeoutSeconds $HealthTimeoutSeconds
      Test-HealthEndpoints -TargetServices $ServiceSets["core"]
      Invoke-Compose -Name "compose-ps-rebuild" -ComposeArgs @("ps", "-a") | Out-Null
    }

    "pull-base" {
      Pull-BaseImages
    }

    "stop" {
      Invoke-Compose -Name "compose-stop-core" -ComposeArgs (@("stop") + $ServiceSets["core"]) | Out-Null
      Invoke-Compose -Name "compose-ps-after-stop" -ComposeArgs @("ps", "-a") | Out-Null
    }

    "clean" {
      Remove-StaleContainerConflicts -TargetServices $Services
      Invoke-Compose -Name "compose-ps-after-clean" -ComposeArgs @("ps", "-a") | Out-Null
    }

    "doctor" {
      Invoke-ExternalLogged -Name "docker-system-df" -Exe "docker" -CommandArgs @("system", "df") -AllowFail | Out-Null
      Invoke-ExternalLogged -Name "docker-ps-a" -Exe "docker" -CommandArgs @("ps", "-a") -AllowFail | Out-Null
      Invoke-ExternalLogged -Name "docker-volume-ls" -Exe "docker" -CommandArgs @("volume", "ls") -AllowFail | Out-Null
      Invoke-Compose -Name "compose-config" -ComposeArgs @("config") -AllowFail | Out-Null
      Invoke-Compose -Name "compose-ps-doctor" -ComposeArgs @("ps", "-a") -AllowFail | Out-Null
    }

    "evidence" {
      Save-Evidence
    }
  }

  Save-Evidence

  $ScriptStatus = "PASS"
  Set-Content -LiteralPath $StatusFile -Value "PASS" -Encoding UTF8
  Add-Log "RESULT: PASS"
} catch {
  $ScriptStatus = "FAIL"
  $ScriptError = $_.Exception.Message

  Set-Content -LiteralPath $StatusFile -Value "FAIL`n$ScriptError" -Encoding UTF8
  Add-Log "RESULT: FAIL"
  Add-Log "ERROR: $ScriptError"

  try {
    Save-Evidence
  } catch {
    Add-Log "WARN: evidence collection failed: $($_.Exception.Message)"
  }

  throw
} finally {
  $CompletedAt = (Get-Date).ToString("o")

  $Summary = @"
# BThwani Docker Daily Dev

status: $ScriptStatus
session_id: $SessionId
action: $Action
stack: $Stack
repo: C:\bthwani-suite
completed_at: $CompletedAt
evidence_root: $RunRoot
handoff_zip: $HandoffZip

error:
$ScriptError
"@

  Set-Content -LiteralPath $SummaryFile -Value $Summary -Encoding UTF8

  $Evidence = [ordered]@{
    status = $ScriptStatus
    session_id = $SessionId
    action = $Action
    stack = $Stack
    repo = "C:\bthwani-suite"
    completed_at = $CompletedAt
    evidence_root = $RunRoot
    handoff_zip = $HandoffZip
    error = $ScriptError
  } | ConvertTo-Json -Depth 10

  Set-Content -LiteralPath $EvidenceFile -Value $Evidence -Encoding UTF8

  try {
    if (Test-Path -LiteralPath $HandoffZip) {
      Remove-Item -LiteralPath $HandoffZip -Force
    }

    $ZipItems = Get-ChildItem -LiteralPath $RunRoot -Force |
      Where-Object { $_.Name -ne "_HANDOFF.zip" } |
      Select-Object -ExpandProperty FullName

    if ($ZipItems) {
      Compress-Archive -LiteralPath $ZipItems -DestinationPath $HandoffZip -Force
    }

    Write-Host ""
    Write-Host "STATUS:        $ScriptStatus"
    Write-Host "EVIDENCE_ROOT: $RunRoot"
    Write-Host "HANDOFF_ZIP:   $HandoffZip"
  } catch {
    Write-Host "WARN: Could not create handoff zip: $($_.Exception.Message)"
  }
}
