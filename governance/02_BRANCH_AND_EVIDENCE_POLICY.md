---
generatedFrom: governance/02_BRANCH_AND_EVIDENCE_POLICY.md
generatedAt: 2026-04-30T04:48:37.1375158+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Branch and Evidence Policy

Status: CANONICAL_POLICY
Owner: BThwani Governance
Scope: branch reality, checkpoint evidence, evidence-root usage, dirty-tree accounting, and destructive-change proof

## Purpose

This policy prevents branch fiction, evidence-free closure, source-of-truth drift, and destructive changes without traceable proof.

## Canonical Facts

- active local repository: `C:\bthwani-suite`
- active governance root: `governance/`
- canonical evidence root: `tools/registry/runs/{SESSION_ID}/`
- evidence pack schema authority: `18_EVIDENCE_PACK_STANDARD.md`
- closure decision authority: `GOVERNANCE_CLOSURE_STANDARD.md`
- change-entry accounting for governance work is required before and after any scoped write

## Branch Reality

Before any check, apply, review, or verify phase, capture:

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

## Evidence Root Rule

All diagnostics, APPLY phases, verification phases, review phases, and runtime-proof phases must write evidence under:

```text
tools/registry/runs/{SESSION_ID}/
```

Optional phase subpaths are allowed when a run benefits from them, for example:

```text
tools/registry/runs/{SESSION_ID}/phase-03/
```

Do not write new evidence into `docs/governance`, `governance/archive/legacy-extracted/`, or ad hoc roots outside the canonical run root.

## Required Evidence Pack Shape

Every meaningful governance or code run must include, at minimum:

```text
SUMMARY.md
status.txt
evidence.json
commands.log
git-branch-current.txt
git-status-before.txt
git-status-after.txt
git-diff-check-before.txt
git-diff-check-after.txt
untracked-before.txt
untracked-after.txt
_HANDOFF.zip
{SESSION_ID}_HANDOFF.zip
```

When the change can affect TypeScript, guards, scripts, or configuration, also include:

```text
tsc-noemit-before.txt
tsc-noemit-after.txt
```

## Evidence Metadata Rule

`evidence.json` must capture scope, allowed files, forbidden roots, final decision, diff-check result, typecheck result when applicable, warning summary, and emitted output files.

## Dirty Tree Accounting

A dirty tree is not automatically fatal. It must be classified as one of:

- expected current governance changes
- expected current scoped changes
- evidence output
- untracked transitional files
- unexpected changes
- forbidden-scope changes

Unexpected or forbidden-scope changes block closure.

## Change Entry Rule

Every scoped write or destructive governance action must record:

- allowed files
- changed files before and after
- untracked files before and after
- whether the change is create, rewrite, merge, move, archive, alias, or delete
- the canonical governance owner file
- the evidence root and final decision

If a change cannot be classified precisely, it is blocked until re-scoped.

## Destructive Change Gate

No file may be deleted, moved, renamed, archived, or downgraded to alias until all of the following are true:

- zero-reference or controlled-reference proof exists
- owner/consumer impact is documented
- rollback path is known
- the decision is recorded in `GOVERNANCE_REORGANIZATION_LEDGER.md`

## Final Decision Gate

The only canonical final closure decisions are:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
```

Operational markers such as `READY_FOR_NEXT_PHASE` may still appear inside plans or evidence packs, but they are workflow markers only. They are not final closure decisions.

## No Closure Without Evidence

Never claim:

```text
CLOSED
READY
100%
FINAL
```

unless the relevant evidence pack proves it.

## Provenance

This file now absorbs the active branch/evidence/change-entry rules previously split across `BRANCH_AND_CHECKPOINT_POLICY.md`, `EVIDENCE_AND_CLOSURE_GATES.md`, `CHANGE_ENTRY_RULE.md`, and `18_EVIDENCE_PACK_STANDARD.md`.

This file is the branch and evidence authority.

