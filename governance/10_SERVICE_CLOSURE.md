# Service Closure Protocol

**Status:** Canonical Governance Payload v2
**Owner:** `Service Closure Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0106-20260430-221753-governance`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 10_SERVICE_CLOSURE_PROTOCOL, GOVERNANCE_CLOSURE_STANDARD, GOVERNANCE_CLOSEOUT_ROADMAP

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

{standard_footer()}
