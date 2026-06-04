$ErrorActionPreference = 'Stop'
$baseUrl = 'http://localhost:8080'

Write-Host "--- 1. Creating a product ---"
$productBody = @{
    name = "تفاح طازج"
    base_price_label = "١٥ ر.س"
} | ConvertTo-Json -Compress
$productResp = Invoke-RestMethod -Uri "$baseUrl/stores/store-1001/products" -Method Post -Body $productBody -ContentType "application/json" -UseBasicParsing
$productId = $productResp.id
Write-Host "Product Created: ID = $productId, Name = $($productResp.name)"

Write-Host "--- 2. Linking valid media ---"
$mediaBodyValid = @{
    product_id = $productId
    media_key = "dsh.product.apple.v1"
} | ConvertTo-Json -Compress
$mediaResp = Invoke-RestMethod -Uri "$baseUrl/media" -Method Post -Body $mediaBodyValid -ContentType "application/json" -UseBasicParsing
$mediaId = $mediaResp.id
Write-Host "Media Created: ID = $mediaId, Key = $($mediaResp.media_key), URL = $($mediaResp.url)"

Write-Host "--- 3. Testing invalid media key ---"
$mediaBodyInvalid = @{
    product_id = $productId
    media_key = "invalid.key"
} | ConvertTo-Json -Compress
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/media" -Method Post -Body $mediaBodyInvalid -ContentType "application/json" -UseBasicParsing
    Write-Host "ERROR: Expected 400 Bad Request but succeeded!"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
    Write-Host "Expected failure caught: Status = $statusCode, Body = $errorBody"
}

Write-Host "--- 4. Fetching product with media ---"
$getProductResp = Invoke-RestMethod -Uri "$baseUrl/products/$productId" -Method Get -UseBasicParsing
Write-Host "Product retrieved. Media count: $($getProductResp.media.Count)"
foreach ($med in $getProductResp.media) {
    Write-Host "  - Media ID: $($med.id), Key: $($med.media_key), URL: $($med.url)"
}

Write-Host "--- 5. Deleting media ---"
$delResp = Invoke-WebRequest -Uri "$baseUrl/media/$mediaId" -Method Delete -UseBasicParsing
Write-Host "Media Deleted: $mediaId (Status Code: $($delResp.StatusCode))"

Write-Host "--- 6. Verifying media deletion ---"
$getProductRespEmpty = Invoke-RestMethod -Uri "$baseUrl/products/$productId" -Method Get -UseBasicParsing
Write-Host "Product retrieved again. Media count: $($getProductRespEmpty.media.Count)"
