Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Continue"

$SessionId = "FINAL_CLOSE_EXECUTE_NOW-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path (Get-Location) "tools\registry\runs\$SessionId"
$BackupRoot = Join-Path $RunRoot "backups"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$Result = "NOT_STARTED"
$Failed = $false
$Touched = New-Object System.Collections.Generic.List[string]
$Created = New-Object System.Collections.Generic.List[string]
$Findings = New-Object System.Collections.Generic.List[string]

function Add-Finding([string]$Text) {
  $Findings.Add($Text) | Out-Null
}

function Write-Log([string]$Name, [string]$Text) {
  Set-Content -LiteralPath (Join-Path $RunRoot $Name) -Value $Text -Encoding UTF8
}

function AbsPath([string]$RelPath) {
  return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $RelPath))
}

function RelPath([string]$AbsPath) {
  return $AbsPath.Replace((Get-Location).Path + "\", "").Replace("\", "/")
}

function Read-Utf8([string]$RelPath) {
  $Path = AbsPath $RelPath
  if (Test-Path -LiteralPath $Path -PathType Leaf) {
    return [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
  }
  return $null
}

function Write-Utf8([string]$RelPath, [string]$Text) {
  $Path = AbsPath $RelPath
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Path) | Out-Null
  $Encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Text, $Encoding)
}

function Backup-File([string]$RelPath) {
  $Source = AbsPath $RelPath
  if (-not (Test-Path -LiteralPath $Source -PathType Leaf)) { return $false }

  $Backup = Join-Path $BackupRoot $RelPath
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Backup) | Out-Null
  Copy-Item -LiteralPath $Source -Destination $Backup -Force

  if (-not $Touched.Contains($RelPath)) {
    $Touched.Add($RelPath) | Out-Null
  }

  return $true
}

function Track-Created([string]$RelPath) {
  if (-not $Created.Contains($RelPath)) {
    $Created.Add($RelPath) | Out-Null
  }
}

function Restore-Touched {
  foreach ($RelPath in $Created) {
    $Target = AbsPath $RelPath
    if (Test-Path -LiteralPath $Target -PathType Leaf) {
      Remove-Item -LiteralPath $Target -Force
      Write-Host "REMOVED_CREATED: $RelPath"
    }
  }

  foreach ($RelPath in $Touched) {
    $Backup = Join-Path $BackupRoot $RelPath
    $Target = AbsPath $RelPath

    if (Test-Path -LiteralPath $Backup -PathType Leaf) {
      New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Target) | Out-Null
      Copy-Item -LiteralPath $Backup -Destination $Target -Force
      Write-Host "RESTORED: $RelPath"
    }
  }
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
    $script:Failed = $true
  }

  return $Ok
}

function Get-SourceFiles([string[]]$Roots) {
  $Files = New-Object System.Collections.Generic.List[object]
  $Allowed = @(".ts", ".tsx", ".js", ".jsx", ".mts", ".cts")

  foreach ($Root in $Roots) {
    if (-not (Test-Path -LiteralPath $Root)) { continue }

    Get-ChildItem -LiteralPath $Root -Recurse -File |
      Where-Object {
        $Allowed -contains $_.Extension -and
        $_.FullName -notmatch "\\node_modules\\|\\.git\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\"
      } |
      ForEach-Object { $Files.Add($_) | Out-Null }
  }

  return $Files
}

function Normalize-Eof-For-DiffCheck {
  $Files = Get-SourceFiles @("dsh/frontend", "wlt/frontend/dsh", "control-panel/runtime")
  $Report = New-Object System.Collections.Generic.List[string]

  foreach ($File in $Files) {
    $Rel = RelPath $File.FullName
    $Text = [System.IO.File]::ReadAllText($File.FullName, [System.Text.Encoding]::UTF8)
    $New = [regex]::Replace($Text, "(\r?\n){2,}\z", "`n")

    if ($New -ne $Text) {
      Backup-File $Rel | Out-Null
      Write-Utf8 $Rel $New
      $Report.Add("FIXED_EOF: $Rel") | Out-Null
    }
  }

  if ($Report.Count -eq 0) {
    "NO_EOF_FIX_NEEDED" | Set-Content -LiteralPath (Join-Path $RunRoot "01_eof_normalization.txt") -Encoding UTF8
  } else {
    $Report | Set-Content -LiteralPath (Join-Path $RunRoot "01_eof_normalization.txt") -Encoding UTF8
  }
}

function Get-RelativeImport([string]$FromFileAbs, [string]$TargetAbs) {
  $FromDir = [System.IO.Path]::GetDirectoryName([System.IO.Path]::GetFullPath($FromFileAbs))
  $FromUri = New-Object System.Uri (($FromDir.TrimEnd('\') + '\'))
  $ToUri = New-Object System.Uri ([System.IO.Path]::GetFullPath($TargetAbs))
  $Rel = [System.Uri]::UnescapeDataString($FromUri.MakeRelativeUri($ToUri).ToString())
  $Rel = $Rel.Replace("\", "/")
  $Rel = $Rel -replace "\.(ts|tsx|js|jsx|mts|cts)$", ""
  $Rel = $Rel -replace "/index$", ""
  if (-not $Rel.StartsWith(".")) { $Rel = "./$Rel" }
  return $Rel
}

function Resolve-TargetBase([string]$FromFileAbs, [string]$Spec) {
  if (-not $Spec.StartsWith(".")) { return $null }
  return [System.IO.Path]::GetFullPath((Join-Path ([System.IO.Path]::GetDirectoryName($FromFileAbs)) $Spec))
}

function Fix-ControlPanel-Contract {
  $ContractCandidates = @(
    "dsh/frontend/shared/delivery/delivery.contract.ts",
    "dsh/frontend/shared/delivery/dsh-fulfillment-delivery-mode.contract.ts"
  )

  $ContractRel = $null

  foreach ($Candidate in $ContractCandidates) {
    $Text = Read-Utf8 $Candidate
    if ($null -ne $Text -and $Text.Contains("DshFulfillmentDeliveryMode")) {
      $ContractRel = $Candidate
      break
    }
  }

  if (-not $ContractRel) {
    Add-Finding "MISSING_SHARED_DshFulfillmentDeliveryMode_CONTRACT"
    $script:Failed = $true
    return
  }

  $Targets = @(
    @{
      File = "dsh/frontend/control-panel/support/SupportHubScreens.tsx"
      Old = "from '../../app-client/contracts/dsh-client-binding.contracts'"
      Kind = "static"
    },
    @{
      File = "dsh/frontend/control-panel/operations/AssistedOrderDeskScreen.tsx"
      Old = "import('../../app-client/contracts/dsh-client-binding.contracts').DshFulfillmentDeliveryMode"
      Kind = "dynamic"
    }
  )

  $Report = New-Object System.Collections.Generic.List[string]

  foreach ($Item in $Targets) {
    $Before = Read-Utf8 $Item.File

    if ($null -eq $Before) {
      $Report.Add("SKIPPED_MISSING: $($Item.File)") | Out-Null
      continue
    }

    if (-not $Before.Contains($Item.Old)) {
      $Report.Add("NO_CHANGE_NEEDED: $($Item.File)") | Out-Null
      continue
    }

    $FileAbs = AbsPath $Item.File
    $ContractAbs = AbsPath $ContractRel
    $ImportSpec = Get-RelativeImport $FileAbs $ContractAbs

    if ($Item.Kind -eq "static") {
      $New = "from '$ImportSpec'"
    } else {
      $New = "import('$ImportSpec').DshFulfillmentDeliveryMode"
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
        $Allowed = $Combined.Contains("app-client/contracts/dsh-client-binding.contracts") -or $Combined.Contains("shared/delivery")
        $LooksLikeJsx = $B -match "<\s*[A-Z][A-Za-z0-9]*" -or $A -match "<\s*[A-Z][A-Za-z0-9]*"

        if (-not $Allowed -or $LooksLikeJsx) {
          $Safe = $false
          $Report.Add("BLOCKED_UI_SAFETY: $($Item.File) line $($i + 1)") | Out-Null
        }
      }
    }

    if ($Safe) {
      Backup-File $Item.File | Out-Null
      Write-Utf8 $Item.File $After
      $Report.Add("UPDATED: $($Item.File) -> $ContractRel") | Out-Null
    } else {
      $script:Failed = $true
    }
  }

  $Report | Set-Content -LiteralPath (Join-Path $RunRoot "02_control_panel_contract_fix.txt") -Encoding UTF8
}

function Build-Wlt-Facades-Safe {
  $Roots = @(
    "dsh/frontend/app-client",
    "dsh/frontend/app-partner",
    "dsh/frontend/app-captain",
    "dsh/frontend/app-field",
    "dsh/frontend/control-panel"
  )

  $Files = Get-SourceFiles $Roots
  $Pattern = '(?ms)(?<head>\b(?:import|export)\s+(?:type\s+)?\{.*?\}\s+from\s+["''])(?<spec>[^"'']*(?:wlt/frontend/dsh|wlt/frontend/app-client-wlt)[^"'']*)(?<tail>["''];?)'
  $Report = New-Object System.Collections.Generic.List[string]

  foreach ($File in $Files) {
    $Rel = RelPath $File.FullName
    if ($Rel -like "dsh/frontend/shared/wlt/*") { continue }

    $Before = [System.IO.File]::ReadAllText($File.FullName, [System.Text.Encoding]::UTF8)
    $After = $Before
    $Matches = [regex]::Matches($Before, $Pattern)

    foreach ($Match in $Matches) {
      $Spec = $Match.Groups["spec"].Value
      $TargetBase = Resolve-TargetBase $File.FullName $Spec
      if (-not $TargetBase) { continue }

      $Slug = $TargetBase.Replace((Get-Location).Path, "")
      $Slug = $Slug -replace "^[\\/]+", ""
      $Slug = $Slug -replace "[^A-Za-z0-9_]+", "_"
      $Slug = $Slug.Trim("_")
      if ([string]::IsNullOrWhiteSpace($Slug)) { $Slug = "wlt_bridge" }

      $FacadeRel = "dsh/frontend/shared/wlt/generated/$Slug.facade.ts"
      $FacadeAbs = AbsPath $FacadeRel
      $FromFacadeToTarget = Get-RelativeImport $FacadeAbs $TargetBase

      $FacadeText = @(
        "// Canonical location: $FacadeRel",
        "// Authority: dsh/frontend/shared/wlt/generated — one-source WLT facade.",
        "// WLT remains the financial source of truth. This avoids merged export collisions such as colorPalette.",
        "",
        "export * from '$FromFacadeToTarget';",
        ""
      ) -join "`n"

      if (Test-Path -LiteralPath $FacadeAbs -PathType Leaf) {
        Backup-File $FacadeRel | Out-Null
      } else {
        Track-Created $FacadeRel
      }

      Write-Utf8 $FacadeRel $FacadeText

      $NewSpec = Get-RelativeImport $File.FullName $FacadeAbs
      $OldFull = $Match.Value
      $NewFull = $OldFull.Replace($Spec, $NewSpec)
      $After = $After.Replace($OldFull, $NewFull)

      $Report.Add(("{0} :: {1} -> {2}" -f $Rel, $Spec, $NewSpec)) | Out-Null
    }

    if ($After -ne $Before) {
      Backup-File $Rel | Out-Null
      Write-Utf8 $Rel $After
    }
  }

  if ($Report.Count -eq 0) {
    "NO_WLT_REWRITE_NEEDED" | Set-Content -LiteralPath (Join-Path $RunRoot "03_wlt_facades_safe.txt") -Encoding UTF8
  } else {
    $Report | Set-Content -LiteralPath (Join-Path $RunRoot "03_wlt_facades_safe.txt") -Encoding UTF8
  }
}

function Scan-Files([string[]]$Roots, [string[]]$Patterns, [string]$OutName) {
  $Matches = New-Object System.Collections.Generic.List[string]
  $Files = Get-SourceFiles $Roots

  foreach ($File in $Files) {
    $Rel = RelPath $File.FullName
    $Lines = Get-Content -LiteralPath $File.FullName -Encoding UTF8

    for ($i = 0; $i -lt $Lines.Count; $i++) {
      foreach ($Pattern in $Patterns) {
        if ($Lines[$i] -match $Pattern) {
          $Matches.Add(("{0}:{1}:{2}" -f $Rel, ($i + 1), $Lines[$i])) | Out-Null
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

function Exact-Duplicate-Scan {
  $Files = Get-SourceFiles @("dsh/frontend", "wlt/frontend/dsh", "control-panel/runtime")
  $Map = @{}

  foreach ($File in $Files) {
    $Rel = RelPath $File.FullName
    if ($Rel -like "dsh/frontend/shared/wlt/generated/*") { continue }
    if ($Rel -match "/index\.(ts|tsx)$") { continue }

    $Text = [System.IO.File]::ReadAllText($File.FullName, [System.Text.Encoding]::UTF8)
    $Normalized = [regex]::Replace($Text.Trim(), "\s+", " ")

    if ($Normalized.Length -lt 400) { continue }

    $Bytes = [System.Text.Encoding]::UTF8.GetBytes($Normalized)
    $Sha = [System.Security.Cryptography.SHA256]::Create()
    $Hash = [BitConverter]::ToString($Sha.ComputeHash($Bytes)).Replace("-", "")

    if (-not $Map.ContainsKey($Hash)) {
      $Map[$Hash] = New-Object System.Collections.Generic.List[string]
    }

    $Map[$Hash].Add($Rel) | Out-Null
  }

  $Dupes = New-Object System.Collections.Generic.List[string]

  foreach ($Key in $Map.Keys) {
    if ($Map[$Key].Count -gt 1) {
      $Dupes.Add("HASH=$Key") | Out-Null
      foreach ($File in $Map[$Key]) {
        $Dupes.Add("  $File") | Out-Null
      }
    }
  }

  if ($Dupes.Count -eq 0) {
    "NO_EXACT_DUPLICATE_SOURCE_FILES" | Set-Content -LiteralPath (Join-Path $RunRoot "08_exact_duplicate_scan.txt") -Encoding UTF8
  } else {
    $Dupes | Set-Content -LiteralPath (Join-Path $RunRoot "08_exact_duplicate_scan.txt") -Encoding UTF8
    Add-Finding "EXACT_DUPLICATE_SOURCE_FILES_FOUND"
  }
}

function Dead-Code-Candidate-Scan {
  $Files = Get-SourceFiles @("dsh/frontend", "wlt/frontend/dsh")
  $All = New-Object System.Collections.Generic.HashSet[string]
  $Refs = New-Object System.Collections.Generic.HashSet[string]

  foreach ($File in $Files) {
    $Rel = RelPath $File.FullName
    $All.Add($Rel) | Out-Null
  }

  $ImportPattern = '(?m)(?:from\s+["''](?<spec>[^"'']+)["'']|import\s*\(\s*["''](?<spec2>[^"'']+)["'']\s*\)|require\s*\(\s*["''](?<spec3>[^"'']+)["'']\s*\))'

  foreach ($File in $Files) {
    $Text = [System.IO.File]::ReadAllText($File.FullName, [System.Text.Encoding]::UTF8)
    $Matches = [regex]::Matches($Text, $ImportPattern)

    foreach ($M in $Matches) {
      $Spec = $M.Groups["spec"].Value
      if (-not $Spec) { $Spec = $M.Groups["spec2"].Value }
      if (-not $Spec) { $Spec = $M.Groups["spec3"].Value }
      if (-not $Spec.StartsWith(".")) { continue }

      $Base = Resolve-TargetBase $File.FullName $Spec
      if (-not $Base) { continue }

      $Candidates = @(
        "$Base.ts",
        "$Base.tsx",
        "$Base.js",
        "$Base.jsx",
        "$Base/index.ts",
        "$Base/index.tsx"
      )

      foreach ($C in $Candidates) {
        if (Test-Path -LiteralPath $C -PathType Leaf) {
          $Refs.Add((RelPath $C)) | Out-Null
          break
        }
      }
    }
  }

  $CandidatesOut = New-Object System.Collections.Generic.List[string]

  foreach ($Rel in $All) {
    $IsEntry =
      $Rel -match "/index\.(ts|tsx)$" -or
      $Rel -match "Screen\.tsx$" -or
      $Rel -match "Surface\.tsx$" -or
      $Rel -match "RouteRenderer\.tsx$" -or
      $Rel -match "registry|routes|catalog|contract|types|\.d\.ts"

    if (-not $Refs.Contains($Rel) -and -not $IsEntry) {
      $CandidatesOut.Add($Rel) | Out-Null
    }
  }

  if ($CandidatesOut.Count -eq 0) {
    "NO_DEAD_CODE_CANDIDATES_BY_IMPORT_GRAPH" | Set-Content -LiteralPath (Join-Path $RunRoot "09_dead_code_candidate_scan.txt") -Encoding UTF8
  } else {
    $CandidatesOut | Set-Content -LiteralPath (Join-Path $RunRoot "09_dead_code_candidate_scan.txt") -Encoding UTF8
    Add-Finding "DEAD_CODE_CANDIDATES_REQUIRE_REVIEW"
  }
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

function Runtime-Probes {
  $Lines = New-Object System.Collections.Generic.List[string]
  $Lines.Add("DSH /stores") | Out-Null
  $Lines.Add((Probe-Url "http://localhost:8080/stores")) | Out-Null
  $Lines.Add("") | Out-Null
  $Lines.Add("DSH /stores/pending-review") | Out-Null
  $Lines.Add((Probe-Url "http://localhost:8080/stores/pending-review")) | Out-Null
  $Lines | Set-Content -LiteralPath (Join-Path $RunRoot "10_runtime_probes.txt") -Encoding UTF8
}

function Make-Zip {
  $Zip = Join-Path $RunRoot "FINAL_CLOSE_EXECUTE_NOW.zip"
  $Handoff = Join-Path $RunRoot "_HANDOFF.zip"

  foreach ($Z in @($Zip, $Handoff)) {
    if (Test-Path -LiteralPath $Z) { Remove-Item -LiteralPath $Z -Force }
  }

  $Items = Get-ChildItem -LiteralPath $RunRoot -Force |
    Where-Object { $_.Name -notin @("FINAL_CLOSE_EXECUTE_NOW.zip", "_HANDOFF.zip") }

  Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Zip -Force
  Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Handoff -Force
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
  $Failed = $true
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
  if (-not (Test-Path -LiteralPath $R -PathType Leaf)) {
    $Missing += $R
  }
}

if ($Missing.Count -gt 0) {
  $Missing | Set-Content -LiteralPath (Join-Path $RunRoot "00_missing_required_targets.txt") -Encoding UTF8
  Add-Finding "MISSING_REQUIRED_TARGETS"
  $Failed = $true
} else {
  "ALL_REQUIRED_TARGETS_EXIST" | Set-Content -LiteralPath (Join-Path $RunRoot "00_missing_required_targets.txt") -Encoding UTF8
}

if (-not $Failed) {
  Normalize-Eof-For-DiffCheck
  Fix-ControlPanel-Contract
  Build-Wlt-Facades-Safe
  Normalize-Eof-For-DiffCheck

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
}

if (-not $Failed) {
  $BadControl = Scan-Files @("dsh/frontend/control-panel") @("app-client/contracts/dsh-client-binding\.contracts") "05_bad_control_panel_contract_scan.txt"
  if ($BadControl.Count -gt 0) {
    Add-Finding "BAD_CONTROL_PANEL_CONTRACT_REMAINS"
    $Failed = $true
  }

  $DirectWlt = Scan-Files @("dsh/frontend/app-client","dsh/frontend/app-partner","dsh/frontend/app-captain","dsh/frontend/app-field","dsh/frontend/control-panel") @("(import|export)\s+(type\s+)?\{[^;]+\}\s+from\s+['""][^'""]*(wlt/frontend/dsh|wlt/frontend/app-client-wlt)[^'""]*['""]") "06_direct_wlt_import_export_scan.txt"
  if ($DirectWlt.Count -gt 0) {
    Add-Finding "DIRECT_WLT_IMPORT_EXPORT_REMAINS"
    $Failed = $true
  }

  $OldShared = Scan-Files @("dsh/frontend","wlt/frontend/dsh") @("dsh/frontend/shared/(partner|captain)(/|\s|$|—|:)","shared/(partner|captain)(/|\s|$|—|:)") "07_old_shared_residual_scan.txt"
  if ($OldShared.Count -gt 0) {
    Add-Finding "OLD_SHARED_PARTNER_CAPTAIN_RESIDUALS_REMAIN"
    $Failed = $true
  }

  Exact-Duplicate-Scan
  Dead-Code-Candidate-Scan
  Runtime-Probes

  Run-Step "11_final_git_state.txt" {
    git status --short
    git --no-pager diff --stat
    git --no-pager diff --name-status
    git --no-pager diff --check
    git ls-files --others --exclude-standard
  } $false | Out-Null
}

if ($Failed) {
  Restore-Touched

  Run-Step "98_state_after_restore.txt" {
    git status --short
    git --no-pager diff --stat
    git --no-pager diff --name-status
    git --no-pager diff --check
  } $false | Out-Null

  $Result = "FINAL_CLOSE_FAILED_RESTORED"
} else {
  if ($Findings.Count -eq 0) {
    $Result = "FINAL_CLOSE_PASSED_NO_FINDINGS"
  } else {
    $Result = "FINAL_CLOSE_CODE_PASSED_WITH_AUDIT_FINDINGS"
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
  "# FINAL_CLOSE_EXECUTE_NOW",
  "",
  "SessionId: $SessionId",
  "RunRoot: $RunRoot",
  "",
  "## Result",
  "",
  "$Result",
  "",
  "## Review files",
  "",
  "1. findings.txt",
  "2. 04_code_guards_after_apply.txt",
  "3. 05_bad_control_panel_contract_scan.txt",
  "4. 06_direct_wlt_import_export_scan.txt",
  "5. 07_old_shared_residual_scan.txt",
  "6. 08_exact_duplicate_scan.txt",
  "7. 09_dead_code_candidate_scan.txt",
  "8. 10_runtime_probes.txt",
  "9. 11_final_git_state.txt",
  "",
  "## Guarantees",
  "",
  "- No exit.",
  "- No finally pasted into terminal.",
  "- No intentional JSX/layout/design changes.",
  "- WLT facade uses one-source-per-facade to avoid colorPalette collision.",
  "- Code failure restores files touched by this script.",
  "- No commit.",
  "- No push."
) -join "`n"

Write-Log "SUMMARY.md" $Summary
Make-Zip

Write-Host ""
Write-Host "RESULT: $Result"
Write-Host "RunRoot: $RunRoot"
Write-Host "Upload: $RunRoot\FINAL_CLOSE_EXECUTE_NOW.zip"
Write-Host ""
Read-Host "اضغط Enter بعد رفع الملف"
