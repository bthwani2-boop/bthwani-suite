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
| Current Status | PASS |
| Blocking Reason | none |

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
| CM-002C-01 | app-partner | ProductMediaScreen | PASS |
| CM-002C-02 | backend | POST /media + media manifest | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Upload product image | app-partner | ProductMediaScreen | POST /media | PASS |
| Remove media | app-partner | ProductMediaScreen | DELETE /media/{id} | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| no media | yes | PASS |
| uploading | yes | PASS |
| upload error | yes | PASS |
| media present | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-002A | upstream | product must exist before media can be attached |
| DSH-SLICE-007B | lateral | media fixture governance rules govern upload pipeline |
| DSH-SLICE-007C | lateral | no-local-copies rule applies |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_SLICE_002C_MEDIA_GOVERNANCE_FINAL_CLOSURE-20260604-055952/09-runtime-request-response-proof.txt`
- Visual evidence: ProductMediaScreen RTL Arabic implementation
- Exit gate: PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | Media pipeline designed; Postgres schema migrated; API endpoints POST /media & DELETE /media/{id} validated against MANIFEST.local-required.tsv; React Native ProductMediaScreen UI fully integrated. |
| **Dependency** | None |
| **Next Action** | proceed to next slice |
