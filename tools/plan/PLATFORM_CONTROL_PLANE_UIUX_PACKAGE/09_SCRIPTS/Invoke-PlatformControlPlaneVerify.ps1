param(
  [string]$RepoRoot = "C:\bthwani-suite"
)

$ErrorActionPreference = "Continue"

Set-Location -LiteralPath $RepoRoot

$SESSION_ID = "PLATFORM_CONTROL_PLANE_UIUX-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RUN_DIR = Join-Path "tools\registry\runs" $SESSION_ID
New-Item -ItemType Directory -Force -Path $RUN_DIR | Out-Null

function Run-And-Save {
  param(
    [string]$Name,
    [scriptblock]$Command
  )
  $out = Join-Path $RUN_DIR $Name
  "COMMAND: $Name" | Out-File $out -Encoding utf8
  try {
    & $Command 2>&1 | Tee-Object -FilePath $out -Append
    "EXITCODE: $LASTEXITCODE" | Out-File $out -Encoding utf8 -Append
  } catch {
    $_ | Out-File $out -Encoding utf8 -Append
    "EXITCODE: ERROR" | Out-File $out -Encoding utf8 -Append
  }
}

Run-And-Save "git-status.txt" { git --no-pager status --short }
Run-And-Save "git-diff-name-status.txt" { git --no-pager diff --name-status }
Run-And-Save "git-diff-check.txt" { git --no-pager diff --check }
Run-And-Save "tsc-noemit.txt" { pnpm -w exec tsc --noEmit }
Run-And-Save "untracked-files.txt" { git ls-files --others --exclude-standard }
Run-And-Save "platform-control-plane-uiux.guard.txt" { node "tools/plan/PLATFORM_CONTROL_PLANE_UIUX_PACKAGE/08_GUARDS/platform-control-plane-uiux.guard.mjs" }
Run-And-Save "platform-control-plane-uiux.guard-tools.txt" { node "tools/guards/platform-control-plane-uiux.guard.mjs" }

git --no-pager diff -- . > "$RUN_DIR\LOCAL_CHANGE_REVIEW.patch"
git ls-files --others --exclude-standard > "$RUN_DIR\LOCAL_CHANGE_UNTRACKED_FILES.txt"

@"
# Visual Evidence Required

Open:
http://localhost:3000/platform

Capture screenshots:
1. Overview.
2. Services.
3. Vars.
4. Providers.
5. Appearance.
6. Narrow/mobile width if possible.

Required visual checks:
- Platform is sovereign control plane.
- User sees human controls, not developer keys.
- RTL correct.
- No overflow/clipping.
- All live actions disabled.
- No real secrets.
- Appearance is app-wide identity, not Marketing.
"@ | Out-File "$RUN_DIR\VISUAL_EVIDENCE_REQUIRED.md" -Encoding utf8

Compress-Archive -Path "$RUN_DIR\*" -DestinationPath "$RUN_DIR\$SESSION_ID.zip" -Force

Write-Host "Evidence ZIP: $RUN_DIR\$SESSION_ID.zip"
