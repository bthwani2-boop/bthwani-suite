# PHASE_14_FLOW_COMPRESSION

## 1. Purpose

Reduce route count, step count, and decision noise before UI Kit expansion and contract pressure analysis accelerate.

## 2. Why This Phase Exists

This phase prevents donor sprawl from surviving under new names and keeps the shortest lawful path lean before later phases build on it.

## 3. Preconditions / Entry Conditions

- retained candidates have purpose, CTA, entry, exit, and state expectations
- current-wave screen groups are explicit

## 4. Inputs

- screen-purpose lock pack
- screen inventory pack
- journey-lock pack
- generic screen execution runbook

## 5. Allowed Work

- merge excess screens
- convert minor steps into sheets, modals, sections, inline steps, or state shells
- reduce route clutter
- record before and after structure explicitly

## 6. Forbidden Work

- preserving route clutter because the donor repo once had it
- expanding new screen groups before compression decisions are written
- binding or runtime work

## 7. Exact Execution Order

1. open the `flow-compression` request
2. review the purpose-locked retained candidates
3. identify where separate routes do not own independent meaning
4. merge or convert those steps explicitly
5. document before and after route structure
6. record click-budget delta where the change materially affects the user path
7. export compression artifacts and update preview notes

## 8. Required Decisions

- which routes remain screens
- which routes become sheets, modals, sections, inline steps, or states
- where click-budget reduction matters enough to be recorded

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_flow-compression.md`
- `kdt/factory/<service>/packs/flow-compression/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/flow-compression/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/flow-compression/02_FLOW_COMPRESSION_REPORT.md`
- `kdt/factory/<service>/packs/flow-compression/03_FLOW_COMPRESSION_BEFORE_AFTER.csv`
- `kdt/factory/<service>/packs/flow-compression/04_SCREEN_CONVERSION_DECISIONS.csv`
- `kdt/factory/<service>/packs/flow-compression/05_CLICK_BUDGET_NOTES.md`
- `kdt/factory/<service>/packs/flow-compression/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/flow-compression/07_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/flow-compression/FLOW_COMPRESSION_BEFORE_AFTER.csv`
- `kdt/factory/<service>/exports/flow-compression/SCREEN_CONVERSION_DECISIONS.csv`
- `kdt/factory/<service>/index/FLOW_COMPRESSION_INDEX.md`

## 10. Artifact Schema Expectations

`03_FLOW_COMPRESSION_BEFORE_AFTER.csv` must include at least:

- `service`
- `surface`
- `journey_branch`
- `before_route_count`
- `after_route_count`
- `conversions_applied`
- `click_budget_delta`
- `reason_for_compression`
- `notes`

`04_SCREEN_CONVERSION_DECISIONS.csv` must include at least:

- `candidate_id`
- `old_form`
- `new_form`
- `reason`
- `impact`

## 11. Cross-File Updates

- update preview registry and screen catalog references to reflect merges and conversions
- remove preview routes that no longer survive compression

## 12. Surface Impact

- the current surface becomes leaner before further expansion
- next waves must not inherit unresolved route clutter

## 13. UI Kit Impact

- compression may eliminate patterns that would otherwise pollute UI Kit
- only after compression may real shared pattern demand be trusted in Phase `15`

## 14. Contract Impact

- no contract work is allowed yet
- compression may reduce false API demand caused by over-split screens

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- before and after route structure is explicit
- conversion decisions are explicit
- route count is not being preserved by nostalgia

## 17. Exit Criteria

- the screen set is lean enough for real UI Kit expansion and state work

## 18. Failure Modes / Common Mistakes

- keeping screens separate because they already exist
- compressing without documenting what changed
- hiding major completion or review screens as if they were trivial steps

## 19. Anti-Patterns

- "we can compress later after binding"
- "every donor screen deserves to survive"

## 20. Handoff To Next Phase

Deliver:

- compressed route structure
- explicit conversion decisions

Next lawful file: `PHASE_15_UI_KIT_EXPANSION.md`