---
name: bthwani-central-ui-kit-compliance
description: 'Enforce central UI Kit ownership for bthwani-suite. Use when building or reviewing packages/ui-kit, packages/app-shells, or packages/surfaces; checking UiKitPressure; preventing local design drift; deciding what must be centralized versus what may stay local.'
---

# BTHWANI Central UI Kit Compliance

## When to Use

- Building or reviewing a serious surface slice in `packages/ui-kit`, `packages/app-shells`, or `packages/surfaces`
- Deciding whether a token, primitive, pattern, state shell, CTA law, or layout law belongs in `ui-kit`
- Auditing local UI drift or parallel component families
- Producing a `UiKitPressure` evaluation before implementation

## Core Law

All central reusable UI truth must be owned by `packages/ui-kit`.

This includes:

- tokens
- typography
- spacing
- colors
- radius
- elevation
- direction/lang ownership
- state shells
- base primitives
- reusable component families
- reusable visual patterns
- reusable interaction patterns
- reusable CTA laws
- reusable layout laws
- reusable shell presentation patterns

## Local Drift Prohibition

Do not allow local mini design systems inside:

- `packages/app-shells`
- `packages/surfaces`

This includes prohibiting:

- local token sets
- local spacing systems
- local color systems
- local typography systems
- local button families
- local card families
- local state shells
- local direction ownership
- local reusable header systems
- local reusable CTA systems

## Ownership Rules

`packages/surfaces` may compose from `ui-kit`, but may not replace `ui-kit`.

`packages/surfaces` owns:

- screen composition
- service flow composition
- service-specific screen structure
- service-specific journey behavior

It must not own reusable visual law.

`packages/app-shells` may compose from `ui-kit`, but may not create parallel reusable UI systems.

`packages/app-shells` owns:

- app shell hosting
- app-level shell composition
- shell orchestration

It must not own reusable component truth.

## Procedure

1. Identify every new visual or interaction element introduced by the slice.
2. Ask whether each element is token-level, primitive-level, pattern-level, state-level, CTA-level, layout-level, or direction/lang ownership.
3. Check whether an equivalent already exists in `ui-kit`.
4. If a close equivalent exists, extend `ui-kit` instead of duplicating locally.
5. If the element is reusable and no equivalent exists, create the canonical version in `ui-kit` first.
6. Keep only truly screen-local composition inside `app-shells` or `surfaces`.
7. Reject any duplicate family that would create parallel buttons, cards, headers, chips, tabs, dialogs, sheets, or CTA bars.

## Extraction Duty

Whenever a slice introduces something that is reusable, the agent must ask:

- is this token-level?
- is this primitive-level?
- is this reusable pattern-level?
- is this reusable state-level?
- is this direction/lang ownership?
- is this reusable CTA law?
- is this reusable layout law?

If yes, it must not remain local by default.
It must be evaluated for promotion into `ui-kit`.

## Promotion Before Duplication

Before creating any new visual or interaction structure inside `surfaces` or `app-shells`, check whether:

- an equivalent exists in `ui-kit`
- a close variant can be extended in `ui-kit`
- a reusable new canonical version should be created in `ui-kit`

Do not create local duplicates first and centralize later.

## No Parallel Component Families

There must not be competing families of:

- buttons
- cards
- list rows
- chips
- tabs
- headers
- empty states
- loading states
- dialog shells
- sheet shells
- CTA bars

If a family is reusable, it must be unified under `ui-kit`.

## Required Output

For every serious implementation slice, include:

- reused from ui-kit
- extended in ui-kit
- created in ui-kit
- intentionally local and why
- rejected local drift
- compliance verdict

## Compliance Verdict Scale

Use:

- NON_COMPLIANT
- PARTIAL
- COMPLIANT
- STRONG_COMPLIANCE

Only COMPLIANT and STRONG_COMPLIANCE are acceptable.

## Final Law

The goal is not to move every screen into `ui-kit`.

The goal is to ensure that every reusable UI law is centralized in `ui-kit`, and that `app-shells` and `surfaces` remain clean consumers and composers rather than parallel design systems.