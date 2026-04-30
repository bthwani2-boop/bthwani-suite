# Flow, API, Binding, and Runtime Guardrails

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Flow guard

Every flow must define:

```text
flow id
service
surface
actor/role
start trigger
steps
actions
validation
success state
error state
empty state
loading state
offline state
end state
evidence
decision
```

No flow is closed without a matrix or blueprint reference.

## 2. API contract guard

Any API-backed capability must define:

```text
request schema
response schema
error schema
permissions
versioning
idempotency when relevant
contract tests when relevant
client binding proof
runtime proof
```

No API is accepted from UI behavior alone.

## 3. Binding guard

Any data screen must prove:

```text
data source
client/API path
loading behavior
success rendering
error rendering
empty rendering
retry behavior
offline/stale behavior when applicable
permission behavior
```

## 4. Runtime guard

TypeScript passing is not runtime proof.

Runtime proof may include:

```text
app/surface startup logs
route/screen navigation proof
smoke test output
API response logs with secrets redacted
screenshots
screen recordings when interaction is complex
```

## 5. Fixture guard

Fixtures are allowed only as explicitly marked development/test material.

Forbidden:

```text
fixtures as live runtime truth
USE_FIXTURES as production behavior
sqlite/local-only truth as production-readiness claim
LAN/IP hardcoding as final provider model
```

## 6. API/binding/runtime acceptance criteria

A data/runtime change is acceptable only when:

```text
contract exists or non-API scope is documented
binding source is proven
states are covered
permissions are accounted for
runtime proof exists
tests/checks run
evidence stored
decision recorded
```
