#Requires -Version 5.1
[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\bthwani-suite"
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$ToolName = 'REPAIR_GHB_TOOLS'
$StartedAt = Get-Date
$SessionId = "$ToolName-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
$BackupRoot = Join-Path $EvidenceRoot 'backup'
New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$CommandsLogPath = Join-Path $EvidenceRoot 'commands.log'
$SummaryPath = Join-Path $EvidenceRoot 'SUMMARY.md'
$EvidenceJsonPath = Join-Path $EvidenceRoot 'evidence.json'
$StatusPath = Join-Path $EvidenceRoot 'status.txt'
$Touched = New-Object System.Collections.ArrayList
$BackedUp = New-Object System.Collections.ArrayList
$Warnings = New-Object System.Collections.ArrayList
$Blockers = New-Object System.Collections.ArrayList

function Write-Log {
    param([Parameter(Mandatory = $true)][string]$Text)
    $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Text
    Add-Content -LiteralPath $CommandsLogPath -Value $line -Encoding UTF8
}

function Add-Warning {
    param([Parameter(Mandatory = $true)][string]$Text)
    [void]$Warnings.Add($Text)
    Write-Log "WARN: $Text"
}

function Add-Blocker {
    param([Parameter(Mandatory = $true)][string]$Text)
    [void]$Blockers.Add($Text)
    Write-Log "BLOCKER: $Text"
}

function Backup-FileIfExists {
    param([Parameter(Mandatory = $true)][string]$Path)
    if (Test-Path -LiteralPath $Path -PathType Leaf) {
        $relative = $Path.Substring($RepoRoot.Length).TrimStart('\','/')
        $safe = $relative -replace '[:\\/]', '__'
        $destination = Join-Path $BackupRoot $safe
        Copy-Item -LiteralPath $Path -Destination $destination -Force
        [void]$BackedUp.Add($relative)
        Write-Log "BACKUP: $relative -> $destination"
    }
}

function Write-TextFileClean {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Content
    )
    $dir = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $dir -PathType Container)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    Backup-FileIfExists -Path $Path
    $normalized = (($Content -replace "`r`n", "`n") -replace "`r", "`n")
    $lines = $normalized -split "`n", -1
    if ($lines.Count -gt 0 -and $lines[$lines.Count - 1] -eq '') {
        $lines = $lines[0..($lines.Count - 2)]
    }
    $cleanLines = @($lines | ForEach-Object { ([string]$_).TrimEnd() })
    $final = ($cleanLines -join "`r`n") + "`r`n"
    Set-Content -LiteralPath $Path -Value $final -Encoding UTF8
    $relative = $Path.Substring($RepoRoot.Length).TrimStart('\','/')
    [void]$Touched.Add($relative)
    Write-Log "WRITE: $relative"
}

function Invoke-External {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [switch]$AllowFailure
    )
    $cmdText = "$FilePath $($Arguments -join ' ')"
    Write-Log "RUN: $cmdText"
    $output = @(& $FilePath @Arguments 2>&1)
    $exitCode = $LASTEXITCODE
    foreach ($line in $output) { Write-Log "OUT: $([string]$line)" }
    Write-Log "EXIT($exitCode): $cmdText"
    if ($exitCode -ne 0 -and -not $AllowFailure) {
        throw "$cmdText failed with exit code $exitCode."
    }
    return @{ exit_code = $exitCode; output = @($output | ForEach-Object { [string]$_ }) }
}

$GhbScript = @'
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
    Write-Host '  powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1"'
    Write-Host '  powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1" -VerifyLevel Quick'
    Write-Host '  powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1" -Message "chore: checkpoint packages surfaces"'
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
    $output = @(& $FilePath @Arguments 2>&1)
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
    $source = $Text
    if ($ChangedPaths -and $ChangedPaths.Count -gt 0) {
        $roots = @(
            $ChangedPaths |
                ForEach-Object { ($_ -split '[\\/]', 3)[0..([Math]::Min(1, (($_ -split '[\\/]').Count - 1)))] -join '-' } |
                ForEach-Object { $_.ToLowerInvariant() } |
                Select-Object -Unique |
                Select-Object -First 3
        )
        if ($roots.Count -gt 0) { $source = "$($roots -join '-') $Text" }
    }
    if ([string]::IsNullOrWhiteSpace($source)) { return 'checkpoint' }
    $value = $source.ToLowerInvariant()
    $value = $value -replace '^(feat|fix|chore|refactor|docs|test|ci|build|style|perf):\s*', ''
    $value = $value -replace '[^a-z0-9]+', '-'
    $value = $value.Trim('-')
    if ([string]::IsNullOrWhiteSpace($value)) { return 'checkpoint' }
    if ($value.Length -gt 64) { $value = $value.Substring(0, 64).TrimEnd('-') }
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
        if ($name -match '^ghb/[\(]?([0-9]+)[\)]?-') {
            $n = [int]$Matches[1]
            if ($n -gt $max) { $max = $n }
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
            Add-Verification -Name 'package.json script paths' -Status 'FAIL' -Details ((@($missing) | Select-Object -First 20) -join '; ')
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
'@

$DiagnoseScript = @'
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
'@

$WrapperScript = @'
#Requires -Version 5.1
Set-Location -LiteralPath "C:\bthwani-suite"
& powershell -NoProfile -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1" @args
exit $LASTEXITCODE
'@

try {
    Write-Log "START repair ghb tools"
    if (-not (Test-Path -LiteralPath $RepoRoot -PathType Container)) { throw "Repo root not found: $RepoRoot" }
    Set-Location -LiteralPath $RepoRoot

    Write-TextFileClean -Path (Join-Path $RepoRoot 'tools\GHB_CHECKPOINT_VERIFY.ps1') -Content $GhbScript
    Write-TextFileClean -Path (Join-Path $RepoRoot 'tools\DIAGNOSE_GHB_CHECKPOINT_VERIFY.ps1') -Content $DiagnoseScript
    Write-TextFileClean -Path (Join-Path $RepoRoot 'tools\ghb.ps1') -Content $WrapperScript

    $parserTokens = $null
    $parserErrors = $null
    [void][System.Management.Automation.Language.Parser]::ParseFile((Join-Path $RepoRoot 'tools\GHB_CHECKPOINT_VERIFY.ps1'), [ref]$parserTokens, [ref]$parserErrors)
    if ($parserErrors -and $parserErrors.Count -gt 0) {
        $lines = @($parserErrors | ForEach-Object { "Line $($_.Extent.StartLineNumber): $($_.Message)" })
        Set-Content -LiteralPath (Join-Path $EvidenceRoot 'ghb-parser-errors.txt') -Value $lines -Encoding UTF8
        Add-Blocker "GHB parser errors: $($parserErrors.Count)"
    }

    $diagTokens = $null
    $diagErrors = $null
    [void][System.Management.Automation.Language.Parser]::ParseFile((Join-Path $RepoRoot 'tools\DIAGNOSE_GHB_CHECKPOINT_VERIFY.ps1'), [ref]$diagTokens, [ref]$diagErrors)
    if ($diagErrors -and $diagErrors.Count -gt 0) {
        $lines = @($diagErrors | ForEach-Object { "Line $($_.Extent.StartLineNumber): $($_.Message)" })
        Set-Content -LiteralPath (Join-Path $EvidenceRoot 'diagnose-parser-errors.txt') -Value $lines -Encoding UTF8
        Add-Blocker "Diagnose parser errors: $($diagErrors.Count)"
    }

    $help = Invoke-External -FilePath 'powershell' -Arguments @('-NoProfile','-ExecutionPolicy','Bypass','-File',(Join-Path $RepoRoot 'tools\GHB_CHECKPOINT_VERIFY.ps1'),'-Help') -AllowFailure
    Set-Content -LiteralPath (Join-Path $EvidenceRoot 'ghb-help-output.txt') -Value $help['output'] -Encoding UTF8
    if ($help['exit_code'] -ne 0) { Add-Blocker "GHB -Help failed with exit code $($help['exit_code'])" }

    $diff = Invoke-External -FilePath 'git' -Arguments @('diff','--check') -AllowFailure
    Set-Content -LiteralPath (Join-Path $EvidenceRoot 'git-diff-check.txt') -Value $diff['output'] -Encoding UTF8
    if ($diff['exit_code'] -ne 0) { Add-Blocker 'git diff --check still reports whitespace/conflict-marker issues.' }
} catch {
    Add-Blocker $_.Exception.Message
}

$status = if ($Blockers.Count -gt 0) { 'BLOCKED' } elseif ($Warnings.Count -gt 0) { 'PASS_WITH_WARNINGS' } else { 'PASS' }
Set-Content -LiteralPath $StatusPath -Value $status -Encoding UTF8
$data = [ordered]@{
    tool = $ToolName
    started_at = $StartedAt.ToString('o')
    finished_at = (Get-Date).ToString('o')
    repo_root = $RepoRoot
    evidence_root = $EvidenceRoot
    status = $status
    touched = @($Touched)
    backed_up = @($BackedUp)
    blockers = @($Blockers)
    warnings = @($Warnings)
    safety = 'Repair script only rewrites ghb tool files and copilot ghb instructions. It does not commit, push, switch branches, merge, promote, open PRs, force push, or delete branches.'
}
$data | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $EvidenceJsonPath -Encoding UTF8

$summary = New-Object System.Collections.ArrayList
[void]$summary.Add('# GHB Tools Repair Summary')
[void]$summary.Add('')
[void]$summary.Add('| Field | Value |')
[void]$summary.Add('|---|---|')
[void]$summary.Add(("| Status | {0} |" -f $status))
[void]$summary.Add(("| Evidence root | {0} |" -f $EvidenceRoot))
[void]$summary.Add('')
[void]$summary.Add('## Touched')
foreach ($item in @($Touched)) { [void]$summary.Add(("- {0}" -f $item)) }
[void]$summary.Add('')
[void]$summary.Add('## Backups')
foreach ($item in @($BackedUp)) { [void]$summary.Add(("- {0}" -f $item)) }
[void]$summary.Add('')
[void]$summary.Add('## Blockers')
if ($Blockers.Count -eq 0) { [void]$summary.Add('- None') } else { foreach ($item in @($Blockers)) { [void]$summary.Add(("- {0}" -f $item)) } }
[void]$summary.Add('')
[void]$summary.Add('## Safety')
[void]$summary.Add('No commit, push, branch switch, merge, promote, PR, force push, or branch deletion was performed.')
Set-Content -LiteralPath $SummaryPath -Value @($summary) -Encoding UTF8

Write-Host ''
Write-Host '== RESULT =='
Write-Host "status: $status"
Write-Host "evidence_root: $EvidenceRoot"
Write-Host "summary: $SummaryPath"
if ($status -eq 'BLOCKED') { exit 2 }
if ($status -eq 'PASS_WITH_WARNINGS') { exit 1 }
exit 0
