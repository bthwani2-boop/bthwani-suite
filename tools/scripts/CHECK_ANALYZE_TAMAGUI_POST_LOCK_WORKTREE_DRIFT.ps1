Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "CHECK_ANALYZE_TAMAGUI_POST_LOCK_WORKTREE_DRIFT"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
$EvidenceFile = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"
$SummaryFile = Join-Path $RunRoot "SUMMARY.md"
$ClassificationFile = Join-Path $RunRoot "worktree-classification.tsv"
$StatusFile = Join-Path $RunRoot "status.txt"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$FinalStatus = "UNKNOWN"
$Decision = "UNKNOWN"
$RootCause = ""

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

function Set-Final {
  param(
    [string]$Status,
    [string]$DecisionText,
    [string]$Cause = ""
  )

  $script:FinalStatus = $Status
  $script:Decision = $DecisionText
  $script:RootCause = $Cause
}

function Get-ProjectFilesFast {
  param(
    [string[]]$Roots,
    [string[]]$Extensions,
    [string[]]$ExtraFiles = @()
  )

  $ExcludedDirNames = @(
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    ".expo",
    ".turbo",
    ".nx",
    ".git",
    ".gradle",
    ".idea",
    ".vscode",
    "android",
    "ios"
  )

  $Result = New-Object System.Collections.Generic.List[System.IO.FileInfo]
  $Stack = New-Object System.Collections.Generic.Stack[string]

  foreach ($Root in $Roots) {
    $FullRoot = Join-Path (Get-Location).Path $Root
    if (Test-Path -LiteralPath $FullRoot) {
      $Stack.Push($FullRoot)
    }
  }

  while ($Stack.Count -gt 0) {
    $Current = $Stack.Pop()
    $DirName = Split-Path -Leaf $Current

    if ($ExcludedDirNames -contains $DirName) {
      continue
    }

    foreach ($File in Get-ChildItem -LiteralPath $Current -File -ErrorAction SilentlyContinue) {
      if ($Extensions -contains $File.Extension.ToLowerInvariant()) {
        $Result.Add($File)
      }
    }

    foreach ($Dir in Get-ChildItem -LiteralPath $Current -Directory -ErrorAction SilentlyContinue) {
      if ($ExcludedDirNames -notcontains $Dir.Name) {
        $Stack.Push($Dir.FullName)
      }
    }
  }

  foreach ($Extra in $ExtraFiles) {
    if (Test-Path -LiteralPath $Extra) {
      $Result.Add((Get-Item -LiteralPath $Extra))
    }
  }

  return $Result
}

function Classify-Path {
  param(
    [string]$Path,
    [string]$StatusCode
  )

  $P = $Path.Replace("/", "\")

  if ($P -like "tools\registry\runs\*") {
    return "EVIDENCE_GENERATED_DO_NOT_COMMIT"
  }

  if ($P -eq "governance\TAMAGUI_INTEGRATION_LAW.md" -or
      $P -eq "tools\guards\GUARD_TAMAGUI_GOVERNANCE_LAW.ps1") {
    return "TAMAGUI_GOVERNANCE_EXPECTED"
  }

  if ($P -eq "governance\OWNERSHIP.md" -or
      $P -eq "governance\ARCHITECTURE_LOCK.md") {
    return "GOVERNANCE_SHARED_REVIEW"
  }

  if ($P -like "packages\ui-kit\docs\generated\*") {
    return "UIKIT_PROOF_GENERATED_REVIEW"
  }

  if ($P -eq "packages\ui-kit\src\foundation.ts" -or
      $P -eq "packages\ui-kit\src\providers.tsx" -or
      $P -like "packages\ui-kit\src\web\*") {
    return "UIKIT_SOURCE_REVIEW_REQUIRED"
  }

  if ($P -like "apps\web\website\*") {
    return "WEBSITE_PROOF_OR_SIDE_EFFECT_REVIEW"
  }

  if ($P -like "packages\surfaces\src\service-owned\dsh\app-client\assets\ai-samples\*" -and $StatusCode -match "D") {
    return "DSH_AI_SAMPLE_ASSET_DELETION_REVIEW"
  }

  if ($P -like "tools\scripts\CHECK_ANALYZE_TAMAGUI_POST_LOCK_WORKTREE_DRIFT.ps1") {
    return "LOCAL_DIAGNOSTIC_SCRIPT_DO_NOT_COMMIT"
  }

  return "UNCLASSIFIED_REVIEW_REQUIRED"
}

function Invoke-Gate {
  param(
    [string]$Title,
    [scriptblock]$Command,
    [string]$ExitKey
  )

  Add-Section $Title
  & $Command 2>&1 | Tee-Object -FilePath $EvidenceFile -Append | Out-Host
  $ExitCode = if ($null -eq $LASTEXITCODE) { 0 } else { $LASTEXITCODE }
  Write-Evidence "$ExitKey=$ExitCode"
  return $ExitCode
}

function Invoke-InteractiveGuard {
  param(
    [string]$Title,
    [string]$GuardPath,
    [string]$ExitKey
  )

  Add-Section $Title

  if (-not (Test-Path -LiteralPath $GuardPath)) {
    Write-Evidence "$ExitKey=MISSING"
    return 9009
  }

  "" | powershell -ExecutionPolicy Bypass -File (Join-Path (Get-Location).Path $GuardPath) 2>&1 |
    Tee-Object -FilePath $EvidenceFile -Append | Out-Host

  $ExitCode = if ($null -eq $LASTEXITCODE) { 0 } else { $LASTEXITCODE }
  Write-Evidence "$ExitKey=$ExitCode"
  return $ExitCode
}

try {
  Write-Evidence "SESSION_ID=$SessionId"
  Write-Evidence "RUN_ROOT=$RunRoot"
  Write-Evidence "ISSUE=Diagnose post-lock Tamagui worktree drift before any commit"
  Write-Evidence "MODE=CHECK_ONLY_NO_APPLY"
  Write-Evidence "RULE=No commit. No restore. No delete. Classify current changes only."

  Add-Section "01 - Git baseline"

  git --no-pager status --short --untracked-files=all 2>&1 |
    Tee-Object -FilePath $EvidenceFile -Append | Out-Host

  git --no-pager status 2>&1 |
    Tee-Object -FilePath $EvidenceFile -Append | Out-Host

  git --no-pager branch --show-current 2>&1 |
    Tee-Object -FilePath $EvidenceFile -Append | Out-Host

  git --no-pager log -5 --oneline 2>&1 |
    Tee-Object -FilePath $EvidenceFile -Append | Out-Host

  git --no-pager diff --stat 2>&1 |
    Tee-Object -FilePath $EvidenceFile -Append | Out-Host

  git --no-pager diff --name-status 2>&1 |
    Tee-Object -FilePath $EvidenceFile -Append | Out-Host

  Add-Section "02 - Worktree classification"

  "STATUS`tCLASS`tPATH" | Set-Content -LiteralPath $ClassificationFile -Encoding UTF8

  $Porcelain = git --no-pager status --porcelain=v1 -uall
  $Counts = @{}
  $Rows = New-Object System.Collections.Generic.List[object]

  foreach ($Line in $Porcelain) {
    if ([string]::IsNullOrWhiteSpace($Line)) {
      continue
    }

    if ($Line.StartsWith("?? ")) {
      $StatusCode = "??"
      $Path = $Line.Substring(3)
    } else {
      $StatusCode = $Line.Substring(0, 2).Trim()
      $Path = $Line.Substring(3)
    }

    if ($Path -match " -> ") {
      $Path = ($Path -split " -> ")[-1]
    }

    $Class = Classify-Path -Path $Path -StatusCode $StatusCode

    if (-not $Counts.ContainsKey($Class)) {
      $Counts[$Class] = 0
    }

    $Counts[$Class] += 1

    "{0}`t{1}`t{2}" -f $StatusCode, $Class, $Path |
      Add-Content -LiteralPath $ClassificationFile -Encoding UTF8

    $Rows.Add([pscustomobject]@{
      Status = $StatusCode
      Class = $Class
      Path = $Path
    })

    Write-Evidence ("CLASSIFIED::{0}::{1}::{2}" -f $StatusCode, $Class, $Path)
  }

  Write-Evidence "CLASSIFICATION_FILE=$ClassificationFile"

  foreach ($Key in ($Counts.Keys | Sort-Object)) {
    Write-Evidence ("CLASS_COUNT::{0}={1}" -f $Key, $Counts[$Key])
  }

  Add-Section "03 - Tamagui direct import scan with build-time exception"

  $SourceFiles = Get-ProjectFilesFast `
    -Roots @("apps", "packages", "tools", "governance") `
    -Extensions @(".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs") `
    -ExtraFiles @("tamagui.build.ts", "tamagui.config.ts")

  $DirectPattern = "from\s+['""]tamagui['""]|from\s+['""]@tamagui/|require\(\s*['""]tamagui['""]\s*\)"
  $DirectHits = $SourceFiles | Select-String -Pattern $DirectPattern -ErrorAction SilentlyContinue

  $OutsideRuntimeHits = @()
  $BuildTimeExceptionHits = @()

  foreach ($Hit in $DirectHits) {
    $Relative = $Hit.Path.Replace((Get-Location).Path + "\", "")
    $Relative = $Relative.Replace("/", "\")

    $Scope = "BLOCKED_OUTSIDE_UIKIT"

    if ($Relative -like "packages\ui-kit\*") {
      $Scope = "ALLOWED_UIKIT"
    } elseif ($Relative -eq "tamagui.build.ts" -or $Relative -eq "tamagui.config.ts") {
      $Scope = "ALLOWED_BUILD_TIME_EXCEPTION_EXACT_PATH"
      $BuildTimeExceptionHits += $Hit
    } else {
      $OutsideRuntimeHits += $Hit
    }

    Write-Evidence ("{0}::{1}:{2}: {3}" -f $Scope, $Relative, $Hit.LineNumber, $Hit.Line.Trim())
  }

  Write-Evidence "DIRECT_TAMAGUI_IMPORT_COUNT=$($DirectHits.Count)"
  Write-Evidence "BUILD_TIME_EXCEPTION_TAMAGUI_IMPORT_COUNT=$($BuildTimeExceptionHits.Count)"
  Write-Evidence "OUTSIDE_UIKIT_RUNTIME_TAMAGUI_IMPORT_COUNT=$($OutsideRuntimeHits.Count)"

  Add-Section "04 - Tamagui provider and temporary-name scan"

  $ProviderHits = $SourceFiles | Select-String -Pattern "\bTamaguiProvider\b" -ErrorAction SilentlyContinue
  $ProviderOutsideHits = @()

  foreach ($Hit in $ProviderHits) {
    $Relative = $Hit.Path.Replace((Get-Location).Path + "\", "")
    $Relative = $Relative.Replace("/", "\")

    Write-Evidence ("TAMAGUI_PROVIDER_HIT::{0}:{1}: {2}" -f $Relative, $Hit.LineNumber, $Hit.Line.Trim())

    if ($Relative -ne "packages\ui-kit\src\providers.tsx") {
      $ProviderOutsideHits += $Hit
    }
  }

  $ForbiddenTempPattern = "\bTamaguiProofOfLife\b|\bBthTamaguiView\b|\bBthTamaguiText\b|\bBthTamaguiScrollView\b|\bPrimitiveTamaguiView\b|\bPrimitiveTamaguiText\b|\bPrimitiveTamaguiScrollView\b"
  $ForbiddenTempHits = $SourceFiles | Select-String -Pattern $ForbiddenTempPattern -ErrorAction SilentlyContinue

  foreach ($Hit in $ForbiddenTempHits) {
    $Relative = $Hit.Path.Replace((Get-Location).Path + "\", "")
    $Relative = $Relative.Replace("/", "\")
    Write-Evidence ("FORBIDDEN_TEMP_TAMAGUI_NAME::{0}:{1}: {2}" -f $Relative, $Hit.LineNumber, $Hit.Line.Trim())
  }

  Write-Evidence "TAMAGUI_PROVIDER_OUTSIDE_UIKIT_PROVIDERS_COUNT=$($ProviderOutsideHits.Count)"
  Write-Evidence "FORBIDDEN_TEMP_TAMAGUI_NAME_COUNT=$($ForbiddenTempHits.Count)"

  Add-Section "05 - Governance law and guard presence"

  $ExpectedFiles = @(
    "governance\TAMAGUI_INTEGRATION_LAW.md",
    "tools\guards\GUARD_TAMAGUI_GOVERNANCE_LAW.ps1",
    "tools\guards\GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1",
    "tools\guards\GUARD_BTHWANI_PROTECTED_TOKENS.ps1"
  )

  foreach ($Expected in $ExpectedFiles) {
    Write-Evidence ("EXPECTED_FILE_EXISTS::{0}={1}" -f $Expected, (Test-Path -LiteralPath $Expected))
  }

  if (Test-Path -LiteralPath "governance\TAMAGUI_INTEGRATION_LAW.md") {
    $Law = Get-Content -LiteralPath "governance\TAMAGUI_INTEGRATION_LAW.md" -Raw

    $LawTerms = @(
      "Tamagui",
      "internal implementation engine",
      "packages/ui-kit",
      "@bthwani/ui-kit",
      "Direct Tamagui imports",
      "build-time",
      "CHECK",
      "APPLY",
      "Runtime proof"
    )

    foreach ($Term in $LawTerms) {
      Write-Evidence ("LAW_TERM_EXISTS::{0}={1}" -f $Term, $Law.Contains($Term))
    }
  }

  Add-Section "06 - ui-kit generated proof artifacts"

  $GeneratedRoot = "packages\ui-kit\docs\generated"

  if (Test-Path -LiteralPath $GeneratedRoot) {
    $GeneratedFiles = Get-ChildItem -LiteralPath $GeneratedRoot -Recurse -File -ErrorAction SilentlyContinue
    $GeneratedDirs = Get-ChildItem -LiteralPath $GeneratedRoot -Recurse -Directory -ErrorAction SilentlyContinue
    $TotalBytes = ($GeneratedFiles | Measure-Object -Property Length -Sum).Sum

    Write-Evidence "GENERATED_ROOT_EXISTS=True"
    Write-Evidence "GENERATED_FILE_COUNT=$($GeneratedFiles.Count)"
    Write-Evidence "GENERATED_DIR_COUNT=$($GeneratedDirs.Count)"
    Write-Evidence "GENERATED_TOTAL_BYTES=$TotalBytes"

    Write-Evidence "--- generated tracked files ---"
    git ls-files -- $GeneratedRoot 2>&1 |
      Tee-Object -FilePath $EvidenceFile -Append | Out-Host

    Write-Evidence "--- generated status ---"
    git --no-pager status --short --untracked-files=all -- $GeneratedRoot 2>&1 |
      Tee-Object -FilePath $EvidenceFile -Append | Out-Host

    Write-Evidence "--- generated largest files top 40 ---"
    $GeneratedFiles |
      Sort-Object Length -Descending |
      Select-Object -First 40 |
      ForEach-Object {
        $Relative = $_.FullName.Replace((Get-Location).Path + "\", "")
        Write-Evidence ("GENERATED_FILE::{0}::{1}" -f $_.Length, $Relative)
      }

    foreach ($CheckPath in @(
      "packages/ui-kit/docs/generated/playwright-artifacts",
      "packages/ui-kit/docs/generated/playwright-report",
      "packages/ui-kit/docs/generated/visual-regression"
    )) {
      Write-Evidence "--- git check-ignore $CheckPath ---"
      git check-ignore -v "$CheckPath/*" 2>&1 |
        Tee-Object -FilePath $EvidenceFile -Append | Out-Host
      Write-Evidence "CHECK_IGNORE_EXIT_CODE_$($CheckPath.Replace('/', '_').Replace('\', '_'))=$LASTEXITCODE"
    }

    if (Test-Path -LiteralPath "packages\ui-kit\docs\generated\proof-manifest.json") {
      Write-Evidence "--- proof manifest key scan ---"
      Select-String -Path "packages\ui-kit\docs\generated\proof-manifest.json" -Pattern "accessibility|component-lab|native-themes|native-tokens|theme-output|token-output|visual|playwright" -ErrorAction SilentlyContinue |
        ForEach-Object {
          Write-Evidence ("PROOF_MANIFEST::{0}: {1}" -f $_.LineNumber, $_.Line.Trim())
        }
    }
  } else {
    Write-Evidence "GENERATED_ROOT_EXISTS=False"
  }

  Add-Section "07 - Deleted DSH ai-samples reference scan"

  $DeletedAssetRows = $Rows | Where-Object {
    $_.Class -eq "DSH_AI_SAMPLE_ASSET_DELETION_REVIEW"
  }

  Write-Evidence "DELETED_DSH_AI_SAMPLE_ASSET_COUNT=$($DeletedAssetRows.Count)"

  if ($DeletedAssetRows.Count -gt 0) {
    $ReferenceFiles = Get-ProjectFilesFast `
      -Roots @("apps", "packages", "governance", ".github") `
      -Extensions @(".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".yaml", ".yml", ".css", ".scss")

    foreach ($Row in $DeletedAssetRows) {
      $FileName = Split-Path -Leaf $Row.Path
      $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($FileName)

      Write-Evidence ""
      Write-Evidence "DELETED_ASSET=$($Row.Path)"
      Write-Evidence "DELETED_ASSET_FILENAME=$FileName"
      Write-Evidence "DELETED_ASSET_BASENAME=$BaseName"

      $HitsByFile = $ReferenceFiles | Select-String -SimpleMatch $FileName -ErrorAction SilentlyContinue
      $HitsByBase = $ReferenceFiles | Select-String -Pattern "\b$([regex]::Escape($BaseName))\b" -ErrorAction SilentlyContinue

      Write-Evidence "REFERENCE_HIT_BY_FILENAME_COUNT=$($HitsByFile.Count)"
      Write-Evidence "REFERENCE_HIT_BY_BASENAME_COUNT=$($HitsByBase.Count)"

      $HitsByFile | Select-Object -First 20 | ForEach-Object {
        $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
        Write-Evidence ("REFERENCE_FILENAME::{0}:{1}: {2}" -f $Relative, $_.LineNumber, $_.Line.Trim())
      }

      $HitsByBase | Select-Object -First 20 | ForEach-Object {
        $Relative = $_.Path.Replace((Get-Location).Path + "\", "")
        Write-Evidence ("REFERENCE_BASENAME::{0}:{1}: {2}" -f $Relative, $_.LineNumber, $_.Line.Trim())
      }
    }
  }

  Add-Section "08 - Focused diffs for changed review files"

  foreach ($FocusPath in @(
    "governance/ARCHITECTURE_LOCK.md",
    "governance/OWNERSHIP.md",
    "governance/TAMAGUI_INTEGRATION_LAW.md",
    "tools/guards/GUARD_TAMAGUI_GOVERNANCE_LAW.ps1",
    "apps/web/website/next-env.d.ts",
    "apps/web/website/next.config.mjs",
    "packages/ui-kit/src/foundation.ts",
    "packages/ui-kit/src/providers.tsx",
    "packages/ui-kit/src/web/command-center.tsx",
    "packages/ui-kit/src/web/page-frame.tsx",
    "packages/ui-kit/src/web/root-layout.tsx"
  )) {
    Write-Evidence ""
    Write-Evidence "--- DIFF $FocusPath ---"
    git --no-pager diff -- $FocusPath 2>&1 |
      Tee-Object -FilePath $EvidenceFile -Append | Out-Host
  }

  Add-Section "09 - Verification gates"

  $DiffCheckExit = Invoke-Gate "09.1 - git diff check" {
    git --no-pager diff --check
  } "DIFF_CHECK_EXIT_CODE"

  $RootTscExit = Invoke-Gate "09.2 - root TypeScript" {
    pnpm -w exec tsc --noEmit
  } "ROOT_TSC_EXIT_CODE"

  $UiKitTscExit = Invoke-Gate "09.3 - ui-kit TypeScript" {
    pnpm --dir packages/ui-kit exec tsc -p tsconfig.json --noEmit
  } "UIKIT_TSC_EXIT_CODE"

  $TamaguiBoundaryExit = Invoke-InteractiveGuard "09.4 - Tamagui import boundary guard" "tools\guards\GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1" "TAMAGUI_BOUNDARY_GUARD_EXIT_CODE"

  $BthwaniGuardExit = Invoke-InteractiveGuard "09.5 - bthwani protected token guard" "tools\guards\GUARD_BTHWANI_PROTECTED_TOKENS.ps1" "BTHWANI_PROTECTED_GUARD_EXIT_CODE"

  $TamaguiGovernanceExit = Invoke-Gate "09.6 - Tamagui governance law guard" {
    if (Test-Path -LiteralPath "tools\guards\GUARD_TAMAGUI_GOVERNANCE_LAW.ps1") {
      powershell -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\guards\GUARD_TAMAGUI_GOVERNANCE_LAW.ps1"
    } else {
      Write-Output "GUARD_TAMAGUI_GOVERNANCE_LAW_MISSING"
      exit 9009
    }
  } "TAMAGUI_GOVERNANCE_GUARD_EXIT_CODE"

  Add-Section "10 - Final classification"

  $HasUnclassified = $Counts.ContainsKey("UNCLASSIFIED_REVIEW_REQUIRED") -and $Counts["UNCLASSIFIED_REVIEW_REQUIRED"] -gt 0
  $HasDshDeletion = $Counts.ContainsKey("DSH_AI_SAMPLE_ASSET_DELETION_REVIEW") -and $Counts["DSH_AI_SAMPLE_ASSET_DELETION_REVIEW"] -gt 0
  $HasWebsiteReview = $Counts.ContainsKey("WEBSITE_PROOF_OR_SIDE_EFFECT_REVIEW") -and $Counts["WEBSITE_PROOF_OR_SIDE_EFFECT_REVIEW"] -gt 0
  $HasUiKitSourceReview = $Counts.ContainsKey("UIKIT_SOURCE_REVIEW_REQUIRED") -and $Counts["UIKIT_SOURCE_REVIEW_REQUIRED"] -gt 0
  $HasSharedGovernanceReview = $Counts.ContainsKey("GOVERNANCE_SHARED_REVIEW") -and $Counts["GOVERNANCE_SHARED_REVIEW"] -gt 0

  $GateFailed =
    $DiffCheckExit -ne 0 -or
    $RootTscExit -ne 0 -or
    $UiKitTscExit -ne 0 -or
    $TamaguiBoundaryExit -ne 0 -or
    $BthwaniGuardExit -ne 0 -or
    $TamaguiGovernanceExit -ne 0

  $TamaguiPolicyFailed =
    $OutsideRuntimeHits.Count -gt 0 -or
    $ProviderOutsideHits.Count -gt 0 -or
    $ForbiddenTempHits.Count -gt 0

  if ($GateFailed) {
    Set-Final "BLOCKED" "One or more verification gates failed. Do not commit." "DIFF/TS/GUARD gate failed."
  } elseif ($TamaguiPolicyFailed) {
    Set-Final "BLOCKED" "Tamagui policy violation detected. Do not commit." "Direct runtime import/provider/temp-name violation."
  } elseif ($HasDshDeletion -or $HasWebsiteReview -or $HasUiKitSourceReview -or $HasUnclassified) {
    Set-Final "REVIEW_REQUIRED_MIXED_WORKTREE" "Tamagui governance changes are mixed with unrelated or high-impact worktree drift. Split or explicitly approve before commit." "Mixed changes include DSH deleted assets, website changes, ui-kit source changes, or unclassified files."
  } elseif ($HasSharedGovernanceReview) {
    Set-Final "REVIEW_REQUIRED_GOVERNANCE_SCOPE" "Tamagui governance lock appears clean, but shared governance files changed and require explicit review before commit." "Shared governance files changed."
  } else {
    Set-Final "PASS_TAMAGUI_GOVERNANCE_ONLY" "Current worktree appears limited to Tamagui governance/proof artifacts and passed gates." ""
  }

  Write-Evidence "FINAL_STATUS=$FinalStatus"
  Write-Evidence "DECISION=$Decision"
  Write-Evidence "ROOT_CAUSE=$RootCause"
  Write-Evidence "EVIDENCE_FILE=$EvidenceFile"
  Write-Evidence "SUMMARY_FILE=$SummaryFile"
  Write-Evidence "CLASSIFICATION_FILE=$ClassificationFile"

  @(
    "# Tamagui Post-Lock Worktree Drift Diagnostic",
    "",
    "- Session: $SessionId",
    "- Final status: $FinalStatus",
    "- Decision: $Decision",
    "- Root cause: $RootCause",
    "- Evidence: $EvidenceFile",
    "- Classification: $ClassificationFile",
    "",
    "## Key counts",
    "",
    "- Direct Tamagui imports: $($DirectHits.Count)",
    "- Build-time exception imports: $($BuildTimeExceptionHits.Count)",
    "- Runtime imports outside ui-kit: $($OutsideRuntimeHits.Count)",
    "- Provider outside ui-kit providers: $($ProviderOutsideHits.Count)",
    "- Forbidden temporary Tamagui names: $($ForbiddenTempHits.Count)",
    "- Deleted DSH ai sample assets: $($DeletedAssetRows.Count)",
    "",
    "## Gate exits",
    "",
    "- DIFF_CHECK_EXIT_CODE=$DiffCheckExit",
    "- ROOT_TSC_EXIT_CODE=$RootTscExit",
    "- UIKIT_TSC_EXIT_CODE=$UiKitTscExit",
    "- TAMAGUI_BOUNDARY_GUARD_EXIT_CODE=$TamaguiBoundaryExit",
    "- BTHWANI_PROTECTED_GUARD_EXIT_CODE=$BthwaniGuardExit",
    "- TAMAGUI_GOVERNANCE_GUARD_EXIT_CODE=$TamaguiGovernanceExit"
  ) | Set-Content -LiteralPath $SummaryFile -Encoding UTF8

  @(
    "FINAL_STATUS=$FinalStatus",
    "DECISION=$Decision",
    "ROOT_CAUSE=$RootCause",
    "EVIDENCE_FILE=$EvidenceFile",
    "SUMMARY_FILE=$SummaryFile",
    "CLASSIFICATION_FILE=$ClassificationFile"
  ) | Set-Content -LiteralPath $StatusFile -Encoding UTF8

} catch {
  Write-Evidence ""
  Write-Evidence "ERROR=$($_.Exception.Message)"
  Set-Final "FAIL" "Diagnostic script failed unexpectedly." $_.Exception.Message

  @(
    "FINAL_STATUS=$FinalStatus",
    "DECISION=$Decision",
    "ROOT_CAUSE=$RootCause",
    "EVIDENCE_FILE=$EvidenceFile"
  ) | Set-Content -LiteralPath $StatusFile -Encoding UTF8
}

Write-Host ""
Write-Host "DONE" -ForegroundColor Green
Write-Host "FINAL_STATUS=$FinalStatus" -ForegroundColor Cyan
Write-Host "DECISION=$Decision" -ForegroundColor Cyan
Write-Host "ROOT_CAUSE=$RootCause" -ForegroundColor Yellow
Write-Host "EVIDENCE_FILE=$EvidenceFile" -ForegroundColor Yellow
Write-Host "CLASSIFICATION_FILE=$ClassificationFile" -ForegroundColor Yellow
Write-Host "SUMMARY_FILE=$SummaryFile" -ForegroundColor Yellow
Read-Host "Press Enter after reviewing the evidence"
