# DSH V6 Phase 4 — God-File Split Decisions

Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

These files contain multiple logical screens/flows. Splitting requires human owner approval because:
1. Each file has complex inter-screen navigation state
2. Splitting can break existing routing and surface host wiring
3. Shared state management must be untangled carefully

No split is executed in V6. Plans are documented here for human review and Loop 7 execution.

---

## God-File 1: OperationScreens.tsx (app-client)

**File:** `dsh/frontend/app-client/screens/OperationScreens.tsx`
**Affected gap:** ML-011 (thread_type differentiation), ML-030 (extracted support workspace)
**Risk:** HIGH — hosts client operation screens hub; referenced by client surface routing

### Logical units to extract

| Proposed file | Current location | Screens/components |
|---|---|---|
| `DshConversationHubScreen.tsx` | `OperationScreens.tsx:667` | Client↔captain and client↔ops chat workspace |
| `DshOrderIssueHubScreen.tsx` | `OperationScreens.tsx:688` | Order issue reporting and escalation |
| Keep `OperationScreens.tsx` | — | Route registry and remaining operation screens |

### Split prerequisites

1. Full import/export audit of `OperationScreens.tsx` to identify all consumers
2. Route registry update for each extracted screen
3. Human owner confirmation of split boundary between DshConversationHubScreen and DshOrderIssueHubScreen
4. TypeScript clean verification after split

### Owner decision required

**Blocker:** Which screens should be extracted vs kept in `OperationScreens.tsx`? The thread_type differentiation (ML-011) depends on whether the conversation workspace becomes a standalone screen or stays embedded.

---

## God-File 2: DshCaptainSurface.tsx (app-captain)

**File:** `dsh/frontend/app-captain/DshCaptainSurface.tsx`
**Affected gaps:** ML-028 (offer detail state), ML-030 (support workspace extraction)
**Risk:** VERY HIGH — 1400+ line surface file; hosts all captain tab navigation

### Logical units to extract

| Proposed file | Content | Gap |
|---|---|---|
| `DshCaptainAccountScreen.tsx` | Captain account/profile/finance hub (6 render functions: renderCaptainAccountRootScreen, renderCaptainAccountFinanceScreen, etc.) | None blocking |
| `DshCaptainOrderAcceptScreen.tsx` | Offer detail + accept state machine | ML-028 |
| `DshCaptainSupportDirectoryScreen.tsx` | Support directory and sub-screens | ML-030 |

### Split prerequisites

1. Map all `route` state transitions in `DshCaptainSurface.tsx` — there are 10+ route values
2. Identify shared state (selectedSupportScreen, inboxState) dependencies between extracted units
3. Confirm `openCaptainSupportScreen` navigation function signature remains stable
4. Human owner confirmation on which tab owns offer-detail vs inbox

### Owner decision required

**Blocker:** ML-028 — offer detail state is inside the main surface. Does accepting an offer navigate to a new screen (route change) or open a sub-panel? This determines where `DshCaptainOrderAcceptScreen.tsx` lives.

---

## God-File 3: PartnerHubScreen.tsx (app-partner)

**File:** `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx`
**Affected gaps:** ML-017 (availability toggle), ML-021 (captain-assigned state)
**Risk:** MEDIUM — partner hub with 3 logical views

### Logical units to extract

| Proposed file | Content |
|---|---|
| `PartnerOrderConversationPanel.tsx` | Conversation panel embedded in hub (already named separately in gap map) |
| `PartnerAvailabilityToggle.tsx` | Availability toggle component (ML-017) |

### Split prerequisites

1. Confirm `PartnerOrderConversationPanel` is a named export or embedded component
2. Verify availability toggle doesn't share state with order inbox
3. Human owner confirmation on panel layout

### Owner decision required

**Blocker:** ML-017 — availability toggle: does it live on PartnerHubScreen or PartnerEntryScreen? The split boundary depends on this decision.

---

## Summary

| God-file | Split loops | Prereq |
|---|---|---|
| OperationScreens.tsx | Loop 7 | Human owner decision on thread_type placement |
| DshCaptainSurface.tsx | Loop 7 | Human owner decision on offer-detail placement |
| PartnerHubScreen.tsx | Loop 7 | Human owner decision on availability toggle placement |

**None of these splits are executed in V6. This document is the evidence required before human approval.**
