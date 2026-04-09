---
name: bthwani-unified-experience-review
description: 'Apply the mandatory unified experience review and first-slice analysis contract for bthwani-suite surface work. Use when doing analysis-only first-pass planning, choosing the first slice, producing Executive verdict / Recommended target service / Recommended exact first slice, or wrapping a serious slice with the full unified experience verdict and final readiness decision.'
---

# BTHWANI Unified Experience Review

## When to Use

- Before implementation, when the task is still in first-pass analysis mode
- When selecting the recommended target service and exact first slice
- When a serious surface slice needs the mandatory unified experience review output
- When the response must include a final readiness verdict rather than an informal summary

## Purpose

This skill restores two missing contracts that used to live inside the deleted monolithic agent:

- the mandatory unified experience review contract
- the analysis-only first-slice return contract

Use it to keep first-pass analysis strict and to keep final slice reviews structured, comparable, and adoption-safe.

## Unified Experience Acceptance Law

A slice is not accepted merely because it compiles.

A slice is accepted only if it is:

- structurally clean
- target-fit correct
- ownership-correct
- visually premium
- experientially intelligent
- flow-efficient
- elegant in Arabic and English
- reusable where appropriate
- low-noise
- low-friction
- worthy of becoming the new quality standard

## Mandatory Unified Experience Review

For every serious implementation slice, always output:

1. Executive verdict
2. Request classification
3. Source trace summary
4. Target repo fit summary
5. Extracted facts
6. Cleaned / normalized model
7. Violations found
8. Anti-patterns found
9. Prevention guidance
10. Implant / build decision
11. Design review
12. UX / Flow review
13. Unified experience verdict
14. Final readiness verdict

## Unified Experience Verdict Scale

Use:

- `FAIL`
- `WEAK`
- `PASS`
- `STRONG`
- `ELITE`

## Output Verdicts

Use one of:

- `Ready to implement`
- `Partially ready`
- `Reference only`
- `Blocked`
- `Needs more evidence`
- `Needs target-fit revision`
- `Needs design revision`
- `Needs UX/flow revision`

And final readiness must be one of:

- `ACCEPT_FOR_IMPLEMENTATION`
- `REVISE_BEFORE_IMPLEMENTATION`
- `REFERENCE_ONLY`
- `REJECT_FOR_ADOPTION`

## Mandatory Implementation Report

After any slice implementation, report:

- files created
- files updated
- files intentionally not touched
- donor sources consulted
- reusable pieces extracted
- violations avoided
- [TBD] gaps
- design score summary
- UX/flow score summary
- next recommended slice

## Final Adoption Law

A legacy artifact that merely exists is not implementation-ready.

A valid clean adoption candidate must be:

- traced
- understood
- classified
- normalized
- target-fit checked
- cleaner than source
- safer than source
- less noisy than source
- correctly placed by ownership
- smaller in entropy than the old implementation
- more beautiful than the old implementation where beauty matters
- more elegant than the old implementation where UX matters
- more intelligent than the old implementation where flow matters

If the output is not cleaner, stricter, lower-noise, better named, better placed, visually stronger, experientially smarter, and safer for `bthwani-suite` than the source, the job is not done.

## Analysis-Only First-Slice Contract

Start in analysis-only mode when the task is still at first-pass planning.

Current phase assumptions for this mode:

- UI / UX / Flow only
- No API
- No binding
- No integration
- No runtime
- No contract work

In this mode, analyze only:

- `docs/services/**`
- `packages/ui-kit`
- `packages/app-shells`
- `packages/surfaces`

## First-Pass Return Contract

When operating in analysis-only first-pass mode, return only:

1. Executive verdict
2. Recommended target service
3. Recommended exact first slice
4. Why this is the correct first slice
5. Donor candidates relevant to this slice
6. UiKitPressure for this slice
7. What is forbidden at this stage
8. Stop

Do not widen the response beyond this contract unless the user explicitly asks for broader output.

## How To Choose The First Slice

When using the first-pass return contract, prefer a first slice that maximizes:

- platform leverage
- strongest clean target fit
- clear `ui-kit` pressure
- low donor carryover risk
- strong documentation support
- clear ownership between shell and surface
- high design leverage
- high UX leverage
- clear flow leverage

## Mode Selection Rule

Use the correct contract based on stage:

- analysis-only first pass: use the eight-item first-slice return contract
- serious slice review or post-implementation report: use the mandatory unified experience review

If the stage is ambiguous, classify it first before answering.

## Final Law

Do not let first-pass planning drift into informal brainstorming, and do not let serious slice review degrade into vague commentary.

Use this skill to keep both stages strict:

- narrow and disciplined during first-slice analysis
- comprehensive and verdict-driven during final slice review