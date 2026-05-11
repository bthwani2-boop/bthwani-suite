# DSH Mobile Apps Final Closure

## Scope

- `app-client`
- `app-partner`
- `app-captain`
- `app-field`

Evidence root:

```text
tools/registry/runs/DSH_MOBILE_APPS_FINAL_CLOSURE_GATE-20260511-230555
```

## Closure Results

- `dsh/frontend/app-field/index.ts` and `app-field/composition/index.ts` now expose explicit public exports only; no `export *` remains in the scoped mobile DSH/WLT surface.
- `dsh/frontend/app-partner/dsh-partner.screen-registry.ts`, `dsh/frontend/app-captain/dsh-captain.screen-registry.ts`, and `dsh/frontend/app-field/dsh-field.screen-registry.ts` were closed until no `UNPROVEN` rows remained across the four targeted mobile registries.
- Remaining partner and captain wallet/finance copy that still lived inside DSH host surfaces was moved behind WLT-owned helpers at `wlt/frontend/app-partner/dsh/wlt-dsh-partner.ui-copy.ts` and `wlt/frontend/app-captain/dsh/wlt-dsh-captain.ui-copy.ts`.
- WLT bridge metadata for partner, captain, and field remains explicit with `ownerId: 'wlt.dsh'`, `serviceId: 'wlt'`, and `linkedServiceId: 'dsh'`.
- Final classification is live-file based for partner, captain, and field. Client classification remains the existing app-client closure reference.
- No backend, API, OpenAPI, dependency, route-semantics, label/value, or media changes were introduced in this gate.

## Gate Summary

| Check | Result | Notes |
|---|---|---|
| TypeScript | PASS | `pnpm -w exec tsc --noEmit` |
| Diff whitespace | PASS | `git --no-pager diff --check` on touched files |
| `UNPROVEN` registry rows | PASS | no remaining matches across client/partner/captain/field registries |
| `export *` in scoped mobile surface | PASS | removed from the targeted DSH/WLT mobile scope |
| `core` ownership tokens | PASS | no `ownerId: 'core'` or `serviceId: 'core'` in the targeted mobile scope |
| Runtime smoke | SKIPPED | no active mobile runtime session was available in this gate |

## Generated Docs

- `dsh/docs/dsh-client-final-classification.csv`
- `dsh/docs/dsh-partner-final-classification.csv`
- `dsh/docs/dsh-captain-final-classification.csv`
- `dsh/docs/dsh-field-final-classification.csv`
- `dsh/docs/DSH_MOBILE_APPS_FINAL_CLOSURE_RUNBOOK.md`

## Decision

This gate closes the local preview-only mobile scope for DSH under the current repository state. Runtime and visual proof remain separate evidence tracks and were not claimed here.
