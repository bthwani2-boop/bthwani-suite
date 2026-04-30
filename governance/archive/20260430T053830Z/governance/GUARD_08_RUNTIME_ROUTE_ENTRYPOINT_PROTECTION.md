# GUARD-08 — Runtime / Route Entrypoint Protection Guard

## Purpose

Protect route, runtime, shell, host, bootstrap, provider, and navigation entrypoints from unsafe dead-code cleanup.

Direct import absence is not enough proof for framework or runtime entrypoints.

## Mode

CHECK-only and warning-first until baseline review is complete.

## Protects

- Next.js `app/**/page|layout|route|loading|error|not-found|template`
- mobile app hosts and bootstrap files
- `SurfaceHost`, `AppShell`, navigation, router, provider, root, entry, and host files
- GUARD-03 remediation queue overlaps with protected entrypoints

## Rule

No delete, move, rename, or cleanup is allowed for these files without runtime proof, route proof, owner decision, rollback path, and full guard rerun.
