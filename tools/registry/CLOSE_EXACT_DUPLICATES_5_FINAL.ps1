Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Continue"

$SessionId = "CLOSE_EXACT_DUPLICATES_5_FINAL-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path (Get-Location) "tools\registry\runs\$SessionId"
$BackupRoot = Join-Path $RunRoot "backups"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$Result = "NOT_STARTED"
$Failed = $false
$Touched = New-Object System.Collections.Generic.List[string]
$Created = New-Object System.Collections.Generic.List[string]
$Deleted = New-Object System.Collections.Generic.List[string]
$Findings = New-Object System.Collections.Generic.List[string]

function Add-Finding([string]$Text) { $Findings.Add($Text) | Out-Null }

function AbsPath([string]$RelPath) {
  return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $RelPath))
}

function RelPath([string]$AbsPath) {
  return $AbsPath.Replace((Get-Location).Path + "\", "").Replace("\", "/")
}

function Write-Log([string]$Name, [string]$Text) {
  Set-Content -LiteralPath (Join-Path $RunRoot $Name) -Value $Text -Encoding UTF8
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
  if (-not $Created.Contains($RelPath)) { $Created.Add($RelPath) | Out-Null }
}

function Track-Deleted([string]$RelPath) {
  if (-not $Deleted.Contains($RelPath)) { $Deleted.Add($RelPath) | Out-Null }
}

function Restore-All {
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

function Normalize-Comparable([string]$Text) {
  if ($null -eq $Text) { return $null }
  return (($Text -replace "`r`n", "`n").Trim())
}

function Assert-DuplicatePair([string]$A, [string]$B, [string]$Label) {
  $AText = Read-Utf8 $A
  $BText = Read-Utf8 $B

  if ($null -eq $AText) {
    Add-Finding "MISSING_DUPLICATE_FILE: $A"
    $script:Failed = $true
    return $false
  }

  if ($null -eq $BText) {
    Add-Finding "MISSING_DUPLICATE_FILE: $B"
    $script:Failed = $true
    return $false
  }

  if ((Normalize-Comparable $AText) -ne (Normalize-Comparable $BText)) {
    Add-Finding "NOT_EXACT_DUPLICATE_ANYMORE: $Label"
    $script:Failed = $true
    return $false
  }

  return $true
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

function Resolve-ImportTarget([string]$FromFileAbs, [string]$Spec) {
  if (-not $Spec.StartsWith(".")) { return $null }

  $Base = [System.IO.Path]::GetFullPath((Join-Path ([System.IO.Path]::GetDirectoryName($FromFileAbs)) $Spec))
  $Candidates = @(
    "$Base.ts",
    "$Base.tsx",
    "$Base.js",
    "$Base.jsx",
    "$Base.mts",
    "$Base.cts",
    "$Base/index.ts",
    "$Base/index.tsx"
  )

  foreach ($Candidate in $Candidates) {
    if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
      return [System.IO.Path]::GetFullPath($Candidate)
    }
  }

  return $null
}

function Rewrite-Imports-ToCanonical([string]$DuplicateRel, [string]$CanonicalRel) {
  $DuplicateAbs = AbsPath $DuplicateRel
  $CanonicalAbs = AbsPath $CanonicalRel
  $Files = Get-SourceFiles @("dsh/frontend", "wlt/frontend/dsh", "control-panel/runtime")
  $Report = New-Object System.Collections.Generic.List[string]
  $Pattern = '(?<prefix>(?:from\s+|import\s*\(\s*|require\s*\(\s*)["''])(?<spec>\.[^"'']+)(?<suffix>["''])'

  foreach ($File in $Files) {
    $Rel = RelPath $File.FullName
    if ($Rel -eq $DuplicateRel) { continue }

    $Before = [System.IO.File]::ReadAllText($File.FullName, [System.Text.Encoding]::UTF8)
    $After = $Before
    $Matches = [regex]::Matches($Before, $Pattern)

    foreach ($M in $Matches) {
      $Spec = $M.Groups["spec"].Value
      $Target = Resolve-ImportTarget $File.FullName $Spec

      if ($null -ne $Target -and ([System.IO.Path]::GetFullPath($Target) -eq [System.IO.Path]::GetFullPath($DuplicateAbs))) {
        $NewSpec = Get-RelativeImport $File.FullName $CanonicalAbs
        $OldFull = $M.Value
        $NewFull = $OldFull.Replace($Spec, $NewSpec)
        $After = $After.Replace($OldFull, $NewFull)
        $Report.Add(("{0} :: {1} -> {2}" -f $Rel, $Spec, $NewSpec)) | Out-Null
      }
    }

    if ($After -ne $Before) {
      Backup-File $Rel | Out-Null
      Write-Utf8 $Rel $After
    }
  }

  return $Report
}

function Count-ImportRefsToFile([string]$TargetRel) {
  $TargetAbs = AbsPath $TargetRel
  $Files = Get-SourceFiles @("dsh/frontend", "wlt/frontend/dsh", "control-panel/runtime")
  $Count = 0
  $Refs = New-Object System.Collections.Generic.List[string]
  $Pattern = '(?<prefix>(?:from\s+|import\s*\(\s*|require\s*\(\s*)["''])(?<spec>\.[^"'']+)(?<suffix>["''])'

  foreach ($File in $Files) {
    $Rel = RelPath $File.FullName
    if ($Rel -eq $TargetRel) { continue }

    $Text = [System.IO.File]::ReadAllText($File.FullName, [System.Text.Encoding]::UTF8)
    $Matches = [regex]::Matches($Text, $Pattern)

    foreach ($M in $Matches) {
      $Spec = $M.Groups["spec"].Value
      $Resolved = Resolve-ImportTarget $File.FullName $Spec

      if ($null -ne $Resolved -and ([System.IO.Path]::GetFullPath($Resolved) -eq [System.IO.Path]::GetFullPath($TargetAbs))) {
        $Count += 1
        $Refs.Add(("{0} -> {1}" -f $Rel, $Spec)) | Out-Null
      }
    }
  }

  return @{ Count = $Count; Refs = $Refs }
}

function Delete-Duplicate-If-Unreferenced([string]$DuplicateRel) {
  $Refs = Count-ImportRefsToFile $DuplicateRel

  if ($Refs.Count -gt 0) {
    Add-Finding "DUPLICATE_STILL_REFERENCED: $DuplicateRel count=$($Refs.Count)"
    $Refs.Refs | Set-Content -LiteralPath (Join-Path $RunRoot ("refs_remaining_" + (($DuplicateRel -replace "[^A-Za-z0-9_]", "_")) + ".txt")) -Encoding UTF8
    $script:Failed = $true
    return
  }

  Backup-File $DuplicateRel | Out-Null
  $Path = AbsPath $DuplicateRel

  if (Test-Path -LiteralPath $Path -PathType Leaf) {
    Remove-Item -LiteralPath $Path -Force
    Track-Deleted $DuplicateRel
  }
}

function Close-WltDuplicate([string]$Label, [string]$DuplicateRel, [string]$CanonicalRel) {
  if (-not (Assert-DuplicatePair $DuplicateRel $CanonicalRel $Label)) { return }

  $Rewrites = Rewrite-Imports-ToCanonical $DuplicateRel $CanonicalRel
  $OutName = "rewrite_" + ($Label -replace "[^A-Za-z0-9_]", "_") + ".txt"

  if ($Rewrites.Count -eq 0) {
    "NO_IMPORT_REWRITE_NEEDED" | Set-Content -LiteralPath (Join-Path $RunRoot $OutName) -Encoding UTF8
  } else {
    $Rewrites | Set-Content -LiteralPath (Join-Path $RunRoot $OutName) -Encoding UTF8
  }

  Delete-Duplicate-If-Unreferenced $DuplicateRel
}

function Close-OperationScreenDuplicate {
  $ClientRel = "dsh/frontend/app-client/components/DshOperationScreen.tsx"
  $CaptainRel = "dsh/frontend/app-captain/components/DshOperationScreen.tsx"
  $SharedRel = "dsh/frontend/shared/operations/DshOperationScreen.tsx"

  if (-not (Assert-DuplicatePair $ClientRel $CaptainRel "DSH_OPERATION_SCREEN")) { return }

  $CanonicalText = Read-Utf8 $ClientRel
  $HasDefault = $CanonicalText -match "(?m)^\s*export\s+default\b"

  if (Test-Path -LiteralPath (AbsPath $SharedRel) -PathType Leaf) {
    Backup-File $SharedRel | Out-Null
  } else {
    Track-Created $SharedRel
  }

  Write-Utf8 $SharedRel $CanonicalText

  $WrappersReport = New-Object System.Collections.Generic.List[string]

  $WrapperSpecs = @(
    @{
      Rel = $ClientRel
      Surface = "app-client"
      ExportName = "DshClientOperationScreen"
    },
    @{
      Rel = $CaptainRel
      Surface = "app-captain"
      ExportName = "DshCaptainOperationScreen"
    }
  )

  foreach ($Item in $WrapperSpecs) {
    $SurfaceRel = $Item.Rel
    $SurfaceAbs = AbsPath $SurfaceRel
    $SharedAbs = AbsPath $SharedRel
    $Spec = Get-RelativeImport $SurfaceAbs $SharedAbs

    $WrapperLines = New-Object System.Collections.Generic.List[string]
    $WrapperLines.Add("// Canonical source: $SharedRel") | Out-Null
    $WrapperLines.Add("// Surface wrapper: $($Item.Surface)") | Out-Null
    $WrapperLines.Add("// This wrapper intentionally keeps the existing surface import path stable while avoiding duplicated UI implementation.") | Out-Null
    $WrapperLines.Add("") | Out-Null
    $WrapperLines.Add("export * from '$Spec';") | Out-Null

    if ($HasDefault) {
      $WrapperLines.Add("export { default } from '$Spec';") | Out-Null
      $WrapperLines.Add("export { default as $($Item.ExportName) } from '$Spec';") | Out-Null
    }

    $WrapperLines.Add("") | Out-Null

    Backup-File $SurfaceRel | Out-Null
    Write-Utf8 $SurfaceRel (($WrapperLines -join "`n"))
    $WrappersReport.Add("WRAPPED_UNIQUE: $SurfaceRel -> $SharedRel") | Out-Null
  }

  $WrappersReport | Set-Content -LiteralPath (Join-Path $RunRoot "operation_screen_shared_wrapper.txt") -Encoding UTF8
}

function Scan-ExactDuplicatePairs {
  $Pairs = @(
    @("wlt/frontend/dsh/shared/policies/wlt-dsh-boundary.policy.ts", "wlt/frontend/dsh/shared/boundary/wlt-dsh-boundary.policy.ts"),
    @("wlt/frontend/dsh/shared/bridges/wlt-dsh-client-bridge.contract.ts", "wlt/frontend/dsh/shared/contracts/wlt-dsh-client-bridge.contract.ts"),
    @("dsh/frontend/app-captain/components/DshOperationScreen.tsx", "dsh/frontend/app-client/components/DshOperationScreen.tsx"),
    @("wlt/frontend/dsh/shared/bridges/wlt-dsh-captain-bridge.contract.ts", "wlt/frontend/dsh/shared/contracts/wlt-dsh-captain-bridge.contract.ts"),
    @("wlt/frontend/dsh/shared/bridges/wlt-dsh-field-bridge.contract.ts", "wlt/frontend/dsh/shared/contracts/wlt-dsh-field-bridge.contract.ts")
  )

  $Report = New-Object System.Collections.Generic.List[string]

  foreach ($P in $Pairs) {
    $A = $P[0]
    $B = $P[1]
    $AText = Read-Utf8 $A
    $BText = Read-Utf8 $B

    if ($null -eq $AText -or $null -eq $BText) {
      $Report.Add("MISSING_OR_DELETED_OK: $A | $B") | Out-Null
      continue
    }

    if ((Normalize-Comparable $AText) -eq (Normalize-Comparable $BText)) {
      $Report.Add("STILL_DUPLICATE: $A | $B") | Out-Null
    } else {
      $Report.Add("NOT_DUPLICATE: $A | $B") | Out-Null
    }
  }

  $Report | Set-Content -LiteralPath (Join-Path $RunRoot "duplicate_pairs_after.txt") -Encoding UTF8

  $Still = $Report | Where-Object { $_ -like "STILL_DUPLICATE:*" }
  if ($Still.Count -gt 0) {
    Add-Finding "DUPLICATE_PAIRS_STILL_EXIST"
    $script:Failed = $true
  }
}

function Exact-Duplicate-Scan-Limited {
  $Files = Get-SourceFiles @("dsh/frontend", "wlt/frontend/dsh")
  $Map = @{}

  foreach ($File in $Files) {
    $Rel = RelPath $File.FullName
    if ($Rel -match "/index\.(ts|tsx)$") { continue }
    if ($Rel -like "dsh/frontend/shared/wlt/generated/*") { continue }

    $Text = [System.IO.File]::ReadAllText($File.FullName, [System.Text.Encoding]::UTF8)
    $Norm = Normalize-Comparable $Text
    if ($Norm.Length -lt 300) { continue }

    $Bytes = [System.Text.Encoding]::UTF8.GetBytes($Norm)
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
    "NO_EXACT_DUPLICATE_SOURCE_FILES" | Set-Content -LiteralPath (Join-Path $RunRoot "exact_duplicate_scan_after.txt") -Encoding UTF8
  } else {
    $Dupes | Set-Content -LiteralPath (Join-Path $RunRoot "exact_duplicate_scan_after.txt") -Encoding UTF8
    Add-Finding "EXACT_DUPLICATES_STILL_EXIST"
    $script:Failed = $true
  }
}

function Make-Zip {
  $Zip = Join-Path $RunRoot "CLOSE_EXACT_DUPLICATES_5_FINAL.zip"
  $Handoff = Join-Path $RunRoot "_HANDOFF.zip"

  foreach ($Z in @($Zip, $Handoff)) {
    if (Test-Path -LiteralPath $Z) { Remove-Item -LiteralPath $Z -Force }
  }

  $Items = Get-ChildItem -LiteralPath $RunRoot -Force |
    Where-Object { $_.Name -notin @("CLOSE_EXACT_DUPLICATES_5_FINAL.zip", "_HANDOFF.zip") }

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

if (-not $Failed) {
  Close-WltDuplicate "WLT_BOUNDARY_POLICY" `
    "wlt/frontend/dsh/shared/policies/wlt-dsh-boundary.policy.ts" `
    "wlt/frontend/dsh/shared/boundary/wlt-dsh-boundary.policy.ts"

  Close-WltDuplicate "WLT_CLIENT_BRIDGE_CONTRACT" `
    "wlt/frontend/dsh/shared/bridges/wlt-dsh-client-bridge.contract.ts" `
    "wlt/frontend/dsh/shared/contracts/wlt-dsh-client-bridge.contract.ts"

  Close-OperationScreenDuplicate

  Close-WltDuplicate "WLT_CAPTAIN_BRIDGE_CONTRACT" `
    "wlt/frontend/dsh/shared/bridges/wlt-dsh-captain-bridge.contract.ts" `
    "wlt/frontend/dsh/shared/contracts/wlt-dsh-captain-bridge.contract.ts"

  Close-WltDuplicate "WLT_FIELD_BRIDGE_CONTRACT" `
    "wlt/frontend/dsh/shared/bridges/wlt-dsh-field-bridge.contract.ts" `
    "wlt/frontend/dsh/shared/contracts/wlt-dsh-field-bridge.contract.ts"
}

if (-not $Failed) {
  Run-Step "01_guards_after_duplicate_closure.txt" {
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
  Scan-ExactDuplicatePairs
  Exact-Duplicate-Scan-Limited
}

Run-Step "02_final_git_state.txt" {
  git status --short
  git --no-pager diff --stat
  git --no-pager diff --name-status
  git --no-pager diff --check
  git ls-files --others --exclude-standard
} $false | Out-Null

if ($Failed) {
  Restore-All

  Run-Step "98_state_after_restore.txt" {
    git status --short
    git --no-pager diff --stat
    git --no-pager diff --name-status
    git --no-pager diff --check
  } $false | Out-Null

  $Result = "DUPLICATE_CLOSURE_FAILED_RESTORED"
} else {
  $Result = "DUPLICATE_CLOSURE_PASSED"
}

if ($Findings.Count -eq 0) {
  "NO_FINDINGS" | Set-Content -LiteralPath (Join-Path $RunRoot "findings.txt") -Encoding UTF8
} else {
  $Findings | Set-Content -LiteralPath (Join-Path $RunRoot "findings.txt") -Encoding UTF8
}

$Touched | Set-Content -LiteralPath (Join-Path $RunRoot "touched_files.txt") -Encoding UTF8
$Created | Set-Content -LiteralPath (Join-Path $RunRoot "created_files.txt") -Encoding UTF8
$Deleted | Set-Content -LiteralPath (Join-Path $RunRoot "deleted_files.txt") -Encoding UTF8

$Summary = @(
  "# CLOSE_EXACT_DUPLICATES_5_FINAL",
  "",
  "SessionId: $SessionId",
  "RunRoot: $RunRoot",
  "",
  "## Result",
  "",
  "$Result",
  "",
  "## Decisions",
  "",
  "1. WLT boundary policy canonical: wlt/frontend/dsh/shared/boundary/wlt-dsh-boundary.policy.ts",
  "2. WLT bridge contracts canonical: wlt/frontend/dsh/shared/contracts/*.contract.ts",
  "3. DshOperationScreen canonical: dsh/frontend/shared/operations/DshOperationScreen.tsx",
  "4. app-client/app-captain wrappers are intentionally surface-specific to avoid duplicate wrapper content.",
  "",
  "## Guarantees",
  "",
  "- No exit.",
  "- No finally pasted into terminal.",
  "- No intentional JSX/layout/design rewrite.",
  "- Exact duplicate pairs are verified before treatment.",
  "- On failure, touched/created/deleted files are restored.",
  "- No commit.",
  "- No push.",
  "",
  "## Review files",
  "",
  "1. findings.txt",
  "2. rewrite_*.txt",
  "3. operation_screen_shared_wrapper.txt",
  "4. duplicate_pairs_after.txt",
  "5. exact_duplicate_scan_after.txt",
  "6. 01_guards_after_duplicate_closure.txt",
  "7. 02_final_git_state.txt"
) -join "`n"

Write-Log "SUMMARY.md" $Summary
Make-Zip

Write-Host ""
Write-Host "RESULT: $Result"
Write-Host "RunRoot: $RunRoot"
Write-Host "Upload: $RunRoot\CLOSE_EXACT_DUPLICATES_5_FINAL.zip"
Write-Host ""
Read-Host "اضغط Enter بعد رفع الملف"
