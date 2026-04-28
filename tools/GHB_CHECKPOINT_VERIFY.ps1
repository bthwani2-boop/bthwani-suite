#Requires -Version 5.1
Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

<#
GHB_CHECKPOINT_VERIFY.ps1

Purpose:
  Safe BThwani checkpoint workflow:
  - commit current work
  - push current branch
  - create a contextual sequential ghb branch
  - switch to the new branch
  - push new branch
  - run verification diagnostics
  - write evidence and recommendation

Contract:
  ghb = checkpoint + verify + recommendation only.
  ghb does NOT mean PR.
  ghb does NOT mean merge.
  ghb does NOT mean promote.
  ghb does NOT mean source of truth.

Recommended location:
  C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1

Usage examples:
  powershell -ExecutionPolicy Bypass -File C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1
  powershell -ExecutionPolicy Bypass -File C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1 -Message "chore: checkpoint partner orders"
  powershell -ExecutionPolicy Bypass -File C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1 -VerifyLevel Quick
  powershell -ExecutionPolicy Bypass -File C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1 -AllowEmpty

Manual arguments supported:
  -Message "..."
  -BranchName "ghb/0101-..."
  -VerifyLevel Quick|Standard|Full
  -NoPush
  -AllowEmpty
  -AllowMain
  -Help
#>

$Script:RepoRoot = "C:\bthwani-suite"
$Script:ToolName = "GHB_CHECKPOINT_VERIFY"
$Script:StartedAt = Get-Date
$Script:Message = $null
$Script:BranchName = $null
$Script:VerifyLevel = "Standard"
$Script:NoPush = $false
$Script:AllowEmpty = $false
$Script:AllowMain = $false
$Script:Help = $false

function Show-Help {
    Write-Host ""
    Write-Host "GHB_CHECKPOINT_VERIFY.ps1"
    Write-Host ""
    Write-Host "Safe checkpoint + branch + verify + recommendation."
    Write-Host ""
    Write-Host "Usage:"
    Write-Host "  powershell -ExecutionPolicy Bypass -File C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1"
    Write-Host "  powershell -ExecutionPolicy Bypass -File C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1 -Message `"chore: checkpoint packages surfaces`""
    Write-Host "  powershell -ExecutionPolicy Bypass -File C:\bthwani-suite\tools\GHB_CHECKPOINT_VERIFY.ps1 -VerifyLevel Quick"
    Write-Host ""
    Write-Host "VerifyLevel:"
    Write-Host "  Quick    = git status + commit diff check + package script path check"
    Write-Host "  Standard = Quick + pnpm -w exec tsc --noEmit"
    Write-Host "  Full     = Standard + available root build guard scripts when present"
    Write-Host ""
}

function Read-ManualArguments {
    $items = @($args)

    for ($i = 0; $i -lt $items.Count; $i++) {
        $key = [string]$items[$i]

        switch -Regex ($key) {
            '^-Message$' {
                $i++
                if ($i -ge $items.Count) { throw "-Message requires a value." }
                $Script:Message = [string]$items[$i]
                continue
            }
            '^-BranchName$' {
                $i++
                if ($i -ge $items.Count) { throw "-BranchName requires a value." }
                $Script:BranchName = [string]$items[$i]
                continue
            }
            '^-VerifyLevel$' {
                $i++
                if ($i -ge $items.Count) { throw "-VerifyLevel requires a value: Quick, Standard, or Full." }
                $value = [string]$items[$i]
                if (@('Quick', 'Standard', 'Full') -notcontains $value) {
                    throw "Invalid -VerifyLevel '$value'. Use Quick, Standard, or Full."
                }
                $Script:VerifyLevel = $value
                continue
            }
            '^-NoPush$' {
                $Script:NoPush = $true
                continue
            }
            '^-AllowEmpty$' {
                $Script:AllowEmpty = $true
                continue
            }
            '^-AllowMain$' {
                $Script:AllowMain = $true
                continue
            }
            '^-Help$|^--help$|^\?$' {
                $Script:Help = $true
                continue
            }
            default {
                throw "Unknown argument: $key"
            }
        }
    }
}

Read-ManualArguments @args

if ($Script:Help) {
    Show-Help
    exit 0
}

if (-not (Test-Path -LiteralPath $Script:RepoRoot -PathType Container)) {
    throw "Repo root not found: $Script:RepoRoot"
}

$Script:SessionId = "$($Script:ToolName)-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$Script:EvidenceRoot = Join-Path $Script:RepoRoot "tools\registry\runs\$($Script:SessionId)"
New-Item -ItemType Directory -Force -Path $Script:EvidenceRoot | Out-Null

$Script:CommandsLogPath = Join-Path $Script:EvidenceRoot "commands.log"
$Script:StatusPath = Join-Path $Script:EvidenceRoot "status.txt"
$Script:SummaryPath = Join-Path $Script:EvidenceRoot "SUMMARY.md"
$Script:EvidenceJsonPath = Join-Path $Script:EvidenceRoot "evidence.json"

$Script:Blockers = New-Object System.Collections.Generic.List[string]
$Script:Warnings = New-Object System.Collections.Generic.List[string]
$Script:Verification = New-Object System.Collections.Generic.List[object]

function Write-Log {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Text
    Add-Content -LiteralPath $Script:CommandsLogPath -Value $line -Encoding UTF8
}

function Write-Section {
    param([string]$Title)

    Write-Host ""
    Write-Host "== $Title =="
    Write-Log "== $Title =="
}

function Invoke-External {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,

        [Parameter(Mandatory = $true)]
        [string[]]$Arguments,

        [switch]$AllowFailure,

        [string]$StepName = ""
    )

    $cmdText = "$FilePath $($Arguments -join ' ')"
    if (-not [string]::IsNullOrWhiteSpace($StepName)) {
        Write-Log "STEP: $StepName"
    }
    Write-Log "RUN: $cmdText"

    $output = @(& $FilePath @Arguments 2>&1)
    $exitCode = $LASTEXITCODE

    foreach ($line in $output) {
        Write-Log "OUT: $line"
    }

    Write-Log "EXIT($exitCode): $cmdText"

    if ($exitCode -ne 0 -and -not $AllowFailure) {
        throw "$cmdText failed with exit code $exitCode."
    }

    return [pscustomobject]@{
        Command = $cmdText
        ExitCode = $exitCode
        Output = @($output | ForEach-Object { [string]$_ })
    }
}

function Invoke-Git {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments,

        [switch]$AllowFailure,

        [string]$StepName = ""
    )

    return Invoke-External -FilePath "git" -Arguments $Arguments -AllowFailure:$AllowFailure -StepName $StepName
}

function Add-Verification {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [string]$Status,

        [string]$Details = ""
    )

    $Script:Verification.Add([pscustomobject]@{
        name = $Name
        status = $Status
        details = $Details
    }) | Out-Null

    if ($Status -eq "FAIL") {
        $Script:Blockers.Add("${Name}: $Details") | Out-Null
    } elseif ($Status -eq "WARN") {
        $Script:Warnings.Add("${Name}: $Details") | Out-Null
    }
}

function Get-CommandOutputText {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,

        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    $result = Invoke-External -FilePath $FilePath -Arguments $Arguments -AllowFailure
    return (($result.Output | Select-Object -First 1) | Out-String).Trim()
}

function Get-RepoTopLevel {
    $text = Get-CommandOutputText -FilePath "git" -Arguments @("rev-parse", "--show-toplevel")
    return $text
}

function Get-GitDirAbsolute {
    $gitDir = Get-CommandOutputText -FilePath "git" -Arguments @("rev-parse", "--git-dir")
    if ([System.IO.Path]::IsPathRooted($gitDir)) {
        return $gitDir
    }

    return Join-Path $Script:RepoRoot $gitDir
}

function Assert-NoGitOperationInProgress {
    $gitDir = Get-GitDirAbsolute

    $checks = @(
        @{ Name = "merge"; Path = (Join-Path $gitDir "MERGE_HEAD") },
        @{ Name = "cherry-pick"; Path = (Join-Path $gitDir "CHERRY_PICK_HEAD") },
        @{ Name = "revert"; Path = (Join-Path $gitDir "REVERT_HEAD") },
        @{ Name = "rebase-merge"; Path = (Join-Path $gitDir "rebase-merge") },
        @{ Name = "rebase-apply"; Path = (Join-Path $gitDir "rebase-apply") },
        @{ Name = "bisect"; Path = (Join-Path $gitDir "BISECT_LOG") }
    )

    foreach ($check in $checks) {
        if (Test-Path -LiteralPath $check.Path) {
            throw "Git $($check.Name) operation appears to be in progress. Resolve or abort it before ghb."
        }
    }
}

function Get-CurrentBranch {
    $branch = Get-CommandOutputText -FilePath "git" -Arguments @("rev-parse", "--abbrev-ref", "HEAD")
    if ([string]::IsNullOrWhiteSpace($branch) -or $branch -eq "HEAD") {
        throw "Detached HEAD is not supported by ghb."
    }

    return $branch
}

function Get-HeadSha {
    return Get-CommandOutputText -FilePath "git" -Arguments @("rev-parse", "HEAD")
}

function Get-ChangedPaths {
    $result = Invoke-Git -Arguments @("status", "--porcelain") -AllowFailure:$false -StepName "read changed paths"
    $paths = New-Object System.Collections.Generic.List[string]

    foreach ($rawLine in $result.Output) {
        $line = [string]$rawLine
        if ([string]::IsNullOrWhiteSpace($line) -or $line.Length -lt 4) {
            continue
        }

        $entry = $line.Substring(3).Trim()

        if ($entry -match ' -> ') {
            $entry = ($entry -split ' -> ')[-1].Trim()
        }

        $entry = $entry.Trim('"')

        if (-not [string]::IsNullOrWhiteSpace($entry)) {
            $paths.Add($entry) | Out-Null
        }
    }

    return @($paths)
}

function Convert-ToSafeSlug {
    param(
        [string]$Text,
        [int]$MaxLength = 42
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return "checkpoint"
    }

    $value = $Text.ToLowerInvariant()
    $value = $value -replace '^(feat|fix|chore|refactor|docs|test|ci|build|style|perf):\s*', ''
    $value = $value -replace '[@]', ' at '
    $value = $value -replace '[^a-z0-9]+', '-'
    $value = $value.Trim('-')

    if ([string]::IsNullOrWhiteSpace($value)) {
        $value = "checkpoint"
    }

    if ($value.Length -gt $MaxLength) {
        $value = $value.Substring(0, $MaxLength).TrimEnd('-')
    }

    if ([string]::IsNullOrWhiteSpace($value)) {
        return "checkpoint"
    }

    return $value
}

function Resolve-PathScope {
    param([string]$PathValue)

    $p = ($PathValue -replace '\\', '/').Trim('/')

    if ($p -match '^apps/mobile/app-client/') { return 'app-client' }
    if ($p -match '^apps/mobile/app-partner/') { return 'app-partner' }
    if ($p -match '^apps/mobile/app-captain/') { return 'app-captain' }
    if ($p -match '^apps/mobile/app-field/') { return 'app-field' }
    if ($p -match '^apps/web/control-panel/') { return 'control-panel' }
    if ($p -match '^apps/web/webapp/') { return 'webapp' }
    if ($p -match '^apps/web/website/') { return 'website' }

    if ($p -match '^packages/ui-kit/') { return 'ui-kit' }
    if ($p -match '^packages/surfaces/') { return 'surfaces' }
    if ($p -match '^packages/app-shells/') { return 'app-shells' }
    if ($p -match '^packages/api-types/') { return 'api-types' }
    if ($p -match '^packages/api-clients/') { return 'api-clients' }
    if ($p -match '^packages/media-fixtures/') { return 'media-fixtures' }

    if ($p -match '^services/([^/]+)/') { return "service-$($Matches[1])" }
    if ($p -match '^contracts/') { return 'contracts' }
    if ($p -match '^governance/') { return 'governance' }
    if ($p -match '^tools/') { return 'tools' }
    if ($p -match '^docs/') { return 'docs' }
    if ($p -match '^\.github/') { return 'github' }
    if ($p -match '^\.agents/') { return 'agents' }
    if ($p -match '^\.cursor/') { return 'cursor' }
    if ($p -match '^(package.json|pnpm-lock.yaml|pnpm-workspace.yaml|nx.json|tsconfig\.json|tsconfig\.base\.json|tamagui\.build\.ts)$') { return 'workspace' }

    $first = (($p -split '/', 2) | Select-Object -First 1)
    return Convert-ToSafeSlug -Text $first -MaxLength 24
}

function Get-ContextSlug {
    param([string[]]$ChangedPaths)

    if (-not $ChangedPaths -or $ChangedPaths.Count -eq 0) {
        return "checkpoint"
    }

    $scopes = @(
        $ChangedPaths |
            ForEach-Object { Resolve-PathScope -PathValue $_ } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            Select-Object -Unique |
            Select-Object -First 3
    )

    if (-not $scopes -or $scopes.Count -eq 0) {
        return "checkpoint"
    }

    return (($scopes -join '-') -replace '[^a-z0-9-]+', '-').Trim('-')
}

function Get-CheckpointMessage {
    param(
        [string[]]$ChangedPaths,
        [bool]$IsEmpty
    )

    if ($IsEmpty) {
        return "chore: empty checkpoint"
    }

    $scope = Get-ContextSlug -ChangedPaths $ChangedPaths
    if ([string]::IsNullOrWhiteSpace($scope) -or $scope -eq "checkpoint") {
        return "chore: checkpoint"
    }

    return "chore: checkpoint $scope"
}

function Get-NextGhbSequenceNumber {
    $max = 0
    $branchLines = @(git branch -a --format="%(refname:short)" 2>$null)

    foreach ($line in $branchLines) {
        $name = ([string]$line).Trim()
        if ([string]::IsNullOrWhiteSpace($name)) {
            continue
        }

        if ($name -match '^(origin/)?ghb/(\d{1,6})-') {
            $number = [int]$Matches[2]
            if ($number -gt $max) { $max = $number }
            continue
        }

        if ($name -match '^(origin/)?ghb/\((\d{1,6})\)-') {
            $number = [int]$Matches[2]
            if ($number -gt $max) { $max = $number }
            continue
        }
    }

    return ($max + 1)
}

function Test-LocalBranchExists {
    param([string]$Name)

    $result = Invoke-Git -Arguments @("show-ref", "--verify", "--quiet", "refs/heads/$Name") -AllowFailure -StepName "check local branch exists"
    return ($result.ExitCode -eq 0)
}

function Test-RemoteBranchExists {
    param([string]$Name)

    $result = Invoke-Git -Arguments @("ls-remote", "--exit-code", "--heads", "origin", $Name) -AllowFailure -StepName "check remote branch exists"
    return ($result.ExitCode -eq 0)
}

function Get-UniqueGhbBranchName {
    param(
        [string]$BaseBranchName
    )

    $candidate = $BaseBranchName
    $suffix = 2

    while ((Test-LocalBranchExists -Name $candidate) -or ((-not $Script:NoPush) -and (Test-RemoteBranchExists -Name $candidate))) {
        $candidate = "$BaseBranchName-$suffix"
        $suffix++
        if ($suffix -gt 20) {
            throw "Could not find a unique ghb branch name after 20 attempts. Last candidate: $candidate"
        }
    }

    return $candidate
}

function New-GhbBranchName {
    param(
        [string[]]$ChangedPaths,
        [string]$MessageText
    )

    if (-not [string]::IsNullOrWhiteSpace($Script:BranchName)) {
        if ($Script:BranchName -match '\s') {
            throw "BranchName must not contain whitespace."
        }
        if ($Script:BranchName -notmatch '^ghb/') {
            $Script:Warnings.Add("Custom branch name does not start with ghb/: $($Script:BranchName)") | Out-Null
        }
        return Get-UniqueGhbBranchName -BaseBranchName $Script:BranchName
    }

    $sequence = Get-NextGhbSequenceNumber
    $sequenceText = "{0:D4}" -f $sequence
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $scopeSlug = Convert-ToSafeSlug -Text (Get-ContextSlug -ChangedPaths $ChangedPaths) -MaxLength 42
    $messageSlug = Convert-ToSafeSlug -Text $MessageText -MaxLength 36

    if ($messageSlug -eq "checkpoint" -or $messageSlug -eq $scopeSlug -or $messageSlug -eq "empty-checkpoint") {
        $base = "ghb/$sequenceText-$stamp-$scopeSlug"
    } else {
        $base = "ghb/$sequenceText-$stamp-$scopeSlug-$messageSlug"
    }

    $base = $base.Trim('-')
    if ($base.Length -gt 110) {
        $base = $base.Substring(0, 110).TrimEnd('-')
    }

    return Get-UniqueGhbBranchName -BaseBranchName $base
}

function Test-CommandAvailable {
    param([string]$Name)

    $cmd = Get-Command $Name -ErrorAction SilentlyContinue
    return ($null -ne $cmd)
}

function Test-PackageScriptFileReferences {
    $packageJsonPath = Join-Path $Script:RepoRoot "package.json"
    if (-not (Test-Path -LiteralPath $packageJsonPath)) {
        Add-Verification -Name "package.json" -Status "WARN" -Details "Root package.json was not found."
        return
    }

    $package = Get-Content -LiteralPath $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if (-not ($package.PSObject.Properties.Name -contains "scripts")) {
        Add-Verification -Name "package scripts" -Status "PASS" -Details "No root scripts to validate."
        return
    }

    $missing = New-Object System.Collections.Generic.List[string]

    foreach ($prop in $package.scripts.PSObject.Properties) {
        $scriptName = $prop.Name
        $scriptValue = [string]$prop.Value

        $regex = [regex]'(?<path>tools[\\/][A-Za-z0-9_\-\.\\/]+\.(?:mjs|js|cjs|ps1))'
        $matches = $regex.Matches($scriptValue)

        foreach ($match in $matches) {
            $relative = $match.Groups["path"].Value -replace '/', '\'
            $full = Join-Path $Script:RepoRoot $relative

            if (-not (Test-Path -LiteralPath $full -PathType Leaf)) {
                $missing.Add("$scriptName -> $relative") | Out-Null
            }
        }
    }

    if ($missing.Count -gt 0) {
        Add-Verification -Name "package script file references" -Status "FAIL" -Details (($missing | Select-Object -First 20) -join "; ")
    } else {
        Add-Verification -Name "package script file references" -Status "PASS" -Details "All detected tools/* script file references exist."
    }
}

function Invoke-Verify {
    param(
        [string]$CommitSha,
        [string]$PreviousHeadSha
    )

    Write-Section "VERIFY"

    $statusResult = Invoke-Git -Arguments @("status", "--porcelain") -AllowFailure -StepName "verify git status"
    $statusLines = @($statusResult.Output | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) })

    if ($statusResult.ExitCode -eq 0 -and $statusLines.Count -eq 0) {
        Add-Verification -Name "git status" -Status "PASS" -Details "Working tree is clean after checkpoint."
    } elseif ($statusResult.ExitCode -eq 0) {
        Add-Verification -Name "git status" -Status "WARN" -Details "Working tree is not clean after checkpoint: $($statusLines -join '; ')"
    } else {
        Add-Verification -Name "git status" -Status "FAIL" -Details "git status failed."
    }

    $diffArgs = @("diff", "--check")
    if (-not [string]::IsNullOrWhiteSpace($PreviousHeadSha) -and -not [string]::IsNullOrWhiteSpace($CommitSha) -and $PreviousHeadSha -ne $CommitSha) {
        $diffArgs = @("diff", "--check", "$PreviousHeadSha..$CommitSha")
    }

    $diffCheck = Invoke-Git -Arguments $diffArgs -AllowFailure -StepName "verify diff whitespace"
    if ($diffCheck.ExitCode -eq 0) {
        Add-Verification -Name "git diff --check" -Status "PASS" -Details "No whitespace/conflict marker issues detected in checkpoint diff."
    } else {
        Add-Verification -Name "git diff --check" -Status "FAIL" -Details (($diffCheck.Output | Select-Object -First 20) -join "; ")
    }

    Test-PackageScriptFileReferences

    if ($Script:VerifyLevel -eq "Quick") {
        Add-Verification -Name "TypeScript" -Status "WARN" -Details "Skipped because VerifyLevel=Quick."
        return
    }

    if (-not (Test-CommandAvailable -Name "pnpm")) {
        Add-Verification -Name "pnpm available" -Status "FAIL" -Details "pnpm command was not found in PATH."
        return
    }

    $tsc = Invoke-External -FilePath "pnpm" -Arguments @("-w", "exec", "tsc", "--noEmit") -AllowFailure -StepName "verify TypeScript"
    if ($tsc.ExitCode -eq 0) {
        Add-Verification -Name "pnpm -w exec tsc --noEmit" -Status "PASS" -Details "TypeScript verification passed."
    } else {
        Add-Verification -Name "pnpm -w exec tsc --noEmit" -Status "FAIL" -Details (($tsc.Output | Select-Object -First 25) -join "; ")
    }

    if ($Script:VerifyLevel -ne "Full") {
        return
    }

    $packageJsonPath = Join-Path $Script:RepoRoot "package.json"
    if (-not (Test-Path -LiteralPath $packageJsonPath)) {
        Add-Verification -Name "Full build guard" -Status "WARN" -Details "Skipped because root package.json is missing."
        return
    }

    $package = Get-Content -LiteralPath $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $scriptNames = @()
    if ($package.PSObject.Properties.Name -contains "scripts") {
        $scriptNames = @($package.scripts.PSObject.Properties.Name)
    }

    $fullScripts = @(
        "guard:i18n-direction",
        "guard:agent-governance",
        "build:mobile-control-panel"
    )

    foreach ($scriptName in $fullScripts) {
        if ($scriptNames -contains $scriptName) {
            $run = Invoke-External -FilePath "pnpm" -Arguments @("run", $scriptName) -AllowFailure -StepName "full verify $scriptName"
            if ($run.ExitCode -eq 0) {
                Add-Verification -Name "pnpm run $scriptName" -Status "PASS" -Details "$scriptName passed."
            } else {
                Add-Verification -Name "pnpm run $scriptName" -Status "FAIL" -Details (($run.Output | Select-Object -First 25) -join "; ")
            }
        } else {
            Add-Verification -Name "pnpm run $scriptName" -Status "WARN" -Details "Script not present; skipped."
        }
    }
}

function Resolve-Recommendation {
    param(
        [string]$PreviousBranch,
        [string]$NewBranch
    )

    if ($Script:Blockers.Count -gt 0) {
        return [pscustomobject]@{
            code = "DO_NOT_PROMOTE"
            next_action = "Fix blockers first, then run ghb again."
            pr_source = $PreviousBranch
            pr_target = "stable/current-truth"
            notes = "Checkpoint is saved, but it should not be promoted."
        }
    }

    if ($Script:Warnings.Count -gt 0) {
        return [pscustomobject]@{
            code = "READY_WITH_WARNINGS_REVIEW_BEFORE_PR"
            next_action = "Review warnings. If acceptable, open PR from previous_branch to stable/current-truth."
            pr_source = $PreviousBranch
            pr_target = "stable/current-truth"
            notes = "Use previous_branch as PR source because new_branch is reserved for the next work session."
        }
    }

    return [pscustomobject]@{
        code = "READY_FOR_PR_TO_STABLE"
        next_action = "Open PR from previous_branch to stable/current-truth when you decide."
        pr_source = $PreviousBranch
        pr_target = "stable/current-truth"
        notes = "No promote, PR, or merge was performed by this script."
    }
}

function Write-EvidenceFiles {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Data
    )

    $status = if ($Data.blockers.Count -gt 0) { "BLOCKED" } elseif ($Data.warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }
    Set-Content -LiteralPath $Script:StatusPath -Value $status -Encoding UTF8

    $Data | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $Script:EvidenceJsonPath -Encoding UTF8

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("# GHB Checkpoint Verify Summary") | Out-Null
    $lines.Add("") | Out-Null
    $lines.Add("| Field | Value |") | Out-Null
    $lines.Add("|---|---|") | Out-Null
    $lines.Add("| Status | $status |") | Out-Null
    $lines.Add("| Recommendation | $($Data.recommendation.code) |") | Out-Null
    $lines.Add("| Previous branch | $($Data.previous_branch) |") | Out-Null
    $lines.Add("| New branch | $($Data.new_branch) |") | Out-Null
    $lines.Add("| Commit | $($Data.commit_sha) |") | Out-Null
    $lines.Add("| Verify level | $($Data.verify_level) |") | Out-Null
    $lines.Add("| Evidence root | $($Data.evidence_root) |") | Out-Null
    $lines.Add("") | Out-Null
    $lines.Add("## Verification") | Out-Null
    $lines.Add("") | Out-Null

    foreach ($item in $Data.verification) {
        $lines.Add("- **$($item.name)**: `$($item.status)` — $($item.details)") | Out-Null
    }

    $lines.Add("") | Out-Null
    $lines.Add("## Blockers") | Out-Null
    $lines.Add("") | Out-Null
    if ($Data.blockers.Count -eq 0) {
        $lines.Add("- None") | Out-Null
    } else {
        foreach ($item in $Data.blockers) {
            $lines.Add("- $item") | Out-Null
        }
    }

    $lines.Add("") | Out-Null
    $lines.Add("## Warnings") | Out-Null
    $lines.Add("") | Out-Null
    if ($Data.warnings.Count -eq 0) {
        $lines.Add("- None") | Out-Null
    } else {
        foreach ($item in $Data.warnings) {
            $lines.Add("- $item") | Out-Null
        }
    }

    $lines.Add("") | Out-Null
    $lines.Add("## Recommended Next Action") | Out-Null
    $lines.Add("") | Out-Null
    $lines.Add($Data.recommendation.next_action) | Out-Null
    $lines.Add("") | Out-Null
    $lines.Add("> ghb did not perform promote, PR, merge, force push, or branch deletion.") | Out-Null

    Set-Content -LiteralPath $Script:SummaryPath -Value $lines -Encoding UTF8
}

$Script:Outcome = $null

try {
    Write-Section "START"
    Write-Log "Tool: $($Script:ToolName)"
    Write-Log "RepoRoot: $($Script:RepoRoot)"
    Write-Log "EvidenceRoot: $($Script:EvidenceRoot)"
    Write-Log "VerifyLevel: $($Script:VerifyLevel)"
    Write-Log "NoPush: $($Script:NoPush)"
    Write-Log "AllowEmpty: $($Script:AllowEmpty)"
    Write-Log "AllowMain: $($Script:AllowMain)"

    $topLevel = Get-RepoTopLevel
    $expectedTopLevel = [System.IO.Path]::GetFullPath($Script:RepoRoot).TrimEnd([char[]]@('\', '/'))
    $actualTopLevel = [System.IO.Path]::GetFullPath($topLevel).TrimEnd([char[]]@('\', '/'))
    if (-not [string]::Equals($actualTopLevel, $expectedTopLevel, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Git top-level mismatch. Expected '$expectedTopLevel' but got '$actualTopLevel'."
    }

    Assert-NoGitOperationInProgress

    $currentBranch = Get-CurrentBranch
    if (($currentBranch -eq "main" -or $currentBranch -eq "master") -and -not $Script:AllowMain) {
        throw "Refusing to run ghb directly from '$currentBranch'. Switch to a work branch first, or pass -AllowMain intentionally."
    }

    if (-not $Script:NoPush) {
        Invoke-Git -Arguments @("remote", "get-url", "origin") -StepName "verify origin remote" | Out-Null
        Invoke-Git -Arguments @("fetch", "--prune", "origin") -StepName "fetch remote branches" | Out-Null
    }

    $previousHeadSha = Get-HeadSha
    $changedPaths = @(Get-ChangedPaths)
    $isClean = ($changedPaths.Count -eq 0)

    if ($isClean -and -not $Script:AllowEmpty) {
        throw "Working tree is clean. Nothing to checkpoint. Pass -AllowEmpty if you intentionally want an empty checkpoint."
    }

    if ([string]::IsNullOrWhiteSpace($Script:Message)) {
        $Script:Message = Get-CheckpointMessage -ChangedPaths $changedPaths -IsEmpty:$isClean
    }

    $Script:Message = $Script:Message.Trim()
    if ([string]::IsNullOrWhiteSpace($Script:Message)) {
        throw "Commit message resolved to empty."
    }

    $newBranch = New-GhbBranchName -ChangedPaths $changedPaths -MessageText $Script:Message

    Write-Section "CHECKPOINT"
    Write-Host "previous_branch: $currentBranch"
    Write-Host "new_branch: $newBranch"
    Write-Host "message: $($Script:Message)"
    Write-Host "changed_paths: $($changedPaths.Count)"
    Write-Log "previous_branch: $currentBranch"
    Write-Log "new_branch: $newBranch"
    Write-Log "message: $($Script:Message)"
    Write-Log "changed_paths: $($changedPaths.Count)"

    Invoke-Git -Arguments @("status", "--short") -AllowFailure -StepName "pre-commit status" | Out-Null
    Invoke-Git -Arguments @("add", "-A") -StepName "stage all changes" | Out-Null

    $commitArgs = @("commit", "-m", $Script:Message)
    if ($isClean) {
        $commitArgs += "--allow-empty"
    }

    Invoke-Git -Arguments $commitArgs -StepName "create checkpoint commit" | Out-Null

    $commitSha = Get-HeadSha

    if (-not $Script:NoPush) {
        Invoke-Git -Arguments @("push", "-u", "origin", $currentBranch) -StepName "push previous branch" | Out-Null
    } else {
        $Script:Warnings.Add("NoPush was used; previous branch and new branch were not pushed.") | Out-Null
    }

    Invoke-Git -Arguments @("checkout", "-b", $newBranch) -StepName "create and switch to new ghb branch" | Out-Null

    if (-not $Script:NoPush) {
        Invoke-Git -Arguments @("push", "-u", "origin", $newBranch) -StepName "push new ghb branch" | Out-Null
    }

    Invoke-Verify -CommitSha $commitSha -PreviousHeadSha $previousHeadSha

    $recommendation = Resolve-Recommendation -PreviousBranch $currentBranch -NewBranch $newBranch

    $Script:Outcome = [pscustomobject]@{
        tool = $Script:ToolName
        started_at = $Script:StartedAt.ToString("o")
        finished_at = (Get-Date).ToString("o")
        repo_root = $Script:RepoRoot
        evidence_root = $Script:EvidenceRoot
        previous_branch = $currentBranch
        new_branch = $newBranch
        previous_head_sha = $previousHeadSha
        commit_sha = $commitSha
        message = $Script:Message
        changed_paths_count = $changedPaths.Count
        changed_paths = @($changedPaths)
        pushed = (-not $Script:NoPush)
        empty_commit = $isClean
        verify_level = $Script:VerifyLevel
        verification = @($Script:Verification)
        blockers = @($Script:Blockers)
        warnings = @($Script:Warnings)
        recommendation = $recommendation
    }

    Write-EvidenceFiles -Data $Script:Outcome

    Write-Section "RESULT"
    $finalStatus = if ($Script:Blockers.Count -gt 0) { "BLOCKED" } elseif ($Script:Warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }

    Write-Host "status: $finalStatus"
    Write-Host "previous_branch: $currentBranch"
    Write-Host "new_branch: $newBranch"
    Write-Host "commit_sha: $commitSha"
    Write-Host "pushed: $(-not $Script:NoPush)"
    Write-Host "verify_level: $($Script:VerifyLevel)"
    Write-Host "recommendation: $($recommendation.code)"
    Write-Host "recommended_pr_source: $($recommendation.pr_source)"
    Write-Host "recommended_pr_target: $($recommendation.pr_target)"
    Write-Host "evidence_root: $($Script:EvidenceRoot)"
    Write-Host ""
    Write-Host "Important: ghb did not promote, open PR, merge, force push, or delete branches."

    if ($Script:Blockers.Count -gt 0) {
        Write-Host ""
        Write-Host "BLOCKERS:"
        foreach ($item in $Script:Blockers) {
            Write-Host "- $item"
        }
        exit 2
    }

    if ($Script:Warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "WARNINGS:"
        foreach ($item in $Script:Warnings) {
            Write-Host "- $item"
        }
        exit 1
    }

    exit 0
}
catch {
    $errorMessage = $_.Exception.Message
    Write-Log "ERROR: $errorMessage"

    $failure = [pscustomobject]@{
        tool = $Script:ToolName
        started_at = $Script:StartedAt.ToString("o")
        finished_at = (Get-Date).ToString("o")
        repo_root = $Script:RepoRoot
        evidence_root = $Script:EvidenceRoot
        status = "FAILED"
        error = $errorMessage
        verify_level = $Script:VerifyLevel
        blockers = @($errorMessage)
        warnings = @($Script:Warnings)
    }

    $failure | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $Script:EvidenceJsonPath -Encoding UTF8
    Set-Content -LiteralPath $Script:StatusPath -Value "FAILED" -Encoding UTF8

    $summary = @(
        "# GHB Checkpoint Verify Summary",
        "",
        "| Field | Value |",
        "|---|---|",
        "| Status | FAILED |",
        "| Error | $errorMessage |",
        "| Evidence root | $($Script:EvidenceRoot) |",
        "",
        "No promote, PR, merge, force push, or branch deletion was performed by this script."
    )
    Set-Content -LiteralPath $Script:SummaryPath -Value $summary -Encoding UTF8

    Write-Host ""
    Write-Host "status: FAILED"
    Write-Host "error: $errorMessage"
    Write-Host "evidence_root: $($Script:EvidenceRoot)"
    exit 9
}
