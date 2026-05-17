Set-Location -LiteralPath "C:\bthwani-suite"
$CreateZip = $args -contains "-CreateZip"
<#
Safe BTH token cleanup utility.

Default mode is DryRun.
Apply requires explicit -Apply.

Allowed default scope:
  ui-kit/docs

Rules:
- Replaces only exact uppercase word BTH using whole-token regex \bBTH\b.
- Does not modify bthwani, BThwani, @bthwani/*, bthwani-suite.
- Does not create .bak files inside source paths.
- In Apply mode, backups and evidence are written under tools/registry/runs/{SESSION_ID}/.
- In Apply mode, a ZIP named exactly after SESSION_ID is produced for review.
#>

$ErrorActionPreference = "Stop"

$Apply = $false
$Root = "ui-kit/docs"
$Pattern = "\bBTH\b"
$Replacement = "bthwani"

for ($i = 0; $i -lt $args.Count; $i++) {
    switch ($args[$i]) {
        "-Apply" { $Apply = $true }
        "-Root" {
            if ($i + 1 -ge $args.Count) { throw "-Root requires a value." }
            $i++
            $Root = $args[$i]
        }
        "-Pattern" {
            if ($i + 1 -ge $args.Count) { throw "-Pattern requires a value." }
            $i++
            $Pattern = $args[$i]
        }
        "-Replacement" {
            if ($i + 1 -ge $args.Count) { throw "-Replacement requires a value." }
            $i++
            $Replacement = $args[$i]
        }
        default {
            throw "Unknown argument: $($args[$i]). Allowed: -Apply, -Root <path>, -Pattern <regex>, -Replacement <text>."
        }
    }
}

$RepoRoot = (Get-Location).Path
$SessionId = "REPLACE_BTH_TOKEN-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
$BackupRoot = Join-Path $RunRoot "backup"
New-Item -ItemType Directory -Force -Path $RunRoot, $BackupRoot | Out-Null

$Mode = if ($Apply) { "APPLY" } else { "DRYRUN" }
$LogPath = Join-Path $RunRoot "commands.log"
"mode=$Mode" | Set-Content -LiteralPath $LogPath -Encoding UTF8

$resolvedRoot = Join-Path $RepoRoot $Root
if (-not (Test-Path -LiteralPath $resolvedRoot)) {
    throw "Root not found: $Root"
}

$files = Get-ChildItem -LiteralPath $resolvedRoot -Recurse -File -Filter "*.md" -ErrorAction Stop
$regex = [regex]::new($Pattern)

$matches = New-Object System.Collections.Generic.List[object]
$changed = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
    $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
    $count = $regex.Matches($text).Count
    if ($count -le 0) { continue }

    $relative = $file.FullName.Substring($RepoRoot.Length).TrimStart('\','/')
    $matches.Add([ordered]@{ path = $relative; matches = $count }) | Out-Null

    if ($Apply) {
        $backupPath = Join-Path $BackupRoot $relative
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backupPath) | Out-Null
        Copy-Item -LiteralPath $file.FullName -Destination $backupPath -Force

        $newText = $regex.Replace($text, $Replacement)
        if ($newText -ne $text) {
            Set-Content -LiteralPath $file.FullName -Value $newText -Encoding UTF8
            $changed.Add($relative) | Out-Null
        }
    }
}

$matchesCsv = Join-Path $RunRoot "matches.csv"
"file,matches" | Set-Content -LiteralPath $matchesCsv -Encoding UTF8
foreach ($m in $matches) {
    ('"{0}",{1}' -f (($m.path -replace '"','""')), $m.matches) | Add-Content -LiteralPath $matchesCsv -Encoding UTF8
}

$filesTouchedPath = Join-Path $RunRoot "files-touched.txt"
($changed | Out-String) | Set-Content -LiteralPath $filesTouchedPath -Encoding UTF8

$summary = @"
status: REVIEW_REQUIRED
mode: $Mode
repo: $RepoRoot
root: $Root
pattern: $Pattern
replacement: $Replacement
matched_files: $($matches.Count)
changed_files: $($changed.Count)
evidence_root: $RunRoot
evidence_zip: $(Join-Path $RunRoot "$SessionId.zip")
"@
$summary | Set-Content -LiteralPath (Join-Path $RunRoot "summary.txt") -Encoding UTF8

$evidence = [ordered]@{
    status = "REVIEW_REQUIRED"
    mode = $Mode
    repo = $RepoRoot
    root = $Root
    pattern = $Pattern
    replacement = $Replacement
    matchedFiles = $matches.Count
    changedFiles = $changed.Count
    evidenceRoot = $RunRoot
}
$evidence | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

if ($Apply) {
    git --no-pager status --short > (Join-Path $RunRoot "git-status.txt")
    git --no-pager diff --check > (Join-Path $RunRoot "git-diff-check.txt")
    git --no-pager diff --stat > (Join-Path $RunRoot "git-diff-stat.txt")
    git --no-pager diff --name-status > (Join-Path $RunRoot "git-diff-name-status.txt")
    git --no-pager diff -- . > (Join-Path $RunRoot "LOCAL_CHANGE_REVIEW.patch")
    git ls-files --others --exclude-standard > (Join-Path $RunRoot "untracked-files.txt")

    $zipPath = Join-Path $RunRoot "$SessionId.zip"
    if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
    Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $zipPath -Force
}

Write-Host "Mode: $Mode"
Write-Host "Matched files: $($matches.Count)"
Write-Host "Changed files: $($changed.Count)"
Write-Host "Evidence: $RunRoot"
if ($Apply) { Write-Host ("EVIDENCE ZIP: " + $(if ($CreateZip) { Join-Path $RunRoot "$SessionId.zip" } else { "not-created-by-default" })) }
