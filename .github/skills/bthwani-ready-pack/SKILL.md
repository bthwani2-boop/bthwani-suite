---
name: bthwani-ready-pack
description: 'Maintain phase-scoped ready packs for bthwani-suite UI, UX, and flow work. Use when promoting closed artifacts into docs/services/<service>/ready, updating INDEX.md, labeling what is ready versus not ready, or preserving completed surface decisions for later phases without implying API, binding, or runtime readiness.'
---

# BTHWANI Ready Pack

## When to Use

- A service has UI, UX, or flow artifacts that are fully closed for the current phase
- You need to promote a closed item into `docs/services/<service>/ready/`
- You need to update `docs/services/<service>/ready/INDEX.md`
- You need to preserve current-phase decisions without implying runtime readiness

## Purpose

The `ready` folder is a governed phase-scoped helper pack for the current phase only.

It preserves closed, reusable, future-helping artifacts so later phases do not restart from zero.

It must not falsely imply full implementation readiness.

## Ready Folder Law

For any active service, maintain a helper folder at:

- `docs/services/<service>/ready/`

Example:

- `packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md/ready/`

This folder is not live implementation code.
It is not a runtime folder.
It is not a binding folder.
It is not a contract folder.

It is a governed future-helper pack for phase-closed artifacts.

## Phase-Scoped Meaning Law

`ready` must always be interpreted relative to the current phase.

During the current phase, `ready` means:

- `READY_FOR_UI_UX_FLOW_ONLY`

It must never silently mean:

- ready for api
- ready for binding
- ready for integration
- ready for runtime
- ready for proof
- ready for full closure

## Current Phase Scope Law

For the current project phase, the `ready` folder may include only artifacts related to:

- journey lock
- screen inventory
- screen rationalization
- screen family lock
- screen purpose lock
- primary CTA and secondary actions
- entry and exit decisions
- state lock
- flow compression
- ui-kit extraction candidates
- donor screen decomposition notes
- shell direction decisions
- user review outcomes
- accepted visual direction decisions
- blockers for later phases

## Prohibited Ready Content Law

Do not place here:

- hooks
- api clients
- service methods
- binding chain code
- runtime truth code
- integration code
- generated layers
- openapi deltas as active implementation truth
- proof of runtime chain
- full execution readiness claims

If such material is needed later, it belongs to a later phase pack, not the current `ready` folder.

## Ready Promotion Law

Promote an artifact into `ready` only after it is actually closed for the current phase.

For example, a screen-related artifact may enter `ready` only when these are closed:

- journey role
- screen type decision
- family
- purpose
- primary CTA
- secondary actions
- entry and exit
- required states
- flow compression decision
- ui-kit extraction notes if relevant
- user review status if applicable

Do not promote half-decided work into `ready`.

## Mandatory Ready Status Law

Every file placed into `ready` must clearly state:

- current phase meaning
- what is closed
- what is not closed
- what remains forbidden
- what the next future phase would consume from this file

At minimum, every ready artifact should expose labels such as:

- `READY_UI_UX_FLOW`
- `NOT_READY_FOR_API`
- `NOT_READY_FOR_BINDING`
- `NOT_READY_FOR_RUNTIME`

## Ready Index Law

Each `ready` folder must maintain an index file:

- `docs/services/<service>/ready/INDEX.md`

This index must list:

- file name
- artifact type
- current phase scope
- status
- what it helps later
- what it does not imply
- last update summary

## Recommended Ready Pack Structure

Prefer a structure like:

- `00_READY_SCOPE.md`
- `01_JOURNEY_LOCK.md`
- `02_SCREEN_REGISTRY_READY.csv`
- `03_SCREEN_RATIONALIZATION_READY.csv`
- `04_SCREEN_PURPOSE_LOCK_READY.csv`
- `05_SCREEN_FAMILY_MAP_READY.csv`
- `06_CTA_AND_ACTIONS_READY.csv`
- `07_ENTRY_EXIT_READY.csv`
- `08_STATE_LOCK_READY.csv`
- `09_FLOW_COMPRESSION_READY.md`
- `10_UI_KIT_EXTRACTION_CANDIDATES_READY.csv`
- `11_HOME_SHELL_DECISIONS_READY.md`
- `12_USER_REVIEW_DECISIONS_READY.md`
- `13_BLOCKERS_FOR_NEXT_PHASE.md`
- `INDEX.md`

The exact file list may vary by service, but the same discipline must be preserved.

## Ready Cleanliness Law

Do not allow the `ready` folder to become:

- a dump root
- a mixed-phase bucket
- a scratchpad
- a legacy mirror
- a fake completion zone
- a hidden code cache
- a second source of truth that conflicts with docs/services main artifacts

## Ready Source Trace Law

Every serious artifact inside `ready` must remain traceable to one or more of:

- `docs/services/<service>` source files
- donor decomposition notes
- user review decisions
- ui-kit extraction decisions
- journey and screen locks already accepted

If something is inferred rather than fully proven, mark it clearly.

## Ready Review Law

Before adding a file to `ready`, verify:

- the artifact belongs to the current phase
- the artifact is sufficiently closed
- the artifact is useful for future phases
- the artifact is not duplicating another existing file
- the artifact does not falsely imply broader readiness
- the artifact has explicit scope labeling

## Ready Handoff Law

The purpose of `ready` is future handoff, not premature execution.

A later phase may consume `ready` as input, but must still perform its own validation before implementation.

This means:

- `ready` helps later work
- `ready` accelerates later work
- `ready` prevents restarting from zero

But:

- `ready` does not replace later validation
- `ready` does not authorize premature binding
- `ready` does not authorize runtime work
- `ready` does not authorize integration claims

## Ready Update Law

Whenever a current-phase decision changes, update the relevant ready artifact rather than letting stale readiness accumulate.

If a prior ready artifact becomes outdated:

- revise it
- mark it superseded
- or explicitly downgrade its status

Stale ready artifacts are dangerous and must not remain ambiguous.

## Final Law

The `ready` folder is a governed phase-scoped helper pack.

Its job is to preserve closed UI, UX, and flow work so future phases do not restart from zero.

It must remain:

- clean
- scoped
- honest
- non-executable
- future-helping
- phase-correct
- explicit about what is ready and what is still not ready

## Mandatory Closed-Item Promotion Law

Any artifact that is `100% closed` for the current phase must be promoted into:

- `docs/services/<service>/ready/`

For service `dsh`, the canonical destination is:

- `packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md/ready/`

Promotion must happen in the same closure cycle, not deferred, and must update both:

- the specific ready artifact file or files
- `docs/services/<service>/ready/INDEX.md`
