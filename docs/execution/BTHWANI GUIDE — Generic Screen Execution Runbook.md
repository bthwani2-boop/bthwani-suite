# BTHWANI GUIDE — Generic Screen Execution Runbook

## 1. Purpose

This runbook converts the governing law into literal execution grammar for Phases `08` through `18`.

It answers these questions generically for any service:

- what opens first after bootstrap
- how surfaces are sequenced
- how screen groups are sequenced
- when `packages/surfaces/` begins
- when preview and Expo Go begin
- how UI Kit is tested before screen ingestion
- how a team moves from one surface or wave to the next

## 2. Scope And Authority

This runbook governs:

- Phase `08` Actor/Context Lock
- Phase `09` Operation Lock
- Phase `10` Surface Responsibility Lock
- Phase `11` Journey Lock
- Phase `12` Screen Inventory And Rationalization
- Phase `13` Screen Purpose Lock
- Phase `14` Flow Compression
- Phase `15` UI Kit Expansion From Real Screens
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

## 3. Preconditions Before Screen Work Exists

Do not start candidate-screen work until all of the following are true:

- the first service is formally selected
- actor participation is explicit enough to support operation design
- operation ownership is explicit
- surface classification is explicit for the current operation wave
- the relevant journey branch is locked
- the current surface wave is declared
- the UI Kit foundation can be reviewed for compatibility

No candidate screens, preview routes, preview registries, or Expo Go routes may begin before Journey Lock.

## 4. Generic Service Wave Model

Use this wave model across services unless a governed exception is recorded.

- `Wave 0` = service truth, actors, operations, surfaces, and journeys
- `Wave 1` = the surface that starts the primary job
- `Wave 2` = the surface that receives the direct next lifecycle handoff
- `Wave 3` = the surface that continues execution or fulfillment
- `Wave 4` = `control-panel` oversight, intervention, and governance views
- `Wave 5` = tracking, reflection, and status surfaces
- `Wave 6` = issue, support, and recovery surfaces
- `Wave 7` = optional, secondary, or administrative surfaces

Rules:

- do not open all waves together
- do not start a downstream wave while the upstream wave still lacks purpose clarity
- treat `Wave 0` as prerequisite truth, not as a visual wave

## 5. Surface Activation Order

The default activation order is:

1. the surface that starts the primary job
2. the surface that receives the immediate next lifecycle handoff
3. the surface that continues execution or fulfillment
4. `control-panel` for monitoring, intervention, and governance
5. optional surfaces such as `app-field`, `webapp`, or `website` only after the core lifecycle surfaces are no longer blocked by undefined purpose

Rules:

- do not start with `control-panel` merely because it is easier to mock
- do not open optional surfaces while the core lifecycle surfaces still lack minimum clarity
- do not hide unresolved lifecycle ownership by opening every surface at once

## 6. Generic Screen Group Model

Use the same generic screen-group system across services unless a governed exception is recorded.

- `entry-discovery`
- `core-task`
- `queue-inbox`
- `tracking-status`
- `issue-recovery`
- `staff-control`
- `secondary-optional`

These mean:

- `entry-discovery` = entry, chooser, search, discovery, and first-intent screens
- `core-task` = create, edit, form, detail, action, review, and confirm screens tied to the primary job
- `queue-inbox` = boards, queues, inboxes, and worklists
- `tracking-status` = progress, timeline, reflection, and terminal-state screens
- `issue-recovery` = retry, recovery, support, and exception paths
- `staff-control` = monitoring, intervention, assignment, and internal control screens
- `secondary-optional` = settings, low-priority secondary paths, and optional supporting surfaces

Rules:

- not every service must use every group
- if a group is absent, record it explicitly
- do not begin with `secondary-optional` while `entry-discovery` or `core-task` is undefined

## 7. Screen Implementation Ladder Inside A Surface

Build screen groups in this general order:

1. entry or discovery screens
2. list, queue, or inbox screens
3. detail, form, or action workspace screens
4. review or confirm screens
5. lightweight completion or terminal-reflection screens
6. tracking or status screens
7. issue or recovery screens
8. internal or staff support screens

If the service has no true discovery step, start with the first `core-task` screens.

## 8. App-Shell Creation Rule

An app shell is lawfully used only when:

- bootstrap is complete
- the relevant surface is `REQUIRED` or `OPTIONAL`
- Phase `10` has classified the surface explicitly

Allowed app-shell contents during Phases `08` through `18`:

- app root
- navigation container
- theme and direction wiring
- preview route placeholders
- fixtures-only preview consumption

Forbidden app-shell contents during Phases `08` through `18`:

- canonical bound business logic
- generated client use on canonical paths
- runtime truth access
- production-like claims

## 9. UI Kit Foundation Compatibility Gate

Before the first screen enters `packages/surfaces/`, run a UI Kit Foundation Compatibility Review.

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

Decision meanings:

- `PASS` = screen ingestion may begin
- `PARTIAL` = screen ingestion may begin only with explicit limits and blockers recorded
- `FAIL` = screen ingestion may not begin

## 10. UI Kit Expansion Review Rule

After each meaningful screen-group expansion, rerun UI Kit review.

The review must confirm:

- shared patterns were added because real screens proved demand
- no duplicate primitive family was introduced
- no service-specific leakage entered `packages/ui-kit/`
- no temporary preview workaround was promoted into shared law
- direction handling remained correct after expansion

## 11. packages/surfaces Entry Rule

Do not begin real screen ingestion into `packages/surfaces/` until all of the following are true:

- the current service is formally selected
- the target surface is `REQUIRED` or `OPTIONAL`
- Journey Lock is complete for the branch being opened
- current candidate screens are identified for the active surface wave
- UI Kit Foundation Compatibility Review is `PASS` or bounded `PARTIAL`
- the thin app shell exists if preview navigation is required on that surface

The first lawful ingress is always:

- candidate screens first
- preview routes first
- fixtures-only first
- no bound logic
- no runtime truth

## 12. Screen Group Directory Pattern

Inside `packages/surfaces/`, group work by service, then by surface, then by screen group.

Canonical pattern:

```text
packages/surfaces/src/<service>/<surface>/
  entry-discovery/
  core-task/
  queue-inbox/
  tracking-status/
  issue-recovery/
  staff-control/
  secondary-optional/
```

Concrete screens should then live below the group root with local fixture support when needed.

Rules:

- do not mirror donor route trees blindly
- do not flatten all screens under one surface root once the screen count grows beyond trivial preview scope
- do not let random route names define the first organizational layer

## 13. Preview Registry And Fixture Rule

For preview-stage work in Phases `12` through `18`:

- register candidate screens before building broad component trees
- create preview routes before adding binding
- keep the default truth source as fixtures only

Fixtures are allowed to support:

- layout review
- CTA review
- state presentation
- navigation review
- screen-family rationalization

Fixtures are not allowed to act as:

- canonical business truth
- runtime truth
- proof of end-to-end correctness

## 14. Expo Go Activation Rule

Do not start Expo Go preview just because a mobile shell exists.

Expo Go preview becomes lawful only when:

- the service is selected
- the surface is classified as `REQUIRED` or `OPTIONAL`
- Journey Lock is complete for the active branch
- candidate screens are identified for the current wave
- UI Kit Foundation Compatibility Review is `PASS` or bounded `PARTIAL`
- the thin mobile shell exists

Open in Expo Go first:

- preview routes
- fixtures-only candidate screens
- state-preview paths

Do not open as Expo Go proof:

- bound operation paths
- runtime-truth paths
- production-like claims

## 15. Transition Rule: Screen Group To Screen Group

Do not move to the next screen group until all of the following are true for the current group:

- candidate list is complete enough for the current surface wave
- the current group has rationalization decisions
- purpose and CTA ambiguity are reduced enough to continue
- required state shells are at least known
- any UI Kit blocker discovered by the current group is recorded

If these are not true, remain on the current group rather than opening the next group prematurely.

## 16. Transition Rule: Surface To Surface

Do not move to the next surface in the current operation wave until all of the following are true for the current surface:

- primary flow is clear
- candidate screens are identified
- minimum state coverage is defined
- shared UI Kit gaps are documented
- screen purpose is not blocked by unresolved ambiguity

If these are not true, stay on the current surface.

## 17. Transition Rule: Wave To Wave

Do not unlock the next wave until:

- the current wave has explicit screen-group order
- the current wave has no unresolved blocker on the primary path
- required control or tracking screens are not standing in for undefined upstream task screens
- the post-bootstrap gate pack says the next wave is lawful

## 18. Transition Rule: Preview To Limited-API Preview

Limited-API preview is optional and never the default.

It is allowed only when:

- fixtures cannot adequately test a screen-level aggregation or interaction risk
- the Screen/API Matrix has begun to expose a concrete contract pressure
- the preview scope is explicitly bounded
- no one is claiming binding or runtime proof from the preview

If those conditions do not exist, remain fixtures-only.

## 19. Transition Rule: Limited-API Preview To Binding Handoff

Do not treat limited-api preview as permission to bind.

Binding handoff becomes lawful only after:

- Gap Map exists
- contract demand is explicit
- contract work is ready to begin in Phase `19`
- the post-bootstrap gate pack marks contract readiness as passed

## 20. Phase-Specific Execution Emphasis

Use these emphases while executing the current band:

- Phase `08`: actor visibility and exclusions must become explicit
- Phase `09`: operations must stabilize before screen growth
- Phase `10`: surface classification and wave order must stabilize before Journey Lock
- Phase `11`: journey branches must stabilize before preview work
- Phase `12`: candidate-screen inventory, grouping, and UI Kit compatibility gate open the lawful preview layer
- Phase `13`: purpose, CTA, entry, exit, and required states turn retained candidates into governed screens
- Phase `14`: route compression removes donor sprawl before expansion
- Phase `15`: UI Kit grows only from retained screen evidence
- Phase `16`: state coverage becomes complete enough for contract pressure analysis
- Phase `17`: screens define API demand
- Phase `18`: gaps become explicit contract work inputs

## 21. Required Outputs Across Phases 08 Through 18

At minimum, the execution stack across this band must produce:

- updated service packs under `kdt/factory/<service>/`
- exports when the phase uses CSV or machine-readable structure
- updated phase indexes
- explicit target-fit notes
- evidence references for any gate claim

Existing early DSH packs may use thinner file sets.
When revisiting them, extend in place rather than renaming blindly unless a deliberate migration is being executed.