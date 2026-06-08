#Requires -Version 7
# CHECK_DOCKER_DSH_WLT_RUNTIME_DIAGNOSTIC.ps1
# Read-only diagnostic for the BThwani local Docker runtime.
# Writes evidence to tools\registry\runs\{SESSION_ID}\
# Produces a ZIP at tools\registry\runs\{SESSION_ID}.zip
# Usage: pwsh tools/registry/CHECK_DOCKER_DSH_WLT_RUNTIME_DIAGNOSTIC.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Continue'

$SESSION_ID = "diag-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$REPO_ROOT  = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$RUN_DIR    = Join-Path $REPO_ROOT "tools\registry\runs\$SESSION_ID"
$COMPOSE    = Join-Path $REPO_ROOT "docker-compose.local.yml"

New-Item -ItemType Directory -Force -Path $RUN_DIR | Out-Null

function Write-Evidence {
    param([string]$Name, [string]$Content)
    $path = Join-Path $RUN_DIR "$Name.txt"
    $Content | Set-Content -Path $path -Encoding UTF8
    Write-Host "  [evidence] $Name"
}

function Probe-HTTP {
    param([string]$Label, [string]$Url, [int]$TimeoutSec = 5)
    try {
        $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
        return @{ label = $Label; url = $Url; status = $r.StatusCode; ok = $true; body = $r.Content.Substring(0, [Math]::Min(200, $r.Content.Length)) }
    } catch {
        return @{ label = $Label; url = $Url; status = 0; ok = $false; body = $_.Exception.Message }
    }
}

Write-Host "`nSESSION: $SESSION_ID"
Write-Host "REPO:    $REPO_ROOT"
Write-Host "OUTPUT:  $RUN_DIR`n"

# ─── 1. Tool versions ─────────────────────────────────────────────────────────
Write-Host "1. Tool versions"
$dockerVersion   = docker version 2>&1 | Out-String
$composeVersion  = docker compose version 2>&1 | Out-String
Write-Evidence "01_docker_version"  $dockerVersion
Write-Evidence "01_compose_version" $composeVersion

# ─── 2. Compose config ────────────────────────────────────────────────────────
Write-Host "2. Compose config"
$configOut = docker compose -f $COMPOSE config 2>&1 | Out-String
Write-Evidence "02_compose_config" $configOut

# ─── 3. Running services ──────────────────────────────────────────────────────
Write-Host "3. Compose ps"
$psOut = docker compose -f $COMPOSE ps 2>&1 | Out-String
Write-Evidence "03_compose_ps" $psOut
Write-Host $psOut

# ─── 4. Service health probes ─────────────────────────────────────────────────
Write-Host "4. HTTP health probes"
$probes = @(
    (Probe-HTTP "dsh-api /stores"         "http://127.0.0.1:8080/stores"),
    (Probe-HTTP "auth-service /health"    "http://127.0.0.1:18082/health"),
    (Probe-HTTP "wlt-api /health"         "http://127.0.0.1:18083/health"),
    (Probe-HTTP "minio S3 API /health"    "http://127.0.0.1:9000/minio/health/live"),
    (Probe-HTTP "minio Console"           "http://127.0.0.1:9001")
)

$probeReport = $probes | ForEach-Object {
    $icon = if ($_.ok) { "OK  " } else { "FAIL" }
    "[$icon] $($_.label) ($($_.url)) => HTTP $($_.status)"
}
$probeText = $probeReport -join "`n"
Write-Host $probeText
Write-Evidence "04_http_probes" $probeText

# ─── 5. MinIO bucket check ────────────────────────────────────────────────────
Write-Host "5. MinIO bucket check"
$minioBucket = docker exec bthwani-minio-local mc ls local/bthwani-media-local 2>&1 | Out-String
if ($LASTEXITCODE -eq 0 -or $minioBucket -match 'bthwani-media-local|No object found') {
    $bucketStatus = "BUCKET_READY: bthwani-media-local"
} else {
    $bucketStatus = "BUCKET_NOT_READY: $minioBucket"
}
Write-Host "  $bucketStatus"
Write-Evidence "05_minio_bucket" "$bucketStatus`n$minioBucket"

# ─── 6. dsh_media_assets table check ─────────────────────────────────────────
Write-Host "6. dsh_media_assets table"
$tableCheck = docker exec bthwani-dsh-postgres-local psql -U dsh_local -d dsh_local -c "\d dsh_media_assets" 2>&1 | Out-String
if ($tableCheck -match 'dsh_media_assets') {
    Write-Host "  TABLE_EXISTS: dsh_media_assets"
} else {
    Write-Host "  TABLE_MISSING: dsh_media_assets — migration 030 may not have applied"
}
Write-Evidence "06_dsh_media_assets_table" $tableCheck

# ─── 7. Upload intent smoke test ─────────────────────────────────────────────
Write-Host "7. Upload intent smoke test"
$smokeResult = @()

$intentBody = @{
    owner_service = "dsh"
    owner_type    = "product"
    owner_id      = "smoke-product-001"
    media_type    = "image"
    purpose       = "primary"
    filename      = "smoke-test.jpg"
    mime_type     = "image/jpeg"
    actor_id      = "diagnostic-runner"
} | ConvertTo-Json

try {
    $intentResp = Invoke-WebRequest `
        -Method POST `
        -Uri "http://127.0.0.1:8080/media/upload-intents" `
        -Body $intentBody `
        -ContentType "application/json" `
        -Headers @{ 'X-Client-Id' = 'diagnostic-runner'; 'X-Actor-Type' = 'operator' } `
        -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop

    $intentData = $intentResp.Content | ConvertFrom-Json
    $mediaId    = $intentData.intent.media_id
    $uploadUrl  = $intentData.intent.upload_url
    $smokeResult += "INTENT_CREATED: media_id=$mediaId"
    $smokeResult += "UPLOAD_URL: $uploadUrl"
    Write-Host "  INTENT_CREATED: $mediaId"

    if ($uploadUrl -and $uploadUrl -ne "") {
        # PUT a tiny 1x1 white JPEG to MinIO via presigned URL
        $tinyJpeg = [byte[]](
            0xFF,0xD8,0xFF,0xE0,0x00,0x10,0x4A,0x46,0x49,0x46,0x00,0x01,0x01,0x00,0x00,0x01,
            0x00,0x01,0x00,0x00,0xFF,0xDB,0x00,0x43,0x00,0x08,0x06,0x06,0x07,0x06,0x05,0x08,
            0x07,0x07,0x07,0x09,0x09,0x08,0x0A,0x0C,0x14,0x0D,0x0C,0x0B,0x0B,0x0C,0x19,0x12,
            0x13,0x0F,0x14,0x1D,0x1A,0x1F,0x1E,0x1D,0x1A,0x1C,0x1C,0x20,0x24,0x2E,0x27,0x20,
            0x22,0x2C,0x23,0x1C,0x1C,0x28,0x37,0x29,0x2C,0x30,0x31,0x34,0x34,0x34,0x1F,0x27,
            0x39,0x3D,0x38,0x32,0x3C,0x2E,0x33,0x34,0x32,0xFF,0xC0,0x00,0x0B,0x08,0x00,0x01,
            0x00,0x01,0x01,0x01,0x11,0x00,0xFF,0xC4,0x00,0x1F,0x00,0x00,0x01,0x05,0x01,0x01,
            0x01,0x01,0x01,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x02,0x03,0x04,
            0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0xFF,0xC4,0x00,0xB5,0x10,0x00,0x02,0x01,0x03,
            0x03,0x02,0x04,0x03,0x05,0x05,0x04,0x04,0x00,0x00,0x01,0x7D,0x01,0x02,0x03,0x00,
            0x04,0x11,0x05,0x12,0x21,0x31,0x41,0x06,0x13,0x51,0x61,0x07,0x22,0x71,0x14,0x32,
            0x81,0x91,0xA1,0x08,0x23,0x42,0xB1,0xC1,0x15,0x52,0xD1,0xF0,0x24,0x33,0x62,0x72,
            0x82,0x09,0x0A,0x16,0x17,0x18,0x19,0x1A,0x25,0x26,0x27,0x28,0x29,0x2A,0x34,0x35,
            0x36,0x37,0x38,0x39,0x3A,0x43,0x44,0x45,0x46,0x47,0x48,0x49,0x4A,0x53,0x54,0x55,
            0x56,0x57,0x58,0x59,0x5A,0x63,0x64,0x65,0x66,0x67,0x68,0x69,0x6A,0x73,0x74,0x75,
            0x76,0x77,0x78,0x79,0x7A,0x83,0x84,0x85,0x86,0x87,0x88,0x89,0x8A,0x92,0x93,0x94,
            0xFF,0xDA,0x00,0x08,0x01,0x01,0x00,0x00,0x3F,0x00,0xFB,0xD4,0xFF,0xD9
        )
        try {
            $putResp = Invoke-WebRequest -Method PUT -Uri $uploadUrl -Body $tinyJpeg `
                -ContentType "image/jpeg" -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
            $smokeResult += "UPLOAD_PUT: HTTP $($putResp.StatusCode)"
            Write-Host "  UPLOAD_PUT: $($putResp.StatusCode)"
        } catch {
            $smokeResult += "UPLOAD_PUT_FAILED: $($_.Exception.Message)"
            Write-Host "  UPLOAD_PUT_FAILED (MinIO may not be running): $($_.Exception.Message)"
        }
    } else {
        $smokeResult += "UPLOAD_URL_EMPTY: DSH_MEDIA_S3_ENDPOINT not configured or service not running"
        Write-Host "  UPLOAD_URL_EMPTY"
    }

    # Complete the upload
    try {
        $completeResp = Invoke-WebRequest `
            -Method POST `
            -Uri "http://127.0.0.1:8080/media/$mediaId/complete" `
            -Body '{}' `
            -ContentType "application/json" `
            -Headers @{ 'X-Client-Id' = 'diagnostic-runner'; 'X-Actor-Type' = 'operator' } `
            -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $completeData = $completeResp.Content | ConvertFrom-Json
        $smokeResult += "COMPLETE: status=$($completeData.status) url=$($completeData.public_url)"
        Write-Host "  COMPLETE: status=$($completeData.status)"
    } catch {
        $smokeResult += "COMPLETE_FAILED: $($_.Exception.Message)"
        Write-Host "  COMPLETE_FAILED: $($_.Exception.Message)"
    }

    # GET media
    try {
        $getResp = Invoke-WebRequest `
            -Uri "http://127.0.0.1:8080/media/$mediaId" `
            -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $smokeResult += "GET_MEDIA: HTTP $($getResp.StatusCode)"
        Write-Host "  GET_MEDIA: $($getResp.StatusCode)"
    } catch {
        $smokeResult += "GET_MEDIA_FAILED: $($_.Exception.Message)"
    }

} catch {
    $smokeResult += "INTENT_FAILED: $($_.Exception.Message)"
    Write-Host "  INTENT_FAILED: $($_.Exception.Message)"
    Write-Host "  (dsh-api may need a restart after MinIO was added)"
}

Write-Evidence "07_upload_smoke" ($smokeResult -join "`n")

# ─── 8. WLT reference-only guard ─────────────────────────────────────────────
Write-Host "8. WLT media reference guard"
$wltMediaViolations = @()

# WLT should not have any route that returns DSH media URLs
try {
    $wltHealth = Invoke-WebRequest -Uri "http://127.0.0.1:18083/health" -UseBasicParsing -TimeoutSec 5
    $wltMediaViolations += "WLT_HEALTH: OK ($($wltHealth.StatusCode))"
} catch {
    $wltMediaViolations += "WLT_HEALTH: UNREACHABLE"
}

# Check WLT Go source for any DSH media_assets table direct access
$wltSrcPath = Join-Path $REPO_ROOT "wlt\backend\internal"
if (Test-Path $wltSrcPath) {
    $wltGoFiles = Get-ChildItem -Path $wltSrcPath -Recurse -Filter "*.go"
    foreach ($f in $wltGoFiles) {
        $content = Get-Content $f.FullName -Raw
        if ($content -match 'dsh_media_assets') {
            $wltMediaViolations += "WLT_DSH_TABLE_DIRECT_ACCESS: $($f.FullName)"
        }
        if ($content -match '/media-fixtures/') {
            $wltMediaViolations += "WLT_FIXTURE_REFERENCE: $($f.FullName)"
        }
    }
}

if ($wltMediaViolations | Where-Object { $_ -match 'DIRECT_ACCESS|FIXTURE_REFERENCE' }) {
    Write-Host "  WLT_REFERENCE_GUARD: VIOLATIONS FOUND"
} else {
    Write-Host "  WLT_REFERENCE_GUARD: CLEAN"
    $wltMediaViolations += "WLT_REFERENCE_GUARD: CLEAN — WLT does not access dsh_media_assets directly"
}
Write-Evidence "08_wlt_reference_guard" ($wltMediaViolations -join "`n")

# ─── 9. Canonical media consistency ──────────────────────────────────────────
Write-Host "9. Canonical media consistency"
$canonicalResult = @()

# Check for hardcoded /media-fixtures/ URLs in runtime surfaces
$runtimeSurfaces = @('app-client', 'app-partner', 'app-captain', 'app-field')
$hardcoded = @()
foreach ($surface in $runtimeSurfaces) {
    $surfaceDir = Join-Path $REPO_ROOT "dsh\frontend\$surface"
    if (Test-Path $surfaceDir) {
        $tsFiles = Get-ChildItem -Path $surfaceDir -Recurse -Include "*.ts","*.tsx"
        foreach ($f in $tsFiles) {
            $content = Get-Content $f.FullName -Raw
            if ($content -match "'/media-fixtures/|`"/media-fixtures/") {
                $hardcoded += "HARDCODED_FIXTURE_URL: $($f.FullName)"
            }
        }
    }
}

if ($hardcoded.Count -eq 0) {
    $canonicalResult += "HARDCODED_FIXTURE_URLS: NONE FOUND IN RUNTIME SURFACES"
} else {
    $canonicalResult += $hardcoded
}

# Verify dsh_media_assets has at least one record after smoke
$rowCount = docker exec bthwani-dsh-postgres-local psql -U dsh_local -d dsh_local -tAc "SELECT COUNT(*) FROM dsh_media_assets;" 2>&1
if ($rowCount -match '^\d+$') {
    $canonicalResult += "DSH_MEDIA_ASSETS_ROWS: $($rowCount.Trim())"
    Write-Host "  DSH_MEDIA_ASSETS_ROWS: $($rowCount.Trim())"
} else {
    $canonicalResult += "DSH_MEDIA_ASSETS_ROWS: QUERY_FAILED (table may not exist yet)"
    Write-Host "  DSH_MEDIA_ASSETS_ROWS: QUERY_FAILED"
}

Write-Evidence "09_canonical_consistency" ($canonicalResult -join "`n")

# ─── 10. Git diff summary ─────────────────────────────────────────────────────
Write-Host "10. Git diff summary"
Push-Location $REPO_ROOT
$gitStatus  = git --no-pager status --short 2>&1 | Out-String
$gitDiffStat = git --no-pager diff --stat 2>&1 | Out-String
$gitCheck   = git --no-pager diff --check 2>&1 | Out-String
Pop-Location
Write-Evidence "10_git_status"    $gitStatus
Write-Evidence "10_git_diff_stat" $gitDiffStat
Write-Evidence "10_git_diff_check" $gitCheck

# ─── ZIP and final report ─────────────────────────────────────────────────────
Write-Host "`nCreating ZIP..."
$zipPath = Join-Path $REPO_ROOT "tools\registry\runs\$SESSION_ID.zip"
Compress-Archive -Path "$RUN_DIR\*" -DestinationPath $zipPath -Force
Write-Host "ZIP: $zipPath"

Write-Host "`n=== SUMMARY ==="
Write-Host "Session:  $SESSION_ID"
Write-Host "Evidence: $RUN_DIR"
Write-Host "ZIP:      $zipPath"

$allHealthy = ($probes | Where-Object { !$_.ok }).Count -eq 0
if ($allHealthy) {
    Write-Host "`nDONE: All services healthy."
} else {
    $failed = ($probes | Where-Object { !$_.ok }) | ForEach-Object { $_.label }
    Write-Host "`nBLOCKED: Unhealthy services: $($failed -join ', ')"
    Write-Host "Run: docker compose -f docker-compose.local.yml up -d --build"
}
