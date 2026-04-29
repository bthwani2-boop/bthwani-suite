# Branch and Evidence Policy

## Purpose

This policy prevents false closure, branch confusion, and evidence-free claims.

## Branch Reality

Before any diagnostic or apply phase, capture:

```powershell
git branch --show-current
git --no-pager status --short
git --no-pager log --oneline -n 20
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
```

A branch is not truth unless the evidence pack proves it.

## Current Checkpoint Rule

The currently known checkpoint branch candidate is:

```text
ghb/0102-20260429-015636-packages
```

Treat it as the latest known checkpoint only when local and/or GitHub evidence confirms it.

## Evidence Root

All diagnostics, APPLY phases, and verification phases must write evidence under:

```text
tools/registry/runs/{SESSION_ID}
```

Do not write new evidence into `docs/governance`.

## Required Evidence Files

Each phase should include, at minimum:

```text
SUMMARY.md
status.txt
evidence.json
commands.log
git-status-before.txt
git-status-after.txt
git-diff-check-before.txt
git-diff-check-after.txt
tsc-noemit-before.txt
tsc-noemit-after.txt
```

Additional files depend on the phase.

## Status Decisions

Allowed status decisions:

```text
PASS
PASS_WITH_WARNINGS
READY_FOR_NEXT_PHASE
READY_FOR_GOVERNANCE_APPLY_PHASE_01_PLAN
READY_FOR_DSH_FORENSICS
BLOCKED_BY_DIFF_CHECK
BLOCKED_BY_TSC
BLOCKED_BY_UNEXPECTED_DIRTY_TREE
BLOCKED_BY_SCOPE_VIOLATION
BLOCKED_BY_MISSING_EVIDENCE
BLOCKED_BY_VERIFICATION
NEEDS_EVIDENCE
NEEDS_REVIEW
FIX_REQUIRED
```

## No Closure Without Evidence

Never claim:

```text
CLOSED
READY
100%
FINAL
```

unless the relevant evidence pack proves it.

## Dirty Tree Accounting

A dirty tree is not automatically fatal. It must be classified:

- expected current governance changes
- untracked transitional files
- evidence output
- unexpected changes
- forbidden-scope changes

Unexpected or forbidden-scope changes block closure.

## No Deletion Without Proof

No file may be deleted, moved, or renamed until zero-reference proof exists and the owner/consumer impact is documented.
