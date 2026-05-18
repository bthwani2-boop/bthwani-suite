# DSH UI/UX Flow Final Closure Plan Package

Place this folder under:

```powershell
C:\bthwani-suite\tools\plan\DSH_UI_UX_FLOW_FINAL_CLOSURE_PLAN-20260518
```

This package is for Codex/Claude/Copilot-style agents. It is **not** a runtime/backend/API package.

## Start here

1. Read `00_AGENT_START_HERE.md`.
2. Run `scripts\Invoke-DshPlanPreflight.ps1` from repo root.
3. Execute one phase only.
4. Run `scripts\Invoke-DshPlanEvidence.ps1`.
5. Repeat: diagnose → fix → verify → evidence → next loop.

## Human owner warning

The app-client screens have already been visually reviewed and designed, except some tabs in `MySpaceScreen` / "مساحتي". Do not destroy or redesign those screens.

## Package contents

- `00_AGENT_START_HERE.md` — execution command for the coding agent.
- `FORENSIC_DIAGNOSIS.md` — diagnosis and risk map.
- `EXECUTION_LOOPS.md` — phased loop plan.
- `PROTECTED_SURFACES_POLICY.md` — no-destruction policy.
- `NAMING_TAXONOMY.md` — Screen/Section/Sheet/State/Panel/Queue/Workspace rules.
- `matrices/ML_001_054_EXECUTION_MATRIX.csv` — numeric ML execution map.
- `phases/*.md` — one bounded phase per loop.
- `scripts/*.ps1` — verification/evidence scripts.
- `agent-prompts/*.md` — prompts for Codex/Claude.

## Stage boundary

Allowed: UI/UX flow, route/state/CTA/owner/RTL/read-only preview fixes.
Forbidden: API, backend, DB, runtime binding, WLT mutations, new dependencies, lockfile changes, broad redesign.

## Install helper

After extracting the ZIP, run from the extracted package folder:

```powershell
.\Install-PlanPackage.ps1 -RepoRoot "C:\bthwani-suite"
```