---
name: nx-run-tasks
description: Run builds, tests, and verification through Nx with the current workspace conventions.
version: 2026.05.12-v1
---

# Purpose

Execute repo checks through `pnpm nx` instead of bypassing workspace task ownership.

# When to use

- any build, lint, test, typecheck, or affected-task execution request

# Inputs

- project name
- target name
- allowed verification scope

# Steps

1. Confirm the target project and task from current repo evidence.
2. Use `pnpm nx` rather than underlying direct tooling when an Nx target exists.
3. Check `--help` or docs before using uncertain flags.
4. Capture the command output into evidence.
5. If a failure is pre-existing or out of scope, record it without widening the task.

# Forbidden actions

- bypassing Nx when an Nx target exists
- guessing task flags
- using `npx`

# Required evidence

- executed `pnpm nx` command
- task output
- diff and type or build results when files changed

# Output contract

```text
project:
target:
command:
result:
scope_impact:
decision:
```

# Governance references

- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`

# Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

