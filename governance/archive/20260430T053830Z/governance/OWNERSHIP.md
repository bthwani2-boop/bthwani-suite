# Ownership Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: repository ownership, service-owned boundaries, surface-owned boundaries, apps, ui-kit, contracts, and evidence roots

## 1. Purpose

Ownership prevents duplication, drift, random imports, and unclear responsibility.

Every file must have an owner by path, role, or explicit policy.

## 2. Canonical ownership map

| Area | Owner |
|---|---|
| `governance/` | Governance |
| `docs/governance/` | Legacy/transitional until deletion |
| `tools/guards/` | Governance guard system |
| `tools/registry/runs/` | Evidence registry |
| `packages/ui-kit/` | UI system |
| `packages/surfaces/src/public/` | Public surface contracts |
| `packages/surfaces/src/service-owned/<service>/` | Service owner |
| `packages/surfaces/src/surface-owned/` | Surface owner |
| `packages/app-shells/` | App-shell runtime wiring |
| `apps/` | App runtime/build host |

## 3. Service-owned rule

Service-owned paths own service-specific behavior, flow, screens, state, and service blueprint.

They must not own:

- generic design primitives
- random headers/buttons/cards
- app-shell runtime infrastructure
- unrelated surface-global concerns
- public contract truth outside public exports

## 4. Surface-owned rule

Surface-owned paths own general experience for a surface.

Examples:

- surface account shell
- global notification experience
- navigation composition
- surface-level entry points

Surface-owned code must not become a dumping ground for service internals.

## 5. UI-kit ownership

`@bthwani/ui-kit` owns reusable UI foundations, primitives, tokens, variants, and public UI contracts.

Rules:

- Tamagui is internal to ui-kit
- screens/surfaces/apps use public ui-kit exports only
- no local design system outside ui-kit
- no random color systems outside approved tokens

## 6. Public contract ownership

Public exports define allowed cross-boundary access.

Deep imports across service/surface/app boundaries are not allowed unless explicitly approved and tracked.

## 7. App-shell ownership

App-shells own runtime hosting and wiring.

They do not own:

- service truth
- reusable UI primitives
- API contracts
- governance decisions
- duplicated business logic

## 8. Evidence ownership

Evidence belongs in:

```text
tools/registry/runs/<SESSION_ID>/
```

Every evidence run should include a handoff zip.

## 9. Ownership conflict resolution

When ownership is unclear:

1. preserve current behavior
2. classify current owner
3. classify intended owner
4. create evidence
5. migrate only when safe
6. keep rollback path

No migration by assumption.
