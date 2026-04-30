# Traceability Matrix and Roadmap

## Purpose

This file owns the closure roadmap and requirement-to-evidence mapping standard.

## Matrix schema

```text
requirement_id | source | owner | implementation_paths | tests | evidence | status | notes
```

## Requirement ID format

Examples:

```text
GOV-SSOT-001
GOV-ARCH-001
GOV-UI-RTL-001
GOV-WLT-001
GOV-DSH-001
GOV-SEC-001
GOV-CI-001
```

## Roadmap phases

| Phase | Goal |
|---|---|
| P0 | Governance package installed and legacy authority removed/quarantined |
| P1 | Guard catalog aligned and runnable |
| P2 | Surface/service registry proven against repo paths |
| P3 | DSH golden slice closed |
| P4 | WLT financial law enforced |
| P5 | Control-panel operating model aligned |
| P6 | CI gates promoted from report-only to blocking |
| P7 | PR/merge readiness with evidence pack |

## Closure board

A closure board must track:

- blocker count
- high-risk gaps
- warning families
- guard status
- evidence pack status
- runtime proof status
- owner
- next action

## Acceptance

Roadmap items become closed only after their traceability row has `PASS` and points to artifacts.
