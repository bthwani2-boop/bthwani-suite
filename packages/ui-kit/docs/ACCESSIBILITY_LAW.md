# Accessibility Law

Parent authority: [BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md](./BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md)

Execution plan: [BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md](./BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md)

## Baseline

`@bthwani/ui-kit` treats WCAG 2.2 as a blocking quality floor, not an optional enhancement.

## Required Defaults

Every interactive primitive and shared family must provide:

- accessible name support
- focus visibility
- keyboard safety where applicable
- touch target safety where applicable
- contrast-safe foreground/background choices
- non-color-only meaning for critical states
- reduced-motion respect
- screen-reader compatible semantics

## Blocking Failures

The following are release blockers:

- hidden or absent focus indication
- placeholder-only labels for required inputs
- color-only status meaning
- insufficient contrast for essential content or action affordances
- motion that cannot be reduced in sensitive contexts
- inaccessible dialog, sheet, menu, or overlay dismissal flows

## Review Rule

No new shared family is complete until its accessibility behavior is defined in the family contract and verified in usage states.
