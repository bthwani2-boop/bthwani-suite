---
generatedFrom: governance/GUARD_SEVERITY_PROMOTION_POLICY.md
generatedAt: 2026-04-30T04:48:37.7702376+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Guard Severity Promotion Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: promotion of guard warning classes to errors

## 1. Purpose

The guard system starts warning-first to discover baseline issues. It becomes error-first only after evidence-based calibration.

## 2. Promotion prerequisites

A warning class can become an Error only when:

- detection is precise
- false positives are known or handled
- accepted baseline is documented
- remediation path exists
- owner approves
- CI impact is known
- rollback is possible

## 3. Promotion order

Preferred promotion order:

1. secrets and sensitive data
2. destructive script safety
3. old standalone repo/path references
4. direct Tamagui import violations
5. public export/deep import violations
6. missing service blueprint
7. missing evidence handoff
8. UI brand/RTL high-confidence violations
9. unclassified dead code only after traceability proof

## 4. Non-promotable warnings

Do not promote to Error yet when:

- rule is heuristic
- findings need owner interpretation
- legacy baseline is not classified
- detection has known false positives
- remediation could delete valid code

## 5. Evidence for promotion

Each severity promotion must include:

- guard name
- warning class
- before count
- after count
- false-positive handling
- accepted baseline handling
- owner decision
- CI impact
- rollback note

