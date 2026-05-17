Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$IssueCode = "GUARD_ZIP_POLICY_DIAG"
$ExpectedBranch = "ghb/0149-20260517-043745-chore-dsh-untrack-and-ignore-loc"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$SessionId = "$IssueCode-$Stamp"
$EvidenceRoot = Join-Path ".\tools\registry\runs" $SessionId

New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

$CommandLog = Join-Path $EvidenceRoot "commands.log"
$SummaryPath = Join-Path $EvidenceRoot "SUMMARY.md"
$FindingsCsv = Join-Path $EvidenceRoot "findings.csv"
$FindingsJson = Join-Path $EvidenceRoot "findings.json"
$ScriptZipCsv = Join-Path $EvidenceRoot "script-zip-scan.csv"
$GitContextPath = Join-Path $EvidenceRoot "git-context.txt"
$RecommendationPath = Join-Path $EvidenceRoot "recommended-correction-plan.md"

function Write-Log {
  param([string]$Message)
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  Add-Content -LiteralPath $CommandLog -Value $line -Encoding UTF8
}

function Run-Command {
  param(
    [string]$Name,
    [scriptblock]$Command
  )
  Write-Log "RUN: $Name"
  try {
    $output = & $Command 2>&1
    $text = ($output | Out-String).TrimEnd()
    Write-Log "OK: $Name"
    return $text
  } catch {
    Write-Log "FAIL: $Name :: $($_.Exception.Message)"
    return "ERROR: $($_.Exception.Message)"
  }
}

function Get-Category {
  param(
    [string]$Line,
    [string]$Window
  )

  $text = ($Window + "`n" + $Line)

  if ($text -match '(?i)(_HANDOFF\.zip|\{SESSION_ID\}\.zip|Compress-Archive|handoff_zip|HANDOFF_ZIP)') {
    if ($text -match '(?i)(Always required|mandatory|required|must|not accepted|cannot pass|lacks|إلزامي|يجب|لا تُقبل|لا تقبل|لا يمكن|دائمًا|دائما)') {
      return "ZIP_FORCE_OR_MANDATORY"
    }
    if ($text -match '(?i)(when needed|only|عند الحاجة|إذا|اذا|when|حسب|optional|صرّح المستخدم|not optional unless)') {
      return "ZIP_CONDITIONAL_OR_OPTIONAL"
    }
    return "ZIP_REFERENCE"
  }

  if ($text -match '(?i)(Gate|Guard|بوابة|حارس|guards|CHECK_SCRIPT_GOVERNANCE)') {
    if ($text -match '(?i)(all|every|Always|required|mandatory|must|كل|دائمًا|دائما|إلزامي|يجب)') {
      return "GUARD_FORCE_OR_BROAD"
    }
    if ($text -match '(?i)(appropriate|حسب|عند الحاجة|risk|scope|نوع المهمة|المهمة|الخطر|النطاق)') {
      return "GUARD_SMART_OR_SCOPED"
    }
    return "GUARD_REFERENCE"
  }

  if ($text -match '(?i)(TERMINAL_COMMAND|SINGLE_FILE|DECISION_ONLY|ZIP_PACKAGE|PATCH_HANDOFF|EVIDENCE_BUNDLE|VISUAL_REVIEW|NO_ACTION|ليس كل|لا توجد طريقة واحدة|حسب طبيعة المهمة|طريقة التسليم)') {
    return "SMART_DELIVERY_RULE"
  }

  if ($text -match '(?i)(tools[\\/]+registry[\\/]+runs|Evidence Pack|evidence root|evidence bundle)') {
    if ($text -match '(?i)(Always|required|mandatory|must|كل|إلزامي|يجب)') {
      return "EVIDENCE_FORCE_OR_BROAD"
    }
    return "EVIDENCE_REFERENCE"
  }

  return "OTHER"
}

function Get-Risk {
  param(
    [string]$Category,
    [string]$Line,
    [string]$Window
  )

  $text = ($Window + "`n" + $Line)

  if ($Category -in @("ZIP_FORCE_OR_MANDATORY", "GUARD_FORCE_OR_BROAD", "EVIDENCE_FORCE_OR_BROAD")) {
    if ($text -match '(?i)(Always required|cannot pass|not accepted|lacks|إلزامي لأي|كل مهمة|كل Gate|كل مرحلة|دائمًا|دائما)') {
      return "HIGH"
    }
    return "MEDIUM"
  }

  if ($Category -in @("ZIP_CONDITIONAL_OR_OPTIONAL", "GUARD_SMART_OR_SCOPED", "SMART_DELIVERY_RULE")) {
    return "LOW"
  }

  if ($text -match '(?i)(Compress-Archive|_HANDOFF\.zip|\{SESSION_ID\}\.zip)') {
    return "MEDIUM"
  }

  return "INFO"
}

function Get-TrackedTextFiles {
  $raw = Run-Command "git ls-files" { git ls-files }
  $paths = $raw -split "`r?`n" | Where-Object { $_ -and $_.Trim().Length -gt 0 }

  $allowedExt = @(
    ".md", ".mdx", ".txt",
    ".ps1", ".psm1",
    ".json", ".yml", ".yaml",
    ".js", ".jsx", ".ts", ".tsx",
    ".cjs", ".mjs"
  )

  $excludedRegex = '(^|/)(node_modules|\.git|\.next|dist|build|coverage|\.turbo|out|ios|android)(/|$)'

  foreach ($p in $paths) {
    $normalized = $p -replace '\\','/'
    if ($normalized -match $excludedRegex) { continue }

    $ext = [System.IO.Path]::GetExtension($p)
    if ($allowedExt -notcontains $ext) { continue }

    if (-not (Test-Path -LiteralPath $p)) { continue }

    $item = Get-Item -LiteralPath $p -ErrorAction SilentlyContinue
    if ($null -eq $item) { continue }

    if ($item.Length -gt 1500000) { continue }

    $p
  }
}

$Branch = Run-Command "git branch --show-current" { git branch --show-current }
$Commit = Run-Command "git rev-parse HEAD" { git rev-parse HEAD }
$Status = Run-Command "git status --short" { git --no-pager status --short }
$DiffCheck = Run-Command "git diff --check" { git --no-pager diff --check }

@"
IssueCode: $IssueCode
SessionId: $SessionId
ExpectedBranch: $ExpectedBranch
ActualBranch: $Branch
Commit: $Commit

git status --short:
$Status

git diff --check:
$DiffCheck
"@ | Set-Content -LiteralPath $GitContextPath -Encoding UTF8

$SearchTerms = @(
  "_HANDOFF.zip",
  "{SESSION_ID}.zip",
  "Compress-Archive",
  "HANDOFF_ZIP",
  "handoff_zip",
  "ZIP_PACKAGE",
  "EVIDENCE_BUNDLE",
  "Evidence Pack",
  "tools/registry/runs",
  "tools\registry\runs",
  "Gate",
  "Guard",
  "بوابة",
  "حارس",
  "Always required",
  "Mandatory",
  "required",
  "إلزامي",
  "يجب",
  "ليس كل",
  "لا توجد طريقة واحدة",
  "حسب طبيعة المهمة",
  "TERMINAL_COMMAND",
  "DECISION_ONLY",
  "PATCH_HANDOFF",
  "VISUAL_REVIEW"
)

$Findings = New-Object System.Collections.Generic.List[object]
$ScriptZipScan = New-Object System.Collections.Generic.List[object]

$files = @(Get-TrackedTextFiles)

foreach ($file in $files) {
  $content = Get-Content -LiteralPath $file -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
  if ([string]::IsNullOrWhiteSpace($content)) { continue }

  $lines = $content -split "`r?`n"
  $hitLineIndexes = New-Object System.Collections.Generic.HashSet[int]

  for ($i = 0; $i -lt $lines.Count; $i++) {
    foreach ($term in $SearchTerms) {
      if ($lines[$i] -like "*$term*") {
        [void]$hitLineIndexes.Add($i)
        break
      }
    }
  }

  foreach ($i in $hitLineIndexes) {
    $start = [Math]::Max(0, $i - 3)
    $end = [Math]::Min($lines.Count - 1, $i + 3)
    $windowLines = for ($j = $start; $j -le $end; $j++) { $lines[$j] }
    $window = ($windowLines -join "`n")
    $line = $lines[$i]

    $category = Get-Category -Line $line -Window $window
    $risk = Get-Risk -Category $category -Line $line -Window $window

    $Findings.Add([pscustomobject]@{
      Risk = $risk
      Category = $category
      File = $file
      Line = $i + 1
      Text = ($line.Trim())
      Context = (($window -replace "`r","") -replace "`n"," ⏎ ")
    })
  }

  if ($file -match '\.ps1$|\.psm1$') {
    $hasRegistryRuns = $content -match '(tools[\\/]+registry[\\/]+runs|registry[\\/]+runs)'
    $hasCompressArchive = $content -match 'Compress-Archive'
    $hasZipName = $content -match '(_HANDOFF\.zip|\{SESSION_ID\}\.zip|\.zip)'
    $hasCreateZipSwitch = $content -match '(\$CreateZip|-CreateZip|\$NoZip|-NoZip)'
    $hasDryRun = $content -match '(DryRun|WhatIf|\$Apply|-Apply)'
    $writesFiles = $content -match '(Set-Content|Add-Content|Out-File|New-Item|Copy-Item|Move-Item|Remove-Item)'

    if ($hasRegistryRuns -or $hasCompressArchive -or $hasZipName) {
      $zipMode = "NONE"
      if ($hasCompressArchive -and $hasCreateZipSwitch) {
        $zipMode = "OPTIONAL_OR_SWITCHED"
      } elseif ($hasCompressArchive) {
        $zipMode = "LIKELY_ALWAYS_OR_HARDCODED"
      } elseif ($hasZipName) {
        $zipMode = "ZIP_NAME_REFERENCE"
      }

      $ScriptZipScan.Add([pscustomobject]@{
        File = $file
        HasRegistryRuns = $hasRegistryRuns
        HasCompressArchive = $hasCompressArchive
        HasZipName = $hasZipName
        HasCreateZipOrNoZipSwitch = $hasCreateZipSwitch
        HasDryRunOrApplySignal = $hasDryRun
        WritesFilesSignal = $writesFiles
        ZipMode = $zipMode
      })
    }
  }
}

$FindingsSorted = $Findings |
  Sort-Object @{
    Expression = {
      switch ($_.Risk) {
        "HIGH" { 0 }
        "MEDIUM" { 1 }
        "LOW" { 2 }
        "INFO" { 3 }
        default { 4 }
      }
    }
  }, File, Line

$FindingsSorted | Export-Csv -LiteralPath $FindingsCsv -NoTypeInformation -Encoding UTF8
$FindingsSorted | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $FindingsJson -Encoding UTF8
$ScriptZipScan | Sort-Object ZipMode, File | Export-Csv -LiteralPath $ScriptZipCsv -NoTypeInformation -Encoding UTF8

$HighCount = @($FindingsSorted | Where-Object { $_.Risk -eq "HIGH" }).Count
$MediumCount = @($FindingsSorted | Where-Object { $_.Risk -eq "MEDIUM" }).Count
$SmartCount = @($FindingsSorted | Where-Object { $_.Category -in @("SMART_DELIVERY_RULE", "GUARD_SMART_OR_SCOPED", "ZIP_CONDITIONAL_OR_OPTIONAL") }).Count
$ZipScriptCount = @($ScriptZipScan | Where-Object { $_.ZipMode -eq "LIKELY_ALWAYS_OR_HARDCODED" }).Count
$WrongBranch = ($Branch.Trim() -ne $ExpectedBranch)

$TopHigh = @($FindingsSorted | Where-Object { $_.Risk -eq "HIGH" } | Select-Object -First 25)
$TopZipScripts = @($ScriptZipScan | Where-Object { $_.ZipMode -eq "LIKELY_ALWAYS_OR_HARDCODED" } | Select-Object -First 25)

$Verdict = if ($HighCount -gt 0 -or $ZipScriptCount -gt 0) {
  "FIX_REQUIRED"
} elseif ($MediumCount -gt 0) {
  "PASS_WITH_WARNINGS"
} else {
  "PASS"
}

$BranchNote = if ($WrongBranch) {
  "WARNING: Current branch is '$Branch' but expected '$ExpectedBranch'. Diagnosis still ran, but correction must target the intended branch."
} else {
  "Branch matches expected branch."
}

$TopHighText = if ($TopHigh.Count -gt 0) {
  ($TopHigh | ForEach-Object {
    "- [$($_.Risk)] $($_.Category) :: $($_.File):$($_.Line) :: $($_.Text)"
  }) -join "`n"
} else {
  "- No HIGH findings."
}

$TopZipScriptText = if ($TopZipScripts.Count -gt 0) {
  ($TopZipScripts | ForEach-Object {
    "- $($_.File) :: ZipMode=$($_.ZipMode) :: RegistryRuns=$($_.HasRegistryRuns) :: CompressArchive=$($_.HasCompressArchive) :: Switch=$($_.HasCreateZipOrNoZipSwitch)"
  }) -join "`n"
} else {
  "- No likely hardcoded ZIP scripts found."
}

$CorrectionPlan = @"
# Recommended Correction Plan — Guard/ZIP Overuse

Decision: $Verdict

## Root diagnosis target

The correction script should not blindly remove evidence rules. It should separate:

1. Required evidence for acceptance.
2. Optional ZIP handoff for large evidence.
3. Smart guard selection by risk/scope.
4. Script-level defaults.

## Correction principles

- Keep Git evidence.
- Keep diff check.
- Keep TypeScript verification where code/TS/UI can be affected.
- Keep UI screenshot requirement for visible UI changes.
- Remove or soften unconditional ZIP language.
- Do not run every guard for every task.
- Make ZIP optional unless:
  - user explicitly requests ZIP,
  - multiple evidence files must be uploaded,
  - script is a major governance/guard evidence run,
  - package contains multiple files,
  - rollback/evidence bundle must be handed off as one artifact.

## Likely edits after review

1. Update governance evidence wording from broad "Always required" to risk-based matrix.
2. Add explicit "No ZIP for low-risk terminal commands / decision-only / prompt-only tasks".
3. Update registry-run script standard:
   - default: write readable evidence folder only,
   - optional: -CreateZip switch,
   - no Compress-Archive by default for simple checks.
4. Add guard selection matrix:
   - LOW: git status + diff check.
   - MEDIUM: status + diff check + tsc when TS/UI affected.
   - UI: add screenshot/RTL/overflow check.
   - HIGH: targeted specialized guards only.
   - Governance/scripts: evidence bundle, optional ZIP only when needed.
5. Add anti-noise rule:
   - no all-guards default,
   - no ZIP default,
   - no broad evidence pack for simple tasks.

## Files to inspect first before APPLY

Use findings.csv and script-zip-scan.csv to choose exact files. Do not correct blindly.
"@

$CorrectionPlan | Set-Content -LiteralPath $RecommendationPath -Encoding UTF8

$Summary = @"
# Guard / ZIP Overuse Diagnostic

Decision: $Verdict

## Scope

Read-only diagnosis of guard/evidence/ZIP over-application.

## What this script did

- Scanned tracked text files only.
- Did not edit existing project files.
- Did not create ZIP.
- Did not commit, push, branch, or open PR.
- Generated diagnostic outputs only.

## Branch context

$BranchNote

- Expected branch: $ExpectedBranch
- Actual branch: $Branch
- Commit: $Commit

## Counts

- Total findings: $($FindingsSorted.Count)
- HIGH findings: $HighCount
- MEDIUM findings: $MediumCount
- Smart/scoped counter-rules found: $SmartCount
- Scripts with likely hardcoded ZIP creation: $ZipScriptCount

## Top high-risk findings

$TopHighText

## Scripts likely forcing ZIP

$TopZipScriptText

## Output files

- $SummaryPath
- $FindingsCsv
- $FindingsJson
- $ScriptZipCsv
- $GitContextPath
- $RecommendationPath

## Next action

Upload or paste:

1. SUMMARY.md
2. findings.csv
3. script-zip-scan.csv
4. recommended-correction-plan.md

Then the correction script can be written based on evidence, not assumptions.
"@

$Summary | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

Write-Host ""
Write-Host "==== GUARD / ZIP OVERUSE DIAGNOSTIC ===="
Write-Host "Decision: $Verdict"
Write-Host "Session:  $SessionId"
Write-Host "Output:   $EvidenceRoot"
Write-Host "ZIP:      NOT CREATED"
Write-Host ""
Write-Host "Counts:"
Write-Host "  HIGH findings: $HighCount"
Write-Host "  MEDIUM findings: $MediumCount"
Write-Host "  Smart/scoped rules: $SmartCount"
Write-Host "  Likely hardcoded ZIP scripts: $ZipScriptCount"
Write-Host ""
Write-Host "Open these files:"
Write-Host "  $SummaryPath"
Write-Host "  $FindingsCsv"
Write-Host "  $ScriptZipCsv"
Write-Host "  $RecommendationPath"
Write-Host ""
