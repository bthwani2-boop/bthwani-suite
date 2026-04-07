# PHASE_08_ACTOR_CONTEXT_EXHAUSTIVE_EXTRACTION

## 1. Purpose

Recover the full actor, context, entitlement, visibility, and exclusion truth for the active service before operation or screen work begins.

## 2. Exact Inputs

- `docs/services/<service>/00_SERVICE_PROFILE.md`
- `docs/services/<service>/01_ACTOR_CONTEXT_MATRIX.csv`
- `docs/services/<service>/03_SURFACE_MATRIX.csv`
- `docs/reality-intake/02_CURRENT_SERVICES_MAP.md`
- `docs/reality-intake/03_CURRENT_SURFACES_MAP.md`
- `docs/reality-intake/04_CURRENT_SCREENS_INVENTORY.md`
- `docs/reality-intake/05_NOISE_DUPLICATION_DRIFT_REPORT.md`
- `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`

## 3. Exact Source-Of-Truth Inputs

- `<legacy_repo_root>/services/<service>/governance/**`
- `<legacy_repo_root>/services/<service>/**/rbac*`
- `<legacy_repo_root>/services/<service>/**/abac*`
- `<legacy_repo_root>/packages/surfaces/src/**` only when actor visibility or entitlements are encoded in guards, wrappers, or route gates
- repo-local governance for approved internal surface names and type gates

If the donor source root is unavailable, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Extract all of the following for the active service:

- actors
- actor labels and donor aliases
- typed actor gates and entitlements
- visibility scopes
- context roles
- actor-to-surface legality
- included actors
- excluded actors
- explicit no-access contexts
- donor-to-target naming normalization points

No selective or reactive actor recovery is allowed in this phase.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_actor-context-exhaustive-extraction.md`
- `kdt/factory/<service>/packs/actor-context-exhaustive-extraction/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/actor-context-exhaustive-extraction/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/actor-context-exhaustive-extraction/02_DONOR_EXHAUSTIVE_CENSUS.csv`
- `kdt/factory/<service>/packs/actor-context-exhaustive-extraction/03_ACTOR_CONTEXT_MASTER.csv`
- `kdt/factory/<service>/packs/actor-context-exhaustive-extraction/04_ENTITLEMENT_AND_VISIBILITY_RULES.md`
- `kdt/factory/<service>/packs/actor-context-exhaustive-extraction/05_BLOCKERS_AND_GAPS.md`
- `kdt/factory/<service>/packs/actor-context-exhaustive-extraction/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/actor-context-exhaustive-extraction/07_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/exports/donor-exhaustive-census/DONOR_EXHAUSTIVE_CENSUS.csv`
- `kdt/factory/<service>/exports/actor-context-exhaustive-extraction/ACTOR_CONTEXT_MASTER.csv`
- `kdt/factory/<service>/index/ACTOR_CONTEXT_EXHAUSTIVE_EXTRACTION_INDEX.md`

## 6. Required File Formats And Schemas

`02_DONOR_EXHAUSTIVE_CENSUS.csv` must include at least:

- `record_type`
- `service`
- `donor_name`
- `normalized_name`
- `source_path`
- `surface`
- `actor`
- `context`
- `coverage_status`
- `notes`

`03_ACTOR_CONTEXT_MASTER.csv` must include at least:

- `actor_id`
- `actor_label`
- `normalized_surface`
- `context_role`
- `visibility_scope`
- `entitlements`
- `allowed_contexts`
- `excluded_contexts`
- `donor_sources`
- `source_status`
- `decision_status`
- `notes`

## 7. Manual Work Procedure

1. open the request file and record the active donor source root
2. read the bootstrap service profile and current actor matrix without trusting them as complete truth
3. scan the donor service governance, RBAC, ABAC, and type-gate sources exhaustively for actor and context evidence
4. write every actor, donor alias, entitlement clue, and visibility clue into `DONOR_EXHAUSTIVE_CENSUS.csv`
5. normalize actor and surface names to target-repo names without deleting donor trace
6. split merged or vague actors into clean target actors when the evidence demands it
7. write `ACTOR_CONTEXT_MASTER.csv` with included and excluded contexts made explicit
8. write the entitlement and visibility rules with reasons for every exclusion
9. run duplicate, orphan, unmapped, and contradiction checks
10. stop if any approved surface still lacks explicit actor legality

## 8. Grouping / Wave Logic

This phase is `Wave 0` only.

Rules:

- no screen groups open here
- no preview opens here
- actor recovery may classify a surface as initiating, execution, oversight, support, or excluded, but it may not claim screen readiness

## 9. Decision Rules

- normalize donor `app-user` to `app-client`
- normalize donor `mcpw` to `control-panel`
- keep donor names in source trace only
- split vague donor `user` or `ops` buckets when target ownership requires separation
- mark unsupported assumptions as `UNPROVEN`, not as clean truth

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- donor source root is missing
- an approved surface lacks actor legality
- an excluded actor is implied but not written
- duplicate actor identities remain unresolved
- actor entitlements are asserted without traceable evidence

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- donor actor/context row count
- normalized actor row count
- duplicate actor ids = `0`
- orphan approved surfaces = `0`
- unmapped donor actor references = `0`
- unresolved contradictions = `0` or explicitly `BLOCKED`
- evidence index includes every source used for each actor row

## 12. Exact Handoff To Next Phase

Deliver:

- updated `DONOR_EXHAUSTIVE_CENSUS`
- `ACTOR_CONTEXT_MASTER`
- explicit entitlement and visibility rules
- explicit blocker list when any actor truth remains `BLOCKED`

Next lawful file: `PHASE_09_OPERATION_MASTER_EXTRACTION.md`