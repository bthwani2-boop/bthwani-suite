---
name: bthwani-current-workspace-authority
description: Resolve active roots, stale paths, and donor-vs-current path authority in BThwani.
version: 2026.05.12-v3
---
# Purpose
Confirm the live workspace roots and block stale or donor-only paths before any mutation.
# When to use
- any task that names repo paths, apps, packages, services, surfaces, governance, or donor sources
- any task that could confuse current roots with older nested layouts
# Inputs
- current branch
- `pnpm-workspace.yaml`
- target paths mentioned by the task
- repo evidence for path ownership
# Steps
1. Read `pnpm-workspace.yaml` first.
2. Confirm the active flat roots from current repo evidence.
3. Classify every mentioned path as active, stale, donor-only, or unknown.
4. Block any mutation against stale or donor-only paths unless the current branch proves them active.
5. Return the allowed mutation scope before deeper implementation.
# Forbidden actions
- guessing active roots
- using donor checkout paths as live targets
- mutating legacy nested app or package roots without proof
# Required evidence
- `pnpm-workspace.yaml`
- branch name
- relevant path scans or file reads
# Output contract
```text
workspace_truth:
active_roots:
stale_paths_seen:
allowed_mutation_scope:
blocked_paths:
decision: PASS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE
```
# Governance references
- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`
# Acceptance rule
No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.
