# DSH Control Panel + Shared Owner Decision

status: CURRENT_FRONTEND_OWNER_DECISION
mode: LIVE_FRONTEND_TRUTH
repo: C:\bthwani-suite
updated_at: 2026-05-21

## Decision

No move, delete, or rename is approved for `dsh/frontend/control-panel` or `dsh/frontend/shared` in P0-14.
This phase closes frontend truth drift only.

## Control-Panel Ownership

- `control-panel/operations` owns the operational command surfaces through `operations.registry.ts` and its workspace screens.
- `control-panel/finance` owns the DSH side of the read-only WLT bridge through `finance.registry.ts` and the finance workspaces.
- `control-panel/support`, `control-panel/marketing`, `control-panel/partners`, `control-panel/platform`, and `control-panel/administration` remain section-owned through their section roots and index exports.
- No extra global control-panel screen registry is justified until a runtime consumer proves a real gap.

## Shared Ownership

- `dshCrossSurfaceClosureMap.ts` is the live cross-surface frontend closure truth.
- `dsh-flow-registry.ts` is the live flow ownership, visibility, escalation, and on-demand truth.
- `marketing-visibility.contract.ts`, `dsh-signal-layer.model.ts`, `workflow.ts`, and `store-card-commercial-map.ts` remain shared cross-surface contracts.
- Shared preview stores remain preview truth only. They are not runtime proof.

## Financial Boundary

- WLT owns settlement, payout, refund, commission, ledger, wallet, and payment semantics.
- DSH control-panel finance remains view-only.
- No DSH finance mutation is approved here.

## Not Approved In This Decision

- no UI rewrite
- no backend or API claim
- no package or config change
- no `@bthwani/ui-kit` ownership change

## Next Valid Work

1. Capture visual evidence for operations, finance bridge, and cross-surface flows.
2. Capture runtime proof only when a real multi-surface session is available.
3. Revisit owner boundaries only if a live consumer conflict appears.
