# API Contract Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: API, schemas, clients, permissions, errors, contracts, and no-API declarations

## 1. Purpose

This policy prevents runtime ambiguity between screens, services, clients, and backends.

No API-dependent feature may close without a contract or an explicit `NO_API_REQUIRED`.

## 2. Required contract elements

A valid API contract includes:

- endpoint or operation id
- owner service
- version
- request schema
- response schema
- error schema
- permission model
- auth requirements
- idempotency/retry rule where applicable
- pagination/filtering/sorting where applicable
- client binding
- contract proof

## 3. Request schema

Requests must define:

- required fields
- optional fields
- validation
- defaults
- locale/RTL implications where relevant
- permission-sensitive fields

## 4. Response schema

Responses must define:

- success shape
- empty shape
- partial data behavior
- stale data behavior
- localization expectations
- display-safe fields

## 5. Error schema

Errors must define:

- code
- message key or message
- user-safe description
- retryability
- permission implications
- logging sensitivity

## 6. Permissions

Every API must define who can:

- read
- create
- update
- delete
- approve
- reject
- cancel
- export
- audit

Unknown permissions block closure.

## 7. Client binding

Every API contract used by a UI/flow must map to:

- client function
- hook or module
- loading state
- success state
- empty state
- error state
- retry/offline/stale behavior
- runtime proof

## 8. No API required

When no API is required, record:

```text
NO_API_REQUIRED
Reason:
Scope:
Owner:
Evidence:
```

A missing API contract is not the same as `NO_API_REQUIRED`.

## 9. Contract closure

An API contract is closed only when:

- schema exists
- permissions exist
- errors exist
- client binding exists where used
- tests or proof exist
- traceability matrix row exists
- evidence root exists
