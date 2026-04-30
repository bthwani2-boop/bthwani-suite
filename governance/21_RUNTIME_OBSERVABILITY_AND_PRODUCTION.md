# Runtime, Observability, Production Operations

## Purpose

This file controls runtime proof, observability, local-production readiness, and operational evidence.

## Runtime proof

A runtime claim requires one or more:

- request/response logs
- app logs
- server logs
- smoke test result
- E2E output
- screenshot/recording for UI behavior
- CI run artifact
- monitoring signal

## Local-production readiness

No local-production readiness claim without:

- canonical local stack
- local data plane
- runtime vars backend
- provider control plane
- fixture exit path
- seed/simulation path
- access/scale gates
- observability path

Forbidden as live readiness proof:

- fixture-only behavior
- stale compose truth
- sqlite as unapproved runtime truth
- hardcoded LAN/IP
- ENV-only provider control
- placeholder pages

## Observability

Runtime services should define:

- logs
- metrics
- tracing or correlation ID where appropriate
- error classification
- audit events
- health checks
- alerting path for critical services

## Incident evidence

Incidents require:

- timeline
- impact
- root cause
- mitigation
- rollback/forward fix
- evidence artifacts
- post-mortem if material
