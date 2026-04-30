---
generatedFrom: governance/GOVERNANCE_AUDIT_FALSE_POSITIVE_CLASSIFICATION.md
generatedAt: 2026-04-30T04:48:37.4312829+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Governance Audit False Positive Classification

Status: CANONICAL_AUDIT_CLASSIFICATION
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_FULL_REPO_AUDIT_READONLY-20260429-234730
BatchEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_07_CLOSE_ACTIVE_REFS_AND_CLASSIFY_AUDIT-20260429-235302

## Decision

The latest read-only full repo audit is useful for discovery, but its 15 reported ERROR rows are not all true blockers. They must be classified before any promotion, deletion, or closure decision.

## Classified error families

| Audit code | Count | Classification | Reason | Action |
|---|---:|---|---|---|
| DIRECT_TAMAGUI_IMPORT_OUTSIDE_UIKIT | 10 | FALSE_POSITIVE_OR_ALLOWED_CONTEXT | Rows include governance examples, guard pattern strings, analysis scripts, and tamagui.build.ts build-time configuration. These are not screen/surface/app runtime imports. | Calibrate future scanner allowlists before promoting. |
| SECRET_LIKE_VALUE | 5 | FALSE_POSITIVE | Rows include placeholder apiKey documentation and property names such as borderToken/toneConfig, not real secrets. | Replace naive secret regex with stronger key/value and entropy rules. |

## True current blocker class

| Blocker | Status | Required action |
|---|---|---|
| Active legacy governance docs code/script references | BEING_CLOSED_IN_BATCH_07 | Remove or repoint active script references, then prove zero active code/script blockers. |

## Non-blocking warning families from read-only audit

| Warning family | Count | Classification |
|---|---:|---|
| NON_BRAND_HEX_COLOR | 1547 | NEEDS_OWNER_DECISION_AND_CONTEXTUAL_ALLOWLIST |
| OPEN_MARKER | 408 | NEEDS_TRIAGE_BY_OWNER_AND_SCOPE |
| OLD_STANDALONE_BTH_TOKEN | 110 | NEEDS_TOKEN_BOUNDARY_REVIEW |
| DOCS_GOVERNANCE_REFERENCE | 85 | MIXED: legacy archive/policy references accepted; active code/script references must be zero before deletion-readiness |

## Rule

Do not convert these read-only audit ERROR rows into CI blockers until the scanner is calibrated, false positives are documented, and the owner accepts the promotion criteria.

