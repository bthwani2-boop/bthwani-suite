# DSH UI/UX/Flow Closure Matrix

Status: ACTIVE_CLOSURE_CONTROL
Decision: NOT_CLOSED

Purpose:
Single lean matrix for DSH UI/UX/Flow closure. This file replaces separate screen inventory, flow registry, route parity, state coverage, visual RTL plan, and UI kit boundary files.

Required closure rule:
A DSH UI/UX/Flow row is not CLOSED until it has:
- surface ownership proof
- route/host proof
- screen/file proof
- primary CTA
- state coverage
- RTL/visual proof where visible UI exists
- UI kit boundary proof
- runtime evidence or explicit runtime blocker
- evidence path

| Flow ID | Flow | Actor | Surface | Screen/File | Route/Host | Primary CTA | Required States | Current UI Status | RTL/Visual Status | UI Kit Boundary | Runtime Status | Evidence | Decision | Next Action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DSH-FLOW-001 | Store discovery | Customer | app-client/webapp | TBD | TBD | choose store | loading/empty/error/ready/offline | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | map screen/route |
| DSH-FLOW-002 | Storefront | Customer | app-client/webapp | TBD | TBD | browse products | loading/empty/error/ready/offline | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | map screen/route |
| DSH-FLOW-003 | Catalog/product browsing | Customer | app-client/webapp | TBD | TBD | add item | loading/empty/error/ready/offline | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | map screen/route |
| DSH-FLOW-004 | Cart | Customer | app-client/webapp | TBD | TBD | review cart | empty/error/ready/disabled | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | map screen/route |
| DSH-FLOW-005 | Checkout | Customer | app-client/webapp | TBD | TBD | place order | loading/error/ready/blocked | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | BLOCKED_BY_WLT | N/A | NOT_CLOSED | map WLT dependency |
| DSH-FLOW-006 | Order creation | Customer/Partner | app-client/app-partner | TBD | TBD | submit/accept order | pending/success/error/retry | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | define state chain |
| DSH-FLOW-007 | Partner preparation | Partner | app-partner | TBD | TBD | accept/prepare/ready | pending/ready/error/blocked | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | map partner screens |
| DSH-FLOW-008 | Captain assignment/delivery | Captain/Ops | app-captain/control-panel | TBD | TBD | accept/pickup/deliver | pending/ready/error/offline | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | map captain screens |
| DSH-FLOW-009 | Tracking | Customer/Captain/Ops | app-client/app-captain/control-panel | TBD | TBD | monitor order | loading/ready/error/offline | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | map route parity |
| DSH-FLOW-010 | Support | Customer/Admin | app-client/control-panel | TBD | TBD | open/resolve case | empty/pending/error/success | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | map states |
| DSH-FLOW-011 | Rating | Customer | app-client | TBD | TBD | submit rating | ready/error/success | NEEDS_UI_FLOW | NEEDS_VISUAL_EVIDENCE | NEEDS_REVIEW | RUNTIME_UNPROVEN | N/A | NOT_CLOSED | map screen |
| DSH-FLOW-012 | Control-panel operations | Admin/Ops | control-panel | dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx | operations DSH host | monitor/intervene | loading/empty/error/offline/disabled/ready | UI_FLOW_PRESENT_NEEDS_VISUAL_RUNTIME_EVIDENCE | NEEDS_VISUAL_EVIDENCE | PASS_WITH_WARNINGS | RUNTIME_UNPROVEN | CHECK_DSH_PHASE_1B_ROUTE_RUNTIME_BASELINE-20260505-172609 | NOT_CLOSED | capture visual/runtime proof |

High-risk screen candidates to inspect before closure:
| Risk ID | Surface | File | Risk | Decision | Next Action |
|---|---|---|---|---|---|
| DSH-RISK-001 | app-client | DshStoreGetScreen.tsx | giant screen candidate | NEEDS_REVIEW | classify route/parts/states |
| DSH-RISK-002 | app-client | DshHomeGetScreen.tsx | giant screen candidate | NEEDS_REVIEW | classify route/parts/states |
| DSH-RISK-003 | app-client | DshCartUnifiedScreen.tsx | giant screen candidate | NEEDS_REVIEW | classify route/parts/states |
| DSH-RISK-004 | app-partner | DshPartnerConsoleScreen.tsx | giant screen candidate | NEEDS_REVIEW | classify route/parts/states |
| DSH-RISK-005 | app-captain | DshCaptainOrdersScreen.tsx | giant screen candidate | NEEDS_REVIEW | classify route/parts/states |

RTL/visual contract:
- Arabic text must align correctly.
- Icon/text cluster must remain together in RTL rows.
- Chevron/action goes opposite side.
- No clipping, overflow, or safe-area breach.
- BThwani identity uses deepBlue #0A2F5C, orange #FF500D, white #FFFFFF with controlled tints only.
- No local design system outside `@bthwani/ui-kit`.