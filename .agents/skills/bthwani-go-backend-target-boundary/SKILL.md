---
name: bthwani-go-backend-target-boundary
description: Keep backend decisions aligned to the BThwani Go target boundary.
version: 2026.05.12-v3
---

# Purpose

Separate current frontend or tooling reality from the repo's backend target direction.

# When to use

- any task that names backend stacks, API platforms, runtime direction, or target stack claims

# Inputs

- backend claim or proposal
- current repo evidence
- relevant governance files

# Steps

1. Read the governing stack and boundary files.
2. Separate current implementation reality from target backend direction.
3. Mark conflicts such as a canonical NestJS claim as `STACK_CONFLICT_REQUIRES_FIX`.
4. Stop at boundary guidance unless the user explicitly authorizes backend implementation.

# Forbidden actions

- treating current frontend tooling as backend target proof
- implementing backend work from boundary guidance alone
- describing NestJS as canonical without explicit newer governance evidence

# Required evidence

- governance stack file
- current repo evidence for the claim being evaluated

# Output contract

```text
backend_claim:
evidence:
target_stack:
conflicts:
decision: PASS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE
```

# Governance references

- `governance/03_REPO_BOUNDARIES.md`
- `governance/TECH_STACK_LOCK.md`
- `.agents/AUTHORITY_BOUNDARY.md`

# Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

