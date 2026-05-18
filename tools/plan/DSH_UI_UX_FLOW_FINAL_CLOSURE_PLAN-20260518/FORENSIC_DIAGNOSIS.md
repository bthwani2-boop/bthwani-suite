# DSH UI/UX Flow Forensic Diagnosis — Current Branch Snapshot

Scope: `C:\bthwani-suite`, DSH UI/UX/Flow closure only.
Branch/source snapshot referenced by this package: `ghb/0152-20260518-162817-wlt`.

## Non-negotiable verdict

DSH must not be treated as Runtime-ready. Current evidence classifies DSH surfaces as preview-only and runtime as unproven. This package is designed to close **UI/UX/Flow logic** and prepare visual evidence, not to implement API/Backend/DB/WLT runtime.

## Severe interruption guard from owner

The app-client screens have already had visual review and redesign, except some tabs in `MySpaceScreen` / "مساحتي". Therefore:

- Do not redesign app-client screens.
- Do not alter app-client visual hierarchy, card styling, spacing, colors, or RTL layout except where a directly proven logic/state defect requires a minimal safe change.
- For app-client, prefer `State`, `Sheet`, or `Section` wiring, with the smallest possible diff.
- The only app-client visual area allowed for direct repair is the reported incomplete/incorrect `MySpaceScreen` tabs, and even that must be done after route/tab diagnosis.

## Critical forensic findings from current repo evidence

### Global

1. `ML-001..ML-054` must be handled numerically. No ML row may be skipped.
2. Do not convert every ML into a new screen. Correct classification is: `Screen / Section / Sheet / State / Panel / Queue / Workspace`.
3. `Workspace` is forbidden as a generic word. It is only allowed for a complex Control Panel operator task area. Otherwise use `Panel`, `Queue`, `Section`, or `Screen`.
4. `closure-workspaces` is a temporary closure/audit name. It may exist in docs/evidence but must not remain as a final frontend module name or import/export in `dsh/frontend/**`.
5. WLT owns all money semantics. DSH may only show WLT read-only bridge states/views.
6. Runtime/API/OpenAPI/backend/database mutations are outside this stage.

### App-client protected surface

High-risk files:
- `dsh/frontend/app-client/screens/OperationScreens.tsx` — composite/god-file risk.
- `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` — order history + tracking; preserve existing design.
- `dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx` — add/verify state coverage only; no redesign.
- `dsh/frontend/app-client/screens/MySpaceScreen.tsx` — protected except known tab issues.
- `dsh/frontend/app-client/sheets/CancelOrderSheet.tsx` — must be wired only if not already mounted; avoid visual redesign.

Allowed app-client changes:
- ML-006 order-created state in checkout intent.
- ML-007 cancel sheet wiring if absent.
- ML-008 refund read-only WLT state.
- ML-009/010/015 quote/payment states.
- ML-011 thread differentiation, but do not split god-file randomly.
- ML-012/013/014 only if placement is proven; otherwise document owner decision.

### App-field / Partner Management

- ML-001 and ML-004 must use **Partner Management / قسم الشركاء** as the activation approval owner, not general operations.
- DocumentVerificationSection and VisitEvidenceSection were documented as created/exported in the taxonomy but parent screens may still not import them; agent must verify current local state before changing.
- Readiness escalation may be registered but not rendered by the field surface; verify before wiring.

### App-captain

Known risk in taxonomy:
- `DshCaptainMapScreen.tsx`, `DshCaptainPickupDropoffScreen.tsx`, and `DshCaptainPoDSubmissionScreen.tsx` may be registered/exported but not rendered by `DshCaptainSurface.tsx`.
- `OfferDeclineSheet.tsx` may be exported but not mounted in `DshCaptainOrdersScreen.tsx`.
- Do not split `DshCaptainSurface.tsx` broadly unless the inventory proves imports, registry, and render branches can be updated safely.

### App-partner

- Partner order lifecycle must stay in `OrdersInboxScreen.tsx` unless split is proven necessary.
- `PartnerVideoSubmissionPanel` ownership must be decided by content: catalog item evidence → inventory; campaign/ad evidence → promotions. Do not create a new route for uncertainty.

### Control Panel

Use precise names:
- `Screen` for full pages/routes.
- `Queue` for lists requiring triage.
- `Panel` for detail/action areas embedded in a screen.
- `Workspace` only for complex multi-action operator areas.

Correct bad naming:
- Do not create new `*Workspaces` files just to replace `closure-workspaces` with another vague name.
- Prefer domain names: `SupportTicketDetailPanel`, `SupportEscalationQueueScreen`, `PartnerActivationApprovalSection`, `FinanceRefundQueueScreen`, etc.

## Closure strategy

This package executes in loops:

1. Diagnose and record.
2. Apply a bounded fix.
3. Verify Git/TypeScript/search guards.
4. Update evidence.
5. Re-run diagnosis for remaining ML rows.
6. Move to next loop only when the current loop is DONE/BLOCKED with evidence.
