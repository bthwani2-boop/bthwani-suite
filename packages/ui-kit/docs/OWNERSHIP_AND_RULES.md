# Ownership And Rules

Parent authority: [BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md](./BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md)

Execution plan: [BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md](./BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md)

## Precedence Order

1. Parent authority blueprint
2. Execution plan
3. This ownership and rules file
4. Specialized annexes under `docs/`
5. Package README and implementation details

No specialized document may override the parent authority. Specialized documents only narrow, clarify, or operationalize it.

## Central Ownership

This package centrally owns:

- semantic tokens
- theme mapping
- text roles
- direction rules
- logical spacing behavior
- reusable UI primitives
- shared state families
- shared foundational components that remain service-clean
- common state shells
- root UI composition
- overlay ownership

## Public API Law

- shared UI must be consumed through `@bthwani/ui-kit`
- shared exports must enter through `src/index.ts`
- deep imports into package internals are forbidden outside the package
- no service-specific business logic may be promoted into the package

## No-Drift Law

Screens and surfaces must not create parallel authorities for:

- themes
- tokens
- direction
- overlay hosts
- shared families
- state shells

If a general visual change requires patching many screens manually, authority is still leaking and must move back into `ui-kit`.

## Experience Quality Law

The package does not exist only to improve appearance. It must centrally force:

- clarity of the primary task
- clarity of the primary action
- reduced step count for the main flow
- reduced cognitive load
- complete and readable state coverage
- clear recovery paths when errors happen
- stable interaction behavior across all screens

If a screen looks polished but still hides the main task, overloads the user, or behaves differently from sibling screens, it is not aligned with the system.

## Forbidden Local Patterns

Screens must not own:

- local typography systems
- local direction systems
- local theme providers
- local color scales
- repeated raw spacing systems
- repeated button or field families
- repeated empty/loading/error shells
- root provider trees parallel to `ui-kit`
- local styling systems that behave like a second design language
- shared components that bypass `ui-kit`
- competing primary actions in the same decision zone
- noisy, crowded, or visually conflicting layouts

## Approval Law

No screen is acceptable unless it is:

- measurably aligned with BTH identity
- complete in states and recovery behavior
- correct in RTL/LTR and ar/en usage
- accessible by default
- scalable without local rework

Weak screens must be difficult to produce and impossible to approve through this system.

## Central Improvement Law

Any global improvement in spacing, typography, headers, buttons, cards, theme behavior, or state behavior must flow from one central change.

Any global defect in RTL, theme resolution, or shared interaction behavior must be fixed centrally, not patched across screens.

## Future Consistency Law

Every future screen must look and behave as if it was born from the same family.

Any later expansion that weakens cohesion, adds a second authority, or bypasses the same gates is invalid.

## Phase Boundary

- screen-family shells are not automatically lawful just because files already exist under `patterns/`
- pilot validation routes or screen previews stay blocked until later retained-screen phases
- any future `patterns/` promotion must prove cross-screen demand and avoid duplicate family growth

## Allowed Local Responsibility

Screens may own:

- screen composition
- service-specific business logic
- screen-specific content
- rare specialized UI that is not yet canonical

- hosted preview boundary: `packages/ui-kit/docs/HOSTED_PREVIEW_BOUNDARY_DECISION.md`

