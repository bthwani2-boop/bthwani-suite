# V4-4 — SAFE PRELIMINARY DESIGN BASELINE

## Purpose

Allow the agent to help with a preliminary design baseline without destroying screens. This is not final design. The owner will still review every screen manually.

## Allowed design scope

Only after V4-1/V4-2/V4-3 gates are satisfied.

Allowed:

- Improve layout hierarchy, spacing, grouping, CTA clarity, empty/loading/error/offline/success states.
- Make screens more premium, modern, low-noise, RTL-correct, and consistent with current BThwani design system.
- Use existing `@bthwani/ui-kit` public exports/components/tokens only.
- Improve already-wired screens/workspaces/sheets/states.
- Add local sections/sheets/states only if already gap-mapped and needed.

Forbidden:

- No ui-kit source edits.
- No hardcoded random colors.
- No local design system.
- No new brand palette.
- No API/runtime/WLT logic.
- No route proliferation.
- No screen-per-block.
- No visual rewrite of unrelated screens.
- No destructive deletion.

## Visual contract

- RTL correctness: text alignment, icon/text clustering, chevrons/actions on correct side, no broken space-between Arabic rows.
- CTA hierarchy: one clear primary CTA per state, secondary actions lower emphasis.
- State coverage: loading, empty, error, offline, disabled, success where relevant.
- Low-click: keep journeys compact.
- Premium 2026: clean hierarchy, practical density, coherent tokens, minimal noise.
- BThwani identity: use design-system color palette/tokens in ui-kit; do not hardcode only raw brand colors.

## Required outputs

- `dsh/docs/closure/DSH_SAFE_DESIGN_BASELINE_MATRIX.csv`
- `dsh/docs/closure/DSH_V4_4_SAFE_DESIGN_BASELINE_EVIDENCE.md`
- updated `DSH_UI_REVIEW_QUEUE.md`

`DSH_SAFE_DESIGN_BASELINE_MATRIX.csv` columns:

```csv
surface,file_path,screen_or_workspace,design_action,what_changed,what_did_not_change,ui_kit_components_used,rtl_check,state_check,cta_check,visual_review_status,notes
```

## Gate

V4-4 is complete only if:

- No ui-kit source files changed.
- No business logic changed.
- No API/WLT/runtime touched.
- Every changed visual file has a row in the design baseline matrix.
- `tsc` and `diff --check` are clean.
