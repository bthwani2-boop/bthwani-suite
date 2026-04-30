# Evidence and Traceability

## Core law

No `PASS`, `READY`, `CLOSED`, `FINAL`, `LOCKED`, or `100%` claim without evidence.

## Canonical evidence root

```text
tools/registry/runs/{SESSION_ID}/
```

## Minimum evidence pack

Every meaningful gate should produce:

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
```

Add when relevant:

```text
tsc-noemit.txt
lint.txt
tests.txt
build.txt
runtime-logs/
screenshots/
patches/
traceability-matrix.csv
guard-results.json
```

## evidence.json minimum schema

```json
{
  "issueCode": "GOVERNANCE_TASK",
  "sessionId": "TASK-YYYYMMDD-HHMMSS",
  "repo": "C:\\bthwani-suite",
  "branch": "branch-name",
  "headSha": "sha",
  "mode": "CHECK | FORENSICS | APPLY | VERIFY | REVIEW | RUNTIME_VERIFY",
  "allowedPaths": [],
  "forbiddenPaths": [],
  "finalDecision": "PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | READY_FOR_PR | REVERT_REQUIRED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE",
  "diffCheckPass": true,
  "tscPass": true,
  "scopeViolationCount": 0,
  "warnings": [],
  "errors": [],
  "artifacts": []
}
```

## Decision vocabulary

`PASS`, `PASS_WITH_WARNINGS`, `FIX_REQUIRED`, `BLOCKED`, `READY_FOR_PR`, `REVERT_REQUIRED`, `NEEDS_EVIDENCE`, `NEEDS_VISUAL_EVIDENCE`

## Traceability row schema

```text
requirement_id | governance_source | implementation_paths | tests | artifacts | status | notes
```

Status values:

- `PASS`
- `WARN`
- `FAIL`
- `NOT_APPLICABLE`
- `INFO`

## Evidence is not

- Copilot verbal summary
- screenshots without code evidence
- code diff without verification
- policy text without artifacts
- assumed behavior

## Untracked/staged rule

No final acceptance until:

- staged changes are accounted for
- untracked files are listed and reviewed
- local diff is clean or intentionally included
