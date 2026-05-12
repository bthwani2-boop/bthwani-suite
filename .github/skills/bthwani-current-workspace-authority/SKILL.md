---
name: bthwani-current-workspace-authority
description: Use for any BThwani path, workspace, ownership, or donor-vs-current decision. Enforces the current flat bthwani-suite workspace and blocks stale apps/packages paths unless repo evidence proves them active.
version: 2026.05.12-v2
---

# BThwani Current Workspace Authority

## Activation
Use this skill before any agent edits, audits, prompts, scripts, or refactors that mention paths, apps, packages, surfaces, services, governance, evidence, or repo ownership.

## Current local root

```text
C:\bthwani-suite
```

## Current workspace roots
Read `pnpm-workspace.yaml` first. The current expected roots are:

```text
webapp/runtime
website/runtime
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
ui-kit
dsh
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

If local files contradict this list, report the contradiction as `TBD_REQUIRES_REPO_EVIDENCE`; do not guess.

## Stale or donor-only paths
Do not use these as active implementation targets unless the current branch proves them active in `pnpm-workspace.yaml` and the directory exists:

```text
legacy nested mobile/web app roots
legacy packages-based ui-kit/surfaces/app-shells/api package roots
the donor absolute checkout path used before the current flat workspace
```

## Decision law
- Current repo evidence wins over memory and copied skills.
- Donor snapshots are read-only references until conflict-reviewed.
- No implementation may start from a stale path.
- If a skill, agent, or doc names a stale path, classify it as `LEGACY_PATH_RISK` before editing.

## Required output when used
Return:

```text
workspace_truth:
active_roots:
stale_paths_seen:
allowed_mutation_scope:
blocked_paths:
decision: PASS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE
```
