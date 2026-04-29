Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_RENDER_ERROR_CLIENT_SURFACE_HOST_DEEP"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$Evidence = [ordered]@{
  issue = $IssueCode
  session_id = $SessionId
  repo_root = $RepoRoot
  app_file = $null
  client_surface_host_import = $null
  client_surface_host_resolved_file = $null
  client_surface_host_symbol_files = @()
  import_audit_count = 0
  unresolved_import_count = 0
  suspicious_jsx_count = 0
  registry_suspect_count = 0
  result = "UNPROVEN"
  verdict = ""
  notes = @()
}

function Write-Step {
  param(
    [string]$Text,
    [string]$Color = "White"
  )
  Write-Host $Text -ForegroundColor $Color
}

function Get-SourceFiles {
  $roots = @(
    "apps\mobile\app-client",
    "packages\app-shells",
    "packages\surfaces",
    "packages\ui-kit"
  )

  $files = New-Object System.Collections.Generic.List[object]

  foreach ($root in $roots) {
    $full = Join-Path $RepoRoot $root
    if (-not (Test-Path -LiteralPath $full)) { continue }

    Get-ChildItem -LiteralPath $full -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx |
      Where-Object {
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\dist\\" -and
        $_.FullName -notmatch "\\build\\" -and
        $_.FullName -notmatch "\\coverage\\" -and
        $_.FullName -notmatch "\\android\\app\\build\\"
      } |
      ForEach-Object { $files.Add($_) }
  }

  return @($files)
}

function Test-SourceFile {
  param([string]$Path)

  if (-not $Path) { return $false }
  if (Test-Path -LiteralPath $Path -PathType Leaf) { return $true }
  return $false
}

function Resolve-CandidateFile {
  param([string]$BasePath)

  $candidates = @(
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

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate -PathType Leaf) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }

  return $null
}

function Resolve-BthwaniModule {
  param(
    [string]$ModuleName
  )

  if ($ModuleName -notmatch "^@bthwani/") {
    return $null
  }

  $parts = $ModuleName -split "/"
  if ($parts.Count -lt 2) { return $null }

  $pkgShort = $parts[1]
  $packageRoot = Join-Path $RepoRoot ("packages\" + $pkgShort)

  if (-not (Test-Path -LiteralPath $packageRoot)) {
    return $null
  }

  $subPath = ""
  if ($parts.Count -gt 2) {
    $subPath = ($parts[2..($parts.Count - 1)] -join "\")
  }

  if ([string]::IsNullOrWhiteSpace($subPath)) {
    $rootResolved = Resolve-CandidateFile (Join-Path $packageRoot "src")
    if ($rootResolved) { return $rootResolved }

    $indexResolved = Resolve-CandidateFile $packageRoot
    if ($indexResolved) { return $indexResolved }

    return $null
  }

  $directCandidates = @(
    (Join-Path $packageRoot $subPath),
    (Join-Path (Join-Path $packageRoot "src") $subPath),
    (Join-Path (Join-Path $packageRoot "src") ($subPath -replace "\\", "\"))
  )

  foreach ($base in $directCandidates) {
    $resolved = Resolve-CandidateFile $base
    if ($resolved) { return $resolved }
  }

  $lastSegment = ($parts | Select-Object -Last 1)
  $allFiles = Get-ChildItem -LiteralPath $packageRoot -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx -ErrorAction SilentlyContinue |
    Where-Object {
      $_.FullName -notmatch "\\node_modules\\" -and
      $_.FullName -notmatch "\\dist\\" -and
      $_.FullName -notmatch "\\build\\"
    }

  $match = $allFiles |
    Where-Object {
      [System.IO.Path]::GetFileNameWithoutExtension($_.Name) -eq $lastSegment
    } |
    Select-Object -First 1

  if ($match) {
    return $match.FullName
  }

  return $null
}

function Resolve-ModulePath {
  param(
    [string]$ModuleName,
    [string]$FromFile
  )

  if ([string]::IsNullOrWhiteSpace($ModuleName)) { return $null }

  if ($ModuleName.StartsWith(".")) {
    $dir = Split-Path -Parent $FromFile
    $base = Join-Path $dir $ModuleName
    return Resolve-CandidateFile $base
  }

  if ($ModuleName.StartsWith("@bthwani/")) {
    return Resolve-BthwaniModule $ModuleName
  }

  return $null
}

function Get-ExportsFromFile {
  param(
    [string]$FilePath,
    [int]$Depth = 0,
    [hashtable]$Visited = $null
  )

  if (-not $Visited) {
    $Visited = @{}
  }

  $result = [ordered]@{
    file = $FilePath
    default = $false
    named = @{}
    reexports = @()
  }

  if (-not (Test-Path -LiteralPath $FilePath)) {
    return $result
  }

  if ($Visited.ContainsKey($FilePath)) {
    return $result
  }

  $Visited[$FilePath] = $true

  $text = Get-Content -LiteralPath $FilePath -Raw

  if ($text -match "export\s+default\s+") {
    $result.default = $true
  }

  $directRegex = [regex]"export\s+(?:const|let|var|function|class|type|interface|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)"
  foreach ($m in $directRegex.Matches($text)) {
    $result.named[$m.Groups[1].Value] = $true
  }

  $braceRegex = [regex]"export\s*\{([^}]+)\}(?:\s+from\s+['""]([^'""]+)['""])?"
  foreach ($m in $braceRegex.Matches($text)) {
    $items = $m.Groups[1].Value.Split(",")
    foreach ($raw in $items) {
      $item = $raw.Trim()
      if ([string]::IsNullOrWhiteSpace($item)) { continue }

      if ($item -match "^\s*default\s*$") {
        $result.default = $true
        continue
      }

      if ($item -match "^\s*default\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*$") {
        $result.named[$matches[1]] = $true
        continue
      }

      if ($item -match "^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*$") {
        $result.named[$matches[2]] = $true
        continue
      }

      if ($item -match "^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*$") {
        $result.named[$matches[1]] = $true
      }
    }
  }

  if ($Depth -lt 3) {
    $starRegex = [regex]"export\s+\*\s+from\s+['""]([^'""]+)['""]"
    foreach ($m in $starRegex.Matches($text)) {
      $targetModule = $m.Groups[1].Value
      $targetFile = Resolve-ModulePath $targetModule $FilePath
      if ($targetFile) {
        $result.reexports += $targetFile
        $targetExports = Get-ExportsFromFile -FilePath $targetFile -Depth ($Depth + 1) -Visited $Visited
        foreach ($k in $targetExports.named.Keys) {
          $result.named[$k] = $true
        }
        if ($targetExports.default) {
          $result.default = $true
        }
      }
    }

    $fromBraceRegex = [regex]"export\s*\{([^}]+)\}\s+from\s+['""]([^'""]+)['""]"
    foreach ($m in $fromBraceRegex.Matches($text)) {
      $targetModule = $m.Groups[2].Value
      $targetFile = Resolve-ModulePath $targetModule $FilePath
      if ($targetFile) {
        $result.reexports += $targetFile
      }
    }
  }

  return $result
}

function Parse-Imports {
  param([string]$FilePath)

  $imports = New-Object System.Collections.Generic.List[object]

  if (-not (Test-Path -LiteralPath $FilePath)) {
    return @()
  }

  $text = Get-Content -LiteralPath $FilePath -Raw
  $regex = [regex]::new("import\s+(.+?)\s+from\s+['""]([^'""]+)['""]\s*;", [System.Text.RegularExpressions.RegexOptions]::Singleline)

  foreach ($m in $regex.Matches($text)) {
    $clause = ($m.Groups[1].Value -replace "`r|`n", " ").Trim()
    $moduleName = $m.Groups[2].Value
    $resolved = Resolve-ModulePath -ModuleName $moduleName -FromFile $FilePath

    $defaultName = $null
    $namespaceName = $null
    $named = @()

    if ($clause -match "^\*\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)") {
      $namespaceName = $matches[1]
    } else {
      $beforeBrace = ($clause -replace "\{.*", "").Trim().TrimEnd(",").Trim()
      if ($beforeBrace -match "^[A-Za-z_$][A-Za-z0-9_$]*$") {
        $defaultName = $beforeBrace
      }

      $braceMatch = [regex]::Match($clause, "\{([^}]+)\}")
      if ($braceMatch.Success) {
        foreach ($raw in $braceMatch.Groups[1].Value.Split(",")) {
          $item = $raw.Trim()
          if ([string]::IsNullOrWhiteSpace($item)) { continue }

          if ($item -match "^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*$") {
            $named += [pscustomobject]@{
              imported = $matches[1]
              local = $matches[2]
            }
          } elseif ($item -match "^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*$") {
            $named += [pscustomobject]@{
              imported = $matches[1]
              local = $matches[1]
            }
          }
        }
      }
    }

    $imports.Add([pscustomobject]@{
      file = $FilePath
      module = $moduleName
      resolved = $resolved
      default_local = $defaultName
      namespace_local = $namespaceName
      named = $named
      raw = $clause
    })
  }

  return @($imports)
}

function Parse-JsxTags {
  param([string]$FilePath)

  if (-not (Test-Path -LiteralPath $FilePath)) {
    return @()
  }

  $text = Get-Content -LiteralPath $FilePath -Raw
  $regex = [regex]"<([A-Z][A-Za-z0-9_$\.]*)[\s/>]"
  $tags = New-Object System.Collections.Generic.List[object]

  foreach ($m in $regex.Matches($text)) {
    $tag = $m.Groups[1].Value
    if ($tag -in @("React.Fragment")) { continue }

    $tags.Add([pscustomobject]@{
      file = $FilePath
      tag = $tag
    })
  }

  return @($tags | Sort-Object file, tag -Unique)
}

function Get-LineHits {
  param(
    [string]$Pattern,
    [object[]]$Files
  )

  $hits = New-Object System.Collections.Generic.List[object]

  foreach ($file in $Files) {
    $matches = Select-String -LiteralPath $file.FullName -Pattern $Pattern -SimpleMatch -ErrorAction SilentlyContinue
    foreach ($m in $matches) {
      $hits.Add([pscustomobject]@{
        path = $file.FullName.Replace($RepoRoot + "\", "")
        line = $m.LineNumber
        text = $m.Line.Trim()
      })
    }
  }

  return @($hits)
}

Write-Step "=== CHECK RENDER ERROR: ClientSurfaceHost Deep Diagnosis ===" Cyan

$allFiles = Get-SourceFiles

$AppFileCandidates = @(
  (Join-Path $RepoRoot "apps\mobile\app-client\App.tsx"),
  (Join-Path $RepoRoot "apps\mobile\app-client\App.ts"),
  (Join-Path $RepoRoot "apps\mobile\app-client\index.js"),
  (Join-Path $RepoRoot "apps\mobile\app-client\index.tsx")
)

$AppFile = $AppFileCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
$Evidence.app_file = $AppFile

if (-not $AppFile) {
  $Evidence.result = "FAIL"
  $Evidence.verdict = "لم يتم العثور على App/index داخل app-client."
  $Evidence | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8
  Write-Step "RESULT: FAIL" Red
  Write-Step $Evidence.verdict Yellow
  Write-Step "RUN_ROOT: $RunRoot" DarkGray
  Read-Host "اضغط Enter للإغلاق"
  return
}

Write-Step ("APP_FILE: {0}" -f $AppFile.Replace($RepoRoot + "\", "")) Green

$AppImports = Parse-Imports $AppFile
$ClientImport = $AppImports | Where-Object {
  $_.default_local -eq "ClientSurfaceHost" -or
  ($_.named | Where-Object { $_.local -eq "ClientSurfaceHost" })
} | Select-Object -First 1

if (-not $ClientImport) {
  $clientHits = Get-LineHits -Pattern "ClientSurfaceHost" -Files $allFiles
  $clientHits | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $RunRoot "client_surface_host_hits.json") -Encoding UTF8

  $Evidence.result = "FAIL"
  $Evidence.verdict = "App file لا يحتوي import واضح لـ ClientSurfaceHost. راجع client_surface_host_hits.json."
  $Evidence | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

  Write-Step "RESULT: FAIL" Red
  Write-Step $Evidence.verdict Yellow
  Write-Step "RUN_ROOT: $RunRoot" DarkGray
  Read-Host "اضغط Enter للإغلاق"
  return
}

$Evidence.client_surface_host_import = [ordered]@{
  module = $ClientImport.module
  resolved = $ClientImport.resolved
  raw = $ClientImport.raw
}

$ClientHostFile = $ClientImport.resolved
$Evidence.client_surface_host_resolved_file = $ClientHostFile

Write-Step ("CLIENT_IMPORT: {0}" -f $ClientImport.module) Green
Write-Step ("CLIENT_RESOLVED: {0}" -f ($(if ($ClientHostFile) { $ClientHostFile.Replace($RepoRoot + "\", "") } else { "[UNRESOLVED]" }))) $(if ($ClientHostFile) { "Green" } else { "Red" })

$symbolFiles = New-Object System.Collections.Generic.List[string]

if ($ClientHostFile) {
  $symbolFiles.Add($ClientHostFile)
}

$clientSymbolHits = Get-LineHits -Pattern "ClientSurfaceHost" -Files $allFiles
foreach ($hit in $clientSymbolHits) {
  $full = Join-Path $RepoRoot $hit.path
  if ((Test-Path -LiteralPath $full) -and -not $symbolFiles.Contains($full)) {
    $symbolFiles.Add($full)
  }
}

$Evidence.client_surface_host_symbol_files = @($symbolFiles | ForEach-Object { $_.Replace($RepoRoot + "\", "") })

Write-Step ""
Write-Step "CLIENT SURFACE HOST RELATED FILES:" Cyan
$Evidence.client_surface_host_symbol_files | ForEach-Object {
  Write-Step ("- {0}" -f $_)
}

$targetFiles = New-Object System.Collections.Generic.List[string]
$targetFiles.Add($AppFile)

foreach ($f in $symbolFiles) {
  if (-not $targetFiles.Contains($f)) {
    $targetFiles.Add($f)
  }
}

$importAudit = New-Object System.Collections.Generic.List[object]
$unresolvedImports = New-Object System.Collections.Generic.List[object]
$jsxAudit = New-Object System.Collections.Generic.List[object]
$suspiciousJsx = New-Object System.Collections.Generic.List[object]
$registrySuspects = New-Object System.Collections.Generic.List[object]

foreach ($file in @($targetFiles)) {
  if (-not (Test-Path -LiteralPath $file)) { continue }

  $imports = Parse-Imports $file
  $jsxTags = Parse-JsxTags $file

  $localImportMap = @{}

  foreach ($imp in $imports) {
    $exports = $null
    if ($imp.resolved) {
      $exports = Get-ExportsFromFile -FilePath $imp.resolved
    }

    if ($imp.default_local) {
      $status = "SKIP_EXTERNAL"
      if ($imp.resolved) {
        $status = if ($exports.default) { "OK" } else { "MISSING_DEFAULT_EXPORT" }
      } elseif ($imp.module.StartsWith(".") -or $imp.module.StartsWith("@bthwani/")) {
        $status = "UNRESOLVED_MODULE"
      }

      $row = [pscustomobject]@{
        file = $file.Replace($RepoRoot + "\", "")
        import_kind = "default"
        local_name = $imp.default_local
        imported_name = "default"
        module = $imp.module
        resolved = if ($imp.resolved) { $imp.resolved.Replace($RepoRoot + "\", "") } else { "" }
        status = $status
        raw = $imp.raw
      }

      $importAudit.Add($row)
      $localImportMap[$imp.default_local] = $row

      if ($status -ne "OK" -and $status -ne "SKIP_EXTERNAL") {
        $unresolvedImports.Add($row)
      }
    }

    foreach ($n in $imp.named) {
      $status = "SKIP_EXTERNAL"
      if ($imp.resolved) {
        $status = if ($exports.named.ContainsKey($n.imported)) { "OK" } else { "MISSING_NAMED_EXPORT" }
      } elseif ($imp.module.StartsWith(".") -or $imp.module.StartsWith("@bthwani/")) {
        $status = "UNRESOLVED_MODULE"
      }

      $row = [pscustomobject]@{
        file = $file.Replace($RepoRoot + "\", "")
        import_kind = "named"
        local_name = $n.local
        imported_name = $n.imported
        module = $imp.module
        resolved = if ($imp.resolved) { $imp.resolved.Replace($RepoRoot + "\", "") } else { "" }
        status = $status
        raw = $imp.raw
      }

      $importAudit.Add($row)
      $localImportMap[$n.local] = $row

      if ($status -ne "OK" -and $status -ne "SKIP_EXTERNAL") {
        $unresolvedImports.Add($row)
      }
    }
  }

  foreach ($tagRow in $jsxTags) {
    $first = ($tagRow.tag -split "\.")[0]
    $importRow = $null
    if ($localImportMap.ContainsKey($first)) {
      $importRow = $localImportMap[$first]
    }

    $jsxRow = [pscustomobject]@{
      file = $file.Replace($RepoRoot + "\", "")
      tag = $tagRow.tag
      imported = [bool]$importRow
      import_status = if ($importRow) { $importRow.status } else { "LOCAL_OR_GLOBAL_OR_UNTRACKED" }
      module = if ($importRow) { $importRow.module } else { "" }
      resolved = if ($importRow) { $importRow.resolved } else { "" }
    }

    $jsxAudit.Add($jsxRow)

    if ($importRow -and $importRow.status -ne "OK" -and $importRow.status -ne "SKIP_EXTERNAL") {
      $suspiciousJsx.Add($jsxRow)
    }
  }

  $text = Get-Content -LiteralPath $file -Raw
  $registryPatterns = @(
    "Component",
    "Screen",
    "Surface",
    "Registry",
    "registry",
    "screens",
    "routes",
    "render"
  )

  foreach ($pattern in $registryPatterns) {
    $matches = Select-String -LiteralPath $file -Pattern $pattern -SimpleMatch -ErrorAction SilentlyContinue
    foreach ($m in $matches) {
      if ($m.Line -match "<[A-Z][A-Za-z0-9_$]*\s" -or $m.Line -match "=\s*[A-Za-z_$][A-Za-z0-9_$]*\s*;") {
        $registrySuspects.Add([pscustomobject]@{
          file = $file.Replace($RepoRoot + "\", "")
          line = $m.LineNumber
          pattern = $pattern
          text = $m.Line.Trim()
        })
      }
    }
  }
}

$importAuditPath = Join-Path $RunRoot "import_audit.csv"
$unresolvedPath = Join-Path $RunRoot "unresolved_imports.csv"
$jsxPath = Join-Path $RunRoot "jsx_audit.csv"
$suspiciousJsxPath = Join-Path $RunRoot "suspicious_jsx.csv"
$registryPath = Join-Path $RunRoot "registry_suspects.csv"
$clientHitsPath = Join-Path $RunRoot "client_surface_host_hits.json"

$importAudit | Export-Csv -LiteralPath $importAuditPath -NoTypeInformation -Encoding UTF8
$unresolvedImports | Export-Csv -LiteralPath $unresolvedPath -NoTypeInformation -Encoding UTF8
$jsxAudit | Export-Csv -LiteralPath $jsxPath -NoTypeInformation -Encoding UTF8
$suspiciousJsx | Export-Csv -LiteralPath $suspiciousJsxPath -NoTypeInformation -Encoding UTF8
$registrySuspects | Export-Csv -LiteralPath $registryPath -NoTypeInformation -Encoding UTF8
$clientSymbolHits | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $clientHitsPath -Encoding UTF8

$tscOutputPath = Join-Path $RunRoot "tsc_output.txt"
$tscRan = $false
$tscExitCode = $null

try {
  if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Step ""
    Write-Step "RUNNING TYPECHECK PROBE..." Cyan
    $tscRan = $true

    Push-Location $RepoRoot
    try {
      $output = & pnpm --dir apps/mobile/app-client exec tsc --noEmit --pretty false 2>&1
      $tscExitCode = $LASTEXITCODE
      $output | Set-Content -LiteralPath $tscOutputPath -Encoding UTF8
    } finally {
      Pop-Location
    }
  } else {
    "pnpm not found; tsc probe skipped." | Set-Content -LiteralPath $tscOutputPath -Encoding UTF8
  }
} catch {
  ("TSC probe failed to execute: {0}" -f $_.Exception.Message) | Set-Content -LiteralPath $tscOutputPath -Encoding UTF8
  $tscExitCode = -1
}

$logcatPath = Join-Path $RunRoot "adb_logcat_recent_react_errors.txt"
try {
  if (Get-Command adb -ErrorAction SilentlyContinue) {
    $devicesRaw = & adb devices
    $device = $devicesRaw |
      Where-Object { $_ -match "^\S+\s+device$" } |
      ForEach-Object { ($_ -split "\s+")[0] } |
      Select-Object -First 1

    if ($device) {
      $logcat = & adb -s $device logcat -d -t 400 2>$null
      $filtered = $logcat | Where-Object {
        $_ -match "ClientSurfaceHost|Element type is invalid|ReactNativeJS|undefined|Render Error"
      }
      $filtered | Set-Content -LiteralPath $logcatPath -Encoding UTF8
    } else {
      "No adb device found." | Set-Content -LiteralPath $logcatPath -Encoding UTF8
    }
  } else {
    "adb not found." | Set-Content -LiteralPath $logcatPath -Encoding UTF8
  }
} catch {
  ("logcat probe failed: {0}" -f $_.Exception.Message) | Set-Content -LiteralPath $logcatPath -Encoding UTF8
}

$Evidence.import_audit_count = @($importAudit).Count
$Evidence.unresolved_import_count = @($unresolvedImports).Count
$Evidence.suspicious_jsx_count = @($suspiciousJsx).Count
$Evidence.registry_suspect_count = @($registrySuspects).Count
$Evidence.tsc_ran = $tscRan
$Evidence.tsc_exit_code = $tscExitCode
$Evidence.files = [ordered]@{
  import_audit = $importAuditPath
  unresolved_imports = $unresolvedPath
  jsx_audit = $jsxPath
  suspicious_jsx = $suspiciousJsxPath
  registry_suspects = $registryPath
  client_surface_host_hits = $clientHitsPath
  tsc_output = $tscOutputPath
  adb_logcat_recent_react_errors = $logcatPath
}

if (@($suspiciousJsx).Count -gt 0 -or @($unresolvedImports).Count -gt 0) {
  $Evidence.result = "PASS"
  $Evidence.verdict = "FOUND_STATIC_IMPORT_EXPORT_SUSPECTS"
} elseif (@($registrySuspects).Count -gt 0) {
  $Evidence.result = "PASS"
  $Evidence.verdict = "NO_STATIC_IMPORT_MISMATCH_FOUND_CHECK_REGISTRY_OR_RUNTIME_COMPONENT_SELECTION"
} else {
  $Evidence.result = "PASS"
  $Evidence.verdict = "NO_DIRECT_STATIC_SUSPECT_FOUND_NEED_NEXT_RUNTIME_INSTRUMENTATION"
}

$Evidence | ConvertTo-Json -Depth 14 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

@(
  "RESULT: PASS",
  "VERDICT: $($Evidence.verdict)",
  "APP_FILE: $($Evidence.app_file)",
  "CLIENT_IMPORT_MODULE: $($Evidence.client_surface_host_import.module)",
  "CLIENT_RESOLVED_FILE: $($Evidence.client_surface_host_resolved_file)",
  "IMPORT_AUDIT_COUNT: $($Evidence.import_audit_count)",
  "UNRESOLVED_IMPORT_COUNT: $($Evidence.unresolved_import_count)",
  "SUSPICIOUS_JSX_COUNT: $($Evidence.suspicious_jsx_count)",
  "REGISTRY_SUSPECT_COUNT: $($Evidence.registry_suspect_count)",
  "TSC_RAN: $tscRan",
  "TSC_EXIT_CODE: $tscExitCode",
  "RUN_ROOT: $RunRoot"
) | Set-Content -LiteralPath (Join-Path $RunRoot "summary.txt") -Encoding UTF8

Write-Step ""
Write-Step "RESULT: PASS" Green
Write-Step ("VERDICT: {0}" -f $Evidence.verdict) Green
Write-Step ("CLIENT_IMPORT_MODULE: {0}" -f $Evidence.client_surface_host_import.module) Cyan
Write-Step ("CLIENT_RESOLVED_FILE: {0}" -f ($(if ($Evidence.client_surface_host_resolved_file) { $Evidence.client_surface_host_resolved_file.Replace($RepoRoot + "\", "") } else { "[UNRESOLVED]" }))) Cyan
Write-Step ("IMPORT_AUDIT_COUNT: {0}" -f $Evidence.import_audit_count) Cyan
Write-Step ("UNRESOLVED_IMPORT_COUNT: {0}" -f $Evidence.unresolved_import_count) $(if ($Evidence.unresolved_import_count -gt 0) { "Yellow" } else { "Green" })
Write-Step ("SUSPICIOUS_JSX_COUNT: {0}" -f $Evidence.suspicious_jsx_count) $(if ($Evidence.suspicious_jsx_count -gt 0) { "Yellow" } else { "Green" })
Write-Step ("REGISTRY_SUSPECT_COUNT: {0}" -f $Evidence.registry_suspect_count) Cyan
Write-Step ("TSC_EXIT_CODE: {0}" -f $tscExitCode) Cyan

Write-Step ""
Write-Step "TOP UNRESOLVED IMPORTS:" Yellow
$unresolvedImports | Select-Object -First 20 | ForEach-Object {
  Write-Step ("{0} | {1} {2} from {3} => {4}" -f $_.file, $_.import_kind, $_.local_name, $_.module, $_.status)
}

Write-Step ""
Write-Step "TOP SUSPICIOUS JSX:" Yellow
$suspiciousJsx | Select-Object -First 20 | ForEach-Object {
  Write-Step ("{0} | <{1}> from {2} => {3}" -f $_.file, $_.tag, $_.module, $_.import_status)
}

Write-Step ""
Write-Step "TOP REGISTRY / RUNTIME COMPONENT SUSPECTS:" Yellow
$registrySuspects | Select-Object -First 20 | ForEach-Object {
  Write-Step ("{0}:{1} | {2}" -f $_.file, $_.line, $_.text)
}

Write-Step ""
Write-Step "EVIDENCE FILES:" Cyan
Write-Step ("- {0}" -f (Join-Path $RunRoot "summary.txt"))
Write-Step ("- {0}" -f (Join-Path $RunRoot "evidence.json"))
Write-Step ("- {0}" -f $unresolvedPath)
Write-Step ("- {0}" -f $suspiciousJsxPath)
Write-Step ("- {0}" -f $registryPath)
Write-Step ("- {0}" -f $tscOutputPath)
Write-Step ("- {0}" -f $logcatPath)
Write-Step ""
Write-Step "RUN_ROOT: $RunRoot" DarkGray

Read-Host "اضغط Enter للإغلاق"
