Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Continue"

$SessionId = "CLASSIFY_27_DEAD_CANDIDATES_SAFE-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path (Get-Location) "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$Candidates = @(
  "dsh/frontend/app-captain/dsh-captain.navigation-bridge.ts",
  "dsh/frontend/app-captain/parts/DshCaptainAccountHubContent.tsx",
  "dsh/frontend/app-client/useDshNavigation.ts",
  "dsh/frontend/app-client/hooks/useDshClientBellState.impl.ts",
  "dsh/frontend/app-client/hooks/useDshClientBellState.ts",
  "dsh/frontend/app-client/hooks/useDshClientCartState.ts",
  "dsh/frontend/app-client/hooks/useDshClientHomeActions.ts",
  "dsh/frontend/app-client/hooks/useDshClientMarketingState.ts",
  "dsh/frontend/app-client/hooks/useDshClientOrderExecution.ts",
  "dsh/frontend/app-client/hooks/useDshClientRuntimeStores.ts",
  "dsh/frontend/app-client/hooks/useDshClientStoreState.ts",
  "dsh/frontend/control-panel/shared/dsh-control-panel-operations-room.ts",
  "dsh/frontend/shared/control-panel/dsh-governance.map.ts",
  "dsh/frontend/shared/discovery/discovery.home-actions.ts",
  "dsh/frontend/shared/discovery/discovery.home-categories.ts",
  "dsh/frontend/shared/discovery/discovery.home-promo.ts",
  "dsh/frontend/shared/discovery/discovery.home-stores.ts",
  "dsh/frontend/shared/discovery/discovery.home-video.ts",
  "dsh/frontend/shared/finance-boundary/dsh-wlt-payment-session.client.ts",
  "dsh/frontend/shared/marketing/marketing.control-panel.ts",
  "dsh/frontend/shared/notifications/useDshClientBellState.ts",
  "dsh/frontend/shared/operations/operations.control-panel.ts",
  "dsh/frontend/shared/orders/client-order-status.ts",
  "dsh/frontend/shared/orders/dsh-signal-layer.model.ts",
  "dsh/frontend/shared/orders/orders.client-status.ts",
  "dsh/frontend/shared/stores/stores.runtime-hook.ts",
  "wlt/frontend/dsh/shared/boundary/wlt-dsh-boundary.policy.ts"
)

function Write-RunFile([string]$Name, [string[]]$Lines) {
  $Lines | Set-Content -LiteralPath (Join-Path $RunRoot $Name) -Encoding UTF8
}

function Get-SourceFiles {
  Get-ChildItem -LiteralPath "." -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx |
    Where-Object {
      $_.FullName -notmatch "\\node_modules\\|\\.git\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\|tools\\registry\\runs\\"
    }
}

function Normalize-Path([string]$Path) {
  return $Path.Replace("\", "/")
}

function Get-BaseNameNoExt([string]$Rel) {
  return [System.IO.Path]::GetFileNameWithoutExtension($Rel)
}

function Is-HighRiskKeep([string]$Rel) {
  if ($Rel -match "/shared/(discovery|orders|finance-boundary|stores|operations|marketing|control-panel|notifications)/") { return $true }
  if ($Rel -match "/wlt/frontend/dsh/shared/boundary/") { return $true }
  if ($Rel -match "Screen\.tsx$|Surface\.tsx$|RouteRenderer\.tsx$|navigation|bridge|policy|model|contract|types|runtime|hook|use[A-Z]") { return $true }
  return $false
}

function Count-ResolvedImportRefs([string]$TargetRel) {
  $TargetAbs = [System.IO.Path]::GetFullPath($TargetRel)
  $Count = 0
  $Refs = New-Object System.Collections.Generic.List[string]

  $Pattern = '(?:from\s+["''](?<spec>[^"'']+)["'']|import\s*\(\s*["''](?<spec2>[^"'']+)["'']\s*\)|require\s*\(\s*["''](?<spec3>[^"'']+)["'']\s*\))'

  foreach ($File in Get-SourceFiles) {
    $FileRel = Normalize-Path ($File.FullName.Replace((Get-Location).Path + "\", ""))
    if ($FileRel -eq $TargetRel) { continue }

    $Text = Get-Content -LiteralPath $File.FullName -Raw -Encoding UTF8
    $Matches = [regex]::Matches($Text, $Pattern)

    foreach ($M in $Matches) {
      $Spec = $M.Groups["spec"].Value
      if (-not $Spec) { $Spec = $M.Groups["spec2"].Value }
      if (-not $Spec) { $Spec = $M.Groups["spec3"].Value }
      if (-not $Spec.StartsWith(".")) { continue }

      $Base = [System.IO.Path]::GetFullPath((Join-Path ([System.IO.Path]::GetDirectoryName($File.FullName)) $Spec))
      $Possible = @(
        "$Base.ts",
        "$Base.tsx",
        "$Base.js",
        "$Base.jsx",
        "$Base/index.ts",
        "$Base/index.tsx"
      )

      foreach ($P in $Possible) {
        if ((Test-Path -LiteralPath $P -PathType Leaf) -and ([System.IO.Path]::GetFullPath($P) -eq $TargetAbs)) {
          $Count += 1
          $Refs.Add("$FileRel -> $Spec") | Out-Null
          break
        }
      }
    }
  }

  return @{
    Count = $Count
    Refs = $Refs
  }
}

function Count-StringRefs([string]$TargetRel) {
  $FileName = [System.IO.Path]::GetFileName($TargetRel)
  $BaseName = Get-BaseNameNoExt $TargetRel
  $CompactPath = $TargetRel.Replace("/", "\/")
  $Count = 0
  $Refs = New-Object System.Collections.Generic.List[string]

  foreach ($File in Get-SourceFiles) {
    $FileRel = Normalize-Path ($File.FullName.Replace((Get-Location).Path + "\", ""))
    if ($FileRel -eq $TargetRel) { continue }

    $Lines = Get-Content -LiteralPath $File.FullName -Encoding UTF8

    for ($i = 0; $i -lt $Lines.Count; $i++) {
      $Line = $Lines[$i]

      if (
        $Line.Contains($FileName) -or
        $Line.Contains($BaseName) -or
        $Line.Contains($TargetRel) -or
        $Line.Contains($CompactPath)
      ) {
        $Count += 1
        $Refs.Add(("{0}:{1}:{2}" -f $FileRel, ($i + 1), $Line.Trim())) | Out-Null
      }
    }
  }

  return @{
    Count = $Count
    Refs = $Refs
  }
}

function Count-BarrelExports([string]$TargetRel) {
  $BaseName = Get-BaseNameNoExt $TargetRel
  $Count = 0
  $Refs = New-Object System.Collections.Generic.List[string]

  foreach ($File in Get-SourceFiles) {
    $FileRel = Normalize-Path ($File.FullName.Replace((Get-Location).Path + "\", ""))
    if ($FileRel -notmatch "/index\.(ts|tsx)$") { continue }

    $Lines = Get-Content -LiteralPath $File.FullName -Encoding UTF8

    for ($i = 0; $i -lt $Lines.Count; $i++) {
      $Line = $Lines[$i]
      if ($Line -match "export\s+.*$BaseName") {
        $Count += 1
        $Refs.Add(("{0}:{1}:{2}" -f $FileRel, ($i + 1), $Line.Trim())) | Out-Null
      }
    }
  }

  return @{
    Count = $Count
    Refs = $Refs
  }
}

$Rows = New-Object System.Collections.Generic.List[string]
$Details = New-Object System.Collections.Generic.List[string]

$Rows.Add("file`tstatus`timportRefs`tstringRefs`tbarrelRefs`tdecision`treason") | Out-Null

foreach ($Rel in $Candidates) {
  $Exists = Test-Path -LiteralPath $Rel -PathType Leaf

  if (-not $Exists) {
    $Rows.Add("$Rel`tMISSING`t0`t0`t0`tALREADY_RETIRED_OR_MOVED`tfile does not exist") | Out-Null
    continue
  }

  $ImportRefs = Count-ResolvedImportRefs $Rel
  $StringRefs = Count-StringRefs $Rel
  $BarrelRefs = Count-BarrelExports $Rel

  $HighRisk = Is-HighRiskKeep $Rel

  $Decision = ""
  $Reason = ""

  if ($Rel -eq "wlt/frontend/dsh/shared/boundary/wlt-dsh-boundary.policy.ts") {
    $Decision = "KEEP_ACTIVE"
    $Reason = "canonical WLT boundary policy after duplicate closure"
  }
  elseif ($ImportRefs.Count -gt 0) {
    $Decision = "KEEP_ACTIVE"
    $Reason = "resolved import references exist"
  }
  elseif ($BarrelRefs.Count -gt 0) {
    $Decision = "KEEP_ACTIVE"
    $Reason = "barrel export exists"
  }
  elseif ($StringRefs.Count -gt 0) {
    $Decision = "KEEP_OR_CONNECT_ACTIVE"
    $Reason = "string/path/symbol references exist"
  }
  elseif ($HighRisk) {
    $Decision = "KEEP_OR_CONNECT_ACTIVE"
    $Reason = "high-risk domain/surface/runtime file; not safe to delete automatically"
  }
  else {
    $Decision = "RETIRE_DEAD_SAFE_CANDIDATE"
    $Reason = "no refs and low-risk path"
  }

  $Rows.Add(("{0}`tEXISTS`t{1}`t{2}`t{3}`t{4}`t{5}" -f $Rel, $ImportRefs.Count, $StringRefs.Count, $BarrelRefs.Count, $Decision, $Reason)) | Out-Null

  $Details.Add("") | Out-Null
  $Details.Add("## $Rel") | Out-Null
  $Details.Add("Decision: $Decision") | Out-Null
  $Details.Add("Reason: $Reason") | Out-Null
  $Details.Add("ImportRefs: $($ImportRefs.Count)") | Out-Null
  $ImportRefs.Refs | ForEach-Object { $Details.Add("  IMPORT $_") | Out-Null }
  $Details.Add("StringRefs: $($StringRefs.Count)") | Out-Null
  $StringRefs.Refs | ForEach-Object { $Details.Add("  STRING $_") | Out-Null }
  $Details.Add("BarrelRefs: $($BarrelRefs.Count)") | Out-Null
  $BarrelRefs.Refs | ForEach-Object { $Details.Add("  BARREL $_") | Out-Null }
}

Write-RunFile "dead_candidates_classification.tsv" $Rows
Write-RunFile "dead_candidates_details.md" $Details

$Retire = $Rows | Where-Object { $_ -match "`tRETIRE_DEAD_SAFE_CANDIDATE`t" }
$Keep = $Rows | Where-Object { $_ -match "`tKEEP_ACTIVE`t" }
$Connect = $Rows | Where-Object { $_ -match "`tKEEP_OR_CONNECT_ACTIVE`t" }

$Summary = @(
  "# CLASSIFY_27_DEAD_CANDIDATES_SAFE",
  "",
  "SessionId: $SessionId",
  "RunRoot: $RunRoot",
  "",
  "## Result",
  "",
  "DEAD_CANDIDATES_CLASSIFIED",
  "",
  "## Counts",
  "",
  "KEEP_ACTIVE=$($Keep.Count)",
  "KEEP_OR_CONNECT_ACTIVE=$($Connect.Count)",
  "RETIRE_DEAD_SAFE_CANDIDATE=$($Retire.Count)",
  "",
  "## Rule",
  "",
  "No automatic deletion was performed.",
  "Any high-risk or domain/runtime file is kept or marked for connection, not deletion.",
  "",
  "## Review",
  "",
  "1. dead_candidates_classification.tsv",
  "2. dead_candidates_details.md"
) -join "`n"

Write-RunFile "SUMMARY.md" @($Summary)

$Zip = Join-Path $RunRoot "CLASSIFY_27_DEAD_CANDIDATES_SAFE.zip"
$Handoff = Join-Path $RunRoot "_HANDOFF.zip"

$Items = Get-ChildItem -LiteralPath $RunRoot -Force |
  Where-Object { $_.Name -notin @("CLASSIFY_27_DEAD_CANDIDATES_SAFE.zip", "_HANDOFF.zip") }

Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Zip -Force
Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Handoff -Force

Write-Host ""
Write-Host "RESULT: DEAD_CANDIDATES_CLASSIFIED"
Write-Host "RunRoot: $RunRoot"
Write-Host "Upload: $Zip"
Write-Host ""
Read-Host "اضغط Enter بعد رفع الملف"
