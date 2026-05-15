Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_DSH_TOTAL_COVERAGE_INVENTORY"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RunRoot = Join-Path (Get-Location).Path ("tools\registry\runs\" + $SessionId)
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$Roots = @(
  "dsh\frontend\app-client",
  "dsh\frontend\app-partner",
  "dsh\frontend\app-captain",
  "dsh\frontend\app-field",
  "dsh\frontend\control-panel",
  "dsh\frontend\shared",
  "dsh\docs",
  "wlt\frontend\app-client\dsh",
  "wlt\frontend\app-partner\dsh",
  "wlt\frontend\app-captain\dsh",
  "wlt\frontend\app-field\dsh",
  "wlt\frontend\shared\finance",
  "control-panel\shell",
  "control-panel\runtime",
  "app-client\shell",
  "app-client\composition",
  "app-partner\shell",
  "app-partner\composition",
  "app-captain\shell",
  "app-captain\composition",
  "app-field\shell",
  "app-field\composition"
)

$ExistingRoots = $Roots | Where-Object { Test-Path -LiteralPath $_ }

$Files = foreach ($Root in $ExistingRoots) {
  Get-ChildItem -LiteralPath $Root -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.md,*.json,*.css,*.yaml,*.yml |
    Where-Object { $_.FullName -notmatch "\\node_modules\\|\\.next\\|\\dist\\|\\build\\|\\coverage\\" }
}

function Get-RelPath {
  param([string]$Path)
  return ([IO.Path]::GetRelativePath((Get-Location).Path, $Path) -replace "\\", "/")
}

function Get-Surface {
  param([string]$Rel)
  if ($Rel -match "^dsh/frontend/app-client/") { return "app-client" }
  if ($Rel -match "^dsh/frontend/app-partner/") { return "app-partner" }
  if ($Rel -match "^dsh/frontend/app-captain/") { return "app-captain" }
  if ($Rel -match "^dsh/frontend/app-field/") { return "app-field" }
  if ($Rel -match "^dsh/frontend/control-panel/") { return "control-panel" }
  if ($Rel -match "^dsh/docs/") { return "dsh-docs" }
  if ($Rel -match "^wlt/frontend/") { return "wlt-bridge" }
  if ($Rel -match "^(app-client|app-partner|app-captain|app-field|control-panel)/(shell|composition|runtime)") { return "mounting-runtime" }
  return "other"
}

function Get-Role {
  param([string]$Rel, [string]$Text)
  if ($Rel -match "Screen\.tsx$") { return "REAL_SCREEN_CANDIDATE" }
  if ($Rel -match "Workspace.*\.tsx$|workspace") { return "WORKSPACE_CANDIDATE" }
  if ($Rel -match "fixtures?|preview-data|mock|demo") { return "FIXTURE_PREVIEW_DATA" }
  if ($Rel -match "routes?|registry|surface-meta|flow-meta|ClosureMap") { return "ROUTE_META_OR_MAP" }
  if ($Rel -match "bridge|adapter|contract|wlt") { return "BRIDGE_CONTRACT" }
  if ($Rel -match "parts|components|section|panel|sheet|drawer") { return "SECTION_OR_PART_CANDIDATE" }
  if ($Rel -match "index\.ts$") { return "INDEX_PUBLIC_OR_BARREL" }
  if ($Rel -match "\.md$|\.yaml$|\.yml$") { return "DOC" }
  return "UNKNOWN"
}

$Inventory = foreach ($File in $Files) {
  $Rel = Get-RelPath $File.FullName
  $Text = Get-Content -Raw -LiteralPath $File.FullName -ErrorAction SilentlyContinue
  $ImportCount = ([regex]::Matches($Text, "(?m)^\s*import\s+")).Count
  $ExportCount = ([regex]::Matches($Text, "(?m)^\s*export\s+")).Count
  $Surface = Get-Surface $Rel
  $Role = Get-Role $Rel $Text

  [pscustomobject]@{
    path = $Rel
    surface = $Surface
    area = ($Rel -split "/")[0..([Math]::Min(2, (($Rel -split "/").Count - 1)))] -join "/"
    file_name = Split-Path $Rel -Leaf
    detected_role = $Role
    classification = "TBD"
    imports_count = $ImportCount
    exports_count = $ExportCount
    route_reference = [bool]($Text -match "route|screenId|screen_id|navigate|href|tab|segment")
    screen_id_guess = if ($Text -match "screenId\s*[:=]\s*['""]([^'""]+)['""]") { $Matches[1] } else { "" }
    owner_guess = if ($Text -match "ownerId\s*[:=]\s*['""]([^'""]+)['""]") { $Matches[1] } else { "" }
    used_by_guess = ""
    duplication_risk = "TBD"
    dead_risk = "TBD"
    notes = ""
  }
}

$Inventory | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $RunRoot "DSH_EXISTING_COVERAGE_INVENTORY.raw.csv")

$DuplicateNames = $Inventory |
  Group-Object file_name |
  Where-Object { $_.Count -gt 1 } |
  ForEach-Object {
    [pscustomobject]@{
      candidate_id = "DUP-" + ([guid]::NewGuid().ToString("N").Substring(0,8))
      path = ($_.Group.path -join " | ")
      reason = "same file name appears multiple times"
      classification = "DUPLICATE_CANDIDATE"
      recommended_action = "REVIEW_BEFORE_ANY_MOVE_OR_DELETE"
      needs_human_review = "true"
      delete_safe_now = "false"
      notes = "Duplicate filename group: $($_.Name)"
    }
  }

$DuplicateNames | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $RunRoot "DSH_DUPLICATE_DEAD_NOISE_CANDIDATES.raw.csv")

git --no-pager status --short | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-status.txt")
git --no-pager diff --stat | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-stat.txt")
git --no-pager diff --name-status | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-name-status.txt")
git --no-pager diff --check 2>&1 | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-diff-check.txt")
git ls-files --others --exclude-standard | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "git-untracked.txt")

$Summary = [pscustomobject]@{
  session_id = $SessionId
  mode = "READ_ONLY_INVENTORY"
  scanned_files = ($Inventory | Measure-Object).Count
  screen_candidates = ($Inventory | Where-Object { $_.detected_role -eq "REAL_SCREEN_CANDIDATE" } | Measure-Object).Count
  fixture_preview_files = ($Inventory | Where-Object { $_.detected_role -eq "FIXTURE_PREVIEW_DATA" } | Measure-Object).Count
  duplicate_filename_groups = ($DuplicateNames | Measure-Object).Count
  result = "NEEDS_AGENT_CLASSIFICATION"
}

$Summary | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "evidence.json")

@"
# DSH Total Coverage Inventory

Session: $SessionId
Mode: READ_ONLY_INVENTORY
Result: NEEDS_AGENT_CLASSIFICATION

This script does not modify source files. It only writes evidence under:
$RunRoot

Next:
- Agent must use raw CSVs to prepare closure docs.
- Do not delete/move/rename until classification is reviewed.
"@ | Set-Content -Encoding UTF8 -Path (Join-Path $RunRoot "SUMMARY.md")

$ZipPath = Join-Path $RunRoot ($SessionId + ".zip")
Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath -Force

Write-Host ""
Write-Host "=== DSH TOTAL COVERAGE INVENTORY ===" -ForegroundColor Cyan
Write-Host "SESSION_ID : $SessionId"
Write-Host "RUN_ROOT   : $RunRoot"
Write-Host "ZIP        : $ZipPath"
Write-Host "RESULT     : NEEDS_AGENT_CLASSIFICATION"
