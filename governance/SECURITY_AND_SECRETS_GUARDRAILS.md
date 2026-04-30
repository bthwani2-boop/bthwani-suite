# Security and Secrets Guardrails

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Secrets rule

Never commit:

```text
API keys
tokens
passwords
private certificates
real credentials
production secrets
private env values
```

## 2. Env rule

Use examples/placeholders only in committed files.

Real `.env` files must not be committed unless explicitly approved as non-secret templates.

## 3. Logging rule

Logs must not expose:

```text
tokens
cookies
authorization headers
private user data
payment data
provider secrets
internal credentials
```

## 4. GitHub write security

No write action on GitHub unless explicitly requested.

This includes:

```text
commit
push
branch mutation
PR creation
merge
force push
issue/PR mutation
```

## 5. Evidence security

Evidence packs should avoid secrets.

If a patch or evidence file contains secret-like content:

```text
BLOCKED_SECURITY_RISK
```

## 6. Required gates

Security-sensitive changes require:

```text
diff review
secret scan if available
env review
logs review
owner decision
rollback path
```
