Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$IssueCode = "DESIGN_GUARD_READINESS_FAST"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$FindingsPath = Join-Path $RunRoot "DESIGN_GUARD_READINESS_FAST_FINDINGS.md"
$HandoffZip = Join-Path $RunRoot "_HANDOFF.zip"

function Write-Step {
  param([string]$Message)
  $line = "[$((Get-Date).ToString('s'))] $Message"
  Write-Host $line
  Add-Content -LiteralPath $CommandLog -Value $line -Encoding UTF8
}

function Invoke-CaptureFast {
  param(
    [string]$Name,
    [string]$Command,
    [string]$OutFile,
    [int]$TimeoutSeconds = 60,
    [switch]$SoftFail
  )
  Write-Step "RUN $Name"
  $outPath = Join-Path $RunRoot $OutFile
  $errPath = Join-Path $RunRoot "$OutFile.stderr.txt"
  $p = Start-Process -FilePath "cmd.exe" -ArgumentList @('/d','/c',$Command) -NoNewWindow -PassThru -RedirectStandardOutput $outPath -RedirectStandardError $errPath
  if (-not $p.WaitForExit($TimeoutSeconds * 1000)) {
    try { $p.Kill() } catch {}
    Add-Content -LiteralPath $outPath -Value "`n[TIMEOUT after $TimeoutSeconds seconds] $Command" -Encoding UTF8
    $exitCode = 124
  } else {
    $exitCode = $p.ExitCode
  }
  Write-Step "EXIT $Name :: $exitCode -> $OutFile"
  if (($exitCode -ne 0) -and (-not $SoftFail)) {
    throw "Command failed: $Name ($exitCode). See $outPath"
  }
  return [pscustomobject]@{ name=$Name; command=$Command; exit_code=$exitCode; output_file=$OutFile; stderr_file="$OutFile.stderr.txt" }
}

function Get-CodeFilesSafe {
  param([string[]]$Roots)
  $skipDirNames = @('node_modules','.git','.next','dist','build','coverage','.turbo','.expo','.tamagui','graphify-out','tools\registry\runs')
  $allowedExt = @('.ts','.tsx','.js','.jsx','.css','.scss')
  $files = New-Object System.Collections.Generic.List[object]

  foreach ($root in $Roots) {
    if (!(Test-Path -LiteralPath $root)) { continue }
    Write-Step "SCAN root: $root"
    $stack = New-Object System.Collections.Generic.Stack[string]
    $stack.Push((Resolve-Path -LiteralPath $root).Path)
    while ($stack.Count -gt 0) {
      $dir = $stack.Pop()
      $dirName = Split-Path -Leaf $dir
      if ($skipDirNames -contains $dirName) { continue }
      if ($dir -match "\\tools\\registry\\runs(\\|$)") { continue }
      if ($dir -match "\\node_modules(\\|$)") { continue }
      if ($dir -match "\\.git(\\|$)") { continue }
      if ($dir -match "\\.next(\\|$)") { continue }
      if ($dir -match "\\graphify-out(\\|$)") { continue }
      if ($dir -match "\\.tamagui(\\|$)") { continue }

      try {
        foreach ($childDir in [System.IO.Directory]::EnumerateDirectories($dir)) {
          $leaf = Split-Path -Leaf $childDir
          if ($skipDirNames -notcontains $leaf) { $stack.Push($childDir) }
        }
        foreach ($file in [System.IO.Directory]::EnumerateFiles($dir)) {
          $ext = [System.IO.Path]::GetExtension($file)
          if ($allowedExt -contains $ext) { $files.Add($file) }
        }
      } catch {
        Add-Content -LiteralPath (Join-Path $RunRoot "scan-warnings.txt") -Value "SKIP $dir :: $($_.Exception.Message)" -Encoding UTF8
      }
    }
  }
  return $files
}

$checks = New-Object System.Collections.Generic.List[object]
$warnings = New-Object System.Collections.Generic.List[string]
$errors = New-Object System.Collections.Generic.List[string]

try {
  Write-Step "START $SessionId"
  if (!(Test-Path -LiteralPath ".git")) { throw "Not a git repository root: C:\bthwani-suite" }
  if (!(Test-Path -LiteralPath ".\package.json")) { throw "Missing package.json at repo root." }

  Write-Step "Checking canonical paths"
  $paths = @(
    ".\ui-kit",
    ".\graphify-out",
    ".\.tamagui",
    ".\tools\guards",
    ".\tools\registry\runs",
    ".\dsh",
    ".\wlt",
    ".\control-panel",
    ".\app-client\runtime",
    ".\dsh",
    ".\auth.openapi.yaml",
    ".\master.openapi.yaml"
  )
  $pathReport = foreach ($p in $paths) { [pscustomobject]@{ path=$p; exists=(Test-Path -LiteralPath $p) } }
  $pathReport | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RunRoot "path-existence.json") -Encoding UTF8

  $checks.Add((Invoke-CaptureFast -Name "git branch" -Command "git branch --show-current" -OutFile "git-branch.txt" -TimeoutSeconds 20 -SoftFail))
  $checks.Add((Invoke-CaptureFast -Name "git status" -Command "git --no-pager status --short" -OutFile "git-status.txt" -TimeoutSeconds 30 -SoftFail))
  $checks.Add((Invoke-CaptureFast -Name "git diff check" -Command "git --no-pager diff --check" -OutFile "git-diff-check.txt" -TimeoutSeconds 60 -SoftFail))
  $checks.Add((Invoke-CaptureFast -Name "pnpm version" -Command "pnpm --version" -OutFile "pnpm-version.txt" -TimeoutSeconds 20 -SoftFail))

  Write-Step "Reading root package.json devDependencies"
  $pkg = Get-Content -LiteralPath ".\package.json" -Raw | ConvertFrom-Json
  $toolPackages = @('react-scanner','@ast-grep/cli','knip','dependency-cruiser','stylelint','style-dictionary','@playwright/test','backstopjs','storybook')
  $deps = @{}
  foreach ($section in @('dependencies','devDependencies','optionalDependencies','peerDependencies')) {
    if ($pkg.$section) {
      $pkg.$section.PSObject.Properties | ForEach-Object { $deps[$_.Name] = [pscustomobject]@{ package=$_.Name; version=$_.Value; section=$section } }
    }
  }
  $toolInventory = foreach ($tool in $toolPackages) {
    if ($deps.ContainsKey($tool)) { [pscustomobject]@{ tool=$tool; installed=$true; version=$deps[$tool].version; section=$deps[$tool].section } }
    else { [pscustomobject]@{ tool=$tool; installed=$false; version=$null; section=$null } }
  }
  $toolInventory | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RunRoot "design-tool-inventory-root-package.json") -Encoding UTF8

  if (Get-Command code -ErrorAction SilentlyContinue) {
    $checks.Add((Invoke-CaptureFast -Name "vscode extensions" -Command "code --list-extensions" -OutFile "vscode-extensions.txt" -TimeoutSeconds 30 -SoftFail))
  } else {
    $warnings.Add("VS Code CLI 'code' was not available in PATH; extension inventory skipped.")
  }

  Write-Step "Scanning code roots safely for generated-output runtime references"
  $scanRoots = @('.\dsh','.\wlt','.\app-client\runtime','.\control-panel','.\dsh','.\ui-kit')
  $targetFiles = Get-CodeFilesSafe -Roots $scanRoots
  [pscustomobject]@{ scanned_roots=$scanRoots; scanned_file_count=$targetFiles.Count } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RunRoot "safe-scan-summary.json") -Encoding UTF8

  $runtimeImportFindings = New-Object System.Collections.Generic.List[object]
  $rawHexFindings = New-Object System.Collections.Generic.List[object]
  $directTamaguiFindings = New-Object System.Collections.Generic.List[object]
  foreach ($file in $targetFiles) {
    $rel = Resolve-Path -LiteralPath $file -Relative
    $lineNo = 0
    foreach ($line in [System.IO.File]::ReadLines($file)) {
      $lineNo++
      if ($line -match 'from\s+[''"].*(graphify-out|\.tamagui|tools/analysis|tools/registry/runs).*[''" ]' -or $line -match 'import\(.+(graphify-out|\.tamagui|tools/analysis|tools/registry/runs).+\)') {
        $runtimeImportFindings.Add([pscustomobject]@{ rule="NO_RUNTIME_IMPORT_FROM_GENERATED_OUTPUTS"; file=$rel; line=$lineNo; match=$line.Trim() })
      }
      if ($line -match '#[0-9a-fA-F]{6}\b') {
        $isUiKit = ($rel -match 'packages\\ui-kit')
        if (-not $isUiKit) { $rawHexFindings.Add([pscustomobject]@{ rule="RAW_HEX_OUTSIDE_UI_KIT_REVIEW"; file=$rel; line=$lineNo; match=$line.Trim() }) }
      }
      if ($line -match 'from\s+[''"]tamagui[''"]|from\s+[''"]@tamagui/') {
        $isUiKit = ($rel -match 'packages\\ui-kit')
        if (-not $isUiKit) { $directTamaguiFindings.Add([pscustomobject]@{ rule="DIRECT_TAMAGUI_OUTSIDE_UI_KIT"; file=$rel; line=$lineNo; match=$line.Trim() }) }
      }
    }
  }

  $runtimeImportFindings | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "runtime-imports-from-generated-outputs.json") -Encoding UTF8
  $rawHexFindings | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "raw-hex-outside-ui-kit-review.json") -Encoding UTF8
  $directTamaguiFindings | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "direct-tamagui-outside-ui-kit.json") -Encoding UTF8

  if ($runtimeImportFindings.Count -gt 0) { $warnings.Add("Found runtime imports/references to generated/evidence outputs. Review runtime-imports-from-generated-outputs.json") }
  if ($rawHexFindings.Count -gt 0) { $warnings.Add("Found raw hex colors outside ui-kit. Review raw-hex-outside-ui-kit-review.json") }
  if ($directTamaguiFindings.Count -gt 0) { $warnings.Add("Found direct Tamagui imports outside ui-kit. Review direct-tamagui-outside-ui-kit.json") }

  $status = if ($errors.Count -gt 0) { "FAIL" } elseif ($warnings.Count -gt 0) { "PASS_WITH_WARNINGS" } else { "PASS" }

  $summary = @"
# DESIGN_GUARD_READINESS_FAST

status: $status
session_id: $SessionId
repo: C:\bthwani-suite
evidence_root: $RunRoot
handoff_zip: $HandoffZip

## What this checked
- Canonical repo state.
- Git status and diff check.
- Root package.json design tool inventory.
- VS Code extension inventory when available.
- Presence of ui-kit, graphify-out, .tamagui, DSH/WLT/control-panel/apps/surfaces/OpenAPI paths.
- Safe bounded scan of design/runtime references only under selected live-code roots.

## Safety
This script is read-only except writing evidence under tools/registry/runs. It does not modify runtime code and does not install packages.
"@
  $summary | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

  $findings = @"
# Readiness Findings

## Warnings
$($warnings | ForEach-Object { "- $_" } | Out-String)

## Errors
$($errors | ForEach-Object { "- $_" } | Out-String)

## Generated evidence
- design-tool-inventory-root-package.json
- path-existence.json
- safe-scan-summary.json
- runtime-imports-from-generated-outputs.json
- raw-hex-outside-ui-kit-review.json
- direct-tamagui-outside-ui-kit.json

## Next Action
If acceptable, continue with install/scaffold scripts. Do not claim PASS/CLOSED until evidence is reviewed.
"@
  $findings | Set-Content -LiteralPath $FindingsPath -Encoding UTF8

  [pscustomobject]@{
    status=$status
    session_id=$SessionId
    repo="C:\bthwani-suite"
    evidence_root=$RunRoot
    handoff_zip=$HandoffZip
    checks=$checks
    warnings=$warnings
    errors=$errors
    scanned_file_count=$targetFiles.Count
    raw_hex_outside_ui_kit_count=$rawHexFindings.Count
    direct_tamagui_outside_ui_kit_count=$directTamaguiFindings.Count
    runtime_generated_import_count=$runtimeImportFindings.Count
  } | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $HandoffZip -Force

  Write-Step "DONE"
  Write-Host "status: $status"
  Write-Host "evidence_root: $RunRoot"
  Write-Host "handoff_zip: $HandoffZip"
} catch {
  $errors.Add($_.Exception.Message)
  "FAIL`n$($_.Exception.Message)" | Set-Content -LiteralPath (Join-Path $RunRoot "status.txt") -Encoding UTF8
  [pscustomobject]@{ status="FAIL"; session_id=$SessionId; errors=$errors; evidence_root=$RunRoot } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8
  Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $HandoffZip -Force
  Write-Host "status: FAIL"
  Write-Host "evidence_root: $RunRoot"
  Write-Host "handoff_zip: $HandoffZip"
  throw
}
