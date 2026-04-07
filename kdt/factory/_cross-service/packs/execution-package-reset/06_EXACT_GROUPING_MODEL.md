# Exact Grouping Model

## Executive Verdict

Grouping is now a first-class execution layer, not an afterthought hidden inside flow notes.

## Grouping Rules

1. every retained screen belongs to exactly one group
2. every group belongs to exactly one wave
3. every group belongs to exactly one dependency lane
4. every group has explicit preview, implementation, validation, and seal order
5. no screen may be built outside group and lane truth

## Default Group Archetypes

- `entry-discovery`
- `core-task`
- `handoff`
- `fulfillment`
- `oversight`
- `tracking`
- `issue-recovery`
- `secondary-optional`

## Default Lane Rules

- `lane-core`: no parallelism beyond current group closure
- `lane-shared-ui`: parallel only when it directly unblocks the active current group
- `lane-support`: may proceed only after the upstream core group has explicit truth
- `lane-oversight`: may not overtake the core path unless the service is intrinsically internal

## Prohibited Grouping Behavior

- do not let donor routes define final groups
- do not let `control-panel` open early because it is easier to visualize
- do not treat modal or sheet count as group logic by itself
- do not compress before all retained screens are fully spec'd

## Final Readiness Verdict

`ACCEPT_FOR_PACKAGING`