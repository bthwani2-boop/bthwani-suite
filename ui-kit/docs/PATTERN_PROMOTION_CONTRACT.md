# Pattern Promotion Contract

Parent authority: [BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md](./BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md)

Execution plan: [BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md](./BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md)

## Promotion Criteria

No screen pattern is promoted into `@bthwani/ui-kit` unless all of the following are true:

- real repetition exists across more than one screen, surface, or service
- semantic meaning is stable
- the pattern is not business-specific
- the pattern can be reused without deforming the system
- retained-screen evidence exists
- usage and anti-usage boundaries are documented

## Required Review Inputs

- evidence of repetition
- evidence of semantic stability
- cleanup plan for duplicates being replaced
- impact on theme, direction, accessibility, and states

## Automatic Rejection Cases

- shape-only similarity without semantic stability
- promotion driven by urgency alone
- service-specific widgets disguised as generic shells
- patterns that create a second design language

## Rule

If the proof is incomplete, the pattern remains local composition and does not become shared authority.
