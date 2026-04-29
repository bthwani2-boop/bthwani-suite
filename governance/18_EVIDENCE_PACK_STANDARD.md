# Evidence Pack Standard

## Purpose

This standard defines the evidence pack required for every governance, diagnostic, APPLY, verification, and service-closure phase.

## Evidence Root

```text
tools/registry/runs/{SESSION_ID}
```

`{SESSION_ID}` must include a meaningful issue code and timestamp.

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
tsc-noemit-before.txt
tsc-noemit-after.txt
untracked-before.txt
untracked-after.txt
```

## Required Metadata

`evidence.json` should include:

```json
{
  "issueCode": "...",
  "sessionId": "...",
  "evidenceRoot": "...",
  "mode": "READ_ONLY | APPLY | VERIFY",
  "allowedFiles": [],
  "forbiddenRoots": [],
  "finalDecision": "...",
  "diffCheckPass": true,
  "tscPass": true,
  "scopeViolationCount": 0,
  "outputFiles": []
}
```

## Commands Log

`commands.log` must record:

- every command executed
- every script write action
- exit codes
- errors
- evidence root path

## Scope Evidence

Every APPLY phase must prove:

- what files were allowed
- what files changed
- what files were backed up
- whether any unexpected path changed
- whether untracked files are expected or unexpected

## Verification

Minimum verification after APPLY:

```powershell
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

Additional verification depends on the phase.

## Evidence Is Not Product Source

Evidence packs under `tools/registry/runs` are output artifacts. They must not become product code or canonical governance content.
