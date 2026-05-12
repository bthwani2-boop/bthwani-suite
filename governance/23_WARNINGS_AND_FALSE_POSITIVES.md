# Warnings and False Positives

**Status:** Canonical Governance Payload v2
**Owner:** `Warning Governance`

## Warning categories

| Category | Meaning | Default action |
|---|---|---|
| `TRUE_POSITIVE_BLOCKING` | real issue blocks closure | fix |
| `TRUE_POSITIVE_REPORT` | real issue but non-blocking | record owner/expiry |
| `FALSE_POSITIVE` | tool finding is wrong | document rule and suppress narrowly |
| `ACCEPTED_RISK` | real risk accepted temporarily | owner/expiry/rollback |
| `TBD` | not classified | blocks final acceptance |

## False positive requirements

A false positive must include:

- tool/guard id,
- finding,
- reason false,
- evidence,
- exact suppression scope,
- expiry/review date if needed.

## Warning baseline

Warnings may be tolerated only when:

- classified,
- not security/money critical,
- owner exists,
- remediation or expiry exists,
- CI/guard mode is clear.

## Warning escalation

A report-only warning becomes blocking when:

- repeated without owner,
- affects security/finance,
- hides missing evidence,
- blocks runtime verification,
- indicates scope drift.

## Final acceptance

No final governance closure may include unclassified warnings. Use `PASS_WITH_WARNINGS` only when warnings are documented and non-blocking.
