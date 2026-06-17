#Requires -Version 7
# CHECK_DOCKER_DSH_WLT_RUNTIME_DIAGNOSTIC.ps1 — V3
# DSH_WLT_MEDIA_RUNTIME_FINAL_CLOSURE diagnostic.
# Read-only by default. Writes evidence inside tools\registry\runs\{SESSION_ID}\
# ZIP written to tools\registry\runs\{SESSION_ID}\{SESSION_ID}.zip
# Usage: pwsh tools/registry/CHECK_DOCKER_DSH_WLT_RUNTIME_DIAGNOSTIC.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Continue'

$SESSION_ID = "diag-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$REPO_ROOT  = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$RUN_DIR    = Join-Path $REPO_ROOT "tools\registry\runs\$SESSION_ID"
$ZIP_PATH   = Join-Path $RUN_DIR "$SESSION_ID.zip"
$COMPOSE    = Join-Path $REPO_ROOT "docker-compose.local.yml"

New-Item -ItemType Directory -Force -Path $RUN_DIR | Out-Null

# ─── Helpers ─────────────────────────────────────────────────────────────────

function Write-Evidence {
    param([string]$Name, [string]$Content)
    $path = Join-Path $RUN_DIR "$Name.txt"
    $Content | Set-Content -Path $path -Encoding UTF8
}

$checks = [System.Collections.Generic.List[hashtable]]::new()

function Record-Check {
    param([string]$Id, [string]$Label, [bool]$Pass, [string]$Detail = '')
    $icon = if ($Pass) { 'PASS' } else { 'FAIL' }
    Write-Host "  [$icon] $Label$(if ($Detail) { ": $Detail" })"
    $checks.Add(@{ id = $Id; label = $Label; pass = $Pass; detail = $Detail })
}

function Probe-HTTP {
    param([string]$Label, [string]$Url, [int]$TimeoutSec = 5)
    try {
        $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
        return @{ label = $Label; url = $Url; status = $r.StatusCode; ok = $true; body = ($r.Content.Length -gt 0 ? $r.Content.Substring(0, [Math]::Min(200, $r.Content.Length)) : '') }
    } catch {
        return @{ label = $Label; url = $Url; status = 0; ok = $false; body = $_.Exception.Message }
    }
}

Write-Host "`n=== DSH_WLT_MEDIA_RUNTIME_FINAL_CLOSURE DIAGNOSTIC V3 ==="
Write-Host "SESSION: $SESSION_ID"
Write-Host "REPO:    $REPO_ROOT"
Write-Host "OUTPUT:  $RUN_DIR"
Write-Host "ZIP:     $ZIP_PATH`n"

# ─── 1. Tool versions ─────────────────────────────────────────────────────────
Write-Host "1. Tool versions"
$dockerVersion  = docker version 2>&1 | Out-String
$composeVersion = docker compose version 2>&1 | Out-String
Write-Evidence "01_docker_version"  $dockerVersion
Write-Evidence "01_compose_version" $composeVersion

# ─── 2. Compose config ────────────────────────────────────────────────────────
Write-Host "2. Compose config"
$configOut = docker compose -f $COMPOSE config 2>&1 | Out-String
Write-Evidence "02_compose_config" $configOut

# ─── 3. Running services ──────────────────────────────────────────────────────
Write-Host "3. Compose ps"
$psOut = docker compose -f $COMPOSE ps 2>&1 | Out-String
Write-Host $psOut
Write-Evidence "03_compose_ps" $psOut

# ─── 4. HTTP health probes ────────────────────────────────────────────────────
Write-Host "4. HTTP health probes"
$probes = @(
    (Probe-HTTP "dsh-api /stores"      "http://127.0.0.1:8080/stores"),
    (Probe-HTTP "auth-service /health" "http://127.0.0.1:18082/health"),
    (Probe-HTTP "wlt-api /health"      "http://127.0.0.1:18083/health"),
    (Probe-HTTP "minio /health/live"   "http://127.0.0.1:9000/minio/health/live"),
    (Probe-HTTP "minio console"        "http://127.0.0.1:9001")
)

$probeLines = $probes | ForEach-Object {
    $icon = if ($_.ok) { 'OK  ' } else { 'FAIL' }
    "[$icon] $($_.label) => HTTP $($_.status)"
}
Write-Host ($probeLines -join "`n")
Write-Evidence "04_http_probes" ($probeLines -join "`n")

Record-Check "health_dsh"   "DSH API healthy"           ($probes[0].ok)
Record-Check "health_auth"  "Auth service healthy"       ($probes[1].ok)
Record-Check "health_wlt"   "WLT API healthy"            ($probes[2].ok)
Record-Check "health_minio" "MinIO healthy"              ($probes[3].ok)

# ─── 5. MinIO bucket ──────────────────────────────────────────────────────────
Write-Host "5. MinIO bucket check"
$bucketOut = docker exec bthwani-minio-local mc ls local/bthwani-media-local 2>&1 | Out-String
$bucketReady = ($LASTEXITCODE -eq 0) -or ($bucketOut -match 'bthwani-media-local|No object found')
Record-Check "minio_bucket" "Bucket bthwani-media-local ready" $bucketReady $bucketOut.Trim()
Write-Evidence "05_minio_bucket" "READY=$bucketReady`n$bucketOut"

# ─── 6. dsh_media_assets migration ───────────────────────────────────────────
Write-Host "6. dsh_media_assets migration"
$tableDesc  = docker exec bthwani-dsh-postgres-local psql -U dsh_local -d dsh_local -c "\d dsh_media_assets" 2>&1 | Out-String
$tableExists = $tableDesc -match 'dsh_media_assets'
$rowCount   = docker exec bthwani-dsh-postgres-local psql -U dsh_local -d dsh_local -tAc "SELECT COUNT(*) FROM dsh_media_assets;" 2>&1
$rowCount   = $rowCount.Trim()
Record-Check "migration_table"  "dsh_media_assets table exists" $tableExists
Record-Check "migration_runner" "Row count queryable"           ($rowCount -match '^\d+$') $rowCount
Write-Evidence "06_migration" "TABLE_EXISTS=$tableExists`nROWS=$rowCount`n$tableDesc"

# ─── 7. Upload → PUT → Complete → GET → List smoke ────────────────────────────
Write-Host "7. Media smoke test"
$smokeLines = [System.Collections.Generic.List[string]]::new()
$intentOk = $false; $putOk = $false; $completeOk = $false; $getOk = $false; $listOk = $false
$smokeMediaId = $null

$intentBody = @{
    owner_type    = "product"
    owner_id      = "smoke-product-001"
    media_type    = "image"
    purpose       = "primary"
    filename      = "smoke-test.jpg"
    mime_type     = "image/jpeg"
    file_size_bytes = 256
} | ConvertTo-Json

try {
    $intentResp = Invoke-WebRequest `
        -Method POST `
        -Uri "http://127.0.0.1:8080/media/upload-intents" `
        -Body $intentBody `
        -ContentType "application/json" `
        -Headers @{ 'X-Client-Id' = 'diagnostic-runner'; 'X-Actor-Type' = 'operator' } `
        -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop

    $intentData  = $intentResp.Content | ConvertFrom-Json
    $smokeMediaId = $intentData.intent.media_id
    $uploadUrl   = $intentData.intent.upload_url
    $intentOk    = $true
    $smokeLines.Add("INTENT_CREATED: media_id=$smokeMediaId upload_url=$(if ($uploadUrl) { 'SET' } else { 'EMPTY' })")

    if ($uploadUrl -and $uploadUrl -ne '') {
        $tinyJpeg = [byte[]](
            0xFF,0xD8,0xFF,0xE0,0x00,0x10,0x4A,0x46,0x49,0x46,0x00,0x01,
            0x01,0x00,0x00,0x01,0x00,0x01,0x00,0x00,0xFF,0xC0,0x00,0x0B,
            0x08,0x00,0x01,0x00,0x01,0x01,0x01,0x11,0x00,0xFF,0xC4,0x00,
            0x1F,0x00,0x00,0x01,0x05,0x01,0x01,0x01,0x01,0x01,0x01,0x00,
            0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x02,0x03,0x04,0x05,
            0x06,0x07,0x08,0x09,0x0A,0x0B,0xFF,0xDA,0x00,0x08,0x01,0x01,
            0x00,0x00,0x3F,0x00,0xFB,0xD4,0xFF,0xD9
        )
        try {
            $putHeaders = @{ 'Content-Type' = 'image/jpeg'; 'x-amz-content-sha256' = 'UNSIGNED-PAYLOAD' }
            $putResp = Invoke-WebRequest -Method PUT -Uri $uploadUrl -Body $tinyJpeg `
                -Headers $putHeaders -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
            $putOk = ($putResp.StatusCode -ge 200 -and $putResp.StatusCode -lt 300)
            $smokeLines.Add("PUT_MINIO: HTTP $($putResp.StatusCode)")
        } catch {
            $smokeLines.Add("PUT_MINIO_FAILED: $($_.Exception.Message)")
        }
    } else {
        $smokeLines.Add("PUT_MINIO: SKIPPED — upload_url empty (MinIO not configured in dsh-api env)")
    }

    # Complete
    try {
        $completeResp = Invoke-WebRequest `
            -Method POST `
            -Uri "http://127.0.0.1:8080/media/$smokeMediaId/complete" `
            -Body '{}' -ContentType "application/json" `
            -Headers @{ 'X-Client-Id' = 'diagnostic-runner'; 'X-Actor-Type' = 'operator' } `
            -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $completeData = $completeResp.Content | ConvertFrom-Json
        $completeOk = $true
        $smokeLines.Add("COMPLETE: status=$($completeData.status)")
    } catch {
        $smokeLines.Add("COMPLETE_FAILED: $($_.Exception.Message)")
    }

    # GET
    try {
        $getResp = Invoke-WebRequest `
            -Uri "http://127.0.0.1:8080/media/$smokeMediaId" `
            -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $getOk = ($getResp.StatusCode -eq 200)
        $smokeLines.Add("GET_MEDIA: HTTP $($getResp.StatusCode)")
    } catch {
        $smokeLines.Add("GET_MEDIA_FAILED: $($_.Exception.Message)")
    }

    # LIST
    try {
        $listResp = Invoke-WebRequest `
            -Uri "http://127.0.0.1:8080/media?owner_type=product&owner_id=smoke-product-001" `
            -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $listData = $listResp.Content | ConvertFrom-Json
        $listOk = ($listData.total -ge 1)
        $smokeLines.Add("LIST_MEDIA: total=$($listData.total)")
    } catch {
        $smokeLines.Add("LIST_MEDIA_FAILED: $($_.Exception.Message)")
    }

} catch {
    $smokeLines.Add("INTENT_FAILED: $($_.Exception.Message)")
}

Record-Check "smoke_intent"   "Upload intent created"           $intentOk
Record-Check "smoke_put"      "PUT to MinIO succeeded"          $putOk
Record-Check "smoke_complete" "Complete upload succeeded"       $completeOk
Record-Check "smoke_get"      "GET media asset succeeded"       $getOk
Record-Check "smoke_list"     "LIST media assets returned >= 1" $listOk
Write-Evidence "07_smoke_test" ($smokeLines -join "`n")

# ─── 8. Bucket object verification ───────────────────────────────────────────
Write-Host "8. Bucket object count"
$objectList = docker exec bthwani-minio-local mc ls --recursive local/bthwani-media-local 2>&1 | Out-String
$objectCount = ($objectList -split "`n" | Where-Object { $_ -match '\S' }).Count
$bucketHasObjects = ($objectCount -gt 0) -or ($objectList -match 'smoke')
Record-Check "bucket_objects" "Bucket has objects after smoke" $bucketHasObjects "count~$objectCount"
Write-Evidence "08_bucket_objects" $objectList

# ─── 9. WLT reference-only guard ─────────────────────────────────────────────
Write-Host "9. WLT reference-only guard"
$wltLines = [System.Collections.Generic.List[string]]::new()
$wltClean = $true

$wltSrcPath = Join-Path $REPO_ROOT "wlt\backend"
if (Test-Path $wltSrcPath) {
    $goFiles = Get-ChildItem -Path $wltSrcPath -Recurse -Filter "*.go" | Where-Object { $_.Name -notmatch '_guard_test' }
    foreach ($f in $goFiles) {
        $content = Get-Content $f.FullName -Raw
        $rel = $f.FullName.Replace($REPO_ROOT.ToString(), '')
        foreach ($pattern in @('dsh_media_assets', 'dsh_local_password', 'dsh-postgres:5432')) {
            if ($content -match [regex]::Escape($pattern)) {
                $wltLines.Add("VIOLATION: $rel contains '$pattern'")
                $wltClean = $false
            }
        }
    }
}

$wltLines.Add($(if ($wltClean) { "WLT_REFERENCE_GUARD: CLEAN" } else { "WLT_REFERENCE_GUARD: VIOLATIONS_FOUND" }))
Record-Check "wlt_reference" "WLT reference-only guard clean" $wltClean
Write-Evidence "09_wlt_guard" ($wltLines -join "`n")

# ─── 10. Canonical media consistency ─────────────────────────────────────────
Write-Host "10. Canonical media consistency"
$canonLines = [System.Collections.Generic.List[string]]::new()
$canonClean = $true

$runtimeSurfaces = @('app-client', 'app-partner', 'app-captain', 'app-field')
foreach ($surface in $runtimeSurfaces) {
    $dir = Join-Path $REPO_ROOT "dsh\frontend\$surface"
    if (-not (Test-Path $dir)) { continue }
    $files = Get-ChildItem -Path $dir -Recurse -Include "*.ts","*.tsx" |
             Where-Object { $_.FullName -notmatch '(fixture|preview|storybook|demo|dev)' }
    foreach ($f in $files) {
        $content = Get-Content $f.FullName -Raw
        $rel = $f.FullName.Replace($REPO_ROOT.ToString(), '')
        if ($content -match "'/real-media-runtime/|`"/real-media-runtime/") {
            $canonLines.Add("HARDCODED_FIXTURE_URL: $rel")
            $canonClean = $false
        }
    }
}

$rowCountFinal = docker exec bthwani-dsh-postgres-local psql -U dsh_local -d dsh_local -tAc "SELECT COUNT(*) FROM dsh_media_assets;" 2>&1
$canonLines.Add("DSH_MEDIA_ASSETS_ROWS: $($rowCountFinal.Trim())")
$canonLines.Add($(if ($canonClean) { "CANONICAL_CONSISTENCY: CLEAN" } else { "CANONICAL_CONSISTENCY: VIOLATIONS_FOUND" }))
Record-Check "canonical_consistency" "No hardcoded fixture URLs in runtime surfaces" $canonClean
Write-Evidence "10_canonical_consistency" ($canonLines -join "`n")

# ─── 11. DEV fixture env guard ───────────────────────────────────────────────
Write-Host "11. DEV fixture env guard"
$fixtureEnv = docker exec bthwani-dsh-api-local env 2>&1 | Out-String
$devFixtureEnabled  = $fixtureEnv -match 'DSH_ENABLE_DEV_FIXTURE_MEDIA=true'
$mediaFixtureEnabled = $fixtureEnv -match 'DSH_ENABLE_MEDIA_FIXTURES=true'
Record-Check "env_dev_fixture"   "DSH_ENABLE_DEV_FIXTURE_MEDIA is NOT true (correct default)" (-not $devFixtureEnabled)
Record-Check "env_media_fixture" "DSH_ENABLE_MEDIA_FIXTURES is NOT true (correct default)"    (-not $mediaFixtureEnabled)
Write-Evidence "11_dev_fixture_env" "DEV_FIXTURE_MEDIA_ENABLED=$devFixtureEnabled`nMEDIA_FIXTURES_ENABLED=$mediaFixtureEnabled"

# ─── 12. Git diff summary ─────────────────────────────────────────────────────
Write-Host "12. Git diff"
Push-Location $REPO_ROOT
$gitStatus   = git --no-pager status --short 2>&1 | Out-String
$gitDiffStat = git --no-pager diff --stat 2>&1 | Out-String
$gitCheck    = git --no-pager diff --check 2>&1 | Out-String
$gitNameStatus = git --no-pager diff --name-status 2>&1 | Out-String
Pop-Location
Write-Evidence "12_git_status"      $gitStatus
Write-Evidence "12_git_diff_stat"   $gitDiffStat
Write-Evidence "12_git_diff_check"  $gitCheck
Write-Evidence "12_git_name_status" $gitNameStatus

# ─── 13. Final verdict ────────────────────────────────────────────────────────
$failedChecks = @($checks | Where-Object { -not $_.pass })
$allPassed    = ($failedChecks.Count -eq 0)

$summaryLines = $checks | ForEach-Object {
    $icon = if ($_.pass) { 'PASS' } else { 'FAIL' }
    "[$icon] $($_.id): $($_.label)$(if ($_.detail) { " — $($_.detail)" })"
}
$summaryText = $summaryLines -join "`n"
Write-Evidence "00_VERDICT_SUMMARY" $summaryText

Write-Host "`n=== VERDICT ==="
Write-Host $summaryText
Write-Host ""

if ($allPassed) {
    Write-Host "Decision: DONE"
    Write-Host "All checks passed. Media runtime closure verified."
} else {
    $failedList = ($failedChecks | ForEach-Object { $_.id }) -join ', '
    Write-Host "Decision: FIX_REQUIRED"
    Write-Host "Failed checks: $failedList"
    Write-Host "Run: docker compose -f docker-compose.local.yml up -d --build"
}

# ─── ZIP ──────────────────────────────────────────────────────────────────────
Write-Host "`nCreating ZIP: $ZIP_PATH"
Compress-Archive -Path "$RUN_DIR\*.txt" -DestinationPath $ZIP_PATH -Force
Write-Host "ZIP written: $ZIP_PATH"
Write-Host "Session:     $SESSION_ID"
