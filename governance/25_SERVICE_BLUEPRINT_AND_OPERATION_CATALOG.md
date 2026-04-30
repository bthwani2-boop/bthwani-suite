# Service Blueprint and Operation Catalog Standard

**Status:** Canonical Governance Payload v2
**Owner:** `Service Blueprint Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0106-20260430-221753-governance`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** SERVICE_BLUEPRINT patterns, PLATFORM_BLUEPRINT, operation catalog standards

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Service blueprint purpose

Every canonical service should have a living blueprint before closure. The blueprint captures only verified or explicitly TBD truths.

## Blueprint location

```text
packages/surfaces/src/service-owned/<service>/SERVICE_BLUEPRINT.md
```

or another approved service-owned canonical path if the repo structure evolves with evidence.

## Required blueprint sections

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

## Operation catalog record

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

## Blueprint status vocabulary

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

## Operation status vocabulary

```text
DRAFT
READY_FOR_BINDING
BOUND
RUNTIME_VERIFIED
CONTROLLED
BLOCKED
DEPRECATED
```

## Service blueprint anti-noise rules

- no invented endpoints,
- no fake “closed” status,
- no copied generic text without service facts,
- no financial logic outside WLT,
- no UI states omitted,
- no control-panel side effects without audit.

## Closure relationship

`10_SERVICE_CLOSURE.md` defines closure protocol. This file defines the blueprint/catalog shape used to prove closure.

{standard_footer()}
