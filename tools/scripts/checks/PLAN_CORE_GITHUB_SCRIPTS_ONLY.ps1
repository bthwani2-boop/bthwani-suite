Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$IssueCode = "PLAN_CORE_GITHUB_SCRIPTS_ONLY"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RepoRoot = (Get-Location).Path
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"

New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

function To-Rel {
  param([Parameter(Mandatory=$true)][string]$FullPath)
  return ([System.IO.Path]::GetRelativePath($RepoRoot, $FullPath) -replace "\\","/")
}

function Add-Core {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Reason
  )

  $P = $Path -replace "\\","/"
  $Full = Join-Path $RepoRoot ($P -replace "/","\")
  if (Test-Path -LiteralPath $Full) {
    [void]$CoreSet.Add($P)
    $CoreReason[$P] = $Reason
  }
}

function Read-TextSafe {
  param([Parameter(Mandatory=$true)][string]$Path)
  try { return [System.IO.File]::ReadAllText($Path) } catch { return "" }
}

function Get-FirstEffectiveLine {
  param([Parameter(Mandatory=$true)][string]$Text)
  foreach ($Line in ($Text -split "`r?`n")) {
    $T = $Line.Trim()
    if ($T.Length -eq 0) { continue }
    if ($T.StartsWith("#")) { continue }
    return $T
  }
  return ""
}

function Test-CoreSafety {
  param([Parameter(Mandatory=$true)][string]$Path)

  $Full = Join-Path $RepoRoot ($Path -replace "/","\")
  if (-not (Test-Path -LiteralPath $Full)) { return "MISSING" }

  $Name = Split-Path -Leaf $Path
  $Text = Read-TextSafe -Path $Full
  $FirstLine = Get-FirstEffectiveLine -Text $Text

  if ($Path -like "*.ps1") {
    if ($FirstLine -notmatch '^Set-Location\s+-LiteralPath\s+"C:\\bthwani-suite"') {
      return "REJECT: missing canonical Set-Location first line"
    }
  }

  if ($Name -like "APPLY_*" -or $Name -like "FIX_*" -or $Name -like "REPAIR_*" -or $Name -like "REMOVE_*" -or $Name -like "PATCH_*" -or $Name -like "HOTFIX_*" -or $Name -like "WRITE_*" -or $Name -like "FORCE_*" -or $Name -like "RUN_*") {
    return "REJECT: write-capable or runtime/helper family"
  }

  if ($Name -like "*.bak*" -or $Name -like "*.tmp*" -or $Name -like "*.old*") {
    return "REJECT: backup/temp filename"
  }

  $DangerRegex = "\bRemove-Item\b[\s\S]{0,120}\b-Recurse\b[\s\S]{0,120}\b-Force\b|rm\s+-rf|git\s+(clean\s+-fd|reset\s+--hard|push\s+--force|push\s+-f)|Invoke-Expression|iwr[\s\S]{0,120}\|\s*iex|curl[\s\S]{0,120}\|\s*(sh|bash|powershell)"
  if ([regex]::IsMatch($Text, $DangerRegex, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
    return "REJECT: dangerous pattern"
  }

  return "PASS"
}

$CoreSet = New-Object "System.Collections.Generic.HashSet[string]"
$CoreReason = @{}

# Core docs and package.json referenced guards
Add-Core "tools/scripts/README.md" "documentation for tools/scripts"
Add-Core "tools/scripts/guard-central-i18n-direction.mjs" "used by package.json guard:i18n-direction"
Add-Core "tools/scripts/validate-agent-governance.mjs" "used by package.json guard:agent-governance"

# Governance / script governance
Add-Core "tools/scripts/checks/CHECK_SCRIPT_GOVERNANCE.ps1" "current script inventory/governance diagnostic"
Add-Core "tools/scripts/checks/PLAN_CORE_GITHUB_SCRIPTS_ONLY.ps1" "core script selection diagnostic"
Add-Core "tools/scripts/CHECK_AGENT_GOVERNANCE_KIT_INTAKE.ps1" "agent governance intake diagnostic"
Add-Core "tools/scripts/CHECK_ANALYZE_AI_AGENT_GITIGNORE_DRIFT.ps1" "AI agent gitignore drift diagnostic"
Add-Core "tools/scripts/CHECK_ANALYZE_GOVERNANCE_AUTOMATION_BASELINE.ps1" "governance automation baseline"
Add-Core "tools/scripts/CHECK_ANALYZE_GOVERNANCE_CONTROL_PLANE_DEEP.ps1" "governance control-plane deep diagnostic"

# Git / checkpoint / evidence safety
Add-Core "tools/scripts/CHECK_GIT_BRANCH_TRUTH_AND_CHECKPOINT_SAFETY.ps1" "branch truth and checkpoint safety"
Add-Core "tools/scripts/CHECK_VERIFY_PACKAGES_CLOSURE_FINAL.ps1" "packages closure verification"
Add-Core "tools/scripts/CHECK_VERIFY_TYPESCRIPT_AFTER_PATH_SEAL.ps1" "TypeScript verification after path seal"
Add-Core "tools/scripts/CHECK_ANALYZE_TS_RISK_MARKERS_LOCATIONS.ps1" "TypeScript risk marker locations"
Add-Core "tools/scripts/CHECK_ANALYZE_TS5090_BASEURL_PATHS.ps1" "TS5090/baseUrl path diagnostic"
Add-Core "tools/scripts/CHECK_PLAN_TS_FIX_LANES_CURRENT.ps1" "current TS fix lane planning"

# UI Kit canonical governance
Add-Core "tools/scripts/CHECK_ANALYZE_UI_KIT_STRUCTURAL_CANONICALITY_V5.ps1" "UI Kit structural canonicality latest selected version"
Add-Core "tools/scripts/CHECK_ANALYZE_UIKIT_DEEP_DIR_RETIREMENT_PLAN.ps1" "UI Kit deep directory retirement plan"
Add-Core "tools/scripts/CHECK_ANALYZE_UIKIT_FAMILY_CONSOLIDATION_MAP.ps1" "UI Kit family consolidation map"
Add-Core "tools/scripts/CHECK_ANALYZE_UIKIT_LIVE_SCREEN_BREAKAGE_GUARD.ps1" "UI Kit live screen breakage guard"
Add-Core "tools/scripts/CHECK_ANALYZE_UIKIT_PUBLIC_EXPORT_BRIDGE_SOURCES.ps1" "UI Kit public export bridge source diagnostic"
Add-Core "tools/scripts/CHECK_ANALYZE_UIKIT_ORPHAN_SOURCE_CANDIDATES.ps1" "UI Kit orphan source candidates"
Add-Core "tools/scripts/CHECK_ANALYZE_UIKIT_PRIMITIVES_TAMAGUI_SCOPE.ps1" "UI Kit primitives Tamagui scope"
Add-Core "tools/scripts/CHECK_ANALYZE_UIKIT_TAMAGUI_ADOPTION_READINESS.ps1" "UI Kit Tamagui adoption readiness"
Add-Core "tools/scripts/CHECK_ANALYZE_UIKIT_TAMAGUI_HARDENING.ps1" "UI Kit Tamagui hardening"
Add-Core "tools/scripts/CHECK_VERIFY_UIKIT_FAMILY_OWNER_CLOSURE.ps1" "UI Kit family owner closure"
Add-Core "tools/scripts/CHECK_VERIFY_UIKIT_FINAL_STRUCTURE_CLOSURE.ps1" "UI Kit final structure closure"
Add-Core "tools/scripts/CHECK_VERIFY_UIKIT_LEAN_TYPE_CONTRACT.ps1" "UI Kit lean type contract"
Add-Core "tools/scripts/CHECK_VERIFY_UIKIT_POST_DELETE_CLEANUP_GUARD.ps1" "UI Kit post-delete cleanup guard"
Add-Core "tools/scripts/CHECK_VERIFY_UIKIT_PUBLIC_API_BOUNDARY_GUARD_V3.ps1" "latest UI Kit public API boundary guard"
Add-Core "tools/scripts/CHECK_VERIFY_UIKIT_TYPE_CONTRACT_GUARD.ps1" "UI Kit type contract guard"

# Tamagui core
Add-Core "tools/scripts/CHECK_ANALYZE_TAMAGUI_REPO_READINESS.ps1" "Tamagui repo readiness"
Add-Core "tools/scripts/CHECK_ANALYZE_TAMAGUI_BOOTSTRAP_STATE.ps1" "Tamagui bootstrap state"
Add-Core "tools/scripts/CHECK_ANALYZE_TAMAGUI_IMPORT_BOUNDARY_FAST.ps1" "Tamagui import boundary fast guard"
Add-Core "tools/scripts/CHECK_ANALYZE_TAMAGUI_GUARD_GIT_VISIBILITY.ps1" "Tamagui guard Git visibility"
Add-Core "tools/scripts/CHECK_ANALYZE_TAMAGUI_POST_LOCK_WORKTREE_DRIFT.ps1" "Tamagui post-lock worktree drift"
Add-Core "tools/scripts/CHECK_TAMAGUI_RULE_CHAIN_V2.ps1" "latest Tamagui rule chain"

# Web / mobile boundary and runtime diagnostics
Add-Core "tools/scripts/CHECK_FORENSICS_WEB_MOBILE_BOUNDARY.ps1" "web/mobile boundary forensics"
Add-Core "tools/scripts/CHECK_DEEP_APP_BROWSING_READINESS_UIKIT_SURFACES.ps1" "app browsing readiness across UI Kit/surfaces"
Add-Core "tools/scripts/CHECK_ANALYZE_MOBILE_APPS_NEW_ARCH_PARITY.ps1" "mobile apps new architecture parity"
Add-Core "tools/scripts/CHECK_ANALYZE_SAFE_AREA_CONTEXT_MODULE_RESOLUTION.ps1" "safe-area-context module resolution"
Add-Core "tools/scripts/CHECK_ANALYZE_SAFE_AREA_VIEW_DEPRECATION.ps1" "safe area view deprecation diagnostic"
Add-Core "tools/scripts/CHECK_VERIFY_CONTROL_PANEL_NEXT_BUILD_AFTER_PATH_SEAL.ps1" "control-panel Next build verification"
Add-Core "tools/scripts/VERIFY_APP_CLIENT_NEW_DEV_BUILD_INSTALLED.ps1" "app-client dev build installed verification"
Add-Core "tools/scripts/VERIFY_SEAL_APP_CLIENT_SURFACES_ENTRYPOINT_BOUNDARY_V2.ps1" "latest app-client surfaces entrypoint boundary verification"

# DSH selected core checks
Add-Core "tools/scripts/CHECK_DSH_APP_CLIENT_UI_UX_FLOW_CLOSURE.ps1" "DSH app-client UI/UX/flow closure"
Add-Core "tools/scripts/CHECK_DSH_APP_CLIENT_BLOCKERS_BREAKDOWN.ps1" "DSH app-client blockers breakdown"
Add-Core "tools/scripts/CHECK_ANALYZE_DSH_STORE_GET_JSX_UNDEFINED_FAST.ps1" "DSH store JSX undefined fast diagnostic"

# App-client/support selected diagnostics
Add-Core "tools/scripts/CHECK_ANALYZE_APP_CLIENT_DEV_RUNTIME_CLOSURE.ps1" "app-client dev runtime closure"
Add-Core "tools/scripts/CHECK_ANALYZE_APP_CLIENT_METRO_BUNDLE_500_FORENSICS.ps1" "app-client Metro 500 forensics"
Add-Core "tools/scripts/CHECK_ANALYZE_CLIENT_SURFACEHOST_EXPORT_CHAIN_V2.ps1" "client SurfaceHost export chain latest selected version"
Add-Core "tools/scripts/CHECK_CLIENT_SURFACE_HOST_RENDER_ERROR_V2.ps1" "client SurfaceHost render error latest selected version"
Add-Core "tools/scripts/CHECK_RENDER_ERROR_CLIENT_SURFACE_HOST_DEEP.ps1" "client SurfaceHost deep render error diagnostic"
Add-Core "tools/scripts/CHECK_RTL_DOUBLE_DIRECTION_ROOT_CAUSE.ps1" "RTL double direction root cause"

$AllScriptFiles = Get-ChildItem -LiteralPath ".\tools\scripts" -Recurse -File -Force |
  ForEach-Object { To-Rel $_.FullName } |
  Sort-Object

$CoreRows = New-Object System.Collections.Generic.List[object]
$RejectedCoreRows = New-Object System.Collections.Generic.List[object]

foreach ($Path in ($CoreSet | Sort-Object)) {
  $Safety = Test-CoreSafety -Path $Path
  if ($Safety -eq "PASS" -or $Path -like "*.mjs" -or $Path -like "*.md") {
    $CoreRows.Add([pscustomobject]@{
      Path = $Path
      Reason = $CoreReason[$Path]
      Safety = $Safety
      Exists = Test-Path -LiteralPath (Join-Path $RepoRoot ($Path -replace "/","\"))
    }) | Out-Null
  } else {
    $RejectedCoreRows.Add([pscustomobject]@{
      Path = $Path
      Reason = $CoreReason[$Path]
      Safety = $Safety
    }) | Out-Null
  }
}

$FinalCoreSet = New-Object "System.Collections.Generic.HashSet[string]"
foreach ($R in $CoreRows) { [void]$FinalCoreSet.Add($R.Path) }

$DeleteRows = New-Object System.Collections.Generic.List[object]
foreach ($Path in $AllScriptFiles) {
  if (-not $FinalCoreSet.Contains($Path)) {
    $DeleteRows.Add([pscustomobject]@{
      Path = $Path
      Reason = "not in strict CORE_KEEP list"
      Exists = Test-Path -LiteralPath (Join-Path $RepoRoot ($Path -replace "/","\"))
    }) | Out-Null
  }
}

$CoreCsv = Join-Path $EvidenceRoot "CORE_KEEP-scripts.csv"
$DeleteCsv = Join-Path $EvidenceRoot "CORE_DELETE-candidates.csv"
$StageTxt = Join-Path $EvidenceRoot "CORE_STAGE-scripts.txt"
$RejectedCsv = Join-Path $EvidenceRoot "CORE_REJECTED-selected-but-unsafe.csv"
$StatusFile = Join-Path $EvidenceRoot "git-status-before-core-apply.txt"
$Summary = Join-Path $EvidenceRoot "SUMMARY.md"

$CoreRows | Sort-Object Path | Export-Csv -LiteralPath $CoreCsv -NoTypeInformation -Encoding UTF8
$DeleteRows | Sort-Object Path | Export-Csv -LiteralPath $DeleteCsv -NoTypeInformation -Encoding UTF8
$RejectedCoreRows | Sort-Object Path | Export-Csv -LiteralPath $RejectedCsv -NoTypeInformation -Encoding UTF8
$CoreRows.Path | Sort-Object | Set-Content -LiteralPath $StageTxt -Encoding UTF8
git --no-pager status --short | Set-Content -LiteralPath $StatusFile -Encoding UTF8

$SummaryLines = @()
$SummaryLines += "# $IssueCode"
$SummaryLines += ""
$SummaryLines += "Status: PLAN_ONLY"
$SummaryLines += "EvidenceRoot: $EvidenceRoot"
$SummaryLines += ""
$SummaryLines += "Core keep count: $($CoreRows.Count)"
$SummaryLines += "Delete candidate count: $($DeleteRows.Count)"
$SummaryLines += "Rejected selected core count: $($RejectedCoreRows.Count)"
$SummaryLines += ""
$SummaryLines += "Outputs:"
$SummaryLines += "- CORE_KEEP-scripts.csv"
$SummaryLines += "- CORE_DELETE-candidates.csv"
$SummaryLines += "- CORE_STAGE-scripts.txt"
$SummaryLines += "- CORE_REJECTED-selected-but-unsafe.csv"
$SummaryLines += "- git-status-before-core-apply.txt"
$SummaryLines | Set-Content -LiteralPath $Summary -Encoding UTF8

Write-Host "PLAN_ONLY complete"
Write-Host "EvidenceRoot: $EvidenceRoot"
Write-Host "Core keep count: $($CoreRows.Count)"
Write-Host "Delete candidate count: $($DeleteRows.Count)"
Write-Host "Rejected selected core count: $($RejectedCoreRows.Count)"
Write-Host "Open:"
Write-Host $Summary
