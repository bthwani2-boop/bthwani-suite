param(
  [string]$RepoRoot = "C:\bthwani-suite",
  [string]$PlanRoot = "",
  [switch]$Strict
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $RepoRoot
if ([string]::IsNullOrWhiteSpace($PlanRoot)) {
  $PlanRoot = Join-Path $RepoRoot "tools\plan\BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE"
}

$SessionId = "TARGET_CLOSURE_PACKAGE_CHECK-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
$CommandLog = Join-Path $RunRoot "commands.log"

function Log($m) { Add-Content -LiteralPath $CommandLog -Value ("[{0}] {1}" -f (Get-Date -Format o), $m) -Encoding UTF8 }
$Results = New-Object System.Collections.Generic.List[object]
function Add-Result($Name, $Status, $Detail) {
  $Results.Add([pscustomobject]@{ name=$Name; status=$Status; detail=$Detail }) | Out-Null
}
function Run-Capture($Name, $Cmd, $OutFile) {
  Log $Cmd
  try {
    $out = Invoke-Expression "$Cmd 2>&1" | Out-String
    Set-Content -LiteralPath (Join-Path $RunRoot $OutFile) -Value $out -Encoding UTF8
    Add-Result $Name "INFO" $OutFile
    return $out
  } catch {
    $out = $_.Exception.ToString()
    Set-Content -LiteralPath (Join-Path $RunRoot $OutFile) -Value $out -Encoding UTF8
    Add-Result $Name "WARN" $out
    return $out
  }
}

try {
  Run-Capture "git_branch" "git branch --show-current" "git-branch.txt" | Out-Null
  Run-Capture "git_head" "git rev-parse HEAD" "git-head.txt" | Out-Null
  Run-Capture "git_status_short" "git --no-pager status --short" "git-status.txt" | Out-Null
  Run-Capture "git_status_sb" "git status -sb" "git-status-sb.txt" | Out-Null
  Run-Capture "git_untracked" "git ls-files --others --exclude-standard" "git-untracked.txt" | Out-Null
  Run-Capture "git_remote" "git remote -v" "git-remote.txt" | Out-Null
  Run-Capture "git_upstream" "git rev-parse --abbrev-ref --symbolic-full-name '@{u}'" "git-upstream.txt" | Out-Null

  if (Test-Path -LiteralPath $PlanRoot) { Add-Result "plan_root_exists" "PASS" $PlanRoot } else { Add-Result "plan_root_exists" "FAIL" $PlanRoot }

  $ManifestPath = Join-Path $PlanRoot "manifest.json"
  $ShaPath = Join-Path $PlanRoot "SHA256SUMS.json"
  $MainPath = Join-Path $PlanRoot "BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md"

  foreach ($requiredRoot in @($ManifestPath, $ShaPath, $MainPath)) {
    if (Test-Path -LiteralPath $requiredRoot) { Add-Result "required_root_exists:$([IO.Path]::GetFileName($requiredRoot))" "PASS" $requiredRoot } else { Add-Result "required_root_exists:$([IO.Path]::GetFileName($requiredRoot))" "FAIL" $requiredRoot }
  }

  $Manifest = $null
  if (Test-Path -LiteralPath $ManifestPath) {
    try {
      $Manifest = Get-Content -LiteralPath $ManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
      Add-Result "manifest_json_valid" "PASS" "valid"
      if ($Manifest.package_id -eq "BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE") { Add-Result "manifest_package_id" "PASS" $Manifest.package_id } else { Add-Result "manifest_package_id" "FAIL" $Manifest.package_id }
      if ($Manifest.version -eq "7.0.0") { Add-Result "manifest_version" "PASS" $Manifest.version } else { Add-Result "manifest_version" "FAIL" "expected 7.0.0 got $($Manifest.version)" }
    } catch { Add-Result "manifest_json_valid" "FAIL" $_.Exception.Message }
  }

  if ($Manifest -ne $null) {
    $actualFiles = Get-ChildItem -LiteralPath $PlanRoot -File | Select-Object -ExpandProperty Name | Sort-Object
    $manifestFiles = @($Manifest.files) | Sort-Object
    Set-Content -LiteralPath (Join-Path $RunRoot "package-file-list.txt") -Value ($actualFiles -join "`n") -Encoding UTF8
    foreach ($mf in $manifestFiles) {
      if ($actualFiles -contains $mf) { Add-Result "manifest_file_present:$mf" "PASS" "present" } else { Add-Result "manifest_file_present:$mf" "FAIL" "missing" }
    }
    foreach ($af in $actualFiles) {
      if ($manifestFiles -contains $af) {
        Add-Result "actual_file_in_manifest:$af" "PASS" "listed"
      } else {
        $classification = if ($af -match "V1|V2|V3|OLD|BACKUP|DRAFT") { "LEGACY_PACKAGE_FILE" } else { "UNKNOWN_LOCAL_FILE" }
        Add-Result "extra_file:$af" $(if ($Strict) { "FAIL" } else { "WARN" }) $classification
      }
    }
  }

  if ((Test-Path -LiteralPath $ShaPath) -and (Test-Path -LiteralPath $PlanRoot)) {
    try {
      $Sha = Get-Content -LiteralPath $ShaPath -Raw -Encoding UTF8 | ConvertFrom-Json
      $shaLog = New-Object System.Collections.Generic.List[string]
      foreach ($prop in $Sha.PSObject.Properties) {
        $file = $prop.Name
        $expected = [string]$prop.Value
        $path = Join-Path $PlanRoot $file
        if (!(Test-Path -LiteralPath $path)) { Add-Result "sha_file_exists:$file" "FAIL" "missing"; continue }
        $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLowerInvariant()
        $shaLog.Add("$file`t$actual`t$expected") | Out-Null
        if ($actual -eq $expected.ToLowerInvariant()) { Add-Result "sha_match:$file" "PASS" "match" } else { Add-Result "sha_match:$file" "FAIL" "actual=$actual expected=$expected" }
      }
      Set-Content -LiteralPath (Join-Path $RunRoot "sha256-verification.txt") -Value ($shaLog -join "`n") -Encoding UTF8
    } catch { Add-Result "sha_json_valid" "FAIL" $_.Exception.Message }
  }

  if (Test-Path -LiteralPath $MainPath) {
    $main = Get-Content -LiteralPath $MainPath -Raw -Encoding UTF8
    $oldSectionToken = ("23" + "-section")
    $oldReturn = ("Return the required " + "23")
    $contradictions = @()
    if ($main.Contains($oldSectionToken)) { $contradictions += "old-section-count-token" }
    if ($main.Contains($oldReturn)) { $contradictions += "old-return-contract" }
    if ($main -match "ghb/\d+|0170-") { $contradictions += "fixed-branch-reference" }
    Set-Content -LiteralPath (Join-Path $RunRoot "contradiction-check.txt") -Value ($contradictions -join "`n") -Encoding UTF8
    if ($contradictions.Count -eq 0) { Add-Result "contradiction_check" "PASS" "none" } else { Add-Result "contradiction_check" "FAIL" ($contradictions -join ",") }

    $requiredPhrases = @(
      "Version:** 7.0.0",
      "Required 28-Section Cycle Output",
      "PACKAGE_RECHECK_EVIDENCE",
      "PACKAGE_ADOPTABLE_FOR_CONTROLLED_EXECUTION",
      "INSTALL_TARGET_CLOSURE_PACKAGE.ps1",
      "CHECK_TARGET_CLOSURE_PACKAGE.ps1",
      "SHA256SUMS.json",
      "AUDIT_ONLY_ALLOWED_WITH_REASON",
      "Topic Decision Protocol",
      "Topic Candidate Matrix",
      "Topic Decision Matrix",
      "Topic Boundary Contract",
      "Runtime / API Readiness Matrix",
      "Performance Evidence Matrix",
      "LEGACY_PATH_REFERENCE",
      "dsh/frontend/data",
      "dsh/frontend/media-fixtures",
      "LCP target: <= 2.5s",
      "INP target: <= 200ms",
      "CLS target: <= 0.1",
      "توجب الالتزام بنظام الألوان المركزي",
      "تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر",
      "BTHWANI_AGENT_NAVIGATION_MAP.md",
      "AGENT_NAVIGATION_RULE",
      "NAVIGATION_GATE_MISSING",
      "BTHWANI_OPERATOR_FIELD_MANUAL.md",
      "BTHWANI_SOURCE_COVERAGE_MATRIX.md",
      "BTHWANI_TARGET_ARCHETYPE_GUIDE.md",
      "BTHWANI_PERFORMANCE_PLAYBOOK.md",
      "BTHWANI_STRUCTURE_REFACTOR_PLAYBOOK.md",
      "BTHWANI_AGENT_FAILURE_MODES.md",
      "Technical / Logic Gap Discovery",
      "Technical / Logic Gap Matrix"
    )
    foreach ($phrase in $requiredPhrases) {
      if ($main.Contains($phrase)) { Add-Result "main_contains:$phrase" "PASS" "found" } else { Add-Result "main_contains:$phrase" "FAIL" "missing" }
    }

    $sections = @(
      "1. Package Recheck",
      "2. Target",
      "3. Current Branch Rule Status",
      "4. Target Type",
      "5. Agents/Governance/Guards Fitness Result",
      "6. Files Scanned",
      "7. Linked Surfaces Discovered and Classified",
      "8. Web/Open-Source Benchmark Matrix or WEB_RESEARCH_UNAVAILABLE",
      "9. Target Discovery Summary",
      "10. Topic Candidate Matrix",
      "11. Topic Decision Matrix",
      "12. Topic Boundary Contract",
      "13. Structural Hygiene Matrix",
      "14. Gap Matrix",
      "15. File Boundary Matrix",
      "16. Demo Data / Media Centralization Matrix",
      "17. Runtime / API Readiness Matrix",
      "18. Performance Evidence Matrix",
      "19. Target Execution Map",
      "20. Selected One Task",
      "21. Task Execution Package",
      "22. Files Changed / Patch / Script / Exact Instructions",
      "23. Verification Commands / Results",
      "24. Re-Diagnosis Result",
      "25. Remaining Gaps or BLOCKED_WITH_REASON",
      "26. Screenshot/Visual Evidence Status",
      "27. Human Approval Gate",
      "28. Final Decision"
    )
    Set-Content -LiteralPath (Join-Path $RunRoot "section-verification.txt") -Value ($sections -join "`n") -Encoding UTF8
    foreach ($s in $sections) {
      if ($main.Contains($s)) { Add-Result "required_section:$s" "PASS" "found" } else { Add-Result "required_section:$s" "FAIL" "missing" }
    }
  }

  foreach ($f in @("INSTALL_TARGET_CLOSURE_PACKAGE.ps1","ROLLBACK_PROTOCOL.md","EVIDENCE_STANDARD.md","BTHWANI_AGENT_NAVIGATION_MAP.md","BTHWANI_OPERATOR_FIELD_MANUAL.md","BTHWANI_SOURCE_COVERAGE_MATRIX.md","BTHWANI_TARGET_ARCHETYPE_GUIDE.md","BTHWANI_PERFORMANCE_PLAYBOOK.md","BTHWANI_STRUCTURE_REFACTOR_PLAYBOOK.md","BTHWANI_AGENT_FAILURE_MODES.md","BTHWANI_QUICK_START_FOR_AGENTS.md")) {
    if (Test-Path -LiteralPath (Join-Path $PlanRoot $f)) { Add-Result "hardening_file_present:$f" "PASS" "present" } else { Add-Result "hardening_file_present:$f" "FAIL" "missing" }
  }

  $Results | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8
  $failCount = ($Results | Where-Object { $_.status -eq "FAIL" }).Count
  $warnCount = ($Results | Where-Object { $_.status -eq "WARN" }).Count
  $finalStatus = if ($failCount -eq 0) { "PASS" } else { "FAIL" }

  $summary = @"
status: $finalStatus
package_version: 7.0.0
session_id: $SessionId
repo: $RepoRoot
plan_root: $PlanRoot
strict: $Strict
failed_checks: $failCount
warning_checks: $warnCount
decision: $(if ($finalStatus -eq "PASS") { "PACKAGE_ADOPTABLE_FOR_CONTROLLED_EXECUTION" } else { "PACKAGE_INVALID_DO_NOT_USE" })
"@
  Set-Content -LiteralPath (Join-Path $RunRoot "SUMMARY.txt") -Value $summary -Encoding UTF8

  $zipPath = Join-Path $RunRoot "$SessionId.zip"
  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $zipPath -Force

  Write-Host "RESULT: $finalStatus"
  Write-Host "PACKAGE_VERSION: 7.0.0"
  Write-Host "SESSION_ID: $SessionId"
  Write-Host "EVIDENCE_ROOT: $RunRoot"
  Write-Host "ZIP: $zipPath"
  Write-Host "DECISION: $(if ($finalStatus -eq "PASS") { "PACKAGE_ADOPTABLE_FOR_CONTROLLED_EXECUTION" } else { "PACKAGE_INVALID_DO_NOT_USE" })"
  $Results | Format-Table -AutoSize
  if ($failCount -gt 0) { exit 1 }
} catch {
  $err = $_.Exception.ToString()
  Set-Content -LiteralPath (Join-Path $RunRoot "ERROR.txt") -Value $err -Encoding UTF8
  Write-Host "RESULT: FAIL"
  Write-Host $err
  exit 1
}
