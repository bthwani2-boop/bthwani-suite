# BTHWANI_DESIGN_GRAPH_GUARD Execution Package

Purpose: install and scaffold a safe, regenerable design-guard pipeline for `C:\bthwani-suite`.

Safety model:
- Runtime code must never import from `graphify-out`, `.tamagui`, `tools/analysis`, or `tools/registry/runs`.
- Tool outputs are evidence/cache only and may be deleted and regenerated.
- Source of truth for design remains `@bthwani/ui-kit` and its central tokens/config.
- Scripts use `-Apply` for write actions. Without `-Apply`, they run as DryRun/readiness checks where applicable.

Recommended order:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

# 1) Read-only readiness/evidence check
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\design-guard-bootstrap\00_CHECK_DESIGN_GUARD_READINESS.ps1"

# 2) Install repo dev tools only after reviewing the readiness evidence
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\design-guard-bootstrap\01_INSTALL_DESIGN_GUARD_TOOLS.ps1" -Apply

# 3) Create safe guard scaffold/configs/scripts
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\design-guard-bootstrap\02_CREATE_DESIGN_GUARD_SCAFFOLD.ps1" -Apply

# 4) Run design guard and export _HANDOFF.zip
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\guards\design\run-design-guard.ps1"
```

Every run writes evidence under:

```text
C:\bthwani-suite\tools\registry\runs\<SESSION_ID>\_HANDOFF.zip
```

Upload `_HANDOFF.zip` for review before declaring PASS/CLOSED/100%.
