param()

Add-Type -AssemblyName System.Drawing

function New-SeedImage {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][int]$Width,
        [Parameter(Mandatory = $true)][int]$Height,
        [Parameter(Mandatory = $true)][string]$Title,
        [Parameter(Mandatory = $true)][string]$Subtitle,
        [Parameter(Mandatory = $true)][string]$Accent,
        [Parameter(Mandatory = $true)][string]$Accent2
    )

    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

    try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

        $rect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
        $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            $rect,
            [System.Drawing.ColorTranslator]::FromHtml($Accent),
            [System.Drawing.ColorTranslator]::FromHtml($Accent2),
            35.0
        )
        $graphics.FillRectangle($gradient, $rect)
        $gradient.Dispose()

        # Add a nice semi-transparent circle/ellipse overlays for a modern abstract shape!
        $overlay = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            $rect,
            [System.Drawing.Color]::FromArgb(36, 255, 255, 255),
            [System.Drawing.Color]::FromArgb(18, 0, 0, 0),
            120.0
        )
        $graphics.FillEllipse($overlay, [int]($Width * 0.62), [int]($Height * 0.05), [int]($Width * 0.42), [int]($Height * 0.42))
        $graphics.FillEllipse($overlay, [int]($Width * 0.05), [int]($Height * 0.56), [int]($Width * 0.28), [int]($Height * 0.28))
        $overlay.Dispose()

        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $softWhiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 255, 255, 255))

        $titleFont = New-Object System.Drawing.Font('Segoe UI', [Math]::Max(16, [int]($Height * 0.11)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $subtitleFont = New-Object System.Drawing.Font('Segoe UI', [Math]::Max(10, [int]($Height * 0.045)), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $labelFont = New-Object System.Drawing.Font('Segoe UI', [Math]::Max(9, [int]($Height * 0.035)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

        $format = New-Object System.Drawing.StringFormat
        $format.Alignment = [System.Drawing.StringAlignment]::Near
        $format.LineAlignment = [System.Drawing.StringAlignment]::Near

        $titleRect = New-Object System.Drawing.RectangleF([float]($Width * 0.08), [float]($Height * 0.14), [float]($Width * 0.84), [float]($Height * 0.32))
        $subtitleRect = New-Object System.Drawing.RectangleF([float]($Width * 0.08), [float]($Height * 0.48), [float]($Width * 0.84), [float]($Height * 0.16))
        $footerRect = New-Object System.Drawing.RectangleF([float]($Width * 0.08), [float]($Height * 0.78), [float]($Width * 0.84), [float]($Height * 0.12))

        $graphics.DrawString($Title, $titleFont, $whiteBrush, $titleRect, $format)
        $graphics.DrawString($Subtitle, $subtitleFont, $whiteBrush, $subtitleRect, $format)

        # Draw some decorative glassmorphic bars
        $graphics.FillRectangle($softWhiteBrush, [int]($Width * 0.08), [int]($Height * 0.68), [int]($Width * 0.44), [Math]::Max(2, [int]($Height * 0.01)))
        $graphics.FillRectangle($softWhiteBrush, [int]($Width * 0.08), [int]($Height * 0.73), [int]($Width * 0.34), [Math]::Max(2, [int]($Height * 0.01)))
        $graphics.DrawString('DSH MEDIA FIXTURE', $labelFont, $whiteBrush, $footerRect, $format)

        $badgeRect = New-Object System.Drawing.Rectangle([int]($Width * 0.75), [int]($Height * 0.70), [int]($Width * 0.16), [int]($Height * 0.16))
        $graphics.FillEllipse($whiteBrush, $badgeRect)
    }
    finally {
        $graphics.Dispose()

        # Ensure parent directory exists!
        $parentDir = [System.IO.Path]::GetDirectoryName($Path)
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }

        $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
        $bitmap.Dispose()
    }
}

function Get-Colors {
    param([string]$Key)

    # Specific color mappings for various items
    if ($Key -like "*apple*") { return "#ef4444", "#dc2626" } # Apple Red
    if ($Key -like "*bread*" -or $Key -like "*croissant*") { return "#d97706", "#f59e0b" } # Bakery Orange
    if ($Key -like "*chicken*") { return "#7c2d12", "#dc2626" } # Meat Red/Brown
    if ($Key -like "*milk*" -or $Key -like "*yogurt*") { return "#2563eb", "#38bdf8" } # Dairy Blue
    if ($Key -like "*choco*") { return "#5b21b6", "#ec4899" } # Choco Purple/Pink
    if ($Key -like "*pasta*") { return "#0f766e", "#22c55e" } # Pasta Green/Teal
    if ($Key -like "*salad*") { return "#16a34a", "#86efac" } # Salad Green
    if ($Key -like "*dates*") { return "#d97706", "#f59e0b" } # Dates Gold

    # Categories specific colors
    if ($Key -like "*restaurants*") { return "#ff6b6b", "#ee5253" } # Warm Red
    if ($Key -like "*grocery*") { return "#1dd1a1", "#10ac84" } # Emerald
    if ($Key -like "*sweets*") { return "#ff9ff3", "#f368e0" } # Sweet Pink
    if ($Key -like "*anaqati*") { return "#a29bfe", "#6c5ce7" } # Purple
    if ($Key -like "*wani*") { return "#0A2F5C", "#FF500D" } # Brand colors
    if ($Key -like "*home_projects*") { return "#ffeaa7", "#d63031" } # Orange-Red
    if ($Key -like "*cloud_kitchens*") { return "#ff7675", "#d63031" } # Deep Red
    if ($Key -like "*awnak*") { return "#00dec9", "#00a896" } # Teal
    if ($Key -like "*gas*") { return "#57606f", "#2f3542" } # Slate
    if ($Key -like "*shein*") { return "#ff9ff3", "#f368e0" } # Shein Pink
    if ($Key -like "*spare*") { return "#95afc0", "#535c68" } # Grey
    if ($Key -like "*honey*") { return "#f1c40f", "#f39c12" } # Honey Gold
    if ($Key -like "*electronics*") { return "#70a1ff", "#1e90ff" } # Blue

    # Brand/Cohesive default palette selection based on Hash
    $palettes = @(
        @("#0A2F5C", "#FF500D"), # Brand Blue & Orange
        @("#0A2F5C", "#00cec9"), # Deep Blue & Teal
        @("#6c5ce7", "#a29bfe"), # Indigo & Lavender
        @("#00b894", "#55efc4"), # Mint & Teal
        @("#e84393", "#fd79a8"), # Pink & Rose
        @("#d63031", "#ff7675"), # Red & Coral
        @("#e17055", "#fab1a0"), # Orange & Peach
        @("#0984e3", "#74b9ff"), # Sky Blue & Blue
        @("#2d3436", "#636e72")  # Charcoal & Slate
    )

    $hash = [Math]::Abs($Key.GetHashCode())
    $index = $hash % $palettes.Count
    return $palettes[$index][0], $palettes[$index][1]
}

function Get-TitleAndSubtitle {
    param(
        [string]$Key,
        [string]$RelPath
    )

    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($RelPath)

    # Clean up name: remove common prefix/suffix
    $clean = $fileName
    $clean = $clean -replace '^dsh-product-', ''
    $clean = $clean -replace '^dsh-category-main-', ''
    $clean = $clean -replace '^dsh-category-sub-', ''
    $clean = $clean -replace '^dsh-store-', ''
    $clean = $clean -replace '-v\d+$', ''
    $clean = $clean -replace '-cover$', ''
    $clean = $clean -replace '-logo$', ''
    $clean = $clean -replace '_', ' '
    $clean = $clean -replace '-', ' '

    # Capitalize first letter of each word
    $textInfo = (Get-Culture).TextInfo
    $title = $textInfo.ToTitleCase($clean.ToLower())

    # Determine Subtitle based on directory/key
    $subtitle = "DSH FIXTURE"
    if ($RelPath -like "products/*") { $subtitle = "PRODUCT" }
    elseif ($RelPath -like "banners/*") { $subtitle = "PROMO BANNER" }
    elseif ($RelPath -like "stores/*") { $subtitle = "STORE COVER" }
    elseif ($RelPath -like "store_logos/*") { $subtitle = "STORE LOGO" }
    elseif ($RelPath -like "categories/main/*") { $subtitle = "CATEGORY" }
    elseif ($RelPath -like "categories/sub/*") { $subtitle = "SUBCATEGORY" }

    # Specific adjustments
    if ($fileName -eq "brand-logo") {
        $title = "BThwani"
        $subtitle = "BRAND LOGO"
    }

    return $title, $subtitle
}

$root = 'C:\bthwani-suite\dsh\frontend\media-fixtures'
$manifestPath = Join-Path $root 'MANIFEST.local-required.tsv'

if (-not (Test-Path $manifestPath)) {
    Write-Error "Could not find manifest at $manifestPath"
    exit 1
}

$lines = Get-Content $manifestPath
Write-Host "Starting seed image generation from manifest..." -ForegroundColor Cyan
Write-Host "Total entries: $($lines.Count - 1)" -ForegroundColor Cyan

$count = 0
for ($i = 1; $i -lt $lines.Count; $i++) {
    if ([string]::IsNullOrWhiteSpace($lines[$i])) { continue }
    $parts = $lines[$i].Split("`t")
    if ($parts.Count -lt 2) { continue }

    $key = $parts[0].Trim()
    $relPath = $parts[1].Trim()
    $fullPath = Join-Path $root $relPath

    # 1. Determine width and height
    $width = 400
    $height = 400
    if ($relPath -like "banners/*") {
        $width = 1200
        $height = 680
    } elseif ($relPath -like "products/*") {
        $width = 800
        $height = 600
    } elseif ($relPath -like "stores/*") {
        $width = 900
        $height = 700
    } elseif ($relPath -like "store_logos/*") {
        $width = 400
        $height = 400
    } elseif ($relPath -like "categories/*") {
        $width = 200
        $height = 200
    }

    # 2. Get beautiful colors
    $accent, $accent2 = Get-Colors -Key $key

    # 3. Get title and subtitle
    $title, $subtitle = Get-TitleAndSubtitle -Key $key -RelPath $relPath

    # 4. Generate the image
    Write-Host "Generating: [$key] -> $relPath ($title | $subtitle)" -ForegroundColor Gray
    New-SeedImage -Path $fullPath -Width $width -Height $height -Title $title -Subtitle $subtitle -Accent $accent -Accent2 $accent2
    $count++
}

Write-Host "Success: $count seed images generated and saved to media-fixtures!" -ForegroundColor Green
