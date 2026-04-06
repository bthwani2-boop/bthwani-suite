# PHASE_26_LEGACY_QUARANTINE

## 1. Purpose

Retire donor leftovers safely and keep the live clean tree free of accidental residue.

## 2. Why This Phase Exists

This phase prevents old material from continuing to influence the clean repo through forgotten imports, copied roots, or ambiguous leftovers.

## 3. Preconditions / Entry Conditions

- the current service is sealed or blocked with explicit status
- candidate legacy leftovers are identifiable

## 4. Inputs

- service seal pack
- donor consultation notes
- repo tree inspection

## 5. Allowed Work

- classify old material
- move it out of the live clean tree
- scan for live references
- verify post-move cleanliness

## 6. Forbidden Work

- blind deletion
- leaving donor leftovers in live product roots
- moving material without reference scanning

## 7. Exact Execution Order

1. open the `legacy-quarantine` request
2. identify legacy leftovers and classify them
3. move the items to a lawful quarantine or detached archival location outside the live clean tree
4. scan the repo for live references
5. verify that no active import or path still depends on the moved material
6. write post-move verification and target-fit summary

## 8. Required Decisions

- what should be quarantined
- what should remain as lawful evidence only
- what is safe to keep versus what must be detached

## 9. Required Artifacts

- `kdt/factory/<service>/requests/YYYY-MM-DD_legacy-quarantine.md`
- `kdt/factory/<service>/packs/legacy-quarantine/00_REQUEST_SUMMARY.md`
- `kdt/factory/<service>/packs/legacy-quarantine/01_SOURCE_TRACE.md`
- `kdt/factory/<service>/packs/legacy-quarantine/02_LEGACY_QUARANTINE_MAP.md`
- `kdt/factory/<service>/packs/legacy-quarantine/03_LIVE_REFERENCE_SCAN.md`
- `kdt/factory/<service>/packs/legacy-quarantine/04_POST_MOVE_VERIFICATION.md`
- `kdt/factory/<service>/packs/legacy-quarantine/05_TARGET_FIT_SUMMARY.md`
- `kdt/factory/<service>/packs/legacy-quarantine/06_EVIDENCE_INDEX.md`
- `kdt/factory/<service>/index/LEGACY_QUARANTINE_INDEX.md`

## 10. Artifact Schema Expectations

`02_LEGACY_QUARANTINE_MAP.md` must include:

- affected paths
- classification reason
- destination or quarantine outcome

`03_LIVE_REFERENCE_SCAN.md` must include:

- scan method
- hits found
- disposition of each hit

`04_POST_MOVE_VERIFICATION.md` must include:

- verification steps
- remaining blockers if any
- statement on accidental live imports

## 11. Cross-File Updates

- update any evidence or donor-reference notes so they point to the detached location rather than the former live-tree location

## 12. Surface Impact

- no new surface work begins here

## 13. UI Kit Impact

- no direct UI Kit impact except removal of stray donor leftovers if they existed there unlawfully

## 14. Contract Impact

- no direct contract impact

## 15. Runtime Impact

- runtime leftovers must also be quarantined if they are donor residue rather than lawful active truth

## 16. Validation Checklist

- old material is no longer in the live clean tree
- live reference scan is complete
- post-move verification is explicit

## 17. Exit Criteria

- legacy leftovers are detached safely enough that the next service can open without accidental inheritance

## 18. Failure Modes / Common Mistakes

- deleting instead of moving
- forgetting to scan for references
- keeping convenience donor roots in the live tree

## 19. Anti-Patterns

- "we are done, so the leftovers do not matter"
- "it is fine if the old file stays as long as no one touches it"

## 20. Handoff To Next Phase

Deliver:

- quarantine map
- live reference scan result
- post-move verification

Next lawful file: `PHASE_27_NEXT_SERVICE_REPEAT.md`