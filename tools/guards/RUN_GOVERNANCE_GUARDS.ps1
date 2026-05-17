param(
  [ValidateSet('Local', 'CI')]
  [string]$Mode = 'Local',

  [ValidateSet('Governance', 'Agent')]
  [string]$Profile = 'Governance',

  [switch]$FailOnWarning,
  [switch]$CreateZip)

$ErrorActionPreference = 'Stop'

$RepoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
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
$Entries = @($AllEntries | Where-Object { $_.runners -contains $RunnerKey })

if ($Entries.Count -eq 0) {
  throw "No guards declared for runner profile '$Profile'."
}

$SessionPrefix = if ($Profile -eq 'Agent') { 'AGENT_GUARDS' } else { 'GOVERNANCE_GUARDS' }
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$SessionId = "$SessionPrefix-$Timestamp"
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Path $EvidenceRoot -Force | Out-Null

$CommandLog = Join-Path $EvidenceRoot 'commands.log'
function Log-Line([string]$Message) {
  $line = "$(Get-Date -Format o) $Message"
  $line | Tee-Object -FilePath $CommandLog -Append | Out-Host
}

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

    if ($entry.PSObject.Properties.Name -contains 'config' -and -not [string]::IsNullOrWhiteSpace($entry.config)) {
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
  }

  $GuardFiles = Get-ChildItem -LiteralPath (Join-Path $RepoRoot 'tools\guards') -File -Filter 'guard-*.mjs' | Select-Object -ExpandProperty FullName
  foreach ($guardFile in $GuardFiles) {
    $relative = $guardFile.Substring($RepoRoot.Length + 1).Replace('\', '/')
    if (-not $files.ContainsKey($relative)) {
      $errors.Add("Guard file has no manifest entry: $relative")
    }
  }

  $ConfigFiles = Get-ChildItem -LiteralPath (Join-Path $RepoRoot 'tools\guards') -File | Where-Object { $_.Name -like 'guard-*.config.json' -or $_.Name -like 'config-*.json' }
  $ManifestConfigs = @{}
  foreach ($entry in $AllEntries) {
    if ($entry.PSObject.Properties.Name -contains 'config' -and -not [string]::IsNullOrWhiteSpace($entry.config)) {
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
    $errors | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'manifest-validation-errors.txt')
    throw "Manifest validation failed. See $EvidenceRoot\manifest-validation-errors.txt"
  }
}

Validate-Manifest

Log-Line "SessionId=$SessionId"
Log-Line "Profile=$Profile"
Log-Line "Mode=$Mode"
Log-Line "FailOnWarning=$FailOnWarning"

& git --no-pager status --short 2>&1 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'git-status.txt') -Encoding UTF8
& git --no-pager diff --check 2>&1 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'git-diff-check.txt') -Encoding UTF8

$Results = New-Object System.Collections.Generic.List[object]

foreach ($entry in $Entries) {
  $GuardPath = Join-Path $RepoRoot $entry.file
  $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($entry.file)
  $JsonOut = Join-Path $EvidenceRoot "$BaseName.json"
  $MdOut = Join-Path $EvidenceRoot "$BaseName.md"
  $StdOut = Join-Path $EvidenceRoot "$BaseName.stdout.txt"
  $StdErr = Join-Path $EvidenceRoot "$BaseName.stderr.txt"

  Log-Line "RUN node $($entry.file)"
  $Process = Start-Process -FilePath 'node' `
    -ArgumentList @($GuardPath, '--root', $RepoRoot, '--mode', $Mode, '--json-out', $JsonOut, '--md-out', $MdOut) `
    -NoNewWindow -Wait -PassThru `
    -RedirectStandardOutput $StdOut `
    -RedirectStandardError $StdErr
  Log-Line "EXIT $($entry.file) code=$($Process.ExitCode)"

  if (Test-Path -LiteralPath $JsonOut) {
    $Result = Get-Content -LiteralPath $JsonOut -Raw | ConvertFrom-Json
    $Results.Add([pscustomobject]@{
      id = $entry.id
      file = $entry.file
      status = $Result.status
      failCount = $Result.failCount
      warnCount = $Result.warnCount
      infoCount = $Result.infoCount
      policy = ($entry.ownerPolicy -join '; ')
    })
  } else {
    $Results.Add([pscustomobject]@{
      id = $entry.id
      file = $entry.file
      status = 'FAIL'
      failCount = 1
      warnCount = 0
      infoCount = 0
      policy = ($entry.ownerPolicy -join '; ')
    })
  }
}

$FailCount = @($Results | Where-Object { $_.status -eq 'FAIL' }).Count
$WarnCount = @($Results | Where-Object { $_.status -eq 'WARN' }).Count
$FinalStatus = if ($FailCount -gt 0) { 'FAIL' } elseif ($WarnCount -gt 0) { 'WARN' } else { 'PASS' }
$Blocking = ($FailCount -gt 0) -or ($FailOnWarning -and $WarnCount -gt 0)

$ZipPath = Join-Path $EvidenceRoot "$SessionId.zip"
$SummaryMd = @(
  "# $Profile Guards Run",
  "",
  "- status: $FinalStatus",
  "- session_id: $SessionId",
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
  status = $FinalStatus
  profile = $Profile
  session_id = $SessionId
  repo = $RepoRoot
  mode = $Mode
  evidence_root = $EvidenceRoot
  zip = $(if ($CreateZip) { Join-Path $EvidenceRoot "$SessionId.zip" } else { $null })
  guards_total = $Entries.Count
  guards_fail = $FailCount
  guards_warn = $WarnCount
  blocking = $Blocking
  results = $Results
}
$Evidence | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $EvidenceRoot 'evidence.json') -Encoding UTF8

if ($CreateZip) {
  if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
  Compress-Archive -Path (Join-Path $EvidenceRoot '*') -DestinationPath $ZipPath -Force
}

Write-Host ""
Write-Host "status: $FinalStatus"
Write-Host "profile: $Profile"
Write-Host "evidence_root: $EvidenceRoot"
Write-Host "zip: $(if ($CreateZip) { $ZipPath } else { 'not-created-by-default' })"
Write-Host "guards_fail: $FailCount"
Write-Host "guards_warn: $WarnCount"

if ($Blocking) { exit 1 }
exit 0
