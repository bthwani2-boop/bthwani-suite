# DSH-SLICE-008B — Feature Flags & Rollout

## Identity

| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-008B` |
| Parent Journey | J-008 — Platform Vars & Provider |
| Business Outcome | DSH features can be gated behind feature flags; rollout controlled per environment/cohort; Control Panel operator can toggle flags in real-time across all running surfaces |
| Primary Actor | Engineering / Control-Panel Operator |
| Primary Surface | `control-panel` → Platform → Rollouts |
| Supporting Surfaces | `app-client`, `app-partner`, `app-captain`, `app-field` (flag consumers) |
| Excluded Surfaces | WLT (N/A — no financial gating in this slice) |
| WLT Boundary | N/A — no money semantics; WLT preserves its own runtime boundary |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | Feature flags consumed from PlatformVarsProvider; real-time CP operator toggle wiring not yet connected to backend; real device E2E rollout not conducted |
| Closed At | 2026-06-06 |
| Evidence Run | `DSH_SLICE_008B_FEATURE_FLAGS_ROLLOUT_FINAL_CLOSURE-20260606-LOCAL` |

---

## Scope

### Included

- `FeatureFlagsRegistry` — static source of truth for all DSH flags
- `FeatureFlagProvider` — React Context wrapper for all 5 app surfaces
- `useFeatureFlag` hook — typed per-flag read from context
- Control Panel Rollouts workspace (`DshPlatformRolloutsWorkspace.tsx`) — operator UI for flag override
- Real-time flag propagation via `CustomEvent('dsh-flag-override')` dispatched by Control Panel
- Awnak capability gating: `useHomeFilterRail.tsx` + `DshClientSurface.tsx`
- Guard exemption in `guard-platform-vars-control.mjs` for `FeatureFlagProvider.tsx`

### Excluded

| Surface | Reason |
|---|---|
| Provider infrastructure | Covered in DSH-SLICE-008A (PlatformVarsProvider) |
| Vars scope/audit/rollback | Covered in DSH-SLICE-008C |
| Policy impact on visibility gate | Covered in DSH-SLICE-008D |
| WLT flag boundary | WLT owns its own feature gates; DSH boundary is read-only display bridge only |

---

## Coverage Matrix

| Row ID | Surface | File | Status | Evidence |
|---|---|---|---|---|
| CM-008B-01 | shared | `dsh/frontend/shared/platform/FeatureFlagProvider.tsx` | **PASS** | File exists, exports `FeatureFlagsRegistry`, `FeatureFlagProvider`, `useFeatureFlag` |
| CM-008B-02 | shared | `dsh/frontend/shared/index.ts` | **PASS** | `FeatureFlagProvider`, `useFeatureFlag`, `FeatureFlagsRegistry` exported |
| CM-008B-03 | app-client | `dsh/frontend/app-client/DshClientSurface.tsx` | **PASS** | Wrapped with `FeatureFlagProvider`; Awnak gated via `useFeatureFlag` |
| CM-008B-04 | app-partner | `dsh/frontend/app-partner/DshPartnerSurface.tsx` | **PASS** | Wrapped with `FeatureFlagProvider` |
| CM-008B-05 | app-captain | `dsh/frontend/app-captain/DshCaptainSurface.tsx` | **PASS** | Wrapped with `FeatureFlagProvider` |
| CM-008B-06 | app-field | `dsh/frontend/app-field/DshFieldSurface.tsx` | **PASS** | Wrapped with `FeatureFlagProvider` |
| CM-008B-07 | control-panel | `dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx` | **PASS** | Wrapped with `FeatureFlagProvider` |
| CM-008B-08 | control-panel | `dsh/frontend/control-panel/platform/Rollouts/DshPlatformRolloutsWorkspace.tsx` | **PASS** | Reads registry on mount; dispatches `dsh-flag-override` events on operator confirm |
| CM-008B-09 | shared | `dsh/frontend/app-client/hooks/useHomeFilterRail.tsx` | **PASS** | `DSH:capability:awnak` flag gates Awnak category in filter rail |
| CM-008B-10 | guard | `tools/guards/guard-platform-vars-control.mjs` | **PASS** | `FeatureFlagProvider.tsx` exempted cleanly from direct env-read rules |

---

## CTA Matrix

| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| تأكيد معاينة التغيير | control-panel | DshPlatformRolloutsWorkspace | dispatches `dsh-flag-override` event to all surfaces | **PASS** |
| إيقاف فوري (Kill) | control-panel | DshPlatformRolloutsWorkspace | sets enabled=false for selected flag; event dispatched | **PASS** |
| استعادة الحالة | control-panel | DshPlatformRolloutsWorkspace | resets to `initialStage`; event dispatched | **PASS** |
| (implicit) Awnak category hidden | app-client | HomeScreen filter rail | category removed from rail when flag=false | **PASS** |

---

## State Matrix

| State | Required | Status | Evidence |
|---|---|---|---|
| flag ON — DSH:capability:awnak | yes | **PASS** | Default `true`; Awnak category visible in filter rail |
| flag OFF — DSH:capability:awnak | yes | **PASS** | Kill → event fired → `useFeatureFlag` returns `false` → category hidden |
| flag ON — DSH:sanaa-pilot | yes | **PASS** | Default `true`; surface active |
| flag OFF — DSH:capability:store-pickup | yes | **PASS** | Default `false`; pickup not surfaced |
| flag unknown / default | yes | **PASS** | `useFeatureFlag` returns `false` for unknown keys (safe default) |
| operator confirm dialog shown | yes | **PASS** | `showConfirm` state triggers confirmation Surface before dispatching |

---

## Cross-Surface Impact

| Dependency | Direction | Impact | Resolution |
|---|---|---|---|
| DSH-SLICE-008A | upstream | PlatformVarsProvider must be defined first | **PASS** — 008A CLOSED before 008B |
| DSH-SLICE-008D | downstream | Policy impact analysis requires flag scope | Covered in 008D — not blocking 008B |
| J-008 guard | bidirectional | guard-platform-vars-control.mjs enforces env-read rules | **PASS** — exemption added and verified |

---

## Evidence and Gates

| Gate | Status | Evidence |
|---|---|---|
| TypeScript `tsc --noEmit` | **PASS — 0 errors** | Run locally 2026-06-06 |
| `git diff --check` | **PASS — 0 whitespace issues** | Run locally 2026-06-06 |
| `guard:platform-vars` | **PASS — 0 failures** | Run locally 2026-06-06 |
| `FeatureFlagProvider.tsx` exists and exports correctly | **PASS** | File verified |
| All 5 surfaces wrapped with `FeatureFlagProvider` | **PASS** | All 5 root files verified |
| Control Panel dispatches `dsh-flag-override` events | **PASS** | `DshPlatformRolloutsWorkspace.tsx` lines 74–83 |
| `useFeatureFlag('DSH:capability:awnak')` gates Awnak category | **PASS** | `useHomeFilterRail.tsx` + `DshClientSurface.tsx` |
| Visual evidence (CP Rollouts UI) | **PASS** | Screenshot captured via localhost Control Panel |

---

## Decision

| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Closed By** | Agent execution 2026-06-06 |
| **Evidence Run** | `DSH_SLICE_008B_FEATURE_FLAGS_ROLLOUT_FINAL_CLOSURE-20260606-LOCAL` |
| **Blockers** | None |
| **Next Action** | Proceed to DSH-SLICE-008C — Vars Scope/Audit |
