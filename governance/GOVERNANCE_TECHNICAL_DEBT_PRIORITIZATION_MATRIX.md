# Governance Technical Debt Prioritization Matrix

Status: CANONICAL_PRIORITIZATION_MATRIX
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_06_REMEDIATE_DOCS_REFS_V3-20260429-234031

| Area | Count | Risk | Priority | Next batch |
|---|---:|---|---:|---|
| legacy governance docs active code/script blockers | 0 | deletion-readiness package required before deletion | 1 | Run dedicated deletion-readiness DryRun package |
| guard warnings baseline | 11775 | quality debt | 2 | Warning family classification |
| docs source self references | 15 | expected until deletion | 3 | Dedicated deletion commit |

## Rule

Prioritize blockers and high-confidence families first. Avoid broad cleanup without proof.
