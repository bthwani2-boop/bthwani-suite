Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"

$IssueCode = "CHECK_DOCKER_DSH_RUNTIME"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidenceJsonPath = Join-Path $RunRoot "evidence.json"
$StatusPath = Join-Path $RunRoot "status.txt"

$Findings = New-Object System.Collections.Generic.List[string]
$Warnings = New-Object System.Collections.Generic.List[string]
$Errors = New-Object System.Collections.Generic.List[string]

function Write-TextFile {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$false)][string]$Content = ""
  )
  $Content | Out-File -LiteralPath $Path -Encoding UTF8
}

function Add-Log {
  param([string]$Text)
  $line = "[$((Get-Date).ToString('s'))] $Text"
  $line | Tee-Object -FilePath $CommandLog -Append | Out-Null
}

function Run-Capture {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][scriptblock]$Block,
    [Parameter(Mandatory=$true)][string]$OutFile
  )

  Add-Log "RUN: $Name"
  $target = Join-Path $RunRoot $OutFile

  try {
    & $Block *> $target
    $exitCode = $LASTEXITCODE
    if ($null -eq $exitCode) { $exitCode = 0 }
    Add-Log "DONE: $Name exit=$exitCode output=$OutFile"
    return $exitCode
  } catch {
    "ERROR: $($_.Exception.Message)" | Out-File -LiteralPath $target -Encoding UTF8
    Add-Log "ERROR: $Name message=$($_.Exception.Message)"
    $Errors.Add("$Name failed: $($_.Exception.Message)") | Out-Null
    return 1
  }
}

function Test-Port {
  param(
    [Parameter(Mandatory=$true)][int]$Port,
    [Parameter(Mandatory=$true)][string]$Name
  )

  $out = Join-Path $RunRoot ("port-$Port-$Name.txt")
  try {
    $result = Test-NetConnection -ComputerName "127.0.0.1" -Port $Port -WarningAction SilentlyContinue
    $result | Format-List * | Out-File -LiteralPath $out -Encoding UTF8

    if ($result.TcpTestSucceeded) {
      $Findings.Add("PORT_OPEN: $Name on 127.0.0.1:$Port") | Out-Null
      return $true
    }

    $Warnings.Add("PORT_CLOSED: $Name on 127.0.0.1:$Port") | Out-Null
    return $false
  } catch {
    "ERROR: $($_.Exception.Message)" | Out-File -LiteralPath $out -Encoding UTF8
    $Warnings.Add("PORT_TEST_FAILED: $Name on 127.0.0.1:$Port") | Out-Null
    return $false
  }
}

function Test-Http {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][string]$Url,
    [Parameter(Mandatory=$true)][string]$OutFile
  )

  $target = Join-Path $RunRoot $OutFile
  Add-Log "HTTP: $Name $Url"

  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 8
    @(
      "URL: $Url"
      "StatusCode: $($response.StatusCode)"
      "StatusDescription: $($response.StatusDescription)"
      ""
      "BodyPreview:"
      ($response.Content | Select-Object -First 1)
    ) | Out-File -LiteralPath $target -Encoding UTF8

    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
      $Findings.Add("HTTP_OK: $Name $Url") | Out-Null
      return $true
    }

    $Warnings.Add("HTTP_NON_2XX: $Name $Url status=$($response.StatusCode)") | Out-Null
    return $false
  } catch {
    @(
      "URL: $Url"
      "ERROR: $($_.Exception.Message)"
    ) | Out-File -LiteralPath $target -Encoding UTF8

    $Warnings.Add("HTTP_FAILED: $Name $Url") | Out-Null
    return $false
  }
}

# ─────────────────────────────────────────────────────────────
# 1) Git / repo snapshot
# ─────────────────────────────────────────────────────────────

Run-Capture "git branch" { git branch --show-current } "git-branch.txt" | Out-Null
Run-Capture "git rev-parse HEAD" { git rev-parse HEAD } "git-head.txt" | Out-Null
Run-Capture "git status short" { git --no-pager status --short } "git-status-short.txt" | Out-Null
Run-Capture "git diff check" { git --no-pager diff --check } "git-diff-check.txt" | Out-Null

# ─────────────────────────────────────────────────────────────
# 2) Docker availability
# ─────────────────────────────────────────────────────────────

$dockerVersionExit = Run-Capture "docker version" { docker version } "docker-version.txt"
$dockerInfoExit = Run-Capture "docker info" { docker info } "docker-info.txt"
$composeVersionExit = Run-Capture "docker compose version" { docker compose version } "docker-compose-version.txt"

if ($dockerVersionExit -ne 0 -or $dockerInfoExit -ne 0) {
  $Errors.Add("Docker is not available or Docker Desktop/daemon is not running.") | Out-Null
}

if ($composeVersionExit -ne 0) {
  $Errors.Add("docker compose is not available.") | Out-Null
}

# ─────────────────────────────────────────────────────────────
# 3) Compose file checks
# ─────────────────────────────────────────────────────────────

$ComposeFile = Join-Path (Get-Location) "dsh\backend\docker-compose.local.yml"

if (-not (Test-Path -LiteralPath $ComposeFile)) {
  $Errors.Add("Missing compose file: dsh\backend\docker-compose.local.yml") | Out-Null
} else {
  $Findings.Add("COMPOSE_FILE_FOUND: dsh\backend\docker-compose.local.yml") | Out-Null

  Run-Capture "docker compose config" {
    docker compose -f ".\dsh\backend\docker-compose.local.yml" config
  } "docker-compose-config.txt" | Out-Null

  Run-Capture "docker compose ps" {
    docker compose -f ".\dsh\backend\docker-compose.local.yml" ps
  } "docker-compose-ps.txt" | Out-Null

  $composeText = Get-Content -LiteralPath $ComposeFile -Raw

  foreach ($svc in @("dsh-postgres", "auth-service", "dsh-api")) {
    if ($composeText -match [regex]::Escape($svc)) {
      $Findings.Add("SERVICE_DECLARED: $svc") | Out-Null
    } else {
      $Errors.Add("SERVICE_MISSING_IN_COMPOSE: $svc") | Out-Null
    }
  }

  if ($composeText -match "minio|s3|object-storage|object_storage") {
    $Findings.Add("MEDIA_STORAGE_SERVICE_HINT_FOUND: compose mentions MinIO/S3/object storage") | Out-Null
  } else {
    $Warnings.Add("MEDIA_STORAGE_GAP: compose does not declare MinIO/S3/object-storage service for runtime image/video storage.") | Out-Null
  }
}

# ─────────────────────────────────────────────────────────────
# 4) Docker global inventory
# ─────────────────────────────────────────────────────────────

Run-Capture "docker ps all" {
  docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
} "docker-ps-all.txt" | Out-Null

Run-Capture "docker network ls" { docker network ls } "docker-network-ls.txt" | Out-Null
Run-Capture "docker volume ls" { docker volume ls } "docker-volume-ls.txt" | Out-Null
Run-Capture "docker images relevant" {
  docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}" |
    Select-String -Pattern "postgres|bthwani|dsh|auth|minio|redis|nginx|golang|alpine" -SimpleMatch:$false
} "docker-images-relevant.txt" | Out-Null

# ─────────────────────────────────────────────────────────────
# 5) Expected containers logs
# ─────────────────────────────────────────────────────────────

$containers = @(
  "bthwani-dsh-postgres-local",
  "bthwani-auth-service-local",
  "bthwani-dsh-api-local",
  "bthwani-minio-local"
)

foreach ($container in $containers) {
  $exists = $false
  try {
    $inspect = docker inspect $container 2>$null
    if ($LASTEXITCODE -eq 0 -and $inspect) { $exists = $true }
  } catch {
    $exists = $false
  }

  if ($exists) {
    $Findings.Add("CONTAINER_FOUND: $container") | Out-Null

    Run-Capture "docker inspect $container" {
      docker inspect $container
    } "docker-inspect-$container.json" | Out-Null

    Run-Capture "docker logs $container" {
      docker logs --tail 160 $container
    } "docker-logs-$container.txt" | Out-Null
  } else {
    if ($container -eq "bthwani-minio-local") {
      $Warnings.Add("CONTAINER_NOT_FOUND: $container. Expected only after media runtime storage is implemented.") | Out-Null
    } else {
      $Warnings.Add("CONTAINER_NOT_FOUND: $container") | Out-Null
    }
  }
}

# ─────────────────────────────────────────────────────────────
# 6) Port checks
# ─────────────────────────────────────────────────────────────

Test-Port -Port 8080 -Name "dsh-api" | Out-Null
Test-Port -Port 18082 -Name "auth-service" | Out-Null
Test-Port -Port 15432 -Name "postgres-default-compose" | Out-Null
Test-Port -Port 55432 -Name "postgres-legacy-local-baseline" | Out-Null
Test-Port -Port 9000 -Name "minio-api" | Out-Null
Test-Port -Port 9001 -Name "minio-console" | Out-Null

# ─────────────────────────────────────────────────────────────
# 7) HTTP smoke checks
# ─────────────────────────────────────────────────────────────

Test-Http -Name "dsh-api stores" -Url "http://127.0.0.1:8080/stores" -OutFile "http-dsh-api-stores.txt" | Out-Null
Test-Http -Name "auth-service health" -Url "http://127.0.0.1:18082/health" -OutFile "http-auth-health.txt" | Out-Null
Test-Http -Name "minio console" -Url "http://127.0.0.1:9001" -OutFile "http-minio-console.txt" | Out-Null

# ─────────────────────────────────────────────────────────────
# 8) Real media runtime storage checks
# ─────────────────────────────────────────────────────────────

$RealMediaGuard = Join-Path (Get-Location) "tools\guards\guard-real-media-runtime.mjs"

if (Test-Path -LiteralPath $RealMediaGuard) {
  $Findings.Add("REAL_MEDIA_RUNTIME_GUARD_FOUND: tools\guards\guard-real-media-runtime.mjs") | Out-Null
} else {
  $Warnings.Add("REAL_MEDIA_RUNTIME_GUARD_MISSING: tools\guards\guard-real-media-runtime.mjs") | Out-Null
}

Run-Capture "search media upload contracts" {
  Select-String -Path ".\dsh\**\*.*" -Pattern "multipart|UploadProductMediaRequest|media_key|storage_key|MinIO|S3|presigned|upload-intent|upload_intent|complete" -CaseSensitive:$false -ErrorAction SilentlyContinue |
    Select-Object Path, LineNumber, Line
} "scan-media-upload-contracts.txt" | Out-Null

# ─────────────────────────────────────────────────────────────
# 9) Compose/local runtime decision
# ─────────────────────────────────────────────────────────────

$Status = "PASS_WITH_WARNINGS"

if ($Errors.Count -gt 0) {
  $Status = "FIX_REQUIRED"
}

$hasMediaStorageGap = $false
foreach ($w in $Warnings) {
  if ($w -like "MEDIA_STORAGE_GAP*") { $hasMediaStorageGap = $true }
}

if ($hasMediaStorageGap -and $Status -ne "FIX_REQUIRED") {
  $Status = "FIX_REQUIRED"
}

$Recommendation = switch ($Status) {
  "FIX_REQUIRED" { "Fix Docker/runtime gaps before claiming Docker media readiness. If media upload is in scope, add MinIO/S3-compatible storage and DSH media metadata flow." }
  default { "Review warnings, then proceed with runtime smoke tests." }
}

# ─────────────────────────────────────────────────────────────
# 10) Summary / JSON / ZIP
# ─────────────────────────────────────────────────────────────

$summary = @"
# $SessionId

Decision: $Status

Recommendation:
$Recommendation

Scope:
- Docker Desktop / docker CLI / docker compose
- dsh/backend/docker-compose.local.yml
- DSH containers and ports
- DSH API smoke endpoint
- Auth health endpoint
- PostgreSQL expected local ports
- MinIO/Object Storage readiness for images/videos
- real-media-runtime/storage gap

Read-only:
- No source files modified.
- No containers started/stopped.
- No volumes deleted.
- No Docker cleanup commands executed.
- Evidence files only were written under this run folder.

Findings:
$($Findings | ForEach-Object { "- $_" } | Out-String)

Warnings:
$($Warnings | ForEach-Object { "- $_" } | Out-String)

Errors:
$($Errors | ForEach-Object { "- $_" } | Out-String)

Evidence root:
$RunRoot

Expected ZIP:
$RunRoot\$SessionId.zip
"@

Write-TextFile -Path $SummaryPath -Content $summary
Write-TextFile -Path $StatusPath -Content $Status

$evidence = [ordered]@{
  session_id = $SessionId
  issue_code = $IssueCode
  status = $Status
  recommendation = $Recommendation
  repo = "C:\bthwani-suite"
  evidence_root = $RunRoot
  generated_at = (Get-Date).ToString("o")
  docker_compose_file = "dsh/backend/docker-compose.local.yml"
  checks = [ordered]@{
    docker_version = "docker-version.txt"
    docker_info = "docker-info.txt"
    docker_compose_version = "docker-compose-version.txt"
    docker_compose_config = "docker-compose-config.txt"
    docker_compose_ps = "docker-compose-ps.txt"
    docker_ps_all = "docker-ps-all.txt"
    git_status = "git-status-short.txt"
    git_diff_check = "git-diff-check.txt"
    media_contract_scan = "scan-media-upload-contracts.txt"
  }
  findings = @($Findings)
  warnings = @($Warnings)
  errors = @($Errors)
}

$evidence | ConvertTo-Json -Depth 8 | Out-File -LiteralPath $EvidenceJsonPath -Encoding UTF8

$ZipPath = Join-Path $RunRoot "$SessionId.zip"
if (Test-Path -LiteralPath $ZipPath) {
  Remove-Item -LiteralPath $ZipPath -Force
}

Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath -Force

Write-Host ""
Write-Host "Decision: $Status"
Write-Host "Evidence root: $RunRoot"
Write-Host "ZIP: $ZipPath"
Write-Host ""
Write-Host "Upload this ZIP if you want review:"
Write-Host $ZipPath
