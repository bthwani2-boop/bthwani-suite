# Base Profile: build.slice

<!-- NOTE (example-only): This document may contain BThwani tokens or identifiers used for policy examples. They are not runtime secrets. See kdt/merge-run/.../proposed/PROTECTED_TOKENS_ALLOWLIST.md. -->

## Always Load

- `bthwani-task-contracts`
- `bthwani-workspace-boundaries`
- `bthwani-slice-orchestration`
- `bthwani-central-ui-kit-compliance`

## Use When

- exactly one governed slice must be implemented
- shell, screen-family, or thin surface work is in scope
- reusable ownership must be judged before code is placed

## Primary Contract

- classify the task
- choose one slice only
- map exact files
- decide reusable ownership
- implement only that slice
- stop

## Typical Overlays

- `overlay.design-review` when visual premium quality is in scope
- `overlay.ux-flow-review` when journey, state, or click quality is in scope
- `overlay.user-review-gates` when the slice is a first or major visual direction
- `overlay.violation-audit` when existing drift must be diagnosed before building
- `bthwani-unified-experience-review` only when a final serious slice review is required
