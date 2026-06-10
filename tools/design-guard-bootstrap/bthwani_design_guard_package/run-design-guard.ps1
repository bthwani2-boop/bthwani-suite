Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$IssueCode = "DESIGN_GRAPH_GUARD"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$FindingsJson = Join-Path $RunRoot "design-guard-powershell-findings.json"
$FindingsMd = Join-Path $RunRoot "DESIGN_GUARD_FINDINGS.md"
$HandoffZip = Join-Path $RunRoot "_HANDOFF.zip"

function Write-LogLine {
  param([string]$Message)
  Add-Content -LiteralPath $CommandLog -Value "[$((Get-Date).ToString('s'))] $Message" -Encoding UTF8
}

function Invoke-Capture {
  param(
    [string]$Name,
    [string]$Command,
    [string]$OutFile,
    [switch]$SoftFail
  )
  Write-LogLine "RUN $Name :: $Command"
  $outPath = Join-Path $RunRoot $OutFile
  try {
    cmd.exe /d /c $Command > $outPath 2>&1
    $exitCode = $LASTEXITCODE
  } catch {
    $exitCode = 999
    $_ | Out-String | Set-Content -LiteralPath $outPath -Encoding UTF8
  }
  Write-LogLine "EXIT $Name :: $exitCode -> $OutFile"
  if (($exitCode -ne 0) -and (-not $SoftFail)) {
    throw "Command failed: $Name ($exitCode). See $outPath"
  }
  return [pscustomobject]@{ name=$Name; command=$Command; exit_code=$exitCode; output_file=$OutFile }
}

function Add-Finding {
  param(
    [System.Collections.Generic.List[object]]$List,
    [string]$Rule,
    [string]$Severity,
    [string]$File,
    [int]$Line,
    [string]$Match,
    [string]$Recommendation
  )
  $List.Add([pscustomobject]@{
    rule=$Rule
    severity=$Severity
    file=$File
    line=$Line
    match=$Match
    recommendation=$Recommendation
  })
}

$checks = New-Object System.Collections.Generic.List[object]
$warnings = New-Object System.Collections.Generic.List[string]
$errors = New-Object System.Collections.Generic.List[string]
$findings = New-Object System.Collections.Generic.List[object]

try {
  if (!(Test-Path -LiteralPath ".git")) { throw "Not a git repository root: C:\bthwani-suite" }
  if (!(Test-Path -LiteralPath ".\package.json")) { throw "Missing package.json at repo root." }

  $env:BTHWANI_DESIGN_GUARD_EVIDENCE_ROOT = $RunRoot

  $checks.Add((Invoke-Capture -Name "git branch" -Command "git branch --show-current" -OutFile "git-branch.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git status" -Command "git --no-pager status --short" -OutFile "git-status.txt" -SoftFail))
  $checks.Add((Invoke-Capture -Name "git diff check" -Command "git --no-pager diff --check" -OutFile "git-diff-check.txt" -SoftFail))

  if (Test-Path -LiteralPath ".\graphify-out") {
    $checks.Add((Invoke-Capture -Name "graphify inventory" -Command "dir /s /b graphify-out" -OutFile "graphify-out-files.txt" -SoftFail))
  } else {
    $warnings.Add("graphify-out folder was not found. Graphify acceleration skipped.")
  }

  if (Test-Path -LiteralPath ".\.tamagui") {
    $checks.Add((Invoke-Capture -Name "tamagui generated inventory" -Command "dir /s /b .tamagui" -OutFile "tamagui-generated-files.txt" -SoftFail))
  }

  $targetRoots = @("apps", "control-panel", "dsh", "ui-kit", "dsh", "wlt") | Where-Object { Test-Path -LiteralPath $_ }
  $targetFiles = foreach ($root in $targetRoots) {
    Get-ChildItem -LiteralPath $root -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.scss -ErrorAction SilentlyContinue |
      Where-Object {
        $full = $_.FullName
        $full -notmatch "\\node_modules\\" -and
        $full -notmatch "\\.git\\" -and
        $full -notmatch "\\.next\\" -and
        $full -notmatch "\\dist\\" -and
        $full -notmatch "\\build\\" -and
        $full -notmatch "\\coverage\\" -and
        $full -notmatch "\\tools\\registry\\runs\\" -and
        $full -notmatch "\\graphify-out\\" -and
        $full -notmatch "\\.tamagui\\"
      }
  }

  foreach ($f in $targetFiles) {
    $rel = Resolve-Path -LiteralPath $f.FullName -Relative
    $isUiKit = $rel -like ".\ui-kit\*"
    $i = 0
    foreach ($line in [System.IO.File]::ReadLines($f.FullName)) {
      $i++
      $trim = $line.Trim()

      if ((-not $isUiKit) -and ($line -match "from\s+['\""]tamagui['\" ]" -or $line -match "from\s+['\""]@tamagui/")) {
        Add-Finding -List $findings -Rule "NO_DIRECT_TAMAGUI_OUTSIDE_UI_KIT" -Severity "BLOCKING_CANDIDATE" -File $rel -Line $i -Match $trim -Recommendation "Move this usage behind @bthwani/ui-kit public exports or a ui-kit-owned adapter."
      }

      if ($line -match "from\s+['\""]@bthwani/ui-kit/(src|components|web|mobile|foundation|primitives)") {
        Add-Finding -List $findings -Rule "NO_DEEP_UI_KIT_IMPORTS" -Severity "BLOCKING_CANDIDATE" -File $rel -Line $i -Match $trim -Recommendation "Use @bthwani/ui-kit public exports only."
      }

      if ((-not $isUiKit) -and ($line -match "#[0-9a-fA-F]{3,8}\b")) {
        Add-Finding -List $findings -Rule "NO_RAW_HEX_OUTSIDE_UI_KIT" -Severity "ADVISORY_TO_CLASSIFY" -File $rel -Line $i -Match $trim -Recommendation "Promote to centralized tokens if intentional; otherwise replace with ui-kit token."
      }

      if ((-not $isUiKit) -and ($line -match "style=\{\{")) {
        Add-Finding -List $findings -Rule "INLINE_STYLE_REVIEW" -Severity "ADVISORY_TO_CLASSIFY" -File $rel -Line $i -Match $trim -Recommendation "Classify whether this should become a ui-kit variant/tokenized prop."
      }

      if ($line -match "(graphify-out|\.tamagui|tools/analysis|tools/registry/runs)") {
        Add-Finding -List $findings -Rule "NO_RUNTIME_REFERENCE_TO_GENERATED_OUTPUTS" -Severity "BLOCKING_CANDIDATE" -File $rel -Line $i -Match $trim -Recommendation "Generated/cache/evidence outputs must not be runtime dependencies."
      }
    }

    if ((-not $isUiKit) -and ($f.Name -match "^(Button|Card|Header|Topbar|Tabs|Filter|Filters|FilterBar|FilterChip|Badge|Kpi|KPI|EmptyState|ErrorState|LoadingState|Modal|Sheet|List|Table).+\.(tsx|jsx)$")) {
      Add-Finding -List $findings -Rule "LOCAL_DESIGN_COMPONENT_CANDIDATE" -Severity "ADVISORY_TO_CLASSIFY" -File $rel -Line 0 -Match $f.Name -Recommendation "Compare with related patterns; promote strongest pattern to @bthwani/ui-kit or delete/merge if duplicate."
    }
  }

  $findings | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $FindingsJson -Encoding UTF8

  $reactConfig = ".\tools\guards\design\react-scanner.ui-kit.config.cjs"
  if (Test-Path -LiteralPath $reactConfig) {
    $checks.Add((Invoke-Capture -Name "react-scanner ui-kit usage" -Command "pnpm exec react-scanner -c tools/guards/design/react-scanner.ui-kit.config.cjs" -OutFile "react-scanner-ui-kit.log" -SoftFail))
  } else {
    $warnings.Add("react-scanner config not found. Run 02_CREATE_DESIGN_GUARD_SCAFFOLD.ps1 -Apply first.")
  }

  $depConfig = ".\tools\guards\design\dependency-cruiser.design.cjs"
  if (Test-Path -LiteralPath $depConfig) {
    $checks.Add((Invoke-Capture -Name "dependency-cruiser design" -Command "pnpm exec depcruise --config tools/guards/design/dependency-cruiser.design.cjs --output-type json apps control-panel packages dsh wlt" -OutFile "dependency-cruiser-design.json" -SoftFail))
  } elseif (Test-Path -LiteralPath ".\.dependency-cruiser.cjs") {
    $checks.Add((Invoke-Capture -Name "dependency-cruiser root" -Command "pnpm exec depcruise --config .dependency-cruiser.cjs --output-type json ." -OutFile "dependency-cruiser-root.json" -SoftFail))
  } else {
    $warnings.Add("dependency-cruiser config not found. Boundary graph skipped.")
  }

  if (Test-Path -LiteralPath ".\tools\guards\design\ast-grep-rules") {
    $checks.Add((Invoke-Capture -Name "ast-grep design rules" -Command "pnpm exec ast-grep scan --rule tools/guards/design/ast-grep-rules --json" -OutFile "ast-grep-design-rules.json" -SoftFail))
  } else {
    $warnings.Add("ast-grep rules not found. Run 02_CREATE_DESIGN_GUARD_SCAFFOLD.ps1 -Apply first.")
  }

  if (Test-Path -LiteralPath ".\knip.json" -or Test-Path -LiteralPath ".\knip.ts" -or Test-Path -LiteralPath ".\tools\guards\design\knip.design.config.ts") {
    $checks.Add((Invoke-Capture -Name "knip design/dead code" -Command "pnpm exec knip --reporter json" -OutFile "knip-report.json" -SoftFail))
  } else {
    $warnings.Add("Knip config not found. Knip run skipped to avoid noisy false positives.")
  }

  if (Test-Path -LiteralPath ".\tools\guards\design\stylelint.design.cjs") {
    $checks.Add((Invoke-Capture -Name "stylelint design css" -Command "pnpm exec stylelint `"**/*.{css,scss}`" --config tools/guards/design/stylelint.design.cjs --formatter json" -OutFile "stylelint-design.json" -SoftFail))
  }

  $checks.Add((Invoke-Capture -Name "tsc no emit" -Command "pnpm -w exec tsc --noEmit" -OutFile "typescript-noemit.txt" -SoftFail))

  $blockingCount = ($findings | Where-Object { $_.severity -eq "BLOCKING_CANDIDATE" }).Count
  $advisoryCount = ($findings | Where-Object { $_.severity -eq "ADVISORY_TO_CLASSIFY" }).Count
  if ($blockingCount -gt 0) { $warnings.Add("Found $blockingCount blocking-candidate design boundary findings. Review before PASS.") }
  if ($advisoryCount -gt 0) { $warnings.Add("Found $advisoryCount advisory design findings requiring classification/promotion/delete/merge.") }

  $status = if ($errors.Count -gt 0) { "FAIL" } elseif ($blockingCount -gt 0 -or $warnings.Count -gt 0) { "FIX_REQUIRED_OR_CLASSIFICATION_REQUIRED" } else { "PASS" }

  @"
# DESIGN_GRAPH_GUARD

status: $status
session_id: $SessionId
repo: C:\bthwani-suite
evidence_root: $RunRoot
handoff_zip: $HandoffZip

## Finding counts
- blocking_candidate: $blockingCount
- advisory_to_classify: $advisoryCount

## Guard principle
Generated outputs are evidence/cache only. Runtime code must not import from graphify-out, .tamagui, tools/analysis, or tools/registry/runs.

## Required review
Any local design pattern found as duplicate/dead/noisy must be classified as:
- promote_to_ui_kit
- replace_with_existing_ui_kit
- delete_dead
- merge_duplicate
- keep_with_reason
"@ | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

  $topFindings = $findings | Select-Object -First 200 | ForEach-Object { "- [$($_.severity)] $($_.rule) :: $($_.file):$($_.line) :: $($_.match)" }
  @"
# Design Guard Findings

## Counts
- Blocking candidates: $blockingCount
- Advisory/classification candidates: $advisoryCount

## First 200 findings
$($topFindings | Out-String)

## Full JSON
See `design-guard-powershell-findings.json`.
"@ | Set-Content -LiteralPath $FindingsMd -Encoding UTF8

  [pscustomobject]@{
    status=$status
    session_id=$SessionId
    repo="C:\bthwani-suite"
    evidence_root=$RunRoot
    handoff_zip=$HandoffZip
    checks=$checks
    warnings=$warnings
    errors=$errors
    finding_counts=[pscustomobject]@{
      blocking_candidate=$blockingCount
      advisory_to_classify=$advisoryCount
    }
  } | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $HandoffZip -Force
  Write-Host "status: $status"
  Write-Host "blocking_candidate: $blockingCount"
  Write-Host "advisory_to_classify: $advisoryCount"
  Write-Host "evidence_root: $RunRoot"
  Write-Host "handoff_zip: $HandoffZip"
} catch {
  $errors.Add($_.Exception.Message)
  "FAIL`n$($_.Exception.Message)" | Set-Content -LiteralPath (Join-Path $RunRoot "status.txt") -Encoding UTF8
  [pscustomobject]@{ status="FAIL"; session_id=$SessionId; errors=$errors; evidence_root=$RunRoot } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8
  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $HandoffZip -Force
  Write-Host "status: FAIL"
  Write-Host "evidence_root: $RunRoot"
  Write-Host "handoff_zip: $HandoffZip"
  throw
}
