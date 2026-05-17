---
name: bthwani-dsh-ui-kit-golden-slice
description: Keep DSH UI closure narrow, evidence-driven, and aligned to ui-kit ownership.
version: 2026.05.12-v3
---
# Purpose
Provide a safe operational slice for DSH UI work across the current flat workspace.
# When to use
- any DSH task touching `app-client/runtime`, `app-partner/runtime`, `app-captain/runtime`, `app-field/runtime`, `control-panel/runtime`, `dsh`, or `ui-kit`
# Inputs
- DSH owner path
- task mode: UI-only or UI-plus-binding
- ui-kit usage proof
- visual evidence requirements
# Steps
1. Confirm the owner path from the current repo.
2. Confirm whether the task is UI-only or includes binding and integration.
3. Enforce `@bthwani/ui-kit` public export usage.
4. Verify RTL and BThwani brand rules.
5. Produce Git and visual evidence before closure.
# Forbidden actions
- spreading DSH patterns into local app-only design systems
- mixing UI closure with backend work unless explicitly requested
- claiming full closure without matrix or evidence
# Required evidence
- owner path proof
- diff and verification output
- visual evidence when UI changed visibly
# Output contract
```text
surface:
owner_path:
mode:
ui_kit_dependencies:
visual_evidence:
verification:
decision:
```
# Governance references
- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`
# Acceptance rule
No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.