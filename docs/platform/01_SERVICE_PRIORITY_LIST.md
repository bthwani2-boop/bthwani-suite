# 01_SERVICE_PRIORITY_LIST

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 03 - Platform Value Lock`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 03 active`
- BlockingGaps: `Phase 04 has not made the final first-service decision`
- NextAllowed: `Use this ranking in Phase 04; do not treat it as a final service order`

## Boundary Note

This file ranks candidates and records reasoning only.
It does not select the first service.
The final first-service lock belongs to Phase 04.

## Ranking Criteria

Candidates are ranked using these criteria:

- cross-surface significance
- ability to expose real UI Kit needs
- ability to expose real contract needs
- ability to prove service-owned truth
- risk of introducing runtime complexity too early

## Current Candidate Ranking

### Rank 1 - `dsh`

Priority status: `highest current candidate`

Reasoning:

- donor governance evidence is richest here among reviewed candidates
- donor `DSH_SERVICE_SCOPE.md` explicitly spans customer, captain, partner, field, and MCPW/control-plane actors
- this candidate best matches the approved clean surface set after normalization: `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`
- it is the strongest current candidate for exposing real screen, contract, and UI Kit pressure together

Evidence basis:

- donor `services/dsh/governance/DSH_SERVICE_SCOPE.md`
- donor `services/dsh/governance/DSH_COVERAGE_MATRIX.csv`
- current governing guide DSH example and control-plane rules

### Rank 2 - `wlt`

Priority status: `high strategic candidate, but not preferred before a visible operational service`

Reasoning:

- donor `WLT_SERVICE_SCOPE.md` shows broad financial reach across all major surfaces
- the governing guide locks all money movement through `WLT`, which makes it strategically central
- however, `WLT` is explicitly defined as backend financial/runtime truth rather than a primary visible daily workspace
- starting with `WLT` first would increase runtime and finance complexity before a visible operational service flow is proven

Evidence basis:

- donor `services/wlt/governance/WLT_SERVICE_SCOPE.md`
- governing rule `Finance vs WLT Separation`

Normalization note:

- donor `exchangeprice` is not carried forward as an independent clean service candidate
- clean target architecture treats exchange-rate behavior as a low-privilege `wlt`-owned rates capability instead

### Rank 3 - `snd`

Priority status: `small-scope fallback candidate`

Reasoning:

- donor `SND_SERVICE_SCOPE.md` shows a much smaller operational scope than `dsh` or `wlt`
- its narrow size makes it easier to reason about, but it exposes less cross-surface and UI Kit pressure than `dsh`
- it remains useful as a fallback if the Phase 04 decision optimizes for minimal surface area rather than maximum leverage

Evidence basis:

- donor `services/snd/governance/SND_SERVICE_SCOPE.md`

### Deferred Bucket - `amn`, `arb`, `esf`, `hr`, `knz`, `kwd`, `mrf`

Priority status: `deferred due insufficient current evidence`

Reasoning:

- these services were observed in Phase 02 at the donor repo root
- this phase did not collect enough scope evidence to rank them responsibly above the three reviewed candidates
- they remain eligible for later review, but not for premature promotion based on name alone

## Final Phase 03 Priority Verdict

- `dsh` is the strongest current candidate for Phase 04 selection
- `wlt` is strategically central but operationally heavier and should not be chosen first without explicit reasoning
- `snd` is the current low-scope fallback candidate
- final first-service selection remains deferred to Phase 04
