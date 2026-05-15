# DSH Do Not Touch — Loop 1

Status: DONE_LOCAL
Loop: 1
Date: 2026-05-15

## Purpose

Explicit list of files and paths that must not be modified in any loop without
an explicit prompt granting permission. Any agent touching these files must stop
and report BLOCKED.

## WLT-owned files — absolute boundary

| Path | Reason |
|---|---|
| `wlt/frontend/app-partner/dsh/WltDshPartnerBridge.tsx` | WLT-owned finance bridge; DSH reads only |
| `wlt/frontend/app-captain/dsh/WltDshCaptainBridge.tsx` | WLT-owned finance bridge; DSH reads only |
| `wlt/frontend/app-field/dsh/WltDshFieldBridge.tsx` | WLT-owned finance bridge; DSH reads only |
| `wlt/frontend/**` | All WLT frontend files; DSH has no write authority |

## OpenAPI — forbidden until gate unlocked

| Path | Reason |
|---|---|
| `dsh/dsh.openapi.yaml` | CONTRACT_TBD; forbidden until Screen/API Matrix + Contract Gap Map complete |

## Active closure control docs — append only

| Path | Reason |
|---|---|
| `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` | ACTIVE_CLOSURE_CONTROL; read-only source; no edits |
| `dsh/docs/SCREEN_API_MATRIX.md` | ACTIVE_CLOSURE_CONTROL; NOT_READY_FOR_API gate active |
| `dsh/docs/CLOSURE_DECISION_LOG.md` | Append-only log; no restructuring |
| `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` | Evidence matrix; no edits |
| `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md` | Active ownership decision; no edits without explicit approval |
| `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md` | WLT-related roadmap; no touch |
| `dsh/docs/MIGRATION.md` | Migration history; no touch |

## Workspace infrastructure — no touch

| Path | Reason |
|---|---|
| `package.json` (any) | Dependency change forbidden |
| `pnpm-workspace.yaml` | Workspace config; no touch |
| `*.lock` | Lockfiles; no touch |
| `.github/**` | CI/CD configs; no touch |
| `nx.json` | Nx workspace config; no touch |
| Generated files | Any auto-generated output; no touch |

## Screen registry files — read-only in Loops 1–3

| Path | Reason |
|---|---|
| `dsh/frontend/app-client/dsh-client.screen-registry.ts` | Source of truth; only update in Loop 4 with explicit gap-map evidence |
| `dsh/frontend/app-partner/dsh-partner.screen-registry.ts` | Source of truth for Loop 1–3 |
| `dsh/frontend/app-captain/dsh-captain.screen-registry.ts` | Source of truth; DshCaptainMapScreen gap must be addressed in Loop 4 |
| `dsh/frontend/app-field/dsh-field.screen-registry.ts` | Source of truth for Loop 1–3 |
