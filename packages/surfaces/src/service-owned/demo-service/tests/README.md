# Tests — demo-service

Place unit, contract and integration tests for the service here.

Suggested commands (run from repo root):

```
pnpm -w exec vitest run packages/surfaces/src/service-owned/demo-service/tests --run
pnpm -w exec node ./tools/guards/run-contract-tests.mjs packages/surfaces/src/service-owned/demo-service/contracts/openapi.yaml
```

Requirements:
- unit tests for business logic
- contract tests for API schemas
- a smoke test that exercises core navigation on supported surfaces
