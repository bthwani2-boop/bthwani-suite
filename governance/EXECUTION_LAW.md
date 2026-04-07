# EXECUTION_LAW

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 01 - Governance Freeze`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 01 active`
- BlockingGaps: `Later-phase artifacts are not unlocked`
- NextAllowed: `Phase-correct progression only`

## Execution Law

Work in `bthwani-suite` must proceed phase-by-phase, evidence-backed, and target-first.

## Explicit Prohibitions

- no binding-first rebuild
- no runtime-first rebuild
- no API-first rebuild
- no full-stack-first rebuild
- no big-bang multi-service start
- no donor-copy-first rebuild
- no generated-layer-first execution

## Required Order Bias

- governance before broad structure
- structure before implementation
- service truth before screens
- screens and flows before contract finalization
- contract finalization before generation
- generation before binding
- binding before runtime proof
- runtime proof before final seal

## Controlled Parallelism Rule

Before the first service is sealed with evidence:

- one primary service only
- ui-kit growth only when demanded by that service
- shared package or shared service work only when it unblocks that service

## Runtime Law

- minimal necessary runtime only
- no runtime stack during bootstrap phases 00-07
- no production-like proof before the later runtime and verification phases

## Workspace Tooling And Install Law

- root `package.json` and root `pnpm-lock.yaml` are the canonical home for workspace toolchain truth
- the governed workspace toolchain versions are `node`, `pnpm`, `nx`, and `typescript`
- installs that change the workspace dependency graph must start from the repo root only
- app roots and package roots are not canonical install roots for workspace graph changes
- local `node_modules/` folders under apps or packages are workspace install artifacts, not separate ownership truth
- no app or package may silently redefine the canonical workspace toolchain version policy

## Mobile Toolchain Ownership Law

- the current mobile app roots are shell packages, not standalone Expo ownership roots
- no app root may become the canonical install or run root for Expo or React Native by convenience
- Expo Go legality in screen phases governs preview timing only; it does not grant app-local ownership of installs or runtime tooling
- until a lawful mobile runtime phase explicitly opens, do not add ad hoc Expo install or run workflows under app roots as if they were canonical
- when lawful mobile execution opens later, the canonical run entrypoints must be repo-root owned commands, targets, or governed scripts first
- during bootstrap and shell-first phases, `react`, `react-native`, and `expo` may appear as support dependencies in leaf apps or packages where technically required, but no leaf app or leaf package may define or redefine the canonical workspace version policy for them
- no app or package may act as an independent authority for `react`, `react-native`, or `expo`
- no app-local upgrade, downgrade, or SDK transition is allowed as a sovereignty decision
- canonical version truth for `react`, `react-native`, and `expo` must remain workspace-governed and approval-driven
- app-level divergence is forbidden unless an explicit approved exception is recorded in repo governance

## Phase Gate Law

No phase passes on file existence alone.

A phase passes only when:

- required repo artifacts exist
- required evidence artifacts exist
- artifacts contain usable content
- artifacts are coherent with adjacent governance artifacts
- forbidden early work has not started
