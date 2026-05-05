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

Closure rule:
This file can move a row to READY_FOR_CONTRACT only after UI/UX/Flow proof exists and dependencies are not blocked.