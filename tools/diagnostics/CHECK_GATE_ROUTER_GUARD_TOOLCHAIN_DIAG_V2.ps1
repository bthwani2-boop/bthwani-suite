Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "GATE_ROUTER_GUARD_TOOLCHAIN_DIAG_V2"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RepoRoot = "C:\bthwani-suite"
$RunRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
$LogsRoot = Join-Path $RunRoot "full-logs"

New-Item -ItemType Directory -Force -Path $RunRoot, $LogsRoot | Out-Null

function Write-Utf8 {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Content
  )

  $dir = Split-Path -Parent $Path
  if ($dir) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
  }

  $Content | Out-File -LiteralPath $Path -Encoding utf8 -Force
}

function Resolve-CommandPath {
  param([Parameter(Mandatory=$true)][string]$Name)

  if ($Name -eq "pnpm") {
    $cmd = Get-Command "pnpm.cmd" -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
  }

  $found = Get-Command $Name -ErrorAction SilentlyContinue
  if ($found) { return $found.Source }

  return $null
}

function Invoke-Native {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$false)][string[]]$CommandArgs = @(),
    [Parameter(Mandatory=$true)][string]$OutFile,
    [int]$TimeoutSeconds = 120
  )

  $resolved = Resolve-CommandPath -Name $Name
  $cmdText = "$Name $($CommandArgs -join ' ')".Trim()

  if (-not $resolved) {
    Write-Utf8 -Path $OutFile -Content ("STATUS: MISSING`nCOMMAND: $cmdText`nERROR: command not found`n")
    return [pscustomobject]@{
      command = $cmdText
      status = "MISSING"
      exit_code = $null
      output_file = Split-Path -Leaf $OutFile
    }
  }

  $started = Get-Date

  try {
    $psi = [System.Diagnostics.ProcessStartInfo]::new()
    $psi.FileName = $resolved
    $psi.WorkingDirectory = $RepoRoot
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true

    foreach ($arg in $CommandArgs) {
      [void]$psi.ArgumentList.Add($arg)
    }

    $p = [System.Diagnostics.Process]::new()
    $p.StartInfo = $psi

    [void]$p.Start()

    $stdoutTask = $p.StandardOutput.ReadToEndAsync()
    $stderrTask = $p.StandardError.ReadToEndAsync()

    $done = $p.WaitForExit($TimeoutSeconds * 1000)

    if (-not $done) {
      try { $p.Kill($true) } catch { try { $p.Kill() } catch {} }

      $duration = [math]::Round(((Get-Date) - $started).TotalSeconds, 2)
      $stdout = try { $stdoutTask.Result } catch { "" }
      $stderr = try { $stderrTask.Result } catch { "" }

      $content = @(
        "STATUS: TIMEOUT",
        "COMMAND: $cmdText",
        "RESOLVED: $resolved",
        "TIMEOUT_SECONDS: $TimeoutSeconds",
        "DURATION_SECONDS: $duration",
        "",
        "STDOUT:",
        $stdout,
        "",
        "STDERR:",
        $stderr
      ) -join [Environment]::NewLine

      Write-Utf8 -Path $OutFile -Content $content

      return [pscustomobject]@{
        command = $cmdText
        status = "TIMEOUT"
        exit_code = $null
        output_file = Split-Path -Leaf $OutFile
      }
    }

    $p.WaitForExit()
    $exit = $p.ExitCode
    $status = if ($exit -eq 0) { "PASS" } else { "FAIL" }
    $duration = [math]::Round(((Get-Date) - $started).TotalSeconds, 2)

    $stdout = try { $stdoutTask.Result } catch { "" }
    $stderr = try { $stderrTask.Result } catch { "" }

    $content = @(
      "STATUS: $status",
      "COMMAND: $cmdText",
      "RESOLVED: $resolved",
      "EXIT_CODE: $exit",
      "DURATION_SECONDS: $duration",
      "",
      "STDOUT:",
      $stdout,
      "",
      "STDERR:",
      $stderr
    ) -join [Environment]::NewLine

    Write-Utf8 -Path $OutFile -Content $content

    return [pscustomobject]@{
      command = $cmdText
      status = $status
      exit_code = $exit
      output_file = Split-Path -Leaf $OutFile
    }
  }
  catch {
    $content = @(
      "STATUS: ERROR",
      "COMMAND: $cmdText",
      "RESOLVED: $resolved",
      "ERROR:",
      $_.Exception.Message
    ) -join [Environment]::NewLine

    Write-Utf8 -Path $OutFile -Content $content

    return [pscustomobject]@{
      command = $cmdText
      status = "ERROR"
      exit_code = $null
      output_file = Split-Path -Leaf $OutFile
    }
  }
}

function Get-JsonFile {
  param([Parameter(Mandatory=$true)][string]$Path)
  return Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
}

function As-Array {
  param($Value)

  if ($null -eq $Value) { return @() }
  if ($Value -is [System.Array]) { return @($Value) }
  return @($Value)
}

$checks = @()

$checks += Invoke-Native -Name "git" -CommandArgs @("branch", "--show-current") -OutFile (Join-Path $LogsRoot "git-branch.txt") -TimeoutSeconds 30
$checks += Invoke-Native -Name "git" -CommandArgs @("rev-parse", "HEAD") -OutFile (Join-Path $LogsRoot "git-head.txt") -TimeoutSeconds 30
$checks += Invoke-Native -Name "git" -CommandArgs @("status", "--short") -OutFile (Join-Path $LogsRoot "git-status.txt") -TimeoutSeconds 60
$checks += Invoke-Native -Name "git" -CommandArgs @("--no-pager", "diff", "--check") -OutFile (Join-Path $LogsRoot "git-diff-check.txt") -TimeoutSeconds 60
$checks += Invoke-Native -Name "git" -CommandArgs @("ls-remote", "origin", "refs/heads/feat/dsh-surface-refactor") -OutFile (Join-Path $LogsRoot "git-remote-branch.txt") -TimeoutSeconds 60

$keyFiles = @(
  "AGENTS.md",
  ".agents\EVIDENCE_GATE_ROUTER.md",
  ".agents\GRAPHIFY.md",
  ".agents\INDEX.md",
  ".agents\README.md",
  ".agents\SKILL_CATALOG.md",
  ".agents\skills\bthwani-evidence-gate-router-contract\SKILL.md",
  ".agents\skills\bthwani-graphify-query-first\SKILL.md",
  "tools\guards\guard-manifest.json",
  "tools\guards\RUN_GOVERNANCE_GUARDS.ps1",
  "tools\guards\RUN_AGENT_GUARDS.ps1",
  "tools\guards\RUN_BTHWANI_GUARDS_UNIFIED.ps1",
  "package.json",
  "pnpm-workspace.yaml",
  ".github\workflows\governance-guards.yml"
)

$keyRows = foreach ($f in $keyFiles) {
  $full = Join-Path $RepoRoot $f
  [pscustomobject]@{
    path = $f
    exists = Test-Path -LiteralPath $full
    length = if (Test-Path -LiteralPath $full) { (Get-Item -LiteralPath $full).Length } else { $null }
  }
}

$keyRows |
  ConvertTo-Csv -NoTypeInformation |
  Out-File -LiteralPath (Join-Path $RunRoot "key-files.csv") -Encoding utf8 -Force

$residualPatterns = @(
  'Graphify leads the toolchain',
  'Tools Under Command of Graphify',
  'Subordinate Tooling',
  'strictly adhere to.*bthwani-graphify-query-first.*every task',
  'for every task to maximize token utility',
  'graphify update \. immediately',
  'After modifying code, run .*graphify update \.',
  'For normal maintenance, update using .*graphify update \.',
  'run graphify update \. by default'
)

$residualFindings = @()
$scanRoots = @("AGENTS.md", ".agents")

foreach ($root in $scanRoots) {
  if (-not (Test-Path -LiteralPath $root)) { continue }

  $item = Get-Item -LiteralPath $root
  $files = if ($item.PSIsContainer) {
    Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object {
      $_.Extension -in @(".md", ".json", ".yml", ".yaml")
    }
  } else {
    @($item)
  }

  foreach ($file in $files) {
    foreach ($pattern in $residualPatterns) {
      $matches = Select-String -LiteralPath $file.FullName -Pattern $pattern -ErrorAction SilentlyContinue
      foreach ($m in $matches) {
        $rel = if ($file.FullName.StartsWith($RepoRoot)) { $file.FullName.Substring($RepoRoot.Length + 1) } else { $file.FullName }
        $residualFindings += [pscustomobject]@{
          pattern = $pattern
          path = $rel
          line = $m.LineNumber
          text = $m.Line.Trim()
        }
      }
    }
  }
}

$residualFindings |
  ConvertTo-Json -Depth 10 |
  Out-File -LiteralPath (Join-Path $RunRoot "residual-graphify-leader-findings.json") -Encoding utf8 -Force

$pkgPath = Join-Path $RepoRoot "package.json"
$pkg = Get-JsonFile -Path $pkgPath

$scriptRows = @()
foreach ($s in $pkg.scripts.PSObject.Properties) {
  $scriptRows += [pscustomobject]@{
    script = $s.Name
    command = [string]$s.Value
    is_not_run_reason = ([string]$s.Value -match "NOT_RUN_REASON")
  }
}

$scriptRows |
  ConvertTo-Csv -NoTypeInformation |
  Out-File -LiteralPath (Join-Path $RunRoot "package-scripts.csv") -Encoding utf8 -Force

$depRows = @()
foreach ($block in @("dependencies","devDependencies","peerDependencies","optionalDependencies")) {
  if ($pkg.$block) {
    foreach ($d in $pkg.$block.PSObject.Properties) {
      $depRows += [pscustomobject]@{
        block = $block
        name = $d.Name
        version = [string]$d.Value
      }
    }
  }
}

$depRows |
  ConvertTo-Csv -NoTypeInformation |
  Out-File -LiteralPath (Join-Path $RunRoot "package-dependencies.csv") -Encoding utf8 -Force

$scriptIssues = @()

if (($scriptRows | Where-Object { $_.script -eq "guard:protected-tokens" -and $_.command -match "guard-design-token-drift" }).Count -gt 0) {
  $scriptIssues += [pscustomobject]@{
    severity = "BLOCKING_CANDIDATE"
    script = "guard:protected-tokens"
    issue = "Script maps to guard-design-token-drift.mjs instead of guard-bthwani-protected-tokens.mjs"
    expected = "node tools/guards/guard-bthwani-protected-tokens.mjs"
  }
}

foreach ($row in ($scriptRows | Where-Object { $_.is_not_run_reason })) {
  $scriptIssues += [pscustomobject]@{
    severity = "GAP"
    script = $row.script
    issue = "Script is placeholder NOT_RUN_REASON, not an active tool gate"
    expected = "Define real scoped gate or document as intentionally non-active"
  }
}

$scriptIssues |
  ConvertTo-Csv -NoTypeInformation |
  Out-File -LiteralPath (Join-Path $RunRoot "script-mapping-issues.csv") -Encoding utf8 -Force

$manifestPath = Join-Path $RepoRoot "tools\guards\guard-manifest.json"
$manifestIssues = @()
$manifestRows = @()

if (Test-Path -LiteralPath $manifestPath) {
  $manifest = Get-JsonFile -Path $manifestPath
  $ids = @{}
  $manifestFiles = @{}

  foreach ($g in @($manifest.guards)) {
    $file = [string]$g.file
    $id = [string]$g.id

    $manifestRows += [pscustomobject]@{
      id = $id
      file = $file
      runners = (As-Array $g.runners) -join ";"
      mode = [string]$g.mode
      selectionTier = [string]$g.selectionTier
      alwaysRun = [string]$g.alwaysRun
      triggerAnyChange = [string]$g.triggerAnyChange
      triggerPathsCount = @(As-Array $g.triggerPaths).Count
    }

    if ([string]::IsNullOrWhiteSpace($id)) {
      $manifestIssues += [pscustomobject]@{ severity="BLOCKING"; id=$id; issue="Missing guard id" }
    } elseif ($ids.ContainsKey($id)) {
      $manifestIssues += [pscustomobject]@{ severity="BLOCKING"; id=$id; issue="Duplicate guard id" }
    } else {
      $ids[$id] = $true
    }

    if ([string]::IsNullOrWhiteSpace($file)) {
      $manifestIssues += [pscustomobject]@{ severity="BLOCKING"; id=$id; issue="Missing file" }
    } else {
      $normalizedFile = $file.Replace("\","/")
      $manifestFiles[$normalizedFile] = $true

      if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $file))) {
        $manifestIssues += [pscustomobject]@{ severity="BLOCKING"; id=$id; issue="Guard file missing: $file" }
      }
    }

    foreach ($requiredProp in @("selectionTier","alwaysRun","triggerAnyChange")) {
      if ($g.PSObject.Properties.Name -notcontains $requiredProp) {
        $manifestIssues += [pscustomobject]@{ severity="BLOCKING"; id=$id; issue="Missing $requiredProp" }
      }
    }

    if ($g.config) {
      if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot ([string]$g.config)))) {
        $manifestIssues += [pscustomobject]@{ severity="BLOCKING"; id=$id; issue="Config missing: $($g.config)" }
      }
    }

    foreach ($policy in As-Array $g.ownerPolicy) {
      if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot ([string]$policy)))) {
        $manifestIssues += [pscustomobject]@{ severity="BLOCKING"; id=$id; issue="Owner policy missing: $policy" }
      }
    }
  }

  $guardFiles = Get-ChildItem -LiteralPath (Join-Path $RepoRoot "tools\guards") -File -Filter "guard-*.mjs"
  foreach ($gf in $guardFiles) {
    $rel = $gf.FullName.Substring($RepoRoot.Length + 1).Replace("\","/")
    if (-not $manifestFiles.ContainsKey($rel)) {
      $manifestIssues += [pscustomobject]@{ severity="BLOCKING"; id=""; issue="Guard file missing from manifest: $rel" }
    }
  }
} else {
  $manifestIssues += [pscustomobject]@{ severity="BLOCKING"; id=""; issue="guard-manifest.json missing" }
}

$manifestRows |
  ConvertTo-Csv -NoTypeInformation |
  Out-File -LiteralPath (Join-Path $RunRoot "guard-manifest-inventory.csv") -Encoding utf8 -Force

$manifestIssues |
  ConvertTo-Csv -NoTypeInformation |
  Out-File -LiteralPath (Join-Path $RunRoot "guard-manifest-issues.csv") -Encoding utf8 -Force

$workflowPath = Join-Path $RepoRoot ".github\workflows\governance-guards.yml"
$ciIssues = @()

if (Test-Path -LiteralPath $workflowPath) {
  $wf = Get-Content -LiteralPath $workflowPath -Raw
  $runsOnPullRequest = $wf -match "(?m)^\s*pull_request:"
  $runsOnWorkflowDispatch = $wf -match "(?m)^\s*workflow_dispatch:"
  $pushIncludesFeat = $wf -match "feat/dsh-surface-refactor" -or $wf -match "feat/\*\*"

  if (-not $runsOnPullRequest) {
    $ciIssues += [pscustomobject]@{ severity="BLOCKING"; issue="governance-guards workflow does not include pull_request trigger" }
  }

  if (-not $runsOnWorkflowDispatch) {
    $ciIssues += [pscustomobject]@{ severity="WARN"; issue="governance-guards workflow does not include workflow_dispatch trigger" }
  }

  if (-not $pushIncludesFeat) {
    $ciIssues += [pscustomobject]@{ severity="WARN"; issue="push trigger does not include feat/dsh-surface-refactor or feat/**" }
  }
} else {
  $ciIssues += [pscustomobject]@{ severity="BLOCKING"; issue="governance-guards workflow missing" }
}

$ciIssues |
  ConvertTo-Csv -NoTypeInformation |
  Out-File -LiteralPath (Join-Path $RunRoot "ci-trigger-issues.csv") -Encoding utf8 -Force

$toolProbes = @(
  @{ name="git"; args=@("--version") },
  @{ name="node"; args=@("--version") },
  @{ name="pwsh"; args=@("--version") },
  @{ name="pnpm"; args=@("--version") },
  @{ name="graphify"; args=@("--help") },
  @{ name="pnpm"; args=@("-w","exec","tsc","--version") },
  @{ name="pnpm"; args=@("-w","exec","eslint","--version") },
  @{ name="pnpm"; args=@("-w","exec","spectral","--version") },
  @{ name="pnpm"; args=@("-w","exec","openapi-typescript","--version") },
  @{ name="pnpm"; args=@("-w","exec","react-scanner","--version") },
  @{ name="pnpm"; args=@("-w","exec","ast-grep","--version") },
  @{ name="pnpm"; args=@("-w","exec","depcruise","--version") },
  @{ name="pnpm"; args=@("-w","exec","stylelint","--version") },
  @{ name="pnpm"; args=@("-w","exec","knip","--version") },
  @{ name="pnpm"; args=@("-w","exec","ls-lint","--version") },
  @{ name="pnpm"; args=@("-w","exec","jscpd","--version") },
  @{ name="pnpm"; args=@("-w","exec","sherif","--version") },
  @{ name="pnpm"; args=@("-w","exec","playwright","--version") },
  @{ name="pnpm"; args=@("-w","exec","cucumber-js","--version") },
  @{ name="pnpm"; args=@("-w","exec","tamagui","--version") },
  @{ name="pnpm"; args=@("-w","exec","repomix","--version") },
  @{ name="pnpm"; args=@("-w","exec","madge","--version") },
  @{ name="pnpm"; args=@("-w","exec","style-dictionary","--version") },
  @{ name="pnpm"; args=@("-w","exec","nx","--version") },
  @{ name="pnpm"; args=@("-w","exec","next","--version") },
  @{ name="pnpm"; args=@("-w","exec","expo","--version") }
)

$probeResults = @()

foreach ($probe in $toolProbes) {
  $safe = (($probe.name + "-" + ($probe.args -join "-")) -replace "[^a-zA-Z0-9_.-]", "_")
  $probeResults += Invoke-Native -Name $probe.name -CommandArgs $probe.args -OutFile (Join-Path $LogsRoot "probe-$safe.txt") -TimeoutSeconds 60
}

$probeResults |
  ConvertTo-Json -Depth 10 |
  Out-File -LiteralPath (Join-Path $RunRoot "tool-probe-results.json") -Encoding utf8 -Force

$guardRunResults = @()
$guardRunResults += Invoke-Native -Name "pnpm" -CommandArgs @("run","guard:agent") -OutFile (Join-Path $LogsRoot "run-guard-agent.txt") -TimeoutSeconds 240
$guardRunResults += Invoke-Native -Name "pnpm" -CommandArgs @("run","guard:governance:auto") -OutFile (Join-Path $LogsRoot "run-guard-governance-auto.txt") -TimeoutSeconds 300
$guardRunResults += Invoke-Native -Name "pnpm" -CommandArgs @("run","guard:service-workspace-model") -OutFile (Join-Path $LogsRoot "run-guard-service-workspace-model.txt") -TimeoutSeconds 180
$guardRunResults += Invoke-Native -Name "pnpm" -CommandArgs @("run","guard:secret-scan") -OutFile (Join-Path $LogsRoot "run-guard-secret-scan.txt") -TimeoutSeconds 180

$guardRunResults |
  ConvertTo-Json -Depth 10 |
  Out-File -LiteralPath (Join-Path $RunRoot "guard-run-results.json") -Encoding utf8 -Force

$blocking = @()
$warnings = @()

$currentBranchRaw = Get-Content -LiteralPath (Join-Path $LogsRoot "git-branch.txt") -Raw -ErrorAction SilentlyContinue
if ($currentBranchRaw -notmatch "feat/dsh-surface-refactor") {
  $blocking += "WRONG_BRANCH_OR_BRANCH_NOT_CONFIRMED"
}

foreach ($row in $keyRows) {
  if (-not $row.exists) {
    $blocking += "MISSING_KEY_FILE: $($row.path)"
  }
}

if (@($residualFindings).Count -gt 0) {
  $blocking += "RESIDUAL_GRAPHIFY_LEADER_WORDING_FOUND"
}

if (@($manifestIssues | Where-Object { $_.severity -eq "BLOCKING" }).Count -gt 0) {
  $blocking += "GUARD_MANIFEST_BLOCKING_ISSUES"
}

if (@($scriptIssues | Where-Object { $_.severity -eq "BLOCKING_CANDIDATE" }).Count -gt 0) {
  $blocking += "SCRIPT_MAPPING_BLOCKING_CANDIDATE"
}

if (@($ciIssues | Where-Object { $_.severity -eq "BLOCKING" }).Count -gt 0) {
  $blocking += "CI_WORKFLOW_BLOCKING_ISSUES"
}

if (@($ciIssues | Where-Object { $_.severity -eq "WARN" }).Count -gt 0) {
  $warnings += "CI_WORKFLOW_WARNINGS"
}

if (@($probeResults | Where-Object { $_.command -eq "pnpm --version" -and $_.status -ne "PASS" }).Count -gt 0) {
  $blocking += "PNPM_NOT_RUNNABLE"
}

if (@($guardRunResults | Where-Object { $_.status -ne "PASS" }).Count -gt 0) {
  $blocking += "SAFE_GUARD_RUN_FAILED"
}

foreach ($row in ($scriptIssues | Where-Object { $_.severity -eq "GAP" })) {
  $warnings += "PLACEHOLDER_SCRIPT: $($row.script)"
}

$status = if (@($blocking).Count -gt 0) { "FIX_REQUIRED" } elseif (@($warnings).Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }

$summary = [pscustomobject]@{
  status = $status
  session_id = $SessionId
  repo = $RepoRoot
  branch_expected = "feat/dsh-surface-refactor"
  evidence_root = $RunRoot
  blocking_findings = $blocking
  warnings = $warnings
  key_files_count = @($keyRows).Count
  residual_graphify_leader_findings_count = @($residualFindings).Count
  manifest_issue_count = @($manifestIssues).Count
  script_issue_count = @($scriptIssues).Count
  ci_issue_count = @($ciIssues).Count
  tool_probe_fail_or_missing_count = @($probeResults | Where-Object { $_.status -ne "PASS" }).Count
  safe_guard_run_fail_count = @($guardRunResults | Where-Object { $_.status -ne "PASS" }).Count
  required_review_files = @(
    "evidence-summary.json",
    "key-files.csv",
    "residual-graphify-leader-findings.json",
    "guard-manifest-issues.csv",
    "script-mapping-issues.csv",
    "ci-trigger-issues.csv",
    "tool-probe-results.json",
    "guard-run-results.json"
  )
}

$summary |
  ConvertTo-Json -Depth 20 |
  Out-File -LiteralPath (Join-Path $RunRoot "evidence-summary.json") -Encoding utf8 -Force

$status |
  Out-File -LiteralPath (Join-Path $RunRoot "decision.txt") -Encoding utf8 -Force

$handoffZip = Join-Path $RunRoot "_HANDOFF.zip"
if (Test-Path -LiteralPath $handoffZip) {
  Remove-Item -LiteralPath $handoffZip -Force
}

Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $handoffZip -Force

Write-Host ""
Write-Host "GATE ROUTER / GUARD TOOLCHAIN DIAGNOSTIC V2 COMPLETE"
Write-Host "Status: $status"
Write-Host "Evidence root: $RunRoot"
Write-Host "Handoff ZIP: $handoffZip"
Write-Host ""
Write-Host "Upload this file:"
Write-Host $handoffZip
Write-Host ""
