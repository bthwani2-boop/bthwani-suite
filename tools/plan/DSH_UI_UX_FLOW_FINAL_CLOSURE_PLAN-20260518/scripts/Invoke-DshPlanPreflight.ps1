param(
  [string]$RepoRoot = "C:\bthwani-suite"
)
$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $RepoRoot
$SessionId = "DSH_PLAN_PREFLIGHT-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunDir = Join-Path ".\tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $RunDir | Out-Null

$required = @(
  "AGENTS.md",
  "dsh\SERVICE_BLUEPRINT.md",
  "governance\PLATFORM_BLUEPRINT.md",
  "dsh\docs\closure\DSH_MISSING_LOGIC_AND_UI_GAPS.csv",
  "dsh\docs\closure\DSH_SCREEN_INVENTORY.csv",
  "dsh\docs\closure\DSH_ROUTE_STATE_CTA_MATRIX.csv",
  "dsh\docs\closure\DSH_UI_REVIEW_QUEUE.md",
  "dsh\docs\closure\DSH_VISUAL_REVIEW_READINESS_CHECKLIST.md",
  "dsh\docs\RUNTIME_EVIDENCE_MATRIX.md",
  "dsh\docs\SCREEN_API_MATRIX.md"
)
$missing = @()
foreach ($p in $required) { if (!(Test-Path -LiteralPath $p)) { $missing += $p } }
$missing | Out-File -Encoding utf8 (Join-Path $RunDir "missing-required-files.txt")
if ($missing.Count -gt 0) { throw "Missing required files. See $RunDir\missing-required-files.txt" }

git --no-pager branch --show-current | Tee-Object -FilePath (Join-Path $RunDir "branch.txt")
git --no-pager status --short | Tee-Object -FilePath (Join-Path $RunDir "git-status.txt")

"=== Agent files ===" | Tee-Object -FilePath (Join-Path $RunDir "agent-files.txt")
Get-ChildItem -Recurse -File -Path ".agents" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName | Tee-Object -Append -FilePath (Join-Path $RunDir "agent-files.txt")
Get-ChildItem -File -Path . -Include "AGENTS.md","CLAUDE.md","GEMINI.md" | Select-Object -ExpandProperty FullName | Tee-Object -Append -FilePath (Join-Path $RunDir "agent-files.txt")

"=== Forbidden/current risk scan ===" | Tee-Object -FilePath (Join-Path $RunDir "risk-scan.txt")
rg -n "closure-workspaces|ClosureWorkspace|Ops-side partner activation|ops approval|ops-dependency|Runtime_READY|PRODUCTION_READY" dsh/frontend dsh/docs 2>&1 | Tee-Object -Append -FilePath (Join-Path $RunDir "risk-scan.txt")

"Preflight evidence: $RunDir"
