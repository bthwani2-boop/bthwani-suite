param(
  [string]$RepoRoot = "C:\bthwani-suite"
)

$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $RepoRoot

$SESSION_ID = "PLATFORM_CONTROL_PLANE_DIAG-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RUN_DIR = Join-Path "tools\registry\runs" $SESSION_ID
New-Item -ItemType Directory -Force -Path $RUN_DIR | Out-Null

function Save-Cmd {
  param(
    [string]$Name,
    [scriptblock]$Command
  )
  $out = Join-Path $RUN_DIR $Name
  try {
    & $Command 2>&1 | Out-File $out -Encoding utf8
  } catch {
    $_ | Out-File $out -Encoding utf8
  }
}

Save-Cmd "git-branch.txt" { git --no-pager branch --show-current }
Save-Cmd "git-status.txt" { git --no-pager status --short }
Save-Cmd "platform-files.txt" { git ls-files "dsh/frontend/control-panel/platform/*" }
Save-Cmd "platform-control-references.txt" { git grep -n "dsh/frontend/control-panel/control\|from './control'\|ControlPanelDshControl" -- . }
Save-Cmd "platform-tech-identifiers.txt" { git grep -n "provider\.\|wlt\.\|VAR_\|RuntimeVar\|OpenAPI\|Entity" -- dsh/frontend/control-panel/platform }
Save-Cmd "appearance-forbidden-terms.txt" { git grep -n "Campaign\|Seasonal\|Marketing\|Eid\|promo\|offer\|حملة\|موسمي\|تسويق\|عرض" -- dsh/frontend/control-panel/platform/Appearance }
Save-Cmd "platform-secret-like.txt" { git grep -n "apiKey\|api_key\|secret\|token\|sk-\|AIza\|AKIA\|BEGIN PRIVATE KEY" -- dsh/frontend/control-panel/platform }
Save-Cmd "platform-hardcoded-colors.txt" { git grep -n "backgroundColor: '#\|color: '#\|borderColor: '#" -- dsh/frontend/control-panel/platform }
Save-Cmd "governance-existing.txt" { git ls-files "governance/*" }

@"
# Diagnosis Summary Template

Fill manually after reviewing evidence:

- Current platform shell:
- Current UI problem:
- Technical labels visible:
- Deprecated control path:
- Appearance marketing contamination:
- Secrets/API key risk:
- Hardcoded color risk:
- Missing workspaces:
- Recommended next action:
"@ | Out-File (Join-Path $RUN_DIR "DIAGNOSIS_SUMMARY_TEMPLATE.md") -Encoding utf8

Compress-Archive -Path "$RUN_DIR\*" -DestinationPath "$RUN_DIR\$SESSION_ID.zip" -Force

Write-Host "Diagnosis evidence written to: $RUN_DIR"
Write-Host "ZIP: $RUN_DIR\$SESSION_ID.zip"
