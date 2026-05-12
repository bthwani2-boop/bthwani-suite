---
name: bthwani-screen-flow-binding-contract
description: Lock screen, route, flow, and binding contracts before accepting BThwani flow work.
version: 2026.05.12-v3
---
# Purpose
Make visible flow work decision-complete before declaring it ready.
# When to use
- any task involving screens, routes, params, flow maps, bindings, integrations, or state transitions
# Inputs
- screen or route identifiers
- owner path
- entrypoints and exits
- binding inputs and outputs
# Steps
1. Record the required screen and flow fields.
2. Mark unknowns as `TBD` or `BLOCKED` instead of guessing.
3. Keep UI/UX-only tasks free of backend, API, or provider work unless explicitly requested.
4. Confirm required states and evidence coverage.
5. Refuse merge-ready claims when critical contract fields are missing.
# Forbidden actions
- guessing routes or params
- silently widening UI-only work into integration work
- claiming closure without state coverage
# Required evidence
- route and screen ownership proof
- diff and verification output
- visual evidence for visible flow changes
# Output contract
```text
screenId:
surface:
service:
ownerPath:
route:
params:
entrypoints:
exits:
bindingInputs:
bindingOutputs:
status: CONFIRMED / GAP / TBD / BLOCKED
```
# Governance references
- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`
# Acceptance rule
No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.
