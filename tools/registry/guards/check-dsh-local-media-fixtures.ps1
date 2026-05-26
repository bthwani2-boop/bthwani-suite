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
$canonicalFile = Join-Path $baseDir "dsh/frontend/data/canonical.preview-data.ts"
$storesFile = Join-Path $baseDir "dsh/frontend/data/stores.preview-data.ts"
$resolverFile = Join-Path $baseDir "dsh/frontend/shared/resolve-dsh-image-source.ts"

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

# 4. Parse Resolver Keys
Write-Host "Parsing resolver media keys..." -ForegroundColor Gray
$resolverKeys = @()
if (Test-Path $resolverFile) {
    $resolverContent = Get-Content $resolverFile -Raw
    $resolverMatches = [regex]::Matches($resolverContent, "'(dsh\.[^']+)'\s*:\s*require")
    foreach ($match in $resolverMatches) {
        $resolverKeys += $match.Groups[1].Value
    }
}

# Ensure every resolver key is in manifest
foreach ($rKey in $resolverKeys) {
    if (-not $manifestKeys.ContainsKey($rKey)) {
        $errors += "Resolver contains key '$rKey' which is missing from MANIFEST."
    }
}

# Function to extract and check media keys in data files
function Check-DataFileMediaKeys {
    param([string]$FilePath, [string]$FileType)

    if (-not (Test-Path $FilePath)) { return }
    $content = Get-Content $FilePath -Raw
    $matches = [regex]::Matches($content, "mediaKey:\s*'([^']+)'")

    foreach ($match in $matches) {
        $mKey = $match.Groups[1].Value

        if (-not $manifestKeys.ContainsKey($mKey)) {
            $errors += "$FileType file uses mediaKey '$mKey' which is not registered in MANIFEST."
        }
        if ($resolverKeys -notcontains $mKey) {
            $errors += "$FileType file uses mediaKey '$mKey' which is not registered in Resolver."
        }
    }
}

Write-Host "Verifying categories, products, canonical, stores preview data..." -ForegroundColor Gray
Check-DataFileMediaKeys -FilePath $categoriesFile -FileType "Categories"
Check-DataFileMediaKeys -FilePath $productsFile -FileType "Products"
Check-DataFileMediaKeys -FilePath $canonicalFile -FileType "Canonical"
Check-DataFileMediaKeys -FilePath $storesFile -FileType "Stores"

# Ensure all categories have mediaKeys
if (Test-Path $categoriesFile) {
    $categoriesContent = Get-Content $categoriesFile -Raw
    $categoryBlocks = [regex]::Matches($categoriesContent, "(?s)\{\s*id:\s*'([^']+)'.*?\}")
    foreach ($block in $categoryBlocks) {
        $text = $block.Value
        $id = $block.Groups[1].Value
        if ($text -match "domainId" -or $text -match "facetTags" -or $text -match "DSH_CATEGORY_ICONS") { continue }
        if ($text -notmatch "mediaKey:") {
            $errors += "Category/Subcategory '$id' is missing mediaKey property."
        }
    }
}

# Ensure all products have mediaKeys
if (Test-Path $productsFile) {
    $productsContent = Get-Content $productsFile -Raw
    $productBlocks = [regex]::Matches($productsContent, "(?s)\{\s*id:\s*'([^']+)'.*?\}")
    foreach ($block in $productBlocks) {
        $text = $block.Value
        $id = $block.Groups[1].Value
        if ($text -match "requestedBy" -or $text -match "countLabel") { continue }
        if ($id -match "^(item-|prd-)") {
            if ($text -notmatch "mediaKey:") {
                $errors += "Product '$id' is missing mediaKey property."
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
            if ($content -match "dsh/media-fixtures" -or $content -match "packages/media-fixtures") {
                $errors += "Prohibited direct reference to media-fixtures in: $($file.FullName)"
                $prohibitedRefs += $file.FullName
            }
            if ($content -match "(?<!store_)logos/" -or $content -match "media-fixtures/logos") {
                # Ignore references to SVGs or specific non-store logo components if they exist, but generally ban logos/
                if ($content -match "(?<!store_)logos/" -and ($content -match "\.png|\.jpg|\.webp|\.jpeg")) {
                     $errors += "Prohibited logos/ folder reference in: $($file.FullName) (must use store_logos)"
                     $prohibitedRefs += $file.FullName
                }
            }
            if ($content.Contains("require(") -and $content.Contains("media-fixtures") -and ($content.Contains(".png") -or $content.Contains(".jpg") -or $content.Contains(".jpeg") -or $content.Contains(".webp"))) {
                $errors += "Prohibited direct require of media file in screen: $($file.FullName)"
                $prohibitedRefs += $file.FullName
            }
            # Search for adhoc generic paths
            if ($content -match "assets/seed/dsh") {
                $errors += "Prohibited old path 'assets/seed/dsh' in: $($file.FullName)"
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
    # Uniques errors only to avoid huge dumps
    $errors | Select-Object -Unique | ForEach-Object {
        Write-Host " - $_" -ForegroundColor Red
    }
    Write-Host "==========================================================" -ForegroundColor Cyan
    exit 1
}
