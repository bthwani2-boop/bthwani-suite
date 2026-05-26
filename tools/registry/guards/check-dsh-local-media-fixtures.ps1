# Self-contained local guard for DSH media fixtures contracts
# Owner: governance/guards

$ErrorActionPreference = 'Stop'

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Running DSH Local-Only Media Fixtures Contract Guard" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseDir = "C:\bthwani-suite"
$mediaFixturesDir = Join-Path $baseDir "dsh/frontend/media-fixtures"
$manifestPath = Join-Path $mediaFixturesDir "MANIFEST.local-required.tsv"
$categoriesFile = Join-Path $baseDir "dsh/frontend/data/categories.preview-data.ts"
$productsFile = Join-Path $baseDir "dsh/frontend/data/products.preview-data.ts"

$errors = @()

# 1. Verify Manifest existence
if (-not (Test-Path $manifestPath)) {
    $errors += "MANIFEST.local-required.tsv is missing at $manifestPath"
} else {
    Write-Host "OK: MANIFEST.local-required.tsv exists." -ForegroundColor Green
}

# 2. Parse Manifest keys and relative paths
$manifestKeys = @{}
$manifestPaths = @()
if ($errors.Count -eq 0) {
    $lines = Get-Content $manifestPath
    # Header check
    if ($lines[0] -ne "mediaKey`trelativePath") {
        $errors += "Manifest header must be 'mediaKey[TAB]relativePath'. Found: '$($lines[0])'"
    }

    for ($i = 1; $i -lt $lines.Count; $i++) {
        if ([string]::IsNullOrWhiteSpace($lines[$i])) { continue }
        $parts = $lines[$i].Split("`t")
        if ($parts.Count -lt 2) {
            $errors += "Manifest line $i is malformed: '$($lines[$i])'"
            continue
        }
        $key = $parts[0].Trim()
        $relPath = $parts[1].Trim()
        $manifestKeys[$key] = $relPath
        $manifestPaths += [PSCustomObject]@{ Key = $key; Path = $relPath }
    }
}

# 3. Verify every relativePath in manifest exists locally
Write-Host "Checking manifest files availability..." -ForegroundColor Gray
$missingLocalFiles = @()
foreach ($item in $manifestPaths) {
    $fullPath = Join-Path $mediaFixturesDir $item.Path
    if (-not (Test-Path $fullPath)) {
        $errors += "Local file missing for key '$($item.Key)': $fullPath"
        $missingLocalFiles += $item.Path
    }
}
if ($missingLocalFiles.Count -eq 0) {
    Write-Host "OK: All manifest relativePaths exist locally." -ForegroundColor Green
}

# 4. Verify preview data contains valid mediaKeys from manifest
Write-Host "Verifying categories preview data..." -ForegroundColor Gray
$categoriesContent = Get-Content $categoriesFile -Raw
# Parse all mediaKey: '...' in categories preview data
$categoryBlocks = [regex]::Matches($categoriesContent, "(?s)\{\s*id:\s*'([^']+)'.*?\}")
$categoryIdsWithoutMedia = @()
$missingMediaKeys = @()

foreach ($block in $categoryBlocks) {
    $text = $block.Value
    $id = $block.Groups[1].Value
    # Skip non-category structures (like CATEGORY_TAXONOMY_MAP)
    if ($text -match "domainId" -or $text -match "facetTags") { continue }
    if ($text -notmatch "mediaKey:") {
        $errors += "Category/Subcategory '$id' is missing mediaKey property."
        $categoryIdsWithoutMedia += $id
    } else {
        $mKeyMatch = [regex]::Match($text, "mediaKey:\s*'([^']+)'")
        $mKey = $mKeyMatch.Groups[1].Value
        if (-not $manifestKeys.ContainsKey($mKey)) {
            $errors += "Category/Subcategory '$id' uses mediaKey '$mKey' which is not registered in manifest."
            $missingMediaKeys += $mKey
        }
    }
}

Write-Host "Verifying products preview data..." -ForegroundColor Gray
$productsContent = Get-Content $productsFile -Raw
$productBlocks = [regex]::Matches($productsContent, "(?s)\{\s*id:\s*'([^']+)'.*?\}")
foreach ($block in $productBlocks) {
    $text = $block.Value
    $id = $block.Groups[1].Value
    # Skip other maps/queues
    if ($text -match "requestedBy" -or $text -match "countLabel") { continue }

    # All active store products must have a mediaKey/imageUri
    if ($id -match "^(item-|prd-)") {
        if ($text -notmatch "mediaKey:") {
            $errors += "Product '$id' is missing mediaKey property."
        } else {
            $mKeyMatch = [regex]::Match($text, "mediaKey:\s*'([^']+)'")
            $mKey = $mKeyMatch.Groups[1].Value
            if (-not $manifestKeys.ContainsKey($mKey)) {
                $errors += "Product '$id' uses mediaKey '$mKey' which is not registered in manifest."
            }
        }
    }
}

# 5. Check all surfaces for direct imports/prohibited paths
Write-Host "Scanning surfaces for prohibited image paths or direct requires..." -ForegroundColor Gray
$surfaceDirs = @(
    "dsh/frontend/app-client",
    "dsh/frontend/app-partner",
    "dsh/frontend/app-field",
    "dsh/frontend/control-panel"
)

$prohibitedRefs = @()
foreach ($dir in $surfaceDirs) {
    $fullDir = Join-Path $baseDir $dir
    if (Test-Path $fullDir) {
        $files = Get-ChildItem -Path $fullDir -Recurse -File -Include *.ts, *.tsx, *.js, *.jsx
        foreach ($file in $files) {
            $content = Get-Content $file.FullName -Raw
            # Prohibit direct reference to dsh/media-fixtures or packages/media-fixtures or media-fixtures/logos
            if ($content -match "dsh/media-fixtures" -or $content -match "packages/media-fixtures") {
                $errors += "Prohibited direct reference to media-fixtures in: $($file.FullName)"
                $prohibitedRefs += $file.FullName
            }
            if ($content -match "media-fixtures/logos") {
                $errors += "Prohibited logos/ folder reference in: $($file.FullName) (must use store_logos)"
                $prohibitedRefs += $file.FullName
            }
            # Prohibit direct require of png/jpg/jpeg/webp from media-fixtures
            if ($content.Contains("require(") -and $content.Contains("media-fixtures") -and ($content.Contains(".png") -or $content.Contains(".jpg") -or $content.Contains(".jpeg") -or $content.Contains(".webp"))) {
                $errors += "Prohibited direct require of media file in screen: $($file.FullName)"
                $prohibitedRefs += $file.FullName
            }
        }
    }
}

# Output report
Write-Host "==========================================================" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "PASS: DSH Local-Only Media Fixtures Contract is fully satisfied!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "FAIL: DSH Local-Only Media Fixtures Contract violated!" -ForegroundColor Red
    foreach ($err in $errors) {
        Write-Host " - $err" -ForegroundColor Red
    }
    Write-Host "==========================================================" -ForegroundColor Cyan
    exit 1
}
