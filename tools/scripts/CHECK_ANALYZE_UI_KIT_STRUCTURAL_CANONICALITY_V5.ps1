Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

function Ensure-Directory {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Write-Utf8File {
  param(
    [string]$Path,
    [string]$Content
  )
  $dir = Split-Path -Parent $Path
  if ($dir) { Ensure-Directory -Path $dir }
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Get-ExportsFromFile {
  param([string]$Path)
  $result = New-Object System.Collections.Generic.List[string]
  foreach ($line in (Get-Content -LiteralPath $Path)) {
    $trim = $line.Trim()
    if ($trim -like "export * from*") {
      $parts = $trim -split "'"
      if ($parts.Count -ge 2) {
        $result.Add($parts[1]) | Out-Null
      }
    }
  }
  return @($result)
}

$IssueCode = "UIKIT_STRUCTURAL_CANONICALITY_V5"
$RepoRoot  = (Get-Location).Path
$StartTime = Get-Date
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, $StartTime
$RunRoot   = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

Ensure-Directory -Path $RunRoot

$SummaryPath      = Join-Path $RunRoot "summary.txt"
$FactsJsonPath    = Join-Path $RunRoot "facts.json"
$EvidenceJsonPath = Join-Path $RunRoot "evidence.json"

$UiKitRoot = Join-Path $RepoRoot "packages\ui-kit"
$SrcRoot   = Join-Path $UiKitRoot "src"

$Paths = [ordered]@{
  PackageJson       = Join-Path $UiKitRoot "package.json"
  ProjectJson       = Join-Path $UiKitRoot "project.json"
  Readme            = Join-Path $UiKitRoot "README.md"
  Index             = Join-Path $SrcRoot "index.ts"
  AdaptersIndex     = Join-Path $SrcRoot "adapters\index.ts"
  RootIndex         = Join-Path $SrcRoot "root\index.ts"
  CoreIndex         = Join-Path $SrcRoot "components\core\index.ts"
  LabCatalog        = Join-Path $SrcRoot "lab\catalog.ts"
  WebEntry          = Join-Path $SrcRoot "web.ts"
  MobileEntry       = Join-Path $SrcRoot "mobile.ts"
  NextEntry         = Join-Path $SrcRoot "next.ts"
  WebAdaptersFolder = Join-Path $SrcRoot "adapters\web"
}

$checks = New-Object System.Collections.Generic.List[object]

function Add-Check {
  param(
    [string]$Id,
    [string]$Severity,
    [bool]$Passed,
    [string]$Summary,
    [string]$Evidence,
    [string]$Recommendation
  )

  $status = "FAIL"
  if ($Passed) { $status = "PASS" }

  $checks.Add([pscustomobject]@{
    id             = $Id
    severity       = $Severity
    passed         = $Passed
    status         = $status
    summary        = $Summary
    evidence       = $Evidence
    recommendation = $Recommendation
  }) | Out-Null
}

$missingRequired = New-Object System.Collections.Generic.List[string]
foreach ($kv in $Paths.GetEnumerator()) {
  if ($kv.Key -in @("MobileEntry","NextEntry","WebAdaptersFolder")) { continue }
  if (-not (Test-Path -LiteralPath $kv.Value)) {
    $missingRequired.Add($kv.Key + " => " + $kv.Value) | Out-Null
  }
}

$facts = [ordered]@{
  repoRoot        = $RepoRoot
  uiKitRoot       = $UiKitRoot
  missingRequired = @($missingRequired)
}

if ($missingRequired.Count -gt 0) {
  Add-Check -Id "REQUIRED_INPUTS" -Severity "critical" -Passed $false -Summary "Required ui-kit audit inputs are missing." -Evidence ((@($missingRequired)) -join "; ") -Recommendation "Restore the required ui-kit files before structural auditing."
}
else {
  $packageJson = Get-Content -LiteralPath $Paths.PackageJson -Raw | ConvertFrom-Json
  $projectJson = Get-Content -LiteralPath $Paths.ProjectJson -Raw | ConvertFrom-Json
  $readmeText  = Get-Content -LiteralPath $Paths.Readme -Raw
  $labText     = Get-Content -LiteralPath $Paths.LabCatalog -Raw

  $topLayerDirs = @(
    Get-ChildItem -LiteralPath $SrcRoot -Directory |
    Sort-Object Name |
    Select-Object -ExpandProperty Name
  )

  $expectedTopLayers = @("foundation","providers","hooks","primitives","states","components","patterns")
  $missingExpectedTopLayers = @($expectedTopLayers | Where-Object { $_ -notin $topLayerDirs })

  $publicRootExports = Get-ExportsFromFile -Path $Paths.Index
  $rootExports       = Get-ExportsFromFile -Path $Paths.RootIndex
  $coreExports       = Get-ExportsFromFile -Path $Paths.CoreIndex
  $webEntryExports   = Get-ExportsFromFile -Path $Paths.WebEntry

  $exportsMap = @{}
  if ($packageJson.exports) {
    foreach ($property in $packageJson.exports.PSObject.Properties) {
      $exportsMap[$property.Name] = [string]$property.Value
    }
  }

  $peerDependenciesMap = @{}
  if ($packageJson.peerDependencies) {
    foreach ($property in $packageJson.peerDependencies.PSObject.Properties) {
      $peerDependenciesMap[$property.Name] = [string]$property.Value
    }
  }

  $nextImportHits = @(
    Get-ChildItem -LiteralPath $SrcRoot -Recurse -File |
    Where-Object { $_.Extension -in @(".ts",".tsx") } |
    Select-String -Pattern "next/" -List |
    ForEach-Object { $_.Path }
  )

  $adapterNamingFailures = @()
  if (Test-Path -LiteralPath $Paths.WebAdaptersFolder) {
    $adapterNamingFailures = @(
      Get-ChildItem -LiteralPath $Paths.WebAdaptersFolder -File -Filter *.tsx |
      Where-Object { $_.BaseName -match "Frame|Card|Page|Tabs|Strip|Shell|Hero|Rail|Section" } |
      ForEach-Object { $_.FullName.Replace($RepoRoot + "\", "") }
    )
  }

  $missingTargetScripts = @()
  if ($projectJson.targets) {
    foreach ($property in $projectJson.targets.PSObject.Properties) {
      $command = [string]$property.Value.command
      if ([string]::IsNullOrWhiteSpace($command)) { continue }
      $m = [regex]::Match($command, 'tools/scripts/[^\s"]+')
      if ($m.Success) {
        $rel = $m.Value
        $abs = Join-Path $RepoRoot ($rel -replace '/', '\')
        if (-not (Test-Path -LiteralPath $abs)) {
          $missingTargetScripts += ($property.Name + " => " + $rel)
        }
      }
    }
  }

  $proofRefs = @()
  foreach ($text in @($readmeText, $labText)) {
    foreach ($m in [regex]::Matches($text, 'docs/generated/[A-Za-z0-9._/\-]+')) {
      $proofRefs += $m.Value
    }
  }
  $proofRefs = @($proofRefs | Sort-Object -Unique)

  $missingProofRefs = @()
  foreach ($ref in $proofRefs) {
    $abs = Join-Path $UiKitRoot ($ref -replace '/', '\')
    if (-not (Test-Path -LiteralPath $abs)) {
      $missingProofRefs += $ref
    }
  }

  $passed = ($missingExpectedTopLayers.Count -eq 0)
  $summary = "One or more expected base ui-kit layers are missing."
  $evidence = "Missing: " + ($missingExpectedTopLayers -join ", ")
  if ($passed) {
    $summary = "Expected base ui-kit layers exist."
    $evidence = "Found all expected base layers."
  }
  Add-Check -Id "LAYERS_EXPECTED_PRESENT" -Severity "critical" -Passed $passed -Summary $summary -Evidence $evidence -Recommendation "Keep all required base layers present."

  $rootLeaksPlatform = ($publicRootExports -contains "./adapters") -or ($publicRootExports -contains "./root")
  $passed = (-not $rootLeaksPlatform)
  $summary = "Main public entrypoint leaks adapters/root."
  if ($passed) { $summary = "Main public entrypoint is neutral." }
  Add-Check -Id "PUBLIC_ROOT_NEUTRALITY" -Severity "critical" -Passed $passed -Summary $summary -Evidence ($publicRootExports -join ", ") -Recommendation "Remove adapters/root from src/index.ts."

  $rootMixesPlatforms = ($rootExports -contains "./web/BthWebRootLayout") -and ($rootExports -contains "./mobile/BthMobileRoot")
  $passed = (-not $rootMixesPlatforms)
  $summary = "root/index.ts mixes web and mobile roots."
  if ($passed) { $summary = "root/index.ts does not mix web and mobile roots." }
  Add-Check -Id "ROOT_ENTRY_SPLIT" -Severity "critical" -Passed $passed -Summary $summary -Evidence ($rootExports -join ", ") -Recommendation "Split root entrypoints by platform."

  $hasMobileExport = $exportsMap.ContainsKey("./mobile") -or (Test-Path -LiteralPath $Paths.MobileEntry)
  $hasNextExport   = $exportsMap.ContainsKey("./next") -or (Test-Path -LiteralPath $Paths.NextEntry)
  $peerHasNext     = $peerDependenciesMap.ContainsKey("next")
  $frameworkEvidence = @()
  $frameworkBoundaryPass = $true

  if ($nextImportHits.Count -gt 0 -and -not $hasNextExport) {
    $frameworkBoundaryPass = $false
    $frameworkEvidence += "next imports exist but ./next export is missing"
  }
  if ($nextImportHits.Count -gt 0 -and -not $peerHasNext) {
    $frameworkBoundaryPass = $false
    $frameworkEvidence += "next imports exist but next peerDependency is missing"
  }
  if (-not $hasMobileExport) {
    $frameworkBoundaryPass = $false
    $frameworkEvidence += "./mobile export is missing"
  }

  $summary = "Framework/platform boundaries are incomplete or leaking."
  if ($frameworkBoundaryPass) { $summary = "Framework/platform boundaries are explicit." }
  Add-Check -Id "FRAMEWORK_PLATFORM_BOUNDARIES" -Severity "critical" -Passed $frameworkBoundaryPass -Summary $summary -Evidence ($frameworkEvidence -join "; ") -Recommendation "Add explicit mobile/next boundaries and peer declaration."

  $passed = ($adapterNamingFailures.Count -eq 0)
  $summary = "adapters\web contains files that look like patterns/shells/pages, not thin adapters."
  if ($passed) { $summary = "adapters\web naming looks thin." }
  Add-Check -Id "ADAPTERS_THINNESS" -Severity "major" -Passed $passed -Summary $summary -Evidence ($adapterNamingFailures -join "; ") -Recommendation "Move page/frame/card/shell-style files out of adapters."

  $devExportLeak = ($coreExports -contains "./DevFloatingActions")
  $passed = (-not $devExportLeak)
  $summary = "Public core export leaks DevFloatingActions."
  if ($passed) { $summary = "Public core export is free from dev-only export leakage." }
  Add-Check -Id "DEV_EXPORT_PURITY" -Severity "major" -Passed $passed -Summary $summary -Evidence ($coreExports -join ", ") -Recommendation "Remove dev-only exports from production API."

  $passed = ($missingTargetScripts.Count -eq 0)
  $summary = "One or more ui-kit project targets point to missing scripts."
  if ($passed) { $summary = "All ui-kit targets resolve to existing scripts." }
  Add-Check -Id "TARGET_INTEGRITY" -Severity "critical" -Passed $passed -Summary $summary -Evidence ($missingTargetScripts -join "; ") -Recommendation "Create missing scripts or remove invalid targets."

  $passed = ($missingProofRefs.Count -eq 0)
  $summary = "README/lab declare generated proof artifacts that do not exist."
  if ($passed) { $summary = "Declared generated proof artifacts exist." }
  Add-Check -Id "PROOF_CLAIM_INTEGRITY" -Severity "critical" -Passed $passed -Summary $summary -Evidence ($missingProofRefs -join "; ") -Recommendation "Do not claim generated artifacts unless they exist."

  $webEntryMixesLayoutAndWidgets = ($webEntryExports -contains "./root/web/BthWebRootLayout") -and ((@($webEntryExports | Where-Object { $_ -like "./adapters/web/*" })).Count -gt 0)
  $passed = (-not $webEntryMixesLayoutAndWidgets)
  $summary = "web.ts mixes root integration with adapter/widget exports."
  if ($passed) { $summary = "web.ts is cohesive." }
  Add-Check -Id "WEB_ENTRY_COHESION" -Severity "major" -Passed $passed -Summary $summary -Evidence ($webEntryExports -join ", ") -Recommendation "Separate web root integration from web widgets/patterns."

  $passed = ($readmeText -match "Phase 06 authorizes foundation hardening")
  $summary = "README does not state phase-boundary discipline."
  if ($passed) { $summary = "README still records phase-boundary discipline." }
  Add-Check -Id "README_PHASE_DISCIPLINE" -Severity "info" -Passed $passed -Summary $summary -Evidence "README scan completed." -Recommendation "Keep phase-boundary law explicit."

  $preSelfCount = $checks.Count
  $selfPassed = ($preSelfCount -ge 9)
  $selfSummary = "Audit self-integrity failed. Too few checks were registered."
  if ($selfPassed) { $selfSummary = "Audit self-integrity passed." }
  Add-Check -Id "AUDIT_SELF_INTEGRITY" -Severity "critical" -Passed $selfPassed -Summary $selfSummary -Evidence ("checks.count.beforeSelf=" + $preSelfCount) -Recommendation "Reject any PASS where expected checks were not registered."

  $facts.topLayerDirs         = $topLayerDirs
  $facts.publicRootExports    = $publicRootExports
  $facts.rootExports          = $rootExports
  $facts.coreExports          = $coreExports
  $facts.webEntryExports      = $webEntryExports
  $facts.exportsMap           = $exportsMap
  $facts.peerDependenciesMap  = $peerDependenciesMap
  $facts.nextImportHits       = $nextImportHits
  $facts.adapterNamingFails   = $adapterNamingFailures
  $facts.missingTargetScripts = $missingTargetScripts
  $facts.proofRefs            = $proofRefs
  $facts.missingProofRefs     = $missingProofRefs
}

$criticalFails = @($checks | Where-Object { $_.severity -eq "critical" -and -not $_.passed })
$majorFails    = @($checks | Where-Object { $_.severity -eq "major" -and -not $_.passed })
$infoFails     = @($checks | Where-Object { $_.severity -eq "info"  -and -not $_.passed })
$allFails      = @($checks | Where-Object { -not $_.passed })

$verdict = "PASS"
if ($criticalFails.Count -gt 0) {
  $verdict = "FAIL"
}
elseif ($majorFails.Count -gt 0) {
  $verdict = "WARN"
}

$canonicalReady = ($criticalFails.Count -eq 0 -and $majorFails.Count -eq 0)

$summaryLines = @()
$summaryLines += "CHECK_ANALYZE_UI_KIT_STRUCTURAL_CANONICALITY_V5"
$summaryLines += "SESSION_ID: $SessionId"
$summaryLines += "REPO      : $RepoRoot"
$summaryLines += "RUN_ROOT  : $RunRoot"
$summaryLines += ""
$summaryLines += "RESULT    : $verdict"
if ($canonicalReady) {
  $summaryLines += "CANONICAL : YES"
}
else {
  $summaryLines += "CANONICAL : NO"
}
$summaryLines += ("COUNTS    : total={0}; failed={1}; critical_failed={2}; major_failed={3}; info_failed={4}" -f $checks.Count, $allFails.Count, $criticalFails.Count, $majorFails.Count, $infoFails.Count)
$summaryLines += ""
$summaryLines += "TOP FINDINGS"

if ($allFails.Count -eq 0) {
  $summaryLines += "  - No structural canonicality violations detected by this script."
}
else {
  foreach ($item in ($allFails | Select-Object -First 12)) {
    $summaryLines += ("  - [{0}/{1}] {2}" -f $item.severity.ToUpperInvariant(), $item.id, $item.summary)
    if (-not [string]::IsNullOrWhiteSpace($item.evidence)) {
      $summaryLines += ("    evidence: " + $item.evidence)
    }
  }
}

$summaryLines += ""
$summaryLines += "ARTIFACTS"
$summaryLines += ("  - " + $SummaryPath)
$summaryLines += ("  - " + $FactsJsonPath)
$summaryLines += ("  - " + $EvidenceJsonPath)
$summaryLines += ""
$summaryLines += "DECISION"

if ($criticalFails.Count -gt 0) {
  $summaryLines += "  - BLOCKED. Critical structural issues exist. APPLY closure must target those exact failures only."
}
elseif ($majorFails.Count -gt 0) {
  $summaryLines += "  - PARTIAL. Critical checks passed, but major ownership/boundary corrections are still required before final seal."
}
else {
  $summaryLines += "  - PASS. Structural canonicality is clean for the scope covered by this script."
}

$evidence = [ordered]@{
  issueCode      = $IssueCode
  sessionId      = $SessionId
  repoRoot       = $RepoRoot
  uiKitRoot      = $UiKitRoot
  startedAt      = $StartTime.ToString("o")
  finishedAt     = (Get-Date).ToString("o")
  result         = $verdict
  canonicalReady = $canonicalReady
  counts         = [ordered]@{
    totalChecks         = $checks.Count
    totalFailed         = $allFails.Count
    criticalFailedCount = $criticalFails.Count
    majorFailedCount    = $majorFails.Count
    infoFailedCount     = $infoFails.Count
  }
  checks = $checks
}

Write-Utf8File -Path $SummaryPath      -Content ($summaryLines -join [Environment]::NewLine)
Write-Utf8File -Path $FactsJsonPath    -Content ($facts    | ConvertTo-Json -Depth 100)
Write-Utf8File -Path $EvidenceJsonPath -Content ($evidence | ConvertTo-Json -Depth 100)

Write-Host ""
Write-Host "CHECK_ANALYZE_UI_KIT_STRUCTURAL_CANONICALITY_V5"
Write-Host ("SESSION_ID: " + $SessionId)
Write-Host ("REPO      : " + $RepoRoot)
Write-Host ("RUN_ROOT  : " + $RunRoot)
Write-Host ""
Write-Host ("RESULT    : " + $verdict)
if ($canonicalReady) {
  Write-Host "CANONICAL : YES"
}
else {
  Write-Host "CANONICAL : NO"
}
Write-Host ("COUNTS    : total={0}; failed={1}; critical_failed={2}; major_failed={3}; info_failed={4}" -f $checks.Count, $allFails.Count, $criticalFails.Count, $majorFails.Count, $infoFails.Count)
Write-Host ""
Write-Host "TOP FINDINGS"
if ($allFails.Count -eq 0) {
  Write-Host "  - No structural canonicality violations detected by this script."
}
else {
  foreach ($item in ($allFails | Select-Object -First 12)) {
    Write-Host ("  - [{0}/{1}] {2}" -f $item.severity.ToUpperInvariant(), $item.id, $item.summary)
    if (-not [string]::IsNullOrWhiteSpace($item.evidence)) {
      Write-Host ("    evidence: " + $item.evidence)
    }
  }
}
Write-Host ""
Write-Host "ARTIFACTS"
Write-Host ("  - " + $SummaryPath)
Write-Host ("  - " + $FactsJsonPath)
Write-Host ("  - " + $EvidenceJsonPath)
Write-Host ""
Write-Host "DECISION"
if ($criticalFails.Count -gt 0) {
  Write-Host "  - BLOCKED. Critical structural issues exist. APPLY closure must target those exact failures only."
}
elseif ($majorFails.Count -gt 0) {
  Write-Host "  - PARTIAL. Critical checks passed, but major ownership/boundary corrections are still required before final seal."
}
else {
  Write-Host "  - PASS. Structural canonicality is clean for the scope covered by this script."
}
