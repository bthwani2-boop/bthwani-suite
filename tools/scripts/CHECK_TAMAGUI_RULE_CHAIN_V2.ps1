Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$IssueCode = "CHECK_TAMAGUI_RULE_CHAIN_V2"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandsLog = Join-Path $RunRoot "commands.log"
$StatusPath = Join-Path $RunRoot "status.txt"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$FindingsPath = Join-Path $RunRoot "findings.json"
$ScanPath = Join-Path $RunRoot "scan-results.json"

$Findings = @()
$CommandResults = @()
$Scan = [ordered]@{}

function Write-Step {
param([string]$Message)
$line = "[{0:yyyy-MM-dd HH:mm:ss}] {1}" -f (Get-Date), $Message
$line | Tee-Object -FilePath $CommandsLog -Append
}

function Get-Rel {
param([string]$Path)

if ([string]::IsNullOrWhiteSpace($Path)) {
return ""
}

$full = [System.IO.Path]::GetFullPath($Path)
$root = [System.IO.Path]::GetFullPath($RepoRoot)

if ($full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
return $full.Substring($root.Length).TrimStart("\")
}

return $Path
}

function Add-Finding {
param(
[string]$Gate,
[ValidateSet("PASS","FAIL","UNPROVEN","WARN","INFO")]
[string]$Status,
[ValidateSet("CRITICAL","HIGH","MEDIUM","LOW","INFO")]
[string]$Severity,
[string]$Message,
[string[]]$Files = @(),
[string[]]$Evidence = @(),
[string]$Recommendation = ""
)

$script:Findings += [ordered]@{
gate = $Gate
status = $Status
severity = $Severity
message = $Message
files = $Files
evidence = $Evidence
recommendation = $Recommendation
}
}

function Read-TextSafe {
param([string]$Path)

try {
if (-not (Test-Path -LiteralPath $Path)) {
return ""
}

$text = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 -ErrorAction Stop

if ($null -eq $text) {
return ""
}

return [string]$text
}
catch {
return ""
}
}

function Read-JsonSafe {
param([string]$Path)

try {
$text = Read-TextSafe -Path $Path

if ([string]::IsNullOrWhiteSpace($text)) {
return $null
}

return $text | ConvertFrom-Json -ErrorAction Stop
}
catch {
Add-Finding `
-Gate "JSON Parse Gate" `
-Status "FAIL" `
-Severity "HIGH" `
-Message "فشل تحليل JSON." `
-Files @((Get-Rel $Path)) `
-Evidence @($_.Exception.Message)

return $null
}
}

function Test-Ignored {
param([string]$Path)

$p = $Path.Replace("\", "/")

return (
$p -match "/node_modules/" -or
$p -match "/\.git/" -or
$p -match "/\.next/" -or
$p -match "/dist/" -or
$p -match "/build/" -or
$p -match "/coverage/" -or
$p -match "/tools/registry/runs/" -or
$p -match "/android/.*/build/" -or
$p -match "/ios/.*/build/"
)
}

function Get-ScanFiles {
param([string[]]$Roots)

$extensions = @(".ts",".tsx",".js",".jsx",".mjs",".cjs",".json",".css",".scss",".md",".yml",".yaml")
$files = @()

foreach ($root in $Roots) {
$rootPath = Join-Path $RepoRoot $root

if (-not (Test-Path -LiteralPath $rootPath)) {
continue
}

$files += Get-ChildItem -LiteralPath $rootPath -Recurse -File -ErrorAction SilentlyContinue |
Where-Object {
$extensions -contains $_.Extension.ToLowerInvariant() -and
-not (Test-Ignored $_.FullName)
}
}

return $files
}

function Search-Pattern {
param(
[string[]]$Roots,
[string]$Pattern,
[string]$Label,
[int]$MaxFiles = 3000,
[int]$MaxLinesPerFile = 20
)

$results = @()
$files = @(Get-ScanFiles -Roots $Roots | Select-Object -First $MaxFiles)

foreach ($file in $files) {
$content = Read-TextSafe -Path $file.FullName

if ([string]::IsNullOrEmpty($content)) {
continue
}

try {
$matches = [regex]::Matches(
$content,
$Pattern,
[System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Multiline
)
}
catch {
Add-Finding `
-Gate "Regex Gate" `
-Status "FAIL" `
-Severity "HIGH" `
-Message "Regex غير صالح داخل السكربت." `
-Evidence @("label=$Label", "pattern=$Pattern", $_.Exception.Message)

continue
}

if ($matches.Count -le 0) {
continue
}

$lineHits = @()
$lines = $content -split "`r?`n"

for ($i = 0; $i -lt $lines.Count; $i++) {
if ($lines[$i] -match $Pattern) {
$lineHits += [ordered]@{
line = $i + 1
text = $lines[$i].Trim()
}

if ($lineHits.Count -ge $MaxLinesPerFile) {
break
}
}
}

$results += [ordered]@{
file = Get-Rel $file.FullName
count = $matches.Count
label = $Label
lines = $lineHits
}
}

return $results
}

function Get-DependencyHit {
param(
[object]$PackageJson,
[string]$Name
)

if ($null -eq $PackageJson) {
return $null
}

foreach ($group in @("dependencies","devDependencies","peerDependencies","optionalDependencies")) {
$obj = $PackageJson.PSObject.Properties[$group].Value

if ($null -ne $obj -and $null -ne $obj.PSObject.Properties[$Name]) {
return [ordered]@{
group = $group
version = [string]$obj.PSObject.Properties[$Name].Value
}
}
}

return $null
}

function Get-ExportKeys {
param([object]$PackageJson)

$keys = @()

if ($null -eq $PackageJson) {
return $keys
}

$exports = $PackageJson.PSObject.Properties["exports"].Value

if ($null -eq $exports) {
return $keys
}

if ($exports -is [string]) {
return @(".")
}

foreach ($p in $exports.PSObject.Properties) {
$keys += $p.Name
}

return $keys | Sort-Object -Unique
}

function Invoke-Captured {
param(
[string]$Name,
[string]$Command,
[string[]]$Arguments = @(),
[bool]$Required = $false
)

$outFile = Join-Path $RunRoot ($Name + ".txt")
$cmdLine = ($Command + " " + ($Arguments -join " ")).Trim()

Write-Step "RUN $cmdLine"

if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
"COMMAND_NOT_FOUND: $Command" | Set-Content -LiteralPath $outFile -Encoding UTF8

$script:CommandResults += [ordered]@{
name = $Name
command = $cmdLine
exitCode = 127
status = "COMMAND_NOT_FOUND"
required = $Required
outputFile = Get-Rel $outFile
}

if ($Required) {
Add-Finding `
-Gate "Command Gate" `
-Status "FAIL" `
-Severity "CRITICAL" `
-Message "أمر مطلوب غير متاح." `
-Evidence @($cmdLine)
}

return
}

$exit = 0
$output = @()

try {
$output = & $Command @Arguments 2>&1
$exit = $LASTEXITCODE

if ($null -eq $exit) {
$exit = 0
}
}
catch {
$output = @($_.Exception.Message)
$exit = 999
}

$output | Out-File -LiteralPath $outFile -Encoding UTF8

$status = if ($exit -eq 0) { "PASS" } else { "FAIL" }

$script:CommandResults += [ordered]@{
name = $Name
command = $cmdLine
exitCode = $exit
status = $status
required = $Required
outputFile = Get-Rel $outFile
}

if ($Required -and $exit -ne 0) {
Add-Finding `
-Gate "Command Gate" `
-Status "FAIL" `
-Severity "CRITICAL" `
-Message "فشل أمر مطلوب." `
-Evidence @("command=$cmdLine", "exitCode=$exit", "output=$(Get-Rel $outFile)")
}
}

Write-Step "START $IssueCode"
Write-Step "RepoRoot=$RepoRoot"
Write-Step "RunRoot=$RunRoot"

# 1. Canonical path
if ($RepoRoot -eq "C:\bthwani-suite") {
Add-Finding -Gate "Canonical Repo Path Gate" -Status "PASS" -Severity "INFO" -Message "المسار canonical صحيح." -Evidence @($RepoRoot)
}
else {
Add-Finding -Gate "Canonical Repo Path Gate" -Status "FAIL" -Severity "CRITICAL" -Message "المسار الحالي ليس canonical." -Evidence @("actual=$RepoRoot", "expected=C:\bthwani-suite")
}

# 2. Required files
Write-Step "CHECK required files"

$RequiredPaths = @(
"package.json",
"pnpm-lock.yaml",
"packages\ui-kit\package.json",
"packages\ui-kit\src\index.ts",
"packages\ui-kit\src\providers.tsx",
"packages\ui-kit\src\primitives.tsx",
"packages\ui-kit\src\tamagui-config.ts",
"tamagui.config.ts",
"tamagui.build.ts"
)

$Missing = @()

foreach ($relative in $RequiredPaths) {
$p = Join-Path $RepoRoot $relative

if (-not (Test-Path -LiteralPath $p)) {
$Missing += $relative
}
}

if ($Missing.Count -gt 0) {
Add-Finding -Gate "Required Structure Gate" -Status "FAIL" -Severity "CRITICAL" -Message "ملفات أساسية مفقودة." -Files $Missing
}
else {
Add-Finding -Gate "Required Structure Gate" -Status "PASS" -Severity "INFO" -Message "كل الملفات الأساسية موجودة." -Files $RequiredPaths
}

# 3. Dependencies
Write-Step "CHECK dependencies"

$RootPkg = Read-JsonSafe -Path (Join-Path $RepoRoot "package.json")
$UiKitPkg = Read-JsonSafe -Path (Join-Path $RepoRoot "packages\ui-kit\package.json")

$NeededDeps = @("tamagui","@tamagui/config","@tamagui/cli")
$MissingDeps = @()
$DepEvidence = @()

foreach ($dep in $NeededDeps) {
$hit = Get-DependencyHit -PackageJson $RootPkg -Name $dep

if ($null -eq $hit) {
$MissingDeps += $dep
}
else {
$DepEvidence += "$dep => $($hit.group)@$($hit.version)"
}
}

if ($MissingDeps.Count -gt 0) {
Add-Finding -Gate "Root Tamagui Dependency Gate" -Status "FAIL" -Severity "HIGH" -Message "اعتمادات Tamagui ناقصة من root package.json." -Evidence $MissingDeps
}
else {
Add-Finding -Gate "Root Tamagui Dependency Gate" -Status "PASS" -Severity "INFO" -Message "اعتمادات Tamagui موجودة في root package.json." -Evidence $DepEvidence
}

# 4. UI Kit public exports
Write-Step "CHECK ui-kit public exports"

$ExportKeys = @(Get-ExportKeys -PackageJson $UiKitPkg)
$Scan.uiKitExportKeys = $ExportKeys

if ($ExportKeys.Count -eq 0) {
Add-Finding -Gate "UI Kit Public Exports Gate" -Status "FAIL" -Severity "CRITICAL" -Message "packages/ui-kit/package.json لا يحتوي exports واضحة."
}
else {
Add-Finding -Gate "UI Kit Public Exports Gate" -Status "PASS" -Severity "INFO" -Message "public exports موجودة في @bthwani/ui-kit." -Evidence $ExportKeys
}

# 5. Consumer imports
Write-Step "CHECK consumer imports"

$ConsumerRoots = @("apps","packages\surfaces\src","packages\app-shells\src")

$UiKitImports = Search-Pattern `
-Roots $ConsumerRoots `
-Pattern '(from\s+["'']@bthwani/ui-kit(?:/[^"'']+)?["'']|require\s*\(\s*["'']@bthwani/ui-kit(?:/[^"'']+)?["'']\s*\)|import\s*\(\s*["'']@bthwani/ui-kit(?:/[^"'']+)?["'']\s*\))' `
-Label "consumer import from @bthwani/ui-kit"

$Scan.consumerUiKitImports = $UiKitImports

if ($UiKitImports.Count -eq 0) {
Add-Finding -Gate "Consumer UI Kit Adoption Gate" -Status "UNPROVEN" -Severity "HIGH" -Message "لا توجد دلائل كافية أن apps/surfaces/app-shells تستهلك @bthwani/ui-kit ضمن نطاق الفحص."
}
else {
Add-Finding -Gate "Consumer UI Kit Adoption Gate" -Status "PASS" -Severity "INFO" -Message "توجد imports من @bthwani/ui-kit داخل consumers." -Evidence ($UiKitImports | Select-Object -First 40 | ForEach-Object { "$($_.file) count=$($_.count)" })
}

# 6. No direct Tamagui outside ui-kit
Write-Step "CHECK direct Tamagui outside ui-kit"

$DirectTamaguiOutside = Search-Pattern `
-Roots $ConsumerRoots `
-Pattern '(from\s+["''](?:tamagui|@tamagui/[^"'']+)["'']|require\s*\(\s*["''](?:tamagui|@tamagui/[^"'']+)["'']\s*\)|import\s*\(\s*["''](?:tamagui|@tamagui/[^"'']+)["'']\s*\))' `
-Label "direct tamagui outside ui-kit"

$Scan.directTamaguiOutsideUiKit = $DirectTamaguiOutside

if ($DirectTamaguiOutside.Count -gt 0) {
Add-Finding -Gate "Tamagui Internal-Only Boundary Gate" -Status "FAIL" -Severity "CRITICAL" -Message "توجد imports مباشرة من Tamagui خارج @bthwani/ui-kit." -Evidence ($DirectTamaguiOutside | ForEach-Object { "$($_.file) count=$($_.count)" })
}
else {
Add-Finding -Gate "Tamagui Internal-Only Boundary Gate" -Status "PASS" -Severity "INFO" -Message "لا توجد imports مباشرة من Tamagui خارج @bthwani/ui-kit ضمن نطاق الفحص."
}

# 7. No private ui-kit/src imports
Write-Step "CHECK private ui-kit source imports"

$PrivateUiKit = Search-Pattern `
-Roots $ConsumerRoots `
-Pattern '(@bthwani/ui-kit/src|packages[\\/]+ui-kit[\\/]+src|@bthwani/ui-kit[\\/]+components[\\/]|@bthwani/ui-kit[\\/]+foundation[\\/])' `
-Label "private ui-kit source import"

$Scan.privateUiKitImports = $PrivateUiKit

if ($PrivateUiKit.Count -gt 0) {
Add-Finding -Gate "UI Kit Private Source Boundary Gate" -Status "FAIL" -Severity "HIGH" -Message "توجد references لمسارات داخلية من ui-kit بدل public exports." -Evidence ($PrivateUiKit | ForEach-Object { "$($_.file) count=$($_.count)" })
}
else {
Add-Finding -Gate "UI Kit Private Source Boundary Gate" -Status "PASS" -Severity "INFO" -Message "لا توجد references واضحة لمسارات ui-kit داخلية ممنوعة."
}

# 8. Tamagui inside ui-kit
Write-Step "CHECK Tamagui inside ui-kit"

$UiKitTamagui = Search-Pattern `
-Roots @("packages\ui-kit\src") `
-Pattern '(from\s+["''](?:tamagui|@tamagui/[^"'']+)["'']|require\s*\(\s*["''](?:tamagui|@tamagui/[^"'']+)["'']\s*\))' `
-Label "tamagui import inside ui-kit"

$Scan.uiKitTamaguiImports = $UiKitTamagui

if ($UiKitTamagui.Count -eq 0) {
Add-Finding -Gate "UI Kit Internal Tamagui Usage Gate" -Status "FAIL" -Severity "CRITICAL" -Message "لا توجد imports من Tamagui داخل @bthwani/ui-kit."
}
else {
Add-Finding -Gate "UI Kit Internal Tamagui Usage Gate" -Status "PASS" -Severity "INFO" -Message "توجد imports من Tamagui داخل @bthwani/ui-kit." -Evidence ($UiKitTamagui | ForEach-Object { "$($_.file) count=$($_.count)" })
}

# 9. Provider
Write-Step "CHECK TamaguiProvider"

$ProviderPath = Join-Path $RepoRoot "packages\ui-kit\src\providers.tsx"
$ProviderText = Read-TextSafe -Path $ProviderPath
$ProviderMissing = @()

if ($ProviderText -notmatch 'TamaguiProvider') { $ProviderMissing += "TamaguiProvider" }
if ($ProviderText -notmatch 'config\s*=') { $ProviderMissing += "config prop" }
if ($ProviderText -notmatch 'tamagui-config|tamaguiConfig') { $ProviderMissing += "tamaguiConfig reference" }

if ($ProviderMissing.Count -gt 0) {
Add-Finding -Gate "Tamagui Provider Gate" -Status "FAIL" -Severity "CRITICAL" -Message "TamaguiProvider غير مثبت كـ wrapper كامل داخل providers.tsx." -Files @("packages\ui-kit\src\providers.tsx") -Evidence $ProviderMissing
}
else {
Add-Finding -Gate "Tamagui Provider Gate" -Status "PASS" -Severity "INFO" -Message "TamaguiProvider مربوط داخل providers.tsx." -Files @("packages\ui-kit\src\providers.tsx")
}

# 10. Actual Tamagui primitive/component usage
Write-Step "CHECK actual Tamagui primitive usage"

$ActualTamaguiUse = Search-Pattern `
-Roots @("packages\ui-kit\src") `
-Pattern '(styled\s*\(|createStyledContext|withStaticProperties|XStack|YStack|Stack|SizableText|ThemeableStack|GetProps)' `
-Label "actual Tamagui primitive usage"

$Scan.actualTamaguiPrimitiveUsage = $ActualTamaguiUse

if ($ActualTamaguiUse.Count -eq 0) {
Add-Finding -Gate "Actual Tamagui Component Adoption Gate" -Status "FAIL" -Severity "HIGH" -Message "لا توجد دلائل كافية أن Tamagui مستخدم فعليًا داخل primitives/components."
}
else {
Add-Finding -Gate "Actual Tamagui Component Adoption Gate" -Status "PASS" -Severity "INFO" -Message "توجد دلائل استخدام Tamagui primitives/components داخل ui-kit." -Evidence ($ActualTamaguiUse | ForEach-Object { "$($_.file) count=$($_.count)" })
}

# 11. React Native imports inside ui-kit
Write-Step "CHECK react-native imports inside ui-kit"

$ReactNativeInside = Search-Pattern `
-Roots @("packages\ui-kit\src") `
-Pattern 'from\s+["'']react-native["'']' `
-Label "react-native import inside ui-kit"

$Scan.reactNativeImportsInsideUiKit = $ReactNativeInside

if ($ReactNativeInside.Count -gt 0) {
Add-Finding -Gate "React Native Core Inside UI Kit Gate" -Status "UNPROVEN" -Severity "MEDIUM" -Message "توجد imports من react-native داخل ui-kit؛ تحتاج تصنيف platform bridge أم legacy primitive." -Evidence ($ReactNativeInside | Select-Object -First 60 | ForEach-Object { "$($_.file) count=$($_.count)" })
}
else {
Add-Finding -Gate "React Native Core Inside UI Kit Gate" -Status "PASS" -Severity "INFO" -Message "لا توجد imports مباشرة من react-native داخل ui-kit."
}

# 12. Generated CSS import
Write-Step "CHECK Tamagui generated CSS"

$BuildPath = Join-Path $RepoRoot "tamagui.build.ts"
$GeneratedCssPath = Join-Path $RepoRoot "tamagui.generated.css"
$BuildText = Read-TextSafe -Path $BuildPath
$RequiresCss = $BuildText -match 'outputCSS'

$GeneratedCssImports = Search-Pattern `
-Roots @("apps\web","packages\ui-kit\src","packages\app-shells\src") `
-Pattern 'tamagui\.generated\.css' `
-Label "tamagui generated css import"

$Scan.generatedCssImports = $GeneratedCssImports

if ($RequiresCss -and -not (Test-Path -LiteralPath $GeneratedCssPath)) {
Add-Finding -Gate "Tamagui Generated CSS Gate" -Status "FAIL" -Severity "HIGH" -Message "tamagui.build.ts يطلب outputCSS لكن tamagui.generated.css غير موجود." -Files @("tamagui.build.ts")
}
elseif ($RequiresCss -and $GeneratedCssImports.Count -eq 0) {
Add-Finding -Gate "Tamagui Generated CSS Gate" -Status "FAIL" -Severity "HIGH" -Message "tamagui.generated.css موجود/متوقع لكنه غير مستورد في web roots/layouts." -Files @("tamagui.build.ts","tamagui.generated.css")
}
elseif ($RequiresCss) {
Add-Finding -Gate "Tamagui Generated CSS Gate" -Status "PASS" -Severity "INFO" -Message "outputCSS له import مثبت." -Evidence ($GeneratedCssImports | ForEach-Object { "$($_.file) count=$($_.count)" })
}
else {
Add-Finding -Gate "Tamagui Generated CSS Gate" -Status "INFO" -Severity "INFO" -Message "لا يظهر أن tamagui.build.ts يطلب outputCSS؛ CSS gate غير إلزامي في هذه الحالة."
}

# 13. Root scripts
Write-Step "CHECK root Tamagui scripts"

$Scripts = @()

if ($null -ne $RootPkg -and $null -ne $RootPkg.PSObject.Properties["scripts"]) {
foreach ($p in $RootPkg.PSObject.Properties["scripts"].Value.PSObject.Properties) {
$Scripts += "$($p.Name)=$($p.Value)"
}
}

$TamaguiScripts = @($Scripts | Where-Object { $_ -match 'tamagui' })
$Scan.tamaguiScripts = $TamaguiScripts

if ($TamaguiScripts.Count -eq 0) {
Add-Finding -Gate "Tamagui Root Script Gate" -Status "UNPROVEN" -Severity "HIGH" -Message "لا توجد scripts واضحة في root package.json لتشغيل Tamagui build/check/extraction."
}
else {
Add-Finding -Gate "Tamagui Root Script Gate" -Status "PASS" -Severity "INFO" -Message "توجد scripts مرتبطة بـ Tamagui." -Evidence $TamaguiScripts
}

# 14. External command evidence
Write-Step "RUN command gates"

Invoke-Captured -Name "git-status" -Command "git" -Arguments @("--no-pager","status","--short") -Required $false
Invoke-Captured -Name "git-diff-check" -Command "git" -Arguments @("--no-pager","diff","--check") -Required $true
Invoke-Captured -Name "pnpm-why-tamagui" -Command "pnpm" -Arguments @("why","tamagui","@tamagui/config","@tamagui/cli") -Required $false
Invoke-Captured -Name "pnpm-exec-tamagui-version" -Command "pnpm" -Arguments @("exec","tamagui","--version") -Required $false
Invoke-Captured -Name "tsc-noemit" -Command "pnpm" -Arguments @("-w","exec","tsc","--noEmit") -Required $true

# 15. Dirty tree warning
$GitStatusPath = Join-Path $RunRoot "git-status.txt"
$GitStatusText = Read-TextSafe -Path $GitStatusPath

if (-not [string]::IsNullOrWhiteSpace($GitStatusText)) {
Add-Finding -Gate "Working Tree Cleanliness Gate" -Status "WARN" -Severity "MEDIUM" -Message "يوجد working tree غير نظيف؛ لا تعلن إغلاق نهائي قبل تصنيف التغييرات." -Evidence @("output=$(Get-Rel $GitStatusPath)")
}
else {
Add-Finding -Gate "Working Tree Cleanliness Gate" -Status "PASS" -Severity "INFO" -Message "working tree نظيف."
}

# Final status
$PassCount = @($Findings | Where-Object { $_.status -eq "PASS" }).Count
$FailCount = @($Findings | Where-Object { $_.status -eq "FAIL" }).Count
$UnprovenCount = @($Findings | Where-Object { $_.status -eq "UNPROVEN" }).Count
$WarnCount = @($Findings | Where-Object { $_.status -eq "WARN" }).Count
$InfoCount = @($Findings | Where-Object { $_.status -eq "INFO" }).Count

$FinalStatus = "PASS"

if ($FailCount -gt 0) {
$FinalStatus = "FAIL"
}
elseif ($UnprovenCount -gt 0) {
$FinalStatus = "UNPROVEN"
}
elseif ($WarnCount -gt 0) {
$FinalStatus = "PASS_WITH_WARNINGS"
}

$Evidence = [ordered]@{
issueCode = $IssueCode
sessionId = $SessionId
repoRoot = $RepoRoot
runRoot = Get-Rel $RunRoot
finalStatus = $FinalStatus
rule = [ordered]@{
layer1 = "Screen / Surface / App"
layer2 = "@bthwani/ui-kit public exports"
layer3 = "Tamagui internally inside ui-kit only"
}
counts = [ordered]@{
pass = $PassCount
fail = $FailCount
unproven = $UnprovenCount
warn = $WarnCount
info = $InfoCount
total = $Findings.Count
}
findings = $Findings
commandResults = $CommandResults
scan = $Scan
}

$Findings | ConvertTo-Json -Depth 80 | Set-Content -LiteralPath $FindingsPath -Encoding UTF8
$Scan | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $ScanPath -Encoding UTF8
$Evidence | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8
$FinalStatus | Set-Content -LiteralPath $StatusPath -Encoding UTF8

$Blocking = @($Findings | Where-Object { $_.status -eq "FAIL" -or $_.status -eq "UNPROVEN" })

$BlockingLines = @()

foreach ($f in ($Blocking | Select-Object -First 40)) {
$BlockingLines += "- **$($f.status)** / $($f.gate): $($f.message)"
if (-not [string]::IsNullOrWhiteSpace($f.recommendation)) {
$BlockingLines += "  - Recommendation: $($f.recommendation)"
}
}

if ($BlockingLines.Count -eq 0) {
$BlockingLines = @("- لا توجد FAIL/UNPROVEN. راجع WARN قبل إعلان 100%.")
}

$Summary = @(
"# $IssueCode",
"",
"## Final Status",
"",
"```text",
$FinalStatus,
"```",
"",
"## Rule Under Test",
"",
"```text",
"Screen / Surface / App",
"→ @bthwani/ui-kit public exports",
"→ Tamagui internally inside ui-kit only",
"```",
"",
"## Evidence Root",
"",
"```text",
(Get-Rel $RunRoot),
"```",
"",
"## Counts",
"",
"| Status | Count |",
"|---|---:|",
"| PASS | $PassCount |",
"| FAIL | $FailCount |",
"| UNPROVEN | $UnprovenCount |",
"| WARN | $WarnCount |",
"| INFO | $InfoCount |",
"| TOTAL | $($Findings.Count) |",
"",
"## Blocking Findings",
"",
($BlockingLines -join "`r`n"),
"",
"## Generated Evidence",
"",
"| File | Purpose |",
"|---|---|",
"| status.txt | Final status |",
"| evidence.json | Full evidence |",
"| findings.json | Findings only |",
"| scan-results.json | Static scan results |",
"| commands.log | Command log |",
"| git-status.txt | Git status |",
"| git-diff-check.txt | Diff check |",
"| pnpm-why-tamagui.txt | Tamagui dependency graph |",
"| pnpm-exec-tamagui-version.txt | Tamagui CLI version |",
"| tsc-noemit.txt | TypeScript gate |",
"",
"## Interpretation",
"",
"- PASS فقط لا يعني 100% إلا إذا قبلت WARN يدويًا.",
"- FAIL يعني القاعدة مكسورة أو الربط غير مغلق.",
"- UNPROVEN يعني توجد فجوة أدلة تمنع إعلان 100%.",
"- هذا السكربت تشخيصي فقط ولا يعدّل ملفات المشروع."
)

$Summary | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

Write-Host ""
Write-Host "============================================================"
Write-Host "TAMAGUI RULE CHAIN V2 COMPLETE"
Write-Host "============================================================"
Write-Host ("Final Status : {0}" -f $FinalStatus)
Write-Host ("Run Root     : {0}" -f $RunRoot)
Write-Host ("Summary      : {0}" -f $SummaryPath)
Write-Host ("Evidence     : {0}" -f $EvidencePath)
Write-Host "============================================================"

if ($Blocking.Count -gt 0) {
Write-Host ""
Write-Host "Blocking findings:"
foreach ($f in ($Blocking | Select-Object -First 20)) {
Write-Host ("- [{0}] {1}: {2}" -f $f.status, $f.gate, $f.message)
}
}
