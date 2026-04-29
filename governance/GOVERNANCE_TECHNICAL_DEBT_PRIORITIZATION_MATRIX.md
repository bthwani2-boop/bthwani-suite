# Governance Technical Debt Prioritization Matrix

Status: CANONICAL_PRIORITIZATION_MATRIX
Owner: BThwani Governance
SourceEvidence: `C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_05_FIX_BATCH04_AND_EXPAND-20260429-231805`

| Area | Count | Risk | Priority | Next batch |
|---|---:|---|---:|---|
| docs/governance active blockers | 24 | blocks deletion | 1 | Reference remediation |
| RTL/i18n warnings | 5285 | UI correctness | 2 | UI/RTL classification |
| design token drift warnings | 1588 | brand drift | 3 | Design token classification |
| evidence hygiene warnings | 1854 | evidence noise | 4 | Evidence hygiene cleanup |
| legacy short-token candidates | 466 | naming drift | 5 | Token cleanup classification |
| dead/orphan queue | 81 | cleanup risk | 6 | Dead code proof queue |

## Rule

Prioritize blockers and high-confidence families first. Avoid broad cleanup without proof.
