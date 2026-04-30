# Quality Gates And Screen Entry

Parent authority: [BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md](./BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md)

Execution plan: [BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md](./BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md)

## Package Gates

Every new shared family must pass:

- design gate
- accessibility gate
- consistency gate
- implementation gate
- interaction gate
- recovery gate
- identity gate

## Screen Entry Law

Every future screen must define, in order:

1. variant
2. archetype
3. core job
4. primary action
5. required states
6. reuse map from `@bthwani/ui-kit`
7. accessibility plan
8. RTL/LTR plan
9. gate review
10. implementation only after approval

## Required Screen Outcomes

The system must drive every accepted screen toward:

- a clear primary task
- a clear primary action
- fewer unnecessary steps
- lower cognitive load
- complete state visibility
- recoverable failure handling
- consistent behavior with the rest of the platform

Passing style alone is insufficient if the experience remains noisy, ambiguous, or operationally weak.

## Drift Prevention Rules

The system must reject screens that introduce:

- local styling systems
- shared components outside `@bthwani/ui-kit`
- random or non-system screen composition
- competing primary actions
- visual crowding or decorative noise

Drift must be prevented at entry, not tolerated and repaired later.

## Measurable Acceptance Gates

No screen is accepted unless it passes all of the following:

- states are complete
- identity alignment is intact
- RTL/LTR and ar/en parity is correct
- accessibility is acceptable
- the screen can scale without spawning local authorities

## Acceptance Rubric

A screen or family fails if any of the following are true:

- unclear primary action
- unclear primary task
- incomplete states
- broken RTL/LTR parity
- broken ar/en parity
- accessibility violations
- preventable cognitive overload
- weak recovery paths
- competing primary actions
- visual clutter or incoherent hierarchy
- local visual drift against the shared system
- new local shared authorities invented outside `ui-kit`

## Central Improvement Rule

Any general improvement in spacing, typography, buttons, cards, headers, theme behavior, or state behavior must flow from one central change.

Any general defect in RTL, theme resolution, or shared interaction behavior must be corrected centrally rather than screen by screen.

## Proof Requirement

Claims of quality are insufficient alone. Shared work must remain reviewable through code, states, and documented usage boundaries.

The UI Kit must not merely enable good screens; it must make weak screens difficult to produce and impossible to approve.
