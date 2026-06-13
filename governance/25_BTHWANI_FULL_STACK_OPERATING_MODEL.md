# فول ستاك بثواني — BThwani Full-Stack Operating Model

**Status:** Canonical Governance Payload v1
**Owner:** `BThwani Full-Stack Governance`

## Definition

فول ستاك بثواني هو نموذج إغلاق DSH/WLT حسب Capability عبر كل الطبقات والأسطح المرتبطة، وليس حسب تطبيق منفرد.

## Layers

```text
DSH/WLT Backend + PostgreSQL + OpenAPI + Media Runtime + WLT
        ↓
DSH shared contracts/adapters/runtime/view-models/state-machines/policies
        ↓
Role surface controllers
        ↓
app-client / app-partner / app-captain / app-field / control-panel / wlt/frontend/dsh
```

## Current Control Panel Sections

```text
dashboard
operations
support
finance
catalogs
partners
marketing
platform
administration
hr
```

Do not create top-level sections such as `stores`, `products`, `categories`, `media`, `orders`, or `settings` unless a real routing/governance/host migration is approved and implemented.

## Mobile Role Surfaces

- `app-client`: discovery, cart, checkout intent, tracking, support request.
- `app-partner`: store operations, preparation, catalog intents, partner support.
- `app-captain`: assignment, pickup/dropoff, PoD, support, payout read-model.
- `app-field`: onboarding, documents, visits, readiness escalation.
- `control-panel`: current section owners and operational control.
- `wlt/frontend/dsh`: WLT read-model bridge only.

## Capability Closure Rule

One Capability is closed only when the linked backend/API/OpenAPI/shared/control-panel/mobile/WLT/media/evidence entries are either implemented and verified or explicitly classified as not required by the capability map.

## Shared Ownership Rule

`dsh/frontend/shared` may own contracts, adapters, runtime primitives, view-models, state-machines, and policies. It must not own screen logic, route state, preview data, local runtime truth, or WLT money mutation.

## WLT Boundary

WLT owns wallet, ledger, payment, refund, settlement, payout, and reconciliation truth. DSH surfaces may show read-models, references, statuses, and intents only.

## Media Runtime Rule

Runtime media must flow through upload intent, object storage PUT, complete, `dsh_media_assets`, and read/list/link APIs. Fixtures, base64 placeholders, fake storage keys, and fake public URLs are not runtime truth.

## Evidence Rule

No final `CLOSED_WITH_EVIDENCE` is valid without git diff, targeted guards, type/runtime proof where applicable, and visual evidence for UI-visible work.

## Forbidden Split Patterns

- Closing one app surface while shared/control-panel/WLT remain unexamined.
- Duplicating lifecycle/status/API/media/WLT logic inside a role surface.
- Treating dashboard as a mutation or closure owner.
- Treating finance as DSH mutation ownership.
- Treating report-only guards as closure evidence.

## Required Matrices

```text
capability | backend | openapi | shared | control-panel section | client | partner | captain | field | wlt | media | evidence
section | owner | fullStackCapabilities | requiredSurfaces | inputOwnership | runtimeTruth
surface | controller | adapter | route | screen | evidence
```
