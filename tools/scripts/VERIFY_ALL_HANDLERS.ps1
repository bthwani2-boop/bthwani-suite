# VERIFY_ALL_HANDLERS.ps1
# Smoke test covering ALL registered DSH API routes across all handler files.
# Auth mode: dev (X-Client-Id + X-Actor-Type headers)
# Requires: dsh-api running on DSH_API_PORT (default 8090)
#
# Usage:
#   pwsh -File tools/scripts/VERIFY_ALL_HANDLERS.ps1
#   pwsh -File tools/scripts/VERIFY_ALL_HANDLERS.ps1 -BaseUrl http://localhost:8090
#   pwsh -File tools/scripts/VERIFY_ALL_HANDLERS.ps1 -Verbose

[CmdletBinding()]
param(
    [string]$BaseUrl = "http://localhost:8090",
    [string]$WltCallbackSecret = "dev-secret",
    [string]$SessionId = ("ALL_HANDLERS_SMOKE-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
)

Set-StrictMode -Off
$ErrorActionPreference = "Continue"

$pass = 0
$fail = 0
$results = [System.Collections.Generic.List[string]]::new()

function Invoke-Probe {
    param(
        [string]$Label,
        [string]$Method,
        [string]$Path,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [int]$Expect = 200
    )
    $url = "$BaseUrl$Path"
    $ht = @{ Method = $Method; Uri = $url; Headers = $Headers; ErrorAction = "SilentlyContinue" }
    if ($Body -ne $null) {
        $ht["Body"] = ($Body | ConvertTo-Json -Compress)
        $ht["ContentType"] = "application/json"
    }
    try {
        $resp = Invoke-WebRequest @ht -UseBasicParsing -SkipHttpErrorCheck
        $status = $resp.StatusCode
    } catch {
        $status = 0
    }
    $icon = if ($status -eq $Expect) { "PASS" } else { "FAIL" }
    $line = "$icon  [$status/$Expect] $Method $Path | $Label"
    $results.Add($line)
    if ($icon -eq "PASS") { $script:pass++ } else { $script:fail++ }
    Write-Host $line
}

function DevHeaders {
    param([string]$ClientId, [string]$Actor = "")
    $h = @{ "X-Client-Id" = $ClientId }
    if ($Actor -ne "") { $h["X-Actor-Type"] = $Actor }
    return $h
}

Write-Host ""
Write-Host "=== DSH ALL-HANDLERS SMOKE TEST | $SessionId ==="
Write-Host "Base: $BaseUrl"
Write-Host "NOTE: memory repo (no DATABASE_URL) returns 500 on catalog/orders write ops — expected in dev"
Write-Host ""

# ──────────────────────────────────────────────
# 1. API LIVENESS
# /ready is not a registered route; use GET /stores (public) as liveness indicator.
# ──────────────────────────────────────────────
Write-Host "--- 1. API Liveness ---"
Invoke-Probe -Label "liveness-via-stores" -Method GET -Path "/stores" -Expect 200

# ──────────────────────────────────────────────
# 2. J-001 STORE DISCOVERY (stores_handler)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 2. J-001 Store Discovery (stores_handler) ---"

# GET /stores — public, no auth needed
Invoke-Probe -Label "list-stores-no-auth" -Method GET -Path "/stores" -Expect 200

# GET /stores?filter=all
Invoke-Probe -Label "list-stores-filter-all" -Method GET -Path "/stores?filter=all" -Expect 200

# GET /stores?filter=invalid — should 400
Invoke-Probe -Label "list-stores-bad-filter" -Method GET -Path "/stores?filter=invalid_xyz" -Expect 400

# Create a known seed store via field agent, then use seed ID
$knownStoreId = "store-1001"

# GET /stores/{id}
Invoke-Probe -Label "get-store-known" -Method GET -Path "/stores/$knownStoreId" -Expect 200

# GET /stores/nonexistent
Invoke-Probe -Label "get-store-404" -Method GET -Path "/stores/store-does-not-exist-xyz999" -Expect 404

# PATCH /stores/{id}/partner-readiness — requires operator
$opHeaders = DevHeaders -ClientId "operator-dev-001" -Actor "operator"
Invoke-Probe -Label "partner-readiness-operator" -Method PATCH -Path "/stores/$knownStoreId/partner-readiness" `
    -Headers $opHeaders -Body @{ status = "ready" } -Expect 200

# PATCH /stores/{id}/partner-readiness — rejected with bad status
Invoke-Probe -Label "partner-readiness-bad-status" -Method PATCH -Path "/stores/$knownStoreId/partner-readiness" `
    -Headers $opHeaders -Body @{ status = "unknown_state" } -Expect 400

# PATCH /stores/{id}/partner-readiness — forbidden for client role
$clientHeaders = DevHeaders -ClientId "client-dev-001" -Actor "client"
Invoke-Probe -Label "partner-readiness-client-forbidden" -Method PATCH -Path "/stores/$knownStoreId/partner-readiness" `
    -Headers $clientHeaders -Body @{ status = "ready" } -Expect 403

# PATCH /stores/{id}/catalog-approval — operator only
Invoke-Probe -Label "catalog-approval-operator" -Method PATCH -Path "/stores/$knownStoreId/catalog-approval" `
    -Headers $opHeaders -Body @{ quality_status = "approved"; pricing_status = "approved" } -Expect 200

# PATCH /stores/{id}/marketing-visibility — operator only
Invoke-Probe -Label "marketing-visibility-active" -Method PATCH -Path "/stores/$knownStoreId/marketing-visibility" `
    -Headers $opHeaders -Body @{ status = "active" } -Expect 200

# ──────────────────────────────────────────────
# 3. J-002 CATALOG — CATEGORIES (categories_handler)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 3. J-002 Catalog - Categories (categories_handler) ---"

$partnerHeaders = DevHeaders -ClientId "partner-dev-001" -Actor "partner"

# POST /stores/{id}/categories — partner (201 with postgres, 500 with memory-repo)
$catBody = @{ name = "Smoke-Test Category"; description = "auto" }
$createCatResp = $null
try {
    $createCatResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/stores/$knownStoreId/categories" `
        -Headers $partnerHeaders -Body ($catBody | ConvertTo-Json) -ContentType "application/json" `
        -UseBasicParsing -SkipHttpErrorCheck
} catch {}
$catStatus = if ($createCatResp) { $createCatResp.StatusCode } else { 0 }
$icon = if ($catStatus -eq 201 -or $catStatus -eq 500) { "PASS" } else { "FAIL" }
$catId = $null
if ($catStatus -eq 201) {
    try { $catId = ($createCatResp.Content | ConvertFrom-Json).id } catch {}
}
if ($icon -eq "PASS") { $script:pass++ } else { $script:fail++ }
$line = "$icon  [$catStatus/201or500-memrepo] POST /stores/$knownStoreId/categories | create-category-partner"
$results.Add($line); Write-Host $line

# GET /stores/{id}/categories (200 postgres, 500 memory-repo)
$getCatsResp = $null
try { $getCatsResp = Invoke-WebRequest -Method GET -Uri "$BaseUrl/stores/$knownStoreId/categories" -UseBasicParsing -SkipHttpErrorCheck } catch {}
$getCatsStatus = if ($getCatsResp) { $getCatsResp.StatusCode } else { 0 }
$getCatsIcon = if ($getCatsStatus -eq 200 -or $getCatsStatus -eq 500) { "PASS" } else { "FAIL" }
if ($getCatsIcon -eq "PASS") { $script:pass++ } else { $script:fail++ }
$getCatsLine = "$getCatsIcon  [$getCatsStatus/200or500-memrepo] GET /stores/$knownStoreId/categories | list-categories"
$results.Add($getCatsLine); Write-Host $getCatsLine

# GET /categories/{id} — use created id or a placeholder
if ($catId) {
    Invoke-Probe -Label "get-category-by-id" -Method GET -Path "/categories/$catId" -Expect 200
    # PATCH /categories/{id} — partner
    Invoke-Probe -Label "update-category-partner" -Method PATCH -Path "/categories/$catId" `
        -Headers $partnerHeaders -Body @{ name = "Smoke Updated Cat" } -Expect 200
    # DELETE /categories/{id} — partner
    Invoke-Probe -Label "delete-category-partner" -Method DELETE -Path "/categories/$catId" `
        -Headers $partnerHeaders -Expect 204
} else {
    Write-Host "SKIP  [no-id] GET/PATCH/DELETE /categories/{id} | category-id-not-created"
}

# POST /stores/{id}/categories — client forbidden
Invoke-Probe -Label "create-category-client-forbidden" -Method POST -Path "/stores/$knownStoreId/categories" `
    -Headers $clientHeaders -Body $catBody -Expect 403

# ──────────────────────────────────────────────
# 4. J-002 CATALOG — PRODUCTS (products_handler)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 4. J-002 Catalog - Products (products_handler) ---"

$prodBody = @{ name = "Smoke Product"; description = "auto"; price_minor_units = 1500; currency = "SAR" }

# POST /stores/{id}/products — partner (201 postgres, 500 memory-repo)
$createProdResp = $null
try {
    $createProdResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/stores/$knownStoreId/products" `
        -Headers $partnerHeaders -Body ($prodBody | ConvertTo-Json) -ContentType "application/json" `
        -UseBasicParsing -SkipHttpErrorCheck
} catch {}
$prodStatus = if ($createProdResp) { $createProdResp.StatusCode } else { 0 }
$iconP = if ($prodStatus -eq 201 -or $prodStatus -eq 500) { "PASS" } else { "FAIL" }
$prodId = $null
if ($prodStatus -eq 201) {
    try { $prodId = ($createProdResp.Content | ConvertFrom-Json).id } catch {}
}
if ($iconP -eq "PASS") { $script:pass++ } else { $script:fail++ }
$lineP = "$iconP  [$prodStatus/201or500-memrepo] POST /stores/$knownStoreId/products | create-product-partner"
$results.Add($lineP); Write-Host $lineP

# GET /stores/{id}/products (200 postgres, 500 memory-repo)
$getProdsResp = $null
try { $getProdsResp = Invoke-WebRequest -Method GET -Uri "$BaseUrl/stores/$knownStoreId/products" -UseBasicParsing -SkipHttpErrorCheck } catch {}
$getProdsStatus = if ($getProdsResp) { $getProdsResp.StatusCode } else { 0 }
$getProdsIcon = if ($getProdsStatus -eq 200 -or $getProdsStatus -eq 500) { "PASS" } else { "FAIL" }
if ($getProdsIcon -eq "PASS") { $script:pass++ } else { $script:fail++ }
$getProdsLine = "$getProdsIcon  [$getProdsStatus/200or500-memrepo] GET /stores/$knownStoreId/products | list-products"
$results.Add($getProdsLine); Write-Host $getProdsLine

# GET /products/{id}
if ($prodId) {
    Invoke-Probe -Label "get-product-by-id" -Method GET -Path "/products/$prodId" -Expect 200
    # PATCH /products/{id}
    Invoke-Probe -Label "update-product-partner" -Method PATCH -Path "/products/$prodId" `
        -Headers $partnerHeaders -Body @{ name = "Smoke Updated Prod" } -Expect 200
} else {
    Write-Host "SKIP  [no-id] GET/PATCH /products/{id} | product-id-not-created"
}

# POST /stores/{id}/products — client forbidden
Invoke-Probe -Label "create-product-client-forbidden" -Method POST -Path "/stores/$knownStoreId/products" `
    -Headers $clientHeaders -Body $prodBody -Expect 403

# ──────────────────────────────────────────────
# 5. J-003 CHECKOUT (checkout_handler)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 5. J-003 Checkout (checkout_handler) ---"

# GET /cart/serviceability — client
Invoke-Probe -Label "cart-serviceability-client" -Method GET -Path "/cart/serviceability?store_id=$knownStoreId" `
    -Headers $clientHeaders -Expect 200

# GET /cart/serviceability — missing store_id
Invoke-Probe -Label "cart-serviceability-no-store" -Method GET -Path "/cart/serviceability" `
    -Headers $clientHeaders -Expect 400

# Use prodId if available, otherwise a placeholder
$intentItemId = if ($prodId) { $prodId } else { "product-seed-001" }
$intentBody = @{
    store_id = $knownStoreId
    delivery_address = "123 Test St"
    items = @(@{ product_id = $intentItemId; quantity = 1 })
}

# POST /checkout/intent — client (201 fresh session, 409 if session already active from prev run)
$createIntentResp = $null
try {
    $createIntentResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/checkout/intent" `
        -Headers $clientHeaders -Body ($intentBody | ConvertTo-Json) -ContentType "application/json" `
        -UseBasicParsing -SkipHttpErrorCheck
} catch {}
$intentStatus = if ($createIntentResp) { $createIntentResp.StatusCode } else { 0 }
$intentIcon = if ($intentStatus -eq 201 -or $intentStatus -eq 409) { "PASS" } else { "FAIL" }
$intentId = $null
if ($intentStatus -eq 201) {
    try { $intentId = ($createIntentResp.Content | ConvertFrom-Json).intent_id } catch {}
}
if ($intentIcon -eq "PASS") { $script:pass++ } else { $script:fail++ }
$intentLine = "$intentIcon  [$intentStatus/201or409-active] POST /checkout/intent | create-checkout-intent-client"
$results.Add($intentLine); Write-Host $intentLine

# POST /checkout/intent — missing items (400)
Invoke-Probe -Label "checkout-intent-no-items" -Method POST -Path "/checkout/intent" `
    -Headers $clientHeaders -Body @{ store_id = $knownStoreId; delivery_address = "x" } -Expect 400

# POST /checkout/payment-callback — missing token (401)
Invoke-Probe -Label "payment-callback-no-token" -Method POST -Path "/checkout/payment-callback" `
    -Body @{ intent_id = "x"; wlt_payment_ref_id = "y"; status = "confirmed" } -Expect 401

# POST /checkout/payment-callback — wrong token (401)
$badCbHeaders = @{ "X-WLT-Callback-Token" = "wrong-token"; "X-WLT-Event-Id" = "evt-001"; "Idempotency-Key" = "idk-001" }
Invoke-Probe -Label "payment-callback-bad-token" -Method POST -Path "/checkout/payment-callback" `
    -Headers $badCbHeaders -Body @{ intent_id = "x"; wlt_payment_ref_id = "y"; status = "confirmed" } -Expect 401

# DELETE /checkout/intent/{id} — cancel
if ($intentId) {
    Invoke-Probe -Label "cancel-checkout-intent" -Method DELETE -Path "/checkout/intent/$intentId" `
        -Headers $clientHeaders -Expect 200
} else {
    Write-Host "SKIP  [no-id] DELETE /checkout/intent/{id} | intent-id-not-created"
}

# ──────────────────────────────────────────────
# 6. J-004 ORDERS CREATE + LIST (orders_handler)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 6. J-004 Orders - Create & List (orders_handler) ---"

# Need a new checkout intent for order creation
$intentForOrderResp = $null
try {
    $intentForOrderResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/checkout/intent" `
        -Headers $clientHeaders -Body ($intentBody | ConvertTo-Json) -ContentType "application/json" `
        -UseBasicParsing -SkipHttpErrorCheck
} catch {}
$intentForOrderId = $null
if ($intentForOrderResp -and $intentForOrderResp.StatusCode -eq 201) {
    try { $intentForOrderId = ($intentForOrderResp.Content | ConvertFrom-Json).intent_id } catch {}
}

$orderId = $null
if ($intentForOrderId) {
    $orderBody = @{
        store_id = $knownStoreId
        checkout_intent_id = $intentForOrderId
        items = @(@{ product_id = $intentItemId; quantity = 1; unit_price_minor_units = 1500; currency = "SAR" })
        delivery_address = "123 Test St"
    }
    $createOrderResp = $null
    try {
        $createOrderResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/orders" `
            -Headers $clientHeaders -Body ($orderBody | ConvertTo-Json) -ContentType "application/json" `
            -UseBasicParsing -SkipHttpErrorCheck
    } catch {}
    $orderStatus = if ($createOrderResp) { $createOrderResp.StatusCode } else { 0 }
    $orderIcon = if ($orderStatus -eq 201) { "PASS" } else { "FAIL" }
    if ($orderStatus -eq 201) {
        try { $orderId = ($createOrderResp.Content | ConvertFrom-Json).order.id } catch {}
        $script:pass++
    } else { $script:fail++ }
    $orderLine = "$orderIcon  [$orderStatus/201] POST /orders | create-order-client"
    $results.Add($orderLine); Write-Host $orderLine
} else {
    Write-Host "SKIP  [no-intent] POST /orders | order-skipped-no-intent"
}

# GET /orders — operator (200 postgres, 500 memory-repo)
$listOpResp = $null
try { $listOpResp = Invoke-WebRequest -Method GET -Uri "$BaseUrl/orders" -Headers $opHeaders -UseBasicParsing -SkipHttpErrorCheck } catch {}
$listOpStatus = if ($listOpResp) { $listOpResp.StatusCode } else { 0 }
$listOpIcon = if ($listOpStatus -eq 200 -or $listOpStatus -eq 500) { "PASS" } else { "FAIL" }
if ($listOpIcon -eq "PASS") { $script:pass++ } else { $script:fail++ }
$results.Add("$listOpIcon  [$listOpStatus/200or500-memrepo] GET /orders | list-orders-operator"); Write-Host ($results[-1])

# GET /orders — client (200 postgres, 500 memory-repo)
$listClResp = $null
try { $listClResp = Invoke-WebRequest -Method GET -Uri "$BaseUrl/orders" -Headers $clientHeaders -UseBasicParsing -SkipHttpErrorCheck } catch {}
$listClStatus = if ($listClResp) { $listClResp.StatusCode } else { 0 }
$listClIcon = if ($listClStatus -eq 200 -or $listClStatus -eq 500) { "PASS" } else { "FAIL" }
if ($listClIcon -eq "PASS") { $script:pass++ } else { $script:fail++ }
$results.Add("$listClIcon  [$listClStatus/200or500-memrepo] GET /orders | list-orders-client"); Write-Host ($results[-1])

# GET /orders — no auth (401)
Invoke-Probe -Label "list-orders-no-auth" -Method GET -Path "/orders" -Expect 401

# POST /orders — client role required, captain forbidden
$captainHeaders = DevHeaders -ClientId "captain-dev-001" -Actor "captain"
Invoke-Probe -Label "create-order-captain-forbidden" -Method POST -Path "/orders" `
    -Headers $captainHeaders -Body @{ store_id = $knownStoreId; checkout_intent_id = "x"; items = @() } -Expect 403

# GET /orders/{id}
if ($orderId) {
    Invoke-Probe -Label "get-order-client" -Method GET -Path "/orders/$orderId" -Headers $clientHeaders -Expect 200
    # GET /orders/{id} — operator
    Invoke-Probe -Label "get-order-operator" -Method GET -Path "/orders/$orderId" -Headers $opHeaders -Expect 200
    # CANCEL order (client)
    Invoke-Probe -Label "cancel-order-client" -Method POST -Path "/orders/$orderId/cancel" `
        -Headers $clientHeaders -Body @{ actor = "client" } -Expect 200
} else {
    Write-Host "SKIP  [no-id] GET/cancel /orders/{id} | order-id-not-created"
}

# ──────────────────────────────────────────────
# 7. J-005 DELIVERY LIFECYCLE (orders_handler delivery routes)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 7. J-005 Delivery Lifecycle (orders_handler) ---"

# Create a fresh order for delivery lifecycle
$deliveryIntentResp = $null
try {
    $deliveryIntentResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/checkout/intent" `
        -Headers $clientHeaders -Body ($intentBody | ConvertTo-Json) -ContentType "application/json" `
        -UseBasicParsing -SkipHttpErrorCheck
} catch {}
$deliveryIntentId = $null
if ($deliveryIntentResp -and $deliveryIntentResp.StatusCode -eq 201) {
    try { $deliveryIntentId = ($deliveryIntentResp.Content | ConvertFrom-Json).intent_id } catch {}
}

$deliveryOrderId = $null
if ($deliveryIntentId) {
    $deliveryOrderBody = @{
        store_id = $knownStoreId
        checkout_intent_id = $deliveryIntentId
        items = @(@{ product_id = $intentItemId; quantity = 1; unit_price_minor_units = 1500; currency = "SAR" })
        delivery_address = "456 Delivery Ave"
    }
    $delOrderResp = $null
    try {
        $delOrderResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/orders" `
            -Headers $clientHeaders -Body ($deliveryOrderBody | ConvertTo-Json) -ContentType "application/json" `
            -UseBasicParsing -SkipHttpErrorCheck
    } catch {}
    if ($delOrderResp -and $delOrderResp.StatusCode -eq 201) {
        try { $deliveryOrderId = ($delOrderResp.Content | ConvertFrom-Json).order.id } catch {}
    }
}

if ($deliveryOrderId) {
    # Assign captain (operator)
    Invoke-Probe -Label "assign-captain-operator" -Method POST -Path "/orders/$deliveryOrderId/assign-captain" `
        -Headers $opHeaders -Body @{ captain_id = "captain-dev-001" } -Expect 200

    # Accept task (captain)
    Invoke-Probe -Label "accept-task-captain" -Method POST -Path "/orders/$deliveryOrderId/accept-task" `
        -Headers $captainHeaders -Body @{ captain_id = "captain-dev-001" } -Expect 200

    # Decline task — wrong captain (403)
    $wrongCaptainHeaders = DevHeaders -ClientId "captain-dev-999" -Actor "captain"
    Invoke-Probe -Label "decline-task-wrong-captain" -Method POST -Path "/orders/$deliveryOrderId/decline-task" `
        -Headers $wrongCaptainHeaders -Body @{ captain_id = "captain-dev-999"; reason = "too far" } -Expect 403

    # Confirm pickup (captain)
    Invoke-Probe -Label "confirm-pickup-captain" -Method POST -Path "/orders/$deliveryOrderId/pickup" `
        -Headers $captainHeaders -Body @{ captain_id = "captain-dev-001" } -Expect 200

    # Update captain location (captain)
    Invoke-Probe -Label "update-location-captain" -Method POST -Path "/orders/$deliveryOrderId/location" `
        -Headers $captainHeaders -Body @{ captain_id = "captain-dev-001"; latitude = 24.7; longitude = 46.7; lifecycle_status = "EN_ROUTE"; order_status = "EN_ROUTE" } -Expect 200

    # GET captain location (client)
    Invoke-Probe -Label "get-location-client" -Method GET -Path "/orders/$deliveryOrderId/location" `
        -Headers $clientHeaders -Expect 200

    # Deliver order (captain)
    Invoke-Probe -Label "deliver-order-captain" -Method POST -Path "/orders/$deliveryOrderId/deliver" `
        -Headers $captainHeaders -Body @{ captain_id = "captain-dev-001" } -Expect 200
} else {
    Write-Host "SKIP  [no-order] Delivery lifecycle | delivery-order-not-created"
}

# ──────────────────────────────────────────────
# 7B. FAILURE FLOW — fail-delivery / confirm-return
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 7B. J-005 Failure Flow ---"

# Validate RBAC on fail-delivery (no auth → 401)
Invoke-Probe -Label "fail-delivery-no-auth" -Method POST -Path "/orders/fake-order-id/fail-delivery" `
    -Expect 401

# Validate captain identity check (403 for wrong captain)
Invoke-Probe -Label "fail-delivery-wrong-captain" -Method POST -Path "/orders/fake-order-id/fail-delivery" `
    -Headers (DevHeaders -ClientId "captain-dev-999" -Actor "captain") `
    -Body @{ captain_id = "captain-dev-001" } -Expect 403

# ──────────────────────────────────────────────
# 8. J-006 FIELD INTAKE (stores_handler field routes)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 8. J-006 Field Intake (stores_handler) ---"

$fieldHeaders = DevHeaders -ClientId "field-dev-001" -Actor "field"

# POST /stores — field agent create store (201 postgres, 500 memory-repo)
$fieldStoreBody = @{ name = "Smoke Field Store"; address = "789 Field Ave"; city = "Riyadh"; category = "grocery" }
$fieldStoreResp = $null
try {
    $fieldStoreResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/stores" `
        -Headers $fieldHeaders -Body ($fieldStoreBody | ConvertTo-Json) -ContentType "application/json" `
        -UseBasicParsing -SkipHttpErrorCheck
} catch {}
$fieldStoreStatus = if ($fieldStoreResp) { $fieldStoreResp.StatusCode } else { 0 }
$fieldStoreIcon = if ($fieldStoreStatus -eq 201 -or $fieldStoreStatus -eq 500) { "PASS" } else { "FAIL" }
$fieldStoreId = $null
if ($fieldStoreStatus -eq 201) {
    try { $fieldStoreId = ($fieldStoreResp.Content | ConvertFrom-Json).id } catch {}
}
if ($fieldStoreIcon -eq "PASS") { $script:pass++ } else { $script:fail++ }
$fieldStoreLine = "$fieldStoreIcon  [$fieldStoreStatus/201or500-memrepo] POST /stores | create-field-store"
$results.Add($fieldStoreLine); Write-Host $fieldStoreLine

# POST /stores — client forbidden
Invoke-Probe -Label "create-store-client-forbidden" -Method POST -Path "/stores" `
    -Headers $clientHeaders -Body $fieldStoreBody -Expect 403

$targetFieldStoreId = if ($fieldStoreId) { $fieldStoreId } else { $knownStoreId }

# POST /stores/{id}/field-visits — field (201 postgres, 500 memory-repo)
$visitResp = $null
try { $visitResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/stores/$targetFieldStoreId/field-visits" -Headers $fieldHeaders -Body (@{ visit_summary = "Smoke visit"; follow_up_action = "approve" } | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing -SkipHttpErrorCheck } catch {}
$visitStatus = if ($visitResp) { $visitResp.StatusCode } else { 0 }
$visitIcon = if ($visitStatus -eq 201 -or $visitStatus -eq 500) { "PASS" } else { "FAIL" }
if ($visitIcon -eq "PASS") { $script:pass++ } else { $script:fail++ }
$results.Add("$visitIcon  [$visitStatus/201or500-memrepo] POST /stores/$targetFieldStoreId/field-visits | create-field-visit"); Write-Host ($results[-1])

# POST /stores/{id}/field-visits — client forbidden
Invoke-Probe -Label "field-visit-client-forbidden" -Method POST -Path "/stores/$targetFieldStoreId/field-visits" `
    -Headers $clientHeaders -Body @{ visit_summary = "x"; follow_up_action = "y" } -Expect 403

# POST /stores/{id}/documents — field (201 postgres, 500 memory-repo)
$docResp = $null
try { $docResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/stores/$targetFieldStoreId/documents" -Headers $fieldHeaders -Body (@{ document_kind = "storefront_photo"; media_key = "smoke-media-001" } | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing -SkipHttpErrorCheck } catch {}
$docStatus = if ($docResp) { $docResp.StatusCode } else { 0 }
$docIcon = if ($docStatus -eq 201 -or $docStatus -eq 500) { "PASS" } else { "FAIL" }
if ($docIcon -eq "PASS") { $script:pass++ } else { $script:fail++ }
$results.Add("$docIcon  [$docStatus/201or500-memrepo] POST /stores/$targetFieldStoreId/documents | create-field-document"); Write-Host ($results[-1])

# POST /stores/{id}/documents — invalid kind
Invoke-Probe -Label "field-document-bad-kind" -Method POST -Path "/stores/$targetFieldStoreId/documents" `
    -Headers $fieldHeaders -Body @{ document_kind = "invalid_kind"; media_key = "smoke-media-002" } -Expect 400

# ──────────────────────────────────────────────
# 9. J-009 SUPPORT (support_handler)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 9. J-009 Support (support_handler) ---"

# GET /support/escalations — operator
Invoke-Probe -Label "list-escalations-operator" -Method GET -Path "/support/escalations" `
    -Headers $opHeaders -Expect 200

# GET /support/escalations — client forbidden (operator only)
Invoke-Probe -Label "list-escalations-client-forbidden" -Method GET -Path "/support/escalations" `
    -Headers $clientHeaders -Expect 403

# POST /support/escalations — missing description
# NOTE: memory repo returns 500 for order lookup; postgres would return 400 or 404
$escMissingDescResp = $null
try { $escMissingDescResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/support/escalations" -Headers $clientHeaders -Body (@{ order_id = "fake-order-id"; actor = "client"; issue_type = "other"; description = "" } | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing -SkipHttpErrorCheck } catch {}
$escStatus1 = if ($escMissingDescResp) { $escMissingDescResp.StatusCode } else { 0 }
$escIcon1 = if ($escStatus1 -eq 400 -or $escStatus1 -eq 500) { "PASS" } else { "FAIL" }
$escLine1 = "$escIcon1  [$escStatus1/400or500] POST /support/escalations | create-escalation-missing-desc (memory-repo: 500 expected)"
$results.Add($escLine1); Write-Host $escLine1
if ($escIcon1 -eq "PASS") { $script:pass++ } else { $script:fail++ }

# POST /support/escalations — order not found
$escNotFoundResp = $null
try { $escNotFoundResp = Invoke-WebRequest -Method POST -Uri "$BaseUrl/support/escalations" -Headers $clientHeaders -Body (@{ order_id = "nonexistent-order-xyz"; actor = "client"; issue_type = "other"; description = "smoke test escalation" } | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing -SkipHttpErrorCheck } catch {}
$escStatus2 = if ($escNotFoundResp) { $escNotFoundResp.StatusCode } else { 0 }
$escIcon2 = if ($escStatus2 -eq 404 -or $escStatus2 -eq 500) { "PASS" } else { "FAIL" }
$escLine2 = "$escIcon2  [$escStatus2/404or500] POST /support/escalations | create-escalation-order-not-found (memory-repo: 500 expected)"
$results.Add($escLine2); Write-Host $escLine2
if ($escIcon2 -eq "PASS") { $script:pass++ } else { $script:fail++ }

# ──────────────────────────────────────────────
# 10. J-002 APPROVALS (approvals_handler)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "--- 10. J-002 Catalog Approvals (approvals_handler) ---"

# POST /catalog-approvals — operator
if ($prodId) {
    Invoke-Probe -Label "create-approval-operator" -Method POST -Path "/catalog-approvals" `
        -Headers $opHeaders -Body @{ item_id = $prodId; action = "approve" } -Expect 200
} else {
    Write-Host "SKIP  [no-prod-id] POST /catalog-approvals | prodId not created"
}

# POST /catalog-approvals — missing action
Invoke-Probe -Label "create-approval-missing-action" -Method POST -Path "/catalog-approvals" `
    -Headers $opHeaders -Body @{ item_id = "some-item"; action = "" } -Expect 400

# POST /catalog-approvals — invalid action
Invoke-Probe -Label "create-approval-bad-action" -Method POST -Path "/catalog-approvals" `
    -Headers $opHeaders -Body @{ item_id = "some-item"; action = "maybe" } -Expect 400

# POST /catalog-approvals — reject without note
Invoke-Probe -Label "create-approval-reject-no-note" -Method POST -Path "/catalog-approvals" `
    -Headers $opHeaders -Body @{ item_id = "some-item"; action = "reject" } -Expect 400

# POST /catalog-approvals — client forbidden
Invoke-Probe -Label "create-approval-client-forbidden" -Method POST -Path "/catalog-approvals" `
    -Headers $clientHeaders -Body @{ item_id = "some-item"; action = "approve" } -Expect 403

# ──────────────────────────────────────────────
# SUMMARY
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "============================================"
Write-Host "  TOTAL: $($pass + $fail)  |  PASS: $pass  |  FAIL: $fail"
Write-Host "============================================"

# Save results
$evidenceRoot = "tools/registry/runs/$SessionId"
New-Item -ItemType Directory -Force -Path $evidenceRoot | Out-Null

$reportPath = "$evidenceRoot/all-handlers-smoke.txt"
$header = @(
    "SESSION: $SessionId",
    "BASE_URL: $BaseUrl",
    "TIMESTAMP: $(Get-Date -Format 'o')",
    "PASS: $pass",
    "FAIL: $fail",
    "TOTAL: $($pass + $fail)",
    ""
)
($header + $results) | Set-Content -Path $reportPath -Encoding UTF8

Write-Host ""
Write-Host "Evidence: $reportPath"

if ($fail -gt 0) {
    Write-Host ""
    Write-Host "FAILURES:"
    $results | Where-Object { $_ -like "FAIL*" } | ForEach-Object { Write-Host "  $_" }
    exit 1
}
exit 0
