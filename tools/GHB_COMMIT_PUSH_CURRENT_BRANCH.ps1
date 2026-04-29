[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$CommitMessage,

  [ValidateNotNullOrEmpty()]
  [string]$Remote = "origin",

  [ValidateSet("All", "TrackedOnly", "AlreadyStaged")]
  [string]$StageMode = "All",

  [switch]$SkipTypecheck,
  [switch]$AllowProtectedBranch,
  [switch]$AllowDifferentRemote,
  [switch]$DryRun
)

Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$RepoRoot = "C:\bthwani-suite"
$ExpectedGitHubRepo = "bthwani2-boop/bthwani-suite"
$StartedAt = Get-Date
$SessionId = "GHB_COMMIT_PUSH-" + $StartedAt.ToString("yyyyMMdd-HHmmss")
$TempRoot = Join-Path $env:TEMP ("BTHWANI-" + $SessionId)
$FinalRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
$HandoffZip = Join-Path $FinalRoot "_HANDOFF.zip"
$CommandLog = Join-Path $TempRoot "commands.log"
$StepNo = 0
$Status = "BLOCKED"
$Recommendation = "FIX_REQUIRED"
$ExitCode = 2
$Warnings = New-Object System.Collections.Generic.List[string]
$Errors = New-Object System.Collections.Generic.List[string]
$Checks = New-Object System.Collections.Generic.List[object]
$Branch = ""
$CommitShaBefore = ""
$CommitShaAfter = ""
$RemoteUrl = ""
$Pushed = $false
$Committed = $false
$HadLocalChanges = $false

New-Item -ItemType Directory -Force -Path $TempRoot | Out-Null

function Write-TextFile {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $false)][AllowNull()][string]$Content
  )
  $dir = Split-Path -Parent $Path
  if ($dir) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  if ($null -eq $Content) { $Content = "" }
  Set-Content -LiteralPath $Path -Value $Content -Encoding UTF8
}

function Add-Log {
  param([string]$Text)
  Add-Content -LiteralPath $CommandLog -Value ("[" + (Get-Date).ToString("s") + "] " + $Text) -Encoding UTF8
}

function Invoke-External {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Exe,
    [Parameter(Mandatory = $true)][string[]]$Args,
    [bool]$AllowFail = $false
  )

  $script:StepNo++
  $safe = ($Name -replace "[^A-Za-z0-9._-]", "-")
  $outFile = Join-Path $TempRoot ("{0:D2}-{1}.txt" -f $script:StepNo, $safe)
  $cmdText = $Exe + " " + (($Args | ForEach-Object {
    if ($_ -match "\s") { '"' + ($_ -replace '"', '\"') + '"' } else { $_ }
  }) -join " ")

  Add-Log ("RUN " + $Name + ": " + $cmdText)

  $outputText = ""
  $exit = 0
  try {
    $raw = & $Exe @Args 2>&1
    $exit = $LASTEXITCODE
    if ($null -eq $exit) { $exit = 0 }
    $outputText = ($raw | Out-String)
  } catch {
    $exit = 999
    $outputText = $_.Exception.Message
  }

  $record = @"
COMMAND: $cmdText
EXIT_CODE: $exit

OUTPUT:
$outputText
"@
  Write-TextFile -Path $outFile -Content $record

  $checkStatus = if ($exit -eq 0) { "PASS" } elseif ($AllowFail) { "WARN" } else { "FAIL" }
  $script:Checks.Add([pscustomobject]@{
    name = $Name
    command = $cmdText
    status = $checkStatus
    exit_code = $exit
    output_file = (Split-Path -Leaf $outFile)
  }) | Out-Null

  if ($exit -ne 0 -and -not $AllowFail) {
    throw "Step failed: $Name. See $outFile"
  }

  return [pscustomobject]@{
    Name = $Name
    ExitCode = $exit
    Output = $outputText
    OutputFile = $outFile
  }
}

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string[]]$GitArgs,
    [bool]$AllowFail = $false
  )
  return Invoke-External -Name $Name -Exe "git" -Args $GitArgs -AllowFail:$AllowFail
}

function Block-Run {
  param([string]$Reason)
  $script:Errors.Add($Reason) | Out-Null
  throw $Reason
}

try {
  Add-Log "SESSION $SessionId"
  Add-Log "RepoRoot=$RepoRoot"
  Add-Log "DryRun=$DryRun StageMode=$StageMode SkipTypecheck=$SkipTypecheck"

  $inside = Invoke-Git -Name "git-rev-parse-is-inside-work-tree" -GitArgs @("rev-parse", "--is-inside-work-tree")
  if (($inside.Output.Trim()) -ne "true") {
    Block-Run "Not inside a Git work tree."
  }

  $Branch = (Invoke-Git -Name "branch-show-current" -GitArgs @("branch", "--show-current")).Output.Trim()
  if ([string]::IsNullOrWhiteSpace($Branch)) {
    Block-Run "Detached HEAD or unable to resolve current branch. Commit/push is blocked."
  }

  $ProtectedBranches = @("main", "master", "stable", "production", "release")
  if (($ProtectedBranches -contains $Branch) -and -not $AllowProtectedBranch) {
    Block-Run "Current branch '$Branch' is protected by default. Re-run with -AllowProtectedBranch only if you intentionally want to commit/push this branch."
  }

  $CommitShaBefore = (Invoke-Git -Name "rev-parse-head-before" -GitArgs @("rev-parse", "HEAD")).Output.Trim()
  $RemoteUrl = (Invoke-Git -Name "remote-get-url" -GitArgs @("remote", "get-url", $Remote)).Output.Trim()

  $remoteLooksCorrect =
    ($RemoteUrl -match "github\.com[:/]+bthwani2-boop/bthwani-suite(\.git)?$") -or
    ($RemoteUrl -match "^https://github\.com/bthwani2-boop/bthwani-suite(\.git)?$")

  if (-not $remoteLooksCorrect -and -not $AllowDifferentRemote) {
    Block-Run "Remote '$Remote' does not look like $ExpectedGitHubRepo. Remote URL: $RemoteUrl. Re-run with -AllowDifferentRemote only if intentional."
  }

  Invoke-Git -Name "status-short-before" -GitArgs @("--no-pager", "status", "--short") | Out-Null
  Invoke-Git -Name "status-branch-before" -GitArgs @("--no-pager", "status", "--short", "--branch") | Out-Null
  Invoke-Git -Name "log-oneline-before" -GitArgs @("--no-pager", "log", "--oneline", "-n", "5") | Out-Null
  Invoke-Git -Name "untracked-before" -GitArgs @("ls-files", "--others", "--exclude-standard") | Out-Null

  Invoke-Git -Name "fetch-remote-prune" -GitArgs @("fetch", $Remote, "--prune") | Out-Null

  $remoteRefCheck = Invoke-Git -Name "remote-branch-exists" -GitArgs @("show-ref", "--verify", "--quiet", "refs/remotes/$Remote/$Branch") -AllowFail:$true
  if ($remoteRefCheck.ExitCode -eq 0) {
    $aheadBehind = (Invoke-Git -Name "ahead-behind-remote-vs-head" -GitArgs @("rev-list", "--left-right", "--count", "$Remote/$Branch...HEAD")).Output.Trim()
    $parts = $aheadBehind -split "\s+"
    $behind = [int]$parts[0]
    $ahead = [int]$parts[1]
    Write-TextFile -Path (Join-Path $TempRoot "ahead-behind.txt") -Content "behind=$behind`nahead=$ahead`nraw=$aheadBehind"
    if ($behind -gt 0) {
      Block-Run "Current branch '$Branch' is behind '$Remote/$Branch' by $behind commit(s). Pull/rebase/merge intentionally first, then rerun."
    }
  } else {
    $Warnings.Add("Remote branch '$Remote/$Branch' does not exist yet. Script will push with upstream if not DryRun.") | Out-Null
  }

  $statusBefore = (Invoke-Git -Name "status-porcelain-before-stage" -GitArgs @("status", "--porcelain")).Output
  $HadLocalChanges = -not [string]::IsNullOrWhiteSpace($statusBefore)

  if ($HadLocalChanges) {
    if ($StageMode -eq "All") {
      Invoke-Git -Name "stage-all-excluding-this-evidence-session" -GitArgs @("add", "-A", "--", ".", ":(exclude)tools/registry/runs/$SessionId/**") | Out-Null
    } elseif ($StageMode -eq "TrackedOnly") {
      Invoke-Git -Name "stage-tracked-only" -GitArgs @("add", "-u", "--", ".") | Out-Null
    } else {
      $Warnings.Add("StageMode=AlreadyStaged: no automatic staging was performed.") | Out-Null
    }

    Invoke-Git -Name "staged-name-status" -GitArgs @("--no-pager", "diff", "--cached", "--name-status") | Out-Null

    $hasStaged = Invoke-Git -Name "has-staged-changes-check" -GitArgs @("diff", "--cached", "--quiet") -AllowFail:$true
    if ($hasStaged.ExitCode -eq 0) {
      Block-Run "Local changes exist, but no staged changes are available for commit. Use StageMode=All or stage files intentionally."
    }

    Invoke-Git -Name "diff-cached-check" -GitArgs @("--no-pager", "diff", "--cached", "--check") | Out-Null

    if (-not $SkipTypecheck) {
      Invoke-External -Name "pnpm-workspace-tsc-noemit" -Exe "pnpm" -Args @("-w", "exec", "tsc", "--noEmit") | Out-Null
    } else {
      $Warnings.Add("TypeScript check skipped by -SkipTypecheck.") | Out-Null
    }

    if ($DryRun) {
      $Warnings.Add("DryRun enabled: commit and push were not executed.") | Out-Null
    } else {
      Invoke-Git -Name "commit" -GitArgs @("commit", "-m", $CommitMessage) | Out-Null
      $Committed = $true
    }
  } else {
    $Warnings.Add("No local working-tree changes detected. Script will only push existing local commits if any.") | Out-Null
  }

  $CommitShaAfter = (Invoke-Git -Name "rev-parse-head-after" -GitArgs @("rev-parse", "HEAD")).Output.Trim()
  Invoke-Git -Name "status-short-after-commit-before-push" -GitArgs @("--no-pager", "status", "--short", "--branch") | Out-Null

  $upstream = Invoke-Git -Name "current-upstream" -GitArgs @("rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}") -AllowFail:$true
  $hasUpstream = ($upstream.ExitCode -eq 0)
  $upstreamName = $upstream.Output.Trim()

  if ($hasUpstream -and $upstreamName -ne "$Remote/$Branch") {
    Block-Run "Current branch upstream is '$upstreamName', not '$Remote/$Branch'. Push blocked to avoid wrong target."
  }

  if ($DryRun) {
    $Status = "DRY_RUN"
    $Recommendation = "REVIEW_DRY_RUN_OUTPUT_THEN_RUN_WITHOUT_DRYRUN"
    $ExitCode = 0
  } else {
    if ($hasUpstream) {
      Invoke-Git -Name "push-current-branch" -GitArgs @("push", $Remote, "HEAD:$Branch") | Out-Null
    } else {
      Invoke-Git -Name "push-current-branch-set-upstream" -GitArgs @("push", "-u", $Remote, "HEAD:$Branch") | Out-Null
    }
    $Pushed = $true

    Invoke-Git -Name "status-short-after-push" -GitArgs @("--no-pager", "status", "--short", "--branch") | Out-Null
    Invoke-Git -Name "log-oneline-after" -GitArgs @("--no-pager", "log", "--oneline", "-n", "5") | Out-Null

    $Status = if ($Committed) { "PASS_PUSHED_WITH_COMMIT" } else { "PASS_PUSHED_NO_NEW_COMMIT" }
    $Recommendation = "PUSH_DONE_REVIEW_HANDOFF_ZIP"
    $ExitCode = 0
  }
} catch {
  $Status = "BLOCKED"
  $Recommendation = "FIX_REQUIRED_BEFORE_COMMIT_OR_PUSH"
  $ExitCode = 2
  $Errors.Add($_.Exception.Message) | Out-Null
  Add-Log ("ERROR: " + $_.Exception.Message)
} finally {
  $CompletedAt = Get-Date

  $summary = @"
status: $Status
recommendation: $Recommendation
session_id: $SessionId
repo: $RepoRoot
expected_github_repo: $ExpectedGitHubRepo
remote: $Remote
remote_url: $RemoteUrl
branch: $Branch
commit_sha_before: $CommitShaBefore
commit_sha_after: $CommitShaAfter
committed: $Committed
pushed: $Pushed
stage_mode: $StageMode
dry_run: $DryRun
skip_typecheck: $SkipTypecheck
started_at: $($StartedAt.ToString("s"))
completed_at: $($CompletedAt.ToString("s"))
evidence_root: $FinalRoot
handoff_zip: $HandoffZip

warnings:
$($Warnings | ForEach-Object { "- $_" } | Out-String)

errors:
$($Errors | ForEach-Object { "- $_" } | Out-String)

next_action:
- If status is PASS_PUSHED_WITH_COMMIT or PASS_PUSHED_NO_NEW_COMMIT: upload _HANDOFF.zip if you want ChatGPT review.
- If status is BLOCKED: fix the listed error, then rerun.
- If DryRun was used: review evidence, then rerun without -DryRun when ready.
"@

  Write-TextFile -Path (Join-Path $TempRoot "summary.txt") -Content $summary

  $evidence = [pscustomobject]@{
    status = $Status
    recommendation = $Recommendation
    session_id = $SessionId
    repo = $RepoRoot
    expected_github_repo = $ExpectedGitHubRepo
    remote = $Remote
    remote_url = $RemoteUrl
    branch = $Branch
    commit_sha_before = $CommitShaBefore
    commit_sha_after = $CommitShaAfter
    committed = $Committed
    pushed = $Pushed
    stage_mode = $StageMode
    dry_run = [bool]$DryRun
    skip_typecheck = [bool]$SkipTypecheck
    started_at = $StartedAt.ToString("o")
    completed_at = $CompletedAt.ToString("o")
    evidence_root = $FinalRoot
    handoff_zip = $HandoffZip
    checks = $Checks
    warnings = $Warnings
    errors = $Errors
  }

  Write-TextFile -Path (Join-Path $TempRoot "evidence.json") -Content ($evidence | ConvertTo-Json -Depth 8)

  New-Item -ItemType Directory -Force -Path $FinalRoot | Out-Null
  Get-ChildItem -LiteralPath $TempRoot -Force |
    Copy-Item -Destination $FinalRoot -Recurse -Force

  if (Test-Path -LiteralPath $HandoffZip) {
    Remove-Item -LiteralPath $HandoffZip -Force
  }
  Compress-Archive -Path (Join-Path $FinalRoot "*") -DestinationPath $HandoffZip -Force

  Write-Host ""
  Write-Host $Status
  Write-Host ""
  Write-Host "recommendation: $Recommendation"
  Write-Host "session_id: $SessionId"
  Write-Host "branch: $Branch"
  Write-Host "commit_sha_before: $CommitShaBefore"
  Write-Host "commit_sha_after: $CommitShaAfter"
  Write-Host "committed: $Committed"
  Write-Host "pushed: $Pushed"
  Write-Host "evidence_root: $FinalRoot"
  Write-Host "handoff_zip: $HandoffZip"
  Write-Host ""
  if ($Warnings.Count -gt 0) {
    Write-Host "warnings:"
    $Warnings | ForEach-Object { Write-Host "- $_" }
  }
  if ($Errors.Count -gt 0) {
    Write-Host "errors:"
    $Errors | ForEach-Object { Write-Host "- $_" }
  }

  exit $ExitCode
}
