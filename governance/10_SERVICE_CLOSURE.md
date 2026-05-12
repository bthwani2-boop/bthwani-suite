# Service Closure Protocol

**Status:** Canonical Governance Payload v2
**Owner:** `Service Closure Governance`
**Canonical repo:** `C:\bthwani-suite`
**Execution branch context:** runtime-detected from Git; do not hardcode branch truth.
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 10_SERVICE_CLOSURE_PROTOCOL, GOVERNANCE_CLOSURE_STANDARD, GOVERNANCE_CLOSEOUT_ROADMAP, SERVICE_BLUEPRINT patterns, PLATFORM_BLUEPRINT, operation catalog standards

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Purpose

This file defines what it means to close a BThwani service or service-surface slice. It is not merely deprecating an endpoint. Closure is an end-to-end proof that the service works across UI, flow, API, binding, runtime, operations, evidence, and rollback.

## Closure levels

| Level | Meaning | Required proof |
|---|---|---|
| L0 Inventory | service/surface known | registry row |
| L1 UX skeleton | screens/states designed | screenshot or design evidence |
| L2 Flow | user journey mapped | flow matrix |
| L3 Binding | API/client relation known | binding matrix |
| L4 Runtime | live/dev runtime works | logs/tests |
| L5 Ops | control-panel/ops path exists | operation evidence |
| L6 Guarded | CI/guard/evidence checks exist | evidence pack |
| L7 Closed | accepted with no blockers | decision record |

## Closure order

1. Identify service and surfaces.
2. Create/update service blueprint.
3. Create screen and flow inventory.
4. Map API/binding/runtime.
5. Define state model.
6. Connect control-panel operations.
7. Attach evidence pack.
8. Run gates.
9. Record closure decision.

## Golden slice rule

DSH is the first golden slice. Do not claim the platform is closed if DSH is not closed across client, partner, captain, field, and control-panel.

## Required closure matrices

### Screen matrix

```text
surface | route/screen | owner | states | ui-kit components | screenshot evidence | status
```

### Flow matrix

```text
flow | actor | start | decision points | failure states | recovery | evidence | status
```

### API/runtime matrix

```text
operation | endpoint/client | contract | auth | test | runtime evidence | status
```

### Operations matrix

```text
operation | control-panel entry | permission | audit log | rollback | evidence | status
```

## Service blueprint and operation catalog

Every canonical service should have a living blueprint before closure. The blueprint captures only verified or explicitly `TBD` truths.

### Blueprint location

```text
<service>/SERVICE_BLUEPRINT.md
```

or another approved root-service canonical path if the repo structure evolves with evidence.

### Required blueprint sections

```text
service identity
surface matrix
actors
flows
screen inventory
state model
API/binding matrix
control-panel operations
WLT/financial boundary
VAR/provider policy
security/privacy
testing/runtime evidence
open gaps
closure decision
```

### Operation catalog record

```text
operation_id
service
surface
actor
permission
input
validation
state change
side effect
API/client
audit log
rollback
evidence
status
```

### Blueprint status vocabulary

```text
TEMPLATE
TBD
UNPROVEN
VERIFIED
CLOSED
BLOCKED
STALE_PATH
DEPRECATED
REJECTED
```

### Operation status vocabulary

```text
DRAFT
READY_FOR_BINDING
BOUND
RUNTIME_VERIFIED
CONTROLLED
BLOCKED
DEPRECATED
```

### Service blueprint anti-noise rules

- no invented endpoints,
- no fake “closed” status,
- no copied generic text without service facts,
- no financial logic outside WLT,
- no UI states omitted,
- no control-panel side effects without audit.

### Governed template services

`demo-service` is a governed template/sandbox service used to demonstrate required service-owned structure.

- It is not part of the canonical business-service fleet.
- It must remain clearly marked as template/example-only.
- It must still keep `SERVICE_BLUEPRINT.md`, service metadata, contracts/tests/evidence placeholders, and must not be cited as proof that a real business service is closed.
- Any additional template service must be explicitly named here before guards may treat it as allowed.

### Closure relationship

This file owns closure protocol and the blueprint/catalog shape used to prove closure.

## Closure decision vocabulary

- `PASS`
- `PASS_WITH_WARNINGS`
- `FIX_REQUIRED`
- `BLOCKED`
- `NEEDS_EVIDENCE`
- `NEEDS_VISUAL_EVIDENCE`
- `REVERT_REQUIRED`

## Forbidden closure claims

- “UI is done” without screenshots.
- “API works” without contract/runtime evidence.
- “Ready” with untracked files.
- “Closed” with legacy unaccounted.
- “100%” with failing diff/typecheck/test/guard.
