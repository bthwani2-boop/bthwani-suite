# PHASE_27_NEXT_SERVICE_REPEAT

## 1. Purpose

Unlock the next service only after the current service is sealed, donor residue is quarantined, and re-entry conditions are explicit.

## 2. Exact Inputs

- `kdt/factory/<service>/packs/evidence-and-sign-off/**`
- `kdt/factory/<service>/packs/legacy-quarantine/**`
- `docs/services/00_SERVICE_BUILD_ORDER.md`
- `docs/governance/BTHWANI GUIDE — Full Unified Governing & Execution Reference.md`

## 3. Exact Source-Of-Truth Inputs

- current service seal evidence from Phase `25`
- legacy quarantine evidence from Phase `26`
- current governed service order
- current repo readiness observation

If current service seal or legacy quarantine status is ambiguous, the phase is `BLOCKED`.

## 4. Exhaustive Extraction Scope

Confirm all of the following before opening the next service:

- current service seal verdict
- current service blocker status
- legacy residue and quarantine status
- whether service order changed lawfully
- whether the next service already has a valid foundation layer
- exact re-entry phase for the next service

No next-service unlock may rely on momentum, habit, or assumption.

## 5. Mandatory Output Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_next-service-unlock.md`
- `kdt/factory/<service>/packs/next-service-unlock/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/next-service-unlock/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/next-service-unlock/02_SERVICE_SEAL_CONFIRMATION.md`
- `kdt/factory/<service>/packs/next-service-unlock/03_NEXT_SERVICE_UNLOCK_NOTE.md`
- `kdt/factory/<service>/packs/next-service-unlock/04_UPDATED_SERVICE_ORDER.md`
- `kdt/factory/<service>/packs/next-service-unlock/05_REENTRY_DECISION.md`
- `kdt/factory/<service>/packs/next-service-unlock/06_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/next-service-unlock/07_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/index/NEXT_SERVICE_UNLOCK_INDEX.md`

## 6. Required File Formats And Schemas

`02_SERVICE_SEAL_CONFIRMATION.md` must include at least:

- `current_service_verdict`
- `blocker_status`
- `evidence_references`

`03_NEXT_SERVICE_UNLOCK_NOTE.md` must include at least:

- `next_service_slug`
- `why_it_may_open`
- `reentry_phase`
- `forbidden_shortcuts`

`04_UPDATED_SERVICE_ORDER.md` must include at least:

- whether the order changed
- why it changed or why it remained stable

`05_REENTRY_DECISION.md` must include at least:

- `next_service_foundation_status`
- `required_reentry_phase`
- `blocking_conditions`
- `decision_status`

## 7. Manual Work Procedure

1. open the request file and confirm the current service scope being sealed
2. confirm the current service seal status from Phase `25` evidence
3. confirm that legacy quarantine blockers are closed or explicitly bounded from Phase `26`
4. review `docs/services/00_SERVICE_BUILD_ORDER.md`
5. update service order only if a governed change is truly required
6. determine whether the next service must re-enter at Phase `07` or Phase `08`
7. write the unlock note and re-entry decision explicitly
8. stop if next-service readiness still depends on inherited assumptions from the previous service

## 8. Grouping / Wave Logic

This phase does not open a new service wave automatically.

Rules:

- the next service starts its own governed cycle
- current-service wave, screen, or runtime assumptions do not carry forward by default

## 9. Decision Rules

- no next service unlock without current-service seal proof
- no next service unlock while donor residue still leaks into the clean tree
- Phase `07` is the default re-entry unless the next service foundation already exists and passes review
- unresolved readiness ambiguity must be marked `BLOCKED`, `GAP`, or `UNPROVEN`

## 10. Hard Stop Gates

Stop the phase immediately if any of the following remain:

- the current service is not sealed explicitly
- legacy quarantine still leaves active residue on the canonical path
- next-service re-entry phase is implied rather than written
- the next service is being opened on the assumption that one sealed service lowers the standard for the next

## 11. Completion Proof

The phase passes only when all of the following are recorded explicitly:

- current service seal verdict exists
- legacy quarantine blocker count = `0` or explicitly bounded
- next-service slug count = `1`
- next-service re-entry decision count = `1`
- unresolved unlock contradictions = `0` or explicitly `BLOCKED`

## 12. Exact Handoff To Next Phase

Deliver:

- next-service unlock note
- updated service order when needed
- exact re-entry phase for the next service
- blocker list for any unresolved unlock condition

Next lawful starting point for the next service:

- `PHASE_07_FIRST_SERVICE_FOUNDATION.md` if the next service lacks a valid service-foundation layer
- `PHASE_08_ACTOR_CONTEXT_EXHAUSTIVE_EXTRACTION.md` if the next service foundation already exists and is still valid