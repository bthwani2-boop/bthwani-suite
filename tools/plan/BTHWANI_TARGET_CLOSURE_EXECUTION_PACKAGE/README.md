# BThwani Target Closure Package — README V7

## Status

Use V7 only. V1, V2, V3, V4, V5, and V6 are superseded.

## What V7 adds over V6

V7 adds:

```text
24-step Technical / Logic Closure Stage (Section 9a)
19-Stage Cross-Surface Navigation Map
22 comprehensive performance and UI/UX standards
Strict Demo Data Centralization Matrix
Strict File Boundary Matrix with design preservation columns
V7 Hardening Layer (V7.1–V7.9) for package integrity
V7.10 Control Panel Closure Hardening Addendum for unproven closure gates
3 new package files:
  BTHWANI_VERSION_CHANGELOG.md
  BTHWANI_ARABIC_RTL_CONTRACT.md
  BTHWANI_CONFLICT_RESOLUTION_MATRIX_TEMPLATE.md
```

## What V6 added (retained in V7)

```text
BTHWANI_AGENT_NAVIGATION_MAP.md — mandatory navigation layer
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
PACKAGE_RECHECK_VERSION: 7.0.0
```

## Agent start

Use:

```text
C:\bthwani-suite\tools\plan\BTHWANI_QUICK_START_FOR_AGENTS.md
```
