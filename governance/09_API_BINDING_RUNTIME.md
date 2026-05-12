# API / Binding / Runtime

**Status:** Canonical Governance Payload v2
**Owner:** `API Runtime Governance`
**Canonical repo:** `C:\bthwani-suite`
**Execution branch context:** runtime-detected from Git; do not hardcode branch truth.
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 12_API_BINDING_RUNTIME_PROTOCOL, API_CONTRACT_POLICY, FLOW_API_BINDING_RUNTIME_GUARDRAILS, LOCAL_PRODUCTION_READINESS, runtime verification requirements

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Contract source

Public HTTP APIs must be represented by OpenAPI under:

```text
contracts/master/
```

During bootstrap, forensics may begin from UI/runtime evidence, but no public contract is closed until OpenAPI exists.

## Phase law

### Bootstrap phase

Allowed:

- inspect screens,
- inspect runtime logs,
- map user flows,
- identify missing endpoints,
- define provisional binding matrix.

Not allowed:

- claim contract closure,
- hide missing OpenAPI,
- hardcode endpoint truth in screens,
- treat fixtures as runtime truth.

### Steady-state phase

When OpenAPI exists:

- OpenAPI is legal contract truth.
- `api-types` is generated/derived from contract.
- `api-clients` follows contract.
- services implement contract.
- runtime verification proves behavior.

## NestJS backend contract

NestJS services must expose or feed contract generation consistently. Controller DTOs, validation, auth decorators, and OpenAPI schemas must not drift silently.

Minimum backend evidence for API change:

- changed controller/service path,
- contract diff,
- type generation or typecheck,
- integration/contract test,
- runtime log or request evidence when needed.

## Binding chain

```text
OpenAPI contract
→ api-types
→ api-clients
→ surface binding
→ screen state
→ runtime evidence
```

Every break in this chain is a defect until documented as `TBD/BLOCKED`.

## API binding matrix columns

```text
service | surface | screen/operation | endpoint | method | request type | response type | auth | states covered | evidence | status
```

## Runtime forbidden patterns

- direct fetch in screen when API client exists,
- undocumented endpoint,
- fixture-only success path,
- local mock treated as production,
- env-only provider truth,
- unvalidated response shape,
- silent catch that hides API failure.

## API closure criteria

- endpoint documented,
- auth/security model documented,
- request/response examples exist,
- API client typed,
- surface handles states,
- tests/runtime evidence exist,
- rollback/disable path exists for risky changes.

## Runtime observability and production proof

Runtime truth is proven through logs, requests, tests, traces, health checks, and user-visible behavior. Documentation alone does not prove runtime.

### Observability dimensions

| Dimension | Minimum |
|---|---|
| Logs | structured enough to diagnose service/operation |
| Metrics | success/failure/latency where applicable |
| Errors | captured and user-safe |
| Health | service/dependency readiness |
| Audit | actor/action/time/scope for operations |
| Alerts | critical failures route to owner |
| Traces | cross-service flows when possible |

### Runtime evidence examples

```text
request/response sample with redaction
server log excerpt
client log excerpt
test run output
health endpoint output
screenshot of state
control-panel operation audit entry
```

### Production readiness blockers

- fixture-only success,
- no error state,
- no rollback,
- no health check,
- no owner,
- no alert path for critical operation,
- no audit for money/admin operation,
- hardcoded LAN/IP/provider.

### Local-production distinction

A local dev run may prove integration direction, but production readiness needs stronger evidence:

- environment model,
- provider control,
- seed/migration readiness,
- secrets handling,
- scale/performance risk,
- monitoring.

### Runtime closure chain

```text
contract
→ implementation
→ client binding
→ UI state
→ logs/tests
→ evidence pack
```
