# BTHWANI OPERATOR FIELD MANUAL — V7

This file explains the package to a weak or strong agent in operational language.

## 1. What the agent is doing

The agent is not writing a new prompt.
The agent is not doing a broad redesign.
The agent is not running a one-shot “fix everything” attempt.

The agent receives one target and runs one controlled closure cycle.

```text
TARGET → discover → classify → matrix → one safe task → verify → re-diagnose → stop
```

## 2. The first mental model

Treat BThwani as one system, not isolated apps.

A target can be:

```text
screen
surface
section
tab
workspace
folder
journey
DSH preview data owner
DSH media owner
governance file
guard
agent file
shared module
cross-surface flow
```

The target name is a search seed only. It is not a file path unless repo evidence proves it.

## 3. The correct order

Use this order every time:

1. Verify package integrity.
2. Verify current branch and local status.
3. Read only relevant agents/skills/governance.
4. Discover the target from repo evidence.
5. Classify target type and linked surfaces.
6. Decide topic boundaries if files may move.
7. Run structural hygiene gate.
8. Build required matrices.
9. Select one safe task.
10. Apply one task or output `AUDIT_ONLY_ALLOWED_WITH_REASON`.
11. Verify.
12. Re-diagnose.
13. Stop for human approval.

## 4. What must never happen

```text
No execute-all-at-once.
No design polish first.
No early screenshots.
No code stacking.
No fake shared.
No local DSH demo data/media.
No full duplicated objects.
No moving files without Topic Decision Matrix.
No new role files without File Boundary Matrix reason.
No package recheck without evidence.
No final ready claim without verification.
```

## 5. What to do when confused

Do not guess.

Use:

```text
UNPROVEN
TBD
BLOCKED_WITH_REASON
AUDIT_ONLY_ALLOWED_WITH_REASON
```

Then state the next safe action.

## 6. Small targets vs large targets

The package always requires the 28 sections, but output can be compact:

- Small target: one-line `NOT_APPLICABLE_WITH_REASON` sections are allowed.
- Medium target: concise tables.
- Large target: full matrices.

Never remove a section. Compact does not mean skipped.

## 7. What “complete” means

Complete means:

```text
the cycle produced evidence
the selected task was closed or blocked
the matrices were updated
the next step is explicit
human approval is required before continuing
```

It does not mean the entire product is closed after one cycle.

## 8. Mandatory Arabic project rules

```text
توجب الالتزام بنظام الألوان المركزي
تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر
```


## V6 Navigation

Before opening any playbook, read:

```text
BTHWANI_AGENT_NAVIGATION_MAP.md
```

Do not open all package files at once.
