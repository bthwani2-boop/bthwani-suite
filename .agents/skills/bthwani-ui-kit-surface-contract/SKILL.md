---
name: bthwani-ui-kit-surface-contract
description: Enforce BThwani UI kit ownership, RTL correctness, and brand consistency for UI work.
version: 2026.05.12-v3
---

# Purpose

Keep UI work anchored to `@bthwani/ui-kit` and the repo's RTL and brand rules.

# When to use

- any UI, UX, screen, surface, dashboard, mobile, web, or `ui-kit` task

# Inputs

- owner path
- visible states
- `@bthwani/ui-kit` usage
- screenshots or build output when visible UI changes exist

# Steps

1. Confirm the owner path and current UI mode.
2. Verify Screen / Surface / App uses `@bthwani/ui-kit` public exports.
3. Check RTL row clustering, text alignment, spacing, and state coverage.
4. Reject raw Tamagui imports outside `ui-kit`.
5. Record visual evidence when visible UI changes are in scope.

# Forbidden actions

- raw Tamagui imports outside `ui-kit`
- local design systems that compete with `ui-kit`
- careless RTL layouts that split icon and text clusters

# Required evidence

- owner path
- ui-kit dependency proof
- diff and verification output
- visual evidence when UI changed visibly

# Output contract

```text
owner_path:
ui_kit_dependencies:
rtl_contract:
states_covered:
visual_evidence_required: yes/no
verification:
decision:
```

# Governance references

- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`

# Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

