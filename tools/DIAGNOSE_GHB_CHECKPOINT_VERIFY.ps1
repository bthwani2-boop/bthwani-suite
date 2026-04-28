#Requires -Version 5.1
[CmdletBinding()]
param(
    [string]$RepoRoot = 'C:\bthwani-suite'
)

Set-Location -LiteralPath $RepoRoot
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$Script:ToolName = 'DIAGNOSE_GHB_CHECKPOINT_VERIFY'
$Script:StartedAt = Get-Date
$Script:TargetScriptPath = Join-Path $RepoRoot 'tools\GHB_CHECKPOINT_VERIFY.ps1'
$Script:SessionId = "$($Script:ToolName)-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$Script:EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$($Script:SessionId)"
New-Item -ItemType Directory -Force -Path $Script:EvidenceRoot | Out-Null
$Script:CommandsLogPath = Join-Path $Script:EvidenceRoot 'commands.log'
$Script:SummaryPath = Join-Path $Script:EvidenceRoot 'SUMMARY.md'
$Script:EvidenceJsonPath = Join-Path $Script:EvidenceRoot 'evidence.json'
$Script:StatusPath = Join-Path $Script:EvidenceRoot 'status.txt'
$Script:Findings = New-Object System.Collections.ArrayList
$Script:Blockers = New-Object System.Collections.ArrayList
$Script:Warnings = New-Object System.Collections.ArrayList
$Script:Facts = [ordered]@{}

function Write-Log { param([string]$Text) Add-Content -LiteralPath $Script:CommandsLogPath -Value ('[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Text) -Encoding UTF8 }
function Write-Section { param([string]$Title) Write-Host ''; Write-Host "== $Title =="; Write-Log "== $Title ==" }
function Add-Finding {
    param([string]$Name, [ValidateSet('PASS','WARN','FAIL','INFO')][string]$Status, [string]$Details = '')
    [void]$Script:Findings.Add([ordered]@{ name = $Name; status = $Status; details = [string]$Details })
    if ($Status -eq 'FAIL') { [void]$Script:Blockers.Add(("{0}: {1}" -f $Name, $Details)) }
    elseif ($Status -eq 'WARN') { [void]$Script:Warnings.Add(("{0}: {1}" -f $Name, $Details)) }
}
function Invoke-External {
    param([string]$FilePath, [string[]]$Arguments, [string]$StepName = '', [switch]$AllowFailure)
    $cmd = "$FilePath $($Arguments -join ' ')"
    if ($StepName) { Write-Log "STEP: $StepName" }
    Write-Log "RUN: $cmd"
    $output = @(& $FilePath @Arguments 2>&1)
    $exitCode = $LASTEXITCODE
    foreach ($line in $output) { Write-Log "OUT: $([string]$line)" }
    Write-Log "EXIT($exitCode): $cmd"
    if ($exitCode -ne 0 -and -not $AllowFailure) { throw "$cmd failed with exit code $exitCode." }
    return @{ exit_code = $exitCode; output = @($output | ForEach-Object { [string]$_ }) }
}
function Git { param([string[]]$Arguments, [string]$StepName = '', [switch]$AllowFailure) return Invoke-External -FilePath 'git' -Arguments $Arguments -StepName $StepName -AllowFailure:$AllowFailure }
function First-Line { param($Result) return (($Result['output'] | Select-Object -First 1) | Out-String).Trim() }
function Latest-GhbEvidenceRoot {
    $runs = Join-Path $RepoRoot 'tools\registry\runs'
    if (-not (Test-Path -LiteralPath $runs -PathType Container)) { return $null }
    $items = @(Get-ChildItem -LiteralPath $runs -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like 'GHB_CHECKPOINT_VERIFY-*' } | Sort-Object LastWriteTime -Descending)
    if ($items.Count -eq 0) { return $null }
    return $items[0].FullName
}

try {
    Write-Section 'START'
    Write-Section 'REPO STATE'
    $top = First-Line -Result (Git -Arguments @('rev-parse','--show-toplevel') -StepName 'repo top')
    $branch = First-Line -Result (Git -Arguments @('branch','--show-current') -StepName 'branch')
    $Script:Facts['repo_root_detected'] = $top
    $Script:Facts['current_branch'] = $branch
    Write-Host "current_branch: $branch"
    Add-Finding -Name 'repo root' -Status 'PASS' -Details $top
    if ($branch -eq 'main' -or $branch -eq 'master') { Add-Finding -Name 'current branch safety' -Status 'WARN' -Details $branch } else { Add-Finding -Name 'current branch safety' -Status 'PASS' -Details $branch }

    $status = Git -Arguments @('status','--short') -StepName 'status' -AllowFailure
    Set-Content -LiteralPath (Join-Path $Script:EvidenceRoot 'git-status-short.txt') -Value $status['output'] -Encoding UTF8
    $statusLines = @($status['output'] | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    if ($statusLines.Count -eq 0) { Add-Finding -Name 'working tree' -Status 'PASS' -Details 'Clean.' } else { Add-Finding -Name 'working tree' -Status 'WARN' -Details ("Working tree has {0} entries." -f $statusLines.Count) }

    $diff = Git -Arguments @('diff','--check') -StepName 'working tree diff check' -AllowFailure
    Set-Content -LiteralPath (Join-Path $Script:EvidenceRoot 'git-diff-check-working-tree.txt') -Value $diff['output'] -Encoding UTF8
    if ($diff['exit_code'] -eq 0) { Add-Finding -Name 'working tree git diff --check' -Status 'PASS' -Details 'No whitespace/conflict-marker issues in working tree diff.' } else { Add-Finding -Name 'working tree git diff --check' -Status 'FAIL' -Details ((@($diff['output']) | Select-Object -First 20) -join '; ') }

    $log = Git -Arguments @('log','-1','--oneline') -StepName 'last commit' -AllowFailure
    if ($log['exit_code'] -eq 0) { Add-Finding -Name 'last commit' -Status 'INFO' -Details (First-Line -Result $log) }

    Write-Section 'LATEST GHB EVIDENCE'
    $latest = Latest-GhbEvidenceRoot
    if ($latest) {
        $Script:Facts['latest_ghb_evidence_root'] = $latest
        Write-Host "latest_ghb_evidence_root: $latest"
        Add-Finding -Name 'latest ghb evidence' -Status 'INFO' -Details $latest
        $latestStatus = Join-Path $latest 'status.txt'
        if (Test-Path -LiteralPath $latestStatus -PathType Leaf) {
            $value = (Get-Content -LiteralPath $latestStatus -Raw -Encoding UTF8).Trim()
            $Script:Facts['latest_ghb_status'] = $value
            if ($value -eq 'FAILED') { Add-Finding -Name 'latest ghb status' -Status 'WARN' -Details 'Latest ghb run failed.' } else { Add-Finding -Name 'latest ghb status' -Status 'INFO' -Details $value }
        }
    } else {
        Add-Finding -Name 'latest ghb evidence' -Status 'WARN' -Details 'No previous GHB evidence found.'
    }

    Write-Section 'TARGET SCRIPT STATIC CHECK'
    if (-not (Test-Path -LiteralPath $Script:TargetScriptPath -PathType Leaf)) {
        Add-Finding -Name 'target script exists' -Status 'FAIL' -Details $Script:TargetScriptPath
    } else {
        Add-Finding -Name 'target script exists' -Status 'PASS' -Details $Script:TargetScriptPath
        Copy-Item -LiteralPath $Script:TargetScriptPath -Destination (Join-Path $Script:EvidenceRoot 'target-GHB_CHECKPOINT_VERIFY.ps1') -Force
        $tokens = $null
        $errors = $null
        [void][System.Management.Automation.Language.Parser]::ParseFile($Script:TargetScriptPath, [ref]$tokens, [ref]$errors)
        if ($errors -and $errors.Count -gt 0) {
            $parseLines = @($errors | ForEach-Object { "Line $($_.Extent.StartLineNumber): $($_.Message)" })
            Set-Content -LiteralPath (Join-Path $Script:EvidenceRoot 'target-parse-errors.txt') -Value $parseLines -Encoding UTF8
            Add-Finding -Name 'PowerShell parser' -Status 'FAIL' -Details ("Parser errors: {0}" -f $errors.Count)
        } else {
            Add-Finding -Name 'PowerShell parser' -Status 'PASS' -Details 'No parser errors detected.'
        }
        $help = Invoke-External -FilePath 'powershell' -Arguments @('-NoProfile','-ExecutionPolicy','Bypass','-File',$Script:TargetScriptPath,'-Help') -StepName 'target help' -AllowFailure
        Set-Content -LiteralPath (Join-Path $Script:EvidenceRoot 'target-help-output.txt') -Value $help['output'] -Encoding UTF8
        if ($help['exit_code'] -eq 0) { Add-Finding -Name 'target -Help' -Status 'PASS' -Details 'Exit code 0.' } else { Add-Finding -Name 'target -Help' -Status 'FAIL' -Details ("Exit code {0}" -f $help['exit_code']) }
    }
} catch {
    Add-Finding -Name 'diagnostic fatal error' -Status 'FAIL' -Details $_.Exception.Message
}

$finalStatus = if ($Script:Blockers.Count -gt 0) { 'BLOCKED' } elseif ($Script:Warnings.Count -gt 0) { 'PASS_WITH_WARNINGS' } else { 'PASS' }
$recommendation = if ($finalStatus -eq 'BLOCKED') { 'FIX_TARGET_SCRIPT_BEFORE_RERUN_GHB' } elseif ($finalStatus -eq 'PASS_WITH_WARNINGS') { 'READY_FOR_CONTROLLED_RETRY_AFTER_REVIEW' } else { 'READY_FOR_CONTROLLED_GHB_RETRY' }
$data = [ordered]@{
    tool = $Script:ToolName
    started_at = $Script:StartedAt.ToString('o')
    finished_at = (Get-Date).ToString('o')
    repo_root = $RepoRoot
    target_script = $Script:TargetScriptPath
    evidence_root = $Script:EvidenceRoot
    status = $finalStatus
    facts = $Script:Facts
    findings = @($Script:Findings)
    blockers = @($Script:Blockers)
    warnings = @($Script:Warnings)
    recommendation = $recommendation
    safety = 'Read-only diagnostic. No commit, push, branch switch, PR, merge, promote, force push, branch deletion, or file deletion was performed.'
}
$data | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $Script:EvidenceJsonPath -Encoding UTF8
Set-Content -LiteralPath $Script:StatusPath -Value $finalStatus -Encoding UTF8
$lines = New-Object System.Collections.ArrayList
[void]$lines.Add('# GHB Deep Diagnostic Summary')
[void]$lines.Add('')
[void]$lines.Add('| Field | Value |')
[void]$lines.Add('|---|---|')
[void]$lines.Add(("| Status | {0} |" -f $finalStatus))
[void]$lines.Add(("| Recommendation | {0} |" -f $recommendation))
[void]$lines.Add(("| Evidence root | {0} |" -f $Script:EvidenceRoot))
[void]$lines.Add(("| Target script | {0} |" -f $Script:TargetScriptPath))
[void]$lines.Add('')
[void]$lines.Add('## Findings')
foreach ($f in @($Script:Findings)) { [void]$lines.Add(("- **{0}**: `{1}` - {2}" -f $f['name'], $f['status'], $f['details'])) }
[void]$lines.Add('')
[void]$lines.Add('## Blockers')
if ($Script:Blockers.Count -eq 0) { [void]$lines.Add('- None') } else { foreach ($b in @($Script:Blockers)) { [void]$lines.Add(("- {0}" -f $b)) } }
[void]$lines.Add('')
[void]$lines.Add('## Warnings')
if ($Script:Warnings.Count -eq 0) { [void]$lines.Add('- None') } else { foreach ($w in @($Script:Warnings)) { [void]$lines.Add(("- {0}" -f $w)) } }
[void]$lines.Add('')
[void]$lines.Add('## Safety')
[void]$lines.Add('This diagnostic performed no commit, push, branch switch, PR, merge, promote, force push, branch deletion, or file deletion.')
Set-Content -LiteralPath $Script:SummaryPath -Value @($lines) -Encoding UTF8
Write-Section 'RESULT'
Write-Host "status: $finalStatus"
Write-Host "recommendation: $recommendation"
Write-Host "evidence_root: $($Script:EvidenceRoot)"
if ($finalStatus -eq 'BLOCKED') { exit 2 }
if ($finalStatus -eq 'PASS_WITH_WARNINGS') { exit 1 }
exit 0
