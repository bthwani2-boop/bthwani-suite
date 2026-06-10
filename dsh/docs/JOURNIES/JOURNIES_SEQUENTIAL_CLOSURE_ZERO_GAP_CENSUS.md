# BThwani DSH/WLT Zero-Gap Census Manifest

Status: ZERO_GAP_CENSUS_REQUIRED_BEFORE_EXECUTION
Decision: INVENTORY_NOT_EQUAL_TO_PASS

## Inventory Claim Boundary
هذا الملف يجرد ملفات الحزمة ومسارات التنفيذ المطلوبة. لا يدّعي أن الريبو نفسه خالٍ من النقص؛ لإثبات ذلك يجب تشغيل سكربت الجرد المحلي ثم تنفيذ الشرائح وإرفاق evidence.

## Required Global Census Dimensions
- surfaces: app-client, app-partner, app-captain, app-field, control-panel, webapp/website where relevant
- layers: OpenAPI, Go backend, runtime, typed clients/transports, frontend screens/routes, control-panel, WLT boundaries, data/media, tests/guards/evidence
- states: loading, empty, error, offline, blocked, disabled, success, permission/auth states
- actions: every CTA, navigation target, backend side effect, audit event, rollback/disable path
- ownership: DSH domain vs WLT finance vs auth vs vars/provider vs central data/media
- performance: heavy files, N+1 media, polling/backoff, query indexes, bundle/screen weight, memoization/splitting
- cleanup: duplication, dead code, scattered fixtures, local design drift, stale docs/matrices, stale paths

## Package Counts
- Journey folders: 15
- Slice files: 84

## Path Census
| Journey | Folder | Slice Count |
|---|---|---:|
| `J-000` | `dsh/docs/journies-000-foundation-remote-local-evidence-gate` | 5 |
| `J-001` | `dsh/docs/journies-001-store-discovery` | 6 |
| `J-002` | `dsh/docs/journies-002-catalog-management` | 6 |
| `J-003` | `dsh/docs/journies-003-checkout-payment-wlt-order` | 7 |
| `J-004` | `dsh/docs/journies-004-order-lifecycle-support-refund` | 6 |
| `J-005` | `dsh/docs/journies-005-delivery-execution-captain` | 7 |
| `J-006` | `dsh/docs/journies-006-partner-onboarding-field-readiness` | 7 |
| `J-007` | `dsh/docs/journies-007-data-media-fixture-governance` | 5 |
| `J-008` | `dsh/docs/journies-008-platform-vars-provider-policy` | 4 |
| `J-009` | `dsh/docs/journies-009-control-panel-operations-room` | 5 |
| `J-010` | `dsh/docs/journies-010-wlt-finance-settlement-boundary` | 5 |
| `J-011` | `dsh/docs/journies-011-performance-cleanup-refactor` | 6 |
| `J-012` | `dsh/docs/journies-012-auth-permissions-account-profile` | 5 |
| `J-013` | `dsh/docs/journies-013-notifications-signal-layer` | 5 |
| `J-014` | `dsh/docs/journies-014-final-e2e-regression-readiness` | 5 |
