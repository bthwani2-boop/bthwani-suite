# VERIFY_J003_INTEGRATION.ps1
# E2E verification of Journey J-003 Checkout & Payment flows

Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$EvidenceDir = "tools\registry\runs\DSH_JOURNEY_003_AUTH_CLIENT_BINDING_EXECUTION-20260604"
if (-not (Test-Path -LiteralPath $EvidenceDir)) {
    New-Item -ItemType Directory -Force -Path $EvidenceDir | Out-Null
}
$LogPath = Join-Path $EvidenceDir "03-verification.txt"

# Helper: Log message to both screen and file
function Log-Msg {
    param([string]$Msg)
    $Timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    $FullMsg = "[$Timestamp] $Msg"
    Write-Host $FullMsg -ForegroundColor Cyan
    Add-Content -LiteralPath $LogPath -Value $FullMsg
}

# Clear previous log file
if (Test-Path -LiteralPath $LogPath) {
    Remove-Item -LiteralPath $LogPath
}

Log-Msg "Starting J-003 E2E Integration Verification..."

# Cleanup existing processes to free ports 8080 and 8081
Log-Msg "Checking for existing dsh-api or auth-service processes..."
Get-Process -Name "dsh-api" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "auth-service" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
try {
    $Conn8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if ($Conn8080) {
        Log-Msg "Killing process $($Conn8080.OwningProcess) listening on port 8080..."
        Stop-Process -Id $Conn8080.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    $Conn8081 = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
    if ($Conn8081) {
        Log-Msg "Killing process $($Conn8081.OwningProcess) listening on port 8081..."
        Stop-Process -Id $Conn8081.OwningProcess -Force -ErrorAction SilentlyContinue
    }
} catch {}

# 1. Start Mock Auth HTTP Server (port 8081)
Log-Msg "Launching Mock Auth Service on http://localhost:8081 as a child process..."

$AuthScript = @'
$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:8081/")
try {
    $Listener.Start()
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response
        $AuthHeader = $Request.Headers.Get("Authorization")
        if ($Request.Url.AbsolutePath -eq "/auth/session" -and $Request.HttpMethod -eq "GET") {
            if ($AuthHeader -eq "Bearer test-token-123") {
                $ResponseBody = '{"subject":"client-prod-123","authState":"authenticated","roles":["client"],"verifiedIdentifier":"+967777777777"}'
                $Buffer = [System.Text.Encoding]::UTF8.GetBytes($ResponseBody)
                $Response.ContentType = "application/json"
                $Response.StatusCode = 200
                $Response.ContentLength64 = $Buffer.Length
                $Response.OutputStream.Write($Buffer, 0, $Buffer.Length)
            } else {
                $ResponseBody = '{"error":"unauthenticated"}'
                $Buffer = [System.Text.Encoding]::UTF8.GetBytes($ResponseBody)
                $Response.ContentType = "application/json"
                $Response.StatusCode = 401
                $Response.ContentLength64 = $Buffer.Length
                $Response.OutputStream.Write($Buffer, 0, $Buffer.Length)
            }
        } else {
            $Response.StatusCode = 404
        }
        $Response.OutputStream.Close()
    }
} catch {
    # exit
} finally {
    $Listener.Close()
}
'@

$Encoded = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($AuthScript))
$AuthProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoProfile", "-EncodedCommand", $Encoded -NoNewWindow -PassThru

# Set environment variables
$Env:PORT = "8080"
$Env:DSH_AUTH_MODE = "production"
$Env:DSH_AUTH_SERVICE_URL = "http://localhost:8081"
$Env:WLT_CALLBACK_SECRET = "dev-secret"
$Env:DATABASE_URL = "postgres://dsh_local:dsh_local_password@localhost:15432/dsh_local?sslmode=disable"

# Run Postgres migrations and seeds
Log-Msg "Applying migrations and seeds to Postgres..."
Push-Location -Path "C:\bthwani-suite\dsh\backend"
go test -count=1 -run TestApplyMigrations ./internal/store
Pop-Location

# 2. Start DSH API Server in Production Auth Mode (port 8080)
Log-Msg "Launching DSH Go API Server on http://localhost:8080 (DSH_AUTH_MODE=production with Postgres)..."

# Spawn Go DSH backend process
$DshProcess = Start-Process -FilePath "go" -ArgumentList "run", "cmd/dsh-api/main.go" -NoNewWindow -PassThru -WorkingDirectory "C:\bthwani-suite\dsh\backend"

# Wait a brief moment for servers to start
Start-Sleep -Seconds 3

# Verify DSH is responding
$DshPinged = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $Ping = Invoke-WebRequest -Uri "http://localhost:8080/cart/serviceability?store_id=store-1001" -Method Get -Headers @{ "X-Client-Id" = "ping" } -UseBasicParsing
        if ($Ping.StatusCode -eq 401) {
            $DshPinged = $true
            break
        }
    } catch {
        if ($_.Exception.Response) {
            $DshPinged = $true
            break
        }
        Start-Sleep -Seconds 1
    }
}

if (-not $DshPinged) {
    Log-Msg "ERROR: Go API server failed to start or respond on port 8080."
    if ($DshProcess) { Stop-Process -Id $DshProcess.Id -Force -ErrorAction SilentlyContinue }
    if ($AuthProcess) { Stop-Process -Id $AuthProcess.Id -Force -ErrorAction SilentlyContinue }
    exit 1
}

Log-Msg "Servers are listening. Beginning E2E endpoint requests..."

# Try-Catch block to ensure clean teardown of background services
try {
    # ─── GATE 1: GET /cart/serviceability (Slice 003A) ───
    Log-Msg "Test: GET /cart/serviceability (Anonymous) -> expecting 401"
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/cart/serviceability?store_id=store-1001" -Method Get -UseBasicParsing
        Log-Msg "ERROR: Serviceability call succeeded without auth!"
        exit 1
    } catch {
        if ($_.Exception.Response -and ([int]$_.Exception.Response.StatusCode -eq 401)) {
            Log-Msg "PASS: Anonymous request blocked (Status: 401)"
        } else {
            Log-Msg "ERROR: Unexpected exception: $_"
            exit 1
        }
    }

    Log-Msg "Test: GET /cart/serviceability (Authenticated test-token-123) -> expecting 200"
    $Headers = @{
        "Authorization" = "Bearer test-token-123"
    }
    $Serv = Invoke-RestMethod -Uri "http://localhost:8080/cart/serviceability?store_id=store-1001" -Method Get -Headers $Headers
    Log-Msg "PASS: Serviceability response received: Store=$($Serv.store_id), Serviceable=$($Serv.serviceable)"

    # ─── GATE 2: POST /checkout/intent (Slice 003B) ───
    Log-Msg "Test: POST /checkout/intent (Authenticated test-token-123) -> expecting 201 Created"
    $IntentBody = @{
        store_id = "store-1001"
        items = @(
            @{ product_id = "item-apple-1"; quantity = 2 }
        )
        delivery_address = "Oman, Muscat, Al Khuwair"
    } | ConvertTo-Json
    $Intent = Invoke-RestMethod -Uri "http://localhost:8080/checkout/intent" -Method Post -Headers $Headers -Body $IntentBody -ContentType "application/json"
    Log-Msg "PASS: Intent created: IntentID=$($Intent.intent_id), Token=$($Intent.session_token), Status=$($Intent.status)"

    # ─── GATE 3: POST /checkout/payment-callback (Slice 003C / 003E) ───
    Log-Msg "Test: POST /checkout/payment-callback (WLT confirm callback) -> expecting 200 OK"
    $UniqueId = [Guid]::NewGuid().ToString()
    $CallbackHeaders = @{
        "X-WLT-Callback-Token" = "dev-secret"
        "X-WLT-Event-Id" = "evt-integration-confirmed-$UniqueId"
        "Idempotency-Key" = "idem-integration-confirmed-$UniqueId"
    }
    $CallbackBody = @{
        intent_id = $Intent.intent_id
        wlt_payment_ref_id = "wlt-sess-confirmed-$UniqueId"
        status = "confirmed"
    } | ConvertTo-Json
    $Callback = Invoke-RestMethod -Uri "http://localhost:8080/checkout/payment-callback" -Method Post -Headers $CallbackHeaders -Body $CallbackBody -ContentType "application/json"
    Log-Msg "PASS: Callback accepted: Acknowledged=$($Callback.acknowledged), NextAction=$($Callback.next_action)"

    # ─── GATE 4: POST /orders (Slice 003D) ───
    Log-Msg "Test: POST /orders (Create order after confirmation) -> expecting 201 Created"
    $OrderBody = @{
        store_id = "store-1001"
        client_id = "client-prod-123"
        total_price = 36.0
        wlt_payment_ref_id = "wlt-sess-confirmed-$UniqueId"
        checkout_intent_id = $Intent.intent_id
        items = @(
            @{ product_id = "item-apple-1"; quantity = 2; price = 18.0 }
        )
    } | ConvertTo-Json

    try {
        $Order = Invoke-RestMethod -Uri "http://localhost:8080/orders" -Method Post -Headers $Headers -Body $OrderBody -ContentType "application/json" -UseBasicParsing
        Log-Msg "PASS: Order created successfully: OrderID=$($Order.order.id), Status=$($Order.order.status)"
    } catch {
        $Content = ""
        if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
            $Content = $_.ErrorDetails.Message
        } elseif ($_.Exception -and $_.Exception.Response) {
            try {
                $Stream = $_.Exception.Response.GetResponseStream()
                $Reader = New-Object System.IO.StreamReader($Stream)
                $Content = $Reader.ReadToEnd()
            } catch {}
        }
        if (-not $Content) {
            $Content = $_.ToString()
        }
        Log-Msg "ERROR: Order creation failed: $Content"
        exit 1
    }

    Log-Msg "E2E Checkout Integration Test completed successfully! All gates verified!"
} finally {
    # 3. Teardown Services
    Log-Msg "Tearing down background processes..."
    # Terminate DSH API server process
    if ($DshProcess) {
        Stop-Process -Id $DshProcess.Id -Force -ErrorAction SilentlyContinue
    }

    # Terminate Auth Mock process
    if ($AuthProcess) {
        Stop-Process -Id $AuthProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
