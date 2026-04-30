---
name: bthwani-slice-orchestration
description: 'Control slice sequencing for bthwani-suite surface work. Use when choosing the next slice, enforcing one-slice-at-a-time execution, handling home-shell work, or deciding governed build order across services.'
---

# BTHWANI Slice Orchestration

## When to Use

- Choosing the exact next slice
- Preventing broad multi-slice implementation
- Planning the first visible shell or screen slice
- Handling home-shell or service-hub work
- Deciding governed build order across services and surfaces

## Interactive Slice Execution Law

You must never implement broadly.

You must work in small governed slices only.

Each cycle must be:

1. analyze
2. classify
3. propose exactly one next slice only
4. explain why it is the correct next slice
5. map exact target files
6. map donor references
7. map forbidden carryovers
8. evaluate design pressure
9. evaluate UX/flow pressure
10. implement only the chosen slice
11. report exact files created or updated
12. report unresolved `[TBD]`
13. stop

No multi-slice execution in one turn unless explicitly requested.

## First-Slice Selection Law

When deciding the first slice, prefer this order:

1. highest platform leverage
2. strongest clean target fit
3. highest reusable UI-kit pressure clarity
4. lowest donor carryover risk
5. best interaction value
6. strongest documentation support in `docs/services`
7. clearest ownership between shell and surface
8. highest design leverage
9. highest UX leverage
10. clearest flow leverage

This means a platform home or service-hub baseline may come before deep service flow implementation when it unlocks multiple surfaces cleanly.

## Home Shell Law

Treat strong legacy home screens as donor insight only.

For home-related work:

- extract layout law
- extract information hierarchy
- extract CTA placement logic
- extract tile families
- extract section patterns
- extract shell behavior
- reject local hacks
- reject local duplicated components
- reject local design systems
- reject donor residue that weakens elegance
- rebuild cleanly using `packages/ui-kit`, `packages/app-shells`, and `packages/surfaces` according to ownership

Never move legacy home screens as-is into live tree.

## Live Build Order Law

Preferred governed order:

1. forensic repo analysis
2. intelligence map from `docs/services`
3. donor risk map
4. home shell and platform shell baseline
5. first service first active slice
6. next service slice only after clean closure of previous slice bundle
7. control-panel or partner/captain/field support slices only when they logically follow
8. no deep parallel multi-service implementation

## Service Order Guidance

Use actual service intelligence from `docs/services` to decide order.

When evidence is strongest for one service, prefer it.

When one service is clearly best documented and best wave-structured, it may become the first primary implementation track.

Do not force all services equally.

## Final Law

This skill exists to keep execution narrow, sequenced, and approval-friendly instead of sprawling or donor-driven.