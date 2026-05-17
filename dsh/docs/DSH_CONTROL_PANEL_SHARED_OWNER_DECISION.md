# DSH Control Panel + Shared Owner Decision

status: CURRENT_DECISION
mode: DOCUMENTATION_ONLY
repo: C:\bthwani-suite
branch: ghb/0133-20260513-000319-agents-md-agents-codex
head: a1a5c7e279f2fa220b5c92a6ed9227909a6d75d3
generated_at: 2026-05-13T02:16:12.6416279+03:00

## Decision

No move/delete/rename is approved for DSH control-panel or DSH shared.

This decision closes the current owner/consumer ambiguity as documentation only.

## Control Panel

dsh/frontend/control-panel is the current DSH control-panel frontend owner area.

Current decision:

- Keep current folder structure.
- Do not add route files blindly.
- Do not add a global screen registry blindly.
- Existing composition/export files remain the owner path unless a later runtime requirement proves otherwise.
- Any future owner registry must be introduced only by a separate DryRun + patch review.

Reason:

The consumer graph showed existing control-panel consumption through current composition/shell/runtime paths. The risk was ownership clarity, not a proven runtime defect.

## Shared

dsh/frontend/shared is a cross-surface DSH shared preview/model/workflow area.

Current decision:

- Keep as-is.
- Do not move.
- Do not merge.
- Do not delete.
- Do not split.
- Treat preview-store/model/workflow files as shared consumers until a later exact consumer map proves a safe narrower action.

Reason:

The consumer graph showed shared files are consumed across multiple DSH surfaces. Moving or merging them now would create unnecessary regression risk.

## Boundary Result

- No direct Tamagui boundary fix is approved from this decision.
- No API/runtime/binding implementation is approved from this decision.
- No UI rewrite is approved from this decision.
- No package/config/dependency change is approved from this decision.

## Next Valid Work

Only after this commit:

1. Continue visual/UI closure per surface.
2. Or prepare a focused UI-only task.
3. Or prepare a separate consumer-map DryRun for one shared file at a time.
