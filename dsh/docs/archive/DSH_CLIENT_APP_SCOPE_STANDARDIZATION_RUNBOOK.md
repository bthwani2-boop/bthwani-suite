# DSH Client App-Scope Standardization Runbook

1. Capture branch, head, origin head, git status, diff name-status, diff-check, and `pnpm -w exec tsc --noEmit`.
2. Introduce or update `DshClientSurface` while preserving `DshSurfaceHost` compatibility until all consumers are migrated.
3. Create passive route and screen registries for DSH app-client.
4. Add `PreferencesScreen` for DSH-only delivery preferences without leaking profile or wallet ownership.
5. Replace deep WLT imports in DSH cart/checkout boundaries with public bridge imports from `wlt/frontend/app-client/dsh`.
6. Standardize WLT bridge metadata and preview-only finance ownership.
7. Update `dsh/SERVICE_BLUEPRINT.md` and supporting docs.
8. Generate final classification CSV for all in-scope files.
9. Run static gate, `git diff --check`, and `pnpm -w exec tsc --noEmit` in repeated fix cycles.
10. Capture runtime smoke evidence only when app-client runtime or control-panel runtime is actually available.
