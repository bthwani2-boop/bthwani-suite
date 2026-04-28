#Requires -Version 5.1
[CmdletBinding()]
param(
    [string]$Message,
    [string]$BranchName,
    [switch]$NoPush,
    [switch]$AllowEmpty
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Invoke-Git {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

function Get-ChangedPaths {
    $lines = @(git status --porcelain)
    $paths = New-Object System.Collections.Generic.List[string]

    foreach ($line in $lines) {
        if ([string]::IsNullOrWhiteSpace($line) -or $line.Length -lt 4) {
            continue
        }

        $entry = $line.Substring(3).Trim()
        if ($entry -match ' -> ') {
            $entry = ($entry -split ' -> ')[-1].Trim()
        }

        if (-not [string]::IsNullOrWhiteSpace($entry)) {
            $paths.Add($entry)
        }
    }

    return @($paths)
}

function Get-CheckpointMessage {
    param(
        [string[]]$ChangedPaths,
        [switch]$AllowEmptyCommit
    )

    if (-not $ChangedPaths -or $ChangedPaths.Count -eq 0) {
        if ($AllowEmptyCommit) {
            return 'chore: empty checkpoint'
        }

        return 'chore: checkpoint'
    }

    $roots = @(
        $ChangedPaths |
            ForEach-Object { ($_ -split '[\\/]', 2)[0].ToLowerInvariant() } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            Select-Object -Unique |
            Select-Object -First 2
    )

    if (-not $roots -or $roots.Count -eq 0) {
        return 'chore: checkpoint'
    }

    return "chore: checkpoint $($roots -join '-')"
}

function Get-BranchSlug {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return 'checkpoint'
    }

    $value = $Text.ToLowerInvariant()
    $value = $value -replace '^(feat|fix|chore|refactor|docs|test|ci|build|style|perf):\s*', ''
    $value = $value -replace '[^a-z0-9]+', '-'
    $value = $value.Trim('-')

    if ([string]::IsNullOrWhiteSpace($value)) {
        return 'checkpoint'
    }

    if ($value.Length -gt 40) {
        $value = $value.Substring(0, 40).TrimEnd('-')
    }

    return $value
}

function Get-NextGhbSequenceNumber {
    $max = 0
    $branchLines = @(git branch -a 2>$null)
    $ghbNames = New-Object System.Collections.Generic.HashSet[string]

    foreach ($line in $branchLines) {
        $name = $line.Trim()

        if ($name.StartsWith('*')) {
            $name = $name.Substring(1).Trim()
        }

        if ($name -match '^remotes/[^/]+/(.+)$') {
            $name = $Matches[1]
        }

        if ($name -match '^ghb/') {
            [void]$ghbNames.Add($name)
        }

        if ($name -match '^ghb/\((\d+)\)-') {
            $number = [int]$Matches[1]
            if ($number -gt $max) {
                $max = $number
            }
        }
    }

    if ($max -gt 0) {
        return ($max + 1)
    }

    if ($ghbNames.Count -gt 0) {
        return ($ghbNames.Count + 1)
    }

    return ($max + 1)
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null | Select-Object -First 1)
if ([string]::IsNullOrWhiteSpace($repoRoot)) {
    throw 'Not inside a git repository.'
}

Set-Location -LiteralPath $repoRoot

$currentBranch = ((& git rev-parse --abbrev-ref HEAD | Select-Object -First 1) | Out-String).Trim()
if ([string]::IsNullOrWhiteSpace($currentBranch) -or $currentBranch -eq 'HEAD') {
    throw 'Detached HEAD is not supported by ghb.'
}

$changedPaths = @(Get-ChangedPaths)
$isClean = $changedPaths.Count -eq 0

if ($isClean -and -not $AllowEmpty) {
    throw 'Working tree is clean. Pass -AllowEmpty if you want an empty checkpoint.'
}

if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = Get-CheckpointMessage -ChangedPaths $changedPaths -AllowEmptyCommit:$AllowEmpty
}

$Message = $Message.Trim()

if ([string]::IsNullOrWhiteSpace($BranchName)) {
    $sequence = Get-NextGhbSequenceNumber
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $BranchName = "ghb/($sequence)-$stamp-$(Get-BranchSlug -Text $Message)"
}

Invoke-Git -Arguments @('add', '-A')

$commitArguments = @('commit', '-m', $Message)
if ($isClean) {
    $commitArguments += '--allow-empty'
}

Invoke-Git -Arguments $commitArguments

if (-not $NoPush) {
    Invoke-Git -Arguments @('push', '-u', 'origin', $currentBranch)
}

Invoke-Git -Arguments @('checkout', '-b', $BranchName)

if (-not $NoPush) {
    Invoke-Git -Arguments @('push', '-u', 'origin', $BranchName)
}

Write-Host "ghb complete"
Write-Host "message: $Message"
Write-Host "previous_branch: $currentBranch"
Write-Host "new_branch: $BranchName"
Write-Host "pushed: $(-not $NoPush)"
Write-Host "empty_commit: $isClean"