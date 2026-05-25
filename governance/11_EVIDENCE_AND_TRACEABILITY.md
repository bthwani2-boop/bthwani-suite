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

### Human-requested and task-specific evidence

Evidence form is human-requested and task-specific. Task classification (LOW / MEDIUM / UI_VISIBLE / HIGH / COMMIT/PUSH) helps estimate execution risk only — it does not determine fixed evidence size or prescribe fixed evidence tiers.

**Minimum proof required to avoid false acceptance claims after local writes:**

- `git status` — understand what changed.
- `git diff --name-status` — confirm scope.
- `git diff --check` — confirm no whitespace violations.

**Evidence by change type (not by tier):**

- `docs / policy / agents / governance only` → Git proof above. No tsc, no build, no evidence pack.
- `TS/TSX / config / exports affected` → targeted typecheck for affected project/path. Workspace `tsc` only on explicit human request, release, or broad architecture change.
- `UI visible change` → screenshots required; targeted type verification when needed.
- `runtime / behavior changed` → runtime smoke or log evidence.
- `release / deploy / native / dependency changed` → build output required.

**Evidence pack and ZIP are not default:**

- Registry folder `tools/registry/runs/{SESSION_ID}/` is created only when the human requests it or the workflow is sensitive and proven: patch review, checkpoint, CI, release, guard runner, scripted change.
- ZIP is optional and created only when the human explicitly requests it, or when one upload artifact is practically needed.
- No registry folder and no ZIP for docs, policy, agents, or governance-only work unless explicitly requested.

### Minimum evidence after code/doc changes

- git-status.txt or terminal git status output
- git-diff-check.txt or terminal git diff --check output
- changed-files list or git diff --name-status output
- verification output when applicable

### Optional registry evidence folder

Use tools/registry/runs/{SESSION_ID}/ when the task is high-risk, scripted, multi-file, or needs reviewable local evidence.

Recommended files when a registry folder is justified:

- SUMMARY.md
- evidence.json
- commands.log
- git-status.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- untracked-files.txt

{SESSION_ID}.zip is optional and must not be created by default. Create it only when the user explicitly requests a ZIP, when many evidence files must be uploaded as one artifact, or when a major governance/guard evidence run truly requires a single handoff artifact.

### Required when targeted type/runtime verification is justified

- typecheck.txt or typecheck-not-run-reason.txt
- lint.txt or lint-not-run-reason.txt
- test.txt or test-not-run-reason.txt
- build.txt or build-not-run-reason.txt

### Required when UI is affected

- screenshots/before when available
- screenshots/after
- visual-review.md or clear visual notes
- rtl-check.md or clear RTL notes

### Required when branch/checkpoint is affected

- branch-reality.txt
- commit-sha.txt
- ahead-behind.txt
- merge-base.txt when relevant

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
- required registry evidence for the chosen task class is missing.

## Final governance closure gates

Governance work may be called closed only when all applicable gates are proven:

- git status is understood,
- `git --no-pager diff --check` passes,
- targeted typecheck passes when TypeScript or config risk justifies it, or a NOT_RUN_REASON is recorded; workspace `tsc` is reserved for high-risk, release, broad architecture, or explicit human request,
- targeted governance guards pass when the task changed a guard-owned rule or verification path,
- no active implementation path depends on retired governance roots,
- registry evidence exists under `tools/registry/runs/{SESSION_ID}/` only when the task class justifies it,
- ZIP is optional and created only when explicitly requested or when one upload artifact is needed,
- decision vocabulary is one of the canonical values in this file,
- local-only work, branch work, or push state is stated explicitly rather than implied.

## Finalization rule

- Push, PR, or CI completion is a separate operation and must not be implied by local validation alone.
- A task may be `PASS` locally and still be `READY_FOR_PR` rather than merged or published.
- If CI is available and relevant, its state must be captured as evidence instead of guessed.
