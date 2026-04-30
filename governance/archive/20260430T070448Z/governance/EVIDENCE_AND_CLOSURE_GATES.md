---
generatedFrom: governance/EVIDENCE_AND_CLOSURE_GATES.md
generatedAt: 2026-04-30T04:48:37.4100403+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Evidence and Closure Gates

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Evidence-first law

No result is accepted without inspectable evidence.

Forbidden without evidence:

```text
PASS
READY
CLOSED
FINAL
100%
SAFE
DONE
```

## 2. Canonical evidence root

```text
tools/registry/runs/<SESSION_ID>/
```

## 3. Minimum evidence after any code change

```powershell
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

## 4. Sensitive change evidence

Sensitive changes require patch review.

Sensitive areas include:

```text
governance
tools/guards
ui-kit
imports/exports
architecture boundaries
API contracts
flows
CI/workflows
package/config files
multi-file edits
delete/move/rename
```

Required review files:

```text
LOCAL_CHANGE_STATUS.txt
LOCAL_CHANGE_DIFF_STAT.txt
LOCAL_CHANGE_NAME_STATUS.txt
LOCAL_CHANGE_DIFF_CHECK.txt
LOCAL_CHANGE_REVIEW.patch
LOCAL_CHANGE_UNTRACKED_FILES.txt
```

If staged changes exist:

```text
LOCAL_CHANGE_STAGED_REVIEW.patch
```

## 5. UI evidence

UI changes require screenshot evidence.

If code evidence exists but screenshots are missing:

```text
NEEDS_VISUAL_EVIDENCE
```

## 6. Decisions

Allowed decisions:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
NO_ACTION_REQUIRED
```

## 7. PASS criteria

Use `PASS` only when:

```text
scope respected
diff reviewed
untracked accounted for
staged accounted for
verification passed
guards passed or warnings accepted
UI evidence exists when needed
runtime proof exists when needed
no unresolved critical risk
```

## 8. READY_FOR_PR criteria

Use `READY_FOR_PR` only when:

```text
local evidence passed
branch is understood
patch review accepted
warnings documented
no hidden files
user is ready to commit/push
```

## 9. Warning policy

Warnings may produce `PASS_WITH_WARNINGS` only when:

```text
warning is understood
warning is documented
warning does not block current scope
follow-up is recorded
```

