# Runtime Observability and Production

**Status:** Canonical Governance Payload v2
**Owner:** `Runtime Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** LOCAL_PRODUCTION_READINESS, runtime verification requirements

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Runtime truth

Runtime truth is proven through logs, requests, tests, traces, health checks, and user-visible behavior. Documentation alone does not prove runtime.

## Observability dimensions

| Dimension | Minimum |
|---|---|
| Logs | structured enough to diagnose service/operation |
| Metrics | success/failure/latency where applicable |
| Errors | captured and user-safe |
| Health | service/dependency readiness |
| Audit | actor/action/time/scope for operations |
| Alerts | critical failures route to owner |
| Traces | cross-service flows when possible |

## Runtime evidence examples

```text
request/response sample with redaction
server log excerpt
client log excerpt
test run output
health endpoint output
screenshot of state
control-panel operation audit entry
```

## Production readiness blockers

- fixture-only success,
- no error state,
- no rollback,
- no health check,
- no owner,
- no alert path for critical operation,
- no audit for money/admin operation,
- hardcoded LAN/IP/provider.

## Local-production distinction

A local dev run may prove integration direction, but production readiness needs stronger evidence:

- environment model,
- provider control,
- seed/migration readiness,
- secrets handling,
- scale/performance risk,
- monitoring.

## Runtime closure

Runtime closure requires the chain:

```text
contract
→ implementation
→ client binding
→ UI state
→ logs/tests
→ evidence pack
```
