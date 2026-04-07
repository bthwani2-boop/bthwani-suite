# 01_DONOR_SOURCE_INDEX

## Mandatory Header

- WorkMode: `FORENSIC EXTRACT MODE`
- CurrentPhase: `STEP 1 - SOURCE INDEX`
- TargetService: `dsh`
- RequestType: `service extraction step-1 only`
- InputClassification: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `STEP-1 artifact created; pack intentionally partial`
- BlockingGaps: `donor count drift (92 vs 96 vs 98); one donor closure reference points to a missing path`
- NextAllowed: `STEP 2 - Exhaustive Census, only after this source index is accepted as the current donor root map`
- EvidenceRoot: `kdt/volatile/registry/runs/20260407-192701-dsh-step1-source-index/services/dsh/`

## Scope Lock

- Service scope is locked to `dsh` only.
- No other donor service roots were indexed.
- `node_modules`, build artifacts, and unrelated service folders are excluded from this artifact.
- This file indexes donor roots only. It does not perform census, actor recovery, operation recovery, journey recovery, screen recovery, or disposition.

## Index Method

- Source basis combines direct filesystem scan of `bthfinal` with representative file reads from donor governance, donor implementation, donor surface code, donor route shells, donor bindings, and donor runtime vars.
- A root is included only if it materially contributes to one of these: service identity, operation truth, route entry, surface implementation, binding chain, backend behavior, runtime configuration, or verified donor closure analysis.
- A root is downgraded to `secondary` or `reference-only` if donor evidence shows duplication, shadow copies, or late-stage analytical material instead of direct execution truth.

## Approved Name Normalization For This Index

- donor `app-user` -> target `app-client`
- donor `mcpw` -> target `control-panel`
- donor `APP_USER` -> target `app-client`
- donor `MCPW` -> target `control-panel`

These normalizations apply to target-facing interpretation only.
Original donor names remain preserved in the root inventory below for source trace accuracy.

## Canonical And High-Priority Donor Roots

| Root ID | Donor Root | Root Class | Density | Why It Is Indexed | Target Interpretation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| R001 | `contracts/operations_inventory.json` | contract inventory | `1 file` | `services/dsh/governance/DSH_SERVICE_SCOPE.md` declares this the donor operation-id source of truth for `dsh_*` operations | contract authority only; no rename needed | `INCLUDE` |
| R002 | `services/dsh` | service package root | `6 config files + subroots` | anchors the donor service boundary and contains both governance and implementation roots | clean target slug already matches `dsh` | `INCLUDE` |
| R003 | `services/dsh/governance` | governance root | `966 files / 99 dirs` | contains donor service scope, operation catalog, coverage, RBAC, UX flow, traceability, runtime vars, seal status, and operation dossiers | primary documentary donor root for step-2 onward | `INCLUDE_WITH_DRIFT` |
| R004 | `services/dsh/governance/operations` | operation dossier root | `96 operation dirs observed` | contains per-operation packs (`OP_SPEC`, `OP_API_MAP`, `OP_SCREENS_MAP`, `OP_RUNTIME_VARS`, `OP_EVIDENCE_INDEX`) needed for deep extraction | primary operation trace root | `INCLUDE_WITH_DRIFT` |
| R005 | `services/dsh/governance/service-level` | shadow governance copy | `7 files` | holds duplicated service-level files (`DSH_SERVICE_SCOPE`, `DSH_OPERATION_CATALOG`, `DSH_COVERAGE_MATRIX`, etc.) that may diverge from the parent governance root | secondary only until file-by-file diff proves parity | `INCLUDE_AS_SECONDARY` |
| R006 | `services/dsh/src` | backend implementation | `7 files / 3 dirs` | contains donor controller, service module, and entity evidence for live behavior | maps to future `services/dsh` implementation trace, not direct adoption | `INCLUDE` |
| R007 | `contracts/runtime/Master_RUNTIME_VARS_CATALOG.csv` | runtime contract catalog | `1 file` | donor runtime vars authority referenced by concrete runtime var files | cross-check root for runtime truth only | `INCLUDE` |
| R008 | `runtime/vars/dsh` | concrete runtime vars | `1 file` | contains service-specific runtime vars (`shein-proxy.yaml`) that bind DSH behavior to runtime switches | runtime support root; not service-scope authority by itself | `INCLUDE` |

## Route Shell And Entry Roots

| Root ID | Donor Root | Root Class | Density | Why It Is Indexed | Target Interpretation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| R009 | `packages/surfaces/src/mobile/app-user/routeMap.tsx` | mobile route map | `1 file` | live route entry map for donor `app-user`; required because DSH screens are not discoverable from file names alone | normalize to target `app-client` route authority | `INCLUDE` |
| R010 | `packages/surfaces/src/mobile/app-partner/partnerRouteMap.tsx` | mobile route map | `1 file` | live route entry map for partner-side DSH work | target `app-partner` route authority | `INCLUDE` |
| R011 | `packages/surfaces/src/mobile/app-captain/captainRouteMap.tsx` | mobile route map | `1 file` | live route entry map for captain-side DSH work | target `app-captain` route authority | `INCLUDE` |
| R012 | `packages/surfaces/src/mobile/app-field/fieldRouteMap.tsx` | mobile route map | `1 file` | live route entry map for optional field-side DSH work | target `app-field` route authority | `INCLUDE` |
| R013 | `apps/web/mcpw/app/operations/dsh` | internal web shell routes | `12 files / 11 dirs` | donor internal ops route shell for DSH execution, exception handling, proxy handling, orders, peak mode, and reassignment | normalize to target `control-panel` operational sections | `INCLUDE` |
| R014 | `apps/web/mcpw/app/support/dsh-chat` | internal web shell route | `1 file` | donor support-side DSH chat entry | normalize to target `control-panel` support area | `INCLUDE` |
| R015 | `apps/web/mcpw/app/service-catalog/services/dsh` | internal web shell route | `1 file` | donor service-catalog entry page for DSH inside MCPW | normalize to target `control-panel`; section ownership remains `[TBD]` | `INCLUDE` |
| R016 | `apps/web/mcpw/app/analytics/dsh-orders` | internal web shell route | `1 file` | donor analytics entry for DSH orders | normalize to target `control-panel`; exact IA section remains `[TBD]` | `INCLUDE` |
| R017 | `apps/web/mcpw/app/finance/dsh` | internal web shell route | `1 file` | donor finance-facing DSH page; important because DSH/WLT boundary is explicitly risky | normalize to target `control-panel` finance area, with WLT boundary review required | `INCLUDE_WITH_BOUNDARY_RISK` |
| R018 | `apps/web/mcpw/app/partner/store` | internal web shell route | `1 file` | donor partner store page appears in DSH closure evidence and route shell results | target ownership must be revalidated between `app-partner` and `control-panel` in later steps | `INCLUDE_WITH_BOUNDARY_RISK` |
| R019 | `apps/web/mcpw/app/partner/store-nominations` | internal web shell route | `1 file` | donor nomination flow linked to DSH partner/store context | target ownership must be revalidated later | `INCLUDE_WITH_BOUNDARY_RISK` |
| R020 | `apps/web/mcpw/app/admin/store-nominations` | internal web shell route | `1 file` | donor admin nomination path overlaps with partner/store governance | target ownership must be revalidated later | `INCLUDE_WITH_BOUNDARY_RISK` |

## Surface Implementation Roots

| Root ID | Donor Root | Root Class | Density | Why It Is Indexed | Target Interpretation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| R021 | `packages/surfaces/src/dsh` | umbrella UI root | `220 files / 19 dirs` | main donor DSH UI implementation root containing screens, hooks, fixtures, data, shared components, and surface-specific subtrees | primary donor UI root; not implant-ready by default | `INCLUDE` |
| R022 | `packages/surfaces/src/dsh/app-user/mobile` | customer mobile subtree | `74 files / 3 dirs` | donor customer-side DSH screens and auto-generated surface files | normalize to target `app-client` | `INCLUDE` |
| R023 | `packages/surfaces/src/dsh/app-partner/mobile` | partner mobile subtree | `39 files` | donor partner-side DSH screens and auto-generated surface files | target `app-partner` | `INCLUDE` |
| R024 | `packages/surfaces/src/dsh/app-captain/mobile` | captain mobile subtree | `21 files` | donor captain-side DSH screens and auto-generated surface files | target `app-captain` | `INCLUDE` |
| R025 | `packages/surfaces/src/dsh/app-field/mobile` | field mobile subtree | `4 files` | donor optional field-support DSH screens | target `app-field`; optionality must stay explicit | `INCLUDE` |
| R026 | `packages/surfaces/src/dsh/mobile/dsh` | shared mobile DSH subtree | `5 files` | donor shared/mobile DSH components outside actor-specific folders | secondary UI trace; likely dedupe pressure against actor-specific trees | `INCLUDE_AS_SECONDARY` |
| R027 | `packages/surfaces/src/dsh/hooks` | surface hook root | `23 files` | donor DSH data-fetching and action hooks | binding-chain evidence only; not direct screen truth | `INCLUDE` |
| R028 | `packages/surfaces/src/dsh/fixtures` | fixture root | `23 files` | donor DSH fixtures used by surfaces and hooks | supporting evidence only; not canonical runtime truth | `INCLUDE_AS_SUPPORTING` |
| R029 | `packages/surfaces/src/dsh/data` | data adapter root | `4 files` | donor data/repository layer for DSH home and related behavior | binding/data-model evidence | `INCLUDE` |
| R030 | `packages/surfaces/src/dsh/components` | shared component root | `4 files` | donor reusable DSH-specific components | screen composition evidence only | `INCLUDE` |
| R031 | `packages/surfaces/src/web/mcpw/operations/dsh` | internal web surface implementation | `18 files` | donor implementation layer behind MCPW DSH route shells | normalize to target `control-panel` implementation evidence | `INCLUDE` |
| R032 | `packages/surfaces/src/web/mcpw/partner/store` | internal web surface implementation | `1 file` | donor partner/store web surface component linked to DSH pathing | secondary internal surface evidence | `INCLUDE_AS_SECONDARY` |

## Binding, State, And Type Roots

| Root ID | Donor Root | Root Class | Density | Why It Is Indexed | Target Interpretation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| R033 | `packages/api-clients/src/dsh` | API client root | `6 files` | donor DSH-specific generated or semi-generated clients | binding evidence only; adoption default remains `REBUILD_CLEAN` | `INCLUDE` |
| R034 | `packages/api-clients/src/lib/dsh` | API helper root | `2 files` | donor shared DSH API helper layer used by surfaces and clients | binding evidence only | `INCLUDE` |
| R035 | `packages/api-clients/src/lib/thunks/dsh-thunks.ts` | thunk bridge | `1 file` | donor thunk bridge for DSH async actions | secondary binding evidence | `INCLUDE_AS_SECONDARY` |
| R036 | `packages/states/src/lib/slices/dsh-slice.ts` | state slice | `1 file` | donor centralized DSH state slice | state ownership evidence only; later dedupe review required | `INCLUDE` |
| R037 | `packages/domain-types/src/dsh-captain.ts` | domain types | `1 file` | donor typed captain-side DSH domain model | type evidence only | `INCLUDE` |

## Auxiliary And Diagnostic Roots

| Root ID | Donor Root | Root Class | Density | Why It Is Indexed | Target Interpretation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| R038 | `apps/backend/api-host/src/local-prod` | local preview / seed root | `32 files / 4 dirs` | donor local-prod DSH helpers (`dsh-home-seed.ts`, `dsh-home-infra.controller.ts`) surfaced in path scan | reference-only for preview/runtime clues, not canonical service truth | `INCLUDE_AS_AUXILIARY` |
| R039 | `Final closure/dsh` | late-stage closure analysis | `1 file` | donor diagnostic closure file explicitly audits DSH route/surface/operation drift | reference-only diagnostic root | `INCLUDE_AS_REFERENCE_ONLY` |
| R040 | `.cursor/context/analysis/dsh` | hidden donor analysis root | `34 files` | donor closure material references this analysis tree as supporting evidence | reference-only diagnostic root; never treat as execution truth by itself | `INCLUDE_AS_REFERENCE_ONLY` |

## Explicitly Excluded Noise

| Excluded Path | Why Excluded |
| --- | --- |
| `services/dsh/node_modules` | dependency noise, not donor service truth |
| donor build outputs under ignored folders | not part of source indexing for clean extraction |
| unrelated service folders (`amn`, `arb`, `snd`, `wlt`, etc.) | out of locked service scope |

## Early Donor Contradictions Discovered During Step 1

1. `services/dsh/governance/DSH_SERVICE_SCOPE.md` still states `92` `dsh_*` operations.
2. `services/dsh/governance/operations` currently contains `96` operation dossier directories.
3. `services/dsh/governance/DSH_OPERATION_CATALOG.csv` currently contains `98` data rows.
4. `Final closure/dsh/31_DSH_SURFACE_USAGE_AND_MERGE_MATRIX.md` explicitly records the same `98` count and rejects the older `92` as current truth.
5. `services/dsh/governance/service-level/**` duplicates core governance files and must be treated as a shadow copy until parity is proven.
6. `Final closure/dsh/31_DSH_SURFACE_USAGE_AND_MERGE_MATRIX.md` references `packages/surfaces/src/web/mcpw/service-catalog/McpwServiceBasicPages.tsx`, but that path was missing at scan time.

These contradictions do not block Step 1 indexing itself, but they do block any honest claim of donor numerical coherence until Step 2 and later reconciliation work is completed.

## Representative Trace Anchors Used To Approve This Index

- `services/dsh/governance/DSH_SERVICE_SCOPE.md` declares DSH actors, surfaces, and donor operation authority roots.
- `services/dsh/governance/DSH_UX_FLOW.md` confirms DSH user, captain, and partner flow expectations and explicitly ties checkout behavior to WLT/COD policy.
- `packages/surfaces/src/dsh/app-user/mobile/auto_dsh_home_get.tsx` proves donor `app-user` customer-side DSH surface implementation exists under the DSH UI root.
- `apps/web/mcpw/app/operations/dsh/page.tsx` proves MCPW shell routing delegates into donor DSH web surfaces.
- `packages/api-clients/src/dsh/dsh-orders-api.ts` proves a donor DSH binding layer exists between surfaces and backend endpoints.
- `services/dsh/src/controllers/dsh.controller.ts` proves donor backend behavior exists and includes proxy, order, captain, partner, and auxiliary in-memory flow logic.
- `runtime/vars/dsh/shein-proxy.yaml` proves donor concrete runtime vars exist for DSH subfeatures.
- `Final closure/dsh/31_DSH_SURFACE_USAGE_AND_MERGE_MATRIX.md` proves donor closure analysis already detected numerical drift inside DSH itself.

## Step-1 Verdict

- `service_scope_locked = true`
- `donor_roots_indexed = true`
- `noise_excluded = true`
- `cross-surface donor roots indexed = true`
- `binding and runtime donor roots indexed = true`
- `known contradictions recorded = true`
- `pack completeness = partial by design`

## Immediate Next-Step Constraints

- Step 2 must census from the indexed roots above, not from memory and not from donor path guessing.
- Step 2 must reconcile the `92 vs 96 vs 98` contradiction instead of inheriting one number blindly.
- Any target-facing clean model must preserve donor names only in trace sections and must normalize `app-user -> app-client` and `mcpw -> control-panel` everywhere else.
- No code, no target implementation, and no disposition decisions are authorized from this file alone.

## Current Readiness Status

- Step 1 status: `PASS_WITH_RECORDED_DONOR_DRIFT`
- Pack readiness: `NOT_COMPLETE_BY_DESIGN`
- Safe handoff: `READY_FOR_STEP_2_ONLY`