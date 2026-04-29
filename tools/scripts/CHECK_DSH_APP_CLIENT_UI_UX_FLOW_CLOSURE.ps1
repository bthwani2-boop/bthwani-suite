Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_DSH_APP_CLIENT_UI_UX_FLOW_CLOSURE"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$Target = Join-Path (Get-Location).Path "packages\surfaces\src\service-owned\dsh\app-client"
$DocsDsh = Join-Path (Get-Location).Path "packages\surfaces\src\service-owned\dsh\SERVICE_BLUEPRINT.md"
$UiKit = Join-Path (Get-Location).Path "packages\ui-kit\src"
$PublicAppClient = Join-Path (Get-Location).Path "packages\surfaces\src\public\app-client.ts"
$AppShellClientHost = Join-Path (Get-Location).Path "packages\app-shells\mobile\client\ClientSurfaceHost.tsx"

$Findings = New-Object System.Collections.Generic.List[object]

function Add-Finding {
  param(
    [string]$Severity,
    [string]$Code,
    [string]$Path,
    [int]$Line,
    [string]$Message
  )
  $Findings.Add([pscustomobject]@{
    severity = $Severity
    code = $Code
    path = $Path
    line = $Line
    message = $Message
  }) | Out-Null
}

function Get-RelPath {
  param([string]$Path)
  return $Path.Replace((Get-Location).Path + "\", "")
}

if (-not (Test-Path -LiteralPath $Target)) {
  Add-Finding "BLOCKER" "TARGET_MISSING" $Target 0 "Target path does not exist."
} else {
  $SourceFiles = Get-ChildItem -LiteralPath $Target -Recurse -File -Include *.ts,*.tsx
  $TsxFiles = $SourceFiles | Where-Object { $_.Extension -eq ".tsx" }

  $Patterns = @(
    @{ Code="LEGACY_PLACEHOLDER"; Severity="BLOCKER"; Regex="legacy placeholder|DshIntakeHubPlaceholder" },
    @{ Code="TODO_FIXME"; Severity="BLOCKER"; Regex="\bTODO\b|\bFIXME\b|\bXXX\b" },
    @{ Code="NOOP_INTERACTION"; Severity="BLOCKER"; Regex="=>\s*undefined" },
    @{ Code="CONSOLE_ERROR"; Severity="WARN"; Regex="console\.error" },
    @{ Code="DEMO_DATA"; Severity="BLOCKER"; Regex="\bdemoCartItems\b|\bdemo\b" },
    @{ Code="HARDCODED_KSA_CONTEXT"; Severity="BLOCKER"; Regex="\bRiyadh\b|\bOlaya\b|\bSAR\b|0501234567|ر\.س" }
  )

  foreach ($File in $SourceFiles) {
    $Lines = Get-Content -LiteralPath $File.FullName
    for ($i = 0; $i -lt $Lines.Count; $i++) {
      foreach ($Pattern in $Patterns) {
        if ($Lines[$i] -match $Pattern.Regex) {
          Add-Finding $Pattern.Severity $Pattern.Code (Get-RelPath $File.FullName) ($i + 1) $Lines[$i].Trim()
        }
      }
    }
  }

  foreach ($File in $SourceFiles) {
    $Text = Get-Content -Raw -LiteralPath $File.FullName
    $Matches = [regex]::Matches($Text, "(?:import|export)\s+(?:[^'""]*?\s+from\s+)?['""](\.[^'""]+)['""]")
    foreach ($Match in $Matches) {
      $Spec = $Match.Groups[1].Value
      $Base = Join-Path $File.DirectoryName $Spec
      $Candidates = @(
        $Base,
        "$Base.ts",
        "$Base.tsx",
        "$Base.d.ts",
        (Join-Path $Base "index.ts"),
        (Join-Path $Base "index.tsx")
      )
      $Exists = $false
      foreach ($Candidate in $Candidates) {
        if (Test-Path -LiteralPath $Candidate) {
          $Exists = $true
          break
        }
      }
      if (-not $Exists) {
        Add-Finding "BLOCKER" "MISSING_RELATIVE_IMPORT" (Get-RelPath $File.FullName) 0 "Missing relative import target: $Spec"
      }
    }
  }

  $HostPath = Join-Path $Target "DshSurfaceHost.tsx"
  $CatalogPath = Join-Path $Target "surface-catalog.ts"

  if ((Test-Path -LiteralPath $HostPath) -and (Test-Path -LiteralPath $CatalogPath)) {
    $HostText = Get-Content -Raw -LiteralPath $HostPath
    $Catalog = Get-Content -Raw -LiteralPath $CatalogPath

    $RouteBlock = [regex]::Match($HostText, "export type DshRoute\s*=\s*(.*?);", "Singleline")
    $CatalogBlock = [regex]::Match($Catalog, "export const surfaceCatalog\s*=\s*\[(.*?)\]", "Singleline")

    if ($RouteBlock.Success -and $CatalogBlock.Success) {
      $Routes = [regex]::Matches($RouteBlock.Groups[1].Value, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value }
      $CatalogItems = [regex]::Matches($CatalogBlock.Groups[1].Value, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value }

      if (($CatalogItems -contains "review") -and (-not ($Routes -contains "review"))) {
        Add-Finding "BLOCKER" "CATALOG_ROUTE_DRIFT" (Get-RelPath $CatalogPath) 0 "surfaceCatalog contains 'review' but DshRoute does not."
      }

      $InternalRoutes = @(
        "my-space",
        "notifications",
        "checkout-workspace",
        "benefits",
        "conversation-workspace",
        "delivery-management-workspace",
        "intake-workspace",
        "order-issue-workspace",
        "proxy-workspace",
        "service-settings",
        "trust-workspace",
        "operations-screen"
      )

      foreach ($Route in $InternalRoutes) {
        if (($Routes -contains $Route) -and (-not ($CatalogItems -contains $Route))) {
          Add-Finding "WARN" "ROUTE_NOT_IN_CATALOG" (Get-RelPath $HostPath) 0 "Route exists in DshRoute but not in surfaceCatalog: $Route"
        }
      }
    } else {
      Add-Finding "BLOCKER" "ROUTE_CATALOG_PARSE_FAIL" (Get-RelPath $HostPath) 0 "Could not parse DshRoute or surfaceCatalog."
    }
  }

  if (Test-Path -LiteralPath $PublicAppClient) {
    $PublicText = Get-Content -Raw -LiteralPath $PublicAppClient
    if ($PublicText -notmatch "../service-owned/dsh/app-client") {
      Add-Finding "BLOCKER" "PUBLIC_EXPORT_MISSING" (Get-RelPath $PublicAppClient) 0 "Public app-client export does not expose DSH app-client."
    }
  } else {
    Add-Finding "BLOCKER" "PUBLIC_EXPORT_FILE_MISSING" $PublicAppClient 0 "Missing public app-client export file."
  }

  if (Test-Path -LiteralPath $AppShellClientHost) {
    $ShellText = Get-Content -Raw -LiteralPath $AppShellClientHost
    if ($ShellText -notmatch "DshSurfaceHost") {
      Add-Finding "BLOCKER" "APP_SHELL_DSH_HOST_NOT_CONSUMED" (Get-RelPath $AppShellClientHost) 0 "Client app shell does not consume DshSurfaceHost."
    }
  } else {
    Add-Finding "WARN" "APP_SHELL_CLIENT_HOST_MISSING" $AppShellClientHost 0 "Could not verify app shell consumption."
  }

  if (Test-Path -LiteralPath $DocsDsh) {
    $DocFiles = Get-ChildItem -LiteralPath $DocsDsh -Recurse -File
    foreach ($Doc in $DocFiles) {
      $Lines = Get-Content -LiteralPath $Doc.FullName
      for ($i = 0; $i -lt $Lines.Count; $i++) {
        if ($Lines[$i] -match "packages/surfaces/src/dsh/app-client|app-user/mobile/auto_dsh|families/entry") {
          Add-Finding "BLOCKER" "STALE_DSH_DOC_PATH" (Get-RelPath $Doc.FullName) ($i + 1) $Lines[$i].Trim()
        }
        if ($Lines[$i] -match "11_FIRST_SCREEN_RULE\.md") {
          $RulePath = Join-Path $DocsDsh "SERVICE_BLUEPRINT.md"
          if (-not (Test-Path -LiteralPath $RulePath)) {
            Add-Finding "BLOCKER" "MISSING_REFERENCED_SSOT_DOC" (Get-RelPath $Doc.FullName) ($i + 1) "References SERVICE_BLUEPRINT.md but file is missing."
          }
        }
      }
    }
  } else {
    Add-Finding "WARN" "DSH_DOCS_MISSING" $DocsDsh 0 "packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md is missing."
  }

  $Summary = [pscustomobject]@{
    issue_code = $IssueCode
    session_id = $SessionId
    target = $Target
    ts_files = ($SourceFiles | Measure-Object).Count
    tsx_files = ($TsxFiles | Measure-Object).Count
    blockers = ($Findings | Where-Object { $_.severity -eq "BLOCKER" } | Measure-Object).Count
    warnings = ($Findings | Where-Object { $_.severity -eq "WARN" } | Measure-Object).Count
    result = if (($Findings | Where-Object { $_.severity -eq "BLOCKER" } | Measure-Object).Count -eq 0) { "PASS" } else { "FAIL" }
    findings = $Findings
  }

  $SummaryPath = Join-Path $RunRoot "summary.txt"
  $EvidencePath = Join-Path $RunRoot "evidence.json"

  $Summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

  @(
    "$IssueCode"
    "SESSION_ID : $SessionId"
    "TARGET     : $Target"
    "TS_FILES   : $(($SourceFiles | Measure-Object).Count)"
    "TSX_FILES  : $(($TsxFiles | Measure-Object).Count)"
    "BLOCKERS   : $(($Findings | Where-Object { $_.severity -eq 'BLOCKER' } | Measure-Object).Count)"
    "WARNINGS   : $(($Findings | Where-Object { $_.severity -eq 'WARN' } | Measure-Object).Count)"
    "RESULT     : $($Summary.result)"
    "RUN_ROOT   : $RunRoot"
  ) | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

  Write-Host ""
  Write-Host "=== DSH APP-CLIENT UI/UX/FLOW CLOSURE CHECK ===" -ForegroundColor Cyan
  Write-Host "SESSION_ID : $SessionId"
  Write-Host "TARGET     : $Target"
  Write-Host "TS_FILES   : $(($SourceFiles | Measure-Object).Count)"
  Write-Host "TSX_FILES  : $(($TsxFiles | Measure-Object).Count)"
  Write-Host "BLOCKERS   : $(($Findings | Where-Object { $_.severity -eq 'BLOCKER' } | Measure-Object).Count)"
  Write-Host "WARNINGS   : $(($Findings | Where-Object { $_.severity -eq 'WARN' } | Measure-Object).Count)"

  if ($Summary.result -eq "PASS") {
    Write-Host "RESULT     : PASS" -ForegroundColor Green
  } else {
    Write-Host "RESULT     : FAIL" -ForegroundColor Red
  }

  Write-Host ""
  Write-Host "Top findings:" -ForegroundColor Yellow
  $Findings | Select-Object -First 40 | ForEach-Object {
    Write-Host ("[{0}] {1} :: {2}:{3} :: {4}" -f $_.severity, $_.code, $_.path, $_.line, $_.message)
  }

  Write-Host ""
  Write-Host "Evidence written to:" -ForegroundColor Cyan
  Write-Host $RunRoot
}
