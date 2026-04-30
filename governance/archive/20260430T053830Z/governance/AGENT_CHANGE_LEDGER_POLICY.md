# Agent Change Ledger Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: AI-assisted changes, commits, evidence, and decision history

## 1. Purpose

The agent change ledger ensures every AI-assisted change can be traced from request to evidence to commit to decision.

## 2. Ledger requirement

Every AI-assisted commit should be traceable to:

- request or task summary
- evidence root
- changed files
- verification commands
- warnings/errors
- final decision
- commit SHA
- next step

## 3. Minimum ledger fields

| Field | Required |
|---|---|
| session_id | yes |
| branch | yes |
| mode | yes |
| task_summary | yes |
| changed_files | yes |
| evidence_root | yes |
| handoff_zip | yes |
| verification | yes |
| decision | yes |
| commit_sha | when committed |
| push_status | when pushed |
| warnings | yes |
| next_step | yes |

## 4. Accepted evidence

Accepted ledger evidence includes:

- `SUMMARY.md`
- `status.txt`
- `evidence.json`
- guard outputs
- typecheck output
- diff-check output
- runtime logs
- screenshots
- uploaded handoff zip
- GitHub commit URL

## 5. Commit message rule

Commit messages should be concise and scoped:

```text
governance: add closure standards
governance: extract legacy governance docs
governance: fix extracted governance metadata
```

Commit messages must not claim full closure unless evidence proves closure.

## 6. Untracked and staged accounting

No commit is valid unless untracked and staged files are explicitly accounted for.

Rules:

- `git status --short` before commit
- `git diff --check`
- `git diff --cached --check`
- staged file list must match allowed paths
- unexpected files block the commit or are left untouched with evidence

## 7. Ledger safety

The ledger must not store:

- secrets
- tokens
- private credentials
- real env values
- sensitive user data
- unnecessary build artifacts

## 8. Decision lifecycle

A ledger entry can be:

- OPEN
- PASS
- PASS_WITH_WARNINGS
- FIX_REQUIRED
- BLOCKED
- SUPERSEDED
- REVERT_REQUIRED

Superseded entries must point to the superseding evidence or commit.
