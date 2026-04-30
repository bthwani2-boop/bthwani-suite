<#
PowerShell script: replace-BTH-with-bthwani.ps1
Purpose: File-by-file backup + whole-word replacement of 'BTH' -> 'bthwani'
Safety: Creates a `.bak` backup per file before changing. Default is a dry-run when using -WhatIf.

Usage examples:
# Dry-run (shows what would change):
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\replace-BTH-with-bthwani.ps1 -WhatIf
# Apply changes:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\replace-BTH-with-bthwani.ps1
# To target a different folder or pattern use parameters (see param block)
#
# Notes:
# - The script replaces only the exact uppercase word `BTH` (regex word boundaries).
# - It will NOT change `Bth*` component names nor `@bthwani` (case-sensitive whole-word match).
# - Works file-by-file and keeps a backup `<file>.bak` if not already present.
#
# Review the repository policy before running on wider scopes.
#
# Author: GitHub Copilot (assistant)
#
#>
param(
    [string]$Root = "packages/ui-kit/docs",
    [string]$BackupSuffix = ".bak",
    [string]$Pattern = '\bBTH\b',
    [string]$Replacement = 'bthwani',
    [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'

$files = Get-ChildItem -Path $Root -Recurse -File -Filter *.md -ErrorAction SilentlyContinue
if (-not $files) {
    Write-Host "No .md files found under path: $Root"
    exit 0
}

$regex = New-Object System.Text.RegularExpressions.Regex($Pattern, [System.Text.RegularExpressions.RegexOptions]::None)

$summary = [ordered]@{
    Total = 0
    Matched = 0
    BackupsCreated = 0
    Replaced = 0
    Skipped = 0
}

foreach ($file in $files) {
    $summary.Total++
    try {
        $text = Get-Content -Raw -Encoding UTF8 -ErrorAction Stop $file.FullName
    } catch {
        Write-Warning "Could not read file: $($file.FullName) — $_"
        $summary.Skipped++
        continue
    }

    if (-not $regex.IsMatch($text)) {
        Write-Host "No match: $($file.FullName)"
        continue
    }

    $summary.Matched++

    $backupPath = $file.FullName + $BackupSuffix
    if (-not (Test-Path $backupPath)) {
        if ($WhatIf) {
            Write-Host "WhatIf: would create backup: $backupPath"
        } else {
            Copy-Item -Path $file.FullName -Destination $backupPath -ErrorAction Stop
            Write-Host "Backup created: $backupPath"
            $summary.BackupsCreated++
        }
    } else {
        Write-Host "Backup already exists: $backupPath"
    }

    if ($WhatIf) {
        $count = ($regex.Matches($text)).Count
        Write-Host "WhatIf: $count match(es) in $($file.FullName) — would replace '${Pattern}' -> '${Replacement}'"
        continue
    }

    $newText = $regex.Replace($text, $Replacement)
    if ($newText -ne $text) {
        try {
            Set-Content -Path $file.FullName -Value $newText -Encoding UTF8 -Force
            Write-Host "Replaced in: $($file.FullName)"
            $summary.Replaced++
        } catch {
            Write-Warning "Failed to write file: $($file.FullName) — $_"
            $summary.Skipped++
            # Attempt rollback from backup if backup was just created
            if (Test-Path $backupPath) {
                Copy-Item -Path $backupPath -Destination $file.FullName -Force
                Write-Host "Rolled back from backup for: $($file.FullName)"
            }
        }
    } else {
        Write-Host "No textual change after replacement: $($file.FullName)"
    }
}

Write-Host "\nSummary: Total=$($summary.Total); Matched=$($summary.Matched); BackupsCreated=$($summary.BackupsCreated); Replaced=$($summary.Replaced); Skipped=$($summary.Skipped)"
