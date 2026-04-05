# bthwani-suite

`bthwani-suite` is the clean primary build line for the BTHWANI platform rebuild.

## Current Status

- bootstrap execution is active
- the repo is in Phase 00: Repo Reset Decision
- no app, package, service, binding, or runtime implementation work is allowed yet

## Repo Role

- primary repo: `bthwani-suite`
- role: clean build line and future source of truth
- legacy donor repo: `bthfinal`
- donor role: reference-only, extraction-only, and comparison-only

## Bootstrap Rules Right Now

- do not copy donor folders into this repo
- do not start feature implementation during bootstrap
- do not create runtime, generated layers, or binding during Phase 00
- proceed only by bootstrap phase order with evidence under `kdt/volatile/registry/runs/{SESSION_ID}/`

## Next Planned Step

After Phase 00 evidence passes, the next allowed phase is Phase 01: Governance Freeze.
