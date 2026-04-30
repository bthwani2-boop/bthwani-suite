Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode  = "CHECK_ANALYZE_GOVERNANCE_AUTOMATION_BASELINE"
$SessionId  = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot   = (Get-Location).Path
$RunRoot    = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$script:Results = New-Object System.Collections.Generic.List[object]
$script:TextFiles = New-Object System.Collections.Generic.List[string]

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host ("=" * 100) -ForegroundColor DarkGray
    Write-Host $Title -ForegroundColor Cyan
    Write-Host ("=" * 100) -ForegroundColor DarkGray
}

function Save-Utf8 {
    param(
        [string]$Path,
        [string]$Content
    )
    $parent = Split-Path -Parent $Path
    if ($parent) {
        New-Item -ItemType Directory -Force -Path $parent | Out-Null
    }
    Set-Content -LiteralPath $Path -Value $Content -Encoding UTF8
    [void]$script:TextFiles.Add($Path)
}

function Add-Result {
    param(
        [string]$Category,
        [string]$Name,
        [string]$Status,
        [string]$Details,
        [string]$EvidencePath = ""
    )
    $script:Results.Add([pscustomobject]@{
        Category     = $Category
        Name         = $Name
        Status       = $Status
        Details      = $Details
        EvidencePath = $EvidencePath
    }) | Out-Null
}

function Get-SafeText {
    param([scriptblock]$Block)
    try {
        (& $Block 2>&1 | Out-String).Trim()
    }
    catch {
        "ERROR: $($_.Exception.Message)"
    }
}

function Get-PreferredCodeCommand {
    $candidates = @(
        (Get-Command code -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
        "$env:LOCALAPPDATA\Programs\Microsoft VS Code\bin\code.cmd",
        "$env:ProgramFiles\Microsoft VS Code\bin\code.cmd",
        "$env:ProgramFiles(x86)\Microsoft VS Code\bin\code.cmd"
    ) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

    $first = $candidates | Select-Object -First 1
    if ($first) { return $first }
    return $null
}

function Get-CommandInfo {
    param(
        [string]$Name,
        [string[]]$Args = @("--version")
    )

    $cmd = Get-Command $Name -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $cmd) {
        return [pscustomobject]@{
            Name    = $Name
            Found   = $false
            Path    = $null
            Version = $null
            Source  = "PATH"
        }
    }

    $versionText = Get-SafeText { & $cmd.Source @Args }
    return [pscustomobject]@{
        Name    = $Name
        Found   = $true
        Path    = $cmd.Source
        Version = $versionText
        Source  = "PATH"
    }
}

function Get-PnpmExecInfo {
    param(
        [string]$BinaryName,
        [string[]]$Args = @("--version")
    )

    $pnpm = Get-Command pnpm -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $pnpm) {
        return [pscustomobject]@{
            Name    = $BinaryName
            Found   = $false
            Path    = $null
            Version = $null
            Source  = "pnpm-exec"
        }
    }

    $output = Get-SafeText { & $pnpm.Source exec $BinaryName @Args }
    if ($output -match "ERROR:" -or $output -match "Command.+not found" -or $output -match "is not recognized") {
        return [pscustomobject]@{
            Name    = $BinaryName
            Found   = $false
            Path    = $null
            Version = $output
            Source  = "pnpm-exec"
        }
    }

    return [pscustomobject]@{
        Name    = $BinaryName
        Found   = $true
        Path    = "pnpm exec $BinaryName"
        Version = $output
        Source  = "pnpm-exec"
    }
}

function Get-TrimmedFile {
    param(
        [string]$Path,
        [int]$MaxLines = 200
    )
    if (-not (Test-Path -LiteralPath $Path)) {
        return ""
    }
    try {
        $lines = Get-Content -LiteralPath $Path -ErrorAction Stop
        if ($lines.Count -gt $MaxLines) {
            return (($lines | Select-Object -First $MaxLines) -join [Environment]::NewLine) + [Environment]::NewLine + "...TRUNCATED..."
        }
        return ($lines -join [Environment]::NewLine)
    }
    catch {
        return "ERROR reading file: $($_.Exception.Message)"
    }
}

function Get-FilteredFiles {
    param(
        [string]$Root,
        [string[]]$Patterns
    )

    $excludeRegex = '\\(node_modules|\.git|dist|build|coverage|\.next|\.expo|out|tmp|temp|DerivedData|android\\build|ios\\build)\\'
    $found = New-Object System.Collections.Generic.List[System.IO.FileInfo]

    foreach ($pattern in $Patterns) {
        Get-ChildItem -LiteralPath $Root -Recurse -File -Filter $pattern -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch $excludeRegex } |
            ForEach-Object { [void]$found.Add($_) }
    }

    $found |
        Sort-Object FullName -Unique
}

function Get-FilteredDirectories {
    param(
        [string]$Root,
        [string[]]$Names
    )

    $excludeRegex = '\\(node_modules|\.git|dist|build|coverage|\.next|\.expo|out|tmp|temp|DerivedData|android\\build|ios\\build)\\'
    $found = New-Object System.Collections.Generic.List[System.IO.DirectoryInfo]

    foreach ($name in $Names) {
        Get-ChildItem -LiteralPath $Root -Recurse -Directory -ErrorAction SilentlyContinue |
            Where-Object {
                $_.Name -eq $name -and
                $_.FullName -notmatch $excludeRegex
            } |
            ForEach-Object { [void]$found.Add($_) }
    }

    $found |
        Sort-Object FullName -Unique
}

function Convert-HashtableLikeToArray {
    param($Object)
    $list = @()
    if ($null -eq $Object) { return $list }
    foreach ($prop in $Object.PSObject.Properties) {
        $list += [pscustomobject]@{
            Name  = $prop.Name
            Value = [string]$prop.Value
        }
    }
    return $list
}

Write-Section "START :: $IssueCode"
Write-Host "RepoRoot : $RepoRoot" -ForegroundColor Yellow
Write-Host "RunRoot  : $RunRoot" -ForegroundColor Yellow

# -------------------------------------------------------------------------------------------------
# 1) REPO + GIT BASELINE
# -------------------------------------------------------------------------------------------------
Write-Section "1) REPO + GIT BASELINE"

$gitInfo = Get-CommandInfo -Name "git" -Args @("--version")
if ($gitInfo.Found) {
    Add-Result -Category "Environment" -Name "git" -Status "PASS" -Details $gitInfo.Version -EvidencePath ""
    Write-Host "[PASS] git :: $($gitInfo.Version)" -ForegroundColor Green
}
else {
    Add-Result -Category "Environment" -Name "git" -Status "FAIL" -Details "git not found on PATH" -EvidencePath ""
    Write-Host "[FAIL] git not found on PATH" -ForegroundColor Red
}

$gitRootText   = ""
$gitBranchText = ""
$gitStatusText = ""
$gitTopOk      = $false

if ($gitInfo.Found) {
    $gitRootText = Get-SafeText { git rev-parse --show-toplevel }
    $gitBranchText = Get-SafeText { git branch --show-current }
    $gitStatusText = Get-SafeText { git --no-pager status --short }

    $gitTopOk = ($gitRootText -and ($gitRootText -eq $RepoRoot))
    $repoStatus = if ($gitTopOk) { "PASS" } else { "WARN" }

    Add-Result -Category "Repo" -Name "git root alignment" -Status $repoStatus -Details ("gitRoot={0}; branch={1}" -f $gitRootText, $gitBranchText) -EvidencePath ""
    Write-Host ("[{0}] git root alignment :: gitRoot={1} ; branch={2}" -f $repoStatus, $gitRootText, $gitBranchText) -ForegroundColor $(if ($repoStatus -eq "PASS") {"Green"} else {"Yellow"})

    $gitStatusPath = Join-Path $RunRoot "git_status.txt"
    Save-Utf8 -Path $gitStatusPath -Content $gitStatusText
    Add-Result -Category "Repo" -Name "git status snapshot" -Status "PASS" -Details "Saved git status snapshot" -EvidencePath $gitStatusPath
}

# -------------------------------------------------------------------------------------------------
# 2) TOOLCHAIN / GOVERNANCE CLI DISCOVERY
# -------------------------------------------------------------------------------------------------
Write-Section "2) TOOLCHAIN / GOVERNANCE CLI DISCOVERY"

$toolChecks = @(
    @{ Name = "node";      Args = @("--version") }
    @{ Name = "pnpm";      Args = @("--version") }
    @{ Name = "bun";       Args = @("--version") }
    @{ Name = "gh";        Args = @("--version") }
    @{ Name = "code";      Args = @("--version") }
    @{ Name = "semgrep";   Args = @("--version") }
    @{ Name = "conftest";  Args = @("--version") }
    @{ Name = "opa";       Args = @("version") }
    @{ Name = "gitleaks";  Args = @("version") }
    @{ Name = "spectral";  Args = @("--version") }
    @{ Name = "depcruise"; Args = @("--version") }
)

$toolRows = New-Object System.Collections.Generic.List[object]

foreach ($tool in $toolChecks) {
    $info = Get-CommandInfo -Name $tool.Name -Args $tool.Args
    if (-not $info.Found -and $tool.Name -in @("spectral","depcruise")) {
        $fallback = Get-PnpmExecInfo -BinaryName $tool.Name -Args $tool.Args
        if ($fallback.Found) { $info = $fallback }
    }

    $status = if ($info.Found) { "PASS" } else { "WARN" }
    $details = if ($info.Found) {
        "source={0}; path={1}; version={2}" -f $info.Source, $info.Path, $info.Version
    } else {
        "Not found"
    }

    $toolRows.Add([pscustomobject]@{
        Name    = $info.Name
        Found   = $info.Found
        Source  = $info.Source
        Path    = $info.Path
        Version = $info.Version
    }) | Out-Null

    Add-Result -Category "Toolchain" -Name $info.Name -Status $status -Details $details -EvidencePath ""
    Write-Host ("[{0}] {1}" -f $status, $details.Replace("source=" + $info.Source + "; ", "$($info.Name) :: ")) -ForegroundColor $(if ($status -eq "PASS") {"Green"} else {"Yellow"})
}

$toolMatrixPath = Join-Path $RunRoot "tool_matrix.csv"
$toolRows | Export-Csv -LiteralPath $toolMatrixPath -NoTypeInformation -Encoding UTF8
Add-Result -Category "Artifacts" -Name "tool matrix" -Status "PASS" -Details "CSV exported" -EvidencePath $toolMatrixPath

# -------------------------------------------------------------------------------------------------
# 3) VS CODE SURFACES
# -------------------------------------------------------------------------------------------------
Write-Section "3) VS CODE SURFACES"

$codeCmd = Get-PreferredCodeCommand
$vsCodeRoot = Join-Path $env:APPDATA "Code\User"
$userSettingsPath = Join-Path $vsCodeRoot "settings.json"
$userKeybindingsPath = Join-Path $vsCodeRoot "keybindings.json"
$profilesRoot = Join-Path $vsCodeRoot "profiles"
$workspaceVscodeRoot = Join-Path $RepoRoot ".vscode"
$workspaceSettingsPath = Join-Path $workspaceVscodeRoot "settings.json"
$workspaceExtensionsPath = Join-Path $workspaceVscodeRoot "extensions.json"
$extensionsDir = Join-Path $env:USERPROFILE ".vscode\extensions"
$insidersExtensionsDir = Join-Path $env:USERPROFILE ".vscode-insiders\extensions"

if ($codeCmd) {
    $codeVersion = Get-SafeText { & $codeCmd --version }
    Add-Result -Category "VSCode" -Name "code CLI" -Status "PASS" -Details ("path={0}; version={1}" -f $codeCmd, $codeVersion) -EvidencePath ""
    Write-Host "[PASS] code CLI detected" -ForegroundColor Green

    $extList = Get-SafeText { & $codeCmd --list-extensions --show-versions }
    $extListPath = Join-Path $RunRoot "vscode_extensions_cli.txt"
    Save-Utf8 -Path $extListPath -Content $extList
    Add-Result -Category "VSCode" -Name "extensions via code CLI" -Status "PASS" -Details "Exported installed extensions list" -EvidencePath $extListPath

    $interesting = @()
    foreach ($line in ($extList -split "`r?`n")) {
        if ($line -match '(?i)(copilot|github|semgrep|spectral|yaml|openapi|rego|opa|markdown|gitlens)') {
            $interesting += $line
        }
    }
    $interestingPath = Join-Path $RunRoot "vscode_extensions_interesting.txt"
    Save-Utf8 -Path $interestingPath -Content (($interesting | Sort-Object -Unique) -join [Environment]::NewLine)
    Add-Result -Category "VSCode" -Name "interesting governance-related extensions" -Status "PASS" -Details ("count={0}" -f ($interesting | Measure-Object).Count) -EvidencePath $interestingPath
}
else {
    Add-Result -Category "VSCode" -Name "code CLI" -Status "WARN" -Details "code CLI not found on PATH or common VS Code bin paths" -EvidencePath ""
    Write-Host "[WARN] code CLI not found" -ForegroundColor Yellow
}

foreach ($pathInfo in @(
    @{ Name = "user settings";              Path = $userSettingsPath }
    @{ Name = "user keybindings";           Path = $userKeybindingsPath }
    @{ Name = "workspace settings";         Path = $workspaceSettingsPath }
    @{ Name = "workspace extensions.json";  Path = $workspaceExtensionsPath }
)) {
    if (Test-Path -LiteralPath $pathInfo.Path) {
        $target = Join-Path $RunRoot ((($pathInfo.Name -replace '[^\w\-]+','_').ToLower()) + ".txt")
        Save-Utf8 -Path $target -Content (Get-TrimmedFile -Path $pathInfo.Path -MaxLines 300)
        Add-Result -Category "VSCode" -Name $pathInfo.Name -Status "PASS" -Details ("Found: {0}" -f $pathInfo.Path) -EvidencePath $target
        Write-Host ("[PASS] {0}" -f $pathInfo.Name) -ForegroundColor Green
    }
    else {
        Add-Result -Category "VSCode" -Name $pathInfo.Name -Status "WARN" -Details ("Missing: {0}" -f $pathInfo.Path) -EvidencePath ""
        Write-Host ("[WARN] {0} missing" -f $pathInfo.Name) -ForegroundColor Yellow
    }
}

$profileSummary = @()
if (Test-Path -LiteralPath $profilesRoot) {
    Get-ChildItem -LiteralPath $profilesRoot -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        $profilePath = $_.FullName
        $settingsCandidate = Join-Path $profilePath "settings.json"
        $extensionsCandidate = Join-Path $profilePath "extensions.json"
        $profileSummary += [pscustomobject]@{
            ProfileDir          = $_.Name
            FullPath            = $profilePath
            HasSettingsJson     = Test-Path -LiteralPath $settingsCandidate
            HasExtensionsJson   = Test-Path -LiteralPath $extensionsCandidate
        }
    }
}
$profileSummaryPath = Join-Path $RunRoot "vscode_profiles.csv"
$profileSummary | Export-Csv -LiteralPath $profileSummaryPath -NoTypeInformation -Encoding UTF8
Add-Result -Category "VSCode" -Name "profiles inventory" -Status "PASS" -Details ("profiles_count={0}" -f ($profileSummary | Measure-Object).Count) -EvidencePath $profileSummaryPath

$extDirRows = @()
foreach ($dir in @($extensionsDir, $insidersExtensionsDir)) {
    if (Test-Path -LiteralPath $dir) {
        $entries = Get-ChildItem -LiteralPath $dir -Directory -ErrorAction SilentlyContinue | Sort-Object Name
        $extDirRows += [pscustomobject]@{
            ExtensionsDir = $dir
            Count         = ($entries | Measure-Object).Count
        }
        $listingPath = Join-Path $RunRoot (("extensions_dir_" + (($dir -replace '[:\\ ]','_').Trim('_'))) + ".txt")
        Save-Utf8 -Path $listingPath -Content (($entries.Name) -join [Environment]::NewLine)
        Add-Result -Category "VSCode" -Name ("extensions dir :: " + $dir) -Status "PASS" -Details ("count={0}" -f $entries.Count) -EvidencePath $listingPath
    }
    else {
        $extDirRows += [pscustomobject]@{
            ExtensionsDir = $dir
            Count         = 0
        }
        Add-Result -Category "VSCode" -Name ("extensions dir :: " + $dir) -Status "WARN" -Details "Directory not found" -EvidencePath ""
    }
}
$extDirRows | Export-Csv -LiteralPath (Join-Path $RunRoot "vscode_extension_dirs.csv") -NoTypeInformation -Encoding UTF8

# -------------------------------------------------------------------------------------------------
# 4) REPO GOVERNANCE FILES
# -------------------------------------------------------------------------------------------------
Write-Section "4) REPO GOVERNANCE FILES"

$codeownersCandidates = @(
    (Join-Path $RepoRoot ".github\CODEOWNERS"),
    (Join-Path $RepoRoot "CODEOWNERS")
)

$codeownersFound = $codeownersCandidates | Where-Object { Test-Path -LiteralPath $_ }
if ($codeownersFound.Count -gt 0) {
    foreach ($p in $codeownersFound) {
        $target = Join-Path $RunRoot ("codeowners_" + ([IO.Path]::GetFileName((Split-Path -Parent $p))) + ".txt")
        Save-Utf8 -Path $target -Content (Get-TrimmedFile -Path $p -MaxLines 400)
        Add-Result -Category "Governance" -Name "CODEOWNERS" -Status "PASS" -Details ("Found: {0}" -f $p) -EvidencePath $target
        Write-Host "[PASS] CODEOWNERS found" -ForegroundColor Green
    }
}
else {
    Add-Result -Category "Governance" -Name "CODEOWNERS" -Status "WARN" -Details "No CODEOWNERS found at root or .github" -EvidencePath ""
    Write-Host "[WARN] CODEOWNERS not found" -ForegroundColor Yellow
}

$workflowFiles = Get-FilteredFiles -Root $RepoRoot -Patterns @("*.yml","*.yaml") |
    Where-Object { $_.FullName -match '\\\.github\\workflows\\' }

$workflowListPath = Join-Path $RunRoot "github_workflows.txt"
Save-Utf8 -Path $workflowListPath -Content (($workflowFiles.FullName) -join [Environment]::NewLine)
Add-Result -Category "Governance" -Name "GitHub workflows inventory" -Status (if ($workflowFiles.Count -gt 0) { "PASS" } else { "WARN" }) -Details ("count={0}" -f $workflowFiles.Count) -EvidencePath $workflowListPath

$configFilePatterns = @(
    ".gitleaks.toml",
    ".spectral.yaml",
    ".spectral.yml",
    ".spectral.json",
    "conftest.hcl",
    "*.rego",
    ".semgrep.yml",
    ".semgrep.yaml",
    "semgrep.yml",
    "semgrep.yaml",
    ".dependency-cruiser.js",
    ".dependency-cruiser.cjs",
    ".dependency-cruiser.mjs",
    ".dependency-cruiser.json"
)

$configFiles = Get-FilteredFiles -Root $RepoRoot -Patterns $configFilePatterns
$configDirs  = Get-FilteredDirectories -Root $RepoRoot -Names @("policies","policy",".semgrep")

$configInventoryPath = Join-Path $RunRoot "governance_config_inventory.txt"
$configInventoryText = @(
    "FILES:",
    ($configFiles.FullName | Sort-Object),
    "",
    "DIRECTORIES:",
    ($configDirs.FullName | Sort-Object)
) -join [Environment]::NewLine
Save-Utf8 -Path $configInventoryPath -Content $configInventoryText

Add-Result -Category "Governance" -Name "governance config inventory" -Status (if (($configFiles.Count + $configDirs.Count) -gt 0) { "PASS" } else { "WARN" }) -Details ("files={0}; dirs={1}" -f $configFiles.Count, $configDirs.Count) -EvidencePath $configInventoryPath

# -------------------------------------------------------------------------------------------------
# 5) KEYWORD EVIDENCE FROM TRACKED FILES
# -------------------------------------------------------------------------------------------------
Write-Section "5) KEYWORD EVIDENCE FROM TRACKED FILES"

$keywordRows = New-Object System.Collections.Generic.List[object]
$keywordPatterns = @(
    "semgrep",
    "gitleaks",
    "spectral",
    "conftest",
    "opa",
    "\.rego",
    "dependency-cruiser",
    "depcruise",
    "CODEOWNERS",
    "governance",
    "ruleset"
)

if ($gitInfo.Found) {
    foreach ($kw in $keywordPatterns) {
        $out = Get-SafeText { git --no-pager grep -n -I -E $kw }
        $status = if ($out -and $out -notmatch '^ERROR:') { "PASS" } else { "WARN" }
        $target = Join-Path $RunRoot ("grep_" + ($kw -replace '[^\w]+','_') + ".txt")
        Save-Utf8 -Path $target -Content $out
        $count = 0
        if ($out) { $count = (($out -split "`r?`n") | Where-Object { $_.Trim() }).Count }

        $keywordRows.Add([pscustomobject]@{
            Keyword     = $kw
            MatchCount  = $count
            Evidence    = $target
        }) | Out-Null

        Add-Result -Category "Evidence" -Name ("git grep :: " + $kw) -Status $status -Details ("match_count={0}" -f $count) -EvidencePath $target
        Write-Host ("[{0}] grep {1} :: {2}" -f $status, $kw, $count) -ForegroundColor $(if ($status -eq "PASS") {"Green"} else {"Yellow"})
    }
}
else {
    Add-Result -Category "Evidence" -Name "git grep keywords" -Status "WARN" -Details "Skipped because git is unavailable" -EvidencePath ""
}

$keywordCsvPath = Join-Path $RunRoot "keyword_evidence.csv"
$keywordRows | Export-Csv -LiteralPath $keywordCsvPath -NoTypeInformation -Encoding UTF8

# -------------------------------------------------------------------------------------------------
# 6) PACKAGE.JSON SIGNALS
# -------------------------------------------------------------------------------------------------
Write-Section "6) PACKAGE.JSON SIGNALS"

$pkgFiles = Get-ChildItem -LiteralPath $RepoRoot -Recurse -File -Filter "package.json" -ErrorAction SilentlyContinue |
    Where-Object {
        $_.FullName -notmatch '\\(node_modules|\.git|dist|build|coverage|\.next|\.expo|out|tmp|temp)\\'
    } |
    Sort-Object FullName

$packageSignals = New-Object System.Collections.Generic.List[object]
$interestingNames = @(
    "@stoplight/spectral-cli",
    "dependency-cruiser",
    "semgrep",
    "gitleaks",
    "conftest",
    "opa",
    "open-policy-agent"
)

foreach ($pkg in $pkgFiles) {
    try {
        $json = Get-Content -LiteralPath $pkg.FullName -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
    }
    catch {
        $packageSignals.Add([pscustomobject]@{
            PackageJson = $pkg.FullName
            PackageName = ""
            SignalType  = "parse-error"
            Key         = ""
            Value       = $_.Exception.Message
        }) | Out-Null
        continue
    }

    $packageName = [string]$json.name
    $sections = @(
        @{ Type = "dependencies";     Data = $json.dependencies },
        @{ Type = "devDependencies";  Data = $json.devDependencies },
        @{ Type = "peerDependencies"; Data = $json.peerDependencies },
        @{ Type = "scripts";          Data = $json.scripts }
    )

    foreach ($section in $sections) {
        foreach ($item in (Convert-HashtableLikeToArray -Object $section.Data)) {
            $matched = $false

            if ($section.Type -eq "scripts") {
                if ($item.Value -match '(?i)(semgrep|gitleaks|spectral|conftest|opa|dependency-cruiser|depcruise)') {
                    $matched = $true
                }
            }
            else {
                if ($interestingNames -contains $item.Name -or $item.Name -match '(?i)(spectral|dependency-cruiser|semgrep|gitleaks|conftest|opa)') {
                    $matched = $true
                }
            }

            if ($matched) {
                $packageSignals.Add([pscustomobject]@{
                    PackageJson = $pkg.FullName
                    PackageName = $packageName
                    SignalType  = $section.Type
                    Key         = $item.Name
                    Value       = $item.Value
                }) | Out-Null
            }
        }
    }
}

$packageSignalsPath = Join-Path $RunRoot "package_governance_signals.csv"
$packageSignals | Export-Csv -LiteralPath $packageSignalsPath -NoTypeInformation -Encoding UTF8

Add-Result -Category "Repo" -Name "package governance signals" -Status (if (($packageSignals | Measure-Object).Count -gt 0) { "PASS" } else { "WARN" }) -Details ("count={0}" -f ($packageSignals | Measure-Object).Count) -EvidencePath $packageSignalsPath

# -------------------------------------------------------------------------------------------------
# 7) TOP RISKS / GAPS
# -------------------------------------------------------------------------------------------------
Write-Section "7) TOP RISKS / GAPS"

$warnings = @()

if (-not $codeCmd) {
    $warnings += "VS Code CLI (code) غير متاح؛ لن يكون جرد الإضافات عبر CLI كاملًا."
}
if ($codeownersFound.Count -eq 0) {
    $warnings += "لا يوجد CODEOWNERS؛ ملكية المسارات والمراجعات الإلزامية غير مثبتة محليًا."
}
if ($workflowFiles.Count -eq 0) {
    $warnings += "لا توجد GitHub workflows ظاهرة داخل .github/workflows."
}
if (($configFiles.Count + $configDirs.Count) -eq 0) {
    $warnings += "لا توجد ملفات/مجلدات حوكمة شائعة واضحة مثل spectral/gitleaks/rego/conftest/dependency-cruiser."
}
if (($packageSignals | Measure-Object).Count -eq 0) {
    $warnings += "لا توجد إشارات package.json واضحة تربط أدوات الحوكمة داخل السكربتات/الاعتمادات."
}

$warningsText = if ($warnings.Count -gt 0) { $warnings -join [Environment]::NewLine } else { "No major gaps detected in this baseline scan." }
$warningsPath = Join-Path $RunRoot "top_risks_and_gaps.txt"
Save-Utf8 -Path $warningsPath -Content $warningsText
Add-Result -Category "Summary" -Name "top risks and gaps" -Status (if ($warnings.Count -gt 0) { "WARN" } else { "PASS" }) -Details ("count={0}" -f $warnings.Count) -EvidencePath $warningsPath

if ($warnings.Count -gt 0) {
    Write-Host "[WARN] Gaps detected:" -ForegroundColor Yellow
    $warnings | ForEach-Object { Write-Host (" - " + $_) -ForegroundColor Yellow }
}
else {
    Write-Host "[PASS] No major gaps detected in baseline scan." -ForegroundColor Green
}

# -------------------------------------------------------------------------------------------------
# 8) SUMMARY + EVIDENCE JSON + MERGED FILE
# -------------------------------------------------------------------------------------------------
Write-Section "8) SUMMARY + EVIDENCE"

$passCount = ($script:Results | Where-Object { $_.Status -eq "PASS" }).Count
$warnCount = ($script:Results | Where-Object { $_.Status -eq "WARN" }).Count
$failCount = ($script:Results | Where-Object { $_.Status -eq "FAIL" }).Count

$gateStatus = if ($failCount -gt 0) { "FAIL" } elseif ($warnCount -gt 0) { "WARN" } else { "PASS" }

$summaryLines = @(
    "ISSUE_CODE=$IssueCode",
    "SESSION_ID=$SessionId",
    "REPO_ROOT=$RepoRoot",
    "RUN_ROOT=$RunRoot",
    "GATE_STATUS=$gateStatus",
    "PASS_COUNT=$passCount",
    "WARN_COUNT=$warnCount",
    "FAIL_COUNT=$failCount",
    "GIT_ROOT=$gitRootText",
    "GIT_BRANCH=$gitBranchText"
)

$summaryPath = Join-Path $RunRoot "summary.txt"
Save-Utf8 -Path $summaryPath -Content ($summaryLines -join [Environment]::NewLine)

$evidence = [pscustomobject]@{
    issue_code = $IssueCode
    session_id = $SessionId
    repo_root  = $RepoRoot
    run_root   = $RunRoot
    gate_status = $gateStatus
    git = [pscustomobject]@{
        root   = $gitRootText
        branch = $gitBranchText
    }
    counts = [pscustomobject]@{
        pass = $passCount
        warn = $warnCount
        fail = $failCount
    }
    results = $script:Results
}
$evidenceJsonPath = Join-Path $RunRoot "evidence.json"
$evidence | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $evidenceJsonPath -Encoding UTF8

$mergedPath = Join-Path $RunRoot "MERGED_EVIDENCE_SINGLE_FILE.txt"
$merged = New-Object System.Text.StringBuilder
[void]$merged.AppendLine(("=" * 120))
[void]$merged.AppendLine("MERGED EVIDENCE SINGLE FILE")
[void]$merged.AppendLine(("=" * 120))
[void]$merged.AppendLine("")
[void]$merged.AppendLine("SUMMARY")
[void]$merged.AppendLine(($summaryLines -join [Environment]::NewLine))
[void]$merged.AppendLine("")

foreach ($file in ($script:TextFiles | Sort-Object -Unique)) {
    if (Test-Path -LiteralPath $file) {
        [void]$merged.AppendLine(("=" * 120))
        [void]$merged.AppendLine("FILE :: $file")
        [void]$merged.AppendLine(("=" * 120))
        [void]$merged.AppendLine((Get-Content -LiteralPath $file -Raw -ErrorAction SilentlyContinue))
        [void]$merged.AppendLine("")
    }
}
Save-Utf8 -Path $mergedPath -Content $merged.ToString()

Write-Host ""
Write-Host ("GATE_STATUS : {0}" -f $gateStatus) -ForegroundColor $(if ($gateStatus -eq "PASS") {"Green"} elseif ($gateStatus -eq "WARN") {"Yellow"} else {"Red"})
Write-Host ("PASS/WARN/FAIL : {0}/{1}/{2}" -f $passCount, $warnCount, $failCount) -ForegroundColor Cyan
Write-Host ("SUMMARY        : {0}" -f $summaryPath) -ForegroundColor Gray
Write-Host ("EVIDENCE_JSON  : {0}" -f $evidenceJsonPath) -ForegroundColor Gray
Write-Host ("MERGED_SINGLE  : {0}" -f $mergedPath) -ForegroundColor Gray
