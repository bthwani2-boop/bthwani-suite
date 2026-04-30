Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$IssueCode = "CHECK_FORENSICS_WEB_MOBILE_BOUNDARY"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$SessionId = "$IssueCode-$Stamp"
$EvidenceRoot = Join-Path (Get-Location) "tools\registry\runs\$SessionId"
$CommandsLog = Join-Path $EvidenceRoot "commands.log"

New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

function Write-FileUtf8 {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [AllowNull()][AllowEmptyString()][string]$Text
  )
  $Parent = Split-Path -Parent $Path
  if ($Parent -and -not (Test-Path -LiteralPath $Parent)) {
    New-Item -ItemType Directory -Force -Path $Parent | Out-Null
  }
  if ($null -eq $Text) { $Text = "" }
  $Text | Out-File -LiteralPath $Path -Encoding UTF8 -Force
}

function Add-Line {
  param(
    [Parameter(Mandatory=$true)][System.Text.StringBuilder]$Builder,
    [AllowNull()][AllowEmptyString()][string]$Text
  )
  if ($null -eq $Text) { $Text = "" }
  [void]$Builder.AppendLine($Text)
}

function Log {
  param([Parameter(Mandatory=$true)][string]$Text)
  Add-Content -LiteralPath $CommandsLog -Encoding UTF8 -Value ("[{0}] {1}" -f (Get-Date -Format "HH:mm:ss"), $Text)
}

function Rel {
  param([Parameter(Mandatory=$true)][string]$Path)
  try {
    $Root = [System.IO.Path]::GetFullPath((Get-Location).Path)
    $Abs = [System.IO.Path]::GetFullPath($Path)
    if ($Abs.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
      return $Abs.Substring($Root.Length).TrimStart("\","/").Replace("\","/")
    }
    return $Abs.Replace("\","/")
  } catch {
    return $Path.Replace("\","/")
  }
}

function Run-Capture {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][string]$Exe,
    [Parameter(Mandatory=$true)][string[]]$Args,
    [Parameter(Mandatory=$true)][string]$OutFile
  )

  $Cmd = "$Exe $($Args -join ' ')"
  Log "RUN $Name :: $Cmd"

  try {
    $Output = & $Exe @Args 2>&1 | Out-String
    $ExitCode = $LASTEXITCODE
    if ($null -eq $ExitCode) { $ExitCode = 0 }
  } catch {
    $Output = $_ | Out-String
    $ExitCode = 999
  }

  Write-FileUtf8 -Path $OutFile -Text $Output
  Log "EXIT $Name :: $ExitCode"

  [pscustomobject]@{
    name = $Name
    command = $Cmd
    exitCode = $ExitCode
    outFile = Rel $OutFile
  }
}

function Get-CodeFiles {
  param([Parameter(Mandatory=$true)][string[]]$Roots)

  $Files = New-Object System.Collections.Generic.List[string]

  foreach ($Root in $Roots) {
    if (-not (Test-Path -LiteralPath $Root)) { continue }

    Get-ChildItem -LiteralPath $Root -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object {
        $_.FullName -notmatch '\\node_modules\\' -and
        $_.FullName -notmatch '\\\.next\\' -and
        $_.FullName -notmatch '\\dist\\' -and
        $_.FullName -notmatch '\\build\\' -and
        $_.Extension -in @(".ts",".tsx",".js",".jsx",".mjs",".cjs")
      } |
      ForEach-Object { [void]$Files.Add($_.FullName) }
  }

  return $Files
}

function Read-JsonSafe {
  param([Parameter(Mandatory=$true)][string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return $null }
  try {
    return (Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json)
  } catch {
    return $null
  }
}

function Get-Prop {
  param($Object, [string]$Name)
  if ($null -eq $Object) { return $null }
  $P = $Object.PSObject.Properties[$Name]
  if ($null -eq $P) { return $null }
  return $P.Value
}

function Resolve-Target {
  param($Value)
  if ($Value -is [string]) { return $Value }

  foreach ($K in @("browser","import","default","module","require","types")) {
    $V = Get-Prop $Value $K
    if ($null -ne $V) {
      $R = Resolve-Target $V
      if ($R) { return $R }
    }
  }

  return $null
}

function Resolve-FileCandidate {
  param([Parameter(Mandatory=$true)][string]$BasePath)

  $Candidates = New-Object System.Collections.Generic.List[string]

  if ([System.IO.Path]::HasExtension($BasePath)) {
    [void]$Candidates.Add($BasePath)
  } else {
    foreach ($Ext in @(".ts",".tsx",".js",".jsx",".mjs",".cjs",".json")) {
      [void]$Candidates.Add("$BasePath$Ext")
    }
    foreach ($Ext in @(".ts",".tsx",".js",".jsx",".mjs",".cjs")) {
      [void]$Candidates.Add((Join-Path $BasePath "index$Ext"))
    }
  }

  foreach ($C in $Candidates) {
    try {
      $Full = [System.IO.Path]::GetFullPath($C)
      if (Test-Path -LiteralPath $Full -PathType Leaf) { return $Full }
    } catch {}
  }

  return $null
}

function Build-PackageMap {
  $Map = @{}

  foreach ($Root in @("packages","apps\web","apps\mobile")) {
    if (-not (Test-Path -LiteralPath $Root)) { continue }

    Get-ChildItem -LiteralPath $Root -Recurse -File -Filter "package.json" -ErrorAction SilentlyContinue |
      Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
      ForEach-Object {
        $Json = Read-JsonSafe -Path $_.FullName
        if ($Json -and $Json.name) {
          $Map[$Json.name] = [pscustomobject]@{
            name = $Json.name
            dir = Split-Path -Parent $_.FullName
            packageJson = $_.FullName
            json = $Json
          }
        }
      }
  }

  return $Map
}

$PackageMap = Build-PackageMap

function Resolve-WorkspaceImport {
  param(
    [Parameter(Mandatory=$true)][string]$FromFile,
    [Parameter(Mandatory=$true)][string]$Specifier
  )

  if ($Specifier.StartsWith(".")) {
    return (Resolve-FileCandidate -BasePath (Join-Path (Split-Path -Parent $FromFile) $Specifier))
  }

  $PackageName = $null
  $SubPath = ""

  if ($Specifier -match '^(@[^/]+/[^/]+)(?:/(.*))?$') {
    $PackageName = $Matches[1]
    if ($Matches.Count -gt 2 -and $Matches[2]) { $SubPath = $Matches[2] }
  } elseif ($Specifier -match '^([^/]+)(?:/(.*))?$') {
    $PackageName = $Matches[1]
    if ($Matches.Count -gt 2 -and $Matches[2]) { $SubPath = $Matches[2] }
  }

  if (-not $PackageName) { return $null }
  if (-not $PackageMap.ContainsKey($PackageName)) { return $null }

  $Pkg = $PackageMap[$PackageName]
  $Json = $Pkg.json

  if ($Json.exports) {
    $ExportKey = "."
    if ($SubPath) { $ExportKey = "./$SubPath" }

    $Entry = Get-Prop $Json.exports $ExportKey
    if ($null -ne $Entry) {
      $Target = Resolve-Target $Entry
      if ($Target) {
        $Resolved = Resolve-FileCandidate -BasePath (Join-Path $Pkg.dir $Target)
        if ($Resolved) { return $Resolved }
      }
    }
  }

  if (-not $SubPath) {
    foreach ($Field in @("source","module","main","types")) {
      $V = Get-Prop $Json $Field
      if ($V -and $V -is [string]) {
        $Resolved = Resolve-FileCandidate -BasePath (Join-Path $Pkg.dir $V)
        if ($Resolved) { return $Resolved }
      }
    }

    foreach ($Fallback in @("src\index","index")) {
      $Resolved = Resolve-FileCandidate -BasePath (Join-Path $Pkg.dir $Fallback)
      if ($Resolved) { return $Resolved }
    }
  } else {
    foreach ($Try in @($SubPath, "src\$SubPath", "$SubPath\index", "src\$SubPath\index")) {
      $Resolved = Resolve-FileCandidate -BasePath (Join-Path $Pkg.dir $Try)
      if ($Resolved) { return $Resolved }
    }
  }

  return $null
}

function Get-Imports {
  param([Parameter(Mandatory=$true)][string]$Path)

  $Rows = New-Object System.Collections.Generic.List[object]
  if (-not (Test-Path -LiteralPath $Path)) { return $Rows }

  try {
    $Lines = Get-Content -LiteralPath $Path -Encoding UTF8
  } catch {
    return $Rows
  }

  $Patterns = @(
    '^\s*import\s+(?:type\s+)?[^"'']*?\s+from\s*["'']([^"'']+)["'']',
    '^\s*import\s*["'']([^"'']+)["'']',
    '^\s*export\s+(?:type\s+)?[^"'']*?\s+from\s*["'']([^"'']+)["'']',
    '\brequire\s*\(\s*["'']([^"'']+)["'']\s*\)',
    '\bimport\s*\(\s*["'']([^"'']+)["'']\s*\)'
  )

  for ($i = 0; $i -lt $Lines.Count; $i++) {
    foreach ($Pattern in $Patterns) {
      foreach ($M in [regex]::Matches($Lines[$i], $Pattern)) {
        if ($M.Groups.Count -gt 1) {
          [void]$Rows.Add([pscustomobject]@{
            file = $Path
            line = $i + 1
            specifier = $M.Groups[1].Value
            text = $Lines[$i].Trim()
          })
        }
      }
    }
  }

  return $Rows
}

function Is-PoisonSpecifier {
  param([Parameter(Mandatory=$true)][string]$Specifier)
  return ($Specifier -match '(@expo/vector-icons|expo-modules-core|expo-font|react-native-vector-icons|^expo($|/)|^react-native($|/)|react-native-safe-area-context|react-native-svg|@bthwani/.+/mobile($|/)|/mobile($|/))')
}

function Is-MobilePath {
  param([Parameter(Mandatory=$true)][string]$Path)
  $N = $Path.Replace("\","/")
  return (
    $N -match '/packages/app-shells/mobile/' -or
    $N -match '/packages/.*/mobile/' -or
    $N -match '/apps/mobile/'
  )
}

function Export-CsvSafe {
  param(
    [Parameter(Mandatory=$false)]
    [AllowNull()]
    $Rows,

    [Parameter(Mandatory=$true)]
    [string]$Path
  )

  $Parent = Split-Path -Parent $Path
  if ($Parent -and -not (Test-Path -LiteralPath $Parent)) {
    New-Item -ItemType Directory -Force -Path $Parent | Out-Null
  }

  $Items = New-Object System.Collections.Generic.List[object]

  if ($null -ne $Rows) {
    if ($Rows -is [System.Collections.IDictionary]) {
      [void]$Items.Add([pscustomobject]$Rows)
    }
    elseif ($Rows -is [string]) {
      [void]$Items.Add([pscustomobject]@{ value = $Rows })
    }
    elseif ($Rows -is [System.Collections.IEnumerable]) {
      foreach ($Item in $Rows) {
        if ($null -ne $Item) {
          [void]$Items.Add($Item)
        }
      }
    }
    else {
      [void]$Items.Add($Rows)
    }
  }

  if ($Items.Count -eq 0) {
    "empty" | Out-File -LiteralPath $Path -Encoding UTF8 -Force
    return
  }

  $Items.ToArray() | Export-Csv -LiteralPath $Path -NoTypeInformation -Encoding UTF8 -Force
}
function Build-ControlPanelGraph {
  $EntryRoots = @(
    "apps\web\control-panel\app",
    "apps\web\control-panel\pages",
    "apps\web\control-panel\src",
    "apps\web\control-panel\components",
    "apps\web\control-panel\lib",
    "apps\web\control-panel"
  )

  $EntryFiles = Get-CodeFiles -Roots $EntryRoots
  $Visited = New-Object 'System.Collections.Generic.HashSet[string]'
  $Queue = New-Object System.Collections.Generic.Queue[string]
  $Edges = New-Object System.Collections.Generic.List[object]
  $PoisonEdges = New-Object System.Collections.Generic.List[object]
  $MobileFiles = New-Object System.Collections.Generic.List[object]

  foreach ($F in $EntryFiles) { $Queue.Enqueue($F) }

  $MaxFiles = 12000
  $Processed = 0

  while ($Queue.Count -gt 0 -and $Processed -lt $MaxFiles) {
    $Current = $Queue.Dequeue()
    try { $Current = [System.IO.Path]::GetFullPath($Current) } catch {}

    if (-not (Test-Path -LiteralPath $Current -PathType Leaf)) { continue }
    if ($Visited.Contains($Current)) { continue }

    [void]$Visited.Add($Current)
    $Processed++

    if (Is-MobilePath -Path $Current) {
      [void]$MobileFiles.Add([pscustomobject]@{
        file = Rel $Current
        reason = "Reachable mobile-only path from control-panel graph"
      })
    }

    foreach ($I in Get-Imports -Path $Current) {
      $Resolved = Resolve-WorkspaceImport -FromFile $Current -Specifier $I.specifier
      $ResolvedRel = ""
      if ($Resolved) { $ResolvedRel = Rel $Resolved }

      $Edge = [pscustomobject]@{
        from = Rel $Current
        line = $I.line
        specifier = $I.specifier
        resolved = $ResolvedRel
        sourceText = $I.text
        poisonSpecifier = [bool](Is-PoisonSpecifier -Specifier $I.specifier)
        poisonResolvedPath = [bool]($Resolved -and (Is-MobilePath -Path $Resolved))
      }

      [void]$Edges.Add($Edge)

      if ($Edge.poisonSpecifier -or $Edge.poisonResolvedPath) {
        [void]$PoisonEdges.Add($Edge)
      }

      if ($Resolved -and (Test-Path -LiteralPath $Resolved -PathType Leaf) -and -not $Visited.Contains($Resolved)) {
        $Queue.Enqueue($Resolved)
      }
    }
  }

  return [pscustomobject]@{
    visitedCount = $Visited.Count
    processedCount = $Processed
    maxFiles = $MaxFiles
    edges = $Edges
    poisonEdges = $PoisonEdges
    mobileFiles = $MobileFiles
  }
}

function Scan-ForbiddenTokens {
  $Roots = @(
    "apps\web\control-panel",
    "packages\ui-kit",
    "packages\app-shells",
    "packages\surfaces"
  )

  $Patterns = @(
    [pscustomobject]@{ name = "expo-vector-icons"; regex = "@expo/vector-icons" },
    [pscustomobject]@{ name = "expo-modules-core"; regex = "expo-modules-core" },
    [pscustomobject]@{ name = "expo-font"; regex = "expo-font" },
    [pscustomobject]@{ name = "react-native-vector-icons"; regex = "react-native-vector-icons" },
    [pscustomobject]@{ name = "react-native-import"; regex = "from\s+['""]react-native['""]|require\(['""]react-native['""]\)" },
    [pscustomobject]@{ name = "ui-kit-mobile-entry"; regex = "@bthwani/ui-kit/mobile|from\s+['""][^'""]*/mobile['""]" },
    [pscustomobject]@{ name = "app-shells-mobile-entry"; regex = "@bthwani/app-shells/mobile|packages/app-shells/mobile" }
  )

  $Rows = New-Object System.Collections.Generic.List[object]

  foreach ($File in Get-CodeFiles -Roots $Roots) {
    try { $Lines = Get-Content -LiteralPath $File -Encoding UTF8 } catch { continue }

    for ($i = 0; $i -lt $Lines.Count; $i++) {
      foreach ($P in $Patterns) {
        if ($Lines[$i] -match $P.regex) {
          [void]$Rows.Add([pscustomobject]@{
            file = Rel $File
            line = $i + 1
            pattern = $P.name
            text = $Lines[$i].Trim()
          })
        }
      }
    }
  }

  return $Rows
}

function Write-SyntaxNeighborhoods {
  $Targets = @(
    [pscustomobject]@{
      file = "packages\app-shells\mobile\partner\PartnerSurfaceHost.tsx"
      line = 148
      label = "PartnerSurfaceHost reported Unexpected token near icon property"
    },
    [pscustomobject]@{
      file = "packages\app-shells\mobile\captain\CaptainSurfaceHost.tsx"
      line = 190
      label = "CaptainSurfaceHost reported Unterminated regular expression near JSX closing"
    }
  )

  $Txt = New-Object System.Text.StringBuilder
  $Rows = New-Object System.Collections.Generic.List[object]

  foreach ($T in $Targets) {
    Add-Line $Txt ("===== {0} =====" -f $T.file)
    Add-Line $Txt $T.label

    if (-not (Test-Path -LiteralPath $T.file)) {
      Add-Line $Txt "MISSING FILE"
      Add-Line $Txt ""
      continue
    }

    $Lines = Get-Content -LiteralPath $T.file -Encoding UTF8
    $Start = [Math]::Max(1, $T.line - 22)
    $End = [Math]::Min($Lines.Count, $T.line + 22)

    Add-Line $Txt "---- neighborhood ----"
    for ($N = $Start; $N -le $End; $N++) {
      $Marker = "   "
      if ($N -eq $T.line) { $Marker = ">>>" }
      Add-Line $Txt ("{0} {1,5}: {2}" -f $Marker, $N, $Lines[$N - 1])
    }

    Add-Line $Txt ""
    Add-Line $Txt "---- suspicious fragments in whole file ----"

    for ($i = 0; $i -lt $Lines.Count; $i++) {
      $L = $Lines[$i]
      $LineNo = $i + 1

      $Suspicious =
        ($L -match '^\s*icon\s*:') -or
        ($L -match '<Icon\s+') -or
        ($L -match '^\s*/>\s*$') -or
        ($L -match 'MobileAccountTypeOption') -or
        ($L -match 'partnerTypeOptions') -or
        ($L -match 'captainTypeOptions')

      if ($Suspicious) {
        Add-Line $Txt ("{0,5}: {1}" -f $LineNo, $L)

        $Reason = "fragment"
        if ($L -match '^\s*icon\s*:') { $Reason = "Possible orphan icon property" }
        if ($L -match '^\s*/>\s*$') { $Reason = "Possible orphan JSX closing tag" }

        [void]$Rows.Add([pscustomobject]@{
          file = $T.file.Replace("\","/")
          line = $LineNo
          reason = $Reason
          text = $L.Trim()
        })
      }
    }

    Add-Line $Txt ""
  }

  Write-FileUtf8 -Path (Join-Path $EvidenceRoot "syntax-error-neighborhoods.txt") -Text $Txt.ToString()
  Export-CsvSafe -Rows $Rows -Path (Join-Path $EvidenceRoot "syntax-suspicious-lines.csv")

  return $Rows
}

function Snapshot-Configs {
  $Txt = New-Object System.Text.StringBuilder

  foreach ($File in @(
    "apps\web\control-panel\package.json",
    "apps\web\control-panel\next.config.js",
    "apps\web\control-panel\next.config.mjs",
    "apps\web\control-panel\next.config.ts",
    "apps\web\control-panel\next.config.cjs",
    "package.json",
    "pnpm-workspace.yaml",
    "tsconfig.base.json",
    "tsconfig.json"
  )) {
    if (Test-Path -LiteralPath $File) {
      Add-Line $Txt ("===== {0} =====" -f $File)
      Add-Line $Txt (Get-Content -LiteralPath $File -Raw -Encoding UTF8)
      Add-Line $Txt ""
    }
  }

  Write-FileUtf8 -Path (Join-Path $EvidenceRoot "workspace-and-next-config-snapshot.txt") -Text $Txt.ToString()

  $PkgRows = New-Object System.Collections.Generic.List[object]
  foreach ($Key in $PackageMap.Keys) {
    $Pkg = $PackageMap[$Key]
    $Json = $Pkg.json
    $Exports = ""
    if ($Json.exports) {
      try { $Exports = $Json.exports | ConvertTo-Json -Depth 20 -Compress } catch { $Exports = "[unserializable]" }
    }

    [void]$PkgRows.Add([pscustomobject]@{
      name = $Pkg.name
      dir = Rel $Pkg.dir
      packageJson = Rel $Pkg.packageJson
      main = [string](Get-Prop $Json "main")
      module = [string](Get-Prop $Json "module")
      source = [string](Get-Prop $Json "source")
      types = [string](Get-Prop $Json "types")
      exports = $Exports
    })
  }

  Export-CsvSafe -Rows $PkgRows -Path (Join-Path $EvidenceRoot "package-exports.csv")
  Write-FileUtf8 -Path (Join-Path $EvidenceRoot "package-exports.json") -Text ($PkgRows | ConvertTo-Json -Depth 30)
}

Log "SESSION $SessionId"
Log "EVIDENCE_ROOT $EvidenceRoot"

$CommandResults = New-Object System.Collections.Generic.List[object]

[void]$CommandResults.Add((Run-Capture -Name "git-status-short" -Exe "git" -Args @("--no-pager","status","--short") -OutFile (Join-Path $EvidenceRoot "git-status.txt")))
[void]$CommandResults.Add((Run-Capture -Name "git-diff-check" -Exe "git" -Args @("--no-pager","diff","--check") -OutFile (Join-Path $EvidenceRoot "git-diff-check.txt")))

Snapshot-Configs

$ForbiddenRows = Scan-ForbiddenTokens
Export-CsvSafe -Rows $ForbiddenRows -Path (Join-Path $EvidenceRoot "forbidden-token-scan.csv")
Write-FileUtf8 -Path (Join-Path $EvidenceRoot "forbidden-token-scan.json") -Text ($ForbiddenRows | ConvertTo-Json -Depth 30)

$Graph = Build-ControlPanelGraph
Export-CsvSafe -Rows $Graph.edges -Path (Join-Path $EvidenceRoot "reachable-import-graph.csv")
Export-CsvSafe -Rows $Graph.poisonEdges -Path (Join-Path $EvidenceRoot "reachable-poison-imports.csv")
Export-CsvSafe -Rows $Graph.mobileFiles -Path (Join-Path $EvidenceRoot "reachable-mobile-files.csv")
Write-FileUtf8 -Path (Join-Path $EvidenceRoot "reachable-import-graph.json") -Text ($Graph | ConvertTo-Json -Depth 30)

$SyntaxRows = Write-SyntaxNeighborhoods

[void]$CommandResults.Add((Run-Capture -Name "tsc-noemit" -Exe "pnpm" -Args @("-w","exec","tsc","--noEmit") -OutFile (Join-Path $EvidenceRoot "tsc-noemit.txt")))

$DirectControlPanelForbidden = @($ForbiddenRows | Where-Object { $_.file -match '^apps/web/control-panel/' })
$SyntaxSuspectCount = @($SyntaxRows | Where-Object { $_.reason -match "orphan|Possible" }).Count
$Tsc = $CommandResults | Where-Object { $_.name -eq "tsc-noemit" } | Select-Object -First 1

$FailReasons = New-Object System.Collections.Generic.List[string]

if ($Graph.poisonEdges.Count -gt 0) {
  [void]$FailReasons.Add("Reachable poison imports from apps/web/control-panel: $($Graph.poisonEdges.Count)")
}
if ($Graph.mobileFiles.Count -gt 0) {
  [void]$FailReasons.Add("Reachable mobile-only files from apps/web/control-panel: $($Graph.mobileFiles.Count)")
}
if ($DirectControlPanelForbidden.Count -gt 0) {
  [void]$FailReasons.Add("Direct forbidden Expo/RN tokens inside apps/web/control-panel: $($DirectControlPanelForbidden.Count)")
}
if ($SyntaxSuspectCount -gt 0) {
  [void]$FailReasons.Add("Suspicious mobile syntax fragments: $SyntaxSuspectCount")
}
if ($Tsc -and $Tsc.exitCode -ne 0) {
  [void]$FailReasons.Add("pnpm -w exec tsc --noEmit failed with exit code $($Tsc.exitCode)")
}

$Status = "PASS"
if ($FailReasons.Count -gt 0) { $Status = "FAIL" }

$RootCause = New-Object System.Text.StringBuilder
Add-Line $RootCause "# Root Cause Candidates"
Add-Line $RootCause ""
Add-Line $RootCause ("Status: {0}" -f $Status)
Add-Line $RootCause ""
Add-Line $RootCause "## Candidate A - control-panel reaches Expo / React Native / mobile-only imports"
Add-Line $RootCause ("- Reachable files visited: {0}" -f $Graph.visitedCount)
Add-Line $RootCause ("- Poison import edges: {0}" -f $Graph.poisonEdges.Count)
Add-Line $RootCause ("- Reachable mobile files: {0}" -f $Graph.mobileFiles.Count)
Add-Line $RootCause ""

if ($Graph.poisonEdges.Count -gt 0) {
  Add-Line $RootCause "### First poison edges"
  $Graph.poisonEdges | Select-Object -First 50 | ForEach-Object {
    Add-Line $RootCause ("- {0}:{1} imports '{2}' resolved='{3}'" -f $_.from, $_.line, $_.specifier, $_.resolved)
  }
} else {
  Add-Line $RootCause "- No poison edge found by static workspace graph. Inspect forbidden-token-scan.csv and package-exports.csv."
}

Add-Line $RootCause ""
Add-Line $RootCause "## Candidate B - barrel/export boundary mixes web and mobile"
Add-Line $RootCause "- Inspect package-exports.csv"
Add-Line $RootCause "- Inspect reachable-import-graph.csv"
Add-Line $RootCause "- Inspect forbidden-token-scan.csv"
Add-Line $RootCause ""
Add-Line $RootCause "## Candidate C - mobile syntax corruption"
Add-Line $RootCause "- Inspect syntax-error-neighborhoods.txt"
Add-Line $RootCause "- Inspect syntax-suspicious-lines.csv"
Add-Line $RootCause ""
Add-Line $RootCause "## Safety"
Add-Line $RootCause "This diagnostic script did not modify source files."

Write-FileUtf8 -Path (Join-Path $EvidenceRoot "ROOT_CAUSE_CANDIDATES.md") -Text $RootCause.ToString()

$Evidence = [pscustomobject]@{
  issueCode = $IssueCode
  sessionId = $SessionId
  status = $Status
  evidenceRoot = Rel $EvidenceRoot
  generatedAt = (Get-Date).ToString("o")
  commandResults = $CommandResults
  graph = [pscustomobject]@{
    visitedCount = $Graph.visitedCount
    poisonEdgesCount = $Graph.poisonEdges.Count
    mobileFilesCount = $Graph.mobileFiles.Count
  }
  forbiddenTokenHits = $ForbiddenRows.Count
  directControlPanelForbiddenHits = $DirectControlPanelForbidden.Count
  syntaxSuspiciousCount = $SyntaxSuspectCount
  failReasons = $FailReasons
}

Write-FileUtf8 -Path (Join-Path $EvidenceRoot "evidence.json") -Text ($Evidence | ConvertTo-Json -Depth 30)
Write-FileUtf8 -Path (Join-Path $EvidenceRoot "status.txt") -Text $Status

$Summary = New-Object System.Text.StringBuilder
Add-Line $Summary "# $IssueCode"
Add-Line $Summary ""
Add-Line $Summary ("Status: {0}" -f $Status)
Add-Line $Summary ("SessionId: {0}" -f $SessionId)
Add-Line $Summary ("EvidenceRoot: tools/registry/runs/{0}" -f $SessionId)
Add-Line $Summary ""
Add-Line $Summary "## Findings"
Add-Line $Summary ("- Reachable import graph files visited: {0}" -f $Graph.visitedCount)
Add-Line $Summary ("- Reachable poison import edges: {0}" -f $Graph.poisonEdges.Count)
Add-Line $Summary ("- Reachable mobile-only files: {0}" -f $Graph.mobileFiles.Count)
Add-Line $Summary ("- Forbidden token hits: {0}" -f $ForbiddenRows.Count)
Add-Line $Summary ("- Direct control-panel forbidden hits: {0}" -f $DirectControlPanelForbidden.Count)
Add-Line $Summary ("- Suspicious mobile syntax fragments: {0}" -f $SyntaxSuspectCount)
Add-Line $Summary ("- tsc exit code: {0}" -f $Tsc.exitCode)
Add-Line $Summary ""
Add-Line $Summary "## Fail Reasons"

if ($FailReasons.Count -eq 0) {
  Add-Line $Summary "- None detected by this script. Review evidence before declaring PASS."
} else {
  foreach ($Reason in $FailReasons) {
    Add-Line $Summary ("- {0}" -f $Reason)
  }
}

Add-Line $Summary ""
Add-Line $Summary "## Next Files To Open"
Add-Line $Summary "1. ROOT_CAUSE_CANDIDATES.md"
Add-Line $Summary "2. reachable-poison-imports.csv"
Add-Line $Summary "3. forbidden-token-scan.csv"
Add-Line $Summary "4. syntax-error-neighborhoods.txt"
Add-Line $Summary "5. tsc-noemit.txt"
Add-Line $Summary ""
Add-Line $Summary "## Safety"
Add-Line $Summary "CHECK/FORENSICS only. No source files were modified."

Write-FileUtf8 -Path (Join-Path $EvidenceRoot "SUMMARY.md") -Text $Summary.ToString()

Write-Host ""
Write-Host "============================================================"
Write-Host "$IssueCode"
Write-Host "Status: $Status"
Write-Host "Evidence: $EvidenceRoot"
Write-Host "============================================================"
Write-Host ""
Write-Host "Open these files:"
Write-Host "- $EvidenceRoot\SUMMARY.md"
Write-Host "- $EvidenceRoot\ROOT_CAUSE_CANDIDATES.md"
Write-Host "- $EvidenceRoot\reachable-poison-imports.csv"
Write-Host "- $EvidenceRoot\forbidden-token-scan.csv"
Write-Host "- $EvidenceRoot\syntax-error-neighborhoods.txt"
Write-Host "- $EvidenceRoot\tsc-noemit.txt"
Write-Host ""

if ($FailReasons.Count -gt 0) {
  Write-Host "Fail reasons:"
  foreach ($Reason in $FailReasons) {
    Write-Host "- $Reason"
  }
} else {
  Write-Host "No blocking evidence detected by static checks. Review evidence before declaring PASS."
}

Write-Host ""
Write-Host "No source files were modified."
