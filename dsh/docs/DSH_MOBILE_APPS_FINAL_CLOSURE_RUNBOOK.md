# DSH Mobile Apps Final Closure Runbook

1. Scope only `app-client`, `app-partner`, `app-captain`, and `app-field`, plus their DSH frontend roots, WLT DSH bridges, shared WLT finance helpers, and app shell/composition boundaries.
2. Capture a local preflight with `git status`, `git --no-pager diff --check`, and `pnpm -w exec tsc --noEmit`.
3. Remove broad public barrels and any unjustified compatibility exports inside the targeted mobile scope.
4. Close route/screen registries until every remaining row is either `VERIFIED` or an explicit WLT integration row with correct ownership metadata.
5. Move any remaining wallet, balance, settlement, payout, commission, or money copy out of DSH host surfaces and into the WLT bridge/helper layer without changing UI values.
6. Regenerate final classification CSVs from live files only for partner, captain, and field; keep client classification as the existing closed reference unless live drift is proven.
7. Update `dsh/SERVICE_BLUEPRINT.md` and the mobile closure summary so decision, evidence root, and app-partner status match the live gate result.
8. Run the final scoped gate:

```text
pnpm -w exec tsc --noEmit
git --no-pager diff --check
rg -n --fixed-strings "status: 'UNPROVEN'" dsh/frontend/app-client/dsh-client.screen-registry.ts dsh/frontend/app-partner/dsh-partner.screen-registry.ts dsh/frontend/app-captain/dsh-captain.screen-registry.ts dsh/frontend/app-field/dsh-field.screen-registry.ts
rg -n "export \*" dsh/frontend/app-partner dsh/frontend/app-captain dsh/frontend/app-field wlt/frontend/app-partner/dsh wlt/frontend/app-captain/dsh wlt/frontend/app-field/dsh app-partner/composition app-captain/composition app-field/composition
rg -n "ownerId:\s*'core'|serviceId:\s*'core'" dsh/frontend/app-client dsh/frontend/app-partner dsh/frontend/app-captain dsh/frontend/app-field wlt/frontend/app-client/dsh wlt/frontend/app-partner/dsh wlt/frontend/app-captain/dsh wlt/frontend/app-field/dsh
```

9. Treat runtime or visual proof as optional here; record `SKIPPED` when no mobile runtime session is available rather than inflating closure claims.
10. Do not declare backend, API, OpenAPI, or production readiness from this runbook. This gate is mobile frontend preview-scope closure only.
