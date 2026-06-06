# DSH Applications and Control Panel Shared Owner Decision

status: CURRENT_FRONTEND_OWNER_DECISION
mode: LIVE_FRONTEND_TRUTH
repo: C:\bthwani-suite
updated_at: 2026-06-06

## Decision

No move, delete, or rename is approved for `dsh/frontend/control-panel`, `dsh/frontend/app-client`, `dsh/frontend/app-partner`, `dsh/frontend/app-captain`, `dsh/frontend/app-field`, or `dsh/frontend/shared`.
This phase closes frontend truth drift only.

## Applications Ownership

- `app-client` owns client-facing discovery, checkout, and tracking/support screens via `dsh-client.screen-registry.ts`.
- `app-partner` owns partner-facing orders, inventory, and catalog screens via `dsh-partner.screen-registry.ts`.
- `app-captain` owns captain-facing active order management, map navigation, and pickup/dropoff screens via `dsh-captain.screen-registry.ts`.
- `app-field` owns field agent store onboarding, visit evidence, and document upload screens via `dsh-field.screen-registry.ts`.
- All application screens must remain isolated within their respective surface directories under `dsh/frontend/`.

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
- DSH control-panel finance and application-side checkout intent modules remain view-only/delegation-only.
- No DSH finance mutation is approved here.

## Not Approved In This Decision

- no UI rewrite
- no backend or API claim
- no package or config change
- no `@bthwani/ui-kit` ownership change

## Next Valid Work

1. Maintain isolated screen registries for each of the four mobile applications and the control panel.
2. Ensure cross-surface flows are documented in `dsh-flow-registry.ts`.
3. Revisit owner boundaries only if a live consumer conflict appears.
