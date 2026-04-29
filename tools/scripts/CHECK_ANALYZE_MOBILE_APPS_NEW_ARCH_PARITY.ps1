Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_ANALYZE_MOBILE_APPS_NEW_ARCH_PARITY"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
$EvidenceFile = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

function Write-Evidence {
  param([string]$Text)
  $Text | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
}

function Add-Section {
  param([string]$Title)
  Write-Evidence ""
  Write-Evidence "============================================================"
  Write-Evidence "## $Title"
  Write-Evidence "============================================================"
}

function Read-AppJsonNewArch {
  param([string]$AppJsonPath)

  if (-not (Test-Path -LiteralPath $AppJsonPath)) {
    return "MISSING"
  }

  try {
    $json = Get-Content -LiteralPath $AppJsonPath -Raw | ConvertFrom-Json -Depth 100
    if ($null -eq $json.expo.newArchEnabled) {
      return "NOT_SET"
    }
    return [string]$json.expo.newArchEnabled
  } catch {
    return "INVALID_JSON"
  }
}

function Read-GradleNewArch {
  param([string]$GradlePropertiesPath)

  if (-not (Test-Path -LiteralPath $GradlePropertiesPath)) {
    return "MISSING"
  }

  $content = Get-Content -LiteralPath $GradlePropertiesPath -Raw

  if ($content -match "(?m)^\s*newArchEnabled\s*=\s*true\s*$") {
    return "true"
  }

  if ($content -match "(?m)^\s*newArchEnabled\s*=\s*false\s*$") {
    return "false"
  }

  return "NOT_SET"
}

Write-Evidence "SESSION_ID=$SessionId"
Write-Evidence "RUN_ROOT=$RunRoot"
Write-Evidence "ISSUE=Analyze New Architecture parity across mobile apps"
Write-Evidence "MODE=CHECK_ONLY_NO_APPLY"
Write-Evidence "PURPOSE=Decide later which apps need native New Architecture alignment and Dev Client rebuild."

$Apps = @(
  "app-client",
  "app-partner",
  "app-captain",
  "app-field"
)

$Results = @()

Add-Section "01 - Per-app New Architecture evidence"

foreach ($App in $Apps) {
  $AppRoot = "apps\mobile\$App"
  $AppJson = Join-Path $AppRoot "app.json"
  $AndroidDir = Join-Path $AppRoot "android"
  $GradleProps = Join-Path $AndroidDir "gradle.properties"

  $AppExists = Test-Path -LiteralPath $AppRoot
  $AndroidExists = Test-Path -LiteralPath $AndroidDir
  $AppJsonNewArch = Read-AppJsonNewArch -AppJsonPath $AppJson
  $GradleNewArch = Read-GradleNewArch -GradlePropertiesPath $GradleProps

  $NeedsNativeAlignment = $false
  $NeedsDevClientRebuild = $false
  $Status = "UNKNOWN"
  $Reason = ""

  if (-not $AppExists) {
    $Status = "MISSING_APP"
    $Reason = "App directory is missing."
  } elseif (-not $AndroidExists) {
    $Status = "MANAGED_OR_NO_NATIVE_ANDROID"
    $Reason = "No android directory detected; native gradle.properties parity is not applicable unless prebuild/native project exists."
  } else {
    if ($AppJsonNewArch -eq "true" -and $GradleNewArch -eq "true") {
      $Status = "NATIVE_NEW_ARCH_ALIGNED"
      $Reason = "app.json and android/gradle.properties both enable New Architecture."
    } elseif ($AppJsonNewArch -eq "true" -and $GradleNewArch -ne "true") {
      $Status = "BLOCKED_NATIVE_MISMATCH"
      $NeedsNativeAlignment = $true
      $Reason = "app.json enables New Architecture but native gradle.properties does not."
    } elseif ($AppJsonNewArch -ne "true" -and $GradleNewArch -eq "true") {
      $Status = "CONFIG_MISMATCH"
      $NeedsNativeAlignment = $true
      $Reason = "native gradle.properties enables New Architecture but app.json does not."
    } elseif ($AppJsonNewArch -eq "false" -and $GradleNewArch -eq "false") {
      $Status = "LEGACY_ARCH_CONSISTENT"
      $Reason = "Both config layers currently use Legacy Architecture."
    } else {
      $Status = "UNPROVEN_OR_NOT_SET"
      $Reason = "One or both config layers are missing or not explicitly set."
    }

    if ($GradleNewArch -eq "true") {
      $NeedsDevClientRebuild = $true
    }
  }

  $Results += [pscustomobject]@{
    App = $App
    AppExists = $AppExists
    AndroidExists = $AndroidExists
    AppJsonNewArch = $AppJsonNewArch
    GradleNewArch = $GradleNewArch
    Status = $Status
    NeedsNativeAlignment = $NeedsNativeAlignment
    NeedsDevClientRebuild = $NeedsDevClientRebuild
    Reason = $Reason
  }

  Write-Evidence ""
  Write-Evidence "APP=$App"
  Write-Evidence "APP_ROOT=$AppRoot"
  Write-Evidence "APP_EXISTS=$AppExists"
  Write-Evidence "ANDROID_DIR_EXISTS=$AndroidExists"
  Write-Evidence "APP_JSON_NEW_ARCH=$AppJsonNewArch"
  Write-Evidence "GRADLE_PROPERTIES_NEW_ARCH=$GradleNewArch"
  Write-Evidence "STATUS=$Status"
  Write-Evidence "NEEDS_NATIVE_ALIGNMENT=$NeedsNativeAlignment"
  Write-Evidence "NEEDS_DEV_CLIENT_REBUILD_IF_ADOPTED=$NeedsDevClientRebuild"
  Write-Evidence "REASON=$Reason"

  if (Test-Path -LiteralPath $AppJson) {
    Write-Evidence "--- app.json lines ---"
    Select-String -Path $AppJson -Pattern "newArchEnabled|sdkVersion|name|slug" -ErrorAction SilentlyContinue |
      ForEach-Object { Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()) }
  }

  if (Test-Path -LiteralPath $GradleProps) {
    Write-Evidence "--- gradle.properties lines ---"
    Select-String -Path $GradleProps -Pattern "newArchEnabled|hermesEnabled|reactNativeArchitectures" -ErrorAction SilentlyContinue |
      ForEach-Object { Write-Evidence ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()) }
  }
}

Add-Section "02 - Summary matrix"

$Results | ForEach-Object {
  Write-Evidence ("{0} | android={1} | app.json.newArch={2} | gradle.newArch={3} | status={4} | needsAlignment={5} | rebuildIfAdopted={6}" -f $_.App, $_.AndroidExists, $_.AppJsonNewArch, $_.GradleNewArch, $_.Status, $_.NeedsNativeAlignment, $_.NeedsDevClientRebuild)
}

Add-Section "03 - Git status"

git --no-pager status --short 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host

Add-Section "04 - Final status"

$Blocked = $Results | Where-Object { $_.Status -eq "BLOCKED_NATIVE_MISMATCH" -or $_.Status -eq "CONFIG_MISMATCH" }
$Missing = $Results | Where-Object { $_.Status -eq "MISSING_APP" }

Write-Evidence "APP_COUNT=$($Results.Count)"
Write-Evidence "MISMATCH_COUNT=$($Blocked.Count)"
Write-Evidence "MISSING_APP_COUNT=$($Missing.Count)"

if ($Blocked.Count -gt 0) {
  Write-Evidence "FINAL_STATUS=BLOCKED"
  Write-Evidence "ROOT_CAUSE=One or more mobile apps have New Architecture mismatch between app.json and android/gradle.properties."
  $Blocked | ForEach-Object {
    Write-Evidence ("BLOCKED_APP={0} STATUS={1} REASON={2}" -f $_.App, $_.Status, $_.Reason)
  }
} else {
  Write-Evidence "FINAL_STATUS=PASS"
  Write-Evidence "DECISION=Mobile apps New Architecture parity was analyzed without applying changes."
  Write-Evidence "NOTE=Do not rebuild non-app-client apps until a specific app needs New Architecture adoption or native dependency verification."
}

Write-Evidence ""
Write-Evidence "DONE"
Write-Evidence "EVIDENCE_FILE=$EvidenceFile"

Write-Host ""
Write-Host "DONE. Evidence file:" -ForegroundColor Green
Write-Host $EvidenceFile -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"
