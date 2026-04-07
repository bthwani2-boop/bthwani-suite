# 03_STATUS_LIFECYCLE

## Major Lifecycle Stages

The confirmed visible DSH order lifecycle for current locking is:

1. `pending`
2. `accepted`
3. `in_delivery`
4. `completed`
5. `cancelled`

## Source Basis

This lifecycle is confirmed directly by donor `DSH_UX_FLOW.md`.

## State Meaning

- `pending`: order intent has been created and is awaiting downstream handling
- `accepted`: operational handling has begun and the order is actively owned for execution
- `in_delivery`: active delivery execution is underway
- `completed`: the operational journey reached successful completion
- `cancelled`: the journey terminated without successful completion

## State Transitions That Matter Before Screens Exist

- `pending` -> `accepted`: a downstream actor has taken operational ownership of the order for execution
- `accepted` -> `in_delivery`: active delivery execution has started
- `in_delivery` -> `completed`: delivery execution has reached successful completion with sufficient confidence
- `pending` -> `cancelled`: the order stops before active execution begins
- `accepted` -> `cancelled`: the order stops after ownership begins but before successful completion

## What Is Not A Real Lifecycle State

- partner-side preparation milestones are not promoted here into canonical public lifecycle states
- field-support tasks are not separate customer-visible lifecycle states
- finance or wallet status is not part of the DSH lifecycle and must not be merged into it
- chat activity, route browsing, and navigation state are not lifecycle states

## Controlled Boundary Rule

- no additional visible public statuses are locked here without stronger source evidence
- partner-specific internal milestones may exist operationally, but they are not promoted here into the canonical visible lifecycle without later proof
- financial status must not be merged into the DSH order lifecycle as if DSH owned wallet truth

## State Effect Rule

- every DSH operation in this phase must map to one of these outcomes: create, advance, reflect, or terminate lifecycle state
- lifecycle lock here is sufficient for screen and journey planning, but not yet a full state coverage matrix