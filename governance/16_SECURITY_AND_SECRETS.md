# Security, Secrets, Privacy

## Core security law

No secrets in code, docs, evidence, screenshots, logs, patches, or prompts.

## Secret examples

- API keys
- tokens
- passwords
- private certificates
- cookies/session values
- database URLs with credentials
- private provider credentials
- production secrets
- personally identifiable data unless explicitly required and redacted

## Required scans/checks

Security-sensitive work requires:

- secret scan or explicit manual review
- env/config diff review
- permission/auth impact note
- evidence redaction check
- threat/abuse note when user-visible behavior changes

## Auth and permission changes

Changes to auth/RBAC/permissions require:

- old behavior
- new behavior
- affected roles
- denied states
- audit trail
- tests or manual proof
- rollback plan

## Logs and evidence

Logs may be uploaded only after redaction. If a diff includes secret-like material, decision is `BLOCKED` until removed and rotated if needed.

## WLT security

Financial paths require extra proof for:

- ledger integrity
- idempotency
- reconciliation
- refund/payout permissions
- auditability
- rollback/compensation
