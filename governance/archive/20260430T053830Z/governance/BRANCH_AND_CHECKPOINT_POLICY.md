# Branch and Checkpoint Policy

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. GitHub write rule

No GitHub write unless explicitly requested.

Forbidden without explicit request:

```text
commit
push
force push
branch creation
branch deletion
merge
rebase
open PR
close PR
tag
release
```

## 2. Pre-change snapshot

Before sensitive work:

```powershell
git branch --show-current
git --no-pager status --short
git --no-pager log --oneline -n 5
git ls-files --others --exclude-standard
```

## 3. Pre-commit minimum checks

```powershell
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

## 4. Commit readiness

A change is not commit-ready until:

```text
scope is clean
diff is reviewed
untracked files accounted for
staged files accounted for
verification passed
warnings documented
sensitive patch reviewed
UI evidence exists if UI changed
runtime evidence exists if runtime changed
```

## 5. Checkpoint readiness

A checkpoint must include:

```text
branch name
commit SHA
changed files
verification output
known warnings
evidence root
handoff zip if generated
decision
```

## 6. PR readiness

A branch is `READY_FOR_PR` only when:

```text
local verification is clean
CI-required checks are defined
evidence pack exists
patch review has no blocker
scope is not mixed with unrelated work
```
