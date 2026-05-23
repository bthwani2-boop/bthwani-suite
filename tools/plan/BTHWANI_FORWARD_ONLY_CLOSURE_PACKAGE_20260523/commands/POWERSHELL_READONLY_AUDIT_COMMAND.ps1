Set-Location -LiteralPath "C:\bthwani-suite"

$SessionId = "BTHWANI_READONLY_AUDIT-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$Root = Join-Path "tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $Root | Out-Null

git branch --show-current | Tee-Object -FilePath (Join-Path $Root "branch.txt")
git rev-parse HEAD | Tee-Object -FilePath (Join-Path $Root "commit.txt")
git --no-pager status --short | Tee-Object -FilePath (Join-Path $Root "git-status.txt")
git --no-pager diff --stat | Tee-Object -FilePath (Join-Path $Root "git-diff-stat.txt")
git --no-pager diff --name-status | Tee-Object -FilePath (Join-Path $Root "git-name-status.txt")
git --no-pager diff --check | Tee-Object -FilePath (Join-Path $Root "git-diff-check.txt")
git ls-files --others --exclude-standard | Tee-Object -FilePath (Join-Path $Root "untracked.txt")

pnpm -w exec tsc --noEmit *>&1 | Tee-Object -FilePath (Join-Path $Root "tsc-noemit.txt")
pnpm run guard:tamagui-import-boundary *>&1 | Tee-Object -FilePath (Join-Path $Root "guard-tamagui-import-boundary.txt")
pnpm run guard:service-blueprint *>&1 | Tee-Object -FilePath (Join-Path $Root "guard-service-blueprint.txt")
pnpm run guard:binding-proof *>&1 | Tee-Object -FilePath (Join-Path $Root "guard-binding-proof.txt")
pnpm run guard:secret-scan *>&1 | Tee-Object -FilePath (Join-Path $Root "guard-secret-scan.txt")

$ZipPath = Join-Path $Root ($SessionId + ".zip")
Compress-Archive -Path (Join-Path $Root "*") -DestinationPath $ZipPath -Force

Write-Host "Evidence root: $Root"
Write-Host "Handoff zip: $ZipPath"
