---
name: bthwani-donor-decomposition
description: 'Run user-gated donor decomposition for bthwani-suite surfaces. Use when a donor screen, shell, or pattern looks strong and may be split into ui-kit, app-shells, and surfaces before clean reconstruction, with explicit review stops before decomposition, centralization, and rebuild.'
---

# BTHWANI Donor Decomposition

## When to Use

- A donor screen, shell, or pattern appears premium, strong, or strategically useful
- You want to convert donor insight into reusable `ui-kit`, `app-shells`, and `surfaces` pieces
- A user-gated decomposition and reconstruction sequence is required
- You need to prevent direct implementation from a donor artifact

## Purpose

When a strong donor screen or strong donor design candidate is found, do not jump directly into implementation.

Move through this user-gated sequence:

1. donor discovery
2. donor evaluation
3. canonical decomposition
4. ui-kit extraction proposal
5. user review
6. ui-kit implementation
7. user review
8. clean screen reconstruction
9. user review
10. only then proceed

## Donor Discovery Law

When a screen, shell, pattern, or donor candidate appears strong, premium, or strategically useful, first classify it as:

- donor candidate
- reusable candidate
- reference-only
- reject
- [TBD]

Do not implement from it immediately.

## Donor Evaluation Pause Law

When a strong donor screen is found, pause and present:

- what was found
- why it is strong
- what makes it visually, UX-wise, or flow-wise valuable
- what is reusable
- what is risky
- what is likely donor noise
- whether it should be decomposed, partially extracted, used as reference-only, or rejected

Then stop for user review before implementation begins.

## Canonical Decomposition Law

After the user allows continuation, decompose the donor candidate into:

- token-level candidates
- primitive-level candidates
- reusable pattern-level candidates
- state-level candidates
- direction/lang ownership candidates
- shell-level candidates
- screen-local composition
- legacy noise
- rejected carryover

Do not skip decomposition.

## Decomposition Review Pause Law

After decomposition, present:

- what should go to `ui-kit`
- what should remain in `surfaces`
- what should remain in `app-shells`
- what must be rejected
- what remains [TBD]

Then stop again for user review before central implementation begins.

## Central UI Kit First Law

If reusable central UI truth is identified, implement or extend it in `ui-kit` first before rebuilding the screen locally.

Do not rebuild the screen first and centralize later.

## UI Kit Review Pause Law

After implementing or extending `ui-kit`, stop and present:

- what was added to `ui-kit`
- what was extended in `ui-kit`
- what was intentionally kept out
- whether central compliance is satisfied

Then pause for user review before reconstructing the screen.

## Clean Reconstruction Law

Only after the user has reviewed the central `ui-kit` changes may the screen be reconstructed in:

- `packages/surfaces`
- `packages/app-shells`
- or both where ownership requires it

The reconstruction must use the new central pieces rather than local replicas.

## Reconstruction Review Pause Law

After reconstructing the screen, stop and hand the result to the user for review before:

- broadening the same pattern to other screens
- moving to the next donor screen
- entering the next service wave
- spreading the same visual language widely

## No Silent Batch Reconstruction Law

If multiple strong donor screens exist, do not decompose and rebuild them in a batch without review.

Process them one by one or in very small governed groups only when the user explicitly allows grouped continuation.

## User Taste Sovereignty Law

Even if the donor screen is objectively strong and the reconstruction is structurally correct, the user's satisfaction remains the final approval gate for visual direction.

Always allow the user to say:

- this direction is correct
- this direction is close but needs revision
- this direction is wrong
- continue
- stop
- refine only this slice

## Slice Closure Law

Do not move to the next donor-driven screen until the current one has been classified as one of:

- APPROVED_AS_DIRECTION
- APPROVED_WITH_REFINEMENTS
- REVISE_AND_REVIEW_AGAIN
- REJECT_DIRECTION
- BLOCKED_PENDING_USER_CHOICE

## Preferred Sequence

For donor-driven premium work, the preferred sequence is:

1. find strong donor candidate
2. explain why it is strong
3. pause for review
4. decompose it
5. pause for review
6. add or extend central ui-kit truth
7. pause for review
8. rebuild clean screen in surfaces or app-shells
9. pause for review
10. refine if needed
11. only then continue to the next slice

## Final Law

A strong donor screen is not a direct implementation source.

It is first:

- discovered
- evaluated
- approved for decomposition
- decomposed
- centralized where necessary
- reconstructed cleanly
- reviewed by the user
- approved before expansion