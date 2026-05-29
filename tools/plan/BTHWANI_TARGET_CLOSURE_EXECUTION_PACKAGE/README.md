# BThwani Target Closure Package — README V6

## Status

Use V6 only. V1, V2, V3, V4, and V5 are superseded.

## What V6 adds

V6 adds the mandatory navigation layer:

```text
BTHWANI_AGENT_NAVIGATION_MAP.md
```

This file tells the agent:

```text
where to start
what to read next
which playbook to open
what not to open
when to stop
how to recover from drift
when a cycle becomes invalid
```

## Safe install from extracted ZIP

```powershell
Set-Location -LiteralPath "<EXTRACTED_FOLDER>"
pwsh -NoProfile -ExecutionPolicy Bypass -File ".\tools\plan\INSTALL_TARGET_CLOSURE_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite" -Strict -QuarantineOldPackageFiles
```

## Check installed package

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pwsh -NoProfile -ExecutionPolicy Bypass -File ".\tools\plan\CHECK_TARGET_CLOSURE_PACKAGE.ps1" -Strict
```

## Required package evidence

```text
PACKAGE_RECHECK_EVIDENCE: tools/registry/runs/<SESSION_ID>/<SESSION_ID>.zip
PACKAGE_RECHECK_STATUS: PASS
PACKAGE_RECHECK_VERSION: 6.0.0
```

## Agent start

Use:

```text
C:\bthwani-suite\tools\plan\BTHWANI_QUICK_START_FOR_AGENTS.md
```
