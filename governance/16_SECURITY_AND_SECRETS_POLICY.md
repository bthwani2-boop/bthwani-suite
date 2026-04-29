# Security and Secrets Policy

## Purpose

This policy prevents accidental exposure of secrets, weak permissions, privacy drift, and unsafe automation.

## Core Security Rules

- Never commit secrets, tokens, API keys, private certificates, or local credentials.
- Never paste secrets into governance docs, scripts, screenshots, or evidence packs.
- Use environment variables or secret managers for runtime secrets.
- Evidence packs must not include private credentials.
- CI workflows must use least-privilege permissions.
- AI agents must not create commits, PRs, pushes, force-pushes, merges, or remote writes unless a human explicitly approves a dedicated apply phase.

## Secrets Scanning

Gitleaks or equivalent secret scanning is required as a governance gate before PR/release closure.

A secret finding must be treated as blocking unless proven false-positive and documented.

## Privacy and Audit

Any service that handles user, merchant, captain, wallet, order, location, or payment data must later define:

- data ownership
- access boundaries
- RBAC model
- audit trail
- logging redaction
- privacy handling
- retention rules
- incident response

## Workflow Permissions

Default workflow permissions should be read-only.

Write permissions require documented justification.

Forbidden by default:

```text
contents: write
pull-requests: write
actions: write
checks: write
```

Allowed only with explicit evidence and a narrow use case.

## Local Evidence Safety

Evidence packs may include command output, hashes, reports, and status files. They must not include secrets or personal credentials.

## AI-Assisted Development

AI-generated scripts must be treated as untrusted until reviewed. Any script that deletes, moves, renames, commits, pushes, opens PRs, or changes remote state requires explicit approval and rollback evidence.

## Verification

Security-related closure requires:

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

plus the relevant security guard output when available.
