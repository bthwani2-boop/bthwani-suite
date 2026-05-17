# DSH Closure Rules — Loop 0

Status: DONE_LOCAL
Loop: 0
Date: 2026-05-15

## Closed-loop execution model

```
Analyze → Plan → Apply only approved scope → Verify → Evidence → Gap review → Next loop
```

- One loop at a time only.
- No loop merging.
- No scope widening mid-loop.
- No verbal closure claims without evidence.

## Screen grouping law

Do not create a route screen for every detail.
Do not collapse a full actor journey into one giant file.

Pattern:
```
Journey → Screen/Workspace → Section/Card/Sheet/State/Event
```

For every screen/workspace proposal, justify:
- user decision
- primary CTA
- previous/next step
- why it is not a section/sheet/state
- click-depth effect
- fragmentation risk
- god-screen risk

## No screen-per-block

Lifecycle events that are not user decision points must be sections, sheets, or states
on an existing screen — not new route screens.

## No god-screen

A single file must not own an entire actor journey.
If a file exceeds one workspace in scope, it must be split into justified sections.

## Lifecycle coverage required

All of the following must be explicitly represented:

- Field partner onboarding/activation only (exits after activation)
- Client: discovery / storefront / cart / checkout / tracking / support / rating
- Partner: intake / accept / reject / preparation / ready / handoff / issues
- Captain: offer / accept / pickup / dropoff / proof / issues
- Operations: review / monitoring / manual assignment / auto assignment / reassignment / exceptions / audit
- Messaging: client↔captain, client↔support-ops, partner↔ops, captain↔ops
- Marketing/catalog relation to order lifecycle
- WLT-owned: settlement / refund / commission / payout (partner, captain, field when applicable)
- Control-panel sections: operations, partners, marketing, finance, support, catalogs

## Manual and auto assignment coverage

Both manual and automatic order assignment must be represented as distinct ops states/actions.
Reassignment and exception handling must be distinct from initial assignment.

## Messaging coverage

Messaging is not optional. Every actor pair listed above requires a messaging surface classification:
screen / section / sheet / notification / TBD.

## WLT settlement ownership

WLT owns all financial events. DSH must not define or implement wallet, ledger, settlement,
refund, commission, or payout logic. DSH represents financial state as UI read-only or
deferred-to-WLT status indicators only.

## Exception coverage

Exceptions (failed delivery, undeliverable, captain dropout, partner rejection, auto-reassign trigger,
manual intervention) must be explicitly classified in the lifecycle coverage matrix.

## Docs noise control

Docs under `dsh/docs/` must remain lean. New docs are only added when a real evidence gap requires one.
Classification labels for existing docs:
- `KEEP_SHORT_INDEX` — canonical index, keep minimal
- `MERGE_INTO_CLOSURE` — content feeds Loop 1–6 matrices; merge before Loop 3
- `ARCHIVE_CANDIDATE` — old phase artifacts; archive before Loop 6, not before
- `DELETE_CANDIDATE` — no value in any loop; flag for user decision
- `DO_NOT_TOUCH` — active ownership/decision record; no edits without explicit approval
- `TBD` — classification requires reading content

## Status vocabulary

Allowed statuses only:
```
DONE_LOCAL
BLOCKED
NEEDS_NEXT_LOOP
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE
```

Forbidden statuses:
```
PASS
CLOSED
FINAL
100%
PRODUCTION READY
RUNTIME CLOSED
API CLOSED
```

## Hard boundaries (forbidden without explicit prompt permission)

- No visible UI redesign
- No arbitrary restyling or random colors
- No local design system
- No Tamagui direct imports outside `@bthwani/ui-kit`
- No edits to `dsh/dsh.openapi.yaml` before Screen/API Matrix + Contract Gap Map
- No backend/API/runtime implementation
- No WLT money/finance semantics changes
- No package.json, lockfile, generated file, CI, config, or dependency changes
- No permanent deletion
- No move/rename before inventory/classification
- No touching unrelated services
- No GitHub write
- No commit/push/branch/PR
- No claim of final closure
