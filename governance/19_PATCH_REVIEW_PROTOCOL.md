# Patch Review Protocol

## Purpose

This protocol controls sensitive AI-assisted changes and prevents hidden file drift.

## Default Method

For sensitive local code or governance changes, prefer patch handoff:

```powershell
git --no-pager diff > LOCAL_CHANGE_REVIEW.patch
git --no-pager status --short > LOCAL_CHANGE_STATUS.txt
git ls-files --others --exclude-standard > LOCAL_UNTRACKED_FILES.txt
```

## Important Rule for Untracked Files

Plain `git diff` does not include untracked files. Every patch handoff must include a separate untracked-file list.

## Review Requirements

Before accepting any change:

- inspect changed paths
- inspect untracked paths
- verify no forbidden scope was touched
- run `git diff --check`
- run `pnpm -w exec tsc --noEmit`
- preserve rollback path
- do not commit until review passes

## Forbidden Without Explicit Approval

- deleting files
- moving files
- renaming files
- broad legacy replacement
- broad import rewrites
- workflow permission changes
- DSH implementation during governance repair
- source boundary repairs during SSoT-only phases

## Rollback

Before APPLY, back up target files to the evidence pack when practical.

Rollback options:

```powershell
git restore -- <tracked-file>
Remove-Item <untracked-file>
```

Use removal only when the file is confirmed to be an unintended untracked output.

## Final Review Status

Allowed review decisions:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
READY_FOR_NEXT_PHASE
```

Do not use `CLOSED` unless the evidence pack proves complete closure.
