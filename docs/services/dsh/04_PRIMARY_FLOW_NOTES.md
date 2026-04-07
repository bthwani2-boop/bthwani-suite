# 04_PRIMARY_FLOW_NOTES

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 07 - First Service Foundation`
- TargetService: `dsh`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 07 active`
- BlockingGaps: `Detailed journey, screen, contract, binding, and runtime work remain downstream`
- NextAllowed: `Phase 08 - Actor Context Exhaustive Extraction`

## Flow Purpose

This file records DSH service-foundation flow only.
It is intentionally above screen depth and above donor exhaustiveness.
It exists to make the first-service handoff clear before Phase 08 begins.

## Primary Flow

The current DSH mainline at foundation depth is:

1. customer enters through `app-client` discovery
2. customer builds or reviews cart in `app-client`
3. customer passes checkout gating and submits the order in `app-client`
4. partner handles store-side work in `app-partner`
5. captain accepts and executes the delivery in `app-captain`
6. captain records proof when the completion gate requires it
7. customer returns to `app-client` tracking for active or terminal visibility

## Support And Oversight Paths

- partner handling stays in `app-partner` first and escalates to `control-panel` only when governance or exception handling is actually required
- captain work stays in `app-captain` and does not create a mirrored internal execution path
- `control-panel` is used for governance, exception handling, and proxy review only
- `app-field` remains an optional support branch for activation, geo pin, or visit-log style work when the service path needs it

## Exception Notes

- checkout failure stays local to `app-client`
- partner blockers attempt partner-side recovery before internal-ops escalation
- captain blockers stay inside captain assignment or execution logic unless explicit exception handling is needed
- proxy-request flow remains a real DSH exception family, but it does not replace the main order path
- cancelled terminal visibility stays customer-facing without transferring staff action ownership to the customer

## Foundation Rules

- one actor owns one primary job at each stage
- visibility across surfaces does not transfer action ownership
- this file does not authorize screen inventory, preview registry work, screen specs, contract detail, binding, or runtime work
- donor route structure may inform later phases, but it is not adopted here as clean target truth

## Bootstrap Handoff

The next lawful file after this foundation lock is:

- `docs/execution/phases/PHASE_08_ACTOR_CONTEXT_EXHAUSTIVE_EXTRACTION.md`

Phase 07 stops at service-foundation truth only.
