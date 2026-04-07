# 03_REPO_TARGET_OWNERSHIP

## Target Layers

- `packages/surfaces/src/dsh/**`
  - owns retained screen bundles, local viewmodels, fixtures, and screen-local companion pieces
- `packages/ui-kit/**`
  - owns only shared primitives and patterns proven by multiple retained screens
- `services/dsh/**`
  - does not exist yet; reserved for later application/service methods and policy-safe backend orchestration
- `contracts/master/**`
  - reserved for later contract deltas when screen-to-API pressure is explicit
- `apps/mobile/*` and `apps/web/control-panel/*`
  - thin shell registration only; no service truth

## Current Target Fit

- target preview candidate registry already exists under `packages/surfaces/src/dsh/**`
- target service layer is absent and remains deferred
- thin shell route targets remain registry-only and are not implementation truth yet

## Ownership Decisions

- clean screens and viewmodels -> `packages/surfaces`
- shared reusable patterns -> `packages/ui-kit`
- future service methods -> `services/dsh`
- future contract deltas -> `contracts/master`
- thin route registration -> `apps/mobile/*` and `apps/web/control-panel/*`