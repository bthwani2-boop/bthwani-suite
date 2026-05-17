#Requires -Version 5.1
[CmdletBinding()]
param(
    [string]$Message,
    [string]$BranchName,
    [ValidateSet('Quick','Standard','Full')][string]$VerifyLevel = 'Standard',
    [switch]$NoPush,
    [switch]$AllowEmpty,
    [switch]$AllowMain,
    [switch]$Help
)

Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if ($Help) {
    Write-Host 'GHB_CHECKPOINT_VERIFY.ps1'
    Write-Host ''
    Write-Host 'Safe checkpoint + branch + verify + recommendation.'
    Write-Host ''
    Write-Host 'Usage:'
    Write-Host '  powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\scripts\GHB_CHECKPOINT_VERIFY.ps1"'
    Write-Host '  powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\scripts\GHB_CHECKPOINT_VERIFY.ps1" -VerifyLevel Quick'
    Write-Host '  powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\scripts\GHB_CHECKPOINT_VERIFY.ps1" -Message "chore: checkpoint packages surfaces"'
    Write-Host ''
    Write-Host 'Safety:'
    Write-Host '  This script does not merge, promote, open PRs, force push, delete branches, or modify main/stable.'
    exit 0
}

$Script:RepoRoot = 'C:\bthwani-suite'
$Script:ToolName = 'GHB_CHECKPOINT_VERIFY'
$Script:StartedAt = Get-Date
$Script:SessionId = "$($Script:ToolName)-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$Script:EvidenceRoot = Join-Path $Script:RepoRoot "tools\registry\runs\$($Script:SessionId)"
New-Item -ItemType Directory -Force -Path $Script:EvidenceRoot | Out-Null

$Script:CommandsLogPath = Join-Path $Script:EvidenceRoot 'commands.log'
$Script:SummaryPath = Join-Path $Script:EvidenceRoot 'SUMMARY.md'
$Script:EvidenceJsonPath = Join-Path $Script:EvidenceRoot 'evidence.json'
$Script:StatusPath = Join-Path $Script:EvidenceRoot 'status.txt'

$Script:Verification = New-Object System.Collections.ArrayList
$Script:Blockers = New-Object System.Collections.ArrayList
$Script:Warnings = New-Object System.Collections.ArrayList
$Script:Facts = [ordered]@{}

function Add-CommandLog {
    param([Parameter(Mandatory = $true)][string]$Text)
    $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Text
    Add-Content -LiteralPath $Script:CommandsLogPath -Value $line -Encoding UTF8
}

function Write-Section {
    param([Parameter(Mandatory = $true)][string]$Title)
    Write-Host ''
    Write-Host "== $Title =="
    Add-CommandLog "== $Title =="
}

function Add-Verification {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][ValidateSet('PASS','WARN','FAIL','INFO','SKIP')][string]$Status,
        [string]$Details = ''
    )
    $detailText = [string]$Details
    [void]$Script:Verification.Add([ordered]@{
        name = [string]$Name
        status = [string]$Status
        details = $detailText
    })
    if ($Status -eq 'FAIL') {
        [void]$Script:Blockers.Add(("{0}: {1}" -f $Name, $detailText))
    } elseif ($Status -eq 'WARN') {
        [void]$Script:Warnings.Add(("{0}: {1}" -f $Name, $detailText))
    }
}

function Invoke-External {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [string]$StepName = '',
        [switch]$AllowFailure
    )
    $cmdText = "$FilePath $($Arguments -join ' ')"
    if (-not [string]::IsNullOrWhiteSpace($StepName)) { Add-CommandLog "STEP: $StepName" }
    Add-CommandLog "RUN: $cmdText"
    $output = & {
        $ErrorActionPreference = 'Continue'
        @(& $FilePath @Arguments 2>&1)
    }
    $exitCode = $LASTEXITCODE
    foreach ($line in $output) { Add-CommandLog "OUT: $([string]$line)" }
    Add-CommandLog "EXIT($exitCode): $cmdText"
    if ($exitCode -ne 0 -and -not $AllowFailure) {
        throw "$cmdText failed with exit code $exitCode."
    }
    return @{ command = $cmdText; exit_code = $exitCode; output = @($output | ForEach-Object { [string]$_ }) }
}

function Invoke-Git {
    param(
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [string]$StepName = '',
        [switch]$AllowFailure
    )
    return Invoke-External -FilePath 'git' -Arguments $Arguments -StepName $StepName -AllowFailure:$AllowFailure
}

function First-Line {
    param($Result)
    return (($Result['output'] | Select-Object -First 1) | Out-String).Trim()
}

function Assert-NoGitOperationInProgress {
    $gitDirResult = Invoke-Git -Arguments @('rev-parse', '--git-dir') -StepName 'git dir'
    $gitDir = First-Line -Result $gitDirResult
    if (-not [System.IO.Path]::IsPathRooted($gitDir)) { $gitDir = Join-Path $Script:RepoRoot $gitDir }
    $checks = @(
        @{ name = 'merge'; path = Join-Path $gitDir 'MERGE_HEAD' },
        @{ name = 'cherry-pick'; path = Join-Path $gitDir 'CHERRY_PICK_HEAD' },
        @{ name = 'rebase-merge'; path = Join-Path $gitDir 'rebase-merge' },
        @{ name = 'rebase-apply'; path = Join-Path $gitDir 'rebase-apply' }
    )
    foreach ($check in $checks) {
        if (Test-Path -LiteralPath $check['path']) { throw "Git $($check['name']) is in progress. Resolve or abort before ghb." }
    }
}

function Get-ChangedPaths {
    $result = Invoke-Git -Arguments @('status', '--porcelain') -StepName 'changed paths' -AllowFailure
    $paths = New-Object System.Collections.ArrayList
    foreach ($line in @($result['output'])) {
        if ([string]::IsNullOrWhiteSpace($line) -or $line.Length -lt 4) { continue }
        $entry = $line.Substring(3).Trim()
        if ($entry -match ' -> ') { $entry = ($entry -split ' -> ')[-1].Trim() }
        if (-not [string]::IsNullOrWhiteSpace($entry)) { [void]$paths.Add($entry) }
    }
    return @($paths)
}

function Get-CheckpointMessage {
    param([string[]]$ChangedPaths)
    if (-not $ChangedPaths -or $ChangedPaths.Count -eq 0) { return 'chore: checkpoint' }
    $roots = @(
        $ChangedPaths |
            ForEach-Object { ($_ -split '[\\/]', 2)[0].ToLowerInvariant() } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            Select-Object -Unique |
            Select-Object -First 3
    )
    if (-not $roots -or $roots.Count -eq 0) { return 'chore: checkpoint' }
    return "chore: checkpoint $($roots -join '-')"
}

function Get-BranchSlug {
    param([string]$Text, [string[]]$ChangedPaths)

    $source = [string]$Text

    if ([string]::IsNullOrWhiteSpace($source) -and $ChangedPaths -and $ChangedPaths.Count -gt 0) {
        $top = @(
            $ChangedPaths |
                ForEach-Object { ($_ -split '[\\/]', 2)[0].ToLowerInvariant() } |
                Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
                Select-Object -Unique |
                Select-Object -First 2
        )
        if ($top.Count -gt 0) { $source = ($top -join '-') }
    }

    if ([string]::IsNullOrWhiteSpace($source)) {
        $source = 'checkpoint'
    }

    $value = $source.ToLowerInvariant()
    $value = $value -replace '^(feat|fix|chore|refactor|docs|test|ci|build|style|perf):\s*', ''
    $value = $value -replace '\b(checkpoint|finalize|repair|workflow|tools|script|scripts)\b', ''
    $value = $value -replace '[^a-z0-9]+', '-'
    $value = $value.Trim('-')

    if ([string]::IsNullOrWhiteSpace($value)) {
        $value = 'checkpoint'
    }

    # Keep branch names short and practical.
    if ($value.Length -gt 32) {
        $value = $value.Substring(0, 32).TrimEnd('-')
    }

    if ([string]::IsNullOrWhiteSpace($value)) {
        $value = 'checkpoint'
    }

    return $value
}

function Get-NextGhbSequenceNumber {
    Invoke-Git -Arguments @('fetch', '--prune', 'origin') -StepName 'fetch origin branches' -AllowFailure | Out-Null

    $result = Invoke-Git -Arguments @('branch', '-a') -StepName 'list branches' -AllowFailure
    $max = 0

    foreach ($raw in @($result['output'])) {
        $name = ([string]$raw).Trim()
        if ($name.StartsWith('*')) { $name = $name.Substring(1).Trim() }
        if ($name -match '^remotes/[^/]+/(.+)$') { $name = $Matches[1] }

        # Accepted ghb sequence formats:
        #   ghb/(99)-...
        #   ghb/0099-...
        #   ghb/0100-...
        #
        # Rejected as sequence:
        #   ghb/20260408-...  => date-like mistake, not a sequence.
        if ($name -match '^ghb/\(([0-9]{1,4})\)-') {
            $n = [int]$Matches[1]
            if ($n -gt $max) { $max = $n }
            continue
        }

        if ($name -match '^ghb/([0-9]{4})-') {
            $candidate = [int]$Matches[1]

            # Reject date-like accidental branch names such as 20260408.
            if ($candidate -ge 1 -and $candidate -le 9999) {
                $n = $candidate
                if ($n -gt $max) { $max = $n }
            }
            continue
        }
    }

    return ($max + 1)
}

function Test-PackageScriptPaths {
    $packagePath = Join-Path $Script:RepoRoot 'package.json'
    if (-not (Test-Path -LiteralPath $packagePath -PathType Leaf)) {
        Add-Verification -Name 'package.json scripts' -Status 'WARN' -Details 'Root package.json was not found.'
        return
    }
    try {
        $pkg = Get-Content -LiteralPath $packagePath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($null -eq $pkg.scripts) {
            Add-Verification -Name 'package.json scripts' -Status 'INFO' -Details 'No scripts object found.'
            return
        }
        $missing = New-Object System.Collections.ArrayList
        $scriptProps = $pkg.scripts.PSObject.Properties
        foreach ($prop in $scriptProps) {
            $value = [string]$prop.Value
            $matches = [regex]::Matches($value, 'tools[\\/][^\s"''&|;]+')
            foreach ($m in $matches) {
                $rel = ([string]$m.Value).Trim().Trim('"').Trim("'")
                $candidate = Join-Path $Script:RepoRoot ($rel -replace '/', '\')
                if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
                    [void]$missing.Add(("{0} -> {1}" -f $prop.Name, $rel))
                }
            }
        }
        if ($missing.Count -gt 0) {
            Add-Verification -Name 'package.json script paths' -Status 'WARN' -Details ((@($missing) | Select-Object -First 20) -join '; ')
        } else {
            Add-Verification -Name 'package.json script paths' -Status 'PASS' -Details 'All detected tools/* script paths exist.'
        }
    } catch {
        Add-Verification -Name 'package.json scripts' -Status 'FAIL' -Details $_.Exception.Message
    }
}

function Run-Verify {
    param([string]$Level)
    Write-Section 'VERIFY'
    $statusResult = Invoke-Git -Arguments @('status', '--short') -StepName 'post-checkout status' -AllowFailure
    $statusLines = @($statusResult['output'] | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    if ($statusResult['exit_code'] -eq 0 -and $statusLines.Count -eq 0) {
        Add-Verification -Name 'git status' -Status 'PASS' -Details 'Working tree is clean before evidence files are written.'
    } elseif ($statusResult['exit_code'] -eq 0) {
        Add-Verification -Name 'git status' -Status 'WARN' -Details ("Working tree has {0} entries after checkpoint." -f $statusLines.Count)
    } else {
        Add-Verification -Name 'git status' -Status 'FAIL' -Details 'git status failed.'
    }

    $parentResult = Invoke-Git -Arguments @('rev-parse', '--verify', 'HEAD~1') -StepName 'resolve HEAD parent' -AllowFailure
    if ($parentResult['exit_code'] -eq 0) {
        $parent = First-Line -Result $parentResult
        $head = First-Line -Result (Invoke-Git -Arguments @('rev-parse', 'HEAD') -StepName 'resolve HEAD')
        $diffCheck = Invoke-Git -Arguments @('diff', '--check', "$parent..$head") -StepName 'git diff check checkpoint commit' -AllowFailure
        Set-Content -LiteralPath (Join-Path $Script:EvidenceRoot 'git-diff-check.txt') -Value $diffCheck['output'] -Encoding UTF8
        if ($diffCheck['exit_code'] -eq 0) {
            Add-Verification -Name 'git diff --check' -Status 'PASS' -Details 'No whitespace or conflict-marker issues in checkpoint commit.'
        } else {
            $detail = [string]((@($diffCheck['output']) | Select-Object -First 20) -join '; ')
            Add-Verification -Name 'git diff --check' -Status 'FAIL' -Details $detail
        }
    } else {
        Add-Verification -Name 'git diff --check' -Status 'WARN' -Details 'Could not resolve HEAD~1.'
    }

    Test-PackageScriptPaths

    if ($Level -eq 'Quick') {
        Add-Verification -Name 'TypeScript' -Status 'SKIP' -Details 'Skipped because VerifyLevel=Quick.'
        return
    }

    $tsc = Invoke-External -FilePath 'pnpm' -Arguments @('-w', 'exec', 'tsc', '--noEmit') -StepName 'typescript noEmit' -AllowFailure
    Set-Content -LiteralPath (Join-Path $Script:EvidenceRoot 'tsc-noEmit.txt') -Value $tsc['output'] -Encoding UTF8
    if ($tsc['exit_code'] -eq 0) {
        Add-Verification -Name 'TypeScript' -Status 'PASS' -Details 'pnpm -w exec tsc --noEmit passed.'
    } else {
        $detail = [string]((@($tsc['output']) | Select-Object -First 30) -join '; ')
        Add-Verification -Name 'TypeScript' -Status 'FAIL' -Details $detail
    }

    if ($Level -eq 'Full') {
        $pkgPath = Join-Path $Script:RepoRoot 'package.json'
        if (Test-Path -LiteralPath $pkgPath -PathType Leaf) {
            $pkg = Get-Content -LiteralPath $pkgPath -Raw -Encoding UTF8 | ConvertFrom-Json
            $guardNames = @($pkg.scripts.PSObject.Properties | Where-Object { $_.Name -like 'guard:*' } | ForEach-Object { $_.Name })
            foreach ($guard in $guardNames) {
                $guardResult = Invoke-External -FilePath 'pnpm' -Arguments @('run', $guard) -StepName "root script $guard" -AllowFailure
                Set-Content -LiteralPath (Join-Path $Script:EvidenceRoot ("root-script-$($guard -replace ':','-').txt")) -Value $guardResult['output'] -Encoding UTF8
                if ($guardResult['exit_code'] -eq 0) {
                    Add-Verification -Name "root script $guard" -Status 'PASS' -Details 'Passed.'
                } else {
                    Add-Verification -Name "root script $guard" -Status 'FAIL' -Details ((@($guardResult['output']) | Select-Object -First 20) -join '; ')
                }
            }
            if ($guardNames.Count -eq 0) { Add-Verification -Name 'Full guards' -Status 'INFO' -Details 'No guard:* scripts found.' }
        }
    }
}

function Get-Recommendation {
    if ($Script:Blockers.Count -gt 0) {
        return [ordered]@{ code = 'DO_NOT_PROMOTE'; next_action = 'Fix blockers first, then run ghb again. Do not open PR or promote.' }
    }
    if ($Script:Warnings.Count -gt 0) {
        return [ordered]@{ code = 'READY_WITH_WARNINGS_REVIEW_BEFORE_PR'; next_action = 'Review warnings before opening PR to stable/current-truth.' }
    }
    if ($VerifyLevel -eq 'Quick') {
        return [ordered]@{ code = 'CHECKPOINT_OK_RUN_STANDARD_BEFORE_PR'; next_action = 'Checkpoint is OK with Quick verify. Run Standard verify before PR to stable/current-truth.' }
    }
    return [ordered]@{ code = 'READY_FOR_PR_TO_STABLE'; next_action = 'Open PR to stable/current-truth only if you want to promote this checkpoint.' }
}

function Write-EvidenceFiles {
    param([hashtable]$Data)
    $Data | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $Script:EvidenceJsonPath -Encoding UTF8
    Set-Content -LiteralPath $Script:StatusPath -Value ([string]$Data['status']) -Encoding UTF8

    $lines = New-Object System.Collections.ArrayList
    [void]$lines.Add('# GHB Checkpoint Verify Summary')
    [void]$lines.Add('')
    [void]$lines.Add('| Field | Value |')
    [void]$lines.Add('|---|---|')
    [void]$lines.Add(("| Status | {0} |" -f $Data['status']))
    [void]$lines.Add(("| Recommendation | {0} |" -f $Data['recommendation']['code']))
    [void]$lines.Add(("| Previous branch | {0} |" -f $Data['previous_branch']))
    [void]$lines.Add(("| New branch | {0} |" -f $Data['new_branch']))
    [void]$lines.Add(("| Commit | {0} |" -f $Data['commit_sha']))
    [void]$lines.Add(("| Evidence root | {0} |" -f $Script:EvidenceRoot))
    [void]$lines.Add('')
    [void]$lines.Add('## Verification')
    [void]$lines.Add('')
    foreach ($item in @($Data['verification'])) {
        [void]$lines.Add(("- **{0}**: `{1}` - {2}" -f $item['name'], $item['status'], $item['details']))
    }
    [void]$lines.Add('')
    [void]$lines.Add('## Blockers')
    [void]$lines.Add('')
    if (@($Data['blockers']).Count -eq 0) { [void]$lines.Add('- None') } else { foreach ($item in @($Data['blockers'])) { [void]$lines.Add(("- {0}" -f $item)) } }
    [void]$lines.Add('')
    [void]$lines.Add('## Warnings')
    [void]$lines.Add('')
    if (@($Data['warnings']).Count -eq 0) { [void]$lines.Add('- None') } else { foreach ($item in @($Data['warnings'])) { [void]$lines.Add(("- {0}" -f $item)) } }
    [void]$lines.Add('')
    [void]$lines.Add('## Recommended Next Action')
    [void]$lines.Add('')
    [void]$lines.Add([string]$Data['recommendation']['next_action'])
    [void]$lines.Add('')
    [void]$lines.Add('> ghb did not perform promote, PR, merge, force push, or branch deletion.')
    Set-Content -LiteralPath $Script:SummaryPath -Value @($lines) -Encoding UTF8
}

$previousBranch = ''
$newBranch = ''
$commitSha = ''
$status = 'UNKNOWN'
$recommendation = [ordered]@{ code = 'UNKNOWN'; next_action = 'Review evidence.' }

try {
    Write-Section 'START'
    Add-CommandLog "Tool: $($Script:ToolName)"
    Add-CommandLog "RepoRoot: $($Script:RepoRoot)"
    Add-CommandLog "EvidenceRoot: $($Script:EvidenceRoot)"

    $top = First-Line -Result (Invoke-Git -Arguments @('rev-parse', '--show-toplevel') -StepName 'repo top-level')
    $Script:Facts['repo_top_level'] = $top
    $previousBranch = First-Line -Result (Invoke-Git -Arguments @('branch', '--show-current') -StepName 'current branch')
    $Script:Facts['previous_branch'] = $previousBranch

    if ([string]::IsNullOrWhiteSpace($previousBranch) -or $previousBranch -eq 'HEAD') { throw 'Detached HEAD is not supported by ghb.' }
    if (($previousBranch -eq 'main' -or $previousBranch -eq 'master') -and -not $AllowMain) { throw 'Refusing to run ghb from main/master. Switch to a work branch or pass -AllowMain intentionally.' }

    Assert-NoGitOperationInProgress
    $changedPaths = @(Get-ChangedPaths)
    $Script:Facts['changed_paths'] = @($changedPaths)
    $isClean = ($changedPaths.Count -eq 0)
    if ($isClean -and -not $AllowEmpty) { throw 'Working tree is clean. Pass -AllowEmpty if you want an empty checkpoint.' }

    if ([string]::IsNullOrWhiteSpace($Message)) { $Message = Get-CheckpointMessage -ChangedPaths $changedPaths }
    $Message = $Message.Trim()
    if ([string]::IsNullOrWhiteSpace($Message)) { $Message = 'chore: checkpoint' }

    if ([string]::IsNullOrWhiteSpace($BranchName)) {
        $seq = Get-NextGhbSequenceNumber
        $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
        $slug = Get-BranchSlug -Text $Message -ChangedPaths $changedPaths
        $BranchName = ('ghb/{0:D4}-{1}-{2}' -f $seq, $stamp, $slug)
    }
    $newBranch = $BranchName
    $Script:Facts['new_branch'] = $newBranch
    $Script:Facts['message'] = $Message
    $Script:Facts['verify_level'] = $VerifyLevel

    Write-Section 'CHECKPOINT'
    Write-Host "previous_branch: $previousBranch"
    Write-Host "new_branch: $newBranch"
    Write-Host "message: $Message"
    Write-Host "changed_paths: $($changedPaths.Count)"

    Invoke-Git -Arguments @('add', '-A') -StepName 'git add all' | Out-Null
    $commitArgs = @('commit', '-m', $Message)
    if ($isClean) { $commitArgs += '--allow-empty' }
    Invoke-Git -Arguments $commitArgs -StepName 'commit checkpoint' | Out-Null
    $commitSha = First-Line -Result (Invoke-Git -Arguments @('rev-parse', 'HEAD') -StepName 'checkpoint sha')
    $Script:Facts['commit_sha'] = $commitSha

    if (-not $NoPush) { Invoke-Git -Arguments @('push', '-u', 'origin', $previousBranch) -StepName 'push previous branch' | Out-Null }
    Invoke-Git -Arguments @('checkout', '-b', $newBranch) -StepName 'create and switch new ghb branch' | Out-Null
    if (-not $NoPush) { Invoke-Git -Arguments @('push', '-u', 'origin', $newBranch) -StepName 'push new ghb branch' | Out-Null }

    Run-Verify -Level $VerifyLevel
    if ($Script:Blockers.Count -gt 0) { $status = 'FAILED' } elseif ($Script:Warnings.Count -gt 0) { $status = 'PASS_WITH_WARNINGS' } else { $status = 'PASSED' }
    $recommendation = Get-Recommendation
} catch {
    $status = 'FAILED'
    $errorText = $_.Exception.Message
    [void]$Script:Blockers.Add($errorText)
    Add-CommandLog "ERROR: $errorText"
    $recommendation = [ordered]@{ code = 'DO_NOT_PROMOTE'; next_action = 'Fix the error, then run ghb again. No PR or promote.' }
}

$data = [ordered]@{
    tool = $Script:ToolName
    started_at = $Script:StartedAt.ToString('o')
    finished_at = (Get-Date).ToString('o')
    repo_root = $Script:RepoRoot
    evidence_root = $Script:EvidenceRoot
    status = $status
    verify_level = $VerifyLevel
    previous_branch = $previousBranch
    new_branch = $newBranch
    commit_sha = $commitSha
    facts = $Script:Facts
    verification = @($Script:Verification)
    blockers = @($Script:Blockers)
    warnings = @($Script:Warnings)
    recommendation = $recommendation
    safety = 'No promote, PR, merge, force push, branch deletion, or stable/main modification was performed.'
}

Write-EvidenceFiles -Data $data

Write-Section 'RESULT'
Write-Host "status: $status"
Write-Host "recommendation: $($recommendation['code'])"
Write-Host "previous_branch: $previousBranch"
Write-Host "new_branch: $newBranch"
Write-Host "commit_sha: $commitSha"
Write-Host "evidence_root: $($Script:EvidenceRoot)"
if ($status -eq 'FAILED') { exit 2 }
if ($status -eq 'PASS_WITH_WARNINGS') { exit 1 }
exit 0
