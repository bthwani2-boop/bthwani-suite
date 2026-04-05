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
- evidence artifacts under `kdt/volatile/registry/runs/` owner: phase executor for the current phase

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
