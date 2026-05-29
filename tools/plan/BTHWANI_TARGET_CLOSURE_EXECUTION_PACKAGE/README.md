# BThwani Target Closure Package — README V4

## Status

Use V4 only. V1, V2, and V3 are superseded.

## Safe install from extracted ZIP

If this ZIP is extracted into a temporary folder:

```powershell
Set-Location -LiteralPath "<EXTRACTED_FOLDER>"
pwsh -NoProfile -ExecutionPolicy Bypass -File ".\tools\plan\INSTALL_TARGET_CLOSURE_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite"
```

Strict install that fails on legacy package noise:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File ".\tools\plan\INSTALL_TARGET_CLOSURE_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite" -Strict -QuarantineOldPackageFiles
```

## Check installed package

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pwsh -NoProfile -ExecutionPolicy Bypass -File ".\tools\plan\CHECK_TARGET_CLOSURE_PACKAGE.ps1" -Strict
```

## Use with agent

Paste `BTHWANI_AGENT_START_COMMAND.md`, provide a TARGET, and require one closed cycle only.

## Required package evidence

The agent must provide:

```text
PACKAGE_RECHECK_EVIDENCE: tools/registry/runs/<SESSION_ID>/<SESSION_ID>.zip
PACKAGE_RECHECK_STATUS: PASS
PACKAGE_RECHECK_VERSION: 4.0.0
```
