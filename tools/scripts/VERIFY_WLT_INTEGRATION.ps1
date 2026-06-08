# VERIFY_WLT_INTEGRATION.ps1
# Smoke test verification of WLT Wallet & Ledger Service API

Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$DateStr = (Get-Date -Format "yyyyMMdd-HHmmss")
$EvidenceDir = "tools\registry\runs\WLT_INTEGRATION_SMOKE_TEST-$DateStr"
if (-not (Test-Path -LiteralPath $EvidenceDir)) {
    New-Item -ItemType Directory -Force -Path $EvidenceDir | Out-Null
}
$LogPath = Join-Path $EvidenceDir "wlt-smoke-output.txt"

# Helper: Log message to both screen and file
function Log-Msg {
    param([string]$Msg)
    $Timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    $FullMsg = "[$Timestamp] $Msg"
    Write-Host $FullMsg -ForegroundColor Yellow
    Add-Content -LiteralPath $LogPath -Value $FullMsg
}

# Clear previous log file if exists
if (Test-Path -LiteralPath $LogPath) {
    Remove-Item -LiteralPath $LogPath
}

Log-Msg "Starting WLT Backend Smoke Test..."

$WltBaseUrl = "http://localhost:8083"

# 1. Health check verification
try {
    Log-Msg "Test 1: Ping WLT health endpoint GET $WltBaseUrl/health"
    $Health = Invoke-RestMethod -Uri "$WltBaseUrl/health" -Method Get -UseBasicParsing
    if ($Health.status -eq "ok") {
        Log-Msg "PASS: WLT is responsive and healthy: status=$($Health.status)"
    } else {
        Log-Msg "FAIL: WLT returned unexpected health status: $($Health.status)"
        exit 1
    }
} catch {
    Log-Msg "FAIL: Failed to contact WLT health endpoint at $WltBaseUrl/health. Error: $_"
    exit 1
}

# 2. Check wallet balance initially
$TestClientId = "smoke-client-test-$DateStr"
try {
    Log-Msg "Test 2: GET wallet summary for $TestClientId"
    $Headers = @{
        "X-Client-Id" = $TestClientId
        "X-Actor-Type" = "client"
    }
    $Wallet = Invoke-RestMethod -Uri "$WltBaseUrl/wallets/$TestClientId/summary" -Method Get -Headers $Headers -UseBasicParsing
    Log-Msg "PASS: Wallet summary retrieved successfully. Initial Balance = $($Wallet.balance) $($Wallet.currency)"

    if ($Wallet.balance -ne 0) {
        Log-Msg "FAIL: Expected initial balance to be 0, got $($Wallet.balance)"
        exit 1
    }
} catch {
    Log-Msg "FAIL: Query wallet summary failed. Error: $_"
    exit 1
}

# 3. Create top-up session
$IntentId = "topup-intent-smoke-$DateStr"
try {
    Log-Msg "Test 3: POST to create top-up payment session (Amount: 5000 YER)"
    $TopupBody = @{
        checkout_intent_id = $IntentId
        client_id = $TestClientId
        amount = 5000.0
        currency = "YER"
        payment_method = "official-wallet"
        idempotency_key = "topup-idem-smoke-$DateStr"
    } | ConvertTo-Json

    $Session = Invoke-RestMethod -Uri "$WltBaseUrl/payment/sessions" -Method Post -Headers $Headers -Body $TopupBody -ContentType "application/json" -UseBasicParsing
    Log-Msg "PASS: Payment session created: ID=$($Session.id), Status=$($Session.status), Amount=$($Session.amount)"

    if ($Session.status -ne "PENDING") {
        Log-Msg "FAIL: Expected session status to be 'PENDING', got $($Session.status)"
        exit 1
    }
    $SessionId = $Session.id
} catch {
    Log-Msg "FAIL: Payment session creation failed. Error: $_"
    exit 1
}

# 4. Confirm payment session (Credit client wallet)
try {
    Log-Msg "Test 4: POST confirm payment session ID=$SessionId"
    $ConfirmBody = @{
        provider_ref = "provider-ref-$DateStr"
    } | ConvertTo-Json

    # system actor is required to confirm
    $SystemHeaders = @{
        "X-Client-Id" = "system-operator"
        "X-Actor-Type" = "system"
    }

    $Confirm = Invoke-RestMethod -Uri "$WltBaseUrl/payment/sessions/$SessionId/confirm" -Method Post -Headers $SystemHeaders -Body $ConfirmBody -ContentType "application/json" -UseBasicParsing
    Log-Msg "PASS: Payment session confirmed successfully."
} catch {
    Log-Msg "FAIL: Payment session confirmation failed. Error: $_"
    exit 1
}

# 5. Verify updated wallet balance is 5000 YER
try {
    Log-Msg "Test 5: GET wallet summary after confirmation"
    $WalletAfter = Invoke-RestMethod -Uri "$WltBaseUrl/wallets/$TestClientId/summary" -Method Get -Headers $Headers -UseBasicParsing
    Log-Msg "PASS: Wallet summary retrieved successfully. Updated Balance = $($WalletAfter.balance) $($WalletAfter.currency)"

    if ($WalletAfter.balance -ne 5000.0) {
        Log-Msg "FAIL: Expected balance to be 5000, got $($WalletAfter.balance)"
        exit 1
    }
} catch {
    Log-Msg "FAIL: Query wallet summary after confirmation failed. Error: $_"
    exit 1
}

Log-Msg "WLT INTEGRATION SMOKE TEST: ALL TESTS PASSED SUCCESSFULLY!"
