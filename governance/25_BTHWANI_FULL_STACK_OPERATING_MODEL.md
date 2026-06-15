# فول ستاك بثواني — BThwani Full-Stack Operating Model

**Status:** Canonical Governance Payload v2
**Owner:** `BThwani Full-Stack Governance`

## Definition

فول ستاك بثواني هو نموذج إغلاق DSH/WLT حسب Capability عبر كل الطبقات والأسطح المرتبطة، وليس حسب تطبيق منفرد.

**Full-stack موحد لا يعني تطبيقًا واحدًا.**

Full-stack موحد يعني:

```text
Separate UI Shells + Unified Topic-first Full-stack Shared Engine
```

- `dsh/frontend/shared` = Unified Topic-first Full-stack Shared Engine لـ DSH.
- `wlt/frontend/dsh/shared` = Unified Topic-first Finance Engine لـ WLT.
- `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel` = UI-only shells.
- لا يجوز أن يمتلك أي shell منطقًا تشغيليًا أو مالية أو media runtime.

## Layers

```text
DSH/WLT Backend + PostgreSQL + OpenAPI + Media Runtime + WLT
        ↓
dsh/frontend/shared  (Unified Topic-first Shared Engine)
wlt/frontend/dsh/shared  (Unified Topic-first Finance Engine)
        ↓
Surface composition hooks (re-export/orchestration only)
        ↓
app-client / app-partner / app-captain / app-field / control-panel / wlt/frontend/dsh  (UI-only shells)
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

## Topic-first Shared Engine Rule

`dsh/frontend/shared` is organized by topic, not by layer. Each topic is a self-contained full-stack unit owning its types, contracts, API adapters, view-models, policies, and runtime hooks. It may not own screen logic, route state, preview data, local runtime truth, or WLT money mutation.

`wlt/frontend/dsh/shared` is organized by finance topic (wallet, payments, refunds, settlements, payouts, commissions, ledger, reconciliation). It must not allow finance mutations to bleed into DSH shared or into app shells.

A topic index (`topic/index.ts`) must export all of: types, contracts, adapters, view-models, policies. A topic index that only exports contracts or presentation artifacts is incomplete.

## Shared Ownership Rule

`dsh/frontend/shared` may own contracts, adapters, runtime primitives, view-models, state-machines, and policies. It must not own screen logic, route state, preview data, local runtime truth, or WLT money mutation.

## WLT Boundary

WLT owns wallet, ledger, payment, refund, settlement, payout, and reconciliation truth. DSH surfaces may show read-models, references, statuses, and intents only.

## Media Runtime Rule

Runtime media must flow through upload intent, object storage PUT, complete, `dsh_media_assets`, and read/list/link APIs. Fixtures, base64 placeholders, fake storage keys, and fake public URLs are not runtime truth.

## Evidence Rule

No final `CLOSED_WITH_EVIDENCE` is valid without git diff, targeted guards, type/runtime proof where applicable, and visual evidence for UI-visible work.

## Forbidden Patterns

### Split Patterns

- Closing one app surface while shared/control-panel/WLT remain unexamined.
- Duplicating lifecycle/status/API/media/WLT logic inside a role surface.
- Treating dashboard as a mutation or closure owner.
- Treating finance as DSH mutation ownership.
- Treating report-only guards as closure evidence.

### God Hook Prohibition

- No hook inside `dsh/frontend/shared` may compose more than one topic's full state.
- A surface model inside shared must be an orchestration-only composition of topic models; it must not contain inline business logic.
- Surface models that aggregate home + store + checkout + orders + marketing + notifications + actions into one hook are God Hooks and are forbidden.
- Split rule: `surface.composition.ts` = orchestration only; `topic.model.ts` = topic logic.

### Shell Prohibition

- No `app-*/`, `control-panel/`, or `wlt/frontend/dsh/` root may import runtime clients, finance adapters, lifecycle managers, media upload logic, API fetch wrappers, or WLT mutation logic directly.
- No `app-*/`, `control-panel/`, or `wlt/frontend/dsh/` root may hold local runtime truth: local draft stores that are treated as backend state, Date.now ID generation for backend entities, or local mutation queues not backed by an API.
- No `shared` module may import from an app shell, a control-panel module, or any route-bound file.

### Runtime and Finance Prohibition

- No fallback/demo/mock/preview runtime values in non-test files.
- No `Math.random` or `Date.now` as backend entity ID sources.
- No silent `catch` that swallows errors without logging or escalating.
- No WLT finance logic (mutations, ledger entries, payment deep links) outside `wlt/frontend/dsh/shared`.
- No WLT OpenAPI types emitted outside `wlt/frontend/dsh/shared/contracts/openapi/`.
- No runtime call to any API with an empty or unchecked required ID parameter.

### Control Panel Prohibition

- `control-panel/` is a UI-only shell. It must not own status maps, risk labels, domain records, KPI logic, or local apply/rollback/mark-contract-ready mutations.
- All platform-var apply/rollback/mark-contract-ready logic must live in `shared/platform/` backed by an API or disabled-by-policy. Local apply without API backing is forbidden.
- No control-panel file may hold arrays or maps of operational domain data — those belong in `shared/platform/` or governance constants.

## Required Matrices

```text
capability | backend | openapi | shared | control-panel section | client | partner | captain | field | wlt | media | evidence
section | owner | fullStackCapabilities | requiredSurfaces | inputOwnership | runtimeTruth
surface | controller | adapter | route | screen | evidence
```
