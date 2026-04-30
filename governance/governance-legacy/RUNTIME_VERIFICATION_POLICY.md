---
generatedFrom: governance/RUNTIME_VERIFICATION_POLICY.md
generatedAt: 2026-04-30T04:48:37.8749906+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Runtime Verification Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: runtime proof, app/surface execution, logs, screenshots, smoke tests, and closure gates

## 1. Purpose

TypeScript passing is necessary but not sufficient.

Runtime verification proves that the affected app, surface, route, flow, or binding actually works.

## 2. When runtime proof is required

Runtime proof is required for changes affecting:

- navigation
- routing
- screen entrypoints
- app-shell wiring
- API binding
- payments
- wallet/finance
- order lifecycle
- auth/security
- permissions
- UI/UX screens
- RTL/layout behavior
- control panel workflows

## 3. Accepted runtime evidence

Accepted evidence includes:

- app run logs
- server logs
- route smoke logs
- screenshots
- video/screen capture when useful
- build output
- EAS/build evidence
- Playwright/Cypress/smoke output
- manual device proof with timestamped evidence

## 4. UI visual proof

For meaningful UI/UX changes, runtime proof must include visual evidence.

Check:

- Arabic RTL direction
- icon/text clustering
- action placement
- safe area
- overflow
- clipping
- brand colors
- component consistency
- loading/empty/error/success states where applicable

## 5. Route proof

Route proof must show:

- route exists
- route loads
- no immediate crash
- expected screen/surface appears
- navigation back/forward behavior where applicable
- permissions do not expose forbidden access

## 6. Binding proof

Data binding proof must show:

- data source
- loading state
- success state
- empty state
- error state
- retry/offline behavior when relevant
- stale data handling when relevant

## 7. Smoke tests

Smoke tests should be narrow and fast.

A smoke test should prove the main route or flow can start and reach a stable state.

Smoke proof is not full E2E proof unless it covers the complete user outcome.

## 8. Runtime closure

A runtime-sensitive change may not be marked closed until:

- code checks pass
- guards pass with Errors: 0
- runtime proof exists
- visual proof exists when UI/UX changed
- evidence root is recorded
- warnings are classified or carried forward

