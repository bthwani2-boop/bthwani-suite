---
generatedFrom: governance/SERVICE_BLUEPRINT_STANDARD.md
generatedAt: 2026-04-30T04:48:37.8970925+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Service Blueprint Standard

Status: CANONICAL
Owner: BThwani Governance
Scope: `packages/surfaces/src/service-owned/<service>/SERVICE_BLUEPRINT.md`

## 1. Required location

Every service-owned service must have exactly one live service blueprint at:

```text
packages/surfaces/src/service-owned/<service>/SERVICE_BLUEPRINT.md
```

This file stays with the service because it is the live service contract.

## 2. Governance role

`governance/` owns only:

- blueprint standard
- blueprint template
- blueprint policy
- validation rules

`governance/` does not own each service's live service truth.

## 3. Required sections

Each service blueprint must contain:

1. Service identity
2. Surface/app coverage matrix
3. Current phase truth
4. Verified capabilities
5. Unverified capabilities
6. Blocked gaps
7. Evidence registry
8. Ownership boundaries
9. Public exports and runtime entrypoints
10. Change log

## 4. Status rules

Allowed statuses:

- TEMPLATE_ONLY
- PARTIALLY_VERIFIED
- VERIFIED
- BLOCKED
- REJECTED
- DEPRECATED
- NEEDS_REWRITE

`TBD`, `UNPROVEN`, and placeholder text are allowed only when clearly labeled as unresolved state. They are not allowed to masquerade as closed truth.

## 5. Evidence rule

A service blueprint may claim `VERIFIED` only when it cites evidence from:

```text
tools/registry/runs/<SESSION_ID>/
```

A service blueprint may not claim full closure based on intent, naming, old roadmap language, or inferred behavior.

## 6. Application relationship

The blueprint must explicitly list related surfaces and app directories, such as:

- app-client
- app-partner
- app-field
- app-captain

Only real paths in the repository count.
