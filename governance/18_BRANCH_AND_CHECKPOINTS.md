# Branch and Checkpoints

## Purpose

This file controls branch state, checkpoint readiness, divergence handling, and PR readiness.

## Canonical branch facts

- `main` is protected.
- Work branches may use `governance/*`, `feature/*`, `fix/*`, `chore/*`, `release/*`, or checkpoint naming.
- No branch truth without `git fetch` and local/remote comparison.

## Branch reality capture

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git fetch origin
git branch --show-current
git rev-parse --short HEAD
git rev-parse --short origin/<branch>
git --no-pager status --short
git --no-pager log --oneline origin/<branch>..HEAD
git --no-pager log --oneline HEAD..origin/<branch>
git --no-pager diff --check
git ls-files --others --exclude-standard
```

## Divergence protocol

If local and remote diverge:

1. stop
2. inspect local-only commits
3. inspect remote-only commits
4. run `--cherry-pick` comparison
5. create backup branch before rebase
6. prefer linear rebase when remote commit is ancestor/equivalent
7. avoid force push unless explicitly approved with reason

## Backup branch before rebase

```powershell
$BackupBranch = "backup/<branch>-before-rebase-$(Get-Date -Format yyyyMMdd-HHmmss)"
git branch $BackupBranch
```

## Checkpoint required when changing

- governance root
- package public exports
- API contracts
- service/surface ownership
- security posture
- CI/guards
- branch policy
- deletion/move/rename

## READY_FOR_PR requirements

- local/remote understood
- working tree clean or patch intentionally reviewed
- diff check clean
- tsc/test/guard evidence as relevant
- untracked/staged files accounted for
- evidence pack exists
- no unresolved blocker
