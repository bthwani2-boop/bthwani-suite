# Evidence and Traceability

**Status:** Canonical Governance Payload v2
**Owner:** `Evidence Governance`
**Canonical repo:** `C:\bthwani-suite`
**Execution branch context:** runtime-detected from Git; do not hardcode branch truth.
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 18_EVIDENCE_PACK_STANDARD, EVIDENCE_AND_CLOSURE_GATES, PATCH_REVIEW_PROTOCOL, GOVERNANCE_FINALIZATION_PROTOCOL

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Core evidence law

Evidence is inspectable output. A summary from Copilot, ChatGPT, or a script is not evidence by itself.

## Canonical evidence root

```text
tools/registry/runs/{SESSION_ID}/
```

## Evidence pack standard

### Always required after code/doc changes

```text
SUMMARY.md or summary.txt
evidence.json
commands.log
git-branch-current.txt
git-status-before.txt
git-status-after.txt
git-diff-check-before.txt
git-diff-check-after.txt
untracked-before.txt
untracked-after.txt
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
  "issueCode": "GOVERNANCE_DEEPENING",
  "sessionId": "GOVERNANCE_DEEPENING-YYYYMMDD-HHMMSS",
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
git --no-pager diff -- . > LOCAL_CHANGE_REVIEW.patch
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
- evidence pack lacks `{SESSION_ID}.zip` when a script writes under registry runs.

## Final governance closure gates

Governance work may be called closed only when all applicable gates are proven:

- git status is understood,
- `git --no-pager diff --check` passes,
- `pnpm -w exec tsc --noEmit` passes,
- active governance guards pass with zero failures,
- no active implementation path depends on retired governance roots,
- evidence pack exists under `tools/registry/runs/{SESSION_ID}/`,
- decision vocabulary is one of the canonical values in this file,
- local-only work, branch work, or push state is stated explicitly rather than implied.

## Finalization rule

- Push, PR, or CI completion is a separate operation and must not be implied by local validation alone.
- A task may be `PASS` locally and still be `READY_FOR_PR` rather than merged or published.
- If CI is available and relevant, its state must be captured as evidence instead of guessed.
