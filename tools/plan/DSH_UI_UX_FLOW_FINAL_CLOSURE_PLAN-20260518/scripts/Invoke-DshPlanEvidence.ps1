param(
  [string]$RepoRoot = "C:\bthwani-suite",
  [string]$LoopName = "UNSPECIFIED_LOOP"
)
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $RepoRoot
$SessionId = "DSH_UI_UX_FLOW_LOOP_EVIDENCE-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunDir = Join-Path ".\tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $RunDir | Out-Null

"Loop: $LoopName" | Out-File -Encoding utf8 (Join-Path $RunDir "loop.txt")
git --no-pager status --short | Tee-Object -FilePath (Join-Path $RunDir "git-status.txt")
git --no-pager diff --stat | Tee-Object -FilePath (Join-Path $RunDir "diff-stat.txt")
git --no-pager diff --name-status | Tee-Object -FilePath (Join-Path $RunDir "diff-name-status.txt")
git --no-pager diff --check 2>&1 | Tee-Object -FilePath (Join-Path $RunDir "diff-check.txt")

"=== protected app-client changes ===" | Tee-Object -FilePath (Join-Path $RunDir "protected-app-client-diff.txt")
git --no-pager diff --name-only -- dsh/frontend/app-client | Tee-Object -Append -FilePath (Join-Path $RunDir "protected-app-client-diff.txt")

"=== workspace/naming scan ===" | Tee-Object -FilePath (Join-Path $RunDir "naming-scan.txt")
rg -n "closure-workspaces|ClosureWorkspace|Workspaces" dsh/frontend 2>&1 | Tee-Object -Append -FilePath (Join-Path $RunDir "naming-scan.txt")

"=== owner terminology scan ===" | Tee-Object -FilePath (Join-Path $RunDir "owner-terminology-scan.txt")
rg -n "Ops-side partner activation|ops approval|ops-dependency|تفعيل.*العمليات|اعتماد.*العمليات" dsh/frontend dsh/docs/closure 2>&1 | Tee-Object -Append -FilePath (Join-Path $RunDir "owner-terminology-scan.txt")

pnpm -w exec tsc --noEmit 2>&1 | Tee-Object -FilePath (Join-Path $RunDir "tsc.txt")

git --no-pager diff -- . > (Join-Path $RunDir "LOCAL_CHANGE_REVIEW.patch")
git ls-files --others --exclude-standard > (Join-Path $RunDir "LOCAL_CHANGE_UNTRACKED_FILES.txt")
Compress-Archive -Path (Join-Path $RunDir "*") -DestinationPath (Join-Path $RunDir "$SessionId.zip") -Force
"Evidence ready: $RunDir"
"Zip: $(Join-Path $RunDir "$SessionId.zip")"
