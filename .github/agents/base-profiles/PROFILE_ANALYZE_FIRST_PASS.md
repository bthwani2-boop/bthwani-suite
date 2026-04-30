# Base Profile: analyze.first-pass

## Always Load

- `bthwani-task-contracts`
- `bthwani-workspace-boundaries`
- `bthwani-unified-experience-review`

## Use When

- the task is still analysis-only
- the next slice must be chosen
- target-fit must be clarified before building
- a first-pass governed answer is needed

## Primary Contract

Use the nine-item first-pass return contract from `bthwani-unified-experience-review`.
Do not widen into a full implementation report by default.

## Typical Overlays

- `overlay.violation-audit` when repeated drift or blockers must be enumerated
- `overlay.design-review` only if strong visual comparison is requested during analysis
- `overlay.ux-flow-review` only if journey quality must be judged during analysis
