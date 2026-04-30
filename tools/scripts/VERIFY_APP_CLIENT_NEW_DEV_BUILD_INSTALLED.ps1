Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "VERIFY_APP_CLIENT_NEW_DEV_BUILD_INSTALLED"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$PackageName = "com.bthwani.client.dev"

$Evidence = [ordered]@{
  issue = $IssueCode
  session_id = $SessionId
  package_name = $PackageName
  selected_device = $null
  installed = $false
  launch_attempted = $false
  result = "UNPROVEN"
  notes = @()
}

function Finish {
  param(
    [string]$Result,
    [string]$Message
  )

  $Evidence.result = $Result
  $Evidence.notes += $Message
  $Evidence | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

  @(
    "RESULT: $Result",
    "MESSAGE: $Message",
    "PACKAGE: $PackageName",
    "DEVICE: $($Evidence.selected_device)",
    "INSTALLED: $($Evidence.installed)",
    "RUN_ROOT: $RunRoot"
  ) | Set-Content -LiteralPath (Join-Path $RunRoot "summary.txt") -Encoding UTF8

  Write-Host ""
  Write-Host "RESULT: $Result" -ForegroundColor $(if ($Result -eq "PASS") { "Green" } else { "Red" })
  Write-Host $Message -ForegroundColor $(if ($Result -eq "PASS") { "Green" } else { "Yellow" })
  Write-Host "RUN_ROOT: $RunRoot" -ForegroundColor DarkGray
}

Write-Host "=== VERIFY APP CLIENT NEW DEV BUILD INSTALLED ===" -ForegroundColor Cyan

if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
  Finish "FAIL" "adb غير موجود في PATH."
  Read-Host "اضغط Enter للإغلاق"
  return
}

$DevicesRaw = & adb devices
Write-Host ""
Write-Host "ADB DEVICES:" -ForegroundColor Cyan
$DevicesRaw | ForEach-Object { Write-Host $_ }

$Devices = $DevicesRaw |
  Where-Object { $_ -match "^\S+\s+device$" } |
  ForEach-Object { ($_ -split "\s+")[0] }

if (-not $Devices -or @($Devices).Count -eq 0) {
  Finish "FAIL" "لا يوجد هاتف متصل عبر adb. إذا انقطع Wi-Fi ADB، وصّل USB مرة واحدة وأعد تشغيل سكربت scrcpy Wi-Fi."
  Read-Host "اضغط Enter للإغلاق"
  return
}

$Device = ($Devices | Where-Object { $_ -match ":\d+$" } | Select-Object -First 1)
if (-not $Device) {
  $Device = $Devices | Select-Object -First 1
}

$Evidence.selected_device = $Device
Write-Host "SELECTED DEVICE: $Device" -ForegroundColor Green

$PkgCheck = (& adb -s $Device shell pm list packages $PackageName | Out-String).Trim()

if ($PkgCheck -notmatch [regex]::Escape($PackageName)) {
  Finish "FAIL" "التطبيق غير مثبت على الهاتف باسم package: $PackageName. ثبّت APK الجديد من Expo أولًا."
  Read-Host "اضغط Enter للإغلاق"
  return
}

$Evidence.installed = $true
Write-Host "PACKAGE INSTALLED: PASS - $PackageName" -ForegroundColor Green

$Dump = (& adb -s $Device shell dumpsys package $PackageName | Out-String)
$VersionLines = ($Dump -split "`n") | Where-Object { $_ -match "versionName|versionCode|firstInstallTime|lastUpdateTime" }

Write-Host ""
Write-Host "PACKAGE VERSION INFO:" -ForegroundColor Cyan
$VersionLines | ForEach-Object { Write-Host $_.Trim() }

try {
  & adb -s $Device shell monkey -p $PackageName -c android.intent.category.LAUNCHER 1 | Out-Null
  $Evidence.launch_attempted = $true
  Write-Host "APP LAUNCH: PASS" -ForegroundColor Green
} catch {
  $Evidence.notes += "Launch failed: $($_.Exception.Message)"
  Write-Host "APP LAUNCH: WARN" -ForegroundColor Yellow
}

Finish "PASS" "التطبيق مثبت وتمت محاولة فتحه. اختبر الآن والهاتف باللغة العربية."

Write-Host ""
Write-Host "NEXT METRO COMMAND:" -ForegroundColor Cyan
Write-Host 'Set-Location -LiteralPath "C:\bthwani-suite"'
Write-Host 'pnpm --dir apps/mobile/app-client exec expo start --dev-client --host lan --port 8081 --clear'
Write-Host ""
Write-Host "اختبار RTL المطلوب: الهاتف Arabic + التطبيق الجديد + Metro جديد." -ForegroundColor Yellow

Read-Host "اضغط Enter للإغلاق"
