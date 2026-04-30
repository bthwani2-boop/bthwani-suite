---
generatedFrom: governance/TRACEABILITY_MATRIX.md
generatedAt: 2026-04-30T04:48:37.9596587+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Traceability Matrix

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Purpose

Every important requirement must be traceable from request to evidence.

## 2. Required trace fields

| Field | Meaning |
|---|---|
| Requirement ID | Stable requirement identifier |
| Source | User request, governance, issue, blueprint, screenshot, contract |
| Service | Service slug or `_shared` |
| Surface | App/web/control-panel surface |
| Screen/Route | UI entry point if relevant |
| Component | Component or ui-kit contract |
| Flow | Flow ID or matrix entry |
| API | Contract/client if relevant |
| Binding | Data source/proof |
| States | loading/empty/error/success/offline/disabled |
| Tests | type/unit/contract/integration/smoke/E2E |
| Runtime proof | logs/screenshots/smoke |
| Evidence path | `tools/registry/runs/<SESSION_ID>` |
| Decision | PASS/FIX/BLOCKED/etc. |
| Owner | Responsible area |

## 3. Requirement status

Allowed values:

```text
TBD
UNPROVEN
VERIFIED
CLOSED
BLOCKED
DEPRECATED
REJECTED
```

## 4. Closure law

No requirement is closed unless every required trace field is either:

```text
proved
not applicable with reason
blocked with reason
```

## 5. UI trace

UI requirements must trace to:

```text
screen
component
state
RTL proof
screenshot
visual decision
```

## 6. API/data trace

API/data requirements must trace to:

```text
contract
client/binding
permission model
error model
runtime proof
test evidence
```

