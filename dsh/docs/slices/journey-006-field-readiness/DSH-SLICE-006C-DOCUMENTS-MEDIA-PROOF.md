# DSH-SLICE-006C — Documents & Media Proof

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-006C` |
| Parent Journey | J-006 — Field Readiness |
| Business Outcome | Field agent uploads required documents and photos as proof for partner readiness review |
| Primary Actor | Field Agent |
| Primary Surface | app-partner (field mode) / DocumentUploadScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-006B (field visit evidence) |

## Scope
### Included
- Document upload (business license, health certificate, etc.)
- Photo proof (storefront, interior)
- Media governance compliance per 007B/007C

### Excluded
| Surface | Reason |
|---|---|
| Field visit check-in | Covered in 006B |
| Readiness escalation | Covered in 006D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-006C-01 | app-partner | DocumentUploadScreen | DEFERRED_WITH_REASON |
| CM-006C-02 | backend | POST /stores/{id}/documents | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Upload document | app-partner | DocumentUploadScreen | POST /stores/{id}/documents | DEFERRED_WITH_REASON |
| Upload photo proof | app-partner | DocumentUploadScreen | POST /stores/{id}/documents (type=photo) | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| no documents | yes | TBD |
| uploading | yes | TBD |
| documents complete | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-006B | upstream | field visit must be submitted first |
| DSH-SLICE-007B | lateral | media manifest governance applies |
| DSH-SLICE-006D | downstream | escalation triggered if documents incomplete |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 006B PASS + document API designed + 007B/007C compliance verified + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Field visit (006B) not proven |
| **Dependency** | DSH-SLICE-006B |
| **Next Action** | Await 006B PASS; then design document upload API |
