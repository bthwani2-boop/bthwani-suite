# DEV_ONLY_PREVIEW_DATA

## Execution Mode

**LIVE EXECUTION MODE — Not UI Preview.**

The project is no longer in UI Preview mode. Slices are executed End-to-End against live backend,
Docker runtime, API, and database. This directory exists ONLY as:

- A fallback when the API is unreachable (network/Docker not running)
- Dev-time fixtures for Storybook, tests, and design token validation

Any screen or surface that shows data from this directory to a real user in a live session
is a violation. The live truth is the DSH API + PostgreSQL + MinIO.

## Classification

DEV_ONLY_PREVIEW_DATA — UI preview fixtures only.

Not runtime truth. Not API source. Not binding source. Not backend data.

The `preview-data.contract.ts` file enforces this programmatically:

```ts
export const dshCanonicalPreviewDataContract: DshPreviewDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
};
```

## Allowed consumers

Imports from `dsh/frontend/data` are allowed only in:

- Storybook stories and decorators
- Preview-mode renderers and demo surfaces
- Design token visual regression fixtures
- Test scaffolding (`*.test.ts`, `*.spec.ts`, `*.stories.tsx`)
- Fallback/demo UI branches gated by `USE_PREVIEW_DATA` flag

## Banned consumers (runtime violation)

Any import from `dsh/frontend/data` inside a live runtime flow is a violation:

- `app-client` navigation bridge using preview stores/orders as runtime truth
- `app-partner` screens rendering preview store/product data as real catalog
- `app-captain` / `app-field` flows using preview-data operational state
- `control-panel` screens submitting or mutating from preview-data (read-only display is tolerated)
- `dsh-api` / `wlt-api` backend referencing any file here

## Known violations requiring migration

The following files currently import from `dsh/frontend/data` in runtime-adjacent paths.
They are classified pending migration to API-sourced data:

| File | Classification | Status |
|---|---|---|
| `app-client/dsh-client.navigation-bridge.ts` | RUNTIME_VIOLATION | Pending API migration |
| `app-client/adapters/dshClientStoreAdapters.ts` | RUNTIME_VIOLATION | Pending API migration |
| `app-client/adapters/dshClientOrderAdapters.ts` | RUNTIME_VIOLATION | Pending API migration |
| `app-field/DshFieldSurface.tsx` | RUNTIME_VIOLATION | Pending API migration |
| `app-field/storage/field-onboarding.storage.ts` | RUNTIME_VIOLATION | Pending API migration |
| `shared/catalog-central-adapter.ts` | RUNTIME_VIOLATION | Pending API migration |
| `control-panel/marketing/*` | DEV_ALLOWED (marketing preview) | Tolerated until marketing API |
| `control-panel/support/*` | DEV_ALLOWED (support preview) | Tolerated until support API |
| `control-panel/platform/*` | DEV_ALLOWED (platform preview) | Tolerated until platform API |

## RETIRE plan

`RETIRE_DEV_FIXTURES_AFTER_RUNTIME_MEDIA_CLOSURE` applies here too.

Do not remove this directory until:

- All RUNTIME_VIOLATION entries in the table above are migrated to API calls
- No live order/payment/media flow depends on any file in this directory
- The guard `tools/guards/media-fixtures-runtime-guard.mjs` reports zero violations
