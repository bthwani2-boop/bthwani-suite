---
generatedFrom: governance/SERVICE_CLOSURE_GUARDRAILS.md
generatedAt: 2026-04-30T04:48:37.9163121+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Service Closure Guardrails

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Canonical services

```text
dsh
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

Not standalone canonical services:

```text
exchangeprice
hr
```

## 2. Required service identity

Every service must define:

```text
id
name_ar
name_en
description
icon
category
status
owner
supported_surfaces
```

Recommended file:

```text
packages/surfaces/src/service-owned/<service>/service-meta.ts
```

## 3. Surface coverage

Every service must classify coverage for:

```text
app-client
app-partner
app-captain
app-field
control-panel
webapp
website
```

Each surface status must be one of:

```text
SUPPORTED
NOT_SUPPORTED
DEFERRED
TBD
```

## 4. Required matrices

Every service closure requires:

```text
Service Identity Matrix
Surface Coverage Matrix
Flow Matrix
Screens Matrix
State Model
Roles & Permissions Matrix
API Contract Matrix when data/API exists
Binding Matrix when runtime data exists
Runtime Evidence Matrix
Test Matrix
Decision Matrix
```

## 5. Blueprint requirement

Every active service should have:

```text
packages/surfaces/src/service-owned/<service>/SERVICE_BLUEPRINT.md
```

Blueprints must distinguish:

```text
VERIFIED
CLOSED
BLOCKED
TBD
UNPROVEN
DEPRECATED
REJECTED
```

## 6. Forbidden inside service-owned paths

```text
generic reusable design primitives
random color systems
duplicated Header/Button/Card
direct Tamagui imports
fixtures as runtime truth
public contract truth hidden inside internals
cross-service owner confusion
```

## 7. Service closure rule

No service is `CLOSED` or `100%` until it has:

```text
service identity
public contract
surface coverage
flow matrix
screens matrix
state model
roles/permissions
API contract when applicable
binding proof when applicable
runtime proof
tests/checks
visual evidence when UI exists
evidence pack
decision
```

