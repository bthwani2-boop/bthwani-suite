# PHASE_13_SCREEN_PURPOSE_LOCK

## 1. Purpose

Turn retained candidate screens into governed screens with canonical family, purpose, CTA, entry, exit, and required states.

## 2. Why This Phase Exists

This phase prevents screens from remaining vague containers, multi-purpose dashboards, or donor leftovers with renamed labels only.

## 3. Preconditions / Entry Conditions

- candidate-screen inventory is complete enough for the active wave
- UI Kit compatibility blockers are known
- retained candidates are explicit

## 4. Inputs

- screen inventory pack
- journey-lock pack
- operation-lock pack
- generic screen execution runbook

## 5. Allowed Work

- assign canonical families
- write purpose statements
- assign primary CTAs
- assign secondary actions
- define entry and exit rules
- define required state shells

## 6. Forbidden Work

- binding
- runtime truth
- multi-CTA screen ambiguity
- purpose-free routes

## 7. Exact Execution Order

1. open the `screen-purpose-lock` request
2. review the retained candidate catalog
3. assign a canonical family to each retained candidate
4. write one purpose statement per retained candidate
5. define one primary CTA or an explicit no-primary-CTA reason
6. define secondary actions, entry rules, exit rules, and required state shells
7. align screen ids and names with clean naming
8. export the purpose lock and stop before flow compression

## 8. Required Decisions

- canonical family per retained candidate
- purpose per retained candidate
- primary CTA per retained candidate
- entry and exit rules
- required state shells

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_screen-purpose-lock.md`
- `kdt/factory/<service>/packs/screen-purpose-lock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-purpose-lock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/screen-purpose-lock/02_SCREEN_CATALOG.csv`
- `kdt/factory/<service>/packs/screen-purpose-lock/03_SCREEN_PURPOSE_LOCK.csv`
- `kdt/factory/<service>/packs/screen-purpose-lock/04_SCREEN_NOTES.md`
- `kdt/factory/<service>/packs/screen-purpose-lock/05_STATE_NOTES.md`
- `kdt/factory/<service>/packs/screen-purpose-lock/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/screen-purpose-lock/07_IMPLANT_GUIDE.md`
- `kdt/factory/<service>/packs/screen-purpose-lock/08_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/screen-purpose-lock/SCREEN_PURPOSE_LOCK.csv`
- `kdt/factory/<service>/index/SCREEN_PURPOSE_LOCK_INDEX.md`

## 10. Artifact Schema Expectations

`03_SCREEN_PURPOSE_LOCK.csv` must include at least:

- `screen_id`
- `canonical_family`
- `purpose_statement`
- `primary_cta`
- `destructive_action`
- `secondary_actions`
- `entry_rule`
- `exit_rule`
- `required_state_shells`
- `related_operation`

`04_SCREEN_NOTES.md` must define:

- family rationale
- purpose conflicts resolved
- naming normalization notes

`05_STATE_NOTES.md` must define:

- states referenced by the purpose lock
- unresolved state ambiguity to address in Phase `16`

## 11. Cross-File Updates

- update preview-route naming and registry ids when purpose lock normalizes candidate ids or families

## 12. Surface Impact

- the current surface becomes explicit enough to support compression decisions
- no next surface unlock occurs if purpose remains ambiguous

## 13. UI Kit Impact

- required shared pattern pressure becomes visible
- UI Kit does not expand yet except for blocker documentation

## 14. Contract Impact

- contract work remains forbidden
- operation-to-screen demand becomes clearer for later phases

## 15. Runtime Impact

- runtime work remains out of scope

## 16. Validation Checklist

- every retained candidate has one clear purpose
- every retained candidate has one primary CTA or lawful no-primary-CTA reason
- entry and exit are explicit
- required state shells are explicit

## 17. Exit Criteria

- retained candidates are purpose-locked well enough to compress routes and steps

## 18. Failure Modes / Common Mistakes

- leaving screens with two primary jobs
- using vague CTAs such as "continue" with no meaning
- ignoring required states until later

## 19. Anti-Patterns

- "the screen purpose is obvious from the title"
- "we can keep two primary CTAs for flexibility"

## 20. Handoff To Next Phase

Deliver:

- purpose-locked retained screens
- clear CTA and state expectations

Next lawful file: `PHASE_14_FLOW_COMPRESSION.md`