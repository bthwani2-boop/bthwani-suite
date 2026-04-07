# Replacement Architecture

## Executive Verdict

The new execution package is a registry-first, evidence-first, group-aware operating system for service execution.

## Source Trace Summary

Architecture derived from:

- the weaknesses found in the old execution docs
- the confirmed availability of donor repo `bthfinal`
- repo-local governance on names, surfaces, ownership, and bootstrap boundaries

## Target Repo Fit Summary

- naming alignment status: `uses approved target names`
- structural fit status: `compatible with current docs/execution and kdt/factory layout`
- duplication risk: `low in canonical layer, still present in legacy service packs`

## Cleaned / Normalized Model

The package is split into five layers:

1. constitutional layer
   - `docs/governance/**`
   - states repo laws and execution constraints
2. execution operating layer
   - `docs/execution/00_PHASE_EXECUTION_INDEX.md`
   - `docs/execution/BTHWANI GUIDE — Generic Screen Execution Runbook.md`
   - `docs/execution/BTHWANI GUIDE — Post-Bootstrap Gate Pack.md`
3. literal phase-manual layer
   - `docs/execution/phases/PHASE_08_*` through `PHASE_18_*`
4. service evidence and export layer
   - `kdt/factory/<service>/packs/**`
   - `kdt/factory/<service>/exports/**`
   - `kdt/factory/<service>/index/**`
5. migration and reset governance layer
   - `kdt/factory/_cross-service/packs/execution-package-reset/**`

## Exact Execution Ladder

- `07` first service foundation
- `08` actor context exhaustive extraction
- `09` operation master extraction
- `10` surface coverage and wave matrix
- `11` journey chain master
- `12` screen master census and normalization
- `13` screen spec and purpose system
- `14` grouping and build order
- `15` UI Kit expansion
- `16` state lock
- `17` screen API matrix
- `18` gap map

## Prevention Guidance For The New Repo

- phase meaning must be registry-backed, not adjective-backed
- every later phase must consume exact exports from earlier phases
- no preview or implementation-like momentum is allowed to outrun registry truth

## Final Readiness Verdict

`ACCEPT_FOR_PACKAGING`