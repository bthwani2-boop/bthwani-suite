---
name: bthwani-agent-restoration-forensics
description: Reconstruct deleted agent sources from read-only history without direct restore or legacy tree replay.
version: 2026.05.12-v1
---

# Purpose

Safely rebuild agent sources from deleted history while rejecting noise, mirrors, and stale structures.

# When to use

- any task that must recover deleted agent, skill, adapter, or instruction files from Git history or donor sources

# Inputs

- current ref
- donor ref or deleted-history commit
- target paths
- read-only governance files

# Steps

1. Capture current branch, status, and untracked state before edits.
2. Locate the best read-only recovery source in Git history.
3. Build a snapshot outside the working tree target files.
4. Classify each candidate as restore, merge, reject, or unresolved.
5. Rebuild only the compact active source needed for the current scope.
6. Record accepted, rejected, and unresolved decisions in the evidence pack.

# Forbidden actions

- `git restore` or `git checkout` of broad deleted trees
- replaying deleted `.github/skills`, `.github/agents`, or bulky `.agents` references wholesale
- guessing missing tool entry paths

# Required evidence

- branch and status baseline
- source commit or donor proof
- snapshot inventory
- accepted and rejected maps

# Output contract

```text
current_ref:
observed_donor_ref:
effective_extraction_source:
accepted_targets:
rejected_targets:
unresolved_items:
decision: DONE / BLOCKED
```

# Governance references

- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`

# Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

