# LEGACY_SCREEN_TO_UI_KIT_CANONICALIZATION_SPEC

## Repository Governance Header

- Progress: Neutral - analysis and canonicalization specification only
- Phase: P50_SHELLS_SURFACES
- Gate: GATE_SCREENS_UIKIT_AND_RULES_VALIDATION
- BlockingGaps: LEGACY_PHASE_GATE_DRIFT; CANONICAL_P50_EVIDENCE_REQUIRED
- NextAllowed: no

## Steward Task Header

- WorkMode: TARGET-FIT MODE + SOURCE-TO-TARGET MODE + CLEAN EXPORT MODE
- TargetService: app-client mobile home/services surface
- RequestType: ui_pattern_extract
- SourcePolicy: frozen-donor analysis only, no blind transplant, no legacy copy-through
- TargetRepo: C:/Users/b/Documents/GitHub/bthwani-suite
- PackStatus: Partially ready (spec complete, implementation intentionally not started)
- BlockingGaps: LEGACY_SCREEN_PATH was provided as placeholder and was resolved from evidence
- NextAllowed: no

## Request Intake Resolution

- Input LEGACY_SCREEN_PATH value: placeholder only
- Resolved donor paths used for this spec:
  - C:/Users/b/Documents/GitHub/bthfinal/packages/surfaces/src/mobile/app-user/UserMobileSurface.tsx
  - C:/Users/b/Documents/GitHub/bthfinal/packages/surfaces/src/mobile/app-user/HomeScreen.tsx
  - C:/Users/b/Documents/GitHub/bthfinal/packages/surfaces/src/mobile/app-user/components/HeaderIconButton.tsx
- Structural host path used:
  - C:/Users/b/Documents/GitHub/bthwani-suite/packages/ui-kit

---

## Critical Truth Split

### STRUCTURAL HOST TRUTH

Current ui-kit in target repo is used only for:

- structure and layering
- ownership boundaries
- naming and export style
- insertion points

It is explicitly not treated as final visual authority.

### VISUAL DESIGN DONOR TRUTH

Legacy screen is used only to extract:

- visual hierarchy law
- interaction quality
- CTA behavior
- rhythm and composition strength

### CANONICAL TARGET DESIGN

Canonical target is synthesized from:

- host structural law
- donor visual law
- rejection of legacy violations

### LEGACY VIOLATIONS

Any donor item that violates ownership, layering, or direction-language law is rejected or kept in surfaces only.

---

## 1) Current UI-Kit Structural State (Host-Only Analysis)

### Confirmed host layers in target repo

- foundation: tokens, themes, direction
- providers + hooks
- primitives
- states
- components: actions, fields, feedback, display, navigation, selectors, overlays
- patterns: list, form, detail, dashboard
- adapters: native/web
- root

### Confirmed existing insertion points relevant to this task

- Service tile component exists: packages/ui-kit/src/components/display/BthServiceTileCard.tsx
- Section header with count and heading order exists: packages/ui-kit/src/components/navigation/BthSectionHeader.tsx
- Search field exists: packages/ui-kit/src/components/fields/BthSearchField.tsx
- Service hub shell exists: packages/ui-kit/src/patterns/dashboard/BthServiceHubShell.tsx
- State catalog exists but visual state rendering is generic: packages/ui-kit/src/states/catalog.ts

### Structural ownership boundaries (host truth)

- foundation owns tokens/themes/direction primitives only
- components own reusable UI parts only (no service business routing)
- patterns own reusable screen shell composition only
- surfaces own business routing, runtime flags, API calls, and domain orchestration

### Structural gaps detected in host (actual gaps, not assumed)

1. No canonical mobile top app bar pattern matching donor behavior (brand/tagline/context + multi-action rail + search mode + compact/stacked adaptation).
2. No canonical icon-action component with integrated badge and active/press background behavior in navigation layer.
3. Direction context in host is minimal (direction/language/isRtl only) and does not provide presentation resolvers used by donor screen.
4. No explicit canonical shell for donor-style header search state transition at pattern level.
5. No canonical skeleton card family in host ui-kit matching donor loading shape for service tiles. [TBD if planned elsewhere]

---

## 2) Legacy Screen Visual + Structural Donor Analysis

### Donor visual strengths

1. Strong top hierarchy in header: brand, promise line, context line, then action rail.
2. Action icons are compact, touch-safe, and include notification badge behavior.
3. Search-in-header mode is clear and reversible (enter/clear/cancel).
4. Service area structure is clear: intro card, section title + count, dense grid cards.
5. CTA clarity is high: one primary action per tile plus explicit empty-state recovery action.

### Donor interaction strengths

1. Header adapts by context (ESF/SND/WLT) without destroying interaction consistency.
2. Loading, empty, and ready states are all explicit and user-guiding.
3. Service tiles remain readable under dense grid while preserving visual affordance.

### Token/pattern candidates extractable from donor

- mobile.topBar.heightProfile
- mobile.topBar.actionRail.gap
- mobile.topBar.badge.size
- mobile.topBar.searchContainer.radius
- mobile.serviceGrid.cardMinHeight
- mobile.serviceGrid.iconContainer.size
- mobile.sectionHeader.countPill

Exact token keys in target host: [TBD]

### Legacy violations and anti-patterns to reject

1. Business logic mixed with UI shell in donor surface (feature flags, API fetch, preference ordering).
2. Local direction helpers and layout-neutral overrides that bypass centralized direction ownership.
3. Local style dump as source of truth (not allowed for canonical promotion).
4. Runtime-specific fallback messaging embedded in reusable UI candidates.
5. Implicit coupling to service route names inside UI layer.

---

## 3) Canonicalization Decision (Element by Element)

| Element                                                      | Decision                                 | Ownership                               | Target Path                                                       | Notes                                |
| ------------------------------------------------------------ | ---------------------------------------- | --------------------------------------- | ----------------------------------------------------------------- | ------------------------------------ |
| Branded mobile top bar (title/tagline/context + action rail) | Add as canonical pattern                 | ui-kit/patterns + components/navigation | packages/ui-kit/src/patterns/dashboard/BthMobileServiceTopBar.tsx | New required (host gap)              |
| Header icon action with badge/press-state                    | Add canonical component                  | ui-kit/components/navigation            | packages/ui-kit/src/components/navigation/BthIconActionButton.tsx | New required                         |
| Header search mode container behavior                        | Add canonical pattern helper             | ui-kit/patterns/dashboard               | packages/ui-kit/src/patterns/dashboard/BthTopBarSearchMode.tsx    | New required                         |
| Service tile card                                            | Keep in ui-kit and extend only if needed | ui-kit/components/display               | packages/ui-kit/src/components/display/BthServiceTileCard.tsx     | Already exists; refine contract only |
| Section header with count order                              | Keep and reuse                           | ui-kit/components/navigation            | packages/ui-kit/src/components/navigation/BthSectionHeader.tsx    | Already exists                       |
| Service hub shell                                            | Keep and extend (do not duplicate)       | ui-kit/patterns/dashboard               | packages/ui-kit/src/patterns/dashboard/BthServiceHubShell.tsx     | Already exists                       |
| Loading skeleton tile shape                                  | Add canonical feedback component         | ui-kit/components/feedback              | packages/ui-kit/src/components/feedback/BthSkeletonCard.tsx       | New required                         |
| Service flags fetch, preference ordering, route targets      | Keep in surfaces                         | surfaces                                | packages/surfaces/src/mobile/app-client/...                       | Not ui-kit                           |
| Context-specific business copy and runtime fallback text     | Keep in surfaces/i18n                    | surfaces + intl                         | surfaces locale + surface shell                                   | Not ui-kit                           |
| Local dir/lang hacks and layoutNeutral overrides             | Reject                                   | rejected carryover                      | N/A                                                               | Violation                            |

---

## 4) Structural Gaps in UI-Kit

1. Navigation layer lacks donor-equivalent top bar family for mobile app-client shell context.
2. Action icon + badge behavior not canonically owned by ui-kit.
3. Pattern layer does not yet expose a header-state machine for normal mode vs search mode.
4. Direction ownership lacks high-level presentation helpers needed by dense mobile headers.
5. Skeleton family coverage for this screen type is incomplete. [TBD verification by design-system owner]

---

## 5) Canonical Additions Proposed

### Additions in ui-kit

1. BthIconActionButton in components/navigation.
2. BthMobileServiceTopBar in patterns/dashboard.
3. BthTopBarSearchMode helper in patterns/dashboard.
4. BthSkeletonCard in components/feedback.
5. Optional direction presentation helpers in foundation/direction/helpers.ts for compact/stacked header behavior.

### Keep as composition in surfaces

1. service-to-route mapping
2. feature flag gating and runtime checks
3. API integration and TTL refresh
4. service usage tracking and personalization

### Explicitly rejected carryover

1. Blind copy of UserMobileSurface style blocks.
2. Blind copy of HomeScreen business fetch logic into ui-kit.
3. Local dir/lang hacks and hard layout-neutral forcing.
4. Style dump migration without token mapping.

---

## 6) Exact Target Placement Paths

### Target ui-kit paths (bthwani-suite)

- packages/ui-kit/src/components/navigation/BthIconActionButton.tsx
- packages/ui-kit/src/components/navigation/index.ts
- packages/ui-kit/src/patterns/dashboard/BthMobileServiceTopBar.tsx
- packages/ui-kit/src/patterns/dashboard/BthTopBarSearchMode.tsx
- packages/ui-kit/src/patterns/dashboard/BthServiceHubShell.tsx (extend only)
- packages/ui-kit/src/patterns/dashboard/index.ts
- packages/ui-kit/src/components/feedback/BthSkeletonCard.tsx
- packages/ui-kit/src/components/feedback/index.ts
- packages/ui-kit/src/foundation/direction/helpers.ts (optional helper extension)
- packages/ui-kit/src/foundation/tokens/source.ts (only if new token contracts are approved)

### Target surfaces placement (consumer side)

- packages/surfaces/src/mobile/app-client/[TBD exact screen path in target repo]
- Consumption only: compose canonical ui-kit pieces, keep business/runtime logic local.

---

## 7) Violations To Remove

1. No business logic in ui-kit components/patterns.
2. No direct reuse of donor route names in ui-kit contracts.
3. No local direction override that bypasses foundation direction ownership.
4. No visual lock to current host look as final design authority.
5. No copy of donor style constants without token mapping.

---

## 8) Acceptance Criteria

1. Output distinguishes clearly between structural host truth and visual donor truth.
2. Canonicalization is extraction-based, not copy-based.
3. Every promoted element has explicit owner and target path.
4. All business/runtime concerns remain in surfaces.
5. New ui-kit additions are generic and service-agnostic.
6. Direction/lang ownership is centralized and local hacks are removed.
7. Existing host components are reused/extended before proposing duplicates.
8. Any uncertain item is marked [TBD] with reason.

---

## Executive Verdict

- Status: Partially ready
- Why: Analysis and canonicalization decisions are complete; implementation and proof artifacts are intentionally out of scope in this task.

## Implant Packaging Decision

- Decision: needs target-fit revision before packaging
- Adoption strategy: REBUILD_CLEAN for new gaps, EXTEND_EXISTING for already-present host components

## Final Readiness Verdict

- REVISE_BEFORE_PACKAGING
