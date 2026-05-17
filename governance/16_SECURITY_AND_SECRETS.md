# Security and Secrets

**Status:** Canonical Governance Payload v2
**Owner:** `Security Governance`

## Secret law

Never commit or paste:

```text
API keys
tokens
passwords
private certificates
production secrets
private signing keys
database credentials
session cookies
access tokens
```

## Secret storage

Secrets must live in approved secret managers, CI secret stores, or local untracked environment files. Documentation may describe variable names but not secret values.

## Security evidence

Security-sensitive changes require:

- changed file list,
- secret scan or reason,
- auth/permission impact,
- PII impact,
- rollback plan,
- test/log evidence when applicable.

## PII and privacy

User data, addresses, phone numbers, payment data, captain location, partner financial data, and operational logs must be minimized and protected. Evidence packs should redact sensitive values.

## Auth/RBAC law

Control-panel operations must define:

- role,
- permission,
- action,
- audit log,
- denial state,
- rollback/undo when possible.

## WLT security

Financial operations require stronger evidence:

- immutable ledger/audit trail,
- reconciliation,
- dual-control or approval where appropriate,
- no direct mutation from unrelated services,
- clear error handling.

## Tooling

Recommended security checks:

```powershell
git --no-pager diff --check
rg -i "api[_-]?key|secret|token|password|private_key" .
```

If gitleaks or equivalent exists, run it for security-sensitive changes.

## Blocking conditions

- secret-like value in diff,
- production credential exposure,
- hidden auth bypass,
- unaudited money mutation,
- PII in evidence without redaction.
