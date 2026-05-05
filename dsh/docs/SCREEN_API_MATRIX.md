# DSH Screen/API Matrix

Status: ACTIVE_CLOSURE_CONTROL
Decision: NOT_READY_FOR_API

Purpose:
This is the canonical DSH Screen/API Matrix. It maps UI screens/flows to data/action needs before any OpenAPI change.

Current contract state:
- `dsh/dsh.openapi.yaml` is CONTRACT_TBD.
- `paths: {}`.
- No DSH endpoint is accepted yet.
- No schema is accepted without a proven screen/flow need.

Required rule:
No OpenAPI edit without a row here proving:
- flow
- surface
- screen/route
- needed data
- needed action
- existing source
- contract gap
- blocked dependencies
- evidence

| Matrix ID | Flow ID | Surface | Screen/Route | Needed Data | Needed Action | Existing Source | Existing Contract | Required Contract Gap | WLT/Auth Dependency | Priority | Evidence | Decision | Next Action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DSH-SAPI-001 | DSH-FLOW-012 | control-panel | operations command center | dispatch, exceptions, SLA, audit, partner prep, live tracking, capacity | monitor/intervene | preview/UI | dsh/dsh.openapi.yaml CONTRACT_TBD | operations read/action model TBD | auth/capability | HIGH | CHECK_DSH_PHASE_1B_ROUTE_RUNTIME_BASELINE-20260505-172609 | NOT_READY_FOR_API | prove visual/runtime first |
| DSH-SAPI-002 | DSH-FLOW-005 | app-client/webapp | checkout | cart, fees, availability, payment decision | place order | fixture/preview TBD | dsh/dsh.openapi.yaml CONTRACT_TBD | checkout/order create contract TBD | WLT/auth required | HIGH | N/A | BLOCKED | close WLT/auth dependency first |
| DSH-SAPI-003 | DSH-FLOW-007 | app-partner | partner preparation | orders, status, prep queue | accept/prepare/ready | fixture/preview TBD | dsh/dsh.openapi.yaml CONTRACT_TBD | partner order operation model TBD | auth/capability | MEDIUM | N/A | NOT_READY_FOR_API | prove route/state/visual first |
| DSH-SAPI-004 | DSH-FLOW-008 | app-captain | captain delivery | task, route, pickup/dropoff state | accept/pickup/deliver | fixture/preview TBD | dsh/dsh.openapi.yaml CONTRACT_TBD | captain task model TBD | auth/capability | MEDIUM | N/A | NOT_READY_FOR_API | prove route/state/visual first |
| DSH-SAPI-005 | DSH-FLOW-001 | app-client | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx | stores list / store discovery | choose/open store | props-driven preview + in-screen filtering, no runtime truth proven | dsh/dsh.openapi.yaml CONTRACT_TBD | store discovery contract model TBD; route/state/runtime proof missing | WLT not required for discovery; auth optional for later order actions | HIGH | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713; fix(dsh): stabilize app client home screen | NOT_READY_FOR_API | prove runtime source before any API work |
| DSH-SAPI-006 | DSH-FLOW-001 | app-client | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx | categories list | open category / subcategory discovery | props-driven preview + in-screen category rail, no runtime truth proven | dsh/dsh.openapi.yaml CONTRACT_TBD | category-discovery contract model TBD; route binding unresolved | WLT not required; auth optional | HIGH | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713; fix(dsh): stabilize app client home screen | NOT_READY_FOR_API | prove category route/source mapping before contract design |
| DSH-SAPI-007 | DSH-FLOW-001 | app-client | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx | promos / banners | open discovery / store / store-category / product / search | props-driven preview + banner carousel routing, no runtime truth proven | dsh/dsh.openapi.yaml CONTRACT_TBD | marketing-banner contract model TBD; actionTarget/actionExtra semantics not closed | WLT not required; auth optional | HIGH | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713; fix(dsh): stabilize app client home screen | NOT_READY_FOR_API | prove promo source and route semantics before API |
| DSH-SAPI-008 | DSH-FLOW-001 | app-client | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx | recent orders summary | open orders / tracking / store entry | props-driven preview + ticker summary, no runtime truth proven | dsh/dsh.openapi.yaml CONTRACT_TBD | recent-order summary contract model TBD; order/tracking binding unresolved | WLT not required for summary; auth may be required for real order history | MEDIUM | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713; fix(dsh): stabilize app client home screen | NOT_READY_FOR_API | prove recent-order source before modeling any endpoint |
| DSH-SAPI-009 | DSH-FLOW-001 | app-client | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx | store availability / status | open store or discovery based on open/closed state | props-driven preview + store card state, no runtime truth proven | dsh/dsh.openapi.yaml CONTRACT_TBD | store availability/status contract model TBD; runtime availability not proven | WLT not required for discovery; auth optional | HIGH | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713; fix(dsh): stabilize app client home screen | NOT_READY_FOR_API | prove store-status source before API planning |
| DSH-SAPI-010 | DSH-FLOW-001 | app-client | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx | media/image references | render store/promo/category visuals and open linked destinations | props-driven preview with mediaKey/imageUrl resolver, no runtime truth proven | dsh/dsh.openapi.yaml CONTRACT_TBD | media-resolution contract model TBD; asset source and fallback rules unresolved | WLT not required | MEDIUM | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713; fix(dsh): stabilize app client home screen | NOT_READY_FOR_API | prove media source resolution before contract work |
| DSH-SAPI-011 | DSH-FLOW-001 | app-client | dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx | optional marketing video shorts | open category / store / discovery / search / cart from approved shorts | props-driven preview via approvedVideoShorts, no runtime truth proven | dsh/dsh.openapi.yaml CONTRACT_TBD | shorts feed contract model TBD; CTA routing semantics not closed | WLT not required for discovery; auth optional for later order actions | MEDIUM | CHECK_DSH_NON_VISUAL_CLOSURE_BASELINE-20260505-210713; fix(dsh): stabilize app client home screen | NOT_READY_FOR_API | prove shorts source before any API candidate |

Closure rule:
This file can move a row to READY_FOR_CONTRACT only after UI/UX/Flow proof exists and dependencies are not blocked.