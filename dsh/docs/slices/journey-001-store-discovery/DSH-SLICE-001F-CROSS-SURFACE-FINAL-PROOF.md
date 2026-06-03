# DSH-SLICE-001F — Cross-Surface Final Proof

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-001F` |
| Parent Journey | J-001 — Store Discovery |
| Business Outcome | End-to-end proof that all three visibility gates work across all three surfaces in a single coherent flow |
| Primary Actor | Control-Panel Operator + Partner + Client |
| Primary Surface | control-panel + app-partner + app-client |
| WLT Boundary | No finance mutation |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-001C, 001D, and 001E all reaching PASS first |

## Scope
### Included
- Cross-surface integration test: gate toggled in control-panel → visible in app-partner → surfaces in app-client
- Full three-gate coherence proof

### Excluded
| Surface | Reason |
|---|---|
| Individual gate logic | Covered per-gate in 001C/D/E |
| Finance | Not applicable to J-001 |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-001F-01 | control-panel | PartnerStoresScreen | BLOCKED_WITH_REASON |
| CM-001F-02 | app-partner | InventoryCatalogScreen | BLOCKED_WITH_REASON |
| CM-001F-03 | app-client | StoreListScreen | BLOCKED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Toggle all 3 gates end-to-end | control-panel → app-partner → app-client | Multiple | Full J-001 flow | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| All gates ON — store discoverable | yes | BLOCKED |
| Any gate OFF — store hidden | yes | BLOCKED |
| Coherence across surfaces | yes | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-001C | upstream | must reach PASS |
| DSH-SLICE-001D | upstream | must reach PASS |
| DSH-SLICE-001E | upstream | must reach PASS |

## Evidence and Gates
- Runtime evidence: none yet — blocked
- Visual evidence: none yet
- Exit gate: 001C + 001D + 001E all at PASS; then cross-surface integration proof captured

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | Cannot close J-001 cross-surface proof until all three gate slices (001C/D/E) individually reach PASS |
| **Dependency** | DSH-SLICE-001C, DSH-SLICE-001D, DSH-SLICE-001E |
| **Next Action** | Close 001C/D/E; then execute cross-surface integration run |
