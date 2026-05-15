# Acceptance Criteria

## Package-level acceptance

The agent can only move from loop to loop when:

- all required files for the loop exist,
- forbidden files are not touched,
- `git diff --check` is clean,
- `pnpm -w exec tsc --noEmit` passes or failure is clearly marked `BLOCKED`,
- untracked files are listed and accounted for,
- no final closure wording is used,
- `DSH_NEXT_LOOP_PLAN.md` or equivalent exists.

## Ready-for-human-visual-review criteria

Required:

- DSH existing inventory complete.
- Control panel section map covers operations, partners, marketing, finance, support, catalogs.
- Mobile surface map covers app-client, app-partner, app-captain, app-field.
- Lifecycle coverage includes Field onboarding only, client order, partner prep, operations assignment, captain execution, messaging, WLT settlement, exceptions.
- Missing gaps have placements: screen/workspace/section/sheet/state/event/notification/ops_action/wlt_bridge/audit_record/TBD.
- Screen inventory includes screen_id, route, actor, owner, CTA, states, grouping risk.
- Screen/API Matrix exists without invented endpoints.
- Contract Gap Map exists without editing OpenAPI prematurely.
- Visual review queue exists with P0/P1/P2.
- Evidence ZIP exists.
- Patch exists.
- TypeScript checked.
- Screenshots are still required for final visual acceptance.

Allowed final pre-review status:

```text
READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE
```
