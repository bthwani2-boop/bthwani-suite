# Project Structure Registry

**Status:** Canonical Governance Payload v2
**Owner:** `Repository Governance`
**Last Updated:** 2026-06-07

## Active Workspace Roots

The workspace relies on flat active roots as configured in [pnpm-workspace.yaml](file:///c:/bthwani-suite/pnpm-workspace.yaml).

### Surface Runtime Paths

Each surface is implemented under its own root-level directory containing a `runtime/` subdirectory:

* **Client App:** [app-client/runtime](file:///c:/bthwani-suite/app-client/runtime)
* **Partner App:** [app-partner/runtime](file:///c:/bthwani-suite/app-partner/runtime)
* **Captain App:** [app-captain/runtime](file:///c:/bthwani-suite/app-captain/runtime)
* **Field App:** [app-field/runtime](file:///c:/bthwani-suite/app-field/runtime)
* **Control Panel:** [control-panel/runtime](file:///c:/bthwani-suite/control-panel/runtime)
* **Web App:** [webapp/runtime](file:///c:/bthwani-suite/webapp/runtime)
* **Website:** [website/runtime](file:///c:/bthwani-suite/website/runtime)

### Shared UI System

* **UI Kit:** [ui-kit](file:///c:/bthwani-suite/ui-kit) is the central design system and UI package. The path `packages/ui-kit` is retired.

### Service Roots

All services remain independent root-level folders:

* **DSH:** [dsh/](file:///c:/bthwani-suite/dsh)
* **WLT:** [wlt/](file:///c:/bthwani-suite/wlt)
* **KNZ:** [knz/](file:///c:/bthwani-suite/knz)
* **ARB:** [arb/](file:///c:/bthwani-suite/arb)
* **AMN:** [amn/](file:///c:/bthwani-suite/amn)
* **ESF:** [esf/](file:///c:/bthwani-suite/esf)
* **MRF:** [mrf/](file:///c:/bthwani-suite/mrf)
* **SND:** [snd/](file:///c:/bthwani-suite/snd)
* **KWD:** [kwd/](file:///c:/bthwani-suite/kwd)

## OpenAPI Contract Status

* **Root Placeholders:** [auth.openapi.yaml](file:///c:/bthwani-suite/auth.openapi.yaml) and [master.openapi.yaml](file:///c:/bthwani-suite/master.openapi.yaml) at the workspace root are placeholders marked as `CONTRACT_TBD`. They do not represent closed contracts.
* **Contracts Directory:** There is no `contracts/master` directory in this workspace.

## Stale References

The following paths and patterns are retired and must be treated as `STALE_REFERENCE` if mentioned as current active structures in any documentation or scripts (unless explicitly in a historical transition context):

* `apps/mobile/*` (e.g., `apps/mobile/app-captain`, `apps/mobile/app-partner`)
* `apps/web/*`
* `packages/ui-kit`
* `packages/surfaces`
* `packages/app-shells`
* `contracts/master/*`

## Nx Follow-up

* **Graph Verification:** The current project graph roots are regenerated and stored in [projects.json](file:///c:/bthwani-suite/projects.json).
* **Command Cleanup:** Stale reference commands mentioning `apps/mobile` or `apps/web` must be removed or updated in follow-up tasks.
* **Target Addition:** Add and verify safe Nx targets gradually.
* **Restructuring Scope:** No broad Nx project graph structural reorganization is permitted under this cleanup task.
