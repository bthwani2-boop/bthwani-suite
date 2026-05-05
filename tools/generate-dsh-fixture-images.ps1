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
        $darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(112, 0, 0, 0))

        $titleFont = New-Object System.Drawing.Font('Segoe UI', [Math]::Max(26, [int]($Height * 0.12)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $subtitleFont = New-Object System.Drawing.Font('Segoe UI', [Math]::Max(14, [int]($Height * 0.05)), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $labelFont = New-Object System.Drawing.Font('Segoe UI', [Math]::Max(12, [int]($Height * 0.035)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

        $format = New-Object System.Drawing.StringFormat
        $format.Alignment = [System.Drawing.StringAlignment]::Near
        $format.LineAlignment = [System.Drawing.StringAlignment]::Near

        $chipRect = New-Object System.Drawing.Rectangle([int]($Width * 0.06), [int]($Height * 0.08), [int]($Width * 0.28), [int]($Height * 0.1))
        $graphics.FillEllipse($softWhiteBrush, $chipRect)

        $titleRect = New-Object System.Drawing.RectangleF([float]($Width * 0.08), [float]($Height * 0.14), [float]($Width * 0.84), [float]($Height * 0.26))
        $subtitleRect = New-Object System.Drawing.RectangleF([float]($Width * 0.08), [float]($Height * 0.41), [float]($Width * 0.84), [float]($Height * 0.16))
        $footerRect = New-Object System.Drawing.RectangleF([float]($Width * 0.08), [float]($Height * 0.78), [float]($Width * 0.84), [float]($Height * 0.12))

        $graphics.DrawString($Title, $titleFont, $whiteBrush, $titleRect, $format)
        $graphics.DrawString($Subtitle, $subtitleFont, $whiteBrush, $subtitleRect, $format)
        $graphics.FillRectangle($softWhiteBrush, [int]($Width * 0.08), [int]($Height * 0.65), [int]($Width * 0.44), 6)
        $graphics.FillRectangle($softWhiteBrush, [int]($Width * 0.08), [int]($Height * 0.71), [int]($Width * 0.34), 6)
        $graphics.DrawString('DSH MEDIA FIXTURE', $labelFont, $whiteBrush, $footerRect, $format)

        $badgeRect = New-Object System.Drawing.Rectangle([int]($Width * 0.72), [int]($Height * 0.67), [int]($Width * 0.18), [int]($Height * 0.18))
        $graphics.FillEllipse($whiteBrush, $badgeRect)
    }
    finally {
        $graphics.Dispose()
        $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
        $bitmap.Dispose()
    }
}

$root = 'C:\bthwani-suite\dsh\media-fixtures\assets\seed\dsh'

$bannerMap = @(
    @{ Name = 'dsh-banner-home-promo-1-v1.png'; Title = 'PROMO 1'; Subtitle = 'First order discount'; Accent = '#f97316'; Accent2 = '#1d4ed8'; Width = 1200; Height = 680 },
    @{ Name = 'dsh-banner-home-promo-2-v1.png'; Title = 'PROMO 2'; Subtitle = 'Live order tracking'; Accent = '#1d4ed8'; Accent2 = '#0f172a'; Width = 1200; Height = 680 },
    @{ Name = 'dsh-banner-home-promo-3-v1.png'; Title = 'PROMO 3'; Subtitle = 'Curated categories'; Accent = '#dc2626'; Accent2 = '#7c3aed'; Width = 1200; Height = 680 },
    @{ Name = 'dsh-banner-home-promo-4-v1.png'; Title = 'PROMO 4'; Subtitle = 'Open the store now'; Accent = '#0f766e'; Accent2 = '#f59e0b'; Width = 1200; Height = 680 },
    @{ Name = 'dsh-banner-home-promo-5-v1.png'; Title = 'PROMO 5'; Subtitle = 'Open the product now'; Accent = '#b91c1c'; Accent2 = '#2563eb'; Width = 1200; Height = 680 },
    @{ Name = 'dsh-banner-home-promo-6-v1.png'; Title = 'PROMO 6'; Subtitle = 'All nearby stores'; Accent = '#16a34a'; Accent2 = '#0f766e'; Width = 1200; Height = 680 },
    @{ Name = 'dsh-banner-home-promo-7-v1.png'; Title = 'PROMO 7'; Subtitle = 'Premium subscription'; Accent = '#7c3aed'; Accent2 = '#f59e0b'; Width = 1200; Height = 680 }
)

$productMap = @(
    @{ Name = 'dsh-product-apple-v1.png'; Title = 'APPLE'; Subtitle = 'Fresh'; Accent = '#ef4444'; Accent2 = '#f97316'; Width = 800; Height = 600 },
    @{ Name = 'dsh-product-bread-v1.png'; Title = 'BREAD'; Subtitle = 'Baked today'; Accent = '#d97706'; Accent2 = '#f59e0b'; Width = 800; Height = 600 },
    @{ Name = 'dsh-product-chicken-v1.png'; Title = 'CHICKEN'; Subtitle = 'Ready to order'; Accent = '#7c2d12'; Accent2 = '#dc2626'; Width = 800; Height = 600 },
    @{ Name = 'dsh-product-choco-v1.png'; Title = 'CHOCO'; Subtitle = 'Sweet pick'; Accent = '#5b21b6'; Accent2 = '#ec4899'; Width = 800; Height = 600 },
    @{ Name = 'dsh-product-croissant-v1.png'; Title = 'CROISSANT'; Subtitle = 'Crispy'; Accent = '#f59e0b'; Accent2 = '#fb7185'; Width = 800; Height = 600 },
    @{ Name = 'dsh-product-milk-v1.png'; Title = 'MILK'; Subtitle = 'Daily staple'; Accent = '#2563eb'; Accent2 = '#38bdf8'; Width = 800; Height = 600 },
    @{ Name = 'dsh-product-pasta-v1.png'; Title = 'PASTA'; Subtitle = 'Hot plate'; Accent = '#0f766e'; Accent2 = '#22c55e'; Width = 800; Height = 600 },
    @{ Name = 'dsh-product-roll-v1.png'; Title = 'ROLL'; Subtitle = 'Quick bite'; Accent = '#be185d'; Accent2 = '#f97316'; Width = 800; Height = 600 },
    @{ Name = 'dsh-product-salad-v1.png'; Title = 'SALAD'; Subtitle = 'Healthy choice'; Accent = '#16a34a'; Accent2 = '#86efac'; Width = 800; Height = 600 },
    @{ Name = 'dsh-product-yogurt-v1.png'; Title = 'YOGURT'; Subtitle = 'Cold and fresh'; Accent = '#1d4ed8'; Accent2 = '#a5f3fc'; Width = 800; Height = 600 }
)

$storeMap = @(
    @{ Name = 'dsh-store-hadda-cover-v1.png'; Title = 'STORE A'; Subtitle = 'Neighborhood store'; Accent = '#dc2626'; Accent2 = '#f97316'; Width = 900; Height = 700 },
    @{ Name = 'dsh-store-hittin-cover-v1.png'; Title = 'STORE B'; Subtitle = 'Visible cover'; Accent = '#1d4ed8'; Accent2 = '#38bdf8'; Width = 900; Height = 700 },
    @{ Name = 'dsh-store-malqa-cover-v1.png'; Title = 'STORE C'; Subtitle = 'Store identity'; Accent = '#7c3aed'; Accent2 = '#f59e0b'; Width = 900; Height = 700 }
)

foreach ($item in $bannerMap) {
    New-SeedImage -Path (Join-Path (Join-Path $root 'banners') $item.Name) -Width $item.Width -Height $item.Height -Title $item.Title -Subtitle $item.Subtitle -Accent $item.Accent -Accent2 $item.Accent2
}

foreach ($item in $productMap) {
    New-SeedImage -Path (Join-Path (Join-Path $root 'products') $item.Name) -Width $item.Width -Height $item.Height -Title $item.Title -Subtitle $item.Subtitle -Accent $item.Accent -Accent2 $item.Accent2
}

foreach ($item in $storeMap) {
    New-SeedImage -Path (Join-Path (Join-Path $root 'stores') $item.Name) -Width $item.Width -Height $item.Height -Title $item.Title -Subtitle $item.Subtitle -Accent $item.Accent -Accent2 $item.Accent2
}
