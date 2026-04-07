# Exact Sequencing Model

## Executive Verdict

The new sequencing model is strict. Every phase consumes exact outputs from the previous phase and no downstream shortcut is lawful.

## Sequencing Rules

1. `08` must finish before `09` begins.
   - reason: operations cannot be trusted without actor/context legality.
2. `09` must finish before `10` begins.
   - reason: surface coverage requires the full operation universe.
3. `10` must finish before `11` begins.
   - reason: journeys must obey explicit surface and wave truth.
4. `11` must finish before `12` begins.
   - reason: screen census must be anchored to journeys, not intuition.
5. `12` must finish before `13` begins.
   - reason: screen specs require a closed retained-screen set.
6. `13` must finish before `14` begins.
   - reason: grouping requires spec-complete screens.
7. `14` must finish before `15` begins.
   - reason: UI Kit growth must follow group and build-order truth.
8. `15`, `16`, `17`, and `18` may only proceed under the new dependency graph already patched into canonical docs.

## Prohibited Shortcuts

- no screen-level reasoning before `JOURNEY_MASTER`
- no UI Kit growth before `SCREEN_SPEC_PACKS`
- no state or API pressure modeling before `OPERATION_TO_SCREEN_CHAIN`
- no compression decisions before grouping and build order

## Evidence Rules

- each phase must cite the exact export filenames it consumes
- each phase must report counts, contradictions, and blocker state explicitly
- missing counts mean the phase is incomplete

## Final Readiness Verdict

`ACCEPT_FOR_PACKAGING`