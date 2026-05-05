# Cleanup and Deprecation

**Status:** Canonical Governance Payload v2
**Owner:** `Cleanup Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** CLEANUP_AND_DEPRECATION_POLICY, DOCS_GOVERNANCE_DELETION_* plans, GOVERNANCE_CLEANUP_CANDIDATES, GOVERNANCE_CANDIDATE_RESOLUTION_MATRIX

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Cleanup law

Cleanup is not deletion. Cleanup means preserve required truth, remove duplication, update references, prove consumers are safe, and keep rollback available.

## Cleanup decision types

| Decision | Meaning |
|---|---|
| `PROMOTE` | move rule into canonical owner |
| `MERGE` | combine duplicate into owner file |
| `ARCHIVE` | keep read-only historical source |
| `DELETE` | remove after references and evidence prove safe |
| `REJECT` | do not carry forward |
| `TBD` | not enough evidence |

## Deletion readiness

Before deleting or moving anything:

```text
inventory
reference scan
consumer scan
owner approval
impact note
rollback path
evidence pack
```

Deletion is allowed only when all are true:

- every source file has extraction evidence,
- rich content was promoted, merged, archived, or explicitly rejected,
- canonical replacement exists where needed,
- no active code, script, CI path, or guard depends on the retiring root,
- no unresolved owner question remains,
- working tree unrelated changes are either excluded from the decision or restored,
- active guards pass with zero failures.

## Legacy governance handling

Legacy governance must not stay active next to canonical governance. Allowed outcomes:

1. fully accounted in `99_LEGACY_MERGE_LEDGER.md`,
2. archived under a clearly non-active archive path,
3. deleted after evidence proves no required information remains only there.

For legacy governance retirement, deletion proof must include:

- source file inventory,
- target/replacement matrix,
- reference scan,
- owner decision,
- rollback note,
- evidence root,
- final decision.

Deletion of a legacy governance root must be a dedicated cleanup decision, not an accidental side effect of unrelated UI, service, or CI work.

## Deprecation requirements

For deprecated APIs/components/docs:

- replacement path,
- migration date,
- compatibility alias if public,
- consumer list,
- removal gate,
- evidence.

## Forbidden cleanup

- blind global replace,
- deleting untracked files without inventory,
- moving package roots without consumer scan,
- removing aliases in same step as public rename,
- deleting legacy before ledger coverage.

## Candidate resolution law

Cleanup candidates must be classified before action:

| Candidate class | Meaning | Allowed action |
|---|---|---|
| `DUPLICATE` | same rule appears in more than one place | merge into canonical owner in narrow batch |
| `CONTRADICTION` | rules conflict or drift | escalate to owner and resolve explicitly |
| `TRANSITIONAL_REFERENCE_ONLY` | historical or donor evidence only | archive or retain read-only until deletion gate passes |
| `REMOVAL_CANDIDATE` | no longer needed after proof | delete only after readiness checklist passes |
| `TBD` | evidence incomplete | block deletion/merge |

Classification alone does not authorize broad deletion. Resolution must remain file-by-file with evidence.
