Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_VERIFY_UIKIT_LEAN_TYPE_CONTRACT"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$UiKitRoot = Join-Path $RepoRoot "packages\ui-kit"
$Src = Join-Path $UiKitRoot "src"
$CompatSrc = Join-Path $UiKitRoot "_compat\src"
$PackageJson = Join-Path $UiKitRoot "package.json"
$TsConfig = Join-Path $UiKitRoot "tsconfig.json"

$Findings = New-Object System.Collections.Generic.List[object]
$Checks = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$ChecksPath = Join-Path $RunRoot "CHECKS.csv"
$OutputPath = Join-Path $RunRoot "tsc.output.txt"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"

function Add-Finding {
  param([string]$Code,[string]$Severity,[string]$Path,[string]$Evidence,[string]$Action)

  $Findings.Add([pscustomobject]@{
    code=$Code
    severity=$Severity
    path=$Path
    evidence=$Evidence
    action=$Action
  }) | Out-Null

  $Color = if ($Severity -eq "PASS") { "Green" } elseif ($Severity -eq "INFO") { "Cyan" } elseif ($Severity -eq "WARN") { "Yellow" } else { "Red" }
  Write-Host "[$Severity] $Code — $Path" -ForegroundColor $Color
}

try {
  Write-Host ""
  Write-Host "CHECK UIKIT LEAN TYPE CONTRACT" -ForegroundColor Cyan
  Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
  Write-Host ""

  foreach ($Path in @($UiKitRoot,$Src,$CompatSrc,$PackageJson,$TsConfig)) {
    if (-not (Test-Path -LiteralPath $Path)) {
      throw "Missing required path: $Path"
    }
  }

  $ExpectedSrc = @(
    "index.ts",
    "foundation.ts",
    "providers.tsx",
    "primitives.tsx",
    "Header.tsx",
    "Button.tsx",
    "Card.tsx",
    "Form.tsx",
    "List.tsx",
    "Modal.tsx",
    "State.tsx",
    "Media.tsx"
  )

  $ActualSrc = @(Get-ChildItem -LiteralPath $Src -Force | Select-Object -ExpandProperty Name | Sort-Object)
  $Extra = @($ActualSrc | Where-Object { $ExpectedSrc -notcontains $_ })
  $Missing = @($ExpectedSrc | Where-Object { $ActualSrc -notcontains $_ })

  if ($Extra.Count -gt 0 -or $Missing.Count -gt 0) {
    throw "Lean src shape invalid. Extra=[$($Extra -join ', ')]; Missing=[$($Missing -join ', ')]"
  }

  Add-Finding `
    -Code "LEAN_SRC_SHAPE_VALID" `
    -Severity "PASS" `
    -Path "packages/ui-kit/src" `
    -Evidence "src contains exactly the approved lean family files." `
    -Action "Run TypeScript contract."

  $CompatValid = (
    (Test-Path -LiteralPath (Join-Path $CompatSrc "components")) -or
    (Test-Path -LiteralPath (Join-Path $CompatSrc "foundation")) -or
    (Test-Path -LiteralPath (Join-Path $CompatSrc "providers")) -or
    (Test-Path -LiteralPath (Join-Path $CompatSrc "root")) -or
    (Test-Path -LiteralPath (Join-Path $CompatSrc "patterns"))
  )

  if (-not $CompatValid) {
    throw "_compat/src does not contain old source folders."
  }

  Add-Finding `
    -Code "COMPAT_SOURCE_VALID" `
    -Severity "PASS" `
    -Path "packages/ui-kit/_compat/src" `
    -Evidence "_compat contains old source folders." `
    -Action "Continue."

  $Cmd = 'pnpm --dir packages/ui-kit exec tsc --noEmit -p tsconfig.json'
  $Checks.Add([pscustomobject]@{
    check="typescript_contract_command"
    command=$Cmd
  }) | Out-Null

  Write-Host "Running: $Cmd" -ForegroundColor Cyan
  $Output = & cmd.exe /d /s /c "$Cmd 2>&1"
  $ExitCode = $LASTEXITCODE

  $OutputText = ($Output | Out-String)
  [System.IO.File]::WriteAllText($OutputPath, $OutputText, [System.Text.UTF8Encoding]::new($false))

  $ErrorLines = @($OutputText -split "`r?`n" | Where-Object {
    $_ -match "error TS\d+|Cannot find module|has no exported member|Module .* has no exported member|is not assignable|Property .* does not exist|Cannot use namespace|Duplicate identifier|Cannot redeclare"
  })

  $Checks.Add([pscustomobject]@{
    check="typescript_contract_exit_code"
    exit_code=$ExitCode
    error_lines=$ErrorLines.Count
  }) | Out-Null

  if ($ExitCode -ne 0) {
    Add-Finding `
      -Code "UIKIT_LEAN_TYPE_CONTRACT_FAILED" `
      -Severity "FAIL" `
      -Path "packages/ui-kit" `
      -Evidence "tsc exit code=$ExitCode; error lines=$($ErrorLines.Count)" `
      -Action "Patch exact TypeScript errors only."

    Write-Host ""
    Write-Host "Top TypeScript errors:" -ForegroundColor Yellow
    $ErrorLines | Select-Object -First 30 | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
  } else {
    Add-Finding `
      -Code "UIKIT_LEAN_TYPE_CONTRACT_PASSED" `
      -Severity "PASS" `
      -Path "packages/ui-kit" `
      -Evidence "tsc --noEmit passed." `
      -Action "Proceed to app-client runtime guard."
  }

} catch {
  Add-Finding `
    -Code "CHECK_FAILED" `
    -Severity "FAIL" `
    -Path "CHECK_VERIFY_UIKIT_LEAN_TYPE_CONTRACT" `
    -Evidence $_.Exception.Message `
    -Action "Fix this bounded check before continuing."
}

$Checks | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ChecksPath
$Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath

$Fails = @($Findings | Where-Object { $_.severity -eq "FAIL" })
$Warns = @($Findings | Where-Object { $_.severity -eq "WARN" })
$Passes = @($Findings | Where-Object { $_.severity -eq "PASS" })

$Status = if ($Fails.Count -gt 0) { "FAIL" } elseif ($Warns.Count -gt 0) { "WARN" } else { "PASS" }

$Evidence = [pscustomobject]@{
  session_id=$SessionId
  status=$Status
  run_root=$RunRoot
  counts=[pscustomobject]@{
    pass=$Passes.Count
    warn=$Warns.Count
    fail=$Fails.Count
    checks=$Checks.Count
  }
}

$Evidence | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $EvidencePath

$Summary = @"
# CHECK VERIFY — UIKIT Lean Type Contract

Session: $SessionId
Status: $Status

## Scope

Only packages/ui-kit TypeScript contract after Lean Src Reset.

## Evidence

- Findings: $FindingsPath
- Checks: $ChecksPath
- Output: $OutputPath
- JSON: $EvidencePath

## Counts

- PASS: $($Passes.Count)
- WARN: $($Warns.Count)
- FAIL: $($Fails.Count)
- Checks: $($Checks.Count)
"@

$Summary | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host "CHECK UIKIT LEAN TYPE CONTRACT STATUS: $Status" -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } else { "Red" })
Write-Host "Evidence Pack: $RunRoot" -ForegroundColor Cyan
Write-Host "Output: $OutputPath" -ForegroundColor Cyan
Write-Host ""
$Findings | Format-Table severity,code,path,action -Wrap
Write-Host ""
Write-Host "Done. Terminal remains open." -ForegroundColor Green
