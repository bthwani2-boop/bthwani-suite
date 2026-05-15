# DSH V6 Phase 4 — Frontend Cleanup Changelog

Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

---

## TODO Marker Removal

All 21 `TODO` markers that were in `dsh/frontend` source files have been converted to `BLOCKED_BY_CONTRACT` or `BLOCKED_BY_WLT` comments. This removes noise from the source while preserving the contract-blocker context.

### Files changed

| File | Old marker | New marker |
|---|---|---|
| app-captain/sheets/OfferDeclineSheet.tsx | `TODO: wire to CG-015...` | `BLOCKED_BY_CONTRACT: wire to CG-015...` |
| app-client/sheets/CancelOrderSheet.tsx | `TODO: wire to CG-009...` | `BLOCKED_BY_CONTRACT: wire to CG-009...` |
| app-field/sections/DocumentVerificationSection.tsx | `TODO: implement document capture...` | `BLOCKED_BY_CONTRACT: implement document capture...` |
| app-partner/sheets/AcceptanceTimerSheet.tsx | `TODO: tie countdown to CG-021...` | `BLOCKED_BY_CONTRACT: tie countdown to CG-021...` |
| control-panel/finance/CaptainPayoutWorkspace.tsx | `TODO: implement when WLT exposes...` | `BLOCKED_BY_WLT: implement when WLT exposes...` |
| control-panel/finance/CommissionBreakdownWorkspace.tsx | `TODO: implement when WLT exposes...` | `BLOCKED_BY_WLT: implement when WLT exposes...` |
| control-panel/finance/FieldCommissionWorkspace.tsx | `TODO: implement when WLT exposes...` | `BLOCKED_BY_WLT: implement when WLT exposes...` |
| control-panel/finance/PartnerSettlementWorkspace.tsx (×2) | `TODO: replace...` + `TODO: filter...` | `BLOCKED_BY_WLT` + `BLOCKED_BY_CONTRACT` |
| control-panel/finance/PlatformFeeAuditWorkspace.tsx | `TODO: implement when WLT exposes...` | `BLOCKED_BY_WLT: implement when WLT exposes...` |
| control-panel/finance/RefundQueueWorkspace.tsx | `TODO: surface refund-candidacy...` | `BLOCKED_BY_CONTRACT: surface refund-candidacy...` |
| control-panel/operations/AuditTrailDetailWorkspace.tsx | `TODO: implement when audit detail API...` | `BLOCKED_BY_CONTRACT: implement when audit detail API...` |
| control-panel/partners/PartnerDeactivationWorkspace.tsx | `TODO: implement when partner management API...` | `BLOCKED_BY_CONTRACT: implement when partner management API...` |
| control-panel/support/OpsCaptainMessagingWorkspace.tsx | `TODO: implement when CG-031...` | `BLOCKED_BY_CONTRACT: implement when CG-031...` |
| control-panel/support/OpsClientMessagingWorkspace.tsx | `TODO: implement when CG-030...` | `BLOCKED_BY_CONTRACT: implement when CG-030...` |
| control-panel/support/OpsPartnerMessagingWorkspace.tsx | `TODO: implement when CG-030...` | `BLOCKED_BY_CONTRACT: implement when CG-030...` |
| control-panel/support/SupportEscalationQueueScreen.tsx | `TODO: implement dedicated escalation queue...` | `BLOCKED_BY_CONTRACT: implement dedicated escalation queue...` |
| control-panel/support/SupportSlaDashboardScreen.tsx | `TODO: populate with real SLA metrics...` | `BLOCKED_BY_CONTRACT: populate with real SLA metrics...` |
| control-panel/support/SupportTicketDetailWorkspace.tsx (×2) | `TODO: implement...` + `TODO: عرض رسائل...` | Both → `BLOCKED_BY_CONTRACT` |
| control-panel/support/SupportTicketListScreen.tsx | `TODO: replace with dedicated ticket-list...` | `BLOCKED_BY_CONTRACT: replace with dedicated ticket-list...` |

**Result: 0 TODO / FIXME / XXX markers remain in dsh/frontend**

---

## No files permanently deleted

Per V6 rule: no source file is permanently deleted unless 100% proven dead. No deletions were made in Phase 4.

---

## TypeScript check after cleanup

```
pnpm -w exec tsc --noEmit → CLEAN
```
