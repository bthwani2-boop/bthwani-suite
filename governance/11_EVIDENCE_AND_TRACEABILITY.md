# Evidence and Traceability

**Status:** Canonical Governance Payload v2
**Owner:** `Evidence Governance`

## Core evidence law

Evidence is inspectable output. A summary from Copilot, ChatGPT, or a script is not evidence by itself.

## Canonical evidence root

```text
tools/registry/runs/{SESSION_ID}/
```

## Evidence pack standard

### Always required after code/doc changes

```text
SUMMARY.md
evidence.json
commands.log
git-status.txt
git-diff-stat.txt
git-diff-name-status.txt
git-diff-check.txt
untracked-files.txt
{SESSION_ID}.zip
```

### Required when TypeScript/runtime can be affected

```text
tsc-noemit.txt
lint.txt or lint-not-run-reason.txt
test.txt or test-not-run-reason.txt
build.txt or build-not-run-reason.txt
```

### Required when UI is affected

```text
screenshots/before
screenshots/after
visual-review.md
rtl-check.md
```

### Required when branch/checkpoint is affected

```text
branch-reality.txt
commit-sha.txt
ahead-behind.txt
merge-base.txt
```

## evidence.json minimum

```json
{
  "issueCode": "GOVERNANCE_REVIEW",
  "sessionId": "GOVERNANCE_REVIEW-YYYYMMDD-HHMMSS",
  "repo": "C:\\bthwani-suite",
  "branch": "...",
  "commitSha": "...",
  "mode": "CHECK | FORENSICS | APPLY | VERIFY | REVIEW",
  "allowedFiles": [],
  "forbiddenRoots": [],
  "finalDecision": "PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | READY_FOR_PR | REVERT_REQUIRED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE",
  "diffCheckPass": true,
  "typecheckPass": true,
  "scopeViolationCount": 0,
  "warnings": [],
  "errors": [],
  "outputFiles": []
}
```

## Traceability matrix

Canonical columns:

```text
requirement_id | source_file | owner_file | code_paths | tests | artifacts | status | notes
```

Status vocabulary:

```text
PASS | WARN | FAIL | NOT_APPLICABLE | INFO | TBD | BLOCKED
```

## Patch handoff rule

Sensitive local changes require:

```powershell
git --no-pager status --short > LOCAL_CHANGE_STATUS.txt
git --no-pager diff --stat > LOCAL_CHANGE_DIFF_STAT.txt
git --no-pager diff --name-status > LOCAL_CHANGE_NAME_STATUS.txt
git --no-pager diff --check > LOCAL_CHANGE_DIFF_CHECK.txt
git --no-pager diff --binary > LOCAL_CHANGE_REVIEW.patch
git ls-files --others --exclude-standard > LOCAL_CHANGE_UNTRACKED_FILES.txt
```

Untracked files are not included in normal `git diff`. They must be uploaded, added with intent-to-add for review, or discarded intentionally.

## Evidence acceptance

A task cannot pass if:

- diff check fails,
- verification output is missing,
- untracked files are unexplained,
- staged changes are unreviewed,
- UI screenshots are missing for UI work,
- evidence pack lacks `{SESSION_ID}.zip` when a task writes under registry runs.

## Final governance closure gates

Governance work may be called closed only when all applicable gates are proven:

- git status is understood,
- `git --no-pager diff --check` passes,
- `pnpm -w exec tsc --noEmit` passes when TypeScript or config changed,
- active governance guards pass when the task changed a guard-owned rule or verification path,
- no active implementation path depends on retired governance roots,
- evidence pack exists under `tools/registry/runs/{SESSION_ID}/`,
- decision vocabulary is one of the canonical values in this file,
- local-only work, branch work, or push state is stated explicitly rather than implied.

## Finalization rule

- Push, PR, or CI completion is a separate operation and must not be implied by local validation alone.
- A task may be `PASS` locally and still be `READY_FOR_PR` rather than merged or published.
- If CI is available and relevant, its state must be captured as evidence instead of guessed.
