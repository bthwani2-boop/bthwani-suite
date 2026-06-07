# DSH-SLICE-008A — Provider Policy

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-008A` |
| Parent Journey | J-008 — Platform Vars & Provider |
| Business Outcome | All DSH surfaces consume platform variables via a single provider; no scattered env-var reads |
| Primary Actor | All surfaces |
| Primary Surface | platform route / PlatformVarsProvider |
| WLT Boundary | N/A |
| Current Status | BLOCKED_WITH_REASON |
| Blocking Reason | None (Centralized PlatformVarsProvider fully implemented, integrated, and enforced by guardrail) |

## Scope
### Included
- PlatformVarsProvider contract: which vars are exposed, types, defaults
- Policy: surfaces read from provider only; no direct process.env reads in UI code
- Provider initialization at app root

### Excluded
| Surface | Reason |
|---|---|
| Feature flags | Covered in 008B |
| Scope audit | Covered in 008C |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-008A-01 | all apps | PlatformVarsProvider root | PASS |
| CM-008A-02 | platform route | vars contract | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| N/A — provider is infrastructure, not a user CTA | N/A | N/A | N/A | NOT_APPLICABLE_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| provider initialized | yes | PASS |
| vars available | yes | PASS |
| provider error | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-008B | downstream | feature flags built on top of provider |
| DSH-SLICE-008C | downstream | scope audit requires provider policy to be defined |

## Evidence and Gates
- Runtime evidence: [PlatformVarsProvider.tsx](file:///c:/bthwani-suite/dsh/frontend/shared/platform/PlatformVarsProvider.tsx) and [guard-platform-vars-control.mjs](file:///c:/bthwani-suite/tools/guards/guard-platform-vars-control.mjs)
- Visual evidence: N/A (Infrastructure policy)
- Exit gate: All 5 app roots wrap their component tree with `PlatformVarsProvider`; all API clients and transports read via `PlatformVarsRegistry`; static analysis guard prevents direct `process.env` reads in DSH UI code.

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | BLOCKED_WITH_REASON |
| **Reason** | Centralized PlatformVarsProvider fully implemented and integrated across all DSH surfaces. TypeScript compiler passes cleanly, and static analysis guard enforces zero scattered process.env reads. |
| **Dependency** | None |
| **Next Action** | Finalize closure and generate verification evidence zip. |
