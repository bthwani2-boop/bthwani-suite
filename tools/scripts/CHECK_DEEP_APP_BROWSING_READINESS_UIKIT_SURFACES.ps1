Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_DEEP_APP_BROWSING_READINESS_UIKIT_SURFACES"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$Findings = New-Object System.Collections.Generic.List[object]
$Checks = New-Object System.Collections.Generic.List[object]
$Imports = New-Object System.Collections.Generic.List[object]
$RuntimeSignals = New-Object System.Collections.Generic.List[object]

$FindingsPath = Join-Path $RunRoot "FINDINGS.csv"
$ChecksPath = Join-Path $RunRoot "CHECKS.csv"
$ImportsPath = Join-Path $RunRoot "UIKIT_IMPORTS.csv"
$RuntimeSignalsPath = Join-Path $RunRoot "RUNTIME_SIGNALS.csv"
$UiKitTscPath = Join-Path $RunRoot "ui-kit.tsc.output.txt"
$AppClientTscPath = Join-Path $RunRoot "app-client.tsc.output.txt"
$AdbDevicesPath = Join-Path $RunRoot "adb.devices.txt"
$AdbLogcatPath = Join-Path $RunRoot "adb.logcat.tail.txt"
$TreePath = Join-Path $RunRoot "ui-kit.src.tree.txt"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"

$ExpectedUiKitSrc = @(
  "index.ts",
  "foundation.ts",
  "providers.tsx",
  "primitives.tsx",
  "Header.tsx",
  "Button.tsx",
  "Card.tsx",
  "Form.tsx",
  "List.tsx",
  "Media.tsx",
  "Modal.tsx",
  "State.tsx"
)

function Add-Finding {
  param(
    [string]$Code,
    [string]$Severity,
    [string]$Path,
    [string]$Evidence,
    [string]$Action
  )

  $Findings.Add([pscustomobject]@{
    code = $Code
    severity = $Severity
    path = $Path
    evidence = $Evidence
    action = $Action
  }) | Out-Null

  $Color = if ($Severity -eq "PASS") { "Green" } elseif ($Severity -eq "INFO") { "Cyan" } elseif ($Severity -eq "WARN") { "Yellow" } else { "Red" }
  Write-Host ("[{0}] {1} - {2}" -f $Severity, $Code, $Path) -ForegroundColor $Color
}

function RelPath {
  param([string]$Path)

  if ([string]::IsNullOrWhiteSpace($Path)) {
    return ""
  }

  $Full = [System.IO.Path]::GetFullPath($Path)
  if ($Full.StartsWith($RepoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    return ($Full.Substring($RepoRoot.Length).TrimStart('\','/') -replace "\\","/")
  }

  return ($Path -replace "\\","/")
}

function Read-Text {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    return ""
  }

  return Get-Content -LiteralPath $Path -Raw -Encoding UTF8
}

function Invoke-CapturedCommand {
  param(
    [string]$Name,
    [string]$Command,
    [string]$OutputPath,
    [string]$WorkingDirectory = ""
  )

  $Start = Get-Date
  $OldLocation = (Get-Location).Path

  try {
    if (-not [string]::IsNullOrWhiteSpace($WorkingDirectory)) {
      Set-Location -LiteralPath $WorkingDirectory
    }

    Write-Host ("Running: {0}" -f $Command) -ForegroundColor Cyan
    $Output = & cmd.exe /d /s /c "$Command 2>&1"
    $ExitCode = $LASTEXITCODE
    $OutputText = ($Output | Out-String)
    [System.IO.File]::WriteAllText($OutputPath, $OutputText, [System.Text.UTF8Encoding]::new($false))

    $ElapsedMs = [int]((Get-Date) - $Start).TotalMilliseconds
    $ErrorLines = @($OutputText -split "`r?`n" | Where-Object {
      $_ -match "error TS\d+|Unable to resolve|Render Error|Cannot read property|Cannot create a new React context|AssertionError|TypeError|ReferenceError|SyntaxError"
    })

    $Checks.Add([pscustomobject]@{
      check = $Name
      command = $Command
      exit_code = $ExitCode
      error_lines = $ErrorLines.Count
      output = $OutputPath
      elapsed_ms = $ElapsedMs
    }) | Out-Null

    return [pscustomobject]@{
      exit_code = $ExitCode
      error_lines = $ErrorLines
      output = $OutputText
      elapsed_ms = $ElapsedMs
    }
  } finally {
    Set-Location -LiteralPath $OldLocation
  }
}

function Get-ExportedSymbolsFromUiKit {
  param([string]$UiKitSrc)

  $Set = New-Object System.Collections.Generic.HashSet[string]

  $Files = @(Get-ChildItem -LiteralPath $UiKitSrc -File -Include *.ts,*.tsx)
  foreach ($File in $Files) {
    $Text = Read-Text $File.FullName

    foreach ($m in [regex]::Matches($Text, '(?m)^\s*export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)')) {
      [void]$Set.Add($m.Groups[1].Value)
    }

    foreach ($m in [regex]::Matches($Text, '(?m)^\s*export\s*\{([^}]+)\}')) {
      foreach ($Item in $m.Groups[1].Value.Split(',')) {
        $Clean = $Item.Trim()
        if ($Clean -match '\bas\s+([A-Za-z_$][A-Za-z0-9_$]*)$') {
          [void]$Set.Add($Matches[1])
        } elseif ($Clean -match '^([A-Za-z_$][A-Za-z0-9_$]*)$') {
          [void]$Set.Add($Matches[1])
        }
      }
    }
  }

  return $Set
}

function Add-ImportRows {
  param(
    [string]$FilePath,
    [string]$Text
  )

  foreach ($m in [regex]::Matches($Text, "import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['""]@bthwani/ui-kit(?:/[^'""]*)?['""]")) {
    foreach ($Item in $m.Groups[1].Value.Split(',')) {
      $Clean = $Item.Trim() -replace '^type\s+', ''
      $Imported = ""

      if ($Clean -match '^([A-Za-z_$][A-Za-z0-9_$]*)\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)$') {
        $Imported = $Matches[1]
      } elseif ($Clean -match '^([A-Za-z_$][A-Za-z0-9_$]*)$') {
        $Imported = $Matches[1]
      }

      if (-not [string]::IsNullOrWhiteSpace($Imported)) {
        $Imports.Add([pscustomobject]@{
          file = RelPath $FilePath
          symbol = $Imported
          source = "@bthwani/ui-kit"
        }) | Out-Null
      }
    }
  }
}

try {
  Write-Host ""
  Write-Host "CHECK DEEP APP BROWSING READINESS - UIKIT + SURFACES + RUNTIME" -ForegroundColor Cyan
  Write-Host ("Evidence Pack: {0}" -f $RunRoot) -ForegroundColor Cyan
  Write-Host ""

  $UiKitRoot = Join-Path $RepoRoot "packages\ui-kit"
  $UiKitSrc = Join-Path $UiKitRoot "src"
  $UiKitCompat = Join-Path $UiKitRoot "_compat"
  $UiKitPackageJson = Join-Path $UiKitRoot "package.json"
  $UiKitTsconfig = Join-Path $UiKitRoot "tsconfig.json"
  $AppClientRoot = Join-Path $RepoRoot "apps\mobile\app-client"
  $AppClientPackageJson = Join-Path $AppClientRoot "package.json"
  $AppClientTsconfig = Join-Path $AppClientRoot "tsconfig.json"
  $ClientSurfaceHost = Join-Path $RepoRoot "packages\app-shells\mobile\client\ClientSurfaceHost.tsx"
  $AppClientApp = Join-Path $AppClientRoot "App.tsx"
  $AppClientIndex = Join-Path $AppClientRoot "index.js"

  foreach ($Required in @($UiKitRoot, $UiKitSrc, $UiKitPackageJson, $UiKitTsconfig, $AppClientRoot, $AppClientPackageJson, $AppClientApp, $AppClientIndex)) {
    if (-not (Test-Path -LiteralPath $Required)) {
      Add-Finding -Code "REQUIRED_PATH_MISSING" -Severity "FAIL" -Path (RelPath $Required) -Evidence "Required path missing." -Action "Restore required project path before runtime browsing."
    } else {
      Add-Finding -Code "REQUIRED_PATH_EXISTS" -Severity "PASS" -Path (RelPath $Required) -Evidence "Path exists." -Action "Continue."
    }
  }

  if (Test-Path -LiteralPath $UiKitCompat) {
    Add-Finding -Code "UIKIT_COMPAT_EXISTS" -Severity "FAIL" -Path "packages/ui-kit/_compat" -Evidence "_compat exists." -Action "Remove _compat; final ui-kit closure requires it absent."
  } else {
    Add-Finding -Code "UIKIT_COMPAT_ABSENT" -Severity "PASS" -Path "packages/ui-kit/_compat" -Evidence "_compat is absent." -Action "Continue."
  }

  $ActualUiKitSrc = @(Get-ChildItem -LiteralPath $UiKitSrc -Force | Select-Object -ExpandProperty Name | Sort-Object)
  $ActualUiKitSrc | Set-Content -Encoding UTF8 -Path $TreePath

  $Extra = @($ActualUiKitSrc | Where-Object { $ExpectedUiKitSrc -notcontains $_ })
  $Missing = @($ExpectedUiKitSrc | Where-Object { $ActualUiKitSrc -notcontains $_ })

  if ($Extra.Count -gt 0 -or $Missing.Count -gt 0) {
    Add-Finding -Code "UIKIT_SRC_SHAPE_INVALID" -Severity "FAIL" -Path "packages/ui-kit/src" -Evidence ("Extra=[{0}] Missing=[{1}]" -f ($Extra -join ","), ($Missing -join ",")) -Action "Restore exact 12-file lean ui-kit src."
  } else {
    Add-Finding -Code "UIKIT_SRC_SHAPE_EXACT" -Severity "PASS" -Path "packages/ui-kit/src" -Evidence "Exact 12-file shape confirmed." -Action "Continue."
  }

  $UiKitPackageText = Read-Text $UiKitPackageJson
  if ($UiKitPackageText -match "_compat") {
    Add-Finding -Code "UIKIT_PACKAGE_EXPORTS_COMPAT_REFERENCE" -Severity "FAIL" -Path "packages/ui-kit/package.json" -Evidence "package.json still references _compat." -Action "Point exports only to src files."
  } else {
    Add-Finding -Code "UIKIT_PACKAGE_EXPORTS_NO_COMPAT" -Severity "PASS" -Path "packages/ui-kit/package.json" -Evidence "No _compat reference in package exports." -Action "Continue."
  }

  if ($UiKitPackageText -match "\./src/index\.ts") {
    Add-Finding -Code "UIKIT_PACKAGE_ROOT_EXPORT_POINTS_TO_SRC" -Severity "PASS" -Path "packages/ui-kit/package.json" -Evidence "Root export points to src/index.ts." -Action "Continue."
  } else {
    Add-Finding -Code "UIKIT_PACKAGE_ROOT_EXPORT_REVIEW" -Severity "WARN" -Path "packages/ui-kit/package.json" -Evidence "Could not confirm ./src/index.ts export." -Action "Review package exports if resolver problems appear."
  }

  $UiKitTexts = @(Get-ChildItem -LiteralPath $UiKitRoot -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.json |
    Where-Object { $_.FullName -notmatch "\\node_modules\\|\\dist\\|\\build\\|\\.next\\|\\.expo\\" })

  $CompatRefs = New-Object System.Collections.Generic.List[string]
  foreach ($File in $UiKitTexts) {
    $Text = Read-Text $File.FullName
    if ($Text -match "_compat") {
      $CompatRefs.Add((RelPath $File.FullName)) | Out-Null
    }
  }

  if ($CompatRefs.Count -gt 0) {
    Add-Finding -Code "UIKIT_COMPAT_REFERENCES_REMAIN" -Severity "FAIL" -Path "packages/ui-kit" -Evidence ("Refs={0}" -f ($CompatRefs -join ";")) -Action "Remove all _compat references."
  } else {
    Add-Finding -Code "UIKIT_NO_COMPAT_REFERENCES" -Severity "PASS" -Path "packages/ui-kit" -Evidence "No _compat refs found in ui-kit files." -Action "Continue."
  }

  $UiKitTsc = Invoke-CapturedCommand -Name "ui-kit-tsc" -Command "pnpm --dir packages/ui-kit exec tsc --noEmit -p tsconfig.json" -OutputPath $UiKitTscPath -WorkingDirectory $RepoRoot
  if ($UiKitTsc.exit_code -eq 0) {
    Add-Finding -Code "UIKIT_TYPESCRIPT_PASS" -Severity "PASS" -Path "packages/ui-kit" -Evidence ("tsc passed in {0}ms." -f $UiKitTsc.elapsed_ms) -Action "Continue."
  } else {
    Add-Finding -Code "UIKIT_TYPESCRIPT_FAIL" -Severity "FAIL" -Path "packages/ui-kit" -Evidence ("exit={0}; error_lines={1}" -f $UiKitTsc.exit_code, $UiKitTsc.error_lines.Count) -Action "Fix ui-kit TypeScript errors first."
  }

  if (Test-Path -LiteralPath $AppClientTsconfig) {
    $AppTsc = Invoke-CapturedCommand -Name "app-client-tsc" -Command "pnpm --dir apps/mobile/app-client exec tsc --noEmit -p tsconfig.json" -OutputPath $AppClientTscPath -WorkingDirectory $RepoRoot
    if ($AppTsc.exit_code -eq 0) {
      Add-Finding -Code "APP_CLIENT_TYPESCRIPT_PASS" -Severity "PASS" -Path "apps/mobile/app-client" -Evidence ("tsc passed in {0}ms." -f $AppTsc.elapsed_ms) -Action "Continue."
    } else {
      Add-Finding -Code "APP_CLIENT_TYPESCRIPT_FAIL" -Severity "FAIL" -Path "apps/mobile/app-client" -Evidence ("exit={0}; error_lines={1}" -f $AppTsc.exit_code, $AppTsc.error_lines.Count) -Action "Fix app-client TypeScript/runtime contract before browsing."
    }
  } else {
    Add-Finding -Code "APP_CLIENT_TSCONFIG_MISSING" -Severity "WARN" -Path "apps/mobile/app-client/tsconfig.json" -Evidence "No app-client tsconfig found." -Action "Skip app-client tsc; rely on Metro runtime."
  }

  if (-not (Test-Path -LiteralPath $ClientSurfaceHost)) {
    Add-Finding -Code "CLIENT_SURFACE_HOST_MISSING" -Severity "FAIL" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "ClientSurfaceHost missing." -Action "Restore app-shell host."
  } else {
    $HostText = Read-Text $ClientSurfaceHost

    if ($HostText -match "function\s+bthSafeBrandName\b") {
      Add-Finding -Code "CLIENT_SURFACE_BRAND_GUARD_PRESENT" -Severity "PASS" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "bthSafeBrandName exists." -Action "Continue."
    } else {
      Add-Finding -Code "CLIENT_SURFACE_BRAND_GUARD_MISSING" -Severity "FAIL" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "bthSafeBrandName missing." -Action "Patch brandName runtime guard."
    }

    $UnsafeBrand = ([regex]::Matches($HostText, '(?<![\?\w$])([A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*)\.brandName\b')).Count
    if ($UnsafeBrand -gt 0) {
      Add-Finding -Code "CLIENT_SURFACE_UNSAFE_BRANDNAME_REMAINS" -Severity "FAIL" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence ("Unsafe direct .brandName count={0}" -f $UnsafeBrand) -Action "Patch remaining direct .brandName access."
    } else {
      Add-Finding -Code "CLIENT_SURFACE_NO_UNSAFE_BRANDNAME" -Severity "PASS" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "No direct unsafe .brandName." -Action "Continue."
    }

    if ($HostText -match "BTH_CLIENT_SURFACE_VISIBLE_FALLBACK") {
      Add-Finding -Code "CLIENT_SURFACE_VISIBLE_FALLBACK_PRESENT" -Severity "PASS" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "Visible fallback marker present." -Action "Continue."
    } else {
      Add-Finding -Code "CLIENT_SURFACE_VISIBLE_FALLBACK_MISSING" -Severity "WARN" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "Visible fallback marker missing." -Action "If blank screen persists, patch visible bootstrap fallback."
    }

    $NullReturns = ([regex]::Matches($HostText, "\breturn\s+null\s*;")).Count
    $FalseReturns = ([regex]::Matches($HostText, "\breturn\s+false\s*;")).Count
    $UndefinedReturns = ([regex]::Matches($HostText, "\breturn\s+undefined\s*;")).Count
    $RenderSubSurface = ([regex]::Matches($HostText, "renderSubSurface\s*\(")).Count
    $EnsureVisible = ([regex]::Matches($HostText, "bthEnsureVisibleSurface\s*\(")).Count

    $RuntimeSignals.Add([pscustomobject]@{
      check = "ClientSurfaceHost"
      null_returns = $NullReturns
      false_returns = $FalseReturns
      undefined_returns = $UndefinedReturns
      renderSubSurface_calls = $RenderSubSurface
      ensure_visible_calls = $EnsureVisible
    }) | Out-Null

    if (($NullReturns + $FalseReturns + $UndefinedReturns) -gt 0) {
      Add-Finding -Code "CLIENT_SURFACE_EMPTY_RETURNS_EXIST" -Severity "WARN" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence ("null={0}; false={1}; undefined={2}" -f $NullReturns, $FalseReturns, $UndefinedReturns) -Action "Blank screen can happen if these paths are hit."
    } else {
      Add-Finding -Code "CLIENT_SURFACE_NO_EXPLICIT_EMPTY_RETURNS" -Severity "PASS" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "No explicit null/false/undefined returns." -Action "Continue."
    }

    if ($RenderSubSurface -gt 0 -and $EnsureVisible -eq 0) {
      Add-Finding -Code "RENDER_SUBSURFACE_NOT_VISIBILITY_GUARDED" -Severity "WARN" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "renderSubSurface exists without bthEnsureVisibleSurface usage." -Action "If blank screen persists, wrap renderSubSurface output."
    } elseif ($RenderSubSurface -gt 0) {
      Add-Finding -Code "RENDER_SUBSURFACE_VISIBILITY_GUARDED" -Severity "PASS" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "renderSubSurface and visibility guard found." -Action "Continue."
    } else {
      Add-Finding -Code "RENDER_SUBSURFACE_NOT_FOUND" -Severity "INFO" -Path "packages/app-shells/mobile/client/ClientSurfaceHost.tsx" -Evidence "No renderSubSurface function/call detected." -Action "Host may use another render path."
    }
  }

  $UiKitExports = Get-ExportedSymbolsFromUiKit -UiKitSrc $UiKitSrc

  $GitAvailable = $false
  try {
    & git --version | Out-Null
    if ($LASTEXITCODE -eq 0) {
      $GitAvailable = $true
    }
  } catch {
    $GitAvailable = $false
  }

  if ($GitAvailable) {
    $GrepOutput = @(& git grep -n -I "@bthwani/ui-kit" -- ':*.ts' ':*.tsx' ':*.js' ':*.jsx' ':!packages/ui-kit/**' ':!tools/**' 2>$null)

    foreach ($Line in $GrepOutput) {
      if ([string]::IsNullOrWhiteSpace($Line)) {
        continue
      }

      $Parts = $Line -split ":", 3
      if ($Parts.Count -lt 3) {
        continue
      }

      $Path = Join-Path $RepoRoot ($Parts[0] -replace "/", "\")
      if (Test-Path -LiteralPath $Path) {
        Add-ImportRows -FilePath $Path -Text (Read-Text $Path)
      }
    }

    Add-Finding -Code "UIKIT_CONSUMER_IMPORT_SCAN_COMPLETED" -Severity "PASS" -Path "repo" -Evidence ("Named import rows={0}" -f $Imports.Count) -Action "Compare imports to exported symbols."
  } else {
    Add-Finding -Code "GIT_NOT_AVAILABLE_FOR_IMPORT_SCAN" -Severity "WARN" -Path "repo" -Evidence "git unavailable." -Action "Install/use Git terminal for faster import scan."
  }

  $MissingImportedSymbols = @()
  foreach ($Row in $Imports) {
    if (-not $UiKitExports.Contains($Row.symbol)) {
      $MissingImportedSymbols += $Row
    }
  }

  if ($MissingImportedSymbols.Count -gt 0) {
    Add-Finding -Code "UIKIT_IMPORTED_SYMBOLS_MISSING" -Severity "FAIL" -Path "repo" -Evidence ("missing_count={0}" -f $MissingImportedSymbols.Count) -Action "Export missing symbols from lean ui-kit family files."
  } else {
    Add-Finding -Code "UIKIT_IMPORTED_SYMBOLS_ALL_EXPORTED" -Severity "PASS" -Path "repo" -Evidence ("checked_imports={0}; exported_symbols={1}" -f $Imports.Count, $UiKitExports.Count) -Action "Continue."
  }

  if (Test-Path -LiteralPath $AppClientApp) {
    $AppText = Read-Text $AppClientApp
    if ($AppText -match "ClientSurfaceHost|ApprovedVideoReelsViewer|app-shells|@bthwani") {
      Add-Finding -Code "APP_CLIENT_ENTRY_HAS_SURFACE_REFERENCE" -Severity "PASS" -Path "apps/mobile/app-client/App.tsx" -Evidence "App entry references known surface/bootstrap path." -Action "Continue."
    } else {
      Add-Finding -Code "APP_CLIENT_ENTRY_SURFACE_REFERENCE_NOT_PROVEN" -Severity "WARN" -Path "apps/mobile/app-client/App.tsx" -Evidence "Could not detect ClientSurfaceHost/app-shells/@bthwani in App.tsx." -Action "Inspect app bootstrap if blank screen remains."
    }
  }

  try {
    $PortListeners = @(Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue)
    if ($PortListeners.Count -gt 0) {
      Add-Finding -Code "METRO_PORT_8081_LISTENING" -Severity "INFO" -Path "localhost:8081" -Evidence ("listeners={0}" -f $PortListeners.Count) -Action "Port is occupied by Metro or another process."
    } else {
      Add-Finding -Code "METRO_PORT_8081_NOT_LISTENING" -Severity "INFO" -Path "localhost:8081" -Evidence "No active listener detected at check time." -Action "Start Metro when ready."
    }
  } catch {
    Add-Finding -Code "PORT_CHECK_SKIPPED" -Severity "INFO" -Path "localhost:8081" -Evidence $_.Exception.Message -Action "Continue."
  }

  $Adb = Get-Command adb -ErrorAction SilentlyContinue
  if ($null -eq $Adb) {
    Add-Finding -Code "ADB_NOT_AVAILABLE" -Severity "WARN" -Path "adb" -Evidence "adb not found in PATH." -Action "ADB runtime crash scan skipped."
  } else {
    $DevicesOutput = (& adb devices 2>&1 | Out-String)
    [System.IO.File]::WriteAllText($AdbDevicesPath, $DevicesOutput, [System.Text.UTF8Encoding]::new($false))

    if ($DevicesOutput -match "\bdevice\b") {
      Add-Finding -Code "ADB_DEVICE_AVAILABLE" -Severity "PASS" -Path "adb devices" -Evidence "At least one device is connected." -Action "Capture recent logcat crash signals."
    } else {
      Add-Finding -Code "ADB_DEVICE_NOT_DETECTED" -Severity "WARN" -Path "adb devices" -Evidence "No connected device row detected." -Action "Connect device or enable USB debugging if runtime logs needed."
    }

    $LogcatOutput = (& adb logcat -d -t 600 2>&1 | Out-String)
    [System.IO.File]::WriteAllText($AdbLogcatPath, $LogcatOutput, [System.Text.UTF8Encoding]::new($false))

    $CrashLines = @($LogcatOutput -split "`r?`n" | Where-Object {
      $_ -match "FATAL EXCEPTION|AndroidRuntime|ReactNativeJS|Cannot create a new React context|TypeError|UnableToResolve|brandName|AssertionError|ReactInstanceManager"
    })

    $RuntimeSignals.Add([pscustomobject]@{
      check = "adb-logcat-tail"
      crash_signal_lines = $CrashLines.Count
      output = $AdbLogcatPath
    }) | Out-Null

    if ($CrashLines.Count -gt 0) {
      Add-Finding -Code "ADB_RECENT_RUNTIME_SIGNALS_FOUND" -Severity "WARN" -Path "adb logcat" -Evidence ("signal_lines={0}" -f $CrashLines.Count) -Action "Open adb.logcat.tail.txt and inspect most recent crash signal."
    } else {
      Add-Finding -Code "ADB_NO_RECENT_RUNTIME_CRASH_SIGNAL" -Severity "PASS" -Path "adb logcat" -Evidence "No selected crash signals in last 600 logcat lines." -Action "Continue."
    }
  }

} catch {
  Add-Finding -Code "CHECK_FAILED" -Severity "FAIL" -Path "CHECK_DEEP_APP_BROWSING_READINESS_UIKIT_SURFACES" -Evidence $_.Exception.Message -Action "Fix diagnostic script failure first."
}

$Imports | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ImportsPath
$RuntimeSignals | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $RuntimeSignalsPath
$Checks | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $ChecksPath
$Findings | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $FindingsPath

$Fails = @($Findings | Where-Object { $_.severity -eq "FAIL" })
$Warns = @($Findings | Where-Object { $_.severity -eq "WARN" })
$Passes = @($Findings | Where-Object { $_.severity -eq "PASS" })
$Infos = @($Findings | Where-Object { $_.severity -eq "INFO" })

$Status = if ($Fails.Count -gt 0) { "FAIL" } elseif ($Warns.Count -gt 0) { "WARN" } else { "PASS" }

$TopFindings = @($Findings | Where-Object { $_.severity -in @("FAIL","WARN") } | Select-Object -First 12)

$Evidence = [pscustomobject]@{
  session_id = $SessionId
  status = $Status
  run_root = $RunRoot
  counts = [pscustomobject]@{
    pass = $Passes.Count
    info = $Infos.Count
    warn = $Warns.Count
    fail = $Fails.Count
    checks = $Checks.Count
    imports = $Imports.Count
    runtime_signals = $RuntimeSignals.Count
  }
  outputs = [pscustomobject]@{
    findings = $FindingsPath
    checks = $ChecksPath
    imports = $ImportsPath
    runtime_signals = $RuntimeSignalsPath
    ui_kit_tsc = $UiKitTscPath
    app_client_tsc = $AppClientTscPath
    adb_devices = $AdbDevicesPath
    adb_logcat_tail = $AdbLogcatPath
    ui_kit_tree = $TreePath
  }
}

$Evidence | ConvertTo-Json -Depth 20 | Set-Content -Encoding UTF8 -Path $EvidencePath

$SummaryLines = @(
  "# CHECK DEEP — App Browsing Readiness",
  "",
  "Session: $SessionId",
  "Status: $Status",
  "",
  "## Scope",
  "",
  "- ui-kit 12-file final closure",
  "- package exports",
  "- TypeScript contracts",
  "- app-client entry",
  "- ClientSurfaceHost brand/fallback/blank-screen guards",
  "- @bthwani/ui-kit consumer named imports",
  "- Metro port signal",
  "- ADB/logcat runtime signals when available",
  "",
  "## Evidence",
  "",
  "- Findings: $FindingsPath",
  "- Checks: $ChecksPath",
  "- UI Kit imports: $ImportsPath",
  "- Runtime signals: $RuntimeSignalsPath",
  "- ui-kit tsc: $UiKitTscPath",
  "- app-client tsc: $AppClientTscPath",
  "- adb devices: $AdbDevicesPath",
  "- adb logcat tail: $AdbLogcatPath",
  "- ui-kit src tree: $TreePath",
  "- JSON: $EvidencePath",
  "",
  "## Counts",
  "",
  "- PASS: $($Passes.Count)",
  "- INFO: $($Infos.Count)",
  "- WARN: $($Warns.Count)",
  "- FAIL: $($Fails.Count)",
  "- Checks: $($Checks.Count)",
  "- Imports: $($Imports.Count)",
  "- Runtime signals: $($RuntimeSignals.Count)"
)

$SummaryLines | Set-Content -Encoding UTF8 -Path $SummaryPath

Write-Host ""
Write-Host ("CHECK DEEP APP BROWSING READINESS STATUS: {0}" -f $Status) -ForegroundColor $(if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "WARN") { "Yellow" } else { "Red" })
Write-Host ("Evidence Pack: {0}" -f $RunRoot) -ForegroundColor Cyan
Write-Host ""

Write-Host "SUMMARY COUNTS" -ForegroundColor Cyan
Write-Host ("PASS={0} INFO={1} WARN={2} FAIL={3} CHECKS={4} IMPORTS={5} RUNTIME_SIGNALS={6}" -f $Passes.Count, $Infos.Count, $Warns.Count, $Fails.Count, $Checks.Count, $Imports.Count, $RuntimeSignals.Count)

Write-Host ""
Write-Host "TOP FAIL/WARN FINDINGS" -ForegroundColor Yellow
if ($TopFindings.Count -eq 0) {
  Write-Host "None" -ForegroundColor Green
} else {
  $TopFindings | Format-Table severity,code,path,action -Wrap
}

Write-Host ""
Write-Host "OUTPUTS" -ForegroundColor Cyan
Write-Host ("Findings: {0}" -f $FindingsPath)
Write-Host ("Checks: {0}" -f $ChecksPath)
Write-Host ("Runtime signals: {0}" -f $RuntimeSignalsPath)
Write-Host ("ADB logcat: {0}" -f $AdbLogcatPath)
Write-Host ""
Write-Host "Done. No production source was changed." -ForegroundColor Green
