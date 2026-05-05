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
| DSH-RUN-003 | partner operations | dsh/frontend/app-partner | app-partner | fixture/preview TBD | NO | device/simulator runtime + screenshots | N/A | RUNTIME_UNPROVEN | map partner flow |
| DSH-RUN-004 | captain delivery | dsh/frontend/app-captain | app-captain | fixture/preview TBD | NO | device/simulator runtime + screenshots | N/A | RUNTIME_UNPROVEN | map captain flow |
| DSH-RUN-005 | backend/domain | dsh/backend + dsh/domain | DSH service | scaffold/TBD | NO | handler/domain/persistence proof | N/A | NOT_CLOSED | do not start before UI/API matrix |

Closure rule:
Runtime is PASS only when source, provider, happy path, failure path, recovery path, and evidence are proven.