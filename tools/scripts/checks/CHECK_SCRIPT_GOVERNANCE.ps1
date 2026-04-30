Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$IssueCode = "CHECK_SCRIPT_GOVERNANCE"
$SessionId = "$IssueCode-$((Get-Date).ToString("yyyyMMdd-HHmmss"))"
$RepoRoot = (Get-Location).Path
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"

New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

$CommandsLog = Join-Path $EvidenceRoot "commands.log"
$StatusFile = Join-Path $EvidenceRoot "status.txt"
$SummaryFile = Join-Path $EvidenceRoot "SUMMARY.md"
$InventoryCsv = Join-Path $EvidenceRoot "script-inventory.csv"
$InventoryJson = Join-Path $EvidenceRoot "script-inventory.json"
$PackageScriptsCsv = Join-Path $EvidenceRoot "package-scripts.csv"
$PackageScriptsJson = Join-Path $EvidenceRoot "package-scripts.json"
$DuplicatesCsv = Join-Path $EvidenceRoot "duplicate-scripts.csv"
$DuplicatesJson = Join-Path $EvidenceRoot "duplicate-scripts.json"
$ReportFile = Join-Path $EvidenceRoot "script-governance-report.md"
$GitStatusFile = Join-Path $EvidenceRoot "git-status-short.txt"
$GitUntrackedFile = Join-Path $EvidenceRoot "git-untracked.txt"
$GitDiffCheckFile = Join-Path $EvidenceRoot "git-diff-check.txt"

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Content
  )
  $Dir = Split-Path -Parent $Path
  if ($Dir -and -not (Test-Path -LiteralPath $Dir)) {
    New-Item -ItemType Directory -Force -Path $Dir | Out-Null
  }
  $Encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $Encoding)
}

function Add-CommandLog {
  param([Parameter(Mandatory=$true)][string]$Command)
  Add-Content -LiteralPath $CommandsLog -Encoding UTF8 -Value "[$((Get-Date).ToString("s"))] $Command"
}

function Get-RelativePath {
  param([Parameter(Mandatory=$true)][string]$FullPath)
  return ([System.IO.Path]::GetRelativePath($RepoRoot, $FullPath) -replace "\\","/")
}

function Read-TextSafe {
  param([Parameter(Mandatory=$true)][string]$Path)

  try {
    $Info = Get-Item -LiteralPath $Path -ErrorAction Stop
    if ($Info.Length -gt 2MB) {
      return [System.IO.File]::ReadAllText($Path).Substring(0, [Math]::Min(200000, [int]$Info.Length))
    }
    return [System.IO.File]::ReadAllText($Path)
  } catch {
    try {
      return (Get-Content -LiteralPath $Path -Raw -ErrorAction Stop)
    } catch {
      return ""
    }
  }
}

function Get-FirstEffectiveLine {
  param([Parameter(Mandatory=$true)][string]$Text)

  $Lines = $Text -split "`r?`n"
  foreach ($Line in $Lines) {
    $Trimmed = $Line.Trim()
    if ($Trimmed.Length -eq 0) { continue }
    if ($Trimmed.StartsWith("#")) { continue }
    return $Trimmed
  }
  return ""
}

function Has-Match {
  param(
    [Parameter(Mandatory=$true)][string]$Text,
    [Parameter(Mandatory=$true)][string]$Regex
  )
  return [regex]::IsMatch($Text, $Regex, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
}

function Join-Reasons {
  param([string[]]$Reasons)
  if (-not $Reasons -or $Reasons.Count -eq 0) { return "" }
  return (($Reasons | Where-Object { $_ -and $_.Trim().Length -gt 0 } | Select-Object -Unique) -join " | ")
}

Add-CommandLog "git branch --show-current"
$Branch = (& git branch --show-current 2>&1) -join "`n"

Add-CommandLog "git --no-pager status --short"
& git --no-pager status --short 2>&1 | Tee-Object -FilePath $GitStatusFile | Out-Null

Add-CommandLog "git ls-files"
$TrackedFilesRaw = @(& git ls-files 2>$null)

Add-CommandLog "git ls-files --others --exclude-standard"
$UntrackedFilesRaw = @(& git ls-files --others --exclude-standard 2>$null)
$UntrackedFilesRaw | Set-Content -LiteralPath $GitUntrackedFile -Encoding UTF8

Add-CommandLog "git --no-pager diff --check"
& git --no-pager diff --check 2>&1 | Tee-Object -FilePath $GitDiffCheckFile | Out-Null
$GitDiffCheckExit = $LASTEXITCODE

$Tracked = New-Object "System.Collections.Generic.HashSet[string]"
foreach ($Path in $TrackedFilesRaw) {
  [void]$Tracked.Add(($Path -replace "\\","/"))
}

$Untracked = New-Object "System.Collections.Generic.HashSet[string]"
foreach ($Path in $UntrackedFilesRaw) {
  [void]$Untracked.Add(($Path -replace "\\","/"))
}

$ExcludedRegex = "(?i)(^|[\\/])(\.git|node_modules|\.next|\.turbo|\.nx|dist|build|coverage|\.expo|\.gradle|Pods|DerivedData|__pycache__)([\\/]|$)"
$ScriptExt = @(".ps1",".psm1",".psd1",".py",".js",".mjs",".cjs",".ts",".tsx",".sh",".cmd",".bat")

$AllFiles = Get-ChildItem -LiteralPath $RepoRoot -Recurse -File -Force -ErrorAction SilentlyContinue |
  Where-Object {
    $Rel = Get-RelativePath $_.FullName
    $Rel -notmatch $ExcludedRegex
  }

$CandidateFiles = foreach ($File in $AllFiles) {
  $Rel = Get-RelativePath $File.FullName
  $Ext = $File.Extension.ToLowerInvariant()
  $Base = $File.BaseName

  $IsAlwaysScriptExt = $Ext -in @(".ps1",".psm1",".psd1",".py",".sh",".cmd",".bat")
  $IsScriptLikePath = $Rel -match "(?i)(^tools/|^scripts/|^\.github/|/tools/|/scripts/|/bin/|/cli/)"
  $IsScriptLikeName = $Base -match "(?i)^(CHECK|CHECK_ANALYZE|FORENSICS|VERIFY|APPLY|APPLY_VERIFY|GATE|AUDIT|SCAN|DOCTOR|MIGRATE|CODEMOD|FIX|CLEAN|REPAIR|DIAG|DIAGNOSTIC)[\-_]"

  if (($Ext -in $ScriptExt) -and ($IsAlwaysScriptExt -or $IsScriptLikePath -or $IsScriptLikeName)) {
    $File
  }
}

$DangerRules = @(
  @{ Code="DELETE_RECURSIVE"; Regex="\bRemove-Item\b[\s\S]{0,120}\b-Recurse\b[\s\S]{0,120}\b-Force\b|rm\s+-rf|rd\s+/s\s+/q|del\s+/s" },
  @{ Code="GIT_DESTRUCTIVE"; Regex="git\s+(clean\s+-fd|reset\s+--hard|push\s+--force|push\s+-f)" },
  @{ Code="REMOTE_EXEC"; Regex="(Invoke-WebRequest|iwr|curl|wget)[\s\S]{0,120}(\|\s*(iex|sh|bash|powershell)|Invoke-Expression)" },
  @{ Code="SECRET_RISK"; Regex="(?i)(api[_-]?key|secret|password|token)\s*[:=]\s*['""][^'""]{8,}" },
  @{ Code="LOCK_OR_DEP_CHANGE"; Regex="(?i)\b(pnpm|npm|yarn)\s+(add|install|remove|update|upgrade)\b|\bnpx\b" },
  @{ Code="COMMIT_OR_PUSH"; Regex="(?i)\bgit\s+(add|commit|push|merge|rebase|tag)\b" }
)

$WriteRules = @(
  @{ Code="WRITE_FILE"; Regex="\b(Set-Content|Add-Content|Out-File|Export-Csv|ConvertTo-Json|WriteAllText)\b" },
  @{ Code="CREATE_ITEM"; Regex="\bNew-Item\b" },
  @{ Code="MOVE_OR_RENAME"; Regex="\b(Move-Item|Rename-Item)\b" },
  @{ Code="COPY_ITEM"; Regex="\bCopy-Item\b" },
  @{ Code="DELETE_ITEM"; Regex="\bRemove-Item\b" }
)

$LegacyRules = @(
  @{ Code="OLD_LOCAL_PATH"; Regex="C:\\Users\\b\\Documents\\GitHub\\bthwani-suite|C:\\bth\\bthfinal|C:\\bth(?=\\|$)" },
  @{ Code="LEGACY_EVIDENCE_ROOT"; Regex="kdt[\\/]+volatile[\\/]+registry[\\/]+runs" },
  @{ Code="OLD_REPO_TOKEN"; Regex="(?<!bthwani)(^|[^A-Za-z0-9_@-])bth([^A-Za-z0-9_-]|$)" }
)

$Inventory = New-Object System.Collections.Generic.List[object]

foreach ($File in $CandidateFiles) {
  $Rel = Get-RelativePath $File.FullName
  $RelLower = $Rel.ToLowerInvariant()
  $Ext = $File.Extension.ToLowerInvariant()
  $Text = Read-TextSafe -Path $File.FullName
  $FirstLine = Get-FirstEffectiveLine -Text $Text
  $Hash = (Get-FileHash -LiteralPath $File.FullName -Algorithm SHA256).Hash

  $IsTracked = $Tracked.Contains($Rel)
  $IsUntracked = $Untracked.Contains($Rel)
  $IsPowerShell = $Ext -in @(".ps1",".psm1",".psd1")
  $StartsWithSetLocation = (-not $IsPowerShell) -or ($FirstLine -match '^Set-Location\s+-LiteralPath\s+"C:\\bthwani-suite"')
  $UsesCanonicalEvidence = Has-Match -Text $Text -Regex "tools[\\/]+registry[\\/]+runs|\$EvidenceRoot|SessionId|SESSION_ID"
  $UsesOldEvidence = Has-Match -Text $Text -Regex "kdt[\\/]+volatile[\\/]+registry[\\/]+runs"
  $IsCheckFamily = $File.BaseName -match "^(CHECK|CHECK_ANALYZE|FORENSICS|VERIFY|GATE|AUDIT|SCAN|DOCTOR|DIAG|DIAGNOSTIC)[\-_]"
  $IsApplyFamily = $File.BaseName -match "^(APPLY|APPLY_VERIFY|FIX|REPAIR|CLEAN|MIGRATE|CODEMOD)[\-_]"
  $InCanonicalScripts = $Rel -match "^tools/scripts/"
  $InEvidenceRun = $Rel -match "^(tools/registry/runs|kdt/volatile/registry/runs)/"
  $InTempOrArchive = $Rel -match "(?i)(^|/)(old|legacy|archive|archived|deprecated|backup|bak|tmp|temp|scratch)(/|$)|\.(bak|old|tmp)$"
  $InGithubWorkflow = $Rel -match "^\.github/"

  $DangerHits = @()
  foreach ($Rule in $DangerRules) {
    if (Has-Match -Text $Text -Regex $Rule.Regex) { $DangerHits += $Rule.Code }
  }

  $WriteHits = @()
  foreach ($Rule in $WriteRules) {
    if (Has-Match -Text $Text -Regex $Rule.Regex) { $WriteHits += $Rule.Code }
  }

  $LegacyHits = @()
  foreach ($Rule in $LegacyRules) {
    if (Has-Match -Text $Text -Regex $Rule.Regex) { $LegacyHits += $Rule.Code }
  }

  $Reasons = New-Object System.Collections.Generic.List[string]
  $Action = "REVIEW_REQUIRED"
  $Risk = "MEDIUM"

  if ($InEvidenceRun) {
    $Action = "LOCAL_ONLY"
    $Risk = "LOW"
    $Reasons.Add("Generated/local evidence run path; do not commit daily evidence by default.")
  } elseif ($InTempOrArchive) {
    $Action = "DELETE_CANDIDATE"
    $Risk = "MEDIUM"
    $Reasons.Add("Temporary/archive/backup/legacy path or filename; candidate for deletion after reference check.")
  } elseif ($DangerHits.Count -gt 0) {
    $Action = "REVIEW_REQUIRED"
    $Risk = "HIGH"
    $Reasons.Add("Contains high-risk pattern(s): $($DangerHits -join ', ').")
  } elseif ($IsApplyFamily) {
    $Action = "REVIEW_REQUIRED"
    $Risk = "HIGH"
    $Reasons.Add("Write-capable/APPLY-style script; review manually before committing or running.")
  } elseif ($InCanonicalScripts -and $IsCheckFamily -and $StartsWithSetLocation -and $UsesCanonicalEvidence) {
    $Action = "COMMIT_TO_GITHUB"
    $Risk = "LOW"
    $Reasons.Add("Canonical diagnostic/check script with Set-Location and evidence output.")
  } elseif ($InCanonicalScripts -and $StartsWithSetLocation) {
    $Action = "COMMIT_TO_GITHUB"
    $Risk = "MEDIUM"
    $Reasons.Add("Canonical tools/scripts path and PowerShell first-line rule satisfied.")
  } elseif ($InGithubWorkflow) {
    $Action = "COMMIT_TO_GITHUB"
    $Risk = "MEDIUM"
    $Reasons.Add("GitHub automation/config path; should be versioned after review.")
  } elseif (-not $InCanonicalScripts) {
    $Action = "REVIEW_REQUIRED"
    $Risk = "MEDIUM"
    $Reasons.Add("Script exists outside canonical tools/scripts path; decide move/commit/delete.")
  }

  if ($IsPowerShell -and -not $StartsWithSetLocation) {
    $Action = "REVIEW_REQUIRED"
    if ($Risk -eq "LOW") { $Risk = "MEDIUM" }
    $Reasons.Add("PowerShell script does not start with Set-Location -LiteralPath `"C:\bthwani-suite`".")
  }

  if ($UsesOldEvidence) {
    $Action = "REVIEW_REQUIRED"
    if ($Risk -eq "LOW") { $Risk = "MEDIUM" }
    $Reasons.Add("Uses legacy evidence root kdt/volatile/registry/runs.")
  }

  if ($LegacyHits.Count -gt 0) {
    $Action = "REVIEW_REQUIRED"
    if ($Risk -eq "LOW") { $Risk = "MEDIUM" }
    $Reasons.Add("Legacy/drift token(s): $($LegacyHits -join ', ').")
  }

  if ($WriteHits.Count -gt 0 -and $IsCheckFamily -and -not $UsesCanonicalEvidence) {
    $Action = "REVIEW_REQUIRED"
    if ($Risk -eq "LOW") { $Risk = "MEDIUM" }
    $Reasons.Add("CHECK-style script writes files but does not clearly use canonical evidence output.")
  }

  $Inventory.Add([pscustomobject]@{
    RelativePath = $Rel
    FileName = $File.Name
    Extension = $Ext
    SizeBytes = $File.Length
    Sha256 = $Hash
    GitTracked = $IsTracked
    GitUntracked = $IsUntracked
    InCanonicalScripts = $InCanonicalScripts
    InEvidenceRun = $InEvidenceRun
    InTempOrArchive = $InTempOrArchive
    IsCheckFamily = $IsCheckFamily
    IsApplyFamily = $IsApplyFamily
    IsPowerShell = $IsPowerShell
    FirstEffectiveLine = $FirstLine
    StartsWithSetLocation = $StartsWithSetLocation
    UsesCanonicalEvidence = $UsesCanonicalEvidence
    UsesLegacyEvidence = $UsesOldEvidence
    DangerHits = ($DangerHits -join ",")
    WriteHits = ($WriteHits -join ",")
    LegacyHits = ($LegacyHits -join ",")
    DuplicateGroup = ""
    DuplicateRecommendation = ""
    RecommendedAction = $Action
    RiskLevel = $Risk
    Reasons = (Join-Reasons -Reasons $Reasons.ToArray())
  })
}

$DuplicateRows = New-Object System.Collections.Generic.List[object]
$Groups = $Inventory | Group-Object Sha256 | Where-Object { $_.Count -gt 1 }

foreach ($Group in $Groups) {
  $Items = @($Group.Group)
  $Preferred = $Items |
    Sort-Object `
      @{ Expression = { if ($_.InCanonicalScripts) { 0 } else { 1 } } },
      @{ Expression = { if ($_.GitTracked) { 0 } else { 1 } } },
      @{ Expression = { $_.RelativePath.Length } } |
    Select-Object -First 1

  foreach ($Item in $Items) {
    $Item.DuplicateGroup = $Group.Name
    if ($Item.RelativePath -eq $Preferred.RelativePath) {
      $Item.DuplicateRecommendation = "KEEP_PREFERRED_COPY"
      $DuplicateAction = "KEEP_PREFERRED_COPY"
    } else {
      $Item.DuplicateRecommendation = "DELETE_DUPLICATE_AFTER_REFERENCE_CHECK"
      $DuplicateAction = "DELETE_DUPLICATE_AFTER_REFERENCE_CHECK"

      if ($Item.RecommendedAction -eq "COMMIT_TO_GITHUB") {
        $Item.RecommendedAction = "REVIEW_REQUIRED"
      } elseif ($Item.RecommendedAction -ne "LOCAL_ONLY") {
        $Item.RecommendedAction = "DELETE_CANDIDATE"
      }

      $Item.Reasons = (Join-Reasons -Reasons @($Item.Reasons, "Duplicate of $($Preferred.RelativePath); delete only after reference/import check."))
    }

    $DuplicateRows.Add([pscustomobject]@{
      Sha256 = $Group.Name
      RelativePath = $Item.RelativePath
      PreferredPath = $Preferred.RelativePath
      DuplicateAction = $DuplicateAction
      CurrentRecommendation = $Item.RecommendedAction
    })
  }
}

$PackageScripts = New-Object System.Collections.Generic.List[object]
$PackageJsonFiles = $AllFiles | Where-Object { $_.Name -eq "package.json" }

foreach ($PkgFile in $PackageJsonFiles) {
  $Rel = Get-RelativePath $PkgFile.FullName
  try {
    $Json = Get-Content -LiteralPath $PkgFile.FullName -Raw | ConvertFrom-Json -ErrorAction Stop
    if ($Json.scripts) {
      foreach ($Prop in $Json.scripts.PSObject.Properties) {
        $ScriptName = $Prop.Name
        $ScriptValue = [string]$Prop.Value
        $Hits = @()
        if ($ScriptValue -match "(?i)\bnpx\b") { $Hits += "NPX_FORBIDDEN_OR_REVIEW" }
        if ($ScriptValue -match "(?i)git\s+(clean\s+-fd|reset\s+--hard|push\s+--force|push\s+-f)") { $Hits += "GIT_DESTRUCTIVE" }
        if ($ScriptValue -match "(?i)\b(pnpm|npm|yarn)\s+(add|install|remove|update|upgrade)\b") { $Hits += "DEPENDENCY_MUTATION" }
        if ($ScriptValue -match "(?i)(rm\s+-rf|Remove-Item.+-Recurse.+-Force|rd\s+/s\s+/q)") { $Hits += "DELETE_RECURSIVE" }

        $Action = if ($Hits.Count -gt 0) { "REVIEW_REQUIRED" } else { "COMMIT_TO_GITHUB" }
        $Risk = if ($Hits.Count -gt 0) { "HIGH" } else { "LOW" }

        $PackageScripts.Add([pscustomobject]@{
          PackageJson = $Rel
          ScriptName = $ScriptName
          ScriptValue = $ScriptValue
          Hits = ($Hits -join ",")
          RecommendedAction = $Action
          RiskLevel = $Risk
        })
      }
    }
  } catch {
    $PackageScripts.Add([pscustomobject]@{
      PackageJson = $Rel
      ScriptName = "__PARSE_ERROR__"
      ScriptValue = $_.Exception.Message
      Hits = "PACKAGE_JSON_PARSE_ERROR"
      RecommendedAction = "REVIEW_REQUIRED"
      RiskLevel = "HIGH"
    })
  }
}

$InventorySorted = $Inventory | Sort-Object RecommendedAction, RiskLevel, RelativePath
$InventorySorted | Export-Csv -LiteralPath $InventoryCsv -NoTypeInformation -Encoding UTF8
$InventorySorted | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $InventoryJson -Encoding UTF8

$PackageScripts | Sort-Object RecommendedAction, PackageJson, ScriptName | Export-Csv -LiteralPath $PackageScriptsCsv -NoTypeInformation -Encoding UTF8
$PackageScripts | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $PackageScriptsJson -Encoding UTF8

$DuplicateRows | Sort-Object Sha256, RelativePath | Export-Csv -LiteralPath $DuplicatesCsv -NoTypeInformation -Encoding UTF8
$DuplicateRows | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $DuplicatesJson -Encoding UTF8

$Counts = $Inventory | Group-Object RecommendedAction | Sort-Object Name
$RiskCounts = $Inventory | Group-Object RiskLevel | Sort-Object Name
$PackageCounts = $PackageScripts | Group-Object RecommendedAction | Sort-Object Name

function Format-ListBlock {
  param(
    [object[]]$Rows,
    [string]$EmptyText
  )
  if (-not $Rows -or $Rows.Count -eq 0) { return "- $EmptyText`n" }
  $Out = ""
  foreach ($Row in $Rows) {
    $Reason = if ($Row.Reasons) { " — $($Row.Reasons)" } else { "" }
    $Out += "- `$($Row.RelativePath)` [$($Row.RiskLevel)]$Reason`n"
  }
  return $Out
}

$CommitRows = @($Inventory | Where-Object { $_.RecommendedAction -eq "COMMIT_TO_GITHUB" } | Sort-Object RelativePath)
$LocalRows = @($Inventory | Where-Object { $_.RecommendedAction -eq "LOCAL_ONLY" } | Sort-Object RelativePath)
$DeleteRows = @($Inventory | Where-Object { $_.RecommendedAction -eq "DELETE_CANDIDATE" } | Sort-Object RelativePath)
$ReviewRows = @($Inventory | Where-Object { $_.RecommendedAction -eq "REVIEW_REQUIRED" } | Sort-Object RiskLevel, RelativePath)

$Report = @"
# Script Governance Diagnostic Report

Session: `$SessionId`
IssueCode: `$IssueCode`
Branch: `$Branch`
RepoRoot: `$RepoRoot`
Generated: $((Get-Date).ToString("yyyy-MM-dd HH:mm:ss"))

## Decision Meaning

- `COMMIT_TO_GITHUB`: سكربت مناسب مبدئيًا للرفع بعد مراجعة التقرير.
- `LOCAL_ONLY`: مخرجات/أدلة/تجارب محلية لا تُرفع افتراضيًا.
- `DELETE_CANDIDATE`: مرشح حذف فقط بعد مراجعة references/imports والنسخة المفضلة.
- `REVIEW_REQUIRED`: يحتاج مراجعة يدوية قبل قرار الرفع أو الحذف.

## Counts by Recommendation

$(
  if ($Counts) {
    ($Counts | ForEach-Object { "- $($_.Name): $($_.Count)" }) -join "`n"
  } else {
    "- No script candidates found."
  }
)

## Counts by Risk

$(
  if ($RiskCounts) {
    ($RiskCounts | ForEach-Object { "- $($_.Name): $($_.Count)" }) -join "`n"
  } else {
    "- No risk counts."
  }
)

## Package.json Scripts Counts

$(
  if ($PackageCounts) {
    ($PackageCounts | ForEach-Object { "- $($_.Name): $($_.Count)" }) -join "`n"
  } else {
    "- No package.json scripts found."
  }
)

## COMMIT_TO_GITHUB

$(Format-ListBlock -Rows $CommitRows -EmptyText "No commit-ready script candidates.")

## LOCAL_ONLY

$(Format-ListBlock -Rows $LocalRows -EmptyText "No local-only script candidates.")

## DELETE_CANDIDATE

$(Format-ListBlock -Rows $DeleteRows -EmptyText "No delete candidates.")

## REVIEW_REQUIRED

$(Format-ListBlock -Rows $ReviewRows -EmptyText "No review-required script candidates.")

## Evidence Files

- `script-inventory.csv`
- `script-inventory.json`
- `package-scripts.csv`
- `package-scripts.json`
- `duplicate-scripts.csv`
- `duplicate-scripts.json`
- `git-status-short.txt`
- `git-untracked.txt`
- `git-diff-check.txt`
- `commands.log`
- `status.txt`

## Strict Notes

- هذا السكربت لا يحذف ولا يعدل السكربتات.
- أي `DELETE_CANDIDATE` ليس إذن حذف.
- أي `COMMIT_TO_GITHUB` يحتاج مراجعة قبل commit.
- أي `REVIEW_REQUIRED` يحتاج قرار يدوي أو سكربت CHECK أعمق.
- الأدلة اليومية تحت `tools/registry/runs` تبقى محلية افتراضيًا.
"@

Write-Utf8NoBom -Path $ReportFile -Content $Report

$Status = if ($GitDiffCheckExit -eq 0) { "PASS_WITH_REVIEW_REQUIRED" } else { "FAIL_GIT_DIFF_CHECK" }

$Summary = @"
# $IssueCode Summary

Status: `$Status`
SessionId: `$SessionId`
EvidenceRoot: `$EvidenceRoot`

## Key Outputs

- Report: `$ReportFile`
- Inventory CSV: `$InventoryCsv`
- Package scripts CSV: `$PackageScriptsCsv`
- Duplicates CSV: `$DuplicatesCsv`

## Counts

- Script candidates: $($Inventory.Count)
- Package.json scripts: $($PackageScripts.Count)
- Duplicate rows: $($DuplicateRows.Count)
- COMMIT_TO_GITHUB: $(@($Inventory | Where-Object { $_.RecommendedAction -eq "COMMIT_TO_GITHUB" }).Count)
- LOCAL_ONLY: $(@($Inventory | Where-Object { $_.RecommendedAction -eq "LOCAL_ONLY" }).Count)
- DELETE_CANDIDATE: $(@($Inventory | Where-Object { $_.RecommendedAction -eq "DELETE_CANDIDATE" }).Count)
- REVIEW_REQUIRED: $(@($Inventory | Where-Object { $_.RecommendedAction -eq "REVIEW_REQUIRED" }).Count)

## Next

Upload these files to ChatGPT for review:
- `SUMMARY.md`
- `script-governance-report.md`
- `script-inventory.csv`
- `package-scripts.csv`
- `duplicate-scripts.csv`
- `git-status-short.txt`
- `git-untracked.txt`
- `git-diff-check.txt`
"@

Write-Utf8NoBom -Path $SummaryFile -Content $Summary
Write-Utf8NoBom -Path $StatusFile -Content $Status

Write-Host ""
Write-Host "=============================="
Write-Host "$IssueCode"
Write-Host "Status: $Status"
Write-Host "EvidenceRoot: $EvidenceRoot"
Write-Host "Report: $ReportFile"
Write-Host "=============================="
Write-Host ""
Write-Host "Counts:"
Write-Host "  Script candidates: $($Inventory.Count)"
Write-Host "  COMMIT_TO_GITHUB: $(@($Inventory | Where-Object { $_.RecommendedAction -eq 'COMMIT_TO_GITHUB' }).Count)"
Write-Host "  LOCAL_ONLY: $(@($Inventory | Where-Object { $_.RecommendedAction -eq 'LOCAL_ONLY' }).Count)"
Write-Host "  DELETE_CANDIDATE: $(@($Inventory | Where-Object { $_.RecommendedAction -eq 'DELETE_CANDIDATE' }).Count)"
Write-Host "  REVIEW_REQUIRED: $(@($Inventory | Where-Object { $_.RecommendedAction -eq 'REVIEW_REQUIRED' }).Count)"
Write-Host ""
Write-Host "Open this file first:"
Write-Host "  $ReportFile"
Write-Host ""
