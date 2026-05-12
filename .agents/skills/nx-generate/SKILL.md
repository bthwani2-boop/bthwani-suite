---
name: nx-generate
description: Review Nx scaffolding requests safely before any generator or structure mutation.
version: 2026.05.12-v1
---

# Purpose

Keep Nx generator work scoped, authorized, and aligned to the live workspace.

# When to use

- any scaffolding, app, lib, setup, or project-structure request

# Inputs

- generator intent
- target root
- current workspace evidence

# Steps

1. Confirm the user actually requested scaffolding.
2. Confirm the live target root from current repo evidence.
3. Check generator help or docs before using unfamiliar flags.
4. Decide whether the request is advisory-only or authorized for mutation.
5. If not authorized, stop at risk review and next safe step.

# Forbidden actions

- scaffolding into stale roots
- using guessed flags
- using `npx`
- mutating the repo when the request is planning or advisory only

# Required evidence

- target root proof
- generator help or docs when flags are uncertain
- diff and verification output when scaffolding is authorized later

# Output contract

```text
generator_intent:
target_root:
authorization_state:
risks:
next_safe_step:
decision:
```

# Governance references

- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`

# Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

