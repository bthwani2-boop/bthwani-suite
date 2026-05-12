---
name: bthwani-local-evidence-pack
description: Build BThwani local registry evidence packs and root review artifacts with the correct zip naming rule.
version: 2026.05.12-v3
---
# Purpose
Create the required local evidence pack for scoped execution and review.
# When to use
- any task that writes files and must leave auditable evidence under `tools/registry/runs/{SESSION_ID}/`
# Inputs
- session id
- scope statement
- command outputs
- verification outputs
# Steps
1. Create `tools/registry/runs/{SESSION_ID}/`.
2. Write `scope-lock.md`, `commands.log`, and baseline Git files.
3. Save verification outputs such as diff, diff-check, and typecheck.
4. Write `SUMMARY.md` and `evidence.json`.
5. Create `{SESSION_ID}.zip` inside the same evidence folder.
6. Export root `LOCAL_CHANGE_*` review files.
# Forbidden actions
- using legacy handoff zip names
- treating missing evidence as acceptable
- skipping untracked file accounting
# Required evidence
- session folder contents
- `{SESSION_ID}.zip`
- root `LOCAL_CHANGE_*` artifacts
# Output contract
```text
evidence_root:
required_files:
zip_path:
local_review_files:
decision: DONE / BLOCKED
```
# Governance references
- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`
# Acceptance rule
No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.
