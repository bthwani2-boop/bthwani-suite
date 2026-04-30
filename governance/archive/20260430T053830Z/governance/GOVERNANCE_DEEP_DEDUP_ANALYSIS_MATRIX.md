# Governance Deep Deduplication and Contradiction Analysis

Status: CANONICAL_ANALYSIS
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_10_RESCUE_DEDUP_CONTRADICTION_STANDARDIZE-20260430-002239
HeadBefore: d4049d229324d737fd0352f43077a775b21ddf8c

## Scope

This Batch 10 rescue analyzes and standardizes governance/capability files only. It does not delete, move, or merge files.

## Counts

| Metric | Count |
|---|---:|
| Files scanned | 428 |
| Guards scanned | 25 |
| Scripts scanned | 55 |
| Agent/skill/rule files scanned | 209 |
| Workflow files scanned | 4 |
| Duplicate candidates | 50 |
| Contradiction/review candidates | 142 |
| Open markers | 128 |
| Legacy evidence-root references | 14 |
| Active docs/governance references | 0 |

## Decision

KEEP_CURRENT_STRUCTURE_AND_PREPARE_DEDICATED_CONSOLIDATION_BATCHES

Batch 10 creates the evidence basis. Actual deletion, merging, file moving, or guard severity changes require dedicated follow-up batches with rollback and evidence.
