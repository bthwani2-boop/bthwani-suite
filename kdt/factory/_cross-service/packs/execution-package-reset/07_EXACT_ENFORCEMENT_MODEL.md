# Exact Enforcement Model

## Executive Verdict

The new execution package is enforced by hard stop gates, exact filenames, exact schema fields, count-based proof, and downstream dependency restrictions.

## Enforcement Rules

1. exact file-name enforcement
   - phase completion is invalid if required exports or pack files do not exist under the exact names.
2. schema enforcement
   - required columns and required markdown sections are mandatory, not suggestive.
3. count-based proof
   - every phase must declare source counts, retained counts, duplicates, orphans, unresolved contradictions, and blocker state.
4. dependency enforcement
   - downstream phases may not substitute qualitative notes for missing upstream exports.
5. preview enforcement
   - preview is forbidden until journey and grouping truth exists; visual proof is never equal to execution proof.
6. ownership enforcement
   - `control-panel` may not absorb unresolved ownership or execution simply because it is convenient.
7. donor enforcement
   - donor familiarity is not proof; donor exhaustive census is required.

## Hard Failure Conditions

- missing required export filenames
- missing required schema columns
- duplicate retained keys greater than zero where uniqueness is required
- orphan operations or orphan screens greater than zero
- unresolved contradictions not explicitly marked `BLOCKED`
- service execution proceeding with mixed old-model and new-model packs without review

## Recommended Guards

- naming guard against legacy internal-name leakage
- registry guard that fails review if exact exports are absent
- no-qualitative-completion guard for execution phases
- no-early-preview guard before journey and grouping truth
- no-catch-all-`control-panel` guard

## Final Readiness Verdict

`ACCEPT_FOR_PACKAGING`