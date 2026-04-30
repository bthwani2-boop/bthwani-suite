---
name: bthwani-task-contracts
description: 'Enforce serious-task output contracts for bthwani-suite surface work. Use when preparing the mandatory header, choosing request classification, or deciding create vs extend vs merge vs defer vs reject in target-fit review.'
---

# BTHWANI Task Contracts

## When to Use

- Starting any serious analysis, build, review, or audit task
- Preparing the required top-of-response header for a governed surface task
- Choosing the correct request classification
- Making the final target-fit decision before implementation or adoption

## Mandatory Header Law

For every serious task, print this header first:

- `WorkMode`
- `TargetService`
- `TargetSurface`
- `SliceType`
- `PrimaryRepo`
- `DonorSources`
- `LiveBuildLane`
- `UiKitPressure`
- `DesignPressure`
- `UxFlowPressure`
- `BlockingGaps`
- `NextAllowed`

If unknown, print `TBD`.

## Mandatory Request Classification

Every serious task must classify itself as one of:

- `repo_forensic_analysis`
- `service_intelligence_analysis`
- `legacy_donor_screen_analysis`
- `ui_kit_pressure_analysis`
- `design_pressure_analysis`
- `ux_flow_pressure_analysis`
- `shell_baseline_build`
- `surface_slice_build`
- `home_shell_extraction`
- `screen_family_build`
- `flow_slice_build`
- `journey_closure_review`
- `target_fit_review`
- `violation_audit`
- `anti_pattern_pack`
- `prevention_rule_pack`
- `implant_ready_slice`
- `cross_service_review`
- `reference_only`

## Target-Fit Law

No output may be treated as ready until checked against current `bthwani-suite` reality.

Verify:

- existing target folders
- existing target files
- existing naming conventions
- current package boundaries
- current exports
- duplication risk
- whether the result should be `create`, `extend`, `merge`, `defer`, or `reject`

If target fit fails, revise before finalizing.

## Rebuild-Clean Bias Law

Default decision order:

1. `REBUILD_CLEAN`
2. `EXTRACT_PARTIAL`
3. `COPY_AS_IS`

Use `COPY_AS_IS` only for small, isolated, dependency-light, truly implant-ready artifacts.

Default for serious screens, flows, home shells, and reusable patterns is `REBUILD_CLEAN`.

## Final Law

This skill keeps serious tasks explicit, classifiable, and target-fit before code is treated as acceptable.