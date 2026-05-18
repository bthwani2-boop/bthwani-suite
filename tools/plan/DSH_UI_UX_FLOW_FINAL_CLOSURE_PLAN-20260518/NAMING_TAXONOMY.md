# Naming and Structure Taxonomy

Use this taxonomy for every file/folder/ML row.

| Type | Meaning | Allowed where | Examples |
|---|---|---|---|
| Screen | Full page/route with independent navigation | Mobile or Control Panel | `DshCaptainPickupDropoffScreen.tsx`, `SupportTicketListScreen.tsx` |
| Section | Part of an existing screen | Mobile or Control Panel | `DocumentVerificationSection.tsx` |
| Sheet | Fast contextual action | Mostly mobile | `CancelOrderSheet.tsx`, `OfferDeclineSheet.tsx` |
| State | Render state inside existing screen | All surfaces | `payment_failed`, `ready_for_pickup` |
| Panel | Detail/action area inside Control Panel screen | Control Panel | `PartnerActivationApprovalPanel.tsx` |
| Queue | Operational list needing triage | Control Panel | `SupportEscalationQueueScreen.tsx` |
| Workspace | Complex multi-action operator area | Control Panel only, rare | `SupportTicketDetailWorkspace.tsx` if it truly combines detail, thread, actions, status, audit |

## Workspace abuse rule

Do not throw `Workspace` into names as a generic replacement for `closure-workspaces`.

Wrong:

```text
ControlPanelDshPartnerLifecycleWorkspaces.tsx
DshClientCheckoutWorkspace.tsx
DshPartnerOrdersWorkspace.tsx
```

Better:

```text
PartnerActivationApprovalSection.tsx
DshClientCheckoutIntentScreen.tsx
DshPartnerOrdersScreen.tsx
SupportEscalationQueueScreen.tsx
SupportTicketDetailPanel.tsx
```

## closure-workspaces rule

`closure-workspaces` may remain only in docs/evidence. In frontend, it must be replaced by precise domain names after verifying imports/exports.
