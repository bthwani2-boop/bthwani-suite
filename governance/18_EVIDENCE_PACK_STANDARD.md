# Evidence Pack Standard

Status: CANONICAL_STANDARD
Owner: BThwani Governance
Scope: evidence pack schema, minimum files, metadata, handoff artifacts, and scope proof

## Purpose

This standard defines the evidence pack required for governance, diagnostic, APPLY, verification, runtime, review, and service-closure work.

## Evidence Root

```text
tools/registry/runs/{SESSION_ID}/
```

`{SESSION_ID}` must include a meaningful issue code or scope identifier and a timestamp or equivalent unique discriminator.

Phase subfolders are allowed when needed, but the canonical run root remains the top-level session folder.

## Required Core Files

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

When the touched scope can affect TypeScript, scripts, guard code, or configuration, also include:

```text
tsc-noemit-before.txt
tsc-noemit-after.txt
```

## Scope-Specific Evidence

Add the following when applicable:

- UI or UX scope: screenshots, visual notes, state coverage proof
- runtime scope: logs, smoke output, route proof, build output
- API or binding scope: contract proof, client proof, integration proof
- guard scope: guard output and warning/error classification proof
- destructive scope: backup or rollback proof, path accounting, decision ledger reference

## Required Metadata

`evidence.json` should include:

```json
{
  "issueCode": "...",
  "sessionId": "...",
  "evidenceRoot": "...",
  "mode": "READ_ONLY | CHECK | FORENSICS | PLAN | APPLY | VERIFY | REVIEW | RUNTIME_VERIFY",
  "allowedFiles": [],
  "forbiddenRoots": [],
  "finalDecision": "PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | READY_FOR_PR | REVERT_REQUIRED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE",
  "phaseState": "...",
  "diffCheckPass": true,
  "tscPass": true,
  "scopeViolationCount": 0,
  "warningSummary": [],
  "outputFiles": []
}
```

## Commands Log

`commands.log` must record:

- every command executed
- every script or file write action
- exit codes
- errors
- evidence root path

## Scope Proof

Every APPLY, VERIFY, REVIEW, or destructive governance phase must prove:

- what files were allowed
- what files changed
- what files were backed up when applicable
- whether any unexpected path changed
- whether untracked files are expected or unexpected
- which canonical governance file owns the decision

## Minimum Verification

Minimum verification after APPLY is:

```powershell
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

Additional verification depends on the phase and must be captured inside the evidence pack.

## Secrets And Safety Rule

Evidence may include command output, hashes, logs, screenshots, and proof files.

Evidence must not include:

- secrets
- real credentials
- private tokens
- sensitive production data copied without approval

## Evidence Is Not Product Source

Evidence packs under `tools/registry/runs/` are output artifacts. They must not become product code or canonical governance authority.
