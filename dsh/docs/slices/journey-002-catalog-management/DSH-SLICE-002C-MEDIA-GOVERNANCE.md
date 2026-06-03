# DSH-SLICE-002C — Media Governance

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-002C` |
| Parent Journey | J-002 — Catalog Management |
| Business Outcome | Product media (images, videos) governed by DSH media manifest rules; no local copies |
| Primary Actor | Partner (app-partner) |
| Primary Surface | app-partner / ProductMediaScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | No API contract; media upload pipeline not designed; depends on 002A |

## Scope
### Included
- Media upload via DSH media pipeline (no local copies — see 007B/007C governance)
- Image/video assignment to products
- Media manifest compliance check

### Excluded
| Surface | Reason |
|---|---|
| Media fixture governance rules | Covered as perpetual governance in 007B/007C |
| Category media | Out of scope for initial slice |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-002C-01 | app-partner | ProductMediaScreen | DEFERRED_WITH_REASON |
| CM-002C-02 | backend | POST /media + media manifest | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Upload product image | app-partner | ProductMediaScreen | POST /media | DEFERRED_WITH_REASON |
| Remove media | app-partner | ProductMediaScreen | DELETE /media/{id} | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| no media | yes | TBD |
| uploading | yes | TBD |
| upload error | yes | TBD |
| media present | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002A | upstream | product must exist before media can be attached |
| DSH-SLICE-007B | lateral | media fixture governance rules govern upload pipeline |
| DSH-SLICE-007C | lateral | no-local-copies rule applies |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 002A PASS + media pipeline designed + manifest compliance verified + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Media pipeline not designed; depends on 002A |
| **Dependency** | DSH-SLICE-002A; media upload API design |
| **Next Action** | Design media API after 002A; ensure 007B/007C governance compliance |
