Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"

$IssueCode = "VERIFY_SEAL_APP_CLIENT_SURFACES_ENTRYPOINT_BOUNDARY_V2"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = "C:\bthwani-suite"
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$SummaryPath = Join-Path $RunRoot "summary.txt"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$MetroOutPath = Join-Path $RunRoot "metro.stdout.log"
$MetroErrPath = Join-Path $RunRoot "metro.stderr.log"
$MetroStarterPath = Join-Path $RunRoot "START_TEMP_METRO.ps1"

$ClientSurfaceHostPath = Join-Path $RepoRoot "app-client\shell\ClientSurfaceHost.tsx"
$SurfacesAppClientPath = Join-Path $RepoRoot "app-client\composition\index.ts"
$SurfacesPackagePath = Join-Path $RepoRoot "app-client\runtime\package.json"

function Get-FreePort {
  param([int[]]$Candidates)

  foreach ($CandidatePort in $Candidates) {
    $Used = Get-NetTCPConnection -LocalPort $CandidatePort -ErrorAction SilentlyContinue
    if (-not $Used) { return $CandidatePort }
  }

  return $null
}

function Read-TailText {
  param([string]$Path, [int]$Tail = 1200)

  if (-not (Test-Path -LiteralPath $Path)) { return "" }

  try {
    return ((Get-Content -LiteralPath $Path -Tail $Tail -ErrorAction SilentlyContinue) -join "`n")
  } catch {
    return ""
  }
}

function Convert-WebContentToText {
  param($Content)

  if ($null -eq $Content) { return "" }

  try {
    if ($Content -is [byte[]]) {
      return [System.Text.Encoding]::UTF8.GetString($Content)
    }

    return [string]$Content
  } catch {
    return ""
  }
}

function Stop-OnlyTempMetro {
  param([int]$Port, [int]$ParentProcessId)

  $Stopped = @()

  if ($ParentProcessId) {
    try {
      $ParentProc = Get-Process -Id $ParentProcessId -ErrorAction SilentlyContinue
      if ($ParentProc) {
        Stop-Process -Id $ParentProcessId -Force -ErrorAction SilentlyContinue
        $Stopped += [pscustomobject]@{
          process_id = $ParentProcessId
          name = $ParentProc.ProcessName
          reason = "STARTED_BY_THIS_SCRIPT_PARENT"
        }
      }
    } catch {}
  }

  Start-Sleep -Seconds 2

  $OwnerProcessIds = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
    Where-Object { $_.OwningProcess -ne 0 } |
    Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($OwnerProcessId in $OwnerProcessIds) {
    try {
      $Proc = Get-CimInstance Win32_Process -Filter "ProcessId=$OwnerProcessId" -ErrorAction SilentlyContinue

      if (
        $Proc -and
        $Proc.CommandLine -and
        $Proc.CommandLine -match "expo" -and
        $Proc.CommandLine -match "start" -and
        $Proc.CommandLine -match [string]$Port
      ) {
        Stop-Process -Id $OwnerProcessId -Force -ErrorAction SilentlyContinue
        $Stopped += [pscustomobject]@{
          process_id = $OwnerProcessId
          name = $Proc.Name
          reason = "TEMP_PORT_OWNER"
        }
      }
    } catch {}
  }

  return $Stopped
}

function Invoke-BundleProbe {
  param([string]$Url, [int]$TimeoutSec)

  try {
    $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec
    $Text = Convert-WebContentToText $Response.Content

    return [pscustomobject]@{
      ok = $true
      statusCode = [int]$Response.StatusCode
      error = ""
      contentLength = $Text.Length
      first1200 = $Text.Substring(0, [Math]::Min(1200, $Text.Length))
      url = $Url
    }
  } catch {
    return [pscustomobject]@{
      ok = $false
      statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
      error = $_.Exception.Message
      contentLength = 0
      first1200 = ""
      url = $Url
    }
  }
}

function Get-ExportTargetsOnly {
  param([string]$Text)

  $Targets = @()

  if (-not $Text) { return $Targets }

  $Lines = $Text -split "`r?`n"

  foreach ($Line in $Lines) {
    $Trimmed = $Line.Trim()

    if ($Trimmed -match "^\s*//") { continue }
    if ($Trimmed -match "^\s*/\*") { continue }
    if ($Trimmed -match "^\s*\*") { continue }
    if ($Trimmed -match "\*/") { continue }

    if ($Trimmed -match "^\s*export\s+\*\s+from\s+['""]([^'""]+)['""]\s*;?\s*$") {
      $Targets += $Matches[1]
    }
  }

  return $Targets
}

$RiskFlags = @()

$HostText = if (Test-Path -LiteralPath $ClientSurfaceHostPath) {
  Get-Content -LiteralPath $ClientSurfaceHostPath -Raw
} else {
  ""
}

$AppClientEntrypointText = if (Test-Path -LiteralPath $SurfacesAppClientPath) {
  Get-Content -LiteralPath $SurfacesAppClientPath -Raw
} else {
  ""
}

$SurfacesPackage = $null
if (Test-Path -LiteralPath $SurfacesPackagePath) {
  try {
    $SurfacesPackage = Get-Content -LiteralPath $SurfacesPackagePath -Raw | ConvertFrom-Json
  } catch {
    $RiskFlags += "SURFACES_PACKAGE_JSON_PARSE_FAILED"
  }
} else {
  $RiskFlags += "SURFACES_PACKAGE_JSON_MISSING"
}

$ExportTargets = @([regex]::Matches($AppClientEntrypointText, "(?m)from\s+['""]([^'""]+)['""]") | ForEach-Object { $_.Groups[1].Value })

$BadExportTargets = @(
  $ExportTargets | Where-Object {
    $_ -match "app-captain|app-partner|app-field"
  }
)

$GoodClientExportTargets = @(
  $ExportTargets | Where-Object {
    $_ -match "dsh/frontend/app-client"
  }
)

$StaticChecks = [ordered]@{
  client_surface_host_exists = Test-Path -LiteralPath $ClientSurfaceHostPath
  surfaces_app_client_entrypoint_exists = Test-Path -LiteralPath $SurfacesAppClientPath
  surfaces_package_json_exists = Test-Path -LiteralPath $SurfacesPackagePath
  host_uses_app_client_entrypoint = $HostText -match "\.\./composition"
  host_still_uses_root_surfaces = $HostText -match "@bthwani/surfaces"
  export_targets_count = $ExportTargets.Count
  good_app_client_export_targets_count = $GoodClientExportTargets.Count
  bad_non_client_export_targets_count = $BadExportTargets.Count
  package_has_app_client_export = $false
}

if ($SurfacesPackage) {
  $StaticChecks.package_has_app_client_export = $true
}

if (-not $StaticChecks.client_surface_host_exists) { $RiskFlags += "CLIENT_SURFACE_HOST_MISSING" }
if (-not $StaticChecks.surfaces_app_client_entrypoint_exists) { $RiskFlags += "SURFACES_APP_CLIENT_ENTRYPOINT_MISSING" }
if (-not $StaticChecks.host_uses_app_client_entrypoint) { $RiskFlags += "HOST_DOES_NOT_USE_APP_CLIENT_ENTRYPOINT" }
if ($StaticChecks.host_still_uses_root_surfaces) { $RiskFlags += "HOST_STILL_USES_ROOT_SURFACES" }
if ($GoodClientExportTargets.Count -eq 0) { $RiskFlags += "APP_CLIENT_ENTRYPOINT_HAS_NO_APP_CLIENT_EXPORT_TARGETS" }
if ($BadExportTargets.Count -gt 0) { $RiskFlags += "APP_CLIENT_ENTRYPOINT_HAS_NON_CLIENT_EXPORT_TARGETS" }
if (-not $StaticChecks.package_has_app_client_export) { $RiskFlags += "PACKAGE_JSON_MISSING_APP_CLIENT_EXPORT" }

$TempPort = Get-FreePort -Candidates @(8116,8117,8118,8119,8120)
if (-not $TempPort) {
  $RiskFlags += "NO_FREE_VERIFY_METRO_PORT"
  $TempPort = 8116
}

$MetroStarted = $false
$MetroProcessId = $null
$MetroStatus = $null
$BundleProbe = $null
$StoppedTempProcesses = @()

try {
  if ($RiskFlags.Count -eq 0) {
    $MetroStarterLines = @(
      'Set-Location -LiteralPath "C:\bthwani-suite"',
      '$env:EXPO_NO_INTERACTIVE="1"',
      '$env:NO_COLOR="1"',
      ('pnpm --dir app-client/runtime exec expo start --dev-client --port {0} --clear' -f $TempPort)
    )

    [System.IO.File]::WriteAllText(
      $MetroStarterPath,
      ($MetroStarterLines -join [Environment]::NewLine),
      [System.Text.UTF8Encoding]::new($false)
    )

    $MetroProc = Start-Process `
      -FilePath "powershell.exe" `
      -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $MetroStarterPath) `
      -WorkingDirectory $RepoRoot `
      -RedirectStandardOutput $MetroOutPath `
      -RedirectStandardError $MetroErrPath `
      -PassThru

    $MetroStarted = $true
    $MetroProcessId = $MetroProc.Id

    $StatusUrl = "http://127.0.0.1:$TempPort/status"

    for ($WaitSecond = 1; $WaitSecond -le 120; $WaitSecond++) {
      Start-Sleep -Seconds 1

      try {
        $StatusResponse = Invoke-WebRequest -Uri $StatusUrl -UseBasicParsing -TimeoutSec 3
        $MetroStatus = [pscustomobject]@{
          ok = $true
          statusCode = [int]$StatusResponse.StatusCode
          body = Convert-WebContentToText $StatusResponse.Content
          waitedSeconds = $WaitSecond
        }
        break
      } catch {
        $MetroStatus = [pscustomobject]@{
          ok = $false
          error = $_.Exception.Message
          waitedSeconds = $WaitSecond
        }
      }

      $ParentStillAlive = Get-Process -Id $MetroProcessId -ErrorAction SilentlyContinue
      if (-not $ParentStillAlive) {
        $RiskFlags += "VERIFY_METRO_PARENT_PROCESS_EXITED_BEFORE_READY"
        break
      }
    }

    if ($MetroStatus -and $MetroStatus.ok) {
      $BundleUrl = "http://127.0.0.1:$TempPort/app-client/runtime/index.bundle?platform=android&dev=true&minify=false"
      $BundleProbe = Invoke-BundleProbe -Url $BundleUrl -TimeoutSec 240

      if (-not $BundleProbe.ok) {
        $RiskFlags += "VERIFY_METRO_BUNDLE_FAILED"
      }
    } else {
      $RiskFlags += "VERIFY_METRO_STATUS_NOT_READY"
    }
  }
} finally {
  Start-Sleep -Seconds 2
  $StoppedTempProcesses = Stop-OnlyTempMetro -Port $TempPort -ParentProcessId $MetroProcessId
}

$MetroStdoutTail = Read-TailText -Path $MetroOutPath -Tail 1200
$MetroStderrTail = Read-TailText -Path $MetroErrPath -Tail 1200

$MetroStillBroken = $MetroStdoutTail -match "Unable to resolve|order-detail/screens|app-captain\\index\.ts"
if ($MetroStillBroken) {
  $RiskFlags += "METRO_STILL_SEES_OLD_BOUNDARY_ERROR"
}

if ($RiskFlags.Count -eq 0 -and $BundleProbe -and $BundleProbe.ok -and -not $MetroStillBroken) {
  $FinalResult = "PASS_APP_CLIENT_SURFACES_ENTRYPOINT_BOUNDARY_SEALED"
} elseif ($RiskFlags.Count -gt 0) {
  $FinalResult = "FAIL_APP_CLIENT_SURFACES_ENTRYPOINT_BOUNDARY_NOT_SEALED"
} else {
  $FinalResult = "FAIL_UNKNOWN_VERIFY_STATE"
}

$Evidence = [pscustomobject]@{
  issue = $IssueCode
  session_id = $SessionId
  result = $FinalResult
  risk_flags = $RiskFlags
  run_root = $RunRoot
  static_checks = $StaticChecks
  export_targets = $ExportTargets
  bad_export_targets = $BadExportTargets
  good_client_export_targets = $GoodClientExportTargets
  temp_port = $TempPort
  metro_status = $MetroStatus
  bundle_probe = $BundleProbe
  metro_still_broken = $MetroStillBroken
  metro_stdout_tail = $MetroStdoutTail
  metro_stderr_tail = $MetroStderrTail
  stopped_temp_processes = $StoppedTempProcesses
}

$Evidence | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

$SummaryLines = New-Object System.Collections.Generic.List[string]
[void]$SummaryLines.Add($IssueCode)
[void]$SummaryLines.Add("SESSION_ID : $SessionId")
[void]$SummaryLines.Add("RESULT     : $FinalResult")
[void]$SummaryLines.Add("RUN_ROOT   : $RunRoot")
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("RISK_FLAGS:")
[void]$SummaryLines.Add(($RiskFlags -join "`n"))
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("STATIC_CHECKS:")
[void]$SummaryLines.Add(($StaticChecks.GetEnumerator() | ForEach-Object { "$($_.Key): $($_.Value)" }) -join "`n")
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("EXPORT_TARGETS:")
[void]$SummaryLines.Add(($ExportTargets -join "`n"))
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("BAD_EXPORT_TARGETS:")
[void]$SummaryLines.Add(($BadExportTargets -join "`n"))
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("VERIFY_METRO:")
[void]$SummaryLines.Add("PORT   : $TempPort")
[void]$SummaryLines.Add("STATUS : $($MetroStatus.statusCode)")
[void]$SummaryLines.Add("OK     : $($BundleProbe.ok)")
[void]$SummaryLines.Add("ERROR  : $($BundleProbe.error)")
[void]$SummaryLines.Add("LENGTH : $($BundleProbe.contentLength)")
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("METRO_STILL_BROKEN:")
[void]$SummaryLines.Add([string]$MetroStillBroken)
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("METRO_STDOUT_TAIL:")
[void]$SummaryLines.Add($MetroStdoutTail)
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("METRO_STDERR_TAIL:")
[void]$SummaryLines.Add($MetroStderrTail)
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("FINAL_DECISION:")
if ($FinalResult -eq "PASS_APP_CLIENT_SURFACES_ENTRYPOINT_BOUNDARY_SEALED") {
  [void]$SummaryLines.Add("PASS: original app-client Metro failure is sealed. The client no longer bundles app-captain barrels, and Metro bundle is verified.")
} else {
  [void]$SummaryLines.Add("FAIL: boundary is not sealed. Review RISK_FLAGS. No false closure.")
}
[void]$SummaryLines.Add("")
[void]$SummaryLines.Add("EVIDENCE:")
[void]$SummaryLines.Add("summary.txt  : $SummaryPath")
[void]$SummaryLines.Add("evidence.json: $EvidencePath")
[void]$SummaryLines.Add("metro stdout : $MetroOutPath")
[void]$SummaryLines.Add("metro stderr : $MetroErrPath")

$SummaryText = $SummaryLines -join [Environment]::NewLine
$SummaryText | Tee-Object -FilePath $SummaryPath
