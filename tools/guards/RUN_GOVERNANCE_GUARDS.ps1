param(
  [ValidateSet('Local', 'CI')]
  [string]$Mode = 'Local',

  [ValidateSet('Governance', 'Agent')]
  [string]$Profile = 'Governance',

  [ValidateSet('Auto', 'All', 'Selected')]
  [string]$Selection = 'Auto',

  [string[]]$GuardIds = @(),

  [string]$ChangedFilesPath = '',

  [switch]$FailOnWarning,
  [switch]$CreateZip
)

$ErrorActionPreference = 'Stop'

$RepoRoot = (& git rev-parse --show-toplevel 2>$null) -join '' | ForEach-Object { $_.Trim() }
if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Get-Location).Path
}
Set-Location -LiteralPath $RepoRoot

$ManifestPath = Join-Path $RepoRoot 'tools\guards\guard-manifest.json'
if (-not (Test-Path -LiteralPath $ManifestPath)) {
  throw "Missing manifest: $ManifestPath"
}

$Manifest = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json
$RunnerKey = $Profile.ToLowerInvariant()
$AllEntries = @($Manifest.guards)
$ProfileEntries = @($AllEntries | Where-Object { @($_.runners) -contains $RunnerKey })

if ($ProfileEntries.Count -eq 0) {
  throw "No guards declared for runner profile '$Profile'."
}

$SessionPrefix = if ($Profile -eq 'Agent') { 'AGENT_GUARDS' } else { 'GOVERNANCE_GUARDS' }
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$SessionId = "$SessionPrefix-$Selection-$Timestamp"
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Path $EvidenceRoot -Force | Out-Null

$CommandLog = Join-Path $EvidenceRoot 'commands.log'
function Log-Line([string]$Message) {
  $line = "$(Get-Date -Format o) $Message"
  $line | Tee-Object -FilePath $CommandLog -Append | Out-Host
}

# ── Helpers ───────────────────────────────────────────────────────────────────

function As-Array($Value) {
  if ($null -eq $Value) { return @() }
  if ($Value -is [System.Array]) { return @($Value) }
  return @($Value)
}

function Has-Prop($Object, [string]$Name) {
  return $Object.PSObject.Properties.Name -contains $Name
}

function Get-BoolProp($Object, [string]$Name) {
  if (-not (Has-Prop $Object $Name)) { return $false }
  if ($null -eq $Object.$Name) { return $false }
  return [bool]$Object.$Name
}

function Normalize-PathText([string]$Value) {
  return ($Value -replace '\\', '/').Trim()
}

# ── Changed-files derivation ──────────────────────────────────────────────────
# Strip Git warning lines (e.g. "warning: LF will be replaced by CRLF") before
# treating output as a file list.

function Get-ChangedFiles {
  $files = New-Object System.Collections.Generic.List[string]

  if (-not [string]::IsNullOrWhiteSpace($ChangedFilesPath)) {
    $resolvedPath = Join-Path $RepoRoot $ChangedFilesPath
    if (-not (Test-Path -LiteralPath $resolvedPath)) {
      throw "ChangedFilesPath does not exist: $ChangedFilesPath"
    }
    Get-Content -LiteralPath $resolvedPath | ForEach-Object {
      $v = Normalize-PathText $_
      if (-not [string]::IsNullOrWhiteSpace($v)) { $files.Add($v) }
    }
  } else {
    $gitCommands = @(
      @{ args = @('diff', '--name-only') },
      @{ args = @('diff', '--cached', '--name-only') },
      @{ args = @('ls-files', '--others', '--exclude-standard') }
    )
    foreach ($cmd in $gitCommands) {
      try {
        $raw = & git @($cmd.args) 2>$null
        foreach ($line in $raw) {
          # Skip Git warning/hint lines
          if ($line -match '^\s*(?:warning|hint|error|fatal):') { continue }
          $v = Normalize-PathText $line
          if (-not [string]::IsNullOrWhiteSpace($v)) { $files.Add($v) }
        }
      } catch {
        Log-Line "WARN changed-files source failed: git $($cmd.args -join ' ')"
      }
    }
  }

  return @($files | Sort-Object -Unique)
}

# ── Path-rule matching ────────────────────────────────────────────────────────

function Test-PathRule([string]$ChangedFile, [string]$Rule) {
  $file = Normalize-PathText $ChangedFile
  $ruleText = Normalize-PathText $Rule
  if ([string]::IsNullOrWhiteSpace($ruleText)) { return $false }

  if ($ruleText.EndsWith('/**')) {
    $prefix = $ruleText.Substring(0, $ruleText.Length - 3)
    return $file -eq $prefix -or $file.StartsWith("$prefix/")
  }
  if ($ruleText.Contains('*')) {
    return $file -like $ruleText
  }
  return $file -eq $ruleText -or $file.StartsWith("$ruleText/")
}

function Test-GuardMatchesChange($Entry, [string[]]$ChangedFiles) {
  if (Get-BoolProp $Entry 'alwaysRun') { return $true }
  if ($ChangedFiles.Count -eq 0) { return $false }
  if (Get-BoolProp $Entry 'triggerAnyChange') { return $true }

  $paths = @(As-Array $Entry.triggerPaths | ForEach-Object { [string]$_ })
  $extensions = @(As-Array $Entry.triggerExtensions | ForEach-Object { ([string]$_).ToLowerInvariant() })

  foreach ($changed in $ChangedFiles) {
    foreach ($pathRule in $paths) {
      if (Test-PathRule -ChangedFile $changed -Rule $pathRule) {
        if ($extensions.Count -eq 0) { return $true }
        $ext = [System.IO.Path]::GetExtension($changed).ToLowerInvariant()
        if ($extensions -contains $ext) { return $true }
        if ([string]::IsNullOrWhiteSpace($ext)) { return $true }
      }
    }
  }
  return $false
}

# ── Manifest validation ───────────────────────────────────────────────────────

function Validate-Manifest {
  $errors = New-Object System.Collections.Generic.List[string]
  $ids = @{}
  $files = @{}

  foreach ($entry in $AllEntries) {
    if ([string]::IsNullOrWhiteSpace($entry.id)) {
      $errors.Add('Manifest entry missing id.')
      continue
    }
    if ($ids.ContainsKey($entry.id)) {
      $errors.Add("Duplicate guard id in manifest: $($entry.id)")
    } else {
      $ids[$entry.id] = $true
    }

    if ([string]::IsNullOrWhiteSpace($entry.file)) {
      $errors.Add("Manifest entry $($entry.id) missing file path.")
      continue
    }
    if ($files.ContainsKey($entry.file)) {
      $errors.Add("Duplicate manifest file entry: $($entry.file)")
    } else {
      $files[$entry.file] = $true
    }

    $GuardPath = Join-Path $RepoRoot $entry.file
    if (-not (Test-Path -LiteralPath $GuardPath)) {
      $errors.Add("Manifest entry $($entry.id) points to missing guard file: $($entry.file)")
    }

    if (Has-Prop $entry 'config' -and -not [string]::IsNullOrWhiteSpace($entry.config)) {
      $ConfigPath = Join-Path $RepoRoot $entry.config
      if (-not (Test-Path -LiteralPath $ConfigPath)) {
        $errors.Add("Manifest entry $($entry.id) points to missing config file: $($entry.config)")
      }
    }

    $OwnerPolicies = @()
    if ($entry.ownerPolicy -is [System.Array]) { $OwnerPolicies = @($entry.ownerPolicy) }
    elseif ($null -ne $entry.ownerPolicy) { $OwnerPolicies = @([string]$entry.ownerPolicy) }

    if ($OwnerPolicies.Count -eq 0) {
      $errors.Add("Manifest entry $($entry.id) has no ownerPolicy.")
    }
    foreach ($policy in $OwnerPolicies) {
      $PolicyPath = Join-Path $RepoRoot $policy
      if (-not (Test-Path -LiteralPath $PolicyPath)) {
        $errors.Add("Manifest entry $($entry.id) points to missing owner policy: $policy")
      }
    }

    if (-not (Has-Prop $entry 'selectionTier') -or [string]::IsNullOrWhiteSpace([string]$entry.selectionTier)) {
      $errors.Add("Manifest entry $($entry.id) missing selectionTier.")
    }
    if (-not (Has-Prop $entry 'alwaysRun')) {
      $errors.Add("Manifest entry $($entry.id) missing alwaysRun.")
    }
    if (-not (Has-Prop $entry 'triggerAnyChange')) {
      $errors.Add("Manifest entry $($entry.id) missing triggerAnyChange.")
    }
    if ((-not (Get-BoolProp $entry 'alwaysRun')) -and (-not (Get-BoolProp $entry 'triggerAnyChange'))) {
      $triggerPaths = @(As-Array $entry.triggerPaths)
      if ($triggerPaths.Count -eq 0) {
        $errors.Add("Manifest entry $($entry.id) has no triggerPaths and is not alwaysRun/triggerAnyChange.")
      }
    }
  }

  $GuardFiles = Get-ChildItem -LiteralPath (Join-Path $RepoRoot 'tools\guards') -File -Filter 'guard-*.mjs' |
    Select-Object -ExpandProperty FullName
  foreach ($guardFile in $GuardFiles) {
    $relative = $guardFile.Substring($RepoRoot.Length + 1).Replace('\', '/')
    if (-not $files.ContainsKey($relative)) {
      $errors.Add("Guard file has no manifest entry: $relative")
    }
  }

  $ConfigFiles = Get-ChildItem -LiteralPath (Join-Path $RepoRoot 'tools\guards') -File |
    Where-Object { $_.Name -like 'guard-*.config.json' -or $_.Name -like 'config-*.json' }
  $ManifestConfigs = @{}
  foreach ($entry in $AllEntries) {
    if (Has-Prop $entry 'config' -and -not [string]::IsNullOrWhiteSpace($entry.config)) {
      $ManifestConfigs[$entry.config.Replace('\','/')] = $true
    }
  }
  foreach ($configFile in $ConfigFiles) {
    $relative = $configFile.FullName.Substring($RepoRoot.Length + 1).Replace('\', '/')
    if (-not $ManifestConfigs.ContainsKey($relative)) {
      $errors.Add("Config file is orphaned from manifest: $relative")
    }
  }

  if ($errors.Count -gt 0) {
    $errors | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'manifest-validation-errors.txt') -Encoding UTF8
    throw "Manifest validation failed. See $EvidenceRoot\manifest-validation-errors.txt"
  }
}

Validate-Manifest

Log-Line "SessionId=$SessionId"
Log-Line "Profile=$Profile"
Log-Line "Mode=$Mode"
Log-Line "Selection=$Selection"
Log-Line "FailOnWarning=$FailOnWarning"
Log-Line "CreateZip=$CreateZip"

& git --no-pager status --short 2>&1 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'git-status.txt') -Encoding UTF8
& git --no-pager diff --check 2>&1 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'git-diff-check.txt') -Encoding UTF8

# ── Selection logic ───────────────────────────────────────────────────────────

$ChangedFiles = @(Get-ChangedFiles)
$ChangedFiles | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'changed-files.txt') -Encoding UTF8

if ($Selection -eq 'All') {
  $Entries = @($ProfileEntries)

} elseif ($Selection -eq 'Selected') {
  if ($GuardIds.Count -eq 0) {
    throw "Selection=Selected requires -GuardIds."
  }
  # Normalise: handles both "A","B" (array) and "A,B" (single comma-joined string from pwsh -File)
  $NormalisedIds = New-Object System.Collections.Generic.List[string]
  foreach ($raw in $GuardIds) {
    foreach ($part in ($raw -split ',')) {
      $trimmed = $part.Trim()
      if (-not [string]::IsNullOrWhiteSpace($trimmed)) { $NormalisedIds.Add($trimmed) }
    }
  }
  $wanted = @{}
  foreach ($id in $NormalisedIds) { $wanted[$id] = $true }
  $Entries = @($ProfileEntries | Where-Object { $wanted.ContainsKey([string]$_.id) })
  $missing = @($wanted.Keys | Where-Object { -not (@($Entries | ForEach-Object { $_.id }) -contains $_) })
  if ($missing.Count -gt 0) {
    Log-Line "WARN selected guard IDs not found in profile '$Profile': $($missing -join ', ')"
  }

} else {
  # Auto
  $Entries = @($ProfileEntries | Where-Object { Test-GuardMatchesChange -Entry $_ -ChangedFiles $ChangedFiles })

  # Always include alwaysRun guards that are not yet in the list
  $alwaysRunEntries = @($ProfileEntries | Where-Object { Get-BoolProp $_ 'alwaysRun' })
  foreach ($always in $alwaysRunEntries) {
    $alreadyIn = @($Entries | Where-Object { $_.id -eq $always.id }).Count -gt 0
    if (-not $alreadyIn) { $Entries = @($Entries) + @($always) }
  }

  # CI fallback: if no changed files, run all to avoid false negatives
  if ($Mode -eq 'CI' -and $ChangedFiles.Count -eq 0) {
    Log-Line "CI mode: no changed-files evidence detected; falling back to All to prevent false-negative."
    $Entries = @($ProfileEntries)
  }
}

if ($Entries.Count -eq 0) {
  Log-Line "No guards selected for profile '$Profile' with Selection=$Selection."
  Log-Line "WARN: Emitting empty run. Check manifest routing metadata."
}

# ── Selection plan output ─────────────────────────────────────────────────────

$SkippedEntries = @($ProfileEntries | Where-Object {
  $id = $_.id
  -not (@($Entries | ForEach-Object { $_.id }) -contains $id)
})

$SelectionPlan = [ordered]@{
  selection           = $Selection
  profile             = $Profile
  mode                = $Mode
  changedFilesCount   = $ChangedFiles.Count
  changedFiles        = $ChangedFiles
  selectedGuardCount  = $Entries.Count
  selectedGuards      = @($Entries | ForEach-Object {
    [ordered]@{
      id             = $_.id
      file           = $_.file
      mode           = $_.mode
      selectionTier  = if (Has-Prop $_ 'selectionTier') { $_.selectionTier } else { 'unclassified' }
      alwaysRun      = Get-BoolProp $_ 'alwaysRun'
      triggerAnyChange = Get-BoolProp $_ 'triggerAnyChange'
      triggerPaths   = @(As-Array $_.triggerPaths)
    }
  })
  skippedGuards       = @($SkippedEntries | ForEach-Object {
    [ordered]@{
      id            = $_.id
      file          = $_.file
      selectionTier = if (Has-Prop $_ 'selectionTier') { $_.selectionTier } else { 'unclassified' }
    }
  })
}

$SelectionPlan | ConvertTo-Json -Depth 20 |
  Set-Content -LiteralPath (Join-Path $EvidenceRoot 'selection-plan.json') -Encoding UTF8

$PlanMd = @(
  "# Guard Selection Plan",
  "",
  "- selection: $Selection",
  "- profile: $Profile",
  "- mode: $Mode",
  "- changed_files_count: $($ChangedFiles.Count)",
  "- selected_guards_count: $($Entries.Count)",
  "",
  "## Selected guards",
  "",
  "| Guard ID | Tier | File |",
  "|---|---|---|"
)
foreach ($entry in $Entries) {
  $tier = if (Has-Prop $entry 'selectionTier') { $entry.selectionTier } else { 'unclassified' }
  $PlanMd += "| $($entry.id) | $tier | $($entry.file) |"
}
$PlanMd += ""
$PlanMd += "## Skipped guards"
$PlanMd += ""
$PlanMd += "| Guard ID | Tier | File |"
$PlanMd += "|---|---|---|"
foreach ($entry in $SkippedEntries) {
  $tier = if (Has-Prop $entry 'selectionTier') { $entry.selectionTier } else { 'unclassified' }
  $PlanMd += "| $($entry.id) | $tier | $($entry.file) |"
}
$PlanMd | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'selection-plan.md') -Encoding UTF8

Log-Line "Selected $($Entries.Count) guard(s); skipped $($SkippedEntries.Count)"

# ── Guard execution ───────────────────────────────────────────────────────────

$Results = New-Object System.Collections.Generic.List[object]

foreach ($entry in $Entries) {
  $GuardPath = Join-Path $RepoRoot $entry.file
  $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($entry.file)
  $JsonOut  = Join-Path $EvidenceRoot "$BaseName.json"
  $MdOut    = Join-Path $EvidenceRoot "$BaseName.md"
  $StdOut   = Join-Path $EvidenceRoot "$BaseName.stdout.txt"
  $StdErr   = Join-Path $EvidenceRoot "$BaseName.stderr.txt"

  Log-Line "RUN node $($entry.file)"
  $Process = Start-Process -FilePath 'node' `
    -ArgumentList @($GuardPath, '--root', $RepoRoot, '--mode', $Mode, '--json-out', $JsonOut, '--md-out', $MdOut) `
    -NoNewWindow -Wait -PassThru `
    -RedirectStandardOutput $StdOut `
    -RedirectStandardError  $StdErr
  Log-Line "EXIT $($entry.file) code=$($Process.ExitCode)"

  if (Test-Path -LiteralPath $JsonOut) {
    $Result = Get-Content -LiteralPath $JsonOut -Raw | ConvertFrom-Json
    $Results.Add([pscustomobject]@{
      id        = $entry.id
      file      = $entry.file
      status    = $Result.status
      failCount = $Result.failCount
      warnCount = $Result.warnCount
      infoCount = $Result.infoCount
      policy    = ($entry.ownerPolicy -join '; ')
    })
  } else {
    $Results.Add([pscustomobject]@{
      id        = $entry.id
      file      = $entry.file
      status    = 'FAIL'
      failCount = 1
      warnCount = 0
      infoCount = 0
      policy    = ($entry.ownerPolicy -join '; ')
    })
  }
}

# ── Summary ───────────────────────────────────────────────────────────────────

$FailCount  = @($Results | Where-Object { $_.status -eq 'FAIL' }).Count
$WarnCount  = @($Results | Where-Object { $_.status -eq 'WARN' }).Count
$FinalStatus = if ($FailCount -gt 0) { 'FAIL' } elseif ($WarnCount -gt 0) { 'WARN' } else { 'PASS' }
$Blocking    = ($FailCount -gt 0) -or ($FailOnWarning -and $WarnCount -gt 0)

$ZipPath = Join-Path $EvidenceRoot "$SessionId.zip"

$SummaryMd = @(
  "# $Profile Guards Run",
  "",
  "- status: $FinalStatus",
  "- session_id: $SessionId",
  "- selection: $Selection",
  "- mode: $Mode",
  "- evidence_root: $EvidenceRoot",
  "- zip: $(if ($CreateZip) { $ZipPath } else { 'not-created-by-default' })",
  "- guards_total: $($Entries.Count)",
  "- guards_fail: $FailCount",
  "- guards_warn: $WarnCount",
  "- blocking: $Blocking",
  "",
  "| Guard ID | Status | File | Owner policy |",
  "|---|---|---|---|"
)
foreach ($result in $Results) {
  $SummaryMd += "| $($result.id) | $($result.status) | $($result.file) | $($result.policy) |"
}
$SummaryMd += ""
$SummaryMd | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'SUMMARY.md') -Encoding UTF8

$Evidence = [ordered]@{
  status         = $FinalStatus
  profile        = $Profile
  session_id     = $SessionId
  selection      = $Selection
  repo           = $RepoRoot
  mode           = $Mode
  evidence_root  = $EvidenceRoot
  zip            = $(if ($CreateZip) { $ZipPath } else { $null })
  guards_total   = $Entries.Count
  guards_fail    = $FailCount
  guards_warn    = $WarnCount
  blocking       = $Blocking
  results        = $Results
}
$Evidence | ConvertTo-Json -Depth 10 |
  Set-Content -LiteralPath (Join-Path $EvidenceRoot 'evidence.json') -Encoding UTF8

if ($CreateZip) {
  if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
  Compress-Archive -Path (Join-Path $EvidenceRoot '*') -DestinationPath $ZipPath -Force
}

Write-Host ""
Write-Host "status: $FinalStatus"
Write-Host "profile: $Profile"
Write-Host "selection: $Selection"
Write-Host "evidence_root: $EvidenceRoot"
Write-Host "zip: $(if ($CreateZip) { $ZipPath } else { 'not-created-by-default' })"
Write-Host "guards_total: $($Entries.Count)"
Write-Host "guards_fail: $FailCount"
Write-Host "guards_warn: $WarnCount"

if ($Blocking) { exit 1 }
exit 0
