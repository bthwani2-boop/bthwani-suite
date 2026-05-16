# DSH V7 Control Panel Surface Wiring Decision

Date: 2026-05-16
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

---

## Findings

### DshControlPanelSurfaceHost — Single-Module Architecture

`DshControlPanelSurfaceHost` imports only from `./operations` and renders only `ControlPanelDshOperationsScreen`. This is intentional — the surface host is not a router for the entire control panel.

```typescript
// DshControlPanelSurfaceHost.tsx (actual)
export function DshControlPanelSurfaceHost({ workspace = 'overview', orderId, orderOverlayMode }) {
  return <ControlPanelDshOperationsScreen group={normalizedLocation.group} ... />;
}
```

All non-operations modules (catalogs, finance, support, partners) are Next.js pages with their own routes. They are NOT mounted through DshControlPanelSurfaceHost.

### What Is and Is Not Accessible Through the Host

| Module | Accessible through host? | Reason |
|---|---|---|
| operations (11 screens) | YES | ControlPanelDshOperationsScreen is the sole render target |
| catalogs | NO | Separate Next.js page |
| finance | NO | Separate Next.js page |
| support | NO | Separate Next.js page |
| partners | NO | Separate Next.js page |

---

## V7-3 Decision: Do NOT extend DshControlPanelSurfaceHost

Extending the host to mount all other modules would require:
1. Architectural routing changes to DshControlPanelSurfaceHost (owner decision required)
2. Next.js page routing changes (infrastructure)
3. No API contracts for finance/support/partners/catalog sub-modules

**Decision:** Leave DshControlPanelSurfaceHost as-is. All EXPORTED_ONLY control-panel skeleton files (ML-001, ML-032 through ML-052) remain EXPORTED_ONLY_BLOCKED_BY_CONTRACT or EXPORTED_ONLY_BLOCKED_BY_WLT.

---

## Catalog Exception (ML-053/054) — Wired in V7-2d

`ControlPanelDshCatalogScreen` is a standalone Next.js page. `ItemApprovalSection` and `CatalogPublishingGateSection` were wired into it as sub-tab content in the 'approvals' tab:

- `activeTab === 'approvals' && activeSubTab === 'quality'` → renders `ItemApprovalSection` (ML-053)
- `activeTab === 'approvals' && activeSubTab === 'pricing'` → renders `CatalogPublishingGateSection` (ML-054)

These do not require DshControlPanelSurfaceHost changes.

---

## Modules That Remain Blocked Until Owner Decision

Any architectural change to DshControlPanelSurfaceHost to mount additional modules requires explicit human owner approval. Until that decision:

- All control-panel/support/* skeletons (ML-032 through ML-052): EXPORTED_ONLY_BLOCKED_BY_CONTRACT
- All control-panel/finance/* skeletons (ML-040 through ML-045): EXPORTED_ONLY_BLOCKED_BY_WLT
- control-panel/partners/* skeletons (ML-001, ML-038): EXPORTED_ONLY_BLOCKED_BY_CONTRACT
