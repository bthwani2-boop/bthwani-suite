$files = @(
  'c:\bthwani-suite\dsh\frontend\app-field\screens\DshFieldStoreVisitScreen.tsx',
  'c:\bthwani-suite\dsh\frontend\app-field\screens\DshFieldStoresScreen.tsx',
  'c:\bthwani-suite\dsh\frontend\app-field\screens\DshFieldStoresHistoryScreen.tsx',
  'c:\bthwani-suite\dsh\frontend\app-field\screens\DshFieldProfileHomeScreen.tsx',
  'c:\bthwani-suite\dsh\frontend\app-field\screens\DshFieldDocumentUploadScreen.tsx',
  'c:\bthwani-suite\dsh\frontend\app-field\screens\DshFieldStoreOnboardingScreen.tsx',
  'c:\bthwani-suite\dsh\frontend\app-field\sections\VisitEvidenceSection.tsx',
  'c:\bthwani-suite\dsh\frontend\app-field\sections\DocumentVerificationSection.tsx',
  'c:\bthwani-suite\dsh\frontend\app-field\parts\FieldStoreCard.tsx',
  'c:\bthwani-suite\wlt\frontend\dsh\app-field\WltDshFieldFinancePreview.tsx'
)

foreach ($f in $files) {
  if (-not (Test-Path $f)) { Write-Host "MISSING: $f"; continue }
  $content = Get-Content $f -Raw -Encoding UTF8
  # Replace paddingVertical={N} as a JSX prop on Box (the pattern <Box ... paddingVertical={N})
  $updated = $content -replace '(<Box\b[^>]*?)\bpaddingVertical=\{(\d+)\}', '$1paddingY={$2}'
  if ($updated -ne $content) {
    Set-Content $f $updated -Encoding UTF8 -NoNewline
    Write-Host "Fixed: $f"
  } else {
    Write-Host "Skip (no change): $f"
  }
}
Write-Host "Done."
