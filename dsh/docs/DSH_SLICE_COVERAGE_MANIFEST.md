# DSH Slice Coverage Manifest

Status: ACTIVE_SLICE_COVERAGE_PROTOCOL
Decision: MANIFEST_REQUIRED_BEFORE_SLICE_CLOSURE

Purpose:
Permanent DSH closure-governance protocol for preventing forgotten surfaces, screens, routes, CTAs, states, operations, permissions, WLT boundaries, or control-panel entries.

## Slice Definition

A DSH slice is not a single screen. A slice is:

```text
Actor + Goal + Surface group + Operation + Evidence
```

Every slice manifest is an official closure inventory. Raw screenshots, logs, command outputs, and zip bundles stay under `tools/registry/runs/<SESSION_ID>/`.

## Canonical Source Order

Read sources in this order before creating or changing any slice manifest:

1. `dsh/SERVICE_BLUEPRINT.md`
2. screen registries under `dsh/frontend/app-*/`
3. route registries under `dsh/frontend/app-*/`
4. `dsh/frontend/shared/dsh-flow-registry.ts`
5. `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts`
6. control-panel registries under `dsh/frontend/control-panel/**`
7. `dsh/docs/DSH_VISUAL_REVIEW.md`
8. `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
9. `dsh/docs/SCREEN_API_MATRIX.md`
10. `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
11. `dsh/dsh.openapi.yaml`, typed-client, binding, and runtime evidence only when the earlier rows allow it

## Required Slice Sections

Every file under `dsh/docs/slices/` must contain:

- `Identity`
- `Scope`
- `Coverage Matrix`
- `CTA Matrix`
- `State Matrix`
- `Cross-Surface Impact`
- `Evidence and Gates`
- `Decision`

## Required Row Fields

Every coverage row must resolve these fields:

```text
Slice ID
Service
Business Domain
Actor
Surface
Route
Screen Owner
Primary Action
Secondary Actions
CTA List
Navigation Target
Required States
Control Panel Entry
Auth/Permission
WLT Boundary
Vars/Provider Dependency
Search Dependency
Notification Dependency
Account/Profile Dependency
API Candidate
Binding Status
Runtime Status
Visual Evidence
Git Evidence
Typecheck Evidence
Regression Evidence
Decision
```

## Manifest Decision Vocabulary

Slice manifests must use only these decision values:

```text
PASS
FIX_REQUIRED
BLOCKED_WITH_REASON
NOT_APPLICABLE_WITH_REASON
DEFERRED_WITH_REASON
TBD_NOT_ALLOWED_AT_CLOSURE
```

Live matrices may still contain values such as `needs-visual-evidence`, `blocked-by-wlt`, `UI_PREVIEW_ONLY`, `NOT_READY_FOR_API`, or `RUNTIME_UNPROVEN`. Slice manifests may quote those values as source truth, but the manifest decision fields must use the vocabulary above.

## No-Orphan Rules

- No surface without a route.
- No route without an owner.
- No screen without a primary action.
- No CTA without a navigation target.
- No required state without a visual-review reference.
- No dependency without an owner classification.
- No finance row without WLT classification.
- No API candidate without a linked screen or flow reason.
- No runtime claim without request, response, log, and screen-state evidence.
- No operational side effect without a control-panel/audit classification.

## Incomplete Slice Rules

A slice is incomplete if:

- any required section is missing,
- any mandatory field is blank,
- any closure field contains a bare unresolved placeholder,
- any CTA lacks target or precondition,
- any required state lacks visual-review reference,
- any cross-surface dependency is mentioned without decision status,
- any WLT/Auth/Search/Notification/Vars impact is omitted or left unclassified,
- any linked UI/API/runtime matrix contradicts the slice decision.

## Slice Close Rule

A slice may not close unless all required rows are resolved, every required state is represented, every CTA is mapped, cross-surface dependencies are resolved or explicitly blocked with reason, visual-review links exist, and the linked UI/API/runtime docs support the same decision.

The service-wide DSH decision remains governed by `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`, `dsh/docs/SCREEN_API_MATRIX.md`, `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`, and `dsh/docs/DSH_VISUAL_REVIEW.md`. Slice manifests prove coverage completeness; they do not promote preview/local data to runtime truth.
