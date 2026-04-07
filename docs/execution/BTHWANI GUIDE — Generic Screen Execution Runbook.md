# BTHWANI GUIDE — Generic Screen Execution Runbook

## 1. Purpose

This runbook converts governing law into literal execution grammar for Phases `08` through `18`.

It answers these questions for any service:

- what must be recovered exhaustively from the donor before screen work begins
- which master registries are mandatory before UI work grows
- how surfaces, waves, groups, bundles, and lanes are sequenced
- when `packages/surfaces/` may host registry-only preview work
- when UI Kit may grow from retained screen proof
- how proof is measured without fake completeness

## 2. Scope And Authority

This runbook governs:

- Phase `08` Actor Context Exhaustive Extraction
- Phase `09` Operation Master Extraction
- Phase `10` Surface Coverage And Wave Matrix
- Phase `11` Journey Chain Master
- Phase `12` Screen Master Census And Normalization
- Phase `13` Screen Spec And Purpose System
- Phase `14` Grouping And Build Order
- Phase `15` UI Kit Expansion From Screen Proof
- Phase `16` State Lock
- Phase `17` Screen/API Matrix
- Phase `18` Gap Map

This runbook does not govern:

- bootstrap creation order
- contract detail work before Phase `19`
- generation or binding
- runtime truth or production-like proof

When this runbook and a phase manual overlap:

- this runbook owns the cross-phase execution grammar
- the phase manual owns the literal order inside the current phase

## 3. Non-Negotiable Rules

For Phases `08` through `14`:

- donor recovery is exhaustive for the active service
- the current execution package is untrusted until donor coverage, registry completeness, and handoff integrity are proven
- no phase passes on file existence alone
- no screen may be retained without a traceable operation or journey reason
- no operation may survive without an owner, a classification, and a surface chain
- no preview claim may stand in for completion proof

Use only these unresolved-status labels in this band:

- `BLOCKED`
- `GAP`
- `UNPROVEN`

Do not use `[TBD]` anywhere in this band.

Mark any claim that is not digitally or documentarily proven as `BLOCKED`, `GAP`, or `UNPROVEN`.

## 4. Mandatory Master Artifacts

Before Phase `15` begins, the active service must produce and maintain all of the following:

- `DONOR_EXHAUSTIVE_CENSUS`
- `MASTER_OPERATION_REGISTRY`
- `SURFACE_COVERAGE_MATRIX`
- `SCREEN_WAVE_MATRIX`
- `JOURNEY_MASTER`
- `MASTER_SCREEN_REGISTRY`
- `SCREEN_SPEC_PACKS`
- `OPERATION_TO_SCREEN_CHAIN`
- `SCREEN_GROUPING_PLAN`
- `BUILD_ORDER_PLAN`

If any artifact is missing, stale, or structurally incomplete, the band remains incomplete.

## 5. Exact Entry Rule Before Screen Work Exists

Do not start screen census rows, preview route stubs, preview registries, or screen component work until all of the following are true:

- the first service is formally selected
- actor/context recovery is complete enough to produce `ACTOR_CONTEXT_MASTER`
- operation recovery is complete enough to produce `MASTER_OPERATION_REGISTRY`
- surface classification is complete enough to produce `SURFACE_COVERAGE_MATRIX` and `SCREEN_WAVE_MATRIX`
- the journey chain is complete enough to produce `JOURNEY_MASTER`
- the donor source root is available for the active service

No screen-registry rows, preview route stubs, preview registries, or Expo Go routes may begin before Journey Chain Master.

## 6. Service Wave Model

Use this wave model unless an explicit exception is recorded:

- `Wave 0` = service truth recovery only
- `Wave 1` = the surface that starts the primary job
- `Wave 2` = the surface that receives the immediate lifecycle handoff
- `Wave 3` = the surface that continues execution or fulfillment
- `Wave 4` = `control-panel` oversight, intervention, and governance
- `Wave 5` = tracking and status reflection surfaces
- `Wave 6` = issue, support, and recovery surfaces
- `Wave 7` = optional or administrative surfaces

Rules:

- do not open all waves together
- do not start a downstream wave while an upstream wave still has unresolved blockers on the primary path
- `Wave 0` is truth recovery only; it is not a visual preview wave

## 7. Screen Group Model

Use these canonical screen groups unless a governed exception is recorded:

- `entry-discovery`
- `core-task`
- `queue-inbox`
- `tracking-status`
- `issue-recovery`
- `staff-control`
- `secondary-optional`

Rules:

- every active surface must explicitly record which groups exist and which are absent
- do not begin `secondary-optional` before `entry-discovery` or `core-task` is stable
- do not let donor route names define the group model

## 8. Dependency Lane Model

Each retained screen group must belong to one dependency lane:

- `entry-lane`
- `transaction-lane`
- `execution-lane`
- `oversight-lane`
- `recovery-lane`
- `optional-lane`

Rules:

- a screen may appear in one lane only
- the lane must match the owning operation and journey role
- dependency cycles must be broken before build order is approved

## 9. App-Shell And Preview Rule

An app shell may be prepared only when:

- bootstrap is complete
- the surface is classified as `REQUIRED` or `OPTIONAL`
- Phase `10` has classified the surface explicitly

Allowed shell contents during Phases `08` through `18`:

- app root
- navigation container
- theme and direction wiring
- preview route stubs explicitly marked as preview-only and unbound
- fixtures-only preview consumption

Forbidden shell contents during Phases `08` through `18`:

- bound business logic on canonical paths
- generated client use on canonical paths
- runtime truth access
- production-like claims

Browseability does not upgrade proof level.

## 10. packages/surfaces Entry Rule

Do not ingest current-service screen material into `packages/surfaces/` until all of the following are true:

- Journey Chain Master is complete for the active branch
- the active surface wave is explicit in `SCREEN_WAVE_MATRIX`
- the donor screen census is complete enough to populate `MASTER_SCREEN_REGISTRY`
- UI Kit Foundation Compatibility Review is `PASS` or bounded `PARTIAL`
- the thin app shell exists when preview navigation is needed

The first lawful ingress is always:

- registry-first
- fixtures-first
- preview-only
- unbound

## 11. UI Kit Rules

Before the first retained screen enters `packages/surfaces/`, run a UI Kit Foundation Compatibility Review.

Check at least:

- token completeness
- typography consistency
- spacing consistency
- direction correctness
- primitive API clarity
- state-shell completeness
- export cleanliness
- naming clarity
- absence of service-specific widgets
- absence of business logic in UI Kit

After Phase `14`, UI Kit may grow only from retained screen proof and approved build order.

## 12. Transition Rules

### Group To Group

Do not move to the next screen group until the current group has:

- complete donor coverage for the current wave
- complete retained-screen specs for the current group
- required states identified
- blockers recorded explicitly

### Surface To Surface

Do not move to the next surface until the current surface has:

- explicit journey coverage
- complete retained-screen census for the active scope
- no unresolved primary-path blocker being pushed downstream

### Wave To Wave

Do not unlock the next wave until the current wave has:

- explicit grouping and build order
- no unresolved blocker on the primary path
- no control or tracking screen standing in for undefined upstream task screens
- gate approval in the post-bootstrap gate pack

### Preview To Limited-API Preview

Limited-API preview is optional and never the default.

It is allowed only when:

- fixtures cannot adequately test a concrete aggregation or interaction risk
- the Screen/API Matrix exposes a concrete contract pressure
- the preview scope is bounded explicitly
- no one is claiming binding or runtime proof from the preview

## 13. Phase Emphasis

Use these emphases while executing the band:

- Phase `08`: recover actors, contexts, entitlements, visibility scopes, and exclusions exhaustively
- Phase `09`: recover and normalize the full operation universe into `MASTER_OPERATION_REGISTRY`
- Phase `10`: map all canonical operations to surfaces and waves; do not guess the wave order later
- Phase `11`: write the full journey chain before opening screen census work
- Phase `12`: complete the master screen census and normalize every unit before spec work begins
- Phase `13`: write one executable screen spec per retained screen and complete `OPERATION_TO_SCREEN_CHAIN`
- Phase `14`: produce the exact grouping, bundle, build, validation, and seal order before UI Kit expansion
- Phase `15`: grow UI Kit only from retained screen evidence
- Phase `16`: complete state coverage from real screen specs and build order
- Phase `17`: let retained screens define API demand
- Phase `18`: convert API demand into explicit contract gaps

## 14. Proof Standard

Every phase in this band must record and verify:

- completeness counts
- duplicate checks
- orphan checks
- unmapped checks
- contradiction checks
- donor-coverage checks
- handoff-integrity checks

If a phase cannot prove those checks, it does not pass.

## 15. Required Outputs Across Phases 08 Through 18

At minimum, the execution stack across this band must produce:

- updated service packs under `kdt/factory/<service>/`
- exports for every master registry or matrix
- updated phase indexes
- explicit target-fit notes
- evidence references for every gate claim

Existing early packs built on the weaker model are migration inputs only.
Do not treat them as current completion proof until they are rebuilt or re-accepted under the new rules.