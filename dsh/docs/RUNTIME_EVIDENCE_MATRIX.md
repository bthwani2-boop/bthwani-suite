# DSH Runtime Evidence Matrix

Status: ACTIVE_CLOSURE_CONTROL
Decision: RUNTIME_UNPROVEN

Purpose:
Single lean runtime evidence file. It classifies mock/fixture/preview/runtime sources and prevents fake runtime closure.

Allowed classifications:
- mock
- fixture
- seed
- preview
- runtime truth
- production-like truth

| Runtime ID | Scope | Owner Path | Used By | Data Classification | Runtime Claim Allowed | Required Proof | Evidence | Decision | Next Action |
|---|---|---|---|---|---|---|---|---|---|
| DSH-RUN-001 | control-panel operations | dsh/frontend/control-panel | control-panel | preview | NO | local runtime + screenshot + failure path | CHECK_DSH_PHASE_1B_ROUTE_RUNTIME_BASELINE-20260505-172609 | RUNTIME_UNPROVEN | run visual/runtime proof |
| DSH-RUN-002 | customer shopping | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx | app-client | fixture/preview, props-driven preview | NO | device/simulator runtime + screenshots + failure path | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713 | RUNTIME_UNPROVEN | props/fixtures are preview-only; visual closure is deferred; prove runtime truth separately |
| DSH-RUN-006 | DSH-CAP-001 promo consumption | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx | BannerCarousel inside app-client home | props-driven preview + seed fallback | NO | real provider + device runtime + failure path for missing promo/media source | DshHomeGetScreen.tsx; DshSurfaceHost resolvePublishedHomePromos | RUNTIME_UNPROVEN | banner block is UI-proven only; no runtime source authority is proven |
| DSH-RUN-007 | DSH-CAP-001 promo source store | dsh/frontend/shared/marketing/banner-store.ts | DshSurfaceHost -> DshHomeGetScreen | seed + preview + global mutable store | NO | backend/provider proof that publish/live state is not globalThis/local preview state | dsh/frontend/shared/marketing/banner-store.ts | RUNTIME_UNPROVEN | shared banner store is local mutable preview data, not runtime truth |
| DSH-RUN-008 | DSH-CAP-001 promo media chain | dsh/frontend/app-client/shared/resolve-image-source.ts + dsh/media-fixtures/assets/seed/dsh/banners | app-client home promo images | media fixture | NO | remote asset provider or production-like media authority + failure fallback proof | resolve-image-source.ts; dsh/media-fixtures/assets/seed/dsh/banners | RUNTIME_UNPROVEN | mediaKey resolution is seed-backed only |
| DSH-RUN-009 | DSH-CAP-001 control-panel marketing mirror | dsh/frontend/control-panel/marketing/banner-store.ts + dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx | control-panel marketing | preview + local governance state | NO | proof that control-panel banner deck governs a real shared publish pipeline rather than a local mirror | ControlPanelDshMarketingScreen.tsx; BannersCommandDeckScreen.tsx | RUNTIME_UNPROVEN | control-panel banner deck is a proven mirror/governance surface, but runtime authority is not proven |
| DSH-RUN-010 | DSH-CAP-001 app-partner offer intent | dsh/frontend/app-partner/console/screens/DshPartnerConsoleScreen.tsx | app-partner analytics section with embedded promotion intent | preview | NO | provider/request proof that partner offer creation or suggestion is persisted beyond local UI state | DshPartnerConsoleScreen.tsx | RUNTIME_UNPROVEN | app-partner counterpart is proven as UI intent only, not runtime-backed promotion submission |
| DSH-RUN-011 | DSH-CAP-001 control-panel partners eligibility | dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx + dsh/frontend/control-panel/partners/workflow.ts | control-panel partners section | preview | NO | provider/audit proof that approval, eligibility, routing lanes, and marketing handoff are persisted beyond local queue data | ControlPanelDshPartnerApprovalsScreen.tsx; workflow.ts | RUNTIME_UNPROVEN | control-panel partners counterpart is proven as readiness/handoff UI only, not runtime-backed eligibility truth |
| DSH-RUN-012 | DSH-CAP-001 control-panel partner eligibility section | dsh/frontend/control-panel/partners/DshPartnerPromotionEligibilityScreen.tsx | nested partner approvals eligibility section | preview | NO | provider/audit proof that featured eligibility, readiness, and lane routing are persisted beyond local section state | DshPartnerPromotionEligibilityScreen.tsx; ControlPanelDshPartnerApprovalsScreen.tsx | RUNTIME_UNPROVEN | new eligibility section is preview-only and does not claim runtime truth |
| DSH-RUN-003 | partner operations | dsh/frontend/app-partner | app-partner | fixture/preview TBD | NO | device/simulator runtime + screenshots | N/A | RUNTIME_UNPROVEN | map partner flow |
| DSH-RUN-004 | captain delivery | dsh/frontend/app-captain | app-captain | fixture/preview TBD | NO | device/simulator runtime + screenshots | N/A | RUNTIME_UNPROVEN | map captain flow |
| DSH-RUN-005 | backend/domain | dsh/backend + dsh/domain | DSH service | scaffold/TBD | NO | handler/domain/persistence proof | N/A | NOT_CLOSED | do not start before UI/API matrix |

Closure rule:
Runtime is PASS only when source, provider, happy path, failure path, recovery path, and evidence are proven.