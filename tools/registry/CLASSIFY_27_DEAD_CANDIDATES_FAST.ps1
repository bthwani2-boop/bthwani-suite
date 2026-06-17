Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Continue"

$SessionId = "CLASSIFY_27_DEAD_CANDIDATES_FAST-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
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

function N([string]$Path) { return $Path.Replace("\", "/") }

function Write-RunFile([string]$Name, [string[]]$Lines) {
  $Lines | Set-Content -LiteralPath (Join-Path $RunRoot $Name) -Encoding UTF8
}

function Is-HighRiskKeep([string]$Rel) {
  if ($Rel -match "/shared/(discovery|orders|finance-boundary|stores|operations|marketing|control-panel|notifications)/") { return $true }
  if ($Rel -match "/wlt/frontend/dsh/shared/boundary/") { return $true }
  if ($Rel -match "Screen\.tsx$|Surface\.tsx$|RouteRenderer\.tsx$|navigation|bridge|policy|model|contract|types|runtime|hook|use[A-Z]") { return $true }
  return $false
}

Write-Host "Indexing files once..."

$Roots = @(
  "dsh/frontend",
  "wlt/frontend/dsh",
  "control-panel/runtime"
)

$Files = New-Object System.Collections.Generic.List[object]

foreach ($Root in $Roots) {
  if (-not (Test-Path -LiteralPath $Root)) { continue }

  Get-ChildItem -LiteralPath $Root -Recurse -File |
    Where-Object {
      $_.Extension -in @(".ts", ".tsx", ".js", ".jsx") -and
      $_.FullName -notmatch "\\node_modules\\|\\.git\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\|tools\\registry\\runs\\"
    } |
    ForEach-Object { $Files.Add($_) | Out-Null }
}

$Texts = @{}
$LinesMap = @{}
$RelByAbs = @{}

foreach ($File in $Files) {
  $Rel = N ($File.FullName.Replace((Get-Location).Path + "\", ""))
  $RelByAbs[[System.IO.Path]::GetFullPath($File.FullName)] = $Rel
  $Text = Get-Content -LiteralPath $File.FullName -Raw -Encoding UTF8
  $Texts[$Rel] = $Text
  $LinesMap[$Rel] = $Text -split "`r?`n"
}

function Resolve-ImportTarget([string]$FromRel, [string]$Spec) {
  if (-not $Spec.StartsWith(".")) { return $null }

  $FromAbs = Join-Path (Get-Location) $FromRel
  $Base = [System.IO.Path]::GetFullPath((Join-Path ([System.IO.Path]::GetDirectoryName($FromAbs)) $Spec))

  $Candidates = @(
    "$Base.ts",
    "$Base.tsx",
    "$Base.js",
    "$Base.jsx",
    "$Base/index.ts",
    "$Base/index.tsx"
  )

  foreach ($C in $Candidates) {
    $Full = [System.IO.Path]::GetFullPath($C)
    if ($RelByAbs.ContainsKey($Full)) {
      return $RelByAbs[$Full]
    }
  }

  return $null
}

Write-Host "Building import index..."

$ImportRefs = @{}
$StringRefs = @{}
$BarrelRefs = @{}

foreach ($C in $Candidates) {
  $ImportRefs[$C] = New-Object System.Collections.Generic.List[string]
  $StringRefs[$C] = New-Object System.Collections.Generic.List[string]
  $BarrelRefs[$C] = New-Object System.Collections.Generic.List[string]
}

$ImportPattern = '(?:from\s+["''](?<spec>[^"'']+)["'']|import\s*\(\s*["''](?<spec2>[^"'']+)["'']\s*\)|require\s*\(\s*["''](?<spec3>[^"'']+)["'']\s*\))'

foreach ($Rel in $Texts.Keys) {
  $Text = $Texts[$Rel]
  $Matches = [regex]::Matches($Text, $ImportPattern)

  foreach ($M in $Matches) {
    $Spec = $M.Groups["spec"].Value
    if (-not $Spec) { $Spec = $M.Groups["spec2"].Value }
    if (-not $Spec) { $Spec = $M.Groups["spec3"].Value }

    $Target = Resolve-ImportTarget $Rel $Spec

    if ($null -ne $Target -and $ImportRefs.ContainsKey($Target) -and $Rel -ne $Target) {
      $ImportRefs[$Target].Add("$Rel -> $Spec") | Out-Null
    }
  }
}

Write-Host "Building string/barrel reference index..."

foreach ($Candidate in $Candidates) {
  $FileName = [System.IO.Path]::GetFileName($Candidate)
  $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($Candidate)
  $CompactPath = $Candidate.Replace("/", "\/")

  foreach ($Rel in $LinesMap.Keys) {
    if ($Rel -eq $Candidate) { continue }

    $Lines = $LinesMap[$Rel]

    for ($i = 0; $i -lt $Lines.Count; $i++) {
      $Line = $Lines[$i]

      if (
        $Line.Contains($FileName) -or
        $Line.Contains($BaseName) -or
        $Line.Contains($Candidate) -or
        $Line.Contains($CompactPath)
      ) {
        $StringRefs[$Candidate].Add(("{0}:{1}:{2}" -f $Rel, ($i + 1), $Line.Trim())) | Out-Null
      }

      if ($Rel -match "/index\.(ts|tsx)$" -and $Line -match "export\s+.*$BaseName") {
        $BarrelRefs[$Candidate].Add(("{0}:{1}:{2}" -f $Rel, ($i + 1), $Line.Trim())) | Out-Null
      }
    }
  }
}

$Rows = New-Object System.Collections.Generic.List[string]
$Details = New-Object System.Collections.Generic.List[string]
$Rows.Add("file`tstatus`timportRefs`tstringRefs`tbarrelRefs`tdecision`treason") | Out-Null

foreach ($Rel in $Candidates) {
  Write-Host "Classifying: $Rel"

  if (-not (Test-Path -LiteralPath $Rel -PathType Leaf)) {
    $Rows.Add("$Rel`tMISSING`t0`t0`t0`tALREADY_RETIRED_OR_MOVED`tfile does not exist") | Out-Null
    continue
  }

  $I = $ImportRefs[$Rel].Count
  $S = $StringRefs[$Rel].Count
  $B = $BarrelRefs[$Rel].Count
  $HighRisk = Is-HighRiskKeep $Rel

  if ($Rel -eq "wlt/frontend/dsh/shared/boundary/wlt-dsh-boundary.policy.ts") {
    $Decision = "KEEP_ACTIVE"
    $Reason = "canonical WLT boundary policy after duplicate closure"
  }
  elseif ($I -gt 0) {
    $Decision = "KEEP_ACTIVE"
    $Reason = "resolved import references exist"
  }
  elseif ($B -gt 0) {
    $Decision = "KEEP_ACTIVE"
    $Reason = "barrel export exists"
  }
  elseif ($S -gt 0) {
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

  $Rows.Add(("{0}`tEXISTS`t{1}`t{2}`t{3}`t{4}`t{5}" -f $Rel, $I, $S, $B, $Decision, $Reason)) | Out-Null

  $Details.Add("") | Out-Null
  $Details.Add("## $Rel") | Out-Null
  $Details.Add("Decision: $Decision") | Out-Null
  $Details.Add("Reason: $Reason") | Out-Null
  $Details.Add("ImportRefs: $I") | Out-Null
  $ImportRefs[$Rel] | ForEach-Object { $Details.Add("  IMPORT $_") | Out-Null }
  $Details.Add("StringRefs: $S") | Out-Null
  $StringRefs[$Rel] | ForEach-Object { $Details.Add("  STRING $_") | Out-Null }
  $Details.Add("BarrelRefs: $B") | Out-Null
  $BarrelRefs[$Rel] | ForEach-Object { $Details.Add("  BARREL $_") | Out-Null }
}

Write-RunFile "dead_candidates_classification.tsv" $Rows
Write-RunFile "dead_candidates_details.md" $Details

$Retire = $Rows | Where-Object { $_ -match "`tRETIRE_DEAD_SAFE_CANDIDATE`t" }
$Keep = $Rows | Where-Object { $_ -match "`tKEEP_ACTIVE`t" }
$Connect = $Rows | Where-Object { $_ -match "`tKEEP_OR_CONNECT_ACTIVE`t" }

$Summary = @(
  "# CLASSIFY_27_DEAD_CANDIDATES_FAST",
  "",
  "SessionId: $SessionId",
  "RunRoot: $RunRoot",
  "",
  "## Result",
  "",
  "DEAD_CANDIDATES_CLASSIFIED_FAST",
  "",
  "KEEP_ACTIVE=$($Keep.Count)",
  "KEEP_OR_CONNECT_ACTIVE=$($Connect.Count)",
  "RETIRE_DEAD_SAFE_CANDIDATE=$($Retire.Count)",
  "",
  "No deletion was performed."
) -join "`n"

Write-RunFile "SUMMARY.md" @($Summary)

$Zip = Join-Path $RunRoot "CLASSIFY_27_DEAD_CANDIDATES_FAST.zip"
$Handoff = Join-Path $RunRoot "_HANDOFF.zip"

$Items = Get-ChildItem -LiteralPath $RunRoot -Force |
  Where-Object { $_.Name -notin @("CLASSIFY_27_DEAD_CANDIDATES_FAST.zip", "_HANDOFF.zip") }

Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Zip -Force
Compress-Archive -LiteralPath $Items.FullName -DestinationPath $Handoff -Force

Write-Host ""
Write-Host "RESULT: DEAD_CANDIDATES_CLASSIFIED_FAST"
Write-Host "RunRoot: $RunRoot"
Write-Host "Upload: $Zip"
Write-Host ""
Read-Host "اضغط Enter بعد رفع الملف"
