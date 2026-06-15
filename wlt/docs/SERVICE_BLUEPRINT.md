# WLT Service Blueprint

This file is the service truth for `wlt` only.

Platform-wide policy lives in `governance/PLATFORM_BLUEPRINT.md`.
API contract truth lives in `wlt/wlt.openapi.yaml`.
Platform auth truth lives in `auth.openapi.yaml`.

---

## 1. Service Truth

| Field | Value |
|---|---|
| Service ID | `wlt` |
| Service Name | Wallet / محفظة بثواني |
| Service Type | `FINANCIAL_PLATFORM_SERVICE` |
| Owner Root | `wlt/` |
| Truth File | `wlt/docs/SERVICE_BLUEPRINT.md` |
| OpenAPI Contract | `wlt/wlt.openapi.yaml` |
| Public Export Path | `wlt/index.ts` |
| Current Decision | `RUNTIME_BOUND_WITH_TARGETED_EVIDENCE` |
| Current Status | `WLT_SERVICE_V1_LIVE / GO_HTTP_RUNTIME_BOUND / POSTGRES_RUNTIME_BOUND / NEEDS_VISUAL_EVIDENCE_FOR_APP_SURFACES` |
| Evidence Root | `tools/registry/runs/{SESSION_ID}` |

### Service Purpose

WLT owns the financial system of record: wallet balances, payment sessions, refunds, settlements, payout decisions, ledger entries, reconciliation, finance reports, and close/audit data.

DSH and app shells may display WLT references and statuses only. They must not compute or mutate payment, refund, settlement, payout, commission, COD, or ledger truth.

---

## 2. Ownership and Boundaries

### Owns

- `wlt/wlt.openapi.yaml`.
- WLT Go backend under `wlt/backend/`.
- WLT domain models under `wlt/domain/`.
- WLT frontend read models and typed clients under `wlt/frontend/`.
- Financial mutation, ledger state, reconciliation state, and finance audit data.

### Does Not Own

- App runtime shells.
- DSH operational order lifecycle outside WLT callback/reference fields.
- `master.openapi.yaml`.
- `auth.openapi.yaml`.
- `@bthwani/ui-kit` primitives, tokens, themes, or reusable UI authority.

### Forbidden Couplings

- DSH financial mutation.
- App shell financial business logic.
- Deep imports into WLT private backend internals from DSH or app shells.
- Status claims stronger than the current verification evidence.

---

## 3. Surface Matrix

| Surface | Ownership Rule | Service Scope | Status | Evidence |
|---|---|---|---|---|
| `app-client` | app owns shell/composition only | wallet, payment, refund visibility | `OUT_OF_SCOPE_DSH_FINANCE_NOW` | WLT owns mutation |
| `webapp` | app owns shell/composition only | customer finance visibility when enabled | `OUT_OF_SCOPE_DSH_FINANCE_NOW` | WLT owns mutation |
| `app-partner` | app owns shell/composition only | statements and settlement visibility | `OUT_OF_SCOPE_DSH_FINANCE_NOW` | WLT owns mutation |
| `app-captain` | app owns shell/composition only | earnings, COD liability, settlement visibility | `OUT_OF_SCOPE_DSH_FINANCE_NOW` | WLT owns mutation |
| `app-field` | app owns shell/composition only | commission and payout visibility | `OUT_OF_SCOPE_DSH_FINANCE_NOW` | WLT owns mutation |
| `control-panel` | app owns shell/composition only | finance monitoring and WLT-owned decision review | `RUNTIME_BOUND / NEEDS_VISUAL_EVIDENCE` | Go/Postgres runtime exists; visual proof still required |

---

## 4. Contract, Backend, and Domain State

| Area | Status | Source | Verification Gate | Notes |
|---|---|---|---|---|
| Auth dependency | `AUTH_CONTRACT_ROLE_MATRIX_V3` | `auth.openapi.yaml` | `pnpm run openapi:lint:auth` | WLT production mode verifies Bearer tokens through `GET /auth/session`. |
| OpenAPI | `WLT_SERVICE_V1_LIVE` | `wlt/wlt.openapi.yaml` | `pnpm run openapi:lint:wlt` | Contract covers wallet, payment, refund, settlement, ledger, operator, and reporting flows. |
| API types | `WLT_DSH_TYPED_CLIENT_GENERATED` | `wlt/frontend/dsh/shared/contracts/openapi/wlt-dsh-openapi.types.ts` | `pnpm run openapi:types:wlt` | Generated contract output; not app visual proof. |
| Typed client | `WLT_DSH_TYPED_CLIENT_PRESENT / RUNTIME_BOUND` | `wlt/frontend/contracts/wlt-dsh-client.ts` | targeted TypeScript/Nx check | App shells remain composition-only. |
| Backend handler | `GO_HTTP_RUNTIME_BOUND` | `wlt/backend/cmd/wlt-api`; `wlt/backend/internal/http/*` | `go test ./internal/http` from `wlt/backend` | Registers payment, refund, settlement, wallet, health, operator, and reporting routes. |
| Persistence model | `POSTGRES_RUNTIME_BOUND` | `wlt/backend/internal/store/postgres_repository.go`; `wlt/backend/migrations/*` | `TestWltPostgresE2EJourney` | Local Postgres availability gates full E2E execution. |
| Domain model | `WLT_DSH_RUNTIME_READ_MODEL` | `wlt/domain/*`; `wlt/frontend/dsh/*` | targeted backend/frontend checks | DSH reads status/reference data only. |
| Local Docker runtime | `WLT_API_DOCKERFILE_PRESENT` | `wlt/backend/Dockerfile.wlt-api` | targeted Docker build when requested | Builds the Go WLT API and exposes port `8083`. |

---

## 5. Runtime Flows

| Flow | Owner | Status | Required Evidence |
|---|---|---|---|
| Wallet summary | WLT | `RUNTIME_BOUND` | WLT HTTP/RBAC tests |
| Payment session create/read/confirm/fail | WLT | `RUNTIME_BOUND` | WLT HTTP/RBAC tests + DSH callback tests |
| Refund create/read/process/confirm/fail | WLT | `RUNTIME_BOUND` | WLT HTTP tests + DSH refund callback tests |
| Settlement create/list/read/process/complete/fail | WLT | `RUNTIME_BOUND` | WLT HTTP/Postgres tests + DSH settlement callback tests |
| Ledger and wallet transactions | WLT | `RUNTIME_BOUND` | WLT operator/RBAC tests |
| Payout and reconciliation reports | WLT | `RUNTIME_BOUND` | WLT operator/reporting tests |
| App/control-panel visual rendering | app shells + WLT read models | `NEEDS_VISUAL_EVIDENCE` | screenshots/RTL/overflow notes when UI changes |

---

## 6. Local Stack

WLT local runtime uses:

- Auth contract: `auth.openapi.yaml`, runtime default port `8082`.
- DSH API: default callback target `http://localhost:8080`.
- WLT API: `wlt/backend/cmd/wlt-api`, default port `8083`.
- Postgres: `DATABASE_URL`; if unset, WLT uses the in-memory repository for dev only.
- Docker: `wlt/backend/Dockerfile.wlt-api` builds the Go API binary from the `wlt/` context.

Do not mark production readiness from in-memory runtime. Postgres E2E or an explicit skipped reason is required.

---

## 7. Open Gaps

| Gap | Status | Owner | Next Gate |
|---|---|---|---|
| Visual proof for app/control-panel finance surfaces | `NEEDS_VISUAL_EVIDENCE` | app shells + WLT read models | screenshots/RTL/overflow check |
| Full local Auth + DSH + WLT + Postgres smoke | `NEEDS_RUNTIME_EVIDENCE` | auth/dsh/wlt | targeted local smoke, no workspace-wide build |
| Generated WLT types may lag contract edits | `CONTRACT_VALIDATION_REQUIRED` | WLT | `pnpm run openapi:types:wlt` |
| DSH finance copy/control audit | `FIX_REQUIRED_WHEN_MUTATION_COPY_EXISTS` | DSH | remove any DSH refund/settlement/payout mutation wording |

---

## 8. Acceptance Rules

- No WLT financial mutation outside `wlt/`.
- No DSH status row may claim stronger evidence than the matching runtime/visual proof.
- No `PASS`, `CLOSED`, `READY`, `FINAL`, or `100%` language without current git diff and targeted verification output.
- Registry evidence is created only when runtime/evidence closure is actually performed or explicitly requested.
- ZIP evidence is opt-in only.
