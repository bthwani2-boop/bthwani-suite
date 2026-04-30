Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_TAMAGUI_REPO_READINESS"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$SummaryPath = Join-Path $RunRoot "summary.txt"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$MergedPath = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"

$Findings = New-Object System.Collections.Generic.List[object]
$ConsoleLines = New-Object System.Collections.Generic.List[string]

function Add-Finding {
  param(
    [Parameter(Mandatory = $true)][string]$Severity,
    [Parameter(Mandatory = $true)][string]$Area,
    [Parameter(Mandatory = $true)][string]$Message,
    [object]$Data = $null
  )

  $item = [pscustomobject]@{
    severity = $Severity
    area     = $Area
    message  = $Message
    data     = $Data
  }

  $script:Findings.Add($item) | Out-Null
}

function Add-Console {
  param([string]$Line)
  $script:ConsoleLines.Add($Line) | Out-Null
}

function Get-CmdVersion {
  param([string]$CommandName)

  $cmd = Get-Command $CommandName -ErrorAction SilentlyContinue
  if (-not $cmd) { return $null }

  try {
    return (& $CommandName --version 2>$null | Out-String).Trim()
  } catch {
    try {
      return (& $CommandName -v 2>$null | Out-String).Trim()
    } catch {
      return "present-but-version-unavailable"
    }
  }
}

function Read-JsonFile {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) { return $null }

  try {
    return (Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json)
  } catch {
    Add-Finding -Severity "FAIL" -Area "json" -Message "تعذر قراءة JSON: $Path" -Data $_.Exception.Message
    return $null
  }
}

function Get-DepVersion {
  param(
    [object]$PackageJson,
    [string]$DepName
  )

  if (-not $PackageJson) { return $null }

  foreach ($bucket in @("dependencies","devDependencies","peerDependencies","optionalDependencies")) {
    $bag = $PackageJson.$bucket
    if ($null -ne $bag) {
      $prop = $bag.PSObject.Properties[$DepName]
      if ($null -ne $prop) {
        return [string]$prop.Value
      }
    }
  }

  return $null
}

function Normalize-Path {
  param([string]$Path)
  return $Path.Replace("/", "\")
}

function Get-RepoFiles {
  param(
    [string[]]$Roots,
    [string[]]$Extensions
  )

  $results = New-Object System.Collections.Generic.List[string]
  $exclude = '\\(node_modules|\.git|dist|build|coverage|\.next|out|android\\build|ios\\build|tools\\registry\\runs)\\'

  foreach ($root in $Roots) {
    $abs = Join-Path $RepoRoot $root
    if (-not (Test-Path -LiteralPath $abs)) { continue }

    Get-ChildItem -LiteralPath $abs -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object {
        ($Extensions -contains $_.Extension.ToLowerInvariant()) -and
        ($_.FullName -notmatch $exclude)
      } |
      ForEach-Object {
        $results.Add($_.FullName) | Out-Null
      }
  }

  return $results
}

function Test-FileExists {
  param([string]$RelativePath)
  $full = Join-Path $RepoRoot $RelativePath
  return (Test-Path -LiteralPath $full)
}

Add-Console "=== CHECK_ANALYZE_TAMAGUI_REPO_READINESS ==="
Add-Console "RepoRoot : $RepoRoot"
Add-Console "Session  : $SessionId"
Add-Console "RunRoot  : $RunRoot"
Add-Console ""

$RootPackagePath = Join-Path $RepoRoot "package.json"
$PnpmWorkspacePath = Join-Path $RepoRoot "pnpm-workspace.yaml"
$NxPath = Join-Path $RepoRoot "nx.json"

$RootPackageExists = Test-Path -LiteralPath $RootPackagePath
$PnpmWorkspaceExists = Test-Path -LiteralPath $PnpmWorkspacePath
$NxExists = Test-Path -LiteralPath $NxPath

if (-not $RootPackageExists) {
  Add-Finding -Severity "BLOCKED" -Area "workspace" -Message "ملف package.json غير موجود في الجذر."
}
if (-not $PnpmWorkspaceExists) {
  Add-Finding -Severity "BLOCKED" -Area "workspace" -Message "ملف pnpm-workspace.yaml غير موجود في الجذر."
}
if (-not $NxExists) {
  Add-Finding -Severity "BLOCKED" -Area "workspace" -Message "ملف nx.json غير موجود في الجذر."
}

$RequiredDirs = @(
  "apps\mobile",
  "apps\web",
  "packages\ui-kit",
  "packages\surfaces",
  "tools"
)

foreach ($dir in $RequiredDirs) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $dir))) {
    Add-Finding -Severity "FAIL" -Area "structure" -Message "المسار الأساسي مفقود: $dir"
  }
}

$RootPackage = Read-JsonFile -Path $RootPackagePath

$NodeVersion = Get-CmdVersion -CommandName "node"
$PnpmVersion = Get-CmdVersion -CommandName "pnpm"
$GitVersion  = Get-CmdVersion -CommandName "git"
$NxVersion   = if (Test-Path -LiteralPath (Join-Path $RepoRoot "node_modules\.bin\nx.cmd")) { "local-nx-present" } else { $null }

$NodeVersionDisplay = "missing"
if ($NodeVersion) { $NodeVersionDisplay = $NodeVersion }

$PnpmVersionDisplay = "missing"
if ($PnpmVersion) { $PnpmVersionDisplay = $PnpmVersion }

$GitVersionDisplay = "missing"
if ($GitVersion) { $GitVersionDisplay = $GitVersion }

$NxVersionDisplay = "not-detected"
if ($NxVersion) { $NxVersionDisplay = $NxVersion }

Add-Console "Toolchain"
Add-Console ("  node : {0}" -f $NodeVersionDisplay)
Add-Console ("  pnpm : {0}" -f $PnpmVersionDisplay)
Add-Console ("  git  : {0}" -f $GitVersionDisplay)
Add-Console ("  nx   : {0}" -f $NxVersionDisplay)
Add-Console ""

if (-not $PnpmVersion) {
  Add-Finding -Severity "BLOCKED" -Area "toolchain" -Message "pnpm غير متوفر على الجهاز."
}

$PackageManagerDeclared = if ($RootPackage) { [string]$RootPackage.packageManager } else { $null }
$BunLockPresent = Test-Path -LiteralPath (Join-Path $RepoRoot "bun.lockb")
$BunConfigPresent = Test-Path -LiteralPath (Join-Path $RepoRoot "bunfig.toml")
$PnpmLockPresent = Test-Path -LiteralPath (Join-Path $RepoRoot "pnpm-lock.yaml")

if ($PackageManagerDeclared -and ($PackageManagerDeclared -notmatch "^pnpm@")) {
  Add-Finding -Severity "FAIL" -Area "package-manager" -Message "packageManager في الجذر ليس pnpm: $PackageManagerDeclared"
}
if (-not $PnpmLockPresent) {
  Add-Finding -Severity "FAIL" -Area "package-manager" -Message "ملف pnpm-lock.yaml مفقود."
}
if ($BunLockPresent -or $BunConfigPresent) {
  Add-Finding -Severity "FAIL" -Area "package-manager" -Message "تم العثور على بقايا Bun داخل الريبو." -Data @{
    bunLockb  = $BunLockPresent
    bunfigToml = $BunConfigPresent
  }
}

$PackageJsonFiles =
  Get-ChildItem -LiteralPath $RepoRoot -Recurse -Filter "package.json" -File -ErrorAction SilentlyContinue |
  Where-Object {
    $_.FullName -notmatch '\\(node_modules|\.git|dist|build|coverage|\.next|out|android\\build|ios\\build|tools\\registry\\runs)\\'
  } |
  Select-Object -ExpandProperty FullName

$PackageInventory = @()

foreach ($pkgPath in $PackageJsonFiles) {
  $pkg = Read-JsonFile -Path $pkgPath
  $rel = Normalize-Path ((Resolve-Path -LiteralPath $pkgPath).Path.Replace((Resolve-Path -LiteralPath $RepoRoot).Path + "\", ""))

  $PackageInventory += [pscustomobject]@{
    path          = $rel
    name          = if ($pkg) { [string]$pkg.name } else { $null }
    version       = if ($pkg) { [string]$pkg.version } else { $null }
    react         = Get-DepVersion -PackageJson $pkg -DepName "react"
    reactNative   = Get-DepVersion -PackageJson $pkg -DepName "react-native"
    expo          = Get-DepVersion -PackageJson $pkg -DepName "expo"
    next          = Get-DepVersion -PackageJson $pkg -DepName "next"
    tamagui       = Get-DepVersion -PackageJson $pkg -DepName "tamagui"
    tamaguiConfig = Get-DepVersion -PackageJson $pkg -DepName "@tamagui/config"
    tamaguiCli    = Get-DepVersion -PackageJson $pkg -DepName "@tamagui/cli"
  }
}

$RootRow = $PackageInventory | Where-Object { $_.path -eq "package.json" } | Select-Object -First 1
$UiKitRow = $PackageInventory | Where-Object { $_.path -match '^packages\\ui-kit\\package\.json$' } | Select-Object -First 1
$AppClientRow = $PackageInventory | Where-Object { $_.path -match '^apps\\mobile\\app-client\\package\.json$' } | Select-Object -First 1
$ControlPanelRow = $PackageInventory | Where-Object { $_.path -match '^apps\\web\\control-panel\\package\.json$' } | Select-Object -First 1
$WebAppRow = $PackageInventory | Where-Object { $_.path -match '^apps\\web\\webapp\\package\.json$' } | Select-Object -First 1

if (-not $UiKitRow) {
  Add-Finding -Severity "BLOCKED" -Area "ui-kit" -Message "packages/ui-kit/package.json غير موجود."
}

$VersionDrift = @()
$RootReact = if ($RootRow) { $RootRow.react } else { $null }
$RootReactNative = if ($RootRow) { $RootRow.reactNative } else { $null }

foreach ($row in @($UiKitRow, $AppClientRow, $ControlPanelRow, $WebAppRow)) {
  if ($null -eq $row) { continue }

  if ($RootReact -and $row.react -and ($row.react -ne $RootReact)) {
    $VersionDrift += [pscustomobject]@{
      package = $row.path
      key     = "react"
      root    = $RootReact
      current = $row.react
    }
  }

  if ($RootReactNative -and $row.reactNative -and ($row.reactNative -ne $RootReactNative)) {
    $VersionDrift += [pscustomobject]@{
      package = $row.path
      key     = "react-native"
      root    = $RootReactNative
      current = $row.reactNative
    }
  }
}

if ($VersionDrift.Count -gt 0) {
  Add-Finding -Severity "FAIL" -Area "version-drift" -Message "يوجد drift في React / React Native بين الجذر والحزم/التطبيقات." -Data $VersionDrift
}

$AnchorChecks = @(
  "packages\ui-kit\src\providers.tsx",
  "packages\ui-kit\src\foundation.ts",
  "packages\ui-kit\src\primitives.tsx",
  "packages\ui-kit\src\web\root-layout.tsx",
  "packages\ui-kit\src\mobile\root.tsx"
)

$AnchorResults = @()
foreach ($anchor in $AnchorChecks) {
  $exists = Test-FileExists -RelativePath $anchor
  $AnchorResults += [pscustomobject]@{
    path   = $anchor
    exists = $exists
  }

  if (-not $exists) {
    Add-Finding -Severity "FAIL" -Area "anchors" -Message "ملف الربط الأساسي مفقود: $anchor"
  }
}

$TamaguiConfigPath = Join-Path $RepoRoot "tamagui.config.ts"
$TamaguiBuildPath  = Join-Path $RepoRoot "tamagui.build.ts"

if (Test-Path -LiteralPath $TamaguiConfigPath) {
  Add-Finding -Severity "INFO" -Area "tamagui" -Message "ملف tamagui.config.ts موجود."
}
if (Test-Path -LiteralPath $TamaguiBuildPath) {
  Add-Finding -Severity "INFO" -Area "tamagui" -Message "ملف tamagui.build.ts موجود."
}

$WebAppDirs =
  Get-ChildItem -LiteralPath (Join-Path $RepoRoot "apps\web") -Directory -ErrorAction SilentlyContinue |
  Sort-Object Name

$WebAppReadiness = @()

foreach ($dir in $WebAppDirs) {
  $pkgPath = Join-Path $dir.FullName "package.json"
  $pkg = Read-JsonFile -Path $pkgPath
  $nextDeclared = $false
  if ($pkg) {
    $nextDeclared = [bool](Get-DepVersion -PackageJson $pkg -DepName "next")
  }

  $nextConfigCandidates = @(
    (Join-Path $dir.FullName "next.config.ts"),
    (Join-Path $dir.FullName "next.config.js"),
    (Join-Path $dir.FullName "next.config.mjs"),
    (Join-Path $dir.FullName "next.config.cjs")
  )

  $nextConfig = $nextConfigCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
  $hasNextConfig = [bool]$nextConfig

  $entryAppExists = Test-Path -LiteralPath (Join-Path $dir.FullName "app")
  $srcAppExists   = Test-Path -LiteralPath (Join-Path $dir.FullName "src\app")

  $item = [pscustomobject]@{
    appName        = $dir.Name
    packageJson    = Test-Path -LiteralPath $pkgPath
    nextDeclared   = $nextDeclared
    nextConfig     = if ($hasNextConfig) { Normalize-Path ($nextConfig.Replace($RepoRoot + "\", "")) } else { $null }
    hasNextConfig  = $hasNextConfig
    appDirExists   = $entryAppExists
    srcAppDirExists = $srcAppExists
  }

  $WebAppReadiness += $item

  if ($nextDeclared -and (-not $hasNextConfig)) {
    Add-Finding -Severity "FAIL" -Area "next-config" -Message "تطبيق ويب يعلن next لكنه لا يحتوي next.config.* : $($dir.Name)"
  }
}

$SearchRoots = @(
  "apps",
  "packages\surfaces",
  "packages\app-shells"
)

$CodeFiles = Get-RepoFiles -Roots $SearchRoots -Extensions @(".ts",".tsx",".js",".jsx",".mjs",".cjs")

$RawTamaguiImports = @()
$RawShadcnResidue = @()
$StyleSignalFiles = @()

foreach ($file in $CodeFiles) {
  $relative = Normalize-Path ($file.Replace($RepoRoot + "\", ""))
  $text = ""
  try {
    $text = Get-Content -LiteralPath $file -Raw -Encoding UTF8
  } catch {
    continue
  }

  if ($relative -notmatch '^packages\\ui-kit\\') {
    if ($text -match "(?m)from\s+['""]tamagui['""]|from\s+['""]@tamagui\/|require\(['""]tamagui['""]|require\(['""]@tamagui\/") {
      $RawTamaguiImports += $relative
    }
  }

  if ($text -match "shadcn|@\/components\/ui\/|components\.json") {
    $RawShadcnResidue += $relative
  }

  if ($relative -notmatch '^packages\\ui-kit\\') {
    $matches = [regex]::Matches(
      $text,
      "StyleSheet\.create\(|className\s*=|backgroundColor|borderRadius|shadow(Color|Offset|Opacity|Radius)|elevation|padding(Horizontal|Vertical)?|margin(Horizontal|Vertical)?"
    ).Count

    if ($matches -ge 12) {
      $StyleSignalFiles += [pscustomobject]@{
        path   = $relative
        score  = $matches
      }
    }
  }
}

$RawTamaguiImports = $RawTamaguiImports | Sort-Object -Unique
$RawShadcnResidue = $RawShadcnResidue | Sort-Object -Unique
$StyleSignalTop = $StyleSignalFiles | Sort-Object -Property @{ Expression = 'score'; Descending = $true }, @{ Expression = 'path'; Descending = $false } | Select-Object -First 25

if ($RawTamaguiImports.Count -gt 0) {
  Add-Finding -Severity "FAIL" -Area "raw-imports" -Message "تم العثور على raw tamagui imports خارج packages/ui-kit." -Data $RawTamaguiImports
}

if ($RawShadcnResidue.Count -gt 0) {
  Add-Finding -Severity "FAIL" -Area "shadcn-residue" -Message "تم العثور على بقايا shadcn/components.json أو imports مرتبطة به داخل الريبو." -Data $RawShadcnResidue
}

if ($StyleSignalTop.Count -gt 0) {
  Add-Finding -Severity "WARN" -Area "design-drift" -Message "هناك ملفات كثيرة الإشارات الأسلوبية خارج ui-kit؛ هذه مرشحة لاستخراج design law." -Data $StyleSignalTop
}

$GitInfo = [ordered]@{
  available = $false
  branch    = $null
  dirty     = $null
  changes   = @()
}

if (Get-Command git -ErrorAction SilentlyContinue) {
  try {
    $branch = (& git -C $RepoRoot rev-parse --abbrev-ref HEAD 2>$null | Out-String).Trim()
    $status = (& git -C $RepoRoot status --short 2>$null | Out-String).Trim()

    $GitInfo.available = $true
    $GitInfo.branch = $branch
    $GitInfo.dirty = [bool]$status
    $GitInfo.changes = if ($status) { $status -split "`r?`n" } else { @() }
  } catch {
    Add-Finding -Severity "WARN" -Area "git" -Message "تعذر قراءة حالة git." -Data $_.Exception.Message
  }
}

$BlockedCount = ($Findings | Where-Object { $_.severity -eq "BLOCKED" }).Count
$FailCount    = ($Findings | Where-Object { $_.severity -eq "FAIL" }).Count
$WarnCount    = ($Findings | Where-Object { $_.severity -eq "WARN" }).Count

$GateStatus =
if ($BlockedCount -gt 0) {
  "BLOCKED"
} elseif ($FailCount -gt 0) {
  "FAIL"
} else {
  "PASS"
}

$ProgressDirection =
if ($GateStatus -eq "PASS") {
  "Forward"
} elseif ($GateStatus -eq "FAIL") {
  "Neutral"
} else {
  "Backward"
}

Add-Console "Workspace"
Add-Console "  package.json        : $RootPackageExists"
Add-Console "  pnpm-workspace.yaml : $PnpmWorkspaceExists"
Add-Console "  nx.json             : $NxExists"
Add-Console ""

Add-Console "Root Versions"
Add-Console "  react        : $($RootRow.react)"
Add-Console "  react-native : $($RootRow.reactNative)"
Add-Console "  expo         : $($RootRow.expo)"
Add-Console "  next         : $($RootRow.next)"
Add-Console "  tamagui      : $($RootRow.tamagui)"
Add-Console ""

Add-Console "Key Packages"
foreach ($row in @($UiKitRow, $AppClientRow, $ControlPanelRow, $WebAppRow)) {
  if ($null -eq $row) { continue }
  Add-Console ("  {0}" -f $row.path)
  Add-Console ("    react        : {0}" -f $row.react)
  Add-Console ("    react-native : {0}" -f $row.reactNative)
  Add-Console ("    expo         : {0}" -f $row.expo)
  Add-Console ("    next         : {0}" -f $row.next)
  Add-Console ("    tamagui      : {0}" -f $row.tamagui)
}
Add-Console ""

Add-Console "Web App Readiness"
foreach ($item in $WebAppReadiness) {
  Add-Console ("  {0} | package.json={1} | nextDeclared={2} | nextConfig={3}" -f $item.appName, $item.packageJson, $item.nextDeclared, ($(if ($item.nextConfig) { $item.nextConfig } else { "missing" })))
}
Add-Console ""

Add-Console "UI Kit Anchors"
foreach ($item in $AnchorResults) {
  Add-Console ("  {0} => {1}" -f $item.path, $item.exists)
}
Add-Console ""

Add-Console "Raw Imports"
Add-Console ("  raw tamagui outside ui-kit : {0}" -f $RawTamaguiImports.Count)
Add-Console ("  shadcn residue hits        : {0}" -f $RawShadcnResidue.Count)
Add-Console ""

Add-Console "Design Drift Top Files"
if ($StyleSignalTop.Count -eq 0) {
  Add-Console "  none-detected-by-heuristic"
} else {
  foreach ($item in $StyleSignalTop) {
    Add-Console ("  {0} | score={1}" -f $item.path, $item.score)
  }
}
Add-Console ""

Add-Console "Git"
Add-Console ("  available : {0}" -f $GitInfo.available)
Add-Console ("  branch    : {0}" -f $GitInfo.branch)
Add-Console ("  dirty     : {0}" -f $GitInfo.dirty)
if ($GitInfo.changes.Count -gt 0) {
  foreach ($line in ($GitInfo.changes | Select-Object -First 20)) {
    Add-Console ("  {0}" -f $line)
  }
}
Add-Console ""

Add-Console "FINAL"
Add-Console ("  GateStatus        : {0}" -f $GateStatus)
Add-Console ("  ProgressDirection : {0}" -f $ProgressDirection)
Add-Console ("  BLOCKED={0} | FAIL={1} | WARN={2}" -f $BlockedCount, $FailCount, $WarnCount)
Add-Console ("  SummaryPath       : {0}" -f $SummaryPath)
Add-Console ("  EvidencePath      : {0}" -f $EvidencePath)
Add-Console ("  MergedEvidence    : {0}" -f $MergedPath)

$Evidence = [ordered]@{
  issueCode = $IssueCode
  sessionId = $SessionId
  repoRoot  = $RepoRoot
  timestamp = (Get-Date).ToString("o")
  progressDirection = $ProgressDirection
  gateStatus = $GateStatus
  toolchain = [ordered]@{
    node = $NodeVersion
    pnpm = $PnpmVersion
    git  = $GitVersion
    nx   = $NxVersion
  }
  workspace = [ordered]@{
    packageJson = $RootPackageExists
    pnpmWorkspace = $PnpmWorkspaceExists
    nxJson = $NxExists
    packageManager = $PackageManagerDeclared
    pnpmLock = $PnpmLockPresent
    bunLockb = $BunLockPresent
    bunfigToml = $BunConfigPresent
  }
  packageInventory = $PackageInventory
  keyPackages = [ordered]@{
    root = $RootRow
    uiKit = $UiKitRow
    appClient = $AppClientRow
    controlPanel = $ControlPanelRow
    webapp = $WebAppRow
  }
  versionDrift = $VersionDrift
  anchors = $AnchorResults
  tamaguiConfigExists = (Test-Path -LiteralPath $TamaguiConfigPath)
  tamaguiBuildExists = (Test-Path -LiteralPath $TamaguiBuildPath)
  webApps = $WebAppReadiness
  rawImports = [ordered]@{
    tamaguiOutsideUiKit = $RawTamaguiImports
    shadcnResidue = $RawShadcnResidue
  }
  designDriftTop = $StyleSignalTop
  git = $GitInfo
  findings = $Findings
}

$ConsoleText = ($ConsoleLines -join [Environment]::NewLine)

$SummaryText = @"
=== $IssueCode ===
RepoRoot: $RepoRoot
Session : $SessionId
Time    : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Gate    : $GateStatus
Progress: $ProgressDirection

Counts:
  BLOCKED = $BlockedCount
  FAIL    = $FailCount
  WARN    = $WarnCount

Key Rule:
- هذا السكربت تشخيص فقط.
- لا يطبق أي دمج لـ Tamagui.
- الهدف: تأكيد الجاهزية الفعلية قبل أي تنفيذ.

Terminal Summary:
$ConsoleText
"@

$MergedText = @"
===== SUMMARY =====
$SummaryText

===== EVIDENCE.JSON =====
$($Evidence | ConvertTo-Json -Depth 10)
"@

$SummaryText | Set-Content -LiteralPath $SummaryPath -Encoding UTF8
($Evidence | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $EvidencePath -Encoding UTF8
$MergedText | Set-Content -LiteralPath $MergedPath -Encoding UTF8

Write-Host ""
Write-Host "=== CHECK_ANALYZE_TAMAGUI_REPO_READINESS ===" -ForegroundColor Cyan
Write-Host "RepoRoot : $RepoRoot"
Write-Host "Session  : $SessionId"
Write-Host "RunRoot  : $RunRoot"
Write-Host ""

foreach ($line in $ConsoleLines) {
  if ($line -match "GateStatus\s*: PASS") {
    Write-Host $line -ForegroundColor Green
  } elseif ($line -match "GateStatus\s*: FAIL") {
    Write-Host $line -ForegroundColor Yellow
  } elseif ($line -match "GateStatus\s*: BLOCKED") {
    Write-Host $line -ForegroundColor Red
  } elseif ($line -match "BLOCKED=\d+\s+\|\s+FAIL=\d+\s+\|\s+WARN=\d+") {
    if ($GateStatus -eq "PASS") {
      Write-Host $line -ForegroundColor Green
    } elseif ($GateStatus -eq "FAIL") {
      Write-Host $line -ForegroundColor Yellow
    } else {
      Write-Host $line -ForegroundColor Red
    }
  } else {
    Write-Host $line
  }
}

Write-Host ""
Write-Host "تم إنشاء ملف الأدلة المدمج:" -ForegroundColor Cyan
Write-Host $MergedPath -ForegroundColor White
Write-Host ""
Read-Host "انتهى الفحص. اضغط Enter للعودة"
