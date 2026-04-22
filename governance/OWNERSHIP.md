# OWNERSHIP

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 01 - Governance Freeze`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 01 active`
- BlockingGaps: `Human team roster is not recorded yet`
- NextAllowed: `Use role ownership until a maintainer roster is added later`

## Ownership Model

Ownership is explicit by domain and decision right.
Until a human maintainer roster is recorded, the repo uses single-role ownership by artifact boundary.

## Surface Owned vs Service Owned Rule

The default home for reusable app-wide truth is `surface-owned`.
A `service-owned` counterpart is allowed only when the item carries service-specific data, rules, permissions, states, flows, or behavior that cannot be generalized without duplication, noise, or ownership breakage.

### Use `surface-owned` when

- the item is valid across more than one service as-is
- the item does not depend on service-specific data
- the item does not enforce service-specific rules
- the item does not change behavior by service
- the item acts as an app shell, app entry, global hub, global account, global notifications, global settings, or global support surface

### Use `service-owned` when

- the item is tied to one or more services in a specific way
- the item reads or writes service data
- the item applies service-specific rules or permissions
- the item has service-specific operational states
- the item includes a flow, behavior, or interface that has no meaning outside that service
- the item's shape, logic, or states differ from one service to another

### Fast decision test

- If every service were removed, would this item still have a meaningful app-wide purpose? If yes, keep it in `surface-owned`.
- Does the item change materially by service? If yes, place it in `service-owned`.
- Does the item own service data, rules, or states? If yes, place it in `service-owned`.

### Global boundary rule

`surface-owned` may host a global entry point, global aggregation, badge/count, or navigation handoff toward a service-specific feature.
It may not own the service screen itself, its data, its flow, or its service-specific behavior.

## Canonical Ownership Boundaries

- `governance/` owner: repo governance owner
- `docs/bootstrap/` owner: repo governance owner
- `docs/00_REPO_RESET_DECISION.md` and `docs/01_DONOR_REPO_POLICY.md` owner: repo governance owner
- `packages/ui-kit/` owner: ui-kit owner
- `contracts/master/` owner: contract owner
- `services/<service>/` owner: service owner for that service
- service documentation under `docs/services/<service>/` owner: the same service owner for that service
- screen truth owner: the owning service, not the surface app shell
- app surface shell owner: surface delivery owner, with no authority to redefine service truth
- `runtime/` owner when introduced later: runtime owner
- evidence artifacts under `tools/registry/runs/` owner: phase executor for the current phase

## Required Domain Owners

### Repo governance owner

Owns:

- bootstrap phase order
- governance files
- repo boundary rules
- evidence rules
- change-entry rules
- move-don't-delete enforcement

May decide:

- whether a bootstrap artifact is phase-correct
- whether a change violates repo law
- whether later phases are allowed to start

May not decide:

- service-specific operational truth on behalf of a service owner once that owner is defined

### UI Kit owner

Owns:

- shared tokens
- shared typography
- spacing
- colors
- direction handling
- primitives
- shared state shells

May decide:

- reusable shared foundation patterns

May not decide:

- service-specific patterns as shared law without proof from real screens
- service operations or service contracts

### Contract owner

Owns:

- canonical contract law in `contracts/master/`
- schema shape governance
- operation naming consistency
- error shape consistency

May decide:

- contract structure after UX demand is proven

May not decide:

- screen-first behavior without service and UX evidence
- runtime ownership

### Service owner

Owns:

- service profile
- actors
- operations
- state effects
- surface classification for that service
- service-specific non-goals

May decide:

- what belongs to the service
- what does not belong to the service

May not decide:

- shared package law outside its boundary
- global naming law for all services

### Surface delivery owner

Owns:

- delivery shell implementation inside the relevant app surface
- lawful rendering of approved service truth

May not decide:

- service ownership
- contract law
- runtime truth

### Runtime owner

Owns:

- runtime truth source wiring
- seed/demo boundaries
- provider switching behavior when later introduced
- local stack policy when runtime is unlocked later

May not decide:

- service scope
- screen purpose
- contract ownership

## Workspace Boundary Clarification

Use the current workspace roots with explicit owner intent.

- `apps/mobile/*` and `apps/web/*` own thin surface-shell delivery only
- `packages/surfaces/` owns shared surface registries and shared surface-facing exports
- `packages/ui-kit/` owns shared UI foundation and its public reusable contract
- `services/*` own service and backend truth only
- `contracts/master/` owns canonical contract truth only

This means:

- app shells may contain navigation, route registration, provider wiring, preview-route placeholders, and other surface-local delivery code only
- app shells may not absorb reusable surface logic, service truth, contract truth, generated truth, or runtime truth locally
- `packages/surfaces/` may not import from `apps/*` or become a hidden runtime or contract owner
- `packages/ui-kit/` must remain service-clean and may not absorb service truth, screen truth, or route-aware behavior as shared law
- `services/*` must remain UI-free and may not import from app shells, `packages/surfaces/`, or `packages/ui-kit/`
- `contracts/master/` may not be redefined by app-local files, package-local side contracts, or service-local canonical API copies

If one file mixes shell delivery, shared surface logic, service truth, or contract truth, split it by owner instead of keeping mixed ownership.

## Shared Package Consumption Rule

Consumers must use shared packages through their approved public contract.

Rules:

- code outside `packages/ui-kit/` must consume UI Kit through `@bthwani/ui-kit`, not internal subpaths
- code outside `packages/surfaces/` must consume surfaces through `@bthwani/surfaces`, not internal subpaths
- package-local relative imports inside the owning package remain allowed
- if a consumer needs a symbol that is not public yet, promote it through the package root first instead of reaching into internals
- thin app shells must consume shared package exports without redefining or bypassing their package-level ownership boundary

## Conflict Resolution Rule

If ownership conflicts arise, resolve them in this order:

1. repo governance owner for phase legality
2. service owner for service truth
3. contract owner for contract law
4. ui-kit owner for shared design system law
5. runtime owner for runtime truth behavior
6. surface delivery owner for thin delivery implementation

## Current Status

- role ownership is explicit
- human assignee roster is `[TBD]`
- no implementation owners are allowed to bypass governance phase order

