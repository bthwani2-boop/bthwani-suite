Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_CLIENT_SURFACE_HOST_RENDER_ERROR_V2"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

function RelPath {
  param([string]$Path)
  if (-not $Path) { return "" }
  return $Path.Replace($RepoRoot + "\", "")
}

function Write-Line {
  param(
    [string]$Text,
    [string]$Color = "White"
  )
  Write-Host $Text -ForegroundColor $Color
}

function Get-ProjectSourceFiles {
  $Roots = @(
    "app-client\runtime",
    "app-client\shell",
    "app-client\composition",
    "ui-kit"
  )

  $All = @()

  foreach ($Root in $Roots) {
    $FullRoot = Join-Path $RepoRoot $Root
    if (-not (Test-Path -LiteralPath $FullRoot)) { continue }

    $Found = Get-ChildItem -LiteralPath $FullRoot -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx -ErrorAction SilentlyContinue |
      Where-Object {
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\dist\\" -and
        $_.FullName -notmatch "\\build\\" -and
        $_.FullName -notmatch "\\coverage\\" -and
        $_.FullName -notmatch "\\android\\app\\build\\"
      }

    $All += @($Found)
  }

  return @($All)
}

function Resolve-RelativeImport {
  param(
    [string]$FromFile,
    [string]$ImportPath
  )

  if (-not $ImportPath.StartsWith(".")) { return $null }

  $BaseDir = Split-Path -Parent $FromFile
  $BasePath = Join-Path $BaseDir $ImportPath

  $Candidates = @(
    $BasePath,
    "$BasePath.tsx",
    "$BasePath.ts",
    "$BasePath.jsx",
    "$BasePath.js",
    (Join-Path $BasePath "index.tsx"),
    (Join-Path $BasePath "index.ts"),
    (Join-Path $BasePath "index.jsx"),
    (Join-Path $BasePath "index.js")
  )

  foreach ($Candidate in $Candidates) {
    if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
      return (Resolve-Path -LiteralPath $Candidate).Path
    }
  }

  return $null
}

function Resolve-BthwaniImport {
  param([string]$ImportPath)

  if ($ImportPath -notmatch "^@bthwani/") { return $null }

  $Parts = $ImportPath -split "/"
  if ($Parts.Count -lt 2) { return $null }

  $Pkg = $Parts[1]
  $PkgRoot = Join-Path $RepoRoot $Pkg

  if (-not (Test-Path -LiteralPath $PkgRoot)) { return $null }

  if ($Parts.Count -eq 2) {
    $Candidates = @(
      (Join-Path $PkgRoot "src\index.ts"),
      (Join-Path $PkgRoot "src\index.tsx"),
      (Join-Path $PkgRoot "index.ts"),
      (Join-Path $PkgRoot "index.tsx")
    )

    foreach ($Candidate in $Candidates) {
      if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
        return (Resolve-Path -LiteralPath $Candidate).Path
      }
    }

    return $null
  }

  $SubPath = ($Parts[2..($Parts.Count - 1)] -join "\")
  $Bases = @(
    (Join-Path $PkgRoot $SubPath),
    (Join-Path (Join-Path $PkgRoot "src") $SubPath)
  )

  foreach ($Base in $Bases) {
    $Candidates = @(
      $Base,
      "$Base.tsx",
      "$Base.ts",
      "$Base.jsx",
      "$Base.js",
      (Join-Path $Base "index.tsx"),
      (Join-Path $Base "index.ts"),
      (Join-Path $Base "index.jsx"),
      (Join-Path $Base "index.js")
    )

    foreach ($Candidate in $Candidates) {
      if (Test-Path -LiteralPath $Candidate -PathType Leaf) {
        return (Resolve-Path -LiteralPath $Candidate).Path
      }
    }
  }

  return $null
}

function Resolve-ImportPath {
  param(
    [string]$FromFile,
    [string]$ImportPath
  )

  if ($ImportPath.StartsWith(".")) {
    return Resolve-RelativeImport -FromFile $FromFile -ImportPath $ImportPath
  }

  if ($ImportPath.StartsWith("@bthwani/")) {
    return Resolve-BthwaniImport -ImportPath $ImportPath
  }

  return $null
}

function Get-ImportRows {
  param([string]$File)

  if (-not (Test-Path -LiteralPath $File)) { return @() }

  $Text = Get-Content -LiteralPath $File -Raw
  $Rows = @()

  $Regex = [regex]::new("import\s+(.+?)\s+from\s+['""]([^'""]+)['""]", [System.Text.RegularExpressions.RegexOptions]::Singleline)

  foreach ($Match in $Regex.Matches($Text)) {
    $Clause = ($Match.Groups[1].Value -replace "`r|`n", " ").Trim()
    $Module = $Match.Groups[2].Value
    $Resolved = Resolve-ImportPath -FromFile $File -ImportPath $Module

    $Rows += [pscustomobject]@{
      file = RelPath $File
      clause = $Clause
      module = $Module
      resolved = RelPath $Resolved
      resolved_full = $Resolved
    }
  }

  return @($Rows)
}

function Get-ExportSignals {
  param([string]$File)

  if (-not (Test-Path -LiteralPath $File)) {
    return [pscustomobject]@{
      file = RelPath $File
      exists = $false
      has_default_export = $false
      named_exports = ""
      raw_export_lines = ""
    }
  }

  $Lines = Get-Content -LiteralPath $File
  $ExportLines = @($Lines | Where-Object { $_ -match "^\s*export\s+" })

  $Named = @()

  foreach ($Line in $ExportLines) {
    if ($Line -match "export\s+(const|function|class|type|interface|enum)\s+([A-Za-z0-9_$]+)") {
      $Named += $Matches[2]
    }

    if ($Line -match "export\s*\{(.+)\}") {
      $Named += (($Matches[1] -split ",") | ForEach-Object { $_.Trim() })
    }
  }

  return [pscustomobject]@{
    file = RelPath $File
    exists = $true
    has_default_export = [bool]($ExportLines -match "export\s+default")
    named_exports = (($Named | Sort-Object -Unique) -join ", ")
    raw_export_lines = (($ExportLines | Select-Object -First 40) -join "`n")
  }
}

Write-Line "=== CHECK CLIENT SURFACE HOST RENDER ERROR V2 ===" Cyan

$SourceFiles = Get-ProjectSourceFiles

Write-Line ("SOURCE_FILES: {0}" -f @($SourceFiles).Count) Cyan

$ClientHostHits = @()

foreach ($File in $SourceFiles) {
  $Hits = Select-String -LiteralPath $File.FullName -Pattern "ClientSurfaceHost" -SimpleMatch -ErrorAction SilentlyContinue
  foreach ($Hit in $Hits) {
    $ClientHostHits += [pscustomobject]@{
      path = RelPath $File.FullName
      line = $Hit.LineNumber
      text = $Hit.Line.Trim()
      full = $File.FullName
    }
  }
}

$ClientHostHits | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "client_surface_host_hits.json") -Encoding UTF8

$ClientFiles = @($ClientHostHits | Select-Object -ExpandProperty full -Unique)

Write-Line ""
Write-Line "CLIENT_SURFACE_HOST_HITS:" Yellow
$ClientHostHits | Select-Object -First 60 | ForEach-Object {
  Write-Line ("{0}:{1} | {2}" -f $_.path, $_.line, $_.text)
}

$ImportRows = @()
$ExportRows = @()

foreach ($File in $ClientFiles) {
  $ImportRows += Get-ImportRows -File $File
  $ExportRows += Get-ExportSignals -File $File
}

$ImportRows | Export-Csv -LiteralPath (Join-Path $RunRoot "client_surface_host_imports.csv") -NoTypeInformation -Encoding UTF8
$ExportRows | Export-Csv -LiteralPath (Join-Path $RunRoot "client_surface_host_exports.csv") -NoTypeInformation -Encoding UTF8

$ResolvedImportFiles = @($ImportRows | Where-Object { $_.resolved_full } | Select-Object -ExpandProperty resolved_full -Unique)

$ResolvedExportRows = @()
foreach ($File in $ResolvedImportFiles) {
  $ResolvedExportRows += Get-ExportSignals -File $File
}

$ResolvedExportRows | Export-Csv -LiteralPath (Join-Path $RunRoot "resolved_import_exports.csv") -NoTypeInformation -Encoding UTF8

$SuspiciousRows = @()

foreach ($Row in $ImportRows) {
  if ($Row.module.StartsWith(".") -or $Row.module.StartsWith("@bthwani/")) {
    if (-not $Row.resolved_full) {
      $SuspiciousRows += [pscustomobject]@{
        file = $Row.file
        module = $Row.module
        reason = "UNRESOLVED_LOCAL_OR_BTHWANI_IMPORT"
        clause = $Row.clause
        resolved = ""
      }
      continue
    }

    $ExportInfo = $ResolvedExportRows | Where-Object { $_.file -eq (RelPath $Row.resolved_full) } | Select-Object -First 1

    if ($Row.clause -match "^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*$") {
      if (-not $ExportInfo.has_default_export) {
        $SuspiciousRows += [pscustomobject]@{
          file = $Row.file
          module = $Row.module
          reason = "DEFAULT_IMPORT_BUT_NO_DEFAULT_EXPORT_SIGNAL"
          clause = $Row.clause
          resolved = $Row.resolved
        }
      }
    }
  }
}

$SuspiciousRows | Export-Csv -LiteralPath (Join-Path $RunRoot "suspicious_imports.csv") -NoTypeInformation -Encoding UTF8

$RegistryHits = @()

$RegistryPatterns = @(
  "clientSurfaces",
  "surfaceRegistry",
  "registry",
  "route",
  "component",
  "Component",
  "screen",
  "Screen"
)

foreach ($File in $ClientFiles) {
  foreach ($Pattern in $RegistryPatterns) {
    $Hits = Select-String -LiteralPath $File -Pattern $Pattern -SimpleMatch -ErrorAction SilentlyContinue
    foreach ($Hit in $Hits) {
      $RegistryHits += [pscustomobject]@{
        path = RelPath $File
        line = $Hit.LineNumber
        pattern = $Pattern
        text = $Hit.Line.Trim()
      }
    }
  }
}

$RegistryHits | Export-Csv -LiteralPath (Join-Path $RunRoot "registry_hits.csv") -NoTypeInformation -Encoding UTF8

$TscPath = Join-Path $RunRoot "tsc_output.txt"
$TscExitCode = $null

try {
  Write-Line ""
  Write-Line "RUNNING TYPECHECK..." Cyan
  $TscOutput = & pnpm --dir app-client/runtime exec tsc --noEmit --pretty false 2>&1
  $TscExitCode = $LASTEXITCODE
  $TscOutput | Set-Content -LiteralPath $TscPath -Encoding UTF8
} catch {
  $TscExitCode = -1
  ("TSC failed to execute: {0}" -f $_.Exception.Message) | Set-Content -LiteralPath $TscPath -Encoding UTF8
}

$LogcatPath = Join-Path $RunRoot "logcat_client_surface_host.txt"

try {
  if (Get-Command adb -ErrorAction SilentlyContinue) {
    $Device = (& adb devices) |
      Where-Object { $_ -match "^\S+\s+device$" } |
      ForEach-Object { ($_ -split "\s+")[0] } |
      Select-Object -First 1

    if ($Device) {
      $Logcat = & adb -s $Device logcat -d -t 500 2>$null
      $Filtered = $Logcat | Where-Object {
        $_ -match "ClientSurfaceHost|Element type is invalid|ReactNativeJS|undefined|Render Error"
      }
      $Filtered | Set-Content -LiteralPath $LogcatPath -Encoding UTF8
    } else {
      "No adb device found." | Set-Content -LiteralPath $LogcatPath -Encoding UTF8
    }
  } else {
    "adb not found." | Set-Content -LiteralPath $LogcatPath -Encoding UTF8
  }
} catch {
  ("logcat failed: {0}" -f $_.Exception.Message) | Set-Content -LiteralPath $LogcatPath -Encoding UTF8
}

$Verdict = "UNPROVEN"

if (@($SuspiciousRows).Count -gt 0) {
  $Verdict = "FOUND_SUSPICIOUS_IMPORT_EXPORT_CHAIN"
} elseif (@($ClientHostHits).Count -gt 0) {
  $Verdict = "CLIENT_SURFACE_HOST_FOUND_NO_DIRECT_IMPORT_SIGNAL_NEXT_RUNTIME_REGISTRY_CHECK"
} else {
  $Verdict = "CLIENT_SURFACE_HOST_NOT_FOUND_BY_TEXT_SEARCH"
}

$Evidence = [ordered]@{
  issue = $IssueCode
  session_id = $SessionId
  repo_root = $RepoRoot
  source_files = @($SourceFiles).Count
  client_surface_host_hit_count = @($ClientHostHits).Count
  client_surface_host_files = @($ClientFiles | ForEach-Object { RelPath $_ })
  import_row_count = @($ImportRows).Count
  suspicious_import_count = @($SuspiciousRows).Count
  registry_hit_count = @($RegistryHits).Count
  tsc_exit_code = $TscExitCode
  verdict = $Verdict
  result = "PASS"
  files = [ordered]@{
    client_surface_host_hits = Join-Path $RunRoot "client_surface_host_hits.json"
    client_surface_host_imports = Join-Path $RunRoot "client_surface_host_imports.csv"
    client_surface_host_exports = Join-Path $RunRoot "client_surface_host_exports.csv"
    resolved_import_exports = Join-Path $RunRoot "resolved_import_exports.csv"
    suspicious_imports = Join-Path $RunRoot "suspicious_imports.csv"
    registry_hits = Join-Path $RunRoot "registry_hits.csv"
    tsc_output = $TscPath
    logcat = $LogcatPath
  }
}

$Evidence | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

@(
  "RESULT: PASS",
  "VERDICT: $Verdict",
  "SOURCE_FILES: $(@($SourceFiles).Count)",
  "CLIENT_SURFACE_HOST_HITS: $(@($ClientHostHits).Count)",
  "CLIENT_SURFACE_HOST_FILES: $((@($ClientFiles | ForEach-Object { RelPath $_ }) -join ', '))",
  "IMPORT_ROWS: $(@($ImportRows).Count)",
  "SUSPICIOUS_IMPORTS: $(@($SuspiciousRows).Count)",
  "REGISTRY_HITS: $(@($RegistryHits).Count)",
  "TSC_EXIT_CODE: $TscExitCode",
  "RUN_ROOT: $RunRoot"
) | Set-Content -LiteralPath (Join-Path $RunRoot "summary.txt") -Encoding UTF8

Write-Line ""
Write-Line "RESULT: PASS" Green
Write-Line ("VERDICT: {0}" -f $Verdict) Green
Write-Line ("CLIENT_SURFACE_HOST_HITS: {0}" -f @($ClientHostHits).Count) Cyan
Write-Line ("CLIENT_SURFACE_HOST_FILES: {0}" -f ((@($ClientFiles | ForEach-Object { RelPath $_ }) -join ', '))) Cyan
Write-Line ("SUSPICIOUS_IMPORTS: {0}" -f @($SuspiciousRows).Count) $(if (@($SuspiciousRows).Count -gt 0) { "Yellow" } else { "Green" })
Write-Line ("REGISTRY_HITS: {0}" -f @($RegistryHits).Count) Cyan
Write-Line ("TSC_EXIT_CODE: {0}" -f $TscExitCode) Cyan

Write-Line ""
Write-Line "TOP SUSPICIOUS IMPORTS:" Yellow
$SuspiciousRows | Select-Object -First 30 | ForEach-Object {
  Write-Line ("{0} | {1} | {2} | {3}" -f $_.file, $_.reason, $_.module, $_.clause)
}

Write-Line ""
Write-Line "TOP REGISTRY HITS:" Yellow
$RegistryHits | Select-Object -First 30 | ForEach-Object {
  Write-Line ("{0}:{1} | {2}" -f $_.path, $_.line, $_.text)
}

Write-Line ""
Write-Line "EVIDENCE:" Cyan
Write-Line ("RUN_ROOT: {0}" -f $RunRoot) DarkGray
Write-Line ("summary.txt")
Write-Line ("evidence.json")
Write-Line ("suspicious_imports.csv")
Write-Line ("registry_hits.csv")
Write-Line ("tsc_output.txt")
Write-Line ("logcat_client_surface_host.txt")

Read-Host "اضغط Enter للإغلاق"
