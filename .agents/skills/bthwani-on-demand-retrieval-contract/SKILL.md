---
name: bthwani-on-demand-retrieval-contract
description: Enforce lean scoped retrieval, references, pagination, caching, and deferred detail loading to prevent data/content inflation across BThwani surfaces.
version: 2026.05.21-v1
---

# bthwani-on-demand-retrieval-contract

## Purpose

Prevent inflated data movement and duplicated content across BThwani surfaces. Data should be retrieved only when needed, at the smallest safe scope, while preserving canonical ownership and cross-surface consistency.

## Activation

Use this skill when any task involves:

- catalog, products, stores, favorites, cart, orders, delivery modes, provider data, vars, offers, marketing, subscriptions, loyalty, finance, wallet, ledger, settlement, analytics, operations, control-panel previews, or cross-surface content;
- adding lists, dashboards, cards, tabs, filters, previews, detail screens, or reports;
- changing payload shape, state shape, mocks/fixtures, adapters, API clients, screen props, or shared contracts;
- deciding whether content should be copied to a surface or retrieved on demand.

## Required reading before execution

- `AGENTS.md`
- `.agents/INDEX.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- the relevant adapter under `.agents/adapters/`
- the relevant governance source under `governance/`
- `bthwani-integrated-system-umbrella-contract` when the task crosses surfaces
- one direct domain skill when needed, such as commerce, finance, operations, vars, API, or data-fixture

Do not rely on memory or assumption.

## Retrieval principles

1. Canonical owner first:
   - identify the source of truth before exposing data;
   - do not duplicate canonical data into screens, fixtures, or local state without reason.

2. Lean list, detailed fetch:
   - list views should prefer IDs, labels, compact status, small thumbnails, totals, and short summaries;
   - detail views should fetch full content only when opened or explicitly requested.

3. Scoped payloads:
   - request only the fields needed by the current surface and state;
   - do not push full partner, product, order, catalog, wallet, or operational objects into every surface.

4. Pagination and limits:
   - use pagination, cursor, page size, section loading, or lazy chunks for lists;
   - avoid unbounded arrays and eager loading.

5. References over replication:
   - prefer IDs, foreign keys, slugs, references, version tags, and resolver functions over copied data blobs.

6. Cache consciously:
   - define cache scope, invalidation trigger, TTL when relevant, and stale-state handling;
   - do not create hidden long-lived stale copies.

7. Surface-specific minimal contracts:
   - each surface receives what it needs, not what every other surface needs;
   - shared contracts must be explicit and reviewed.

8. Preview vs runtime truth:
   - distinguish fixture/mock/preview/simulation data from runtime truth;
   - do not allow preview data to become operational truth.

9. Control-panel clarity:
   - control-panel may preview, simulate, approve, or audit, but runtime mutation/provider switching/API/backend work must be explicit scope;
   - Vars/provider controls must show scope and precedence without overloading surfaces with full config.

10. Failure and offline states:
   - define loading, empty, error, disabled, offline, stale, partial, and permission states for retrieval flows.

## Forbidden patterns

- broad eager loading without evidence;
- pushing full data/content to every surface by default;
- duplicating canonical data into multiple local owners;
- storing large repeated objects in screen state when IDs/references are enough;
- hiding API/provider/runtime decisions inside UI-only work;
- creating local mocks that look like runtime truth;
- adding dashboards or cards that require unbounded data scans;
- ignoring pagination, lazy loading, caching, or stale-state handling;
- using copied content instead of canonical references when the data changes over time.

## Steps

1. Identify the data/content domain and canonical owner.
2. Define consuming surfaces and exact states.
3. Classify each required field:
   - list summary
   - detail
   - operational action
   - financial/accounting
   - control-panel preview
   - audit/evidence
   - not needed
4. Define retrieval mode:
   - eager minimal summary
   - lazy detail
   - paginated list
   - cached reference
   - simulated preview
   - audit export
   - blocked/TBD
5. Define invalidation and freshness requirements.
6. Define failure/offline/partial states.
7. Verify no data is duplicated across unrelated surfaces.
8. Verify no local implementation contradicts the integrated system contract.
9. Return `GAP`, `TBD`, or `BLOCKED` where evidence is missing.

## Required output

```text
skill: bthwani-on-demand-retrieval-contract
scope:
governance_sources:
evidence_used:
data_domain:
canonical_owner:
consuming_surfaces:
field_classification:
retrieval_mode:
pagination_or_lazy_loading:
cache_policy:
freshness_and_invalidation:
failure_states:
duplication_risks:
payload_inflation_risks:
forbidden_eager_loading:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```

## Universal BThwani constraints

- Active local repo: `C:\bthwani-suite`.
- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local commands.
- Use `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`; use the safest documented launcher.
- Read `pnpm-workspace.yaml` before choosing active roots.
- `.agents` is operational guidance; `governance/` is project truth and service/application specialization.
- Do not create mirrors, bridges, long copied donor docs, or duplicate skills.
- Do not modify dependencies, lockfiles, CI, secrets, native config, backend/runtime/API, or generated files unless explicitly in scope.
- No `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` claim without Git diff, verification output, and evidence.
- Unknowns must be `TBD`, `UNPROVEN`, or `BLOCKED`.
