# bthwani-suite

`bthwani-suite` is the clean primary build line for the BTHWANI platform rebuild.

## Current Status

- bootstrap phases `00` through `07` are complete and retained as historical law and evidence
- the current governed first service is `dsh`
- approved app shells and runtimes exist as flat root directories (e.g. `app-client/runtime`, `app-partner/runtime`, etc.)
- `ui-kit/` exists as the central shared UI/design system foundation
- the current approved architecture lock is recorded in `governance/ARCHITECTURE_LOCK.md`
- surface-specific runtimes exist under their respective `<surface>/runtime/` directories
- the current execution band is the service-truth and screen-law band, with Phase `13` complete and Phase `14` next allowed

## Repo Role

- primary repo: `bthwani-suite`
- role: clean build line and future source of truth
- legacy donor repo: `bthfinal`
- donor role: reference-only, extraction-only, and comparison-only

## Governing Rules Right Now

- do not copy donor folders into this repo
- do not let app shells or preview registries redefine service truth
- do not start multiple deep service tracks before the current service is sealed with evidence
- do not create runtime truth, generated layers, or binding before their lawful later phases
- proceed only by phase order with evidence under `tools/registry/runs/{SESSION_ID}/` and governed packs under `kdt/factory/`

## Architecture Lock

- use `governance/ARCHITECTURE_LOCK.md` as the current repo-local architecture lock for workspace foundation, canonical surfaces, canonical clean service set, ownership split, contract direction, runtime phase-gating, and `wlt`-owned rates capability isolation

## Next Planned Step

After accepted Phase `13` screen purpose lock, the next allowed phase is Phase `14`: Flow Compression.

