# Warnings and False Positives

## Purpose

This file prevents warning noise from hiding real defects or blocking progress without reason.

## Warning classification

| Status | Meaning |
|---|---|
| `TRUE_DEFECT` | real issue requiring fix |
| `KNOWN_LIMITATION` | accepted short-term limitation |
| `FALSE_POSITIVE` | tool warning not representing a defect |
| `BASELINE_WARNING` | existing warning tracked for later remediation |
| `PROMOTE_TO_BLOCKING` | warning family must become gate |
| `IGNORE_REJECTED` | proposed ignore rejected |

## False-positive requirements

A false positive must include:

- warning text
- source tool
- affected file/path
- reason not a defect
- reviewer/owner
- expiry/review date
- evidence

## Baseline warning rule

Baseline warnings may be tolerated only if:

- counted
- categorized
- non-increasing or intentionally explained
- not security-critical
- not hiding failed closure
- remediation plan exists

## Promotion rule

A warning family becomes blocking when:

- false positives are controlled
- signal is stable
- remediation path exists
- owner accepts gate
- CI can enforce deterministically

## Forbidden

- no broad suppressions
- no silent ignore
- no PASS if critical warnings are unexplained
- no hiding TypeScript/security/runtime errors as warnings
