Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

$IssueCode = "DOCKER_DEEP_DIAG"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path -Path $RepoRoot -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"
$ErrorsFile = Join-Path $RunRoot "errors.txt"
$WarningsFile = Join-Path $RunRoot "warnings.txt"
$Results = New-Object System.Collections.Generic.List[object]

function Write-Log {
  param([string]$Message)
  $line = "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] $Message"
  Add-Content -LiteralPath $CommandLog -Value $line -Encoding UTF8
}

function Add-Warn {
  param([string]$Message)
  Add-Content -LiteralPath $WarningsFile -Value $Message -Encoding UTF8
  Write-Host "WARN: $Message" -ForegroundColor Yellow
}

function Add-Err {
  param([string]$Message)
  Add-Content -LiteralPath $ErrorsFile -Value $Message -Encoding UTF8
  Write-Host "ERROR: $Message" -ForegroundColor Red
}

function Sanitize-Text {
  param([AllowNull()][object]$InputObject)

  $text = ($InputObject | Out-String)

  # Redact common key/value secrets while keeping enough context for diagnosis.
  $text = [regex]::Replace($text, '(?i)(password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|client[_-]?secret)\s*([:=])\s*([^\s,"'';]+)', '$1$2***REDACTED***')
  $text = [regex]::Replace($text, '(?i)(POSTGRES_PASSWORD|PGPASSWORD|DATABASE_URL|DB_PASSWORD|JWT_SECRET|AUTH_SECRET|NEXTAUTH_SECRET|EXPO_TOKEN)\s*=\s*([^\s,"'';]+)', '$1=***REDACTED***')
  $text = [regex]::Replace($text, '(?i)(postgres(?:ql)?://[^:\s/@]+):([^@\s]+)@', '$1:***REDACTED***@')
  $text = [regex]::Replace($text, '(?i)(mongodb(?:\+srv)?://[^:\s/@]+):([^@\s]+)@', '$1:***REDACTED***@')
  $text = [regex]::Replace($text, '(?i)(Bearer\s+)[A-Za-z0-9\-\._~\+\/]+=*', '$1***REDACTED***')

  return $text
}

function Write-OutputFile {
  param(
    [string]$FileName,
    [AllowNull()][object]$Content
  )
  $path = Join-Path $RunRoot $FileName
  $safe = Sanitize-Text $Content
  $safe | Out-File -LiteralPath $path -Encoding UTF8
  return $path
}

function Invoke-NativeCapture {
  param(
    [string]$Name,
    [string]$FileName,
    [string]$Exe,
    [string[]]$Args = @(),
    [switch]$AllowFail
  )

  $outPath = Join-Path $RunRoot $FileName
  $cmdText = "$Exe $($Args -join ' ')"
  Write-Log "RUN native: $Name :: $cmdText"

  $exitCode = 0
  $output = $null
  $started = Get-Date

  try {
    $script:LASTEXITCODE = 0
    $output = & $Exe @Args 2>&1
    $exitCode = if ($null -ne $LASTEXITCODE) { [int]$LASTEXITCODE } else { 0 }
  } catch {
    $output = $_ | Out-String
    $exitCode = 999
  }

  $ended = Get-Date
  $durationMs = [int](New-TimeSpan -Start $started -End $ended).TotalMilliseconds
  $safe = Sanitize-Text $output
  $header = @(
    "NAME: $Name"
    "COMMAND: $cmdText"
    "EXIT_CODE: $exitCode"
    "STARTED_AT: $($started.ToString('o'))"
    "ENDED_AT: $($ended.ToString('o'))"
    "DURATION_MS: $durationMs"
    ""
    "OUTPUT:"
    "-------"
  ) -join [Environment]::NewLine
  "$header`n$safe" | Out-File -LiteralPath $outPath -Encoding UTF8

  $status = if ($exitCode -eq 0) { "PASS" } elseif ($AllowFail) { "WARN" } else { "FAIL" }
  $Results.Add([pscustomobject]@{
    name = $Name
    command = $cmdText
    exit_code = $exitCode
    status = $status
    output_file = $FileName
    duration_ms = $durationMs
  }) | Out-Null

  if (($exitCode -ne 0) -and (-not $AllowFail)) {
    Add-Err "$Name failed. See $FileName"
  } elseif (($exitCode -ne 0) -and $AllowFail) {
    Add-Warn "$Name returned non-zero exit code $exitCode. See $FileName"
  }

  return [pscustomobject]@{
    ExitCode = $exitCode
    Output = $output
    File = $outPath
    Status = $status
  }
}

function Invoke-PSCapture {
  param(
    [string]$Name,
    [string]$FileName,
    [scriptblock]$Command,
    [switch]$AllowFail
  )

  $outPath = Join-Path $RunRoot $FileName
  Write-Log "RUN powershell: $Name"
  $exitCode = 0
  $output = $null
  $started = Get-Date

  try {
    $output = & $Command 2>&1
    $exitCode = 0
  } catch {
    $output = $_ | Out-String
    $exitCode = 999
  }

  $ended = Get-Date
  $durationMs = [int](New-TimeSpan -Start $started -End $ended).TotalMilliseconds
  $safe = Sanitize-Text $output
  $header = @(
    "NAME: $Name"
    "COMMAND_TYPE: PowerShell ScriptBlock"
    "EXIT_CODE: $exitCode"
    "STARTED_AT: $($started.ToString('o'))"
    "ENDED_AT: $($ended.ToString('o'))"
    "DURATION_MS: $durationMs"
    ""
    "OUTPUT:"
    "-------"
  ) -join [Environment]::NewLine
  "$header`n$safe" | Out-File -LiteralPath $outPath -Encoding UTF8

  $status = if ($exitCode -eq 0) { "PASS" } elseif ($AllowFail) { "WARN" } else { "FAIL" }
  $Results.Add([pscustomobject]@{
    name = $Name
    command = "PowerShell ScriptBlock"
    exit_code = $exitCode
    status = $status
    output_file = $FileName
    duration_ms = $durationMs
  }) | Out-Null

  if (($exitCode -ne 0) -and (-not $AllowFail)) {
    Add-Err "$Name failed. See $FileName"
  } elseif (($exitCode -ne 0) -and $AllowFail) {
    Add-Warn "$Name returned non-zero exit code $exitCode. See $FileName"
  }

  return [pscustomobject]@{
    ExitCode = $exitCode
    Output = $output
    File = $outPath
    Status = $status
  }
}

function Get-SafeFileName {
  param([string]$Name)
  $safe = $Name -replace '[\\/:*?"<>|= ]+', '_'
  $safe = $safe.Trim('_')
  if ([string]::IsNullOrWhiteSpace($safe)) { return "unnamed" }
  if ($safe.Length -gt 120) { return $safe.Substring(0,120) }
  return $safe
}

Write-Host ""
Write-Host "BThwani Docker Deep Diagnostics" -ForegroundColor Cyan
Write-Host "Repo: $RepoRoot"
Write-Host "Evidence: $RunRoot"
Write-Host ""

"Started: $((Get-Date).ToString('o'))" | Out-File -LiteralPath $CommandLog -Encoding UTF8
"Script mode: READ_ONLY_DIAGNOSTIC. No containers/images/volumes/networks will be stopped, removed, restarted, or modified." | Out-File -LiteralPath (Join-Path $RunRoot "README.txt") -Encoding UTF8
"" | Out-File -LiteralPath $ErrorsFile -Encoding UTF8
"" | Out-File -LiteralPath $WarningsFile -Encoding UTF8

# 1) Git and host baseline
Invoke-NativeCapture -Name "git status short" -FileName "git-status-short.txt" -Exe "git" -Args @("--no-pager","status","--short") -AllowFail | Out-Null
Invoke-NativeCapture -Name "git branch current" -FileName "git-branch-current.txt" -Exe "git" -Args @("branch","--show-current") -AllowFail | Out-Null
Invoke-NativeCapture -Name "git head sha" -FileName "git-head-sha.txt" -Exe "git" -Args @("rev-parse","HEAD") -AllowFail | Out-Null

Invoke-PSCapture -Name "powershell version" -FileName "powershell-version.txt" -Command { $PSVersionTable | Format-List * } -AllowFail | Out-Null
Invoke-PSCapture -Name "windows host summary" -FileName "windows-host-summary.txt" -Command {
  $os = Get-CimInstance Win32_OperatingSystem
  $cs = Get-CimInstance Win32_ComputerSystem
  $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
  [pscustomobject]@{
    ComputerName = $env:COMPUTERNAME
    OS = $os.Caption
    Version = $os.Version
    BuildNumber = $os.BuildNumber
    TotalMemoryGB = [math]::Round($cs.TotalPhysicalMemory / 1GB, 2)
    FreeMemoryGB = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
    CPU = $cpu.Name
    LogicalProcessors = $cpu.NumberOfLogicalProcessors
    TimeZone = (Get-TimeZone).Id
    Now = (Get-Date).ToString("o")
  } | Format-List *
} -AllowFail | Out-Null

# 2) Docker Desktop / WSL / services
Invoke-PSCapture -Name "docker related services" -FileName "docker-related-services.txt" -Command {
  Get-Service |
    Where-Object { $_.Name -match 'docker|com\.docker|wsl' -or $_.DisplayName -match 'docker|container|wsl' } |
    Sort-Object Name |
    Select-Object Name, DisplayName, Status, StartType
} -AllowFail | Out-Null

Invoke-PSCapture -Name "docker related processes" -FileName "docker-related-processes.txt" -Command {
  Get-Process |
    Where-Object { $_.ProcessName -match 'docker|com\.docker|dockerd|containerd|wsl|vmmem' } |
    Sort-Object ProcessName |
    Select-Object ProcessName, Id, CPU, WorkingSet64, StartTime -ErrorAction SilentlyContinue
} -AllowFail | Out-Null

Invoke-NativeCapture -Name "wsl status" -FileName "wsl-status.txt" -Exe "wsl" -Args @("--status") -AllowFail | Out-Null
Invoke-NativeCapture -Name "wsl distros verbose" -FileName "wsl-distros-verbose.txt" -Exe "wsl" -Args @("-l","-v") -AllowFail | Out-Null

# 3) Docker core
$dockerVersion = Invoke-NativeCapture -Name "docker version" -FileName "docker-version.txt" -Exe "docker" -Args @("version") -AllowFail
$dockerInfo = Invoke-NativeCapture -Name "docker info" -FileName "docker-info.txt" -Exe "docker" -Args @("info") -AllowFail
Invoke-NativeCapture -Name "docker context ls" -FileName "docker-context-ls.txt" -Exe "docker" -Args @("context","ls") -AllowFail | Out-Null
Invoke-NativeCapture -Name "docker context inspect" -FileName "docker-context-inspect.txt" -Exe "docker" -Args @("context","inspect") -AllowFail | Out-Null
Invoke-NativeCapture -Name "docker compose version" -FileName "docker-compose-version.txt" -Exe "docker" -Args @("compose","version") -AllowFail | Out-Null
Invoke-NativeCapture -Name "docker system df verbose" -FileName "docker-system-df-v.txt" -Exe "docker" -Args @("system","df","-v") -AllowFail | Out-Null
Invoke-NativeCapture -Name "docker builder ls" -FileName "docker-builder-ls.txt" -Exe "docker" -Args @("builder","ls") -AllowFail | Out-Null

# 4) Docker inventory
Invoke-NativeCapture -Name "docker ps all" -FileName "docker-ps-a.txt" -Exe "docker" -Args @("ps","-a","--no-trunc") -AllowFail | Out-Null
Invoke-NativeCapture -Name "docker ps all formatted" -FileName "docker-ps-a-formatted.txt" -Exe "docker" -Args @("ps","-a","--format","table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}\t{{.Labels}}") -AllowFail | Out-Null
Invoke-NativeCapture -Name "docker images" -FileName "docker-images.txt" -Exe "docker" -Args @("images","--digests","--no-trunc") -AllowFail | Out-Null
Invoke-NativeCapture -Name "docker volume ls" -FileName "docker-volume-ls.txt" -Exe "docker" -Args @("volume","ls") -AllowFail | Out-Null
Invoke-NativeCapture -Name "docker network ls" -FileName "docker-network-ls.txt" -Exe "docker" -Args @("network","ls") -AllowFail | Out-Null
Invoke-NativeCapture -Name "docker stats no stream" -FileName "docker-stats-no-stream.txt" -Exe "docker" -Args @("stats","--no-stream","--all") -AllowFail | Out-Null

# 5) IDs and detailed inspect/logs
$containerIds = @()
try {
  $containerIds = @(& docker ps -aq 2>$null | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
} catch {
  Add-Warn "Unable to list container IDs."
}

$containerIds | Out-File -LiteralPath (Join-Path $RunRoot "container-ids.txt") -Encoding UTF8

if ($containerIds.Count -gt 0) {
  Invoke-NativeCapture -Name "docker inspect containers redacted" -FileName "docker-inspect-containers-redacted.json" -Exe "docker" -Args (@("inspect") + $containerIds) -AllowFail | Out-Null

  $containerDir = Join-Path $RunRoot "containers"
  New-Item -ItemType Directory -Force -Path $containerDir | Out-Null

  foreach ($id in $containerIds) {
    $name = ""
    try {
      $name = (& docker inspect --format "{{.Name}}" $id 2>$null) -replace '^/',''
    } catch {
      $name = $id
    }
    $safeName = Get-SafeFileName "$name-$id"
    $oldRunRoot = $RunRoot
    $RunRoot = $containerDir
    Invoke-NativeCapture -Name "container $name port" -FileName "$safeName-port.txt" -Exe "docker" -Args @("port",$id) -AllowFail | Out-Null
    Invoke-NativeCapture -Name "container $name logs tail" -FileName "$safeName-logs-tail-300.txt" -Exe "docker" -Args @("logs","--tail","300",$id) -AllowFail | Out-Null
    Invoke-NativeCapture -Name "container $name inspect" -FileName "$safeName-inspect-redacted.json" -Exe "docker" -Args @("inspect",$id) -AllowFail | Out-Null
    $RunRoot = $oldRunRoot
  }
} else {
  Add-Warn "No Docker containers found by docker ps -aq."
}

# 6) Volume/network inspect
$volumeNames = @()
try {
  $volumeNames = @(& docker volume ls -q 2>$null | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
} catch {
  Add-Warn "Unable to list Docker volume names."
}

if ($volumeNames.Count -gt 0) {
  Invoke-NativeCapture -Name "docker volume inspect all" -FileName "docker-volume-inspect-redacted.json" -Exe "docker" -Args (@("volume","inspect") + $volumeNames) -AllowFail | Out-Null
}

$networkNames = @()
try {
  $networkNames = @(& docker network ls --format "{{.Name}}" 2>$null | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
} catch {
  Add-Warn "Unable to list Docker network names."
}

if ($networkNames.Count -gt 0) {
  Invoke-NativeCapture -Name "docker network inspect all" -FileName "docker-network-inspect-redacted.json" -Exe "docker" -Args (@("network","inspect") + $networkNames) -AllowFail | Out-Null
}

# 7) Compose file discovery and config validation
$composeFiles = @()
try {
  $composeFiles = Get-ChildItem -LiteralPath $RepoRoot -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
      $_.FullName -notmatch '\\node_modules\\|\\.git\\|\\tools\\registry\\runs\\|\\dist\\|\\build\\|\\.next\\|\\.expo\\' -and
      $_.Name -match '(^docker-compose|compose).*\.(ya?ml)$|docker-compose\..*\.(ya?ml)$'
    } |
    Sort-Object FullName
} catch {
  Add-Warn "Compose file discovery failed: $($_.Exception.Message)"
}

$composeFiles | Select-Object FullName, Length, LastWriteTime |
  Format-Table -AutoSize |
  Out-File -LiteralPath (Join-Path $RunRoot "compose-files-discovered.txt") -Encoding UTF8

$composeDir = Join-Path $RunRoot "compose"
New-Item -ItemType Directory -Force -Path $composeDir | Out-Null

$composeCounter = 0
foreach ($file in $composeFiles) {
  $composeCounter++
  if ($composeCounter -gt 60) {
    Add-Warn "Compose validation capped at 60 files to avoid excessive output."
    break
  }

  $relative = Resolve-Path -LiteralPath $file.FullName -Relative
  $safeName = Get-SafeFileName ($relative -replace '^\.\\', '')
  $oldRunRoot = $RunRoot
  $RunRoot = $composeDir

  Invoke-NativeCapture -Name "compose config $relative" -FileName "$safeName-config-redacted.txt" -Exe "docker" -Args @("compose","-f",$file.FullName,"config") -AllowFail | Out-Null
  Invoke-NativeCapture -Name "compose ps $relative" -FileName "$safeName-ps.txt" -Exe "docker" -Args @("compose","-f",$file.FullName,"ps") -AllowFail | Out-Null

  $RunRoot = $oldRunRoot
}

# 8) DSH expected Docker baseline
$dshCompose = Join-Path $RepoRoot "dsh\backend\docker-compose.local.yml"
if (Test-Path -LiteralPath $dshCompose) {
  Invoke-NativeCapture -Name "DSH compose config" -FileName "dsh-compose-config-redacted.txt" -Exe "docker" -Args @("compose","-f",$dshCompose,"config") -AllowFail | Out-Null
  Invoke-NativeCapture -Name "DSH compose ps" -FileName "dsh-compose-ps.txt" -Exe "docker" -Args @("compose","-f",$dshCompose,"ps") -AllowFail | Out-Null
  Invoke-NativeCapture -Name "DSH compose logs tail" -FileName "dsh-compose-logs-tail-300.txt" -Exe "docker" -Args @("compose","-f",$dshCompose,"logs","--tail","300") -AllowFail | Out-Null
} else {
  Add-Warn "Expected DSH compose file not found: $dshCompose"
}

# 9) DSH Postgres container and database probe
$expectedPgContainer = "bthwani-dsh-postgres-local"
Invoke-NativeCapture -Name "DSH postgres inspect expected container" -FileName "dsh-postgres-container-inspect-redacted.json" -Exe "docker" -Args @("inspect",$expectedPgContainer) -AllowFail | Out-Null
Invoke-NativeCapture -Name "DSH postgres logs expected container tail" -FileName "dsh-postgres-container-logs-tail-300.txt" -Exe "docker" -Args @("logs","--tail","300",$expectedPgContainer) -AllowFail | Out-Null
Invoke-NativeCapture -Name "DSH postgres pg_isready" -FileName "dsh-postgres-pg-isready.txt" -Exe "docker" -Args @("exec",$expectedPgContainer,"pg_isready","-U","dsh_local","-d","dsh_local") -AllowFail | Out-Null
Invoke-NativeCapture -Name "DSH postgres SQL identity" -FileName "dsh-postgres-sql-identity.txt" -Exe "docker" -Args @("exec","-e","PGPASSWORD=dsh_local_password",$expectedPgContainer,"psql","-U","dsh_local","-d","dsh_local","-c","select version(), current_database(), current_user;") -AllowFail | Out-Null
Invoke-NativeCapture -Name "DSH postgres SQL table inventory" -FileName "dsh-postgres-sql-table-inventory.txt" -Exe "docker" -Args @("exec","-e","PGPASSWORD=dsh_local_password",$expectedPgContainer,"psql","-U","dsh_local","-d","dsh_local","-c","select schemaname, tablename from pg_tables where schemaname not in ('pg_catalog','information_schema') order by schemaname, tablename limit 300;") -AllowFail | Out-Null
Invoke-NativeCapture -Name "DSH postgres SQL index inventory" -FileName "dsh-postgres-sql-index-inventory.txt" -Exe "docker" -Args @("exec","-e","PGPASSWORD=dsh_local_password",$expectedPgContainer,"psql","-U","dsh_local","-d","dsh_local","-c","select schemaname, tablename, indexname from pg_indexes where schemaname not in ('pg_catalog','information_schema') order by schemaname, tablename, indexname limit 500;") -AllowFail | Out-Null

# 10) Port and endpoint probes
Invoke-PSCapture -Name "local listening ports target set" -FileName "local-listening-ports-target-set.txt" -Command {
  $ports = @(3000,5432,55432,8080,8081,8082,8083,8084)
  Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object { $ports -contains $_.LocalPort } |
    Sort-Object LocalPort, OwningProcess |
    Select-Object LocalAddress, LocalPort, OwningProcess,
      @{Name='ProcessName';Expression={ try { (Get-Process -Id $_.OwningProcess -ErrorAction Stop).ProcessName } catch { "" } }}
} -AllowFail | Out-Null

Invoke-NativeCapture -Name "netstat target ports" -FileName "netstat-target-ports.txt" -Exe "cmd.exe" -Args @("/c",'netstat -ano | findstr /R ":3000 :5432 :55432 :8080 :8081 :8082 :8083 :8084"') -AllowFail | Out-Null

Invoke-PSCapture -Name "Test-NetConnection target ports" -FileName "test-netconnection-target-ports.txt" -Command {
  $ports = @(3000,5432,55432,8080,8081,8082,8083,8084)
  foreach ($p in $ports) {
    Test-NetConnection -ComputerName 127.0.0.1 -Port $p -InformationLevel Detailed |
      Select-Object ComputerName, RemoteAddress, RemotePort, TcpTestSucceeded
  }
} -AllowFail | Out-Null

Invoke-PSCapture -Name "HTTP endpoint probes" -FileName "http-endpoint-probes.txt" -Command {
  $targets = @(
    "http://127.0.0.1:8080/stores",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:8082",
    "http://127.0.0.1:8083",
    "http://127.0.0.1:8084"
  )
  foreach ($url in $targets) {
    try {
      $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
      [pscustomobject]@{
        url = $url
        status = "PASS"
        status_code = [int]$resp.StatusCode
        content_length = if ($null -ne $resp.Content) { $resp.Content.Length } else { 0 }
      }
    } catch {
      [pscustomobject]@{
        url = $url
        status = "WARN"
        error = $_.Exception.Message
      }
    }
  }
} -AllowFail | Out-Null

# 11) Docker events recent, non-streaming
$since = (Get-Date).AddHours(-6).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
Invoke-NativeCapture -Name "docker events last 6 hours" -FileName "docker-events-last-6-hours.txt" -Exe "docker" -Args @("events","--since",$since,"--until","0s") -AllowFail | Out-Null

# 12) Health summary parsed from inspect when possible
Invoke-PSCapture -Name "parsed container health summary" -FileName "parsed-container-health-summary.txt" -Command {
  $ids = @(& docker ps -aq 2>$null | Where-Object { $_ })
  foreach ($cid in $ids) {
    $raw = & docker inspect $cid 2>$null
    $obj = $raw | ConvertFrom-Json
    foreach ($c in $obj) {
      [pscustomobject]@{
        Id = $c.Id.Substring(0,12)
        Name = ($c.Name -replace '^/','')
        Image = $c.Config.Image
        State = $c.State.Status
        Running = $c.State.Running
        Restarting = $c.State.Restarting
        OOMKilled = $c.State.OOMKilled
        Dead = $c.State.Dead
        ExitCode = $c.State.ExitCode
        Health = if ($null -ne $c.State.Health) { $c.State.Health.Status } else { "none" }
        StartedAt = $c.State.StartedAt
        FinishedAt = $c.State.FinishedAt
      }
    }
  }
} -AllowFail | Out-Null

# 13) Generate machine evidence and human summary
$failCount = @($Results | Where-Object { $_.status -eq "FAIL" }).Count
$warnCount = @($Results | Where-Object { $_.status -eq "WARN" }).Count
$passCount = @($Results | Where-Object { $_.status -eq "PASS" }).Count

$overall = if ($failCount -gt 0) {
  "FAIL"
} elseif ($warnCount -gt 0) {
  "PASS_WITH_WARNINGS"
} else {
  "PASS"
}

$evidence = [pscustomobject]@{
  status = $overall
  issue_code = $IssueCode
  session_id = $SessionId
  repo = $RepoRoot
  evidence_root = $RunRoot
  started_at = (Get-Item -LiteralPath $CommandLog).CreationTime.ToString("o")
  completed_at = (Get-Date).ToString("o")
  read_only = $true
  docker_mutation_performed = $false
  checks = $Results
  counts = [pscustomobject]@{
    pass = $passCount
    warn = $warnCount
    fail = $failCount
  }
  key_targets = [pscustomobject]@{
    dsh_compose = $dshCompose
    expected_postgres_container = $expectedPgContainer
    expected_postgres_port = 55432
    expected_api_port = 8080
    expected_control_panel_port = 3000
    expected_mobile_ports = @(8081,8082,8083,8084)
  }
}

($evidence | ConvertTo-Json -Depth 8) | Out-File -LiteralPath (Join-Path $RunRoot "evidence.json") -Encoding UTF8

$summary = @"
# BThwani Docker Deep Diagnostics

Status: $overall

Session: $SessionId
Repo: $RepoRoot
Evidence root: $RunRoot
Mode: READ_ONLY_DIAGNOSTIC
Docker mutation performed: false

## What this script checked

- Git/local baseline.
- Windows/PowerShell host summary.
- Docker Desktop services and processes.
- WSL status and distributions.
- Docker CLI/daemon/context/info.
- Docker Compose availability.
- Docker containers, logs, ports, stats, and health.
- Docker images, volumes, networks, disk usage.
- Compose files discovered inside repo with `docker compose config` validation.
- DSH canonical compose file: `dsh\backend\docker-compose.local.yml`.
- Expected DSH PostgreSQL container: `$expectedPgContainer`.
- PostgreSQL readiness, identity, table inventory, index inventory.
- Local ports: 3000, 5432, 55432, 8080, 8081, 8082, 8083, 8084.
- HTTP probes for API/control-panel/Metro ports when reachable.
- Docker events from last 6 hours.

## Result counts

- PASS: $passCount
- WARN: $warnCount
- FAIL: $failCount

## How to read the result

- `PASS`: command completed successfully.
- `WARN`: diagnostic command failed or endpoint unavailable, but the script continued.
- `FAIL`: core diagnostic command failed unexpectedly.
- This script does not prove project readiness. It proves Docker/local runtime condition only.
- For app readiness, run DSH/WLT journey smoke tests and visual/runtime evidence separately.

## Key files

- `evidence.json`
- `commands.log`
- `warnings.txt`
- `errors.txt`
- `docker-info.txt`
- `docker-ps-a-formatted.txt`
- `parsed-container-health-summary.txt`
- `dsh-compose-ps.txt`
- `dsh-postgres-pg-isready.txt`
- `test-netconnection-target-ports.txt`
- `http-endpoint-probes.txt`

"@

$summary | Out-File -LiteralPath (Join-Path $RunRoot "SUMMARY.md") -Encoding UTF8

# 14) Package evidence ZIP using current adopted naming: {SESSION_ID}.zip
$ZipPath = Join-Path $RunRoot "$SessionId.zip"
if (Test-Path -LiteralPath $ZipPath) {
  Remove-Item -LiteralPath $ZipPath -Force
}

$items = Get-ChildItem -LiteralPath $RunRoot -Force | Where-Object { $_.Name -ne "$SessionId.zip" }
if ($items.Count -gt 0) {
  Compress-Archive -LiteralPath $items.FullName -DestinationPath $ZipPath -Force
} else {
  Add-Warn "No evidence items found to compress."
}

Write-Host ""
Write-Host "Docker diagnostics completed." -ForegroundColor Cyan
Write-Host "Status: $overall"
Write-Host "Evidence root: $RunRoot"
Write-Host "Evidence ZIP: $ZipPath"
Write-Host ""
Write-Host "Upload this ZIP for review if needed:" -ForegroundColor Green
Write-Host $ZipPath
Write-Host ""
