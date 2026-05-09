# BThwani Final Merged Engineering Baseline V1

**Document:** `BTHWANI_FINAL_MERGED_ENGINEERING_BASELINE_V1.md`
**Suggested repo target:** `C:\bthwani-suite\governance\BTHWANI_FINAL_MERGED_ENGINEERING_BASELINE_V1.md`
**Project:** BThwani / `bthwani-suite`
**Canonical local repo:** `C:\bthwani-suite`
**Canonical GitHub repo:** `bthwani2-boop/bthwani-suite`
**Current branch reference:** `ghb/safe-replay-apps-control-panel-20260509-024017`
**Merged from:**
- `BTHWANI_UNIFIED_ENGINEERING_SCREEN_FLOW_BASELINE_V1.md`
- `BTHWANI_ENGINEERING_BASELINE_FORENSIC_REVIEW_V1.md`
**Mode:** Final merged governance baseline; no repository write performed.
**Generated:** 2026-05-09
**Prepared for:** Beginner developer relying heavily on AI agents.

---

## Merge Verdict

This file is the single consolidated baseline that merges:

1. The **current-branch-aware unified baseline**, including the corrected workspace structure, screen/flow/binding/integration safety, AI-agent protections, and current path rules.
2. The **deep engineering forensic baseline**, including React Compiler, Next/CSS/HTML, Go, Expo/mobile runtime, API contracts, state machines, idempotency, money safety, security, observability, local runtime, release, testing, ADR, and guard strategy.

### Precedence Rules

When the two source documents overlap, this merged file uses the following precedence:

| Case | Precedence |
|---|---|
| Current branch/path scope | Use current branch structure from `pnpm-workspace.yaml` in the unified file |
| Engineering risk/domain detail | Use the deeper domain matrix from the Engineering Baseline |
| Screen linking/merge safety | Use Screen Flow Binding Integration Contract from the Unified Baseline |
| Contradiction between old and current paths | Current branch evidence wins |
| Unproven implementation status | Mark as `GAP/TBD`, never `PASS` |
| AI execution behavior | Strict inspect-first, narrow-scope, evidence-first rule wins |

### Non-Negotiable Interpretation

```text
This document is mandatory after adoption.
It is not proof that all items are already implemented.
It cannot honestly guarantee eternal zero gaps.
It can only be superseded by stronger evidence, newer standards, or verified project constraints.
Any item not proven in the repository remains GAP/TBD/BLOCKED until closed with evidence.
```

---

# Part A — Current Branch, Scope, Evidence, and Executive Baseline

## 0. Executive Decision

This document consolidates everything discussed and agreed in the conversation into one operational baseline.

The highest-level decision is:

```text
BThwani must be developed through evidence-first, contract-first, guard-first engineering.
No AI agent may modify screens, UI, UX, flow, binding, integration, runtime, API, or architecture before proving the current branch structure and allowed scope.
```

The practical baseline is:

```text
1. Prove current structure from pnpm-workspace.yaml.
2. Never use old paths unless current branch evidence proves them.
3. Treat React Compiler, Next/CSS/HTML, Go, security, observability, state machines, API contracts, and screen linking as readiness-gated baselines.
4. Do not enable powerful tools globally without a read-only audit.
5. Do not accept UI changes without visual evidence.
6. Do not accept flow/binding/integration changes without contracts.
7. Do not claim PASS, CLOSED, DONE, or 100% without evidence.
```

---

## 1. Truth Boundary

The user requested strict accuracy, zero contradiction, zero gaps, and finality. The correct engineering interpretation is:

```text
This document can be mandatory after adoption.
It cannot honestly claim eternal completeness.
It may only be superseded by stronger evidence, newer standards, or verified project constraints.
Any item not proven in the repository remains GAP/TBD/BLOCKED until closed with evidence.
```

This document is therefore a **mandatory baseline candidate**, not proof that every item already exists.

---

## 2. Evidence Snapshot from Current Branch

### 2.1 Branch

Current branch:

```text
ghb/safe-replay-apps-control-panel-20260509-024017
```

### 2.2 Correct workspace structure

`pnpm-workspace.yaml` establishes the current workspace as:

```text
webapp
website
webapp/runtime
website/runtime
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
ui-kit
dsh
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

`nodeLinker`:

```text
hoisted
```

### 2.3 Forbidden old structure unless locally proven

These paths must not be used as active target scope unless proven in the current branch:

```text
apps/mobile/*
apps/web/*
packages/surfaces
packages/app-shells
packages/ui-kit
```

### 2.4 Root stack

The root `package.json` confirms:

```text
react: 19.1.0
react-dom: 19.1.0
react-native: 0.81.0
next: 16.2.2
expo: ~54.0.0
nx: 22.3.3
typescript: 5.9.3
pnpm: 8.15.0
tamagui: 2.0.0-rc.41
```

Existing scripts include:

```text
serve:surfaces
build:surfaces
build:mobile-control-panel
guard:agent-governance
guard:i18n-direction
guard:i18n-direction:mobile-control-panel
guard:service-blueprint
guard:test-coverage
guard:binding-proof
guard:patch-review
guard:visual
guard:rtl-visual
guard:secret-scan
guard:runtime-smoke
precommit:fast
guard:protected-tokens
guard:tamagui-law
guard:tamagui-import-boundary
tamagui:version
tamagui:build
tamagui:check
```

### 2.5 Control panel runtime

`control-panel/runtime/package.json` confirms:

```text
name: @bthwani/control-panel
next: 16.2.2
react: 19.1.0
react-dom: 19.1.0
react-native-web: 0.21.2
@bthwani/ui-kit: workspace:*
dev: next dev --webpack -p 3000
build: next build --webpack
start: next start -p 3000
```

### 2.6 UI kit

`ui-kit/package.json` confirms:

```text
name: @bthwani/ui-kit
main: ./src/index.ts
exports:
  .       -> ./src/index.ts
  ./web   -> ./src/web.ts
  ./mobile-> ./src/mobile.ts
  ./next  -> ./src/next.ts
sideEffects: false
react: 19.1.0
react-native: 0.81.0
next peer: 16.2.2
tamagui: 2.0.0-rc.41
```

### 2.7 Mobile runtimes

Current runtime paths:

```text
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
```

They use:

```text
@bthwani/ui-kit
expo
expo-dev-client
react 19.1.0
react-native 0.81.0
```

---

## 3. Correction of Previous Scope Error

A previous prompt draft used old paths. That was incorrect for this branch.

### 3.1 Error

Incorrect old scope:

```text
apps/mobile/app-client
apps/mobile/app-partner
apps/mobile/app-captain
apps/mobile/app-field
apps/web/control-panel
apps/web/webapp
apps/web/website
packages/surfaces
packages/app-shells
packages/ui-kit
```

### 3.2 Correct rule

```text
No path may be used in implementation prompts until pnpm-workspace.yaml and/or local tree evidence proves it exists on the current branch.
```

### 3.3 AI-agent protection

Because the user is a beginner and relies on AI, every AI task must start with:

```text
git branch --show-current
git rev-parse HEAD
Get-Content .\pnpm-workspace.yaml
```

And every AI task must explicitly reject old paths unless proven.

---

## 4. Evidence Classification

| Class | Meaning | Closure rule |
|---|---|---|
| CONFIRMED | Proven by current evidence | Can be referenced as current fact |
| OBSERVED_LOCAL | Reported by user from local terminal | Useful but should be rerun for adoption |
| BASELINE_REQUIRED | Must be implemented/adopted going forward | Not automatically implemented |
| GAP/TBD | Recommended or likely needed, but not proven | Must not be called PASS |
| BLOCKED | Cannot proceed safely | Requires evidence or decision first |
| DEFERRED_WITH_RISK | Intentionally delayed | Must document risk |

---

## 5. Master Baseline Matrix

| # | Baseline area | Why it matters | Priority |
|---:|---|---|---|
| 1 | Current-branch structure discovery | Prevents old path hallucinations | P0 |
| 2 | Screen Flow Binding Integration Contract | Prevents screen/linking merge damage | P0 |
| 3 | UI-kit/Tamagui ownership | Prevents duplicate local design systems | P0 |
| 4 | React Compiler readiness | Performance + hooks/memo discipline | P1 |
| 5 | Next server/client boundary | Reduces JS/hydration/performance issues | P1 |
| 6 | CSS RTL logical properties | Prevents Arabic/RTL layout breakage | P1 |
| 7 | Semantic HTML + a11y | Prevents unusable web/control-panel UI | P1 |
| 8 | Bundle analysis | Detects hidden bloat and heavy imports | P2 |
| 9 | Go backend foundation | Prevents backend drift if Go is adopted | P1 |
| 10 | API contracts + contract tests | Prevents app/API mismatch | P0 |
| 11 | Domain state machines | Prevents invalid order/payment/wallet states | P0 |
| 12 | Idempotency | Prevents duplicate orders/payments/refunds | P0 |
| 13 | Outbox + event versioning | Prevents distributed workflow inconsistency | P1 |
| 14 | Money/currency safety | Prevents wallet/settlement errors | P0 |
| 15 | RBAC + object authorization | Prevents tenant/role data leaks | P0 |
| 16 | Audit logs | Proves sensitive actions | P0 |
| 17 | Observability | Makes failures diagnosable | P1 |
| 18 | DB migrations + backup/restore | Prevents data loss | P0 |
| 19 | Feature flags + kill switches | Enables safe rollout/emergency stop | P1 |
| 20 | Release/rollback policy | Prevents unsafe deployment | P1 |
| 21 | Supply-chain security | Prevents dependency/artifact risk | P1 |
| 22 | Privacy/PII policy | Prevents leakage in logs/evidence | P1 |
| 23 | Local runtime parity | Prevents false local confidence | P1 |
| 24 | Testing strategy | Ensures critical flows are protected | P1 |
| 25 | ADR/decision log | Prevents repeated decision drift | P2 |

---

---

# Part B — Deep Engineering Baseline and Mandatory Hardening Matrix

## 4. Severity and Priority Model

### 4.1 Numerical scoring

Each item is scored from 1 to 5 in four dimensions.

| Dimension | Meaning |
|---|---|
| **Impact** | Damage if missing or wrong |
| **Probability** | Likelihood of becoming a real issue |
| **Exposure** | Number of surfaces/services affected |
| **Reversibility Risk** | Difficulty of fixing later |

```text
Raw Risk Score = Impact × Probability × Exposure × Reversibility Risk
Maximum = 5 × 5 × 5 × 5 = 625
Normalized Score = round((Raw Risk Score / 625) × 100)
```

### 4.2 Priority bands

| Priority | Score | Meaning |
|---|---:|---|
| **P0** | 85–100 | Must be addressed before production-grade closure |
| **P1** | 70–84 | High priority; should be in near-term hardening |
| **P2** | 50–69 | Important; schedule after P0/P1 |
| **P3** | 25–49 | Useful; adopt when domain reaches maturity |
| **P4** | 1–24 | Optional or context-dependent |

---

## 5. Master Risk Register

| # | Domain | Risk if missing | Score | Priority | Status |
|---:|---|---|---:|---|---|
| 1 | State machines for orders/payment/wallet | Invalid lifecycle transitions, financial inconsistency | 100 | P0 | BASELINE_REQUIRED |
| 2 | Idempotency | Duplicate orders, duplicate charges, duplicate refunds | 100 | P0 | BASELINE_REQUIRED |
| 3 | RBAC + object-level authorization | Unauthorized control-panel or tenant access | 96 | P0 | BASELINE_REQUIRED |
| 4 | API contracts + contract tests | Mobile/web break after API changes | 92 | P0 | BASELINE_REQUIRED |
| 5 | Money/currency safety | Settlement, wallet, commission calculation errors | 92 | P0 | BASELINE_REQUIRED |
| 6 | Audit logs | No proof for sensitive changes or financial operations | 88 | P0 | BASELINE_REQUIRED |
| 7 | DB migrations + backup/restore | Data loss, broken deployments, unrecoverable schema changes | 88 | P0 | BASELINE_REQUIRED |
| 8 | Observability | Failures become invisible or undiagnosable | 84 | P1 | BASELINE_REQUIRED |
| 9 | Local runtime parity | Local testing differs from production behavior | 84 | P1 | BASELINE_REQUIRED |
| 10 | Supply chain security | Dependency compromise or untraceable build artifact | 80 | P1 | BASELINE_REQUIRED |
| 11 | React Compiler readiness | Performance waste, hooks/memo issues not surfaced | 76 | P1 | GAP/TBD |
| 12 | Next server/client boundaries | Excess JS, slow UI, hydration risk | 76 | P1 | GAP/TBD |
| 13 | CSS RTL logical properties | Arabic/RTL layout defects and drift | 76 | P1 | GAP/TBD |
| 14 | UI Kit/Tamagui boundary enforcement | Local design systems and broken cross-platform authority | 76 | P1 | PARTIALLY_GUARDED |
| 15 | Feature flags + kill switches | Unsafe releases, no emergency shutdown path | 72 | P1 | BASELINE_REQUIRED |
| 16 | Mobile runtime/version discipline | Incompatible OTA updates or native mismatch | 72 | P1 | BASELINE_REQUIRED |
| 17 | Go backend foundation | Backend drift if Go is adopted without contracts | 70 | P1 | GAP/TBD |
| 18 | Accessibility gates | Broken keyboard/focus/forms, poor control-panel usability | 68 | P2 | GAP/TBD |
| 19 | Bundle analysis | Hidden bundle bloat and bad imports | 64 | P2 | GAP/TBD |
| 20 | Security headers/CSP | Browser security surface remains weak | 64 | P2 | BASELINE_REQUIRED |
| 21 | Threat modeling | Critical flows designed without abuse scenarios | 64 | P2 | BASELINE_REQUIRED |
| 22 | Incident response | Crisis response becomes improvised | 60 | P2 | BASELINE_REQUIRED |
| 23 | Visual regression evidence | UI regressions accepted by code-only checks | 60 | P2 | PARTIALLY_GUARDED |
| 24 | Container queries/CSS layers | CSS drift and responsive card instability | 52 | P2 | GAP/TBD |
| 25 | Sentry/error monitoring | Client/runtime errors not centralized | 52 | P2 | GAP/TBD |

---

## 6. Mandatory Baseline Domains

The following domains form the proposed mandatory baseline.

---

# DOMAIN A — Governance, Evidence, and Adoption Discipline

## A.1 Problem

The project can drift if recommendations are treated as optional opinions or if implementation is accepted without evidence.

## A.2 Baseline rules

1. No claim of `PASS`, `READY`, `CLOSED`, `DONE`, or `100%` without evidence.
2. Every change must distinguish:
   - Canonical
   - Current
   - Legacy
   - Temporary
   - TBD
3. High-risk changes require:
   - read-only audit,
   - scoped implementation,
   - verification,
   - patch/evidence review.
4. No broad tool adoption without a readiness check.
5. No dependency/tool upgrade just because it is modern.
6. No local uncommitted state can be treated as known unless evidence is provided.
7. UI changes require visual evidence, not only TypeScript success.

## A.3 Required evidence

```text
git status
git diff --check
typecheck/build/test output
patch or changed-file evidence
screenshots for UI
runtime logs for behavior
evidence pack for scripts
```

## A.4 Required guards

```text
CHECK_ENGINEERING_BASELINE_COVERAGE
CHECK_GOVERNANCE_EVIDENCE_CLOSURE
CHECK_SCOPE_AND_FORBIDDEN_CHANGES
```

---

# DOMAIN B — Architecture Authority and Monorepo Boundaries

## B.1 Problem

The largest architecture risk is uncontrolled ownership drift.

## B.2 Mandatory rules

1. UI ownership must remain:

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

2. No raw Tamagui imports outside ui-kit.
3. No local design system inside apps/surfaces.
4. No duplicate headers, cards, tokens, buttons, nav systems, or visual foundations unless explicitly classified.
5. No broad file/folder movement without import/consumer evidence.
6. No legacy repo/path target usage.
7. Public exports must be explicit and reviewed.
8. Runtime/API/backend must not be changed during UI-only tasks.

## B.3 Required guards

```text
guard:tamagui-law
guard:tamagui-import-boundary
CHECK_LOCAL_DESIGN_SYSTEM_DRIFT
CHECK_UIKIT_PUBLIC_EXPORT_CONSUMERS
CHECK_SURFACE_APP_BOUNDARY_DRIFT
```

---

# DOMAIN C — React 19 and React Compiler

## C.1 Confirmed fact

React 19 is confirmed in the root package configuration.

## C.2 Forensic finding

React Compiler package presence in lockfile is not the same as active compiler enablement.

A valid activation requires evidence in configuration such as:

```text
next.config.*
babel.config.*
metro.config.*
```

or explicit usage policy such as:

```text
reactCompiler
babel-plugin-react-compiler
"use memo"
"use no memo"
```

## C.3 Mandatory adoption rule

React Compiler must be adopted in phases only.

### Phase C1 — Readiness

```text
Detect package presence
Detect Next/Babel/Metro config
Detect incompatible patterns
Detect hooks/rules violations
Detect heavy candidate components
Detect manual memoization noise
```

### Phase C2 — Web-only pilot

Start with a limited Next/web target.

Do not enable globally across all mobile apps in the first pass.

### Phase C3 — Verification

Required evidence:

```text
typecheck
web build
runtime smoke
screen visual evidence
bundle/runtime comparison if available
compiler diagnostics
```

## C.4 What React Compiler is allowed to solve

| Area | Expected effect |
|---|---|
| Manual memo noise | Reduce unnecessary `useMemo`, `useCallback`, `React.memo` |
| Re-render optimization | Improve performance where compiler can safely optimize |
| React rule feedback | Surface unsupported patterns via diagnostics/lint |
| Cognitive load | Reduce manual optimization burden |

## C.5 What React Compiler does not solve

| Area | Not solved |
|---|---|
| TypeScript correctness | No |
| API correctness | No |
| Business logic | No |
| RTL correctness | No |
| Accessibility | No |
| Security | No |
| Data consistency | No |
| Payment correctness | No |

## C.6 Required guard

```text
CHECK_REACT_COMPILER_READINESS
```

Minimum checks:

```text
babel-plugin-react-compiler in package/lockfile
reactCompiler in Next config
Babel plugin order if Babel is used
Metro/Expo compatibility before mobile enablement
rules-of-react lint diagnostics
"use memo" adoption only when scoped
changed-file evidence
```

---

# DOMAIN D — Next.js Web Foundation

## D.1 Problem

Next.js performance depends heavily on server/client boundaries, image/font/script policies, routing, metadata, caching, and bundle shape.

## D.2 Mandatory rules

1. Keep pages/layouts server-first where possible.
2. Use client components only for actual interaction.
3. Do not place `"use client"` at broad route or screen boundaries unless necessary.
4. Use `next/image` for web images where applicable.
5. Use `next/font` or a centralized font strategy.
6. Use Metadata API for website/webapp public routes.
7. Use `next/script` for third-party scripts; no raw uncontrolled script injection.
8. Introduce cache/PPR features only after route-level readiness.
9. Bundle analysis is required before blaming React/Next performance.
10. Do not add third-party client code without performance/security review.

## D.3 Required guards

```text
CHECK_NEXT_SERVER_CLIENT_BOUNDARY
CHECK_NEXT_IMAGE_FONT_SCRIPT_USAGE
CHECK_NEXT_METADATA_BASELINE
CHECK_NEXT_BUNDLE_RISK
CHECK_NEXT_CACHE_COMPONENTS_READINESS
```

## D.4 Key risk patterns

| Pattern | Risk |
|---|---|
| Broad `"use client"` | Large JS bundle, hydration cost |
| Raw `<img>` for key media | CLS, poor optimization, large downloads |
| Raw `<script>` | Performance/security drift |
| No metadata | Weak SEO/share/social surfaces |
| Dynamic all-the-things | Slow pages and poor caching |
| Barrel imports | Bundle bloat and hidden dependencies |

---

# DOMAIN E — CSS, HTML, RTL, and Accessibility

## E.1 Problem

For BThwani, CSS/HTML errors are not small styling issues. They can break Arabic/RTL layout, premium identity, control-panel usability, accessibility, and web performance.

## E.2 Mandatory CSS baseline

1. Prefer logical properties:

```text
margin-inline-start
margin-inline-end
padding-inline-start
padding-inline-end
inset-inline-start
inset-inline-end
text-align: start/end
```

2. Avoid directionally fragile properties in RTL contexts:

```text
margin-left
margin-right
padding-left
padding-right
left
right
```

3. Use controlled design tokens.
4. Do not introduce random colors.
5. BThwani core palette remains:

```text
deepBlue: #0A2F5C
orange:   #FF500D
white:    #FFFFFF
```

6. Use close tints/shades only through approved tokens.
7. CSS layers should be adopted after inventory.
8. Container queries should be adopted for reusable cards/widgets when useful.
9. No local token systems outside ui-kit.
10. No random z-index, shadows, font sizes, or spacing patterns.

## E.3 Mandatory HTML baseline

1. Use semantic elements:
   - `main`
   - `nav`
   - `header`
   - `section`
   - `article`
   - `button`
   - `label`
   - `table` where actual tabular data exists
2. Do not use clickable `div` when `button` or `a` is semantically correct.
3. Forms must have:
   - labels,
   - error text,
   - required/disabled states,
   - keyboard behavior,
   - autocomplete policy where relevant.
4. HTML must have correct `lang` and `dir`.
5. Use `dir="auto"` for user-generated mixed-direction text when needed.

## E.4 Mandatory accessibility baseline

1. Keyboard navigation must work.
2. Focus state must be visible.
3. Modals/sheets require focus management.
4. Error states must be announced or visible.
5. Contrast must meet practical readability standards.
6. Interactive elements must have accessible labels.
7. Avoid ARIA misuse; semantic HTML first.

## E.5 Required guards

```text
CHECK_CSS_RTL_LOGICAL_PROPERTIES
CHECK_WEB_SEMANTIC_HTML_A11Y
CHECK_RANDOM_COLOR_AND_TOKEN_DRIFT
CHECK_CONTROL_PANEL_KEYBOARD_FOCUS
CHECK_FORM_ACCESSIBILITY_BASELINE
```

---

# DOMAIN F — UI Kit, Tamagui, Design Identity

## F.1 Problem

Tamagui and ui-kit can either become a powerful central design system or become another drift source if ownership is not strict.

## F.2 Mandatory rules

1. Tamagui is internal to `@bthwani/ui-kit`.
2. Apps and surfaces consume public ui-kit exports.
3. Reusable visual patterns belong in ui-kit.
4. App-local visual work must only compose ui-kit primitives/patterns.
5. No duplicated headers/tabs/cards/nav systems.
6. No uncontrolled style overrides.
7. Every reusable component must support:
   - RTL,
   - loading,
   - disabled,
   - error,
   - empty/success/offline where applicable.
8. Premium visual identity must remain cohesive, low-noise, and 2026-level.

## F.3 Tamagui Compiler rule

Tamagui compiler/static extraction should be assessed only after:

```text
ui-kit ownership is stable
exports are explicit
apps do not deep-import Tamagui
runtime build is stable
visual regression evidence exists
```

## F.4 Required guards

```text
CHECK_TAMAGUI_COMPILER_READINESS
CHECK_UIKIT_DUPLICATE_COMPONENTS
CHECK_UIKIT_STATE_COVERAGE
CHECK_BTHWANI_VISUAL_IDENTITY_TOKENS
CHECK_RTL_COMPONENT_CONTRACTS
```

---

# DOMAIN G — Expo, React Native, Mobile Runtime

## G.1 Problem

Mobile introduces native/runtime constraints that web does not have.

## G.2 Mandatory rules

1. Expo Development Build / Dev Client is canonical; Expo Go is not the main model.
2. Any native dependency/config change requires classification:

```text
JS-only
Metro/bundler
Native/dev-client requiring rebuild
Dependency/native module requiring rebuild
```

3. EAS Update must not bypass native compatibility.
4. `runtimeVersion` must be disciplined.
5. New Architecture readiness must be audited before dependency expansion.
6. Do not trigger EAS build as a superficial fix.
7. Each mobile app must have its own verification lane:

```text
app-client
app-partner
app-captain
app-field
```

## G.3 Required guards

```text
CHECK_EXPO_RUNTIME_VERSION_DISCIPLINE
CHECK_EXPO_NATIVE_CHANGE_CLASSIFICATION
CHECK_REACT_NATIVE_NEW_ARCH_READINESS
CHECK_MOBILE_APP_DEV_CLIENT_CONFIGS
CHECK_EAS_UPDATE_SAFETY
```

---

# DOMAIN H — Go Backend Foundation

## H.1 Problem

Go is a strong backend choice for BThwani, but only if introduced as a disciplined backend foundation.

## H.2 Mandatory decision boundary

Go must not be introduced as a random service folder or isolated experiment.

It needs:

```text
workspace strategy
service template
contract strategy
DB strategy
lint/static analysis
observability
security middleware
local runtime integration
```

## H.3 Recommended Go ownership

| Layer | Recommendation |
|---|---|
| API Gateway / BFF | Go suitable |
| DSH order service | Go suitable |
| WLT wallet/settlement | Go suitable with strong financial controls |
| Workers/jobs | Go highly suitable |
| Realtime/live ops | Go suitable |
| Web UI | Not Go |
| Mobile UI | Not Go |

## H.4 Required Go baseline before implementation

```text
go.work or clear module strategy
cmd/server
internal/http
internal/config
internal/domain
internal/store
internal/service
internal/worker
internal/observability
migrations
health/readiness endpoints
OpenAPI or Connect/Protobuf strategy
gofmt
go vet
golangci-lint/staticcheck
gosec/govulncheck
```

## H.5 Required guards

```text
CHECK_GO_FOUNDATION_READINESS
CHECK_GO_SERVICE_TEMPLATE_COMPLIANCE
CHECK_GO_SECURITY_AND_LINT_BASELINE
CHECK_GO_API_CONTRACT_COMPLIANCE
```

---

# DOMAIN I — API Contracts and Integration Safety

## I.1 Problem

Without contract-first APIs, frontend/mobile/control-panel can break silently.

## I.2 Mandatory rules

1. Every backend API must have a contract.
2. Contracts must generate or validate:
   - API types,
   - API clients,
   - request/response schemas.
3. Breaking changes require versioning or compatibility strategy.
4. Mobile compatibility requires minimum app/runtime strategy.
5. Contract tests must fail before runtime breaks.
6. No endpoint without:
   - auth,
   - object-level authorization,
   - input validation,
   - error code contract,
   - rate-limit policy where relevant.

## I.3 Contract candidates

| Option | Use case |
|---|---|
| OpenAPI | REST/public/admin APIs |
| Connect/Protobuf/gRPC | internal service-to-service contracts |
| JSON Schema/Zod equivalent | frontend/backend schema validation |
| Generated clients | mobile/web consumption |

## I.4 Required guards

```text
CHECK_API_CONTRACT_INVENTORY
CHECK_API_CLIENT_GENERATION_DRIFT
CHECK_ENDPOINT_AUTHZ_BASELINE
CHECK_API_VERSIONING_POLICY
CHECK_CONTRACT_TEST_COVERAGE
```

---

# DOMAIN J — Domain Safety: Orders, Payments, Wallet, Delivery

## J.1 Problem

Business domain bugs are more dangerous than UI bugs.

## J.2 Mandatory domain invariants

Examples of invariants that must become backend-enforced rules:

```text
An order cannot be delivered before it is accepted/picked up.
A cancelled order cannot transition to picked_up.
A paid order cannot be refunded twice.
A wallet balance cannot be updated without a ledger entry.
A captain cannot accept two mutually conflicting active deliveries.
A confirmed order price cannot be changed without explicit policy.
A store cannot edit another store’s inventory.
A field agent cannot modify data outside assigned scope.
A provider setting change must be audited.
```

## J.3 Required state machines

At minimum:

```text
Order lifecycle
Payment lifecycle
Refund lifecycle
Wallet transaction lifecycle
Captain assignment lifecycle
Partner onboarding lifecycle
Provider configuration lifecycle
Promotion/coupon lifecycle
```

## J.4 Required safeguards

```text
state transition table
idempotency keys
transactions
locking where needed
event outbox
audit log
contract tests
domain unit tests
concurrency tests for critical flows
```

## J.5 Required guards

```text
CHECK_ORDER_STATE_MACHINE_DEFINED
CHECK_PAYMENT_WALLET_INVARIANTS
CHECK_IDEMPOTENCY_FOR_SENSITIVE_FLOWS
CHECK_DOMAIN_CONCURRENCY_RISKS
CHECK_AUDIT_LOG_FOR_SENSITIVE_ACTIONS
```

---

# DOMAIN K — Idempotency, Outbox, Events, Workers

## K.1 Problem

Distributed systems fail between steps.

Example:

```text
DB write succeeds
event publish fails
notification fails
payment callback retries
user taps twice
worker retries partially
```

## K.2 Mandatory idempotency scope

Idempotency is required for:

```text
create order
capture payment
refund payment
apply coupon
assign captain
confirm delivery
wallet credit/debit
provider webhook processing
partner onboarding submission
sensitive control-panel actions
```

## K.3 Mandatory outbox scope

Outbox is required for durable events:

```text
OrderCreated
OrderAccepted
PaymentCaptured
PaymentFailed
RefundIssued
CaptainAssigned
DeliveryCompleted
WalletCredited
WalletDebited
ProviderConfigChanged
```

## K.4 Mandatory worker controls

Workers must define:

```text
retry count
retry backoff
retryable errors
terminal errors
dead-letter queue
manual reprocessing path
idempotency policy
observability fields
```

## K.5 Required guards

```text
CHECK_IDEMPOTENCY_KEY_COVERAGE
CHECK_OUTBOX_EVENT_INVENTORY
CHECK_EVENT_VERSIONING_POLICY
CHECK_WORKER_RETRY_DLQ_POLICY
```

---

# DOMAIN L — Data, Database, Money, Timezone

## L.1 Money safety

Rules:

1. Never use float for money.
2. Use integer minor units.
3. Always store currency code.
4. Define rounding policy.
5. Define fee/tax/commission breakdown.
6. Use ledger entries for wallet movement.
7. Wallet balance must reconcile with ledger.
8. Every financial mutation requires audit trail.

## L.2 Timezone safety

Rules:

1. Store timestamps in UTC.
2. Display in user/store/city context.
3. Define business-day timezone.
4. Define settlement-day timezone.
5. Avoid ambiguous “today/yesterday” logic without explicit timezone.

## L.3 Migration safety

Rules:

1. Every schema change must be a migration.
2. No manual DB edits as source of truth.
3. Destructive migration requires explicit approval.
4. Seed data must be environment-classified.
5. Backup/restore drills are mandatory before production-grade operation.

## L.4 Query and index safety

Critical query families:

```text
orders by status/date/store/captain
wallet transactions by account/date
captain location by time/order
audit logs by actor/entity/date
control-panel filters/search
pagination queries
```

## L.5 Required guards

```text
CHECK_MONEY_MINOR_UNITS
CHECK_WALLET_LEDGER_INVARIANTS
CHECK_TIMEZONE_POLICY
CHECK_DB_MIGRATION_DISCIPLINE
CHECK_DB_INDEX_READINESS
CHECK_BACKUP_RESTORE_DRILL
```

---

# DOMAIN M — Security, Privacy, Compliance

## M.1 Security baseline references

Adopt these as verification references where applicable:

```text
NIST SSDF
OWASP ASVS
OWASP API Security Top 10
OWASP MASVS
OWASP SAMM
OWASP SCVS
SLSA
OpenTelemetry guidance for observability contracts
PCI DSS scope awareness for payments
```

Versions must be verified at adoption time.

## M.2 Threat modeling

Threat modeling is mandatory for:

```text
login/OTP
checkout
payment
wallet
refund
captain tracking
partner onboarding
field agent flows
control-panel roles
provider settings
webhooks
file uploads
```

## M.3 API security

Every endpoint must answer:

```text
Who is calling?
What object is accessed?
Does the caller own or have permission for that object?
What role/action permission is required?
What is the rate limit?
What input schema is enforced?
What error code contract exists?
What audit log is required?
```

## M.4 Mobile security

Mobile apps require:

```text
secure storage policy
network/TLS policy
token handling
deep link safety
tamper/reverse-engineering awareness
privacy-safe logs
runtimeVersion discipline
```

## M.5 Privacy/PII classification

Data classes:

```text
public
internal
sensitive
financial
identity
location
health/safety-relevant if applicable
```

Sensitive data includes:

```text
names
phone numbers
addresses
locations
orders
wallet records
partner documents
captain documents
support conversations
screenshots/evidence containing PII
```

## M.6 Required guards

```text
CHECK_THREAT_MODEL_COVERAGE
CHECK_API_SECURITY_BASELINE
CHECK_MOBILE_SECURITY_BASELINE
CHECK_PII_LOGGING_AND_EVIDENCE_POLICY
CHECK_SECURITY_HEADERS_CSP
CHECK_SECRETS_ROTATION_POLICY
CHECK_DEPENDENCY_SUPPLY_CHAIN_SECURITY
```

---

# DOMAIN N — Observability, Operations, Incident Response

## N.1 Problem

Without observability, failures are opinions.

## N.2 Mandatory observability contract

Every request/job/event/payment/order lifecycle must have:

```text
request_id
correlation_id
actor_id when applicable
tenant/store/service scope when applicable
order_id/payment_id/wallet_txn_id when applicable
trace/span when available
structured logs
error code
latency measurement
no secret/PII leakage
```

## N.3 Health/readiness

Every backend service must expose:

```text
health/liveness
readiness
database connectivity
queue connectivity
migration status
provider config validity
dependency status
```

## N.4 Incident response

Playbooks required for:

```text
payment provider failure
duplicate charge/order incident
secret leakage
SMS/OTP provider outage
map/provider outage
database migration failure
queue backlog
production build failure
mobile OTA rollback
control-panel permission breach
```

## N.5 Required guards

```text
CHECK_OBSERVABILITY_CONTRACT
CHECK_HEALTH_READINESS_ENDPOINTS
CHECK_INCIDENT_PLAYBOOKS
CHECK_RUNTIME_SMOKE_TESTS
CHECK_PROVIDER_FAILURE_MODES
```

---

# DOMAIN O — Local Runtime, Docker, Environment Parity

## O.1 Problem

Local development that does not resemble production creates false confidence.

## O.2 Mandatory local runtime goal

The local stack should eventually model production semantics:

```text
API services
database
queue
cache
object storage or local equivalent
provider mocks/adapters
observability sink
seed data
migrations
control-plane config
```

## O.3 Docker role

Docker is not a replacement for Go/Node/React.

Docker provides environment orchestration:

```text
Postgres
Redis
queues
object storage
mock providers
observability services
backend services
```

## O.4 Mandatory rules

1. No stale compose as runtime truth.
2. No SQLite runtime truth for production-like service paths unless explicitly approved.
3. No `USE_FIXTURES` in live runtime.
4. No LAN/IP hardcoding.
5. Provider switching must happen through config/control-plane layers, not code edits.

## O.5 Required guards

```text
CHECK_LOCAL_RUNTIME_PARITY
CHECK_DOCKER_COMPOSE_STALENESS
CHECK_PROVIDER_CONTROL_PLANE_READINESS
CHECK_NO_LIVE_FIXTURE_DEPENDENCE
CHECK_RUNTIME_CONFIG_SCHEMA
```

---

# DOMAIN P — Supply Chain, CI, Release, Rollback

## P.1 Supply chain rules

1. Lockfile discipline is mandatory.
2. No unreviewed dependency upgrades.
3. Dependency changes require risk note.
4. Security scanning is required for release.
5. License scanning should be adopted.
6. SBOM should be generated for production-grade artifacts.
7. Build provenance should be planned before production operations.

## P.2 CI/release baseline

Every release must have:

```text
typecheck
build
lint/guards
test or justified test gap
security scan
migration check
smoke test
visual evidence when UI changed
runtime evidence when behavior changed
rollback plan
known risk list
version/tag strategy
```

## P.3 Feature flags and kill switches

Feature flags:

```text
per app
per city
per store
per role
per provider
```

Kill switches:

```text
disable new orders
disable payment provider
disable refunds
disable coupons
disable captain assignment
disable SMS provider
disable risky feature rollout
```

## P.4 Required guards

```text
CHECK_RELEASE_READINESS
CHECK_ROLLBACK_PLAN
CHECK_DEPENDENCY_CHANGE_RISK
CHECK_SBOM_PROVENANCE_READINESS
CHECK_FEATURE_FLAG_KILL_SWITCH_COVERAGE
```

---

# DOMAIN Q — Testing Strategy

## Q.1 Required test layers

| Layer | Purpose |
|---|---|
| Unit | domain math, state transition, money rules |
| Contract | API/client compatibility |
| Integration | DB/queue/service behavior |
| E2E smoke | core user flows |
| Visual | UI/RTL/layout evidence |
| Security | authz, rate limit, input validation |
| Performance | bundle, Core Web Vitals, API latency |
| Migration | schema upgrade/recovery |

## Q.2 Critical flows requiring tests

```text
checkout
payment
refund
wallet credit/debit
order lifecycle
captain assignment
partner inventory
partner onboarding
control-panel permissions
provider config changes
coupon application
file upload
```

## Q.3 Required guards

```text
CHECK_CRITICAL_FLOW_TEST_COVERAGE
CHECK_CONTRACT_TESTS
CHECK_VISUAL_REGRESSION_EVIDENCE
CHECK_SECURITY_TEST_BASELINE
CHECK_MIGRATION_TEST_EVIDENCE
```

---

# DOMAIN R — Documentation, ADR, Decision Log

## R.1 Problem

A large project fails when decisions exist only in chat history.

## R.2 Required documents

```text
ENGINEERING_BASELINE_V1.md
ARCHITECTURE_DECISION_RECORDS.md or governance/adr/*
API_CONTRACT_POLICY.md
GO_BACKEND_FOUNDATION.md
FRONTEND_WEB_FOUNDATION.md
MOBILE_RUNTIME_POLICY.md
SECURITY_BASELINE.md
OBSERVABILITY_BASELINE.md
RELEASE_AND_ROLLBACK_POLICY.md
LOCAL_RUNTIME_PARITY.md
```

## R.3 ADR fields

Each major decision must include:

```text
decision id
title
date
status
context
decision
alternatives considered
why accepted
why alternatives rejected
impact
rollback/supersession conditions
evidence
```

## R.4 Required guards

```text
CHECK_ADR_REQUIRED_FOR_MAJOR_CHANGES
CHECK_DOCUMENTATION_SOURCES_CONSISTENCY
CHECK_GOVERNANCE_DUPLICATION_DRIFT
```

---

## 7. Consolidated GAP Register

| Gap ID | Gap | Priority | Required Next Evidence |
|---|---|---|---|
| GAP-001 | React Compiler package may exist but enablement not proven | P1 | Config scan + `pnpm why` + build output |
| GAP-002 | React Compiler readiness guard missing/unproven | P1 | `CHECK_REACT_COMPILER_READINESS` output |
| GAP-003 | Next server/client boundary audit missing/unproven | P1 | Route/component inventory |
| GAP-004 | Bundle analyzer missing/unproven | P2 | Bundle report per web app |
| GAP-005 | CSS RTL logical-property guard missing/unproven | P1 | CSS scan report |
| GAP-006 | Semantic HTML/A11y guard missing/unproven | P2 | A11y audit report |
| GAP-007 | Go backend foundation missing/unproven | P1 | Go file/module inventory |
| GAP-008 | API contract strategy missing/unproven | P0 | API inventory + contract policy |
| GAP-009 | State machines missing/unproven | P0 | Domain transition matrices |
| GAP-010 | Idempotency policy missing/unproven | P0 | Sensitive flow inventory |
| GAP-011 | Outbox/event policy missing/unproven | P1 | Event inventory |
| GAP-012 | Money/wallet safety policy missing/unproven | P0 | Ledger/invariant spec |
| GAP-013 | RBAC/object authorization policy missing/unproven | P0 | Permissions matrix |
| GAP-014 | Observability contract missing/unproven | P1 | Logging/tracing/metrics standard |
| GAP-015 | Local runtime parity missing/unproven | P1 | Docker/local stack audit |
| GAP-016 | Supply-chain/SBOM/provenance missing/unproven | P1 | Release security scan plan |
| GAP-017 | Incident response playbooks missing/unproven | P2 | Playbook index |
| GAP-018 | Feature flags/kill switches missing/unproven | P1 | Control-plane/flag matrix |
| GAP-019 | Backup/restore drill missing/unproven | P0 | Restore evidence |
| GAP-020 | ADR discipline missing/unproven | P2 | ADR template + decision register |

---

## 8. Recommended Audit Scripts

These are proposed read-only scripts before applying any large change.

| Script | Purpose |
|---|---|
| `CHECK_REACT_COMPILER_READINESS.ps1` | Verify package/config/lint/build readiness |
| `CHECK_WEB_FOUNDATION_READINESS.ps1` | Audit Next/image/font/script/metadata/client boundaries |
| `CHECK_CSS_HTML_RTL_A11Y_BASELINE.ps1` | Audit CSS logical props, random colors, semantic HTML, accessibility risk |
| `CHECK_GO_BACKEND_FOUNDATION.ps1` | Detect Go modules/templates/lint/security readiness |
| `CHECK_API_CONTRACT_AND_DOMAIN_SAFETY.ps1` | API contracts, state machines, idempotency, authz |
| `CHECK_DATA_MONEY_DB_SAFETY.ps1` | Money, timezone, migration, backup/restore, indexes |
| `CHECK_SECURITY_PRIVACY_SUPPLY_CHAIN.ps1` | ASVS/API/MASVS/PII/secrets/dependency risks |
| `CHECK_OBSERVABILITY_RELEASE_RUNTIME.ps1` | Logs/traces/health/readiness/release/rollback/local runtime |
| `CHECK_ENGINEERING_BASELINE_COVERAGE.ps1` | Summarize all baseline gaps and score status |

---

## 9. Safe Local Verification Commands

These commands are read-only or evidence-oriented.

### 9.1 React Compiler evidence

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

Select-String -Path .\package.json,.\pnpm-lock.yaml `
  -Pattern "babel-plugin-react-compiler","react-compiler","reactCompiler" `
  -SimpleMatch -ErrorAction SilentlyContinue

pnpm why babel-plugin-react-compiler
```

### 9.2 Safe config scan

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$Skip = '\\(node_modules|\.git|\.next|dist|build|coverage|tools\\registry\\runs)\\'

Get-ChildItem -LiteralPath . -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object {
    $_.FullName -notmatch $Skip -and
    $_.Name -match '^(babel\.config|next\.config|metro\.config)\.(js|cjs|mjs|ts)$'
  } |
  Select-String -Pattern "babel-plugin-react-compiler","reactCompiler","react-compiler" -SimpleMatch
```

### 9.3 Go foundation scan

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$Skip = '\\(node_modules|\.git|\.next|dist|build|coverage|tools\\registry\\runs)\\'

Get-ChildItem -LiteralPath . -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object {
    $_.FullName -notmatch $Skip -and
    (
      $_.Name -in @("go.mod","go.sum","go.work","buf.yaml","sqlc.yaml",".golangci.yml",".golangci.yaml") -or
      $_.Extension -eq ".go"
    )
  } |
  Select-Object FullName
```

### 9.4 Web foundation scan starting point

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$Skip = '\\(node_modules|\.git|\.next|dist|build|coverage|tools\\registry\\runs)\\'

Get-ChildItem -LiteralPath . -Recurse -File -Include *.tsx,*.ts,*.css,*.module.css -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch $Skip } |
  Select-String -Pattern '"use client"','<img','<script','margin-left','margin-right','padding-left','padding-right','left:','right:','#' -SimpleMatch |
  Select-Object Path,LineNumber,Line
```

### 9.5 Baseline verification after any implementation

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

---

## 10. Adoption Roadmap

## Phase 0 — Adopt the document

**Goal:** Add this document to governance.

Allowed changes:

```text
Add governance/ENGINEERING_BASELINE_V1.md
No runtime changes
No dependency changes
No code changes
```

Verification:

```text
git status
git diff --check
```

## Phase 1 — Read-only audits

**Goal:** Prove current state before applying anything.

Run/prepare read-only checks:

```text
React Compiler readiness
Web foundation readiness
Go foundation readiness
API/domain safety
Security/privacy baseline
Observability/release/runtime
```

Output:

```text
tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip
```

## Phase 2 — Low-risk guards

**Goal:** Add checks that detect drift without changing app behavior.

Recommended first guards:

```text
CHECK_REACT_COMPILER_READINESS
CHECK_WEB_FOUNDATION_READINESS
CHECK_CSS_HTML_RTL_A11Y_BASELINE
CHECK_API_CONTRACT_AND_DOMAIN_SAFETY
```

## Phase 3 — Controlled enablement

**Goal:** Apply only proven high-impact changes.

Order:

```text
1. React Compiler web/control-panel pilot
2. Next server/client boundary cleanup
3. CSS RTL logical properties enforcement
4. Bundle analyzer reports
5. API contract enforcement
6. State machine/idempotency policy implementation
7. Go backend foundation if adopted
```

## Phase 4 — Production-grade hardening

**Goal:** Move toward operational readiness.

Controls:

```text
observability
incident response
release/rollback
local runtime parity
supply-chain security
backup/restore
feature flags/kill switches
security verification
```

---

## 11. Things Explicitly Not Recommended

Do not do the following:

1. Do not enable React Compiler globally across all apps in one step.
2. Do not migrate the entire backend to Go without foundation and contracts.
3. Do not add many tools/dependencies without a readiness audit.
4. Do not treat lockfile presence as feature enablement.
5. Do not treat TypeScript success as UI correctness.
6. Do not treat screenshots as code correctness.
7. Do not treat GitHub remote state as local uncommitted truth.
8. Do not treat fixture/demo behavior as production behavior.
9. Do not change payment/wallet/order logic without state-machine and idempotency evidence.
10. Do not make broad refactors without import/export/consumer evidence.

---

## 12. Final Mandatory Baseline Matrix

The following 20 areas are the top-level mandatory baseline for BThwani.

| # | Area | Required Status Before Production-Grade Closure |
|---:|---|---|
| 1 | Architecture Governance | Guards + evidence closure |
| 2 | Secure SDLC | SSDF/SAMM-aligned workflow |
| 3 | Web Security | ASVS-aligned checks |
| 4 | API Security | API Top 10-aligned checks |
| 5 | Mobile Security | MASVS-aligned checks |
| 6 | Contracts | API contracts + contract tests |
| 7 | State Machines | Order/payment/wallet/captain flows |
| 8 | Idempotency | Sensitive operations protected |
| 9 | Outbox/Events | Versioned events + retry/DLQ |
| 10 | DB/Migrations | Migration/backup/restore discipline |
| 11 | RBAC/Multi-tenancy | Object-level authorization |
| 12 | Audit Logs | Sensitive actions traceable |
| 13 | Observability | Logs/traces/metrics/health |
| 14 | Supply Chain | Dependency/SBOM/provenance path |
| 15 | Performance | Budgets + web/mobile checks |
| 16 | Accessibility/RTL | UI gates and visual proof |
| 17 | Feature Flags/Kill Switches | Controlled rollout and emergency shutdown |
| 18 | Environment Parity | Local/staging/prod comparable semantics |
| 19 | Release/Rollback | Checklist, hotfix, rollback path |
| 20 | Privacy/Data Retention | PII classification and retention policy |

---

## 13. Final Engineering Decision

The correct engineering decision is:

```text
Adopt a mandatory Engineering Baseline first.
Do not enable powerful tools broadly without readiness evidence.
Convert baseline rules into read-only audits.
Convert repeatable audits into guards.
Apply high-impact improvements gradually and prove each one.
```

The highest-value near-term work is:

```text
1. Engineering Baseline adoption
2. React Compiler readiness audit
3. Web Foundation audit
4. CSS/RTL/A11y audit
5. API/domain safety audit
6. Go backend foundation decision
7. Observability/release/runtime baseline
```

The highest-risk gaps are:

```text
state machines
idempotency
money/wallet safety
RBAC/object authorization
API contracts
DB migration/restore
observability
local runtime parity
```

The highest-leverage frontend improvements are:

```text
React Compiler readiness
Next server/client boundaries
CSS logical RTL properties
next/image and next/font policy
bundle analyzer
semantic HTML/accessibility gates
Tamagui/ui-kit boundary enforcement
```

The highest-leverage backend/platform improvements are:

```text
Go foundation if adopted
contract-first APIs
state machines
idempotency/outbox
typed database/migrations
observability
feature flags/kill switches
security/privacy/supply-chain controls
```

---

## 14. Acceptance Criteria for This Document

This document is acceptable as a governance baseline if:

```text
1. It is added as a single Markdown file under governance.
2. It is not treated as proof that all items are already implemented.
3. Each recommended area is tracked as CONFIRMED, GAP, TBD, or DEFERRED_WITH_RISK.
4. Future prompts and scripts reference this baseline when relevant.
5. Every future closure claim uses evidence, not verbal assertion.
```

---

## 15. Immediate Next Action — Merged Version

Recommended next action:

```text
Create a read-only unified audit script/package:
CHECK_UNIFIED_BASELINE_READINESS.ps1
```

It should cover both engineering and screen/flow/binding/integration safety.

Expected output:

```text
tools\registry\runs\UNIFIED_BASELINE_READINESS-YYYYMMDD-HHMMSS\
  SUMMARY.md
  evidence.json
  git-status.txt
  current-branch.txt
  workspace-structure.md
  package-snapshot.json
  engineering-baseline-findings.md
  react-compiler-readiness.md
  web-foundation-readiness.md
  css-rtl-a11y-readiness.md
  go-foundation-readiness.md
  api-domain-safety-readiness.md
  security-privacy-readiness.md
  observability-release-runtime-readiness.md
  screen-flow-binding-integration-findings.md
  gap-register.md
  risk-register.md
  UNIFIED_BASELINE_READINESS-YYYYMMDD-HHMMSS.zip
```

The ZIP file must use the session folder name exactly, not `_HANDOFF.zip`.

---

# Part C — Screen / UI / UX / Flow / Binding / Integration Safety

## 13. Screen Flow Binding Integration Contract

### 13.1 Purpose

Prevent screen-linking, navigation, data-binding, and integration damage during merges.

### 13.2 Correct architecture

```text
Runtime/Shell
→ Screen Registry
→ Route Contract
→ Flow Transition Matrix
→ Screen Component
→ Binding Adapter
→ Integration Adapter/API Client
→ Service/API/Provider
```

### 13.3 Forbidden architecture

```text
Screen A imports Screen B directly
Screen A hardcodes route string
Screen A sends untyped params
Screen A fetches real API directly
Screen A owns duplicated navigation
Screen A owns duplicated visual system
Screen A changes integration during UI-only task
```

### 13.4 Mandatory fields for every screen

| Field | Required | Purpose |
|---|---:|---|
| screenId | yes | stable identity |
| title | yes | readable name |
| surface | yes | runtime target |
| service | yes/TBD | domain owner |
| ownerPath | yes | current branch path |
| route | yes/N/A | route path/key |
| routeType | yes | file-route/stack/tab/drawer/modal/sheet/deep-link/TBD |
| params | yes | typed route params |
| entrypoints | yes | allowed incoming routes/actions |
| exits | yes | allowed outgoing routes/actions |
| permissions | protected screens | RBAC/action requirements |
| uiKitDependencies | yes | ui-kit components/patterns |
| bindingInputs | yes | data/state consumed |
| bindingOutputs | yes | actions/events emitted |
| integrationSource | yes/TBD | API/service/provider/mock |
| states | yes | loading/empty/error/success/offline/disabled |
| rtlContract | yes | RTL rules |
| a11yContract | web yes | focus/keyboard/semantic rules |
| visualEvidence | UI changes yes | screenshots |
| verification | yes | commands/evidence |
| mergeRisk | yes | LOW/MEDIUM/HIGH/BLOCKER |
| status | yes | CONFIRMED/GAP/TBD/BLOCKED |

### 13.5 Example

```yaml
screenId: dsh.controlPanel.orders
title: DSH Orders
surface: control-panel
service: dsh
ownerPath: control-panel/runtime/[TBD]
route: /dsh/orders
routeType: file-route
params: {}
entrypoints:
  - controlPanel.sidebar
  - controlPanel.home
exits:
  - dsh.controlPanel.orderDetails
permissions:
  - operations.orders.read
uiKitDependencies:
  - @bthwani/ui-kit
localUiAllowed: screen-specific layout only; no local design system
bindingInputs:
  - ordersQuery
  - filters
  - pagination
bindingOutputs:
  - openOrderDetails(orderId)
  - updateFilters(filters)
  - refreshOrders()
integrationSource: dsh orders API / adapter / TBD
states:
  - loading
  - empty
  - error
  - success
  - offline
  - disabled
rtlContract:
  - text aligned to reading direction
  - icon + label clustered correctly
  - chevrons/actions on opposite side
verification:
  - git status
  - git diff --check
  - pnpm -w exec tsc --noEmit
mergeRisk: HIGH until contract is confirmed
status: TBD
```

---

## 14. Required Screen/Flow Registries

### 14.1 Screen Inventory

```text
screenId
title
surface
service
ownerPath
route
currentStatus
mergeRisk
notes
```

### 14.2 Route Contract Registry

```text
routeId
surface
routePathOrKey
params
requiredPermissions
allowedEntrypoints
owner
status
```

### 14.3 Flow Transition Matrix

```text
fromScreenId
toScreenId
action
requiredParams
guardCondition
permission
allowed
status
```

### 14.4 Binding Contract Registry

```text
screenId
bindingInput
sourceType
sourceName
dataShape
loadingState
errorState
emptyState
refreshPolicy
status
```

### 14.5 Integration Contract Registry

```text
integrationId
service
surface
consumerScreenId
provider
contract
auth
rateLimit
retryPolicy
fallback
status
```

### 14.6 UI Kit Ownership Registry

```text
pattern
owner
uiKitExport
allowedConsumers
localOverridePolicy
rtlContract
visualEvidenceRequired
status
```

---

## 15. Risk Register for AI-Driven Screen Work

Scoring model:

```text
Impact 1–5
Probability 1–5
Exposure 1–5
Reversibility 1–5
Normalized Score = round((Impact × Probability × Exposure × Reversibility / 625) × 100)
```

| # | Risk | Score | Priority |
|---:|---|---:|---|
| 1 | Screen modified before current structure discovery | 100 | P0 |
| 2 | Binding changed without data contract | 100 | P0 |
| 3 | No patch/evidence review | 100 | P0 |
| 4 | Old paths used by AI agent | 80 | P1 |
| 5 | Flow not documented before merge | 80 | P1 |
| 6 | Integration not documented before merge | 80 | P1 |
| 7 | AI broad refactor across surfaces | 80 | P1 |
| 8 | Params mismatch: id vs orderId/storeId | 64 | P1/P2 |
| 9 | Fake fixtures leak into runtime | 64 | P1/P2 |
| 10 | Local design system outside ui-kit | 64 | P1/P2 |
| 11 | Missing permissions in flow | 64 | P1/P2 |
| 12 | Unknown ownerPath for screen | 64 | P1/P2 |
| 13 | RTL drift | 60 | P1/P2 |
| 14 | Route strings hardcoded randomly | 51 | P2 |
| 15 | UI screen fetches integration directly | 51 | P2 |
| 16 | Duplicate navigation systems | 51 | P2 |
| 17 | Missing loading/error/empty/offline states | 48 | P2 |
| 18 | No visual evidence after UI changes | 48 | P2 |
| 19 | Screen direct-imports another screen | 41 | P2 |

---

## 16. AI-Agent Safety Policy

Because the user is a beginner and relies on AI, assume AI may:

```text
hallucinate old paths
widen scope
modify unrelated files
claim success without evidence
confuse UI with integration
create local UI patterns instead of using ui-kit
use unverified assumptions
```

Mandatory AI phases:

```text
1. Current Structure Discovery
2. Screen Inventory
3. Flow Map
4. Binding Map
5. Integration Map
6. Risk Register
7. Narrow Implementation Plan
8. Implementation inside approved scope only
9. Verification
10. Evidence review
```

Forbidden:

```text
use old apps/* paths without proof
use old packages/* paths without proof
modify files before reading pnpm-workspace.yaml
touch more than one surface unless approved
change API/runtime/backend during UI task
delete/move/rename files without explicit approval
add dependencies without approval
claim PASS/CLOSED/100%
skip visual evidence for UI changes
skip git diff evidence
```

---

## 17. Required Guards

### 17.1 Existing guards to respect

```text
guard:i18n-direction
guard:binding-proof
guard:patch-review
guard:visual
guard:rtl-visual
guard:secret-scan
guard:runtime-smoke
guard:tamagui-law
guard:tamagui-import-boundary
```

### 17.2 Proposed new guards

```text
CHECK_CURRENT_BRANCH_STRUCTURE
CHECK_REACT_COMPILER_READINESS
CHECK_WEB_FOUNDATION_READINESS
CHECK_CSS_HTML_RTL_A11Y_BASELINE
CHECK_GO_FOUNDATION_READINESS
CHECK_API_CONTRACT_AND_DOMAIN_SAFETY
CHECK_DATA_MONEY_DB_SAFETY
CHECK_SECURITY_PRIVACY_SUPPLY_CHAIN
CHECK_OBSERVABILITY_RELEASE_RUNTIME
CHECK_SCREEN_FLOW_BINDING_INTEGRATION_READINESS
CHECK_ENGINEERING_BASELINE_COVERAGE
```

### 17.3 Output standard for guard scripts

Every evidence run should create:

```text
tools\registry\runs\{SESSION_ID}\
  SUMMARY.md
  evidence.json
  git-status.txt
  current-branch.txt
  package-snapshot.json
  findings.md
  {SESSION_ID}.zip
```

The ZIP must be named exactly:

```text
{SESSION_ID}.zip
```

Not `_HANDOFF.zip`.

---

## 18. Safe Local Commands

### 18.1 Confirm current branch and workspace

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git branch --show-current
git rev-parse HEAD
Get-Content .\pnpm-workspace.yaml
```

### 18.2 React Compiler evidence

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

Select-String -Path .\package.json,.\pnpm-lock.yaml `
  -Pattern "babel-plugin-react-compiler","react-compiler","reactCompiler" `
  -SimpleMatch -ErrorAction SilentlyContinue

pnpm why babel-plugin-react-compiler
```

### 18.3 Safe config scan

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$Skip = '\\(node_modules|\.git|\.next|dist|build|coverage|tools\\registry\\runs)\\'

Get-ChildItem -LiteralPath . -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object {
    $_.FullName -notmatch $Skip -and
    $_.Name -match '^(babel\.config|next\.config|metro\.config)\.(js|cjs|mjs|ts)$'
  } |
  Select-String -Pattern "babel-plugin-react-compiler","reactCompiler","react-compiler" -SimpleMatch
```

### 18.4 Scan for forbidden old paths

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

Select-String -Path .\*.json,.\*.yaml,.\*.yml,.\*.md `
  -Pattern "apps/mobile/","apps/web/","packages/surfaces","packages/app-shells","packages/ui-kit" `
  -SimpleMatch -ErrorAction SilentlyContinue
```

### 18.5 Screen/navigation/binding discovery

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$Skip = '\\(node_modules|\.git|\.next|dist|build|coverage|tools\\registry\\runs)\\'

Get-ChildItem -LiteralPath . -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch $Skip } |
  Select-String -Pattern "router.push","navigate(","href=","screenId","route","params","useSearchParams","useRouter","Link","binding","adapter","api","client" -SimpleMatch |
  Select-Object Path,LineNumber,Line
```

### 18.6 Go foundation scan

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$Skip = '\\(node_modules|\.git|\.next|dist|build|coverage|tools\\registry\\runs)\\'

Get-ChildItem -LiteralPath . -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object {
    $_.FullName -notmatch $Skip -and
    (
      $_.Name -in @("go.mod","go.sum","go.work","buf.yaml","sqlc.yaml",".golangci.yml",".golangci.yaml") -or
      $_.Extension -eq ".go"
    )
  } |
  Select-Object FullName
```

### 18.7 Minimum post-change verification

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

---

## 19. Inspect-Only AI Prompt

Use this before any implementation:

```text
نفّذ تحليلًا فقط بدون تعديل أي ملف.

المشروع:
C:\bthwani-suite

الفرع الحالي:
ghb/safe-replay-apps-control-panel-20260509-024017

قاعدة إلزامية:
قبل أي تحليل، اقرأ pnpm-workspace.yaml و package.json واستخرج المسارات الحالية فعليًا.
ممنوع استخدام أو افتراض هذه المسارات القديمة:
- apps/mobile/*
- apps/web/*
- packages/surfaces
- packages/app-shells
- packages/ui-kit

استخدم فقط المسارات المثبتة من pnpm-workspace.yaml:
- webapp
- website
- webapp/runtime
- website/runtime
- app-client/runtime
- app-partner/runtime
- app-captain/runtime
- app-field/runtime
- control-panel/runtime
- ui-kit
- dsh
- wlt
- knz
- arb
- amn
- esf
- mrf
- snd
- kwd

الهدف:
تحليل UI / UX / Flow / Binding / Integration للشاشات الحالية، وتجهيز خريطة تمنع كسر الربط بين الشاشات عند الدمج.

ممنوع:
- لا تعدل ملفات.
- لا تنشئ ملفات.
- لا تحذف أو تنقل.
- لا تغير routes.
- لا تغير ui-kit.
- لا تغير API أو runtime.
- لا تستخدم Tamagui خارج ui-kit.
- لا تفترض وجود شاشة أو مجلد بدون دليل.
- لا تقل PASS أو CLOSED أو 100%.

افحص:
1) ما هي الشاشات الموجودة فعليًا في الهيكل الحالي.
2) ما ownerPath لكل شاشة.
3) ما surface لكل شاشة.
4) ما service المرتبط بها إن أمكن.
5) أين يتم تعريف navigation أو tabs أو routes أو links.
6) هل توجد route strings عشوائية.
7) هل توجد params غير موحدة مثل id/storeId/orderId.
8) هل توجد direct imports بين الشاشات.
9) هل توجد flows غير موثقة.
10) هل توجد UI patterns مكررة خارج ui-kit.
11) هل يوجد binding مباشر داخل UI بدل adapter/contract.
12) هل توجد integration مباشرة داخل screen بدون طبقة واضحة.
13) هل توجد شاشات لا تغطي loading/empty/error/success/offline/disabled.
14) هل توجد مخاطر دمج بسبب أسماء مكررة أو شاشات متشابهة.

المطلوب:
- Current structure evidence من pnpm-workspace.yaml.
- Screen inventory table.
- Flow map.
- Binding map.
- Integration map.
- Risk register مصنف BLOCKER/HIGH/MEDIUM/LOW.
- اقتراح Screen Flow Binding Integration Contract.
- اقتراح guards تمنع كسر الدمج.
- كل شيء غير مثبت اكتبه TBD.
```

---

## 20. Narrow Implementation Prompt Template

Use only after inspect-only evidence is reviewed:

```text
نفّذ تعديلًا واحدًا فقط داخل النطاق المحدد أدناه.

قبل التعديل:
- اعرض الملفات التي ستلمسها ولماذا.
- لا تلمس أي ملف خارج النطاق.
- لا تستخدم مسارات قديمة.
- لا تغيّر flow أو binding أو integration إلا إذا كان مذكورًا صراحة.

النطاق المسموح:
<ONE_SCREEN_OR_ONE_CONTRACT_FILE_ONLY>

المطلوب:
<EXACT_CHANGE>

ممنوع:
- لا تعدل ui-kit إلا إذا كان النطاق هو ui-kit صراحة.
- لا تعدل API/runtime/backend.
- لا تنشئ route جديد.
- لا تغيّر params.
- لا تنقل أو تحذف ملفات.
- لا تضف dependency.
- لا تقل PASS/CLOSED/100%.

بعد التعديل:
- اذكر الملفات التي تغيرت.
- اطلب تشغيل:
  git --no-pager status --short
  git --no-pager diff --check
  pnpm -w exec tsc --noEmit
- إذا كان UI تغير، اطلب screenshot before/after.
```

---

## 21. Adoption Roadmap

### Phase 0 — Adopt baseline document

Add this file to governance.

Allowed:

```text
add governance markdown only
no runtime change
no dependency change
no code change
```

### Phase 1 — Read-only audits

Run:

```text
CHECK_CURRENT_BRANCH_STRUCTURE
CHECK_SCREEN_FLOW_BINDING_INTEGRATION_READINESS
CHECK_REACT_COMPILER_READINESS
CHECK_WEB_FOUNDATION_READINESS
CHECK_CSS_HTML_RTL_A11Y_BASELINE
CHECK_GO_FOUNDATION_READINESS
CHECK_API_CONTRACT_AND_DOMAIN_SAFETY
```

### Phase 2 — Contract templates

Create templates only:

```text
Screen Contract
Route Contract
Flow Transition Matrix
Binding Contract
Integration Contract
UI Kit Ownership Contract
```

### Phase 3 — Pilot

Start with:

```text
control-panel/runtime
```

Reason:

```text
web/Next verification is easier than all mobile runtimes together.
```

### Phase 4 — Expand

Then expand to:

```text
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
webapp/runtime
website/runtime
```

### Phase 5 — Service mapping

Map services:

```text
dsh
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

to screens, bindings, and integrations.

### Phase 6 — Enforcement

Add guards only after read-only audit proves stable output.

---

## 22. Acceptance Criteria

A change is acceptable only if:

```text
1. Current structure was proven from pnpm-workspace.yaml.
2. No old path was used as active scope.
3. ownerPath is known.
4. screenId is known or introduced through contract.
5. route/params are known or explicitly TBD.
6. entrypoints/exits are known or explicitly TBD.
7. binding inputs/outputs are known or explicitly TBD.
8. integration source is known or explicitly TBD.
9. UI ownership uses ui-kit correctly.
10. RTL and state coverage are checked.
11. git diff is clean.
12. typecheck is run or failure is documented.
13. UI screenshots are provided if visuals changed.
14. Unknowns are not hidden.
15. No PASS/CLOSED/100% is claimed without evidence.
```

---

---

# Part D — Final Unified Decision, Acceptance, and Next Steps

## 23. Final Unified Decision

The final unified decision is:

```text
BThwani must not be developed as isolated screens or isolated AI edits.
It must be developed as a contract-driven system:
structure → screen → route → flow → binding → integration → guard → evidence.
```

The most important immediate action:

```text
Create and run a read-only unified baseline audit on the current branch.
```

The most important protection for the user:

```text
Every AI task must start with current-branch structure discovery and end with evidence.
```

The second protection:

```text
No screen change without Screen Flow Binding Integration Contract.
```

The third protection:

```text
No merge without git diff + typecheck + visual evidence for UI.
```

---

## 24. Final Baseline Summary

Top priorities:

```text
P0:
- current branch structure discovery
- screen/flow/binding/integration contracts
- API contracts
- state machines
- idempotency
- money/wallet safety
- RBAC/object authorization
- audit logs
- DB migrations/backup/restore
- evidence before closure

P1:
- React Compiler readiness
- Next server/client boundary
- CSS/RTL logical properties
- ui-kit/Tamagui boundary
- observability
- local runtime parity
- supply-chain security
- feature flags/kill switches
- Go backend foundation if adopted
- Expo/runtime discipline

P2:
- bundle analyzer
- semantic HTML/a11y
- container queries/CSS layers
- Sentry/error monitoring
- incident playbooks
- ADR discipline
```

The correct next file to add after this baseline is not implementation code. It is:

```text
CHECK_UNIFIED_BASELINE_READINESS.ps1
```

And its output should be:

```text
tools\registry\runs\UNIFIED_BASELINE_READINESS-YYYYMMDD-HHMMSS\
  SUMMARY.md
  evidence.json
  current-branch.txt
  workspace-structure.md
  engineering-baseline-findings.md
  screen-flow-binding-integration-findings.md
  gap-register.md
  risk-register.md
  UNIFIED_BASELINE_READINESS-YYYYMMDD-HHMMSS.zip
```

---

**End of document.**

---

## Final Merge Acceptance Criteria

This merged document is acceptable as the single governance baseline only if all the following are respected:

```text
1. It replaces the two separate baseline drafts for future reference.
2. It preserves current-branch path truth from pnpm-workspace.yaml.
3. It does not reintroduce old active paths unless proven locally.
4. It keeps React Compiler as readiness-gated, not globally enabled by assumption.
5. It treats Go as a backend foundation decision, not an ad-hoc migration.
6. It requires Screen Flow Binding Integration Contract before screen linkage changes.
7. It requires evidence before PASS/CLOSED/DONE/100%.
8. It treats UI correctness as requiring visual evidence, not TypeScript only.
9. It treats API/domain/payment/wallet safety as contract/state-machine/idempotency work.
10. It protects the beginner developer from unsafe AI-agent execution through inspect-first, narrow-scope, evidence-first workflows.
```

---

## Final Operational Rule for All Future AI Prompts

```text
Before any implementation:
1. Prove current branch.
2. Prove current workspace structure.
3. Prove target ownerPath.
4. Prove whether the task is UI, UX, Flow, Binding, Integration, Runtime, API, or Governance.
5. Refuse old paths unless locally proven.
6. Make one narrow change only.
7. Verify with git status, diff check, typecheck/build as applicable.
8. Require screenshots for UI.
9. Mark all unknowns as TBD.
10. Never claim 100% closure without evidence.
```

---

**End of merged document.**
