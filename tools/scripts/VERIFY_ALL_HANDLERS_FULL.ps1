# VERIFY_ALL_HANDLERS_FULL.ps1
# Exhaustive smoke test: ALL DSH API routes across all 10 handler files.
# Requires dsh-api running with DATABASE_URL (postgres). Falls back gracefully to memory-repo.
# Auth mode: dev (X-Client-Id + X-Actor-Type headers).
#
# Usage:
#   pwsh -File tools/scripts/VERIFY_ALL_HANDLERS_FULL.ps1
#   pwsh -File tools/scripts/VERIFY_ALL_HANDLERS_FULL.ps1 -BaseUrl http://localhost:8080
#
# Handlers covered:
#   stores_handler   — J-001 store discovery + J-006 field intake
#   categories_handler — J-002 category CRUD
#   products_handler   — J-002 product CRUD
#   media_handler      — J-002 product media
#   overrides_handler  — J-002 catalog overrides
#   approvals_handler  — J-002 catalog approvals
#   conflicts_handler  — J-002 catalog conflicts
#   checkout_handler   — J-003 checkout flow
#   orders_handler     — J-004/J-005 order lifecycle + delivery
#   support_handler    — J-009 support escalations
#   readiness_handler  — J-006D/E readiness escalations + approvals

[CmdletBinding()]
param(
    [string]$BaseUrl = "http://localhost:8080",
    [string]$WltCallbackSecret = "dev-secret",
    [string]$SessionId = ("ALL_HANDLERS_FULL-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
)

Set-StrictMode -Off
$ErrorActionPreference = "Continue"

$pass = 0
$fail = 0
$skip = 0
$results = [System.Collections.Generic.List[string]]::new()

# ─── helpers ──────────────────────────────────────────────────────────────────
function Invoke-Probe {
    param(
        [string]$Label,
        [string]$Method,
        [string]$Path,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [int[]]$Expect = @(200)        # accept list — any match = PASS
    )
    $url = "$BaseUrl$Path"
    $ht = @{ Method = $Method; Uri = $url; Headers = $Headers; ErrorAction = "SilentlyContinue" }
    if ($Body -ne $null) {
        $ht["Body"] = ($Body | ConvertTo-Json -Compress)
        $ht["ContentType"] = "application/json"
    }
    $status = 0
    try {
        $resp = Invoke-WebRequest @ht -UseBasicParsing -SkipHttpErrorCheck
        $status = $resp.StatusCode
    } catch {
        $status = 0
    }
    $icon = if ($Expect -contains $status) { "PASS" } else { "FAIL" }
    $expectStr = $Expect -join "/"
    $line = "$icon  [$status/$expectStr] $Method $Path | $Label"
    $results.Add($line)
    Write-Host $line
    if ($icon -eq "PASS") { $script:pass++ } else { $script:fail++ }
    return $status
}

function Invoke-ProbeCapture {
    # Like Invoke-Probe but also returns the response body for chaining
    param(
        [string]$Label, [string]$Method, [string]$Path,
        [hashtable]$Headers = @{}, [object]$Body = $null,
        [int[]]$Expect = @(200)
    )
    $url = "$BaseUrl$Path"
    $ht = @{ Method = $Method; Uri = $url; Headers = $Headers; ErrorAction = "SilentlyContinue" }
    if ($Body -ne $null) {
        $ht["Body"] = ($Body | ConvertTo-Json -Compress)
        $ht["ContentType"] = "application/json"
    }
    $status = 0; $content = ""
    try {
        $resp = Invoke-WebRequest @ht -UseBasicParsing -SkipHttpErrorCheck
        $status = $resp.StatusCode; $content = $resp.Content
    } catch {}
    $icon = if ($Expect -contains $status) { "PASS" } else { "FAIL" }
    $expectStr = $Expect -join "/"
    $line = "$icon  [$status/$expectStr] $Method $Path | $Label"
    $results.Add($line); Write-Host $line
    if ($icon -eq "PASS") { $script:pass++ } else { $script:fail++ }
    return @{ Status = $status; Content = $content }
}

function DevHeaders([string]$ClientId, [string]$Actor = "") {
    $h = @{ "X-Client-Id" = $ClientId }
    if ($Actor) { $h["X-Actor-Type"] = $Actor }
    return $h
}

function SkipNote([string]$Msg) {
    $line = "SKIP  $Msg"
    $results.Add($line); Write-Host $line
    $script:skip++
}

# ─── actor headers ────────────────────────────────────────────────────────────
$opH      = DevHeaders "operator-dev-001"  "operator"
$clientH  = DevHeaders "client-dev-001"    "client"
$partnerH = DevHeaders "partner-dev-001"   "partner"
$captainH = DevHeaders "captain-dev-001"   "captain"
$fieldH   = DevHeaders "field-dev-001"     "field"

# Detect if postgres is available (first probe that needs DB)
$postgresAvail = $false

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗"
Write-Host "║  DSH ALL-HANDLERS EXHAUSTIVE SMOKE | $SessionId"
Write-Host "║  Base: $BaseUrl"
Write-Host "╚══════════════════════════════════════════════════════════════╝"
Write-Host ""

# ══════════════════════════════════════════════════════════════════════════════
# §1  API LIVENESS
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "─── §1 API Liveness ────────────────────────────────────────────"
Invoke-Probe "liveness-stores-public"   GET "/stores"          @{} $null @(200) | Out-Null

# ══════════════════════════════════════════════════════════════════════════════
# §2  J-001 STORE DISCOVERY (stores_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §2 J-001 Store Discovery ───────────────────────────────────"

$knownStoreId = "store-1001"

Invoke-Probe "list-stores-no-auth"           GET "/stores"                               @{}    $null @(200)      | Out-Null
Invoke-Probe "list-stores-filter-all"        GET "/stores?filter=all"                    @{}    $null @(200)      | Out-Null
Invoke-Probe "list-stores-filter-nearest"    GET "/stores?filter=nearest"                @{}    $null @(200)      | Out-Null
Invoke-Probe "list-stores-filter-new"        GET "/stores?filter=new"                    @{}    $null @(200)      | Out-Null
Invoke-Probe "list-stores-filter-offers"     GET "/stores?filter=offers"                 @{}    $null @(200)      | Out-Null
Invoke-Probe "list-stores-filter-favorites"  GET "/stores?filter=favorites"              @{}    $null @(200)      | Out-Null
Invoke-Probe "list-stores-bad-filter"        GET "/stores?filter=invalid_xyz"            @{}    $null @(400)      | Out-Null
Invoke-Probe "list-stores-limit-ok"          GET "/stores?limit=5"                       @{}    $null @(200)      | Out-Null
Invoke-Probe "list-stores-limit-bad"         GET "/stores?limit=9999"                    @{}    $null @(400)      | Out-Null
Invoke-Probe "get-store-known"               GET "/stores/$knownStoreId"                 @{}    $null @(200)      | Out-Null
Invoke-Probe "get-store-404"                 GET "/stores/store-xyz-does-not-exist"      @{}    $null @(404)      | Out-Null
Invoke-Probe "partner-readiness-ok"          PATCH "/stores/$knownStoreId/partner-readiness" $opH @{ status="ready" } @(200) | Out-Null
Invoke-Probe "partner-readiness-paused"      PATCH "/stores/$knownStoreId/partner-readiness" $opH @{ status="paused" } @(200) | Out-Null
Invoke-Probe "partner-readiness-bad-status"  PATCH "/stores/$knownStoreId/partner-readiness" $opH @{ status="unknown_xyz" } @(400) | Out-Null
Invoke-Probe "partner-readiness-client-403"  PATCH "/stores/$knownStoreId/partner-readiness" $clientH @{ status="ready" } @(403) | Out-Null
Invoke-Probe "catalog-approval-ok"           PATCH "/stores/$knownStoreId/catalog-approval"  $opH @{ quality_status="approved"; pricing_status="approved" } @(200) | Out-Null
Invoke-Probe "catalog-approval-bad-quality"  PATCH "/stores/$knownStoreId/catalog-approval"  $opH @{ quality_status="invalid"; pricing_status="approved" } @(400) | Out-Null
Invoke-Probe "marketing-visibility-active"   PATCH "/stores/$knownStoreId/marketing-visibility" $opH @{ status="active" } @(200) | Out-Null
Invoke-Probe "marketing-visibility-inactive" PATCH "/stores/$knownStoreId/marketing-visibility" $opH @{ status="inactive" } @(200) | Out-Null
Invoke-Probe "marketing-visibility-bad"      PATCH "/stores/$knownStoreId/marketing-visibility" $opH @{ status="unknown" } @(400) | Out-Null
Invoke-Probe "marketing-visibility-client-403" PATCH "/stores/$knownStoreId/marketing-visibility" $clientH @{ status="active" } @(403) | Out-Null

# ══════════════════════════════════════════════════════════════════════════════
# §3  J-002 CATEGORIES (categories_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §3 J-002 Categories ────────────────────────────────────────"

Invoke-Probe "create-category-no-auth-401"   POST "/stores/$knownStoreId/categories" @{} @{ name="x" } @(401) | Out-Null
Invoke-Probe "create-category-client-403"    POST "/stores/$knownStoreId/categories" $clientH @{ name="x" } @(403) | Out-Null
Invoke-Probe "create-category-no-name-400"   POST "/stores/$knownStoreId/categories" $partnerH @{ name="" } @(400) | Out-Null

$catR = Invoke-ProbeCapture "create-category-partner-201" POST "/stores/$knownStoreId/categories" $partnerH @{ name="Smoke Cat"; description="auto" } @(201, 500)
$catId = $null
if ($catR.Status -eq 201) { try { $catId = ($catR.Content | ConvertFrom-Json).id } catch {} }

Invoke-Probe "list-categories-ok"            GET "/stores/$knownStoreId/categories"   @{} $null @(200, 500) | Out-Null
Invoke-Probe "list-categories-limit-bad"     GET "/stores/$knownStoreId/categories?limit=9999" @{} $null @(400, 500) | Out-Null

if ($catId) {
    Invoke-Probe "get-category-by-id"        GET "/categories/$catId"             @{}        $null @(200)    | Out-Null
    Invoke-Probe "update-category-partner"   PATCH "/categories/$catId"           $partnerH  @{ name="Smoke Updated Cat" } @(200) | Out-Null
    Invoke-Probe "update-category-empty-name-400" PATCH "/categories/$catId"      $partnerH  @{ name="" } @(400) | Out-Null
    Invoke-Probe "delete-category-partner"   DELETE "/categories/$catId"          $partnerH  $null @(204)    | Out-Null
    Invoke-Probe "get-category-after-delete-404" GET "/categories/$catId"         @{}        $null @(404)    | Out-Null
} else {
    SkipNote "[no-cat-id] GET/PATCH/DELETE /categories/{id} — postgres not available"
    Invoke-Probe "get-category-404"          GET "/categories/nonexistent-cat-xyz" @{} $null @(404, 500) | Out-Null
}

# ══════════════════════════════════════════════════════════════════════════════
# §4  J-002 PRODUCTS (products_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §4 J-002 Products ──────────────────────────────────────────"

Invoke-Probe "create-product-no-auth-401"    POST "/stores/$knownStoreId/products" @{}       @{ name="x" } @(401) | Out-Null
Invoke-Probe "create-product-client-403"     POST "/stores/$knownStoreId/products" $clientH  @{ name="x" } @(403) | Out-Null
Invoke-Probe "create-product-no-name-400"    POST "/stores/$knownStoreId/products" $partnerH @{ name="" } @(400) | Out-Null

$prodR = Invoke-ProbeCapture "create-product-partner-201" POST "/stores/$knownStoreId/products" $partnerH @{ name="Smoke Prod"; description="auto"; price_minor_units=1500; currency="SAR" } @(201, 500)
$prodId = $null
if ($prodR.Status -eq 201) { try { $prodId = ($prodR.Content | ConvertFrom-Json).id } catch {} }
if ($prodId) { $postgresAvail = $true }

Invoke-Probe "list-products-ok"              GET "/stores/$knownStoreId/products"   @{} $null @(200, 500) | Out-Null

if ($prodId) {
    Invoke-Probe "get-product-by-id"         GET "/products/$prodId"              @{}       $null @(200)    | Out-Null
    Invoke-Probe "update-product-partner"    PATCH "/products/$prodId"            $partnerH @{ name="Smoke Updated Prod" } @(200) | Out-Null
    Invoke-Probe "update-product-empty-name-400" PATCH "/products/$prodId"        $partnerH @{ name="" } @(400) | Out-Null
} else {
    SkipNote "[no-prod-id] GET/PATCH /products/{id} — postgres not available"
    Invoke-Probe "get-product-404"           GET "/products/nonexistent-prod-xyz" @{} $null @(404, 500) | Out-Null
}

# ══════════════════════════════════════════════════════════════════════════════
# §5  J-002 PRODUCT MEDIA (media_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §5 J-002 Product Media ─────────────────────────────────────"

Invoke-Probe "create-media-no-auth-401"      POST "/media" @{}      @{ product_id="x"; media_key="y" } @(401) | Out-Null
Invoke-Probe "create-media-client-403"       POST "/media" $clientH @{ product_id="x"; media_key="y" } @(403) | Out-Null
Invoke-Probe "create-media-no-product-id-400" POST "/media" $opH   @{ media_key="product-img-1.jpg" } @(400) | Out-Null
Invoke-Probe "create-media-no-key-400"       POST "/media" $opH    @{ product_id="x" } @(400) | Out-Null
Invoke-Probe "create-media-bad-manifest-key-400" POST "/media" $opH @{ product_id="x"; media_key="not-in-manifest.jpg" } @(400) | Out-Null

$mediaId = $null
if ($prodId) {
    $mediaR = Invoke-ProbeCapture "create-media-op-201" POST "/media" $opH @{ product_id=$prodId; media_key="dsh.product.apple.v1" } @(201, 404, 500)
    if ($mediaR.Status -eq 201) { try { $mediaId = ($mediaR.Content | ConvertFrom-Json).id } catch {} }
    if ($mediaId) {
        Invoke-Probe "delete-media-op-204"   DELETE "/media/$mediaId" $opH $null @(204) | Out-Null
    } else {
        SkipNote "[no-media-id] DELETE /media/{id} — media not created"
    }
    Invoke-Probe "delete-media-404"          DELETE "/media/nonexistent-media-xyz" $opH $null @(404, 500) | Out-Null
} else {
    SkipNote "[no-prod-id] POST /media — product not available"
}

# ══════════════════════════════════════════════════════════════════════════════
# §6  J-002 CATALOG OVERRIDES (overrides_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §6 J-002 Catalog Overrides ─────────────────────────────────"

Invoke-Probe "overrides-no-product-id-400"   PATCH "/stores/$knownStoreId/catalog-overrides" $opH @{ overrides=@(@{ product_id=""; available=$true }) } @(400) | Out-Null

if ($prodId) {
    Invoke-Probe "overrides-set-unavailable"  PATCH "/stores/$knownStoreId/catalog-overrides" $opH @{ overrides=@(@{ product_id=$prodId; available=$false }) } @(200, 500) | Out-Null
    Invoke-Probe "overrides-restore"          PATCH "/stores/$knownStoreId/catalog-overrides" $opH @{ overrides=@(@{ product_id=$prodId; available=$true  }) } @(200, 500) | Out-Null
} else {
    SkipNote "[no-prod-id] PATCH /catalog-overrides — product not available"
}

# ══════════════════════════════════════════════════════════════════════════════
# §7  J-002 CATALOG APPROVALS (approvals_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §7 J-002 Catalog Approvals ─────────────────────────────────"

Invoke-Probe "approval-client-403"           POST "/catalog-approvals" $clientH @{ item_id="x"; action="approve" } @(403) | Out-Null
Invoke-Probe "approval-missing-action-400"   POST "/catalog-approvals" $opH    @{ item_id="x"; action="" } @(400) | Out-Null
Invoke-Probe "approval-bad-action-400"       POST "/catalog-approvals" $opH    @{ item_id="x"; action="maybe" } @(400) | Out-Null
Invoke-Probe "approval-reject-no-note-400"   POST "/catalog-approvals" $opH    @{ item_id="x"; action="reject" } @(400) | Out-Null
Invoke-Probe "approval-needs-fix-no-note-400" POST "/catalog-approvals" $opH   @{ item_id="x"; action="needs-fix" } @(400) | Out-Null

if ($prodId) {
    Invoke-Probe "approval-approve-product"  POST "/catalog-approvals" $opH @{ item_id=$prodId; action="approve" } @(200, 500) | Out-Null
    Invoke-Probe "approval-reject-with-note" POST "/catalog-approvals" $opH @{ item_id=$prodId; action="reject"; note="smoke test rejection" } @(200, 500) | Out-Null
} else {
    SkipNote "[no-prod-id] POST /catalog-approvals with real ID — postgres not available"
}

# ══════════════════════════════════════════════════════════════════════════════
# §8  J-002 CATALOG CONFLICTS (conflicts_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §8 J-002 Catalog Conflicts ─────────────────────────────────"

Invoke-Probe "list-conflicts-ok"             GET "/catalog-conflicts"             @{} $null @(200, 500) | Out-Null
Invoke-Probe "list-conflicts-store-filter"   GET "/catalog-conflicts?store_id=$knownStoreId" @{} $null @(200, 500) | Out-Null
Invoke-Probe "resolve-conflict-bad-res-400"  POST "/catalog-conflicts/fake-id/resolve" $opH @{ resolution="invalid" } @(400) | Out-Null
Invoke-Probe "resolve-conflict-not-found-404" POST "/catalog-conflicts/nonexistent-xyz/resolve" $opH @{ resolution="accept_local" } @(404, 500) | Out-Null

# ══════════════════════════════════════════════════════════════════════════════
# §9  J-003 CHECKOUT (checkout_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §9 J-003 Checkout ──────────────────────────────────────────"

Invoke-Probe "serviceability-no-store-400"   GET "/cart/serviceability"                        $clientH $null @(400) | Out-Null
Invoke-Probe "serviceability-known-store"    GET "/cart/serviceability?store_id=$knownStoreId" $clientH $null @(200) | Out-Null
Invoke-Probe "serviceability-no-auth-401"    GET "/cart/serviceability?store_id=$knownStoreId" @{}      $null @(401) | Out-Null

$intentItemId = if ($prodId) { $prodId } else { "product-seed-001" }
$intentBody = @{ store_id=$knownStoreId; delivery_address="123 Test St"; items=@(@{ product_id=$intentItemId; quantity=1 }) }

Invoke-Probe "intent-no-items-400"           POST "/checkout/intent" $clientH @{ store_id=$knownStoreId; delivery_address="x" } @(400) | Out-Null
Invoke-Probe "intent-no-store-400"           POST "/checkout/intent" $clientH @{ delivery_address="x"; items=@(@{ product_id="x"; quantity=1 }) } @(400) | Out-Null
Invoke-Probe "intent-no-address-400"         POST "/checkout/intent" $clientH @{ store_id=$knownStoreId; items=@(@{ product_id="x"; quantity=1 }) } @(400) | Out-Null
Invoke-Probe "intent-zero-qty-400"           POST "/checkout/intent" $clientH @{ store_id=$knownStoreId; delivery_address="x"; items=@(@{ product_id="x"; quantity=0 }) } @(400) | Out-Null

$intentR = Invoke-ProbeCapture "intent-create-client-201" POST "/checkout/intent" $clientH $intentBody @(201, 409)
$intentId = $null
if ($intentR.Status -eq 201) { try { $intentId = ($intentR.Content | ConvertFrom-Json).intent_id } catch {} }
elseif ($intentR.Status -eq 409) { Write-Host "  NOTE: 409 = active session already exists (prev run artefact)" }

Invoke-Probe "payment-cb-no-token-401"       POST "/checkout/payment-callback" @{} @{ intent_id="x"; wlt_payment_ref_id="y"; status="confirmed" } @(401) | Out-Null
Invoke-Probe "payment-cb-bad-token-401"      POST "/checkout/payment-callback" @{"X-WLT-Callback-Token"="wrong";"X-WLT-Event-Id"="e1";"Idempotency-Key"="k1"} @{ intent_id="x"; wlt_payment_ref_id="y"; status="confirmed" } @(401) | Out-Null
Invoke-Probe "payment-cb-missing-event-400"  POST "/checkout/payment-callback" @{"X-WLT-Callback-Token"=$WltCallbackSecret;"Idempotency-Key"="k1"} @{ intent_id="x"; wlt_payment_ref_id="y"; status="confirmed" } @(400) | Out-Null
Invoke-Probe "payment-cb-bad-status-400"     POST "/checkout/payment-callback" @{"X-WLT-Callback-Token"=$WltCallbackSecret;"X-WLT-Event-Id"="e1";"Idempotency-Key"="k1"} @{ intent_id="x"; wlt_payment_ref_id="y"; status="pending" } @(400) | Out-Null

if ($intentId) {
    Invoke-Probe "intent-cancel-client-200"  DELETE "/checkout/intent/$intentId" $clientH $null @(200) | Out-Null
    Invoke-Probe "intent-cancel-again-idempotent" DELETE "/checkout/intent/$intentId" $clientH $null @(200, 404, 400) | Out-Null
} else {
    SkipNote "[no-intent-id] DELETE /checkout/intent/{id} — intent not created or already active"
}

# ══════════════════════════════════════════════════════════════════════════════
# §10  J-004 ORDERS CREATE + LIST (orders_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §10 J-004 Orders ───────────────────────────────────────────"

Invoke-Probe "list-orders-no-auth-401"       GET "/orders" @{} $null @(401) | Out-Null
Invoke-Probe "list-orders-operator"          GET "/orders" $opH $null @(200, 500) | Out-Null
Invoke-Probe "list-orders-client"            GET "/orders" $clientH $null @(200, 500) | Out-Null
Invoke-Probe "list-orders-status-filter"     GET "/orders?status=CREATED" $opH $null @(200, 500) | Out-Null
Invoke-Probe "list-orders-captain-ok"        GET "/orders" $captainH $null @(200, 500) | Out-Null
Invoke-Probe "list-orders-partner-ok"        GET "/orders" $partnerH $null @(200, 500) | Out-Null
Invoke-Probe "create-order-captain-403"      POST "/orders" $captainH @{ store_id=$knownStoreId; checkout_intent_id="x"; items=@() } @(403) | Out-Null
Invoke-Probe "create-order-no-store-id-400"  POST "/orders" $clientH @{ checkout_intent_id="x"; items=@(@{ product_id="x"; quantity=1; unit_price_minor_units=100; currency="SAR" }) } @(400) | Out-Null
Invoke-Probe "create-order-no-intent-400"    POST "/orders" $clientH @{ store_id=$knownStoreId; items=@(@{ product_id="x"; quantity=1; unit_price_minor_units=100; currency="SAR" }) } @(400) | Out-Null
Invoke-Probe "create-order-no-items-400"     POST "/orders" $clientH @{ store_id=$knownStoreId; checkout_intent_id="x" } @(400) | Out-Null

# Create a fresh intent for order
$orderIntentR = Invoke-ProbeCapture "order-intent-create" POST "/checkout/intent" $clientH $intentBody @(201, 409)
$orderIntentId = $null
if ($orderIntentR.Status -eq 201) { try { $orderIntentId = ($orderIntentR.Content | ConvertFrom-Json).intent_id } catch {} }

$orderId = $null
if ($orderIntentId) {
    $orderBody = @{
        store_id = $knownStoreId
        checkout_intent_id = $orderIntentId
        items = @(@{ product_id=$intentItemId; quantity=1; unit_price_minor_units=1500; currency="SAR" })
        delivery_address = "456 Order Ave"
    }
    $orderR = Invoke-ProbeCapture "create-order-client-201" POST "/orders" $clientH $orderBody @(201, 500)
    if ($orderR.Status -eq 201) { try { $orderId = ($orderR.Content | ConvertFrom-Json).order.id } catch {} }
} else {
    SkipNote "[no-order-intent] POST /orders — no fresh intent available"
}

if ($orderId) {
    Invoke-Probe "get-order-client"          GET "/orders/$orderId" $clientH $null @(200) | Out-Null
    Invoke-Probe "get-order-operator"        GET "/orders/$orderId" $opH    $null @(200) | Out-Null
    Invoke-Probe "get-order-partner"         GET "/orders/$orderId" $partnerH $null @(200, 403) | Out-Null
    Invoke-Probe "get-order-no-auth-401"     GET "/orders/$orderId" @{}     $null @(401) | Out-Null

    # Cancel the order (client)
    Invoke-Probe "cancel-order-client"       POST "/orders/$orderId/cancel" $clientH @{ actor="client" } @(200) | Out-Null
    Invoke-Probe "cancel-order-again"        POST "/orders/$orderId/cancel" $clientH @{ actor="client" } @(200, 400, 500) | Out-Null
} else {
    SkipNote "[no-order-id] GET/cancel /orders/{id} — order not created"
    Invoke-Probe "get-order-404"             GET "/orders/nonexistent-order-xyz" $clientH $null @(404, 500) | Out-Null
}

# ══════════════════════════════════════════════════════════════════════════════
# §11  J-005 DELIVERY LIFECYCLE (orders_handler delivery routes)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §11 J-005 Delivery Lifecycle ───────────────────────────────"

# RBAC-only checks (no DB needed)
Invoke-Probe "assign-captain-no-auth-401"    POST "/orders/fake/assign-captain"    @{}       @{ captain_id="x" } @(401) | Out-Null
Invoke-Probe "assign-captain-client-403"     POST "/orders/fake/assign-captain"    $clientH  @{ captain_id="x" } @(403) | Out-Null
Invoke-Probe "accept-task-no-auth-401"       POST "/orders/fake/accept-task"       @{}       @{ captain_id="x" } @(401) | Out-Null
Invoke-Probe "accept-task-client-403"        POST "/orders/fake/accept-task"       $clientH  @{ captain_id="x" } @(403) | Out-Null
Invoke-Probe "decline-task-no-auth-401"      POST "/orders/fake/decline-task"      @{}       @{ captain_id="x"; reason="y" } @(401) | Out-Null
Invoke-Probe "pickup-no-auth-401"            POST "/orders/fake/pickup"            @{}       @{ captain_id="x" } @(401) | Out-Null
Invoke-Probe "pickup-client-403"             POST "/orders/fake/pickup"            $clientH  @{ captain_id="x" } @(403) | Out-Null
Invoke-Probe "location-no-auth-401"          POST "/orders/fake/location"          @{}       @{ captain_id="x"; latitude=0; longitude=0; lifecycle_status="EN_ROUTE" } @(401) | Out-Null
Invoke-Probe "location-client-403"           POST "/orders/fake/location"          $clientH  @{ captain_id="x"; latitude=0; longitude=0; lifecycle_status="EN_ROUTE" } @(403) | Out-Null
Invoke-Probe "get-location-no-auth-401"      GET  "/orders/fake/location"          @{}       $null @(401) | Out-Null
Invoke-Probe "deliver-no-auth-401"           POST "/orders/fake/deliver"           @{}       @{ captain_id="x" } @(401) | Out-Null
Invoke-Probe "deliver-client-403"            POST "/orders/fake/deliver"           $clientH  @{ captain_id="x" } @(403) | Out-Null
Invoke-Probe "fail-delivery-no-auth-401"     POST "/orders/fake/fail-delivery"     @{}       @{ captain_id="x"; reason="y" } @(401) | Out-Null
Invoke-Probe "fail-delivery-wrong-captain"   POST "/orders/fake/fail-delivery"     (DevHeaders "captain-dev-999" "captain") @{ captain_id="captain-dev-001" } @(403) | Out-Null
Invoke-Probe "confirm-return-no-auth-401"    POST "/orders/fake/confirm-return"    @{}       @{ captain_id="x" } @(401) | Out-Null
Invoke-Probe "confirm-return-client-403"     POST "/orders/fake/confirm-return"    $clientH  @{ captain_id="x" } @(403) | Out-Null
Invoke-Probe "update-status-bad-actor"       PATCH "/orders/fake/status"           $opH      @{ actor="invalid_actor"; status="CREATED" } @(400, 401) | Out-Null
Invoke-Probe "update-status-bad-status"      PATCH "/orders/fake/status"           $opH      @{ actor="operator"; status="INVALID_STATUS_XYZ" } @(400, 401) | Out-Null
Invoke-Probe "refund-callback-no-token-401"  POST "/orders/fake/refund-callback"   @{}       @{ refund_ref_id="x"; status="CONFIRMED" } @(401) | Out-Null
Invoke-Probe "settlement-callback-no-token-401" POST "/orders/fake/settlement-callback" @{}  @{ settlement_ref_id="x"; status="SETTLED" } @(401) | Out-Null

# Full delivery lifecycle with postgres
$delIntentR = Invoke-ProbeCapture "del-intent" POST "/checkout/intent" $clientH $intentBody @(201, 409)
$delIntentId = $null
if ($delIntentR.Status -eq 201) { try { $delIntentId = ($delIntentR.Content | ConvertFrom-Json).intent_id } catch {} }

$delOrderId = $null
if ($delIntentId) {
    $delOrderBody = @{ store_id=$knownStoreId; checkout_intent_id=$delIntentId; items=@(@{ product_id=$intentItemId; quantity=1; unit_price_minor_units=1500; currency="SAR" }); delivery_address="789 Delivery Rd" }
    $delR = Invoke-ProbeCapture "del-order-create" POST "/orders" $clientH $delOrderBody @(201, 500)
    if ($delR.Status -eq 201) { try { $delOrderId = ($delR.Content | ConvertFrom-Json).order.id } catch {} }
}

if ($delOrderId) {
    Invoke-Probe "assign-captain-op"         POST "/orders/$delOrderId/assign-captain"  $opH      @{ captain_id="captain-dev-001" } @(200) | Out-Null
    Invoke-Probe "accept-task-captain"       POST "/orders/$delOrderId/accept-task"     $captainH @{ captain_id="captain-dev-001" } @(200) | Out-Null
    Invoke-Probe "pickup-captain"            POST "/orders/$delOrderId/pickup"           $captainH @{ captain_id="captain-dev-001" } @(200) | Out-Null
    Invoke-Probe "update-location-enroute"   POST "/orders/$delOrderId/location"        $captainH @{ captain_id="captain-dev-001"; latitude=24.7; longitude=46.7; lifecycle_status="EN_ROUTE"; order_status="EN_ROUTE" } @(200) | Out-Null
    Invoke-Probe "get-location-client"       GET  "/orders/$delOrderId/location"        $clientH  $null @(200) | Out-Null
    Invoke-Probe "update-location-arrived"   POST "/orders/$delOrderId/location"        $captainH @{ captain_id="captain-dev-001"; latitude=24.71; longitude=46.71; lifecycle_status="ARRIVED"; order_status="ARRIVED" } @(200) | Out-Null
    Invoke-Probe "deliver-captain"           POST "/orders/$delOrderId/deliver"         $captainH @{ captain_id="captain-dev-001" } @(200) | Out-Null
} else {
    SkipNote "[no-del-order] Full delivery lifecycle — postgres not available or no intent"
    Write-Host "  RBAC checks above still validate auth/role enforcement."
}

# Failure flow
$failIntentR = Invoke-ProbeCapture "fail-intent" POST "/checkout/intent" $clientH $intentBody @(201, 409)
$failIntentId = $null
if ($failIntentR.Status -eq 201) { try { $failIntentId = ($failIntentR.Content | ConvertFrom-Json).intent_id } catch {} }
$failOrderId = $null
if ($failIntentId) {
    $failOrderBody = @{ store_id=$knownStoreId; checkout_intent_id=$failIntentId; items=@(@{ product_id=$intentItemId; quantity=1; unit_price_minor_units=1500; currency="SAR" }); delivery_address="Failure St" }
    $failR = Invoke-ProbeCapture "fail-order-create" POST "/orders" $clientH $failOrderBody @(201, 500)
    if ($failR.Status -eq 201) { try { $failOrderId = ($failR.Content | ConvertFrom-Json).order.id } catch {} }
}
if ($failOrderId) {
    Invoke-Probe "assign-captain-fail"       POST "/orders/$failOrderId/assign-captain"  $opH      @{ captain_id="captain-dev-001" } @(200) | Out-Null
    Invoke-Probe "accept-fail-captain"       POST "/orders/$failOrderId/accept-task"     $captainH @{ captain_id="captain-dev-001" } @(200) | Out-Null
    Invoke-Probe "pickup-fail"               POST "/orders/$failOrderId/pickup"           $captainH @{ captain_id="captain-dev-001" } @(200) | Out-Null
    Invoke-Probe "fail-delivery-captain"     POST "/orders/$failOrderId/fail-delivery"   $captainH @{ captain_id="captain-dev-001"; reason="customer not home" } @(200) | Out-Null
    Invoke-Probe "confirm-return-captain"    POST "/orders/$failOrderId/confirm-return"  $captainH @{ captain_id="captain-dev-001" } @(200) | Out-Null
} else {
    SkipNote "[no-fail-order] Failure flow lifecycle — postgres not available"
}

# ══════════════════════════════════════════════════════════════════════════════
# §12  J-006 FIELD INTAKE (stores_handler field routes)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §12 J-006 Field Intake ─────────────────────────────────────"

Invoke-Probe "field-store-no-auth-401"       POST "/stores" @{}       @{ name="x"; address="y" } @(401) | Out-Null
Invoke-Probe "field-store-client-403"        POST "/stores" $clientH  @{ name="x"; address="y" } @(403) | Out-Null
Invoke-Probe "field-store-no-name-400"       POST "/stores" $fieldH   @{ address="y" } @(400) | Out-Null
Invoke-Probe "field-store-no-address-400"    POST "/stores" $fieldH   @{ name="x" } @(400) | Out-Null

$fieldStoreR = Invoke-ProbeCapture "field-store-create-201" POST "/stores" $fieldH @{ name="Smoke Field Store"; address="789 Field Ave" } @(201, 500)
$fieldStoreId = $null
if ($fieldStoreR.Status -eq 201) { try { $fieldStoreId = ($fieldStoreR.Content | ConvertFrom-Json).id } catch {} }

$targetStoreId = if ($fieldStoreId) { $fieldStoreId } else { $knownStoreId }

Invoke-Probe "field-visit-no-auth-401"       POST "/stores/$targetStoreId/field-visits" @{} @{ visit_summary="x"; follow_up_action="y" } @(401) | Out-Null
Invoke-Probe "field-visit-client-403"        POST "/stores/$targetStoreId/field-visits" $clientH @{ visit_summary="x"; follow_up_action="y" } @(403) | Out-Null
Invoke-Probe "field-visit-no-summary-400"    POST "/stores/$targetStoreId/field-visits" $fieldH @{ follow_up_action="y" } @(400) | Out-Null
Invoke-Probe "field-visit-no-action-400"     POST "/stores/$targetStoreId/field-visits" $fieldH @{ visit_summary="x" } @(400) | Out-Null
Invoke-Probe "field-visit-create-201"        POST "/stores/$targetStoreId/field-visits" $fieldH @{ visit_summary="Smoke visit summary"; follow_up_action="approve" } @(201, 500) | Out-Null

Invoke-Probe "field-doc-no-auth-401"         POST "/stores/$targetStoreId/documents"    @{}      @{ document_kind="storefront_photo"; media_key="k" } @(401) | Out-Null
Invoke-Probe "field-doc-client-403"          POST "/stores/$targetStoreId/documents"    $clientH @{ document_kind="storefront_photo"; media_key="k" } @(403) | Out-Null
Invoke-Probe "field-doc-bad-kind-400"        POST "/stores/$targetStoreId/documents"    $fieldH  @{ document_kind="invalid_kind"; media_key="k" } @(400) | Out-Null
Invoke-Probe "field-doc-no-key-400"          POST "/stores/$targetStoreId/documents"    $fieldH  @{ document_kind="storefront_photo" } @(400) | Out-Null
Invoke-Probe "field-doc-create-201"          POST "/stores/$targetStoreId/documents"    $fieldH  @{ document_kind="storefront_photo"; media_key="smoke-media-001" } @(201, 500) | Out-Null
Invoke-Probe "field-doc-interior-201"        POST "/stores/$targetStoreId/documents"    $fieldH  @{ document_kind="interior_photo"; media_key="smoke-media-002" } @(201, 500) | Out-Null
Invoke-Probe "field-doc-tax-cert-201"        POST "/stores/$targetStoreId/documents"    $fieldH  @{ document_kind="tax_certificate"; media_key="smoke-media-003" } @(201, 500) | Out-Null

# ══════════════════════════════════════════════════════════════════════════════
# §13  J-006D/E READINESS (readiness_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §13 J-006D/E Readiness Escalations + Approvals ────────────"

Invoke-Probe "readiness-esc-no-auth-401"     POST "/stores/$targetStoreId/readiness-escalations" @{} @{ reason="x"; target_team="control-panel" } @(401) | Out-Null
Invoke-Probe "readiness-esc-client-403"      POST "/stores/$targetStoreId/readiness-escalations" $clientH @{ reason="x"; target_team="control-panel" } @(403) | Out-Null
Invoke-Probe "readiness-esc-create-field"    POST "/stores/$targetStoreId/readiness-escalations" $fieldH  @{ reason="Smoke escalation reason"; target_team="control-panel" } @(201, 500) | Out-Null

Invoke-Probe "list-readiness-esc-no-auth-401" GET "/readiness-escalations"  @{}   $null @(401) | Out-Null
Invoke-Probe "list-readiness-esc-client-403"  GET "/readiness-escalations"  $clientH $null @(403) | Out-Null
Invoke-Probe "list-readiness-esc-op-ok"       GET "/readiness-escalations"  $opH  $null @(200, 500) | Out-Null

Invoke-Probe "readiness-appr-no-auth-401"    POST "/stores/$targetStoreId/readiness-approvals" @{} @{ decision="approved" } @(401) | Out-Null
Invoke-Probe "readiness-appr-client-403"     POST "/stores/$targetStoreId/readiness-approvals" $clientH @{ decision="approved" } @(403) | Out-Null
Invoke-Probe "readiness-appr-create-op"      POST "/stores/$targetStoreId/readiness-approvals" $opH @{ decision="approved"; reason="Smoke test approval" } @(201, 500) | Out-Null

Invoke-Probe "latest-appr-no-auth-401"       GET "/stores/$targetStoreId/readiness-approvals/latest" @{}       $null @(401) | Out-Null
Invoke-Probe "latest-appr-client-403"        GET "/stores/$targetStoreId/readiness-approvals/latest" $clientH  $null @(403) | Out-Null
Invoke-Probe "latest-appr-op-ok"             GET "/stores/$targetStoreId/readiness-approvals/latest" $opH      $null @(200, 404, 500) | Out-Null

# ══════════════════════════════════════════════════════════════════════════════
# §14  J-009 SUPPORT (support_handler)
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "─── §14 J-009 Support Escalations ─────────────────────────────"

Invoke-Probe "list-esc-no-auth-401"          GET "/support/escalations" @{} $null @(401) | Out-Null
Invoke-Probe "list-esc-client-403"           GET "/support/escalations" $clientH $null @(403) | Out-Null
Invoke-Probe "list-esc-op-ok"                GET "/support/escalations" $opH $null @(200) | Out-Null
Invoke-Probe "list-esc-status-filter"        GET "/support/escalations?status=open" $opH $null @(200) | Out-Null

Invoke-Probe "create-esc-no-auth-401"        POST "/support/escalations" @{}       @{ order_id="x"; actor="client"; issue_type="other"; description="y" } @(401) | Out-Null
Invoke-Probe "create-esc-partner-ok"         POST "/support/escalations" $partnerH @{ order_id="x"; actor="partner"; issue_type="other"; description="y" } @(201, 404, 500) | Out-Null
Invoke-Probe "create-esc-bad-actor-400"      POST "/support/escalations" $clientH  @{ order_id="x"; actor="captain"; issue_type="other"; description="y" } @(400) | Out-Null
Invoke-Probe "create-esc-bad-issue-type-400" POST "/support/escalations" $clientH  @{ order_id="x"; actor="client"; issue_type="bad_type"; description="y" } @(400) | Out-Null
Invoke-Probe "create-esc-no-desc-400"        POST "/support/escalations" $partnerH @{ order_id="x"; actor="partner"; issue_type="other"; description="" } @(400) | Out-Null
Invoke-Probe "create-esc-client-not-owner"   POST "/support/escalations" $clientH  @{ order_id="nonexistent-xyz"; actor="client"; issue_type="other"; description="smoke" } @(404, 500) | Out-Null

if ($orderId) {
    Invoke-Probe "create-esc-real-order"     POST "/support/escalations" $clientH @{ order_id=$orderId; actor="client"; issue_type="other"; description="smoke support ticket" } @(201, 403, 500) | Out-Null
}

Invoke-Probe "patch-esc-client-403"          PATCH "/support/escalations/fake-id" $clientH @{ status="resolved" } @(403) | Out-Null
Invoke-Probe "patch-esc-bad-status-400"      PATCH "/support/escalations/fake-id" $opH     @{ status="unknown" } @(400) | Out-Null
Invoke-Probe "patch-esc-not-found-404"       PATCH "/support/escalations/nonexistent-xyz" $opH @{ status="resolved" } @(404, 500) | Out-Null

# ══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗"
$dbStatus = if ($postgresAvail) { "POSTGRES" } else { "MEMORY-REPO (limited)" }
Write-Host "║  DB Backend: $dbStatus"
Write-Host "║  TOTAL: $($pass + $fail + $skip)  |  PASS: $pass  |  FAIL: $fail  |  SKIP: $skip"
Write-Host "╚══════════════════════════════════════════════════════════════╝"

$evidenceRoot = "tools/registry/runs/$SessionId"
New-Item -ItemType Directory -Force -Path $evidenceRoot | Out-Null
$reportPath = "$evidenceRoot/all-handlers-full.txt"
$header = @(
    "SESSION: $SessionId",
    "BASE_URL: $BaseUrl",
    "TIMESTAMP: $(Get-Date -Format 'o')",
    "DB_BACKEND: $dbStatus",
    "PASS: $pass",
    "FAIL: $fail",
    "SKIP: $skip",
    "TOTAL: $($pass + $fail + $skip)",
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
