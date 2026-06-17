Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Continue"

$SessionId = "FINAL_CLOSE_ALL_PHASES-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path (Get-Location) "tools\registry\runs\$SessionId"
$BackupRoot = Join-Path $RunRoot "backups"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$Result = "NOT_STARTED"
$CriticalFailed = $false
$CodeFailed = $false
$RuntimeFailed = $false
$Touched = New-Object System.Collections.Generic.List[string]
$Created = New-Object System.Collections.Generic.List[string]
$Findings = New-Object System.Collections.Generic.List[string]

function Add-Finding([string]$Text) {
  $Findings.Add($Text) | Out-Null
}

function Write-Log([string]$Name, [string]$Text) {
  Set-Content -LiteralPath (Join-Path $RunRoot $Name) -Value $Text -Encoding UTF8
}

function Run-Step([string]$Name, [scriptblock]$Cmd, [bool]$Critical = $true) {
  $Out = Join-Path $RunRoot $Name
  "" | Set-Content -LiteralPath $Out -Encoding UTF8
  $Ok = $true

  try {
    & $Cmd *>&1 | Tee-Object -FilePath $Out
    $Code = $LASTEXITCODE
    if ($null -eq $Code) { $Code = 0 }
    "EXIT_CODE=$Code" | Add-Content -LiteralPath $Out
    if ($Code -ne 0) { $Ok = $false }
  }
  catch {
    $_ | Out-String | Tee-Object -FilePath $Out
    "EXIT_CODE=1" | Add-Content -LiteralPath $Out
    $Ok = $false
  }

  if (-not $Ok -and $Critical) {
    Add-Finding "FAILED_STEP: $Name"
    $script:CriticalFailed = $true
  }

  return $Ok
}

function Backup-File([string]$RelPath) {
  $Source = Join-Path (Get-Location) $RelPath
  $Backup = Join-Path $BackupRoot $RelPath

  if (Test-Path -LiteralPath $Source -PathType Leaf) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Backup) | Out-Null
    Copy-Item -LiteralPath $Source -Destination $Backup -Force

    if (-not $Touched.Contains($RelPath)) {
      $Touched.Add($RelPath) | Out-Null
    }

    return $true
  }

  return $false
}

function Track-Created([string]$RelPath) {
  if (-not $Created.Contains($RelPath)) {
    $Created.Add($RelPath) | Out-Null
  }
}

function Restore-Touched {
  foreach ($RelPath in $Created) {
    $Target = Join-Path (Get-Location) $RelPath
    if (Test-Path -LiteralPath $Target -PathType Leaf) {
      Remove-Item -LiteralPath $Target -Force
      Write-Host "REMOVED_CREATED: $RelPath"
    }
  }

  foreach ($RelPath in $Touched) {
    $Backup = Join-Path $BackupRoot $RelPath
    $Target = Join-Path (Get-Location) $RelPath

    if (Test-Path -LiteralPath $Backup -PathType Leaf) {
      New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Target) | Out-Null
      Copy-Item -LiteralPath $Backup -Destination $Target -Force
      Write-Host "RESTORED: $RelPath"
    }
  }
}

function Read-Text([string]$RelPath) {
  $Path = Join-Path (Get-Location) $RelPath
  if (Test-Path -LiteralPath $Path -PathType Leaf) {
    return Get-Content -LiteralPath $Path -Raw -Encoding UTF8
  }
  return $null
}

function Write-TextFile([string]$RelPath, [string]$Text) {
  $Path = Join-Path (Get-Location) $RelPath
  $WasExisting = Test-Path -LiteralPath $Path -PathType Leaf

  if ($WasExisting) {
    Backup-File $RelPath | Out-Null
  } else {
    Track-Created $RelPath
  }

  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Path) | Out-Null
  Set-Content -LiteralPath $Path -Value $Text -Encoding UTF8
}

function Normalize-NoBlankEof([string]$RelPath) {
  $Text = Read-Text $RelPath
  if ($null -eq $Text) { return "MISSING: $RelPath" }

  $New = [regex]::Replace($Text, "(\r?\n){2,}\z", "`n")

  if ($New -ne $Text) {
    Backup-File $RelPath | Out-Null
    Set-Content -LiteralPath (Join-Path (Get-Location) $RelPath) -Value $New -Encoding UTF8
    return "FIXED_EOF: $RelPath"
  }

  return "NO_EOF_CHANGE: $RelPath"
}

function Fix-DiffCheckBlankLines {
  $OutPath = Join-Path $RunRoot "01_diff_check_before_eof_fix.txt"
  $Lines = & git --no-pager diff --check 2>&1
  $Lines | Set-Content -LiteralPath $OutPath -Encoding UTF8

  $Fixed = New-Object System.Collections.Generic.List[string]

  foreach ($Line in $Lines) {
    if ($Line -match "^(.+?):\d+:\s+new blank line at EOF\.") {
      $File = $Matches[1]
      $Fixed.Add((Normalize-NoBlankEof $File)) | Out-Null
    }
  }

  if ($Fixed.Count -eq 0) {
    "NO_EOF_FIX_NEEDED" | Set-Content -LiteralPath (Join-Path $RunRoot "01_eof_fix_result.txt") -Encoding UTF8
  } else {
    $Fixed | Set-Content -LiteralPath (Join-Path $RunRoot "01_eof_fix_result.txt") -Encoding UTF8
  }
}

function Get-RelativeImport([string]$FromFileAbs, [string]$TargetAbsNoExtOrFile) {
  $FromDir = [System.IO.Path]::GetDirectoryName([System.IO.Path]::GetFullPath($FromFileAbs))
  $FromUri = New-Object System.Uri (($FromDir.TrimEnd('\') + '\'))
  $ToUri = New-Object System.Uri ([System.IO.Path]::GetFullPath($TargetAbsNoExtOrFile))
  $Rel = [System.Uri]::UnescapeDataString($FromUri.MakeRelativeUri($ToUri).ToString())
  $Rel = $Rel.Replace('\','/')
  $Rel = $Rel -replace "\.(ts|tsx|js|jsx)$", ""
  $Rel = $Rel -replace "/index$", ""
  if (-not $Rel.StartsWith(".")) { $Rel = "./$Rel" }
  return $Rel
}

function Resolve-RelativeTarget([string]$FromFileAbs, [string]$Spec) {
  if (-not $Spec.StartsWith(".")) { return $null }
  $Base = [System.IO.Path]::GetFullPath((Join-Path ([System.IO.Path]::GetDirectoryName($FromFileAbs)) $Spec))
  return $Base
}

function Safe-Replace-ControlPanelContract {
  $Candidates = @(
    "dsh/frontend/shared/delivery/delivery.contract.ts",
    "dsh/frontend/shared/delivery/dsh-fulfillment-delivery-mode.contract.ts"
  )

  $ContractRel = $null

  foreach ($Candidate in $Candidates) {
    $Text = Read-Text $Candidate
    if ($null -ne $Text -and $Text.Contains("DshFulfillmentDeliveryMode")) {
      $ContractRel = $Candidate
      break
    }
  }

  if (-not $ContractRel) {
    Add-Finding "MISSING_SHARED_DshFulfillmentDeliveryMode_CONTRACT"
    $script:CodeFailed = $true
    return
  }

  $Targets = @(
    @{
      File = "dsh/frontend/control-panel/support/SupportHubScreens.tsx"
      Old = "from '../../app-client/contracts/dsh-client-binding.contracts'"
    },
    @{
      File = "dsh/frontend/control-panel/operations/AssistedOrderDeskScreen.tsx"
      Old = "import('../../app-client/contracts/dsh-client-binding.contracts').DshFulfillmentDeliveryMode"
    }
  )

  $Report = New-Object System.Collections.Generic.List[string]

  foreach ($Item in $Targets) {
    $RelPath = $Item.File
    $Before = Read-Text $RelPath
    if ($null -eq $Before) {
      $Report.Add("SKIPPED_MISSING: $RelPath") | Out-Null
      continue
    }

    $ContractAbs = Join-Path (Get-Location) $ContractRel
    $FileAbs = Join-Path (Get-Location) $RelPath
    $ContractImport = Get-RelativeImport $FileAbs $ContractAbs

    if ($Item.Old.StartsWith("from ")) {
      $New = "from '$ContractImport'"
    } else {
      $New = "import('$ContractImport').DshFulfillmentDeliveryMode"
    }

    if (-not $Before.Contains($Item.Old)) {
      $Report.Add("NO_CHANGE_NEEDED: $RelPath") | Out-Null
      continue
    }

    $After = $Before.Replace($Item.Old, $New)

    $BeforeLines = $Before -split "`r?`n"
    $AfterLines = $After -split "`r?`n"
    $Max = [Math]::Max($BeforeLines.Count, $AfterLines.Count)
    $Safe = $true

    for ($i = 0; $i -lt $Max; $i++) {
      $B = if ($i -lt $BeforeLines.Count) { $BeforeLines[$i] } else { "" }
      $A = if ($i -lt $AfterLines.Count) { $AfterLines[$i] } else { "" }

      if ($B -ne $A) {
        $Combined = "$B`n$A"
        $Allowed = (
          $Combined.Contains("app-client/contracts/dsh-client-binding.contracts") -or
          $Combined.Contains("shared/delivery")
        )
        $LooksLikeJsx = (
          $B -match "<\s*[A-Z][A-Za-z0-9]*" -or
          $A -match "<\s*[A-Z][A-Za-z0-9]*"
        )

        if (-not $Allowed -or $LooksLikeJsx) {
          $Safe = $false
          $Report.Add("BLOCKED_UI_SAFETY: $RelPath line $($i + 1)") | Out-Null
        }
      }
    }

    if ($Safe) {
      Backup-File $RelPath | Out-Null
      Set-Content -LiteralPath (Join-Path (Get-Location) $RelPath) -Value $After -Encoding UTF8
      $Report.Add("UPDATED: $RelPath -> $ContractRel") | Out-Null
    } else {
      $script:CodeFailed = $true
    }
  }

  $Report | Set-Content -LiteralPath (Join-Path $RunRoot "02_control_panel_contract_fix.txt") -Encoding UTF8
}

function Build-WltFacadeSafe {
  $Roots = @(
    "dsh/frontend/app-client",
    "dsh/frontend/app-partner",
    "dsh/frontend/app-captain",
    "dsh/frontend/app-field",
    "dsh/frontend/control-panel"
  )

  $Files = New-Object System.Collections.Generic.List[object]

  foreach ($Root in $Roots) {
    if (Test-Path -LiteralPath $Root) {
      Get-ChildItem -LiteralPath $Root -Recurse -File -Include *.ts,*.tsx |
        Where-Object { $_.FullName -notmatch "\\node_modules\\|\\.git\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\" } |
        ForEach-Object { $Files.Add($_) | Out-Null }
    }
  }

  $Pattern = '(?ms)(?<head>\b(?:import|export)\s+(?:type\s+)?\{.*?\}\s+from\s+["''])(?<spec>[^"'']*(?:wlt/frontend/dsh|wlt/frontend/app-client-wlt)[^"'']*)(?<tail>["''];?)'
  $Report = New-Object System.Collections.Generic.List[string]

  foreach ($File in $Files) {
    $RelPath = $File.FullName.Replace((Get-Location).Path + "\", "").Replace("\","/")
    if ($RelPath -like "dsh/frontend/shared/wlt/*") { continue }

    $Before = Get-Content -LiteralPath $File.FullName -Raw -Encoding UTF8
    $After = $Before
    $Changed = $false

    $MatchesAll = [regex]::Matches($Before, $Pattern)

    foreach ($Match in $MatchesAll) {
      $Spec = $Match.Groups["spec"].Value
      $TargetBase = Resolve-RelativeTarget $File.FullName $Spec
      if (-not $TargetBase) { continue }

      $Slug = ($TargetBase.Replace((Get-Location).Path, "") -replace "^[\\/]+", "")
      $Slug = $Slug -replace "[^A-Za-z0-9_]+", "_"
      $Slug = $Slug.Trim("_")

      if ([string]::IsNullOrWhiteSpace($Slug)) {
        $Slug = "wlt_bridge"
      }

      $FacadeRel = "dsh/frontend/shared/wlt/generated/$Slug.facade.ts"
      $FacadeAbs = Join-Path (Get-Location) $FacadeRel

      $FromFacadeToTarget = Get-RelativeImport $FacadeAbs $TargetBase
      $FacadeText = @(
        "// Canonical location: $FacadeRel",
        "// Authority: dsh/frontend/shared/wlt/generated — safe one-source WLT facade.",
        "// Generated by final closure script. WLT remains the financial source of truth.",
        "",
        "export * from '$FromFacadeToTarget';",
        ""
      ) -join "`n"

      if (-not (Test-Path -LiteralPath $FacadeAbs -PathType Leaf)) {
        Track-Created $FacadeRel
      } else {
        Backup-File $FacadeRel | Out-Null
      }

      New-Item -ItemType Directory -Force -Path (Split-Path -Parent $FacadeAbs) | Out-Null
      Set-Content -LiteralPath $FacadeAbs -Value $FacadeText -Encoding UTF8

      $NewSpec = Get-RelativeImport $File.FullName $FacadeAbs
      $OldFull = $Match.Value
      $NewFull = $OldFull.Replace($Spec, $NewSpec)

      $After = $After.Replace($OldFull, $NewFull)
      $Changed = $true
      $Report.Add("${RelPath} :: $Spec -> $NewSpec") | Out-Null
    }

    if ($Changed -and $After -ne $Before) {
      Backup-File $RelPath | Out-Null
      Set-Content -LiteralPath $File.FullName -Value $After -Encoding UTF8
    }
  }

  if ($Report.Count -eq 0) {
    "NO_WLT_IMPORT_EXPORT_REWRITE_NEEDED" | Set-Content -LiteralPath (Join-Path $RunRoot "03_wlt_facade_rewrite.txt") -Encoding UTF8
  } else {
    $Report | Set-Content -LiteralPath (Join-Path $RunRoot "03_wlt_facade_rewrite.txt") -Encoding UTF8
  }
}

function Scan-Files([string[]]$Roots, [string[]]$Patterns, [string]$OutName) {
  $Matches = New-Object System.Collections.Generic.List[string]

  foreach ($Root in $Roots) {
    if (-not (Test-Path -LiteralPath $Root)) { continue }

    Get-ChildItem -LiteralPath $Root -Recurse -File -Include *.ts,*.tsx |
      Where-Object { $_.FullName -notmatch "\\node_modules\\|\\.git\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\" } |
      ForEach-Object {
        $Rel = $_.FullName.Replace((Get-Location).Path + "\", "").Replace("\","/")
        $Lines = Get-Content -LiteralPath $_.FullName -Encoding UTF8

        for ($i = 0; $i -lt $Lines.Count; $i++) {
          foreach ($Pattern in $Patterns) {
            if ($Lines[$i] -match $Pattern) {
              $Matches.Add("${Rel}:$($i + 1):$($Lines[$i])") | Out-Null
            }
          }
        }
      }
  }

  if ($Matches.Count -eq 0) {
    "NO_MATCHES" | Set-Content -LiteralPath (Join-Path $RunRoot $OutName) -Encoding UTF8
  } else {
    $Matches | Set-Content -LiteralPath (Join-Path $RunRoot $OutName) -Encoding UTF8
  }

  return $Matches
}

function Probe-Url([string]$Url) {
  try {
    $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10
    return "STATUS=$($Response.StatusCode)`n$($Response.Content)"
  }
  catch {
    return "REQUEST_FAILED: $($_.Exception.Message)"
  }
}

function Ensure-DshRuntime {
  $Probe = Probe-Url "http://localhost:8080/stores"
  if ($Probe -notmatch "REQUEST_FAILED") {
    return "DSH_API_ALREADY_RUNNING`n$Probe"
  }

  $Lines = New-Object System.Collections.Generic.List[string]
  $Lines.Add("DSH_API_NOT_RUNNING; attempting local start") | Out-Null

  if (Test-Path -LiteralPath "dsh/backend/docker-compose.local.yml") {
    docker compose -f ".\dsh\backend\docker-compose.local.yml" up -d *>&1 | ForEach-Object { $Lines.Add($_.ToString()) | Out-Null }
  }

  $ApiLog = Join-Path $RunRoot "dsh-api-process.log"
  $ApiCommand = "Set-Location -LiteralPath 'C:\bthwani-suite\dsh\backend'; `$env:PORT='8080'; `$env:DATABASE_URL='postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable'; go run ./cmd/dsh-api *>> '$ApiLog'"

  Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile","-ExecutionPolicy","Bypass","-Command",$ApiCommand -WindowStyle Hidden | Out-Null

  Start-Sleep -Seconds 15

  $Probe2 = Probe-Url "http://localhost:8080/stores"
  $Lines.Add("AFTER_START_PROBE") | Out-Null
  $Lines.Add($Probe2) | Out-Null

  return ($Lines -join "`n")
}

function Make-Zip {
  $ZipArabic = Join-Path $RunRoot "FINAL_CLOSE_ALL_PHASES.zip"
  $ZipHandoff = Join-Path $RunRoot "_HANDOFF.zip"

  foreach ($Zip in @($ZipArabic, $ZipHandoff)) {
    if (Test-Path -LiteralPath $Zip) { Remove-Item -LiteralPath $Zip -Force }
  }

  $Items = Get-ChildItem -LiteralPath $RunRoot -Force |
    Where-Object { $_.Name -notin @("FINAL_CLOSE_ALL_PHASES.zip", "_HANDOFF.zip") }

  Compress-Archive -LiteralPath $Items.FullName -DestinationPath $ZipArabic -Force
  Compress-Archive -LiteralPath $Items.FullName -DestinationPath $ZipHandoff -Force

  Write-Host "Evidence ZIP: $ZipArabic"
}

Run-Step "00_git_state_before.txt" {
  git branch --show-current
  git rev-parse HEAD
  git status -sb
  git status --short
  git --no-pager diff --stat
  git --no-pager diff --name-status
  git ls-files --others --exclude-standard
} $false | Out-Null

$Branch = (git branch --show-current).Trim()
if ($Branch -ne "feat/dsh-surface-refactor") {
  Add-Finding "WRONG_BRANCH: $Branch"
  $CodeFailed = $true
}

$Required = @(
  "dsh/frontend/shared/stores/partner/partner.workflow.ts",
  "dsh/frontend/shared/stores/partner/partner.types.ts",
  "dsh/frontend/shared/stores/partner/partner.adapters.ts",
  "dsh/frontend/shared/stores/partner/partner.journey.ts",
  "dsh/frontend/shared/stores/partner/partner.flow-maps.ts",
  "dsh/frontend/shared/stores/partner/dsh-partner-activation.model.ts",
  "dsh/frontend/shared/stores/partner/dsh-partner-offer-types.ts",
  "dsh/frontend/shared/delivery/captain/captain.contract.ts",
  "dsh/frontend/shared/delivery/captain/captain.surface.types.ts",
  "dsh/frontend/shared/delivery/captain/use-captain-order-runtime.ts",
  "dsh/frontend/shared/runtime/dsh-control-panel-governance.map.ts"
)

$Missing = @()
foreach ($R in $Required) {
  if (-not (Test-Path -LiteralPath $R -PathType Leaf)) { $Missing += $R }
}

if ($Missing.Count -gt 0) {
  $Missing | Set-Content -LiteralPath (Join-Path $RunRoot "00_missing_required_targets.txt") -Encoding UTF8
  Add-Finding "MISSING_REQUIRED_TARGETS"
  $CodeFailed = $true
} else {
  "ALL_REQUIRED_TARGETS_EXIST" | Set-Content -LiteralPath (Join-Path $RunRoot "00_missing_required_targets.txt") -Encoding UTF8
}

if (-not $CodeFailed) {
  Fix-DiffCheckBlankLines
  Safe-Replace-ControlPanelContract
  Build-WltFacadeSafe
  Fix-DiffCheckBlankLines
}

if (-not $CodeFailed) {
  Run-Step "04_code_guards_after_apply.txt" {
    pnpm -w exec tsc --noEmit
    if ($LASTEXITCODE -ne 0) { return }

    pnpm run guard:no-broken-imports
    if ($LASTEXITCODE -ne 0) { return }

    pnpm run guard:depcruise:live-boundaries
    if ($LASTEXITCODE -ne 0) { return }

    node tools/guards/guard-service-runtime.mjs --service dsh
    if ($LASTEXITCODE -ne 0) { return }

    node tools/guards/guard-service-runtime.mjs --service wlt
    if ($LASTEXITCODE -ne 0) { return }

    pnpm run guard:service-postgres-runtime
    if ($LASTEXITCODE -ne 0) { return }

    git --no-pager diff --check
  } $true | Out-Null

  if ($CriticalFailed) { $CodeFailed = $true }
}

$BadControl = Scan-Files @("dsh/frontend/control-panel") @("app-client/contracts/dsh-client-binding\.contracts") "05_bad_control_panel_contract_scan.txt"
if ($BadControl.Count -gt 0) {
  Add-Finding "BAD_CONTROL_PANEL_CONTRACT_REMAINS"
  $CodeFailed = $true
}

$DirectWlt = Scan-Files @("dsh/frontend/app-client","dsh/frontend/app-partner","dsh/frontend/app-captain","dsh/frontend/app-field","dsh/frontend/control-panel") @("(import|export)\s+(type\s+)?\{[^;]+\}\s+from\s+['""][^'""]*(wlt/frontend/dsh|wlt/frontend/app-client-wlt)[^'""]*['""]") "06_direct_wlt_import_export_scan.txt"
if ($DirectWlt.Count -gt 0) {
  Add-Finding "DIRECT_WLT_IMPORT_EXPORT_REMAINS"
  $CodeFailed = $true
}

$OldShared = Scan-Files @("dsh/frontend","wlt/frontend/dsh") @("dsh/frontend/shared/(partner|captain)(/|\s|$|—|:)","shared/(partner|captain)(/|\s|$|—|:)") "07_old_shared_residual_scan.txt"
if ($OldShared.Count -gt 0) {
  Add-Finding "OLD_SHARED_PARTNER_CAPTAIN_RESIDUALS_REMAIN"
  $CodeFailed = $true
}

if ($CodeFailed) {
  Restore-Touched

  Run-Step "98_state_after_code_restore.txt" {
    git status --short
    git --no-pager diff --stat
    git --no-pager diff --name-status
    git --no-pager diff --check
  } $false | Out-Null

  $Result = "FINAL_CLOSE_FAILED_CODE_RESTORED"
} else {
  $RuntimeText = Ensure-DshRuntime
  $RuntimeText | Set-Content -LiteralPath (Join-Path $RunRoot "08_runtime_start_and_probe.txt") -Encoding UTF8

  $PendingText = Probe-Url "http://localhost:8080/stores/pending-review"
  $PendingText | Set-Content -LiteralPath (Join-Path $RunRoot "09_pending_review_probe.txt") -Encoding UTF8

  if ($RuntimeText -match "REQUEST_FAILED" -or $PendingText -match "REQUEST_FAILED") {
    Add-Finding "RUNTIME_PROBE_FAILED"
    $RuntimeFailed = $true
  }

  Run-Step "10_final_git_state.txt" {
    git status --short
    git --no-pager diff --stat
    git --no-pager diff --name-status
    git --no-pager diff --check
    git ls-files --others --exclude-standard
  } $false | Out-Null

  if ($RuntimeFailed) {
    $Result = "CODE_CLOSED_RUNTIME_NEEDS_PROCESS_CHECK"
  } else {
    $Result = "FINAL_CLOSE_ALL_PHASES_PASSED"
  }
}

if ($Findings.Count -eq 0) {
  "NO_FINDINGS" | Set-Content -LiteralPath (Join-Path $RunRoot "findings.txt") -Encoding UTF8
} else {
  $Findings | Set-Content -LiteralPath (Join-Path $RunRoot "findings.txt") -Encoding UTF8
}

$Touched | Set-Content -LiteralPath (Join-Path $RunRoot "touched_files.txt") -Encoding UTF8
$Created | Set-Content -LiteralPath (Join-Path $RunRoot "created_files.txt") -Encoding UTF8

$Summary = @(
  "# FINAL_CLOSE_ALL_PHASES",
  "",
  "SessionId: $SessionId",
  "RunRoot: $RunRoot",
  "",
  "## Result",
  "",
  "$Result",
  "",
  "## Guarantees",
  "",
  "- No exit.",
  "- No finally in pasted terminal.",
  "- Script ran as a .ps1 file.",
  "- UI/JSX/layout/design were not intentionally modified.",
  "- WLT facade uses one-source-per-facade to avoid colorPalette collisions.",
  "- On code failure, files touched by this script are restored.",
  "- No commit.",
  "- No push.",
  "",
  "## Review",
  "",
  "1. findings.txt",
  "2. 04_code_guards_after_apply.txt",
  "3. 05_bad_control_panel_contract_scan.txt",
  "4. 06_direct_wlt_import_export_scan.txt",
  "5. 07_old_shared_residual_scan.txt",
  "6. 08_runtime_start_and_probe.txt",
  "7. 09_pending_review_probe.txt",
  "8. 10_final_git_state.txt"
) -join "`n"

Write-Log "SUMMARY.md" $Summary
Make-Zip

Write-Host ""
Write-Host "RESULT: $Result"
Write-Host "RunRoot: $RunRoot"
Write-Host "Upload: $RunRoot\FINAL_CLOSE_ALL_PHASES.zip"
Write-Host ""
Read-Host "اضغط Enter بعد رفع الملف"
