---
generatedFrom: governance/12_API_BINDING_RUNTIME_PROTOCOL.md
generatedAt: 2026-04-30T04:48:37.2047799+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# API / Binding / Runtime Protocol

## Purpose

This protocol defines the mandatory order for API, binding, integration, runtime, backend, and production readiness.

## Order

```text
1. Contract / API Forensics
2. OpenAPI / contract source decision
3. API types generation or alignment
4. API clients generation or alignment
# API Binding Runtime Protocol

Status: CANONICAL_PROTOCOL
Owner: BThwani Governance
Scope: OpenAPI sovereignty, contract quality, client and binding order, and runtime proof for data-driven features

## Ordered Chain

When data, integration, or runtime binding is involved, use this exact order:

1. contract truth
2. generated or shared types
3. client or access layer
4. binding or adapter layer
5. screen or flow integration
6. runtime proof

Do not start from a screen and invent the contract later.

## OpenAPI Sovereignty

When contracts exist, they are the canonical source for request, response, and error truth.

Rules:

- donor contracts may be read for forensics only
- rogue local contract truth is forbidden
- generated types and clients must derive from the approved contract source
- apps and surfaces consume contract outputs through the governed access chain, not ad hoc schema copies

## Required Contract Elements

Every governed API or integration surface must define:

- request schema
- response schema
- error schema
- permissions and caller assumptions
- versioning rule
- owner
- binding target

## Binding Rule

Runtime screens and flows must not call ad hoc remote logic when a reusable client or binding layer is required.

Binding proof must show:

- data source
- client or function used
- binding owner
- loading state
- success state
- empty state when relevant
- error state
- retry, offline, and stale handling when relevant

## No API Required Case

If no API is required, record:

```text
NO_API_REQUIRED
Reason:
Owner:
Evidence:
```

## Runtime Closure

Type safety is not runtime proof.

A runtime-bound feature is not complete until evidence proves:

- route or entrypoint proof
- contract or no-API decision
- client and binding correctness
- observable loading, success, error, and empty states
- retry or offline behavior when relevant

## Provenance

This file now absorbs the live authority previously split across `API_CONTRACT_POLICY.md`, `OPENAPI_SOVEREIGNTY.md`, and `FLOW_API_BINDING_RUNTIME_GUARDRAILS.md`.

