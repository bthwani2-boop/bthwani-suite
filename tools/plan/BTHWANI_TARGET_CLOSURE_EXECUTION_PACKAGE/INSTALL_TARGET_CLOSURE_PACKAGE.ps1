param(
  [string]$RepoRoot = "C:\bthwani-suite",
  [string]$SourcePlanRoot = "",
  [switch]$NoBackup,
  [switch]$Strict,
  [switch]$QuarantineOldPackageFiles
)

$ErrorActionPreference = "Stop"
if ([string]::IsNullOrWhiteSpace($SourcePlanRoot)) {
  $SourcePlanRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
}

$TargetPlanRoot = Join-Path $RepoRoot "tools\plan\BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE"
$SessionId = "INSTALL_TARGET_CLOSURE_PACKAGE-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
$CommandLog = Join-Path $RunRoot "commands.log"
function Log($m) { Add-Content -LiteralPath $CommandLog -Value ("[{0}] {1}" -f (Get-Date -Format o), $m) -Encoding UTF8 }

$Results = New-Object System.Collections.Generic.List[object]
function Add-Result($Name, $Status, $Detail) {
  $Results.Add([pscustomobject]@{ name=$Name; status=$Status; detail=$Detail }) | Out-Null
}

try {
  Set-Location -LiteralPath $RepoRoot
  Log "Install source: $SourcePlanRoot"
  Log "Install target: $TargetPlanRoot"

  $ManifestPath = Join-Path $SourcePlanRoot "manifest.json"
  $ShaPath = Join-Path $SourcePlanRoot "SHA256SUMS.json"
  if (!(Test-Path -LiteralPath $ManifestPath)) { throw "Missing manifest.json in source: $SourcePlanRoot" }
  if (!(Test-Path -LiteralPath $ShaPath)) { throw "Missing SHA256SUMS.json in source: $SourcePlanRoot" }

  $Manifest = Get-Content -LiteralPath $ManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
  if ($Manifest.version -ne "6.0.0") { throw "Refusing to install non-V6 package. Found version: $($Manifest.version)" }
  Add-Result "source_manifest_version" "PASS" $Manifest.version

  $Sha = Get-Content -LiteralPath $ShaPath -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach ($prop in $Sha.PSObject.Properties) {
    $file = $prop.Name
    $expected = [string]$prop.Value
    $path = Join-Path $SourcePlanRoot $file
    if (!(Test-Path -LiteralPath $path)) { throw "Missing source file listed in SHA256SUMS: $file" }
    $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLowerInvariant()
    if ($actual -ne $expected.ToLowerInvariant()) { throw "SHA mismatch before install for $file" }
  }
  Add-Result "source_sha_verification" "PASS" "all listed files match"

  New-Item -ItemType Directory -Force -Path $TargetPlanRoot | Out-Null

  if ((Test-Path -LiteralPath $TargetPlanRoot) -and (-not $NoBackup)) {
    $BackupZip = Join-Path $RunRoot "tools-plan-backup-before-install.zip"
    Compress-Archive -Path (Join-Path $TargetPlanRoot "*") -DestinationPath $BackupZip -Force -ErrorAction SilentlyContinue
    Add-Result "backup_created" "PASS" $BackupZip
  }

  if ($QuarantineOldPackageFiles) {
    $QuarantineRoot = Join-Path $RunRoot "quarantined-old-package-files"
    New-Item -ItemType Directory -Force -Path $QuarantineRoot | Out-Null
    $manifestFiles = @($Manifest.files)
    $existing = Get-ChildItem -LiteralPath $TargetPlanRoot -File -ErrorAction SilentlyContinue
    foreach ($item in $existing) {
      $isManifest = $manifestFiles -contains $item.Name
      $looksLegacy = $item.Name -match "V1|V2|V3|OLD|BACKUP|DRAFT"
      $looksPackage = $item.Name -match "BTHWANI_TARGET_CLOSURE|TARGET_CLOSURE_PACKAGE|EXECUTION_PACKAGE"
      if ((-not $isManifest) -and ($looksLegacy -or $looksPackage)) {
        Move-Item -LiteralPath $item.FullName -Destination (Join-Path $QuarantineRoot $item.Name) -Force
        Add-Result "quarantined:$($item.Name)" "PASS" "moved to evidence quarantine"
      }
    }
  }

  foreach ($file in @($Manifest.files)) {
    $src = Join-Path $SourcePlanRoot $file
    $dst = Join-Path $TargetPlanRoot $file
    if (!(Test-Path -LiteralPath $src)) { throw "Missing source package file: $file" }
    Copy-Item -LiteralPath $src -Destination $dst -Force
    Add-Result "copied:$file" "PASS" $dst
  }

  $CheckScript = Join-Path $TargetPlanRoot "CHECK_TARGET_CLOSURE_PACKAGE.ps1"
  if (!(Test-Path -LiteralPath $CheckScript)) { throw "CHECK_TARGET_CLOSURE_PACKAGE.ps1 missing after install" }

  Log "Running package check after install"
  $strictArg = if ($Strict) { "-Strict" } else { "" }
  $checkOutput = & pwsh -NoProfile -ExecutionPolicy Bypass -File $CheckScript -RepoRoot $RepoRoot -PlanRoot $TargetPlanRoot $strictArg 2>&1 | Out-String
  Set-Content -LiteralPath (Join-Path $RunRoot "post-install-check-output.txt") -Value $checkOutput -Encoding UTF8
  if ($LASTEXITCODE -eq 0) {
    Add-Result "post_install_check" "PASS" "CHECK_TARGET_CLOSURE_PACKAGE.ps1 PASS"
  } else {
    Add-Result "post_install_check" "FAIL" "CHECK_TARGET_CLOSURE_PACKAGE.ps1 failed"
    throw "Post-install package check failed."
  }

  $Results | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8
  $summary = @"
status: PASS
package_version: 6.0.0
session_id: $SessionId
repo: $RepoRoot
source_plan_root: $SourcePlanRoot
target_plan_root: $TargetPlanRoot
strict: $Strict
quarantine_old_package_files: $QuarantineOldPackageFiles
decision: PACKAGE_ADOPTABLE_FOR_CONTROLLED_EXECUTION
"@
  Set-Content -LiteralPath (Join-Path $RunRoot "SUMMARY.txt") -Value $summary -Encoding UTF8

  $zipPath = Join-Path $RunRoot "$SessionId.zip"
  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $zipPath -Force

  Write-Host "RESULT: PASS"
  Write-Host "PACKAGE_VERSION: 6.0.0"
  Write-Host "SESSION_ID: $SessionId"
  Write-Host "EVIDENCE_ROOT: $RunRoot"
  Write-Host "ZIP: $zipPath"
  Write-Host "DECISION: PACKAGE_ADOPTABLE_FOR_CONTROLLED_EXECUTION"
  $Results | Format-Table -AutoSize
} catch {
  $err = $_.Exception.ToString()
  Set-Content -LiteralPath (Join-Path $RunRoot "ERROR.txt") -Value $err -Encoding UTF8
  Write-Host "RESULT: FAIL"
  Write-Host $err
  exit 1
}
