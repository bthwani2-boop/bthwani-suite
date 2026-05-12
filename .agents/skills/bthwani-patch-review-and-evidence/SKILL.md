---
name: bthwani-patch-review-and-evidence
description: Review diffs, patches, and evidence packs before accepting BThwani changes.
version: 2026.05.12-v1
---
# Purpose
Audit the actual patch and its evidence instead of trusting narrative claims.
# When to use
- any review, closure, handoff, or evidence-pack validation task
# Inputs
- git diff or patch file
- `LOCAL_CHANGE_*` files when present
- evidence pack contents
- scope statement
# Steps
1. Inspect current Git status, diff, and diff-check output.
2. Inspect the patch or review files and compare them to the stated scope.
3. Inspect evidence completeness before accepting claims.
4. Report findings ordered by correctness and scope risk.
5. Return one narrow next step instead of broad rework instructions.
# Forbidden actions
- editing the patch under review
- accepting missing evidence as complete
- approving out-of-scope changes as harmless noise
# Required evidence
- `git --no-pager status --short`
- `git --no-pager diff --check`
- patch or diff files
- evidence pack or missing-evidence note
# Output contract
```text
decision:
scope_reviewed:
evidence_used:
findings:
risks:
allowed_next_action:
```
# Governance references
- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`
# Acceptance rule
No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.
