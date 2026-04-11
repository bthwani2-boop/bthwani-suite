# Agent Routing Index

This index is an annex under `.github/agents/bthwani-surface-core-lossless.agent.md` and is governed by that agent file.

## Base Profile First

Choose one base profile based on the primary intent of the task.

The base profile is the required routing anchor.
It defines the default skill load, default output contract, and default execution posture.

## Overlay Second

Add overlays only when the task proves the need for:

- visual premium review
- UX / flow review
- review gates or approval pauses
- violation inventory and anti-pattern conversion

An overlay is never the primary route by itself.
It only augments an already chosen base profile.

## Base Profile -> Skill Mapping

### `analyze.first-pass`

Loads:

- `bthwani-task-contracts`
- `bthwani-workspace-boundaries`
- `bthwani-unified-experience-review`

Purpose:

- analysis-only first pass
- choosing the next slice
- clarifying target fit before build
- returning the governed first-pass answer without widening into implementation

Default output shape:

- mandatory task header from `bthwani-task-contracts`
- nine-item first-pass contract from `bthwani-unified-experience-review`

Typical overlays:

- `overlay.design-review`
- `overlay.ux-flow-review`
- `overlay.violation-audit`

### `build.slice`

Loads:

- `bthwani-task-contracts`
- `bthwani-workspace-boundaries`
- `bthwani-slice-orchestration`
- `bthwani-central-ui-kit-compliance`

Purpose:

- implementing exactly one governed slice
- choosing ownership before file placement
- keeping the implementation narrow and target-fit

Default output shape:

- mandatory task header from `bthwani-task-contracts`
- one-slice execution cycle from `bthwani-slice-orchestration`
- `UiKitPressure` and ownership decision from `bthwani-central-ui-kit-compliance`

Typical overlays:

- `overlay.design-review`
- `overlay.ux-flow-review`
- `overlay.user-review-gates`
- `overlay.violation-audit`

Optional additive skill only when needed:

- `bthwani-unified-experience-review` for a full serious slice verdict after implementation

### `donor.trace-reconstruct`

Loads:

- `bthwani-workspace-boundaries`
- `bthwani-donor-escalation`
- `bthwani-donor-decomposition`

Purpose:

- governed donor search
- donor comparison when target evidence is weak
- decomposition and clean reconstruction of a donor-driven slice

Default output shape:

- source-escalation reasoning from `bthwani-donor-escalation`
- decomposition and review-stop logic from `bthwani-donor-decomposition`
- return-to-target decision before adoption

Typical overlays:

- `overlay.design-review`
- `overlay.ux-flow-review`
- `overlay.user-review-gates`
- `overlay.violation-audit`

Optional additive skill only when reusable promotion is likely:

- `bthwani-central-ui-kit-compliance`

### `ready.pack`

Loads:

- `bthwani-unified-experience-review`
- `bthwani-ready-pack`

Purpose:

- packaging truly closed artifacts
- updating `ready/` honestly
- preserving phase-scoped traceability without fake readiness

Default output shape:

- readiness decision from `bthwani-unified-experience-review`
- promotion and indexing behavior from `bthwani-ready-pack`

Typical overlays:

- `overlay.design-review`
- `overlay.ux-flow-review`
- `overlay.violation-audit`

### `infra.workspace-link`

Loads:

- `link-workspace-packages`

Purpose:

- repairing workspace package linking
- fixing unresolved sibling-package dependency wiring
- avoiding tsconfig or alias workarounds for real workspace-link failures

Default output shape:

- identify consumer and provider packages
- add or repair the real workspace dependency
- verify the link

Allowed overlays:

- none by default

## Overlay -> Skill Mapping

### `overlay.design-review`

Loads:

- `bthwani-design-sovereignty`

Adds:

- premium visual scoring
- hierarchy, density, luxury-feel, and RTL evaluation
- accept or revise design verdict

### `overlay.ux-flow-review`

Loads:

- `bthwani-ux-flow-sovereignty`

Adds:

- click-budget review
- state coverage review
- recovery, continuity, and branch-economy review
- proof-of-ease expectations

### `overlay.user-review-gates`

Loads:

- `bthwani-interactive-review`

Adds:

- mandatory pause points
- approval-gate logic
- continuation rules after visible directional changes

### `overlay.violation-audit`

Loads:

- `bthwani-violation-audit`

Adds:

- violation inventory
- anti-pattern conversion
- blocker and guard reporting

## Recommended Combinations

- analysis of a candidate slice with visual judgment: `analyze.first-pass` + `overlay.design-review`
- analysis of a candidate slice with flow judgment: `analyze.first-pass` + `overlay.ux-flow-review`
- one governed implementation slice with premium review: `build.slice` + `overlay.design-review`
- one governed implementation slice with premium and flow review: `build.slice` + `overlay.design-review` + `overlay.ux-flow-review`
- first major visual slice: `build.slice` + `overlay.design-review` + `overlay.user-review-gates`
- donor-driven reconstruction: `donor.trace-reconstruct` + needed review overlays
- closure packaging with blockers: `ready.pack` + `overlay.violation-audit`

## Disallowed or Discouraged Combinations

- `infra.workspace-link` with design, UX, donor, or ready overlays
- overlays without a base profile
- `donor.trace-reconstruct` when live target evidence is already sufficient
- `ready.pack` before a real artifact set exists
- `overlay.user-review-gates` for low-risk non-visual cleanup

## Tie-Break Rule

If more than one base profile seems possible:

1. prefer `analyze.first-pass` before `build.slice`
2. prefer `build.slice` before overlays-only thinking
3. prefer `donor.trace-reconstruct` only when donor evidence is truly necessary
4. prefer `ready.pack` only when the artifact set already exists
5. prefer `infra.workspace-link` only for dependency-link or workspace-resolution problems

If the task is mixed, classify the dominant intent first rather than blending multiple base profiles.

## Isolation Rule

`link-workspace-packages` is infra-only.
It is not part of normal BTHWANI surface governance and must stay isolated from normal design, UX, donor, and ready routing.

Base profiles are mutually exclusive by default.
Choose one anchor route, then add only the smallest necessary overlays or explicitly allowed additive skills.

## Canonical Ownership Reminder

- request classification -> `bthwani-task-contracts`
- repo, lane, and naming truth -> `bthwani-workspace-boundaries`
- reusable UI ownership -> `bthwani-central-ui-kit-compliance`
- visual premium scoring -> `bthwani-design-sovereignty`
- UX and flow scoring -> `bthwani-ux-flow-sovereignty`
- approval gates -> `bthwani-interactive-review`
- violation inventory -> `bthwani-violation-audit`