---
name: nx-workspace
description: Inspect the live Nx workspace safely before path, project, or dependency decisions.
version: 2026.05.12-v1
---

# Purpose

Ground Nx exploration in the current workspace truth instead of older layouts or guessed project names.

# When to use

- before navigating projects, targets, dependencies, or workspace-owned paths

# Inputs

- `pnpm-workspace.yaml`
- `nx.json`
- current task scope

# Steps

1. Read `pnpm-workspace.yaml` first.
2. Inspect `nx.json` and current repo roots when project context matters.
3. Prefer `pnpm nx` commands when task execution is required.
4. Mark stale paths and unresolved project names instead of guessing.
5. Return the active project or root guidance needed for the next step.

# Forbidden actions

- using global `nx`
- using `npx`
- guessing flags or project names

# Required evidence

- workspace root files
- any `pnpm nx` query output that informed a decision

# Output contract

```text
active_roots:
projects_checked:
stale_paths_seen:
next_safe_nx_step:
decision:
```

# Governance references

- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`

# Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

