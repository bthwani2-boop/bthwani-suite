# 00_REQUEST_SUMMARY

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Phase 09 - Operation Lock`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `partially ready`
- BlockingGaps: `Surface responsibility lock and journey lock remain ahead`
- NextAllowed: `Use this pack as the input to Phase 10 only`

## Request Classification

- task kind: `source_to_target_pack`
- service scope: `dsh`
- execution mode: post-bootstrap service deepening
- output mode: implant-ready pack for target repo use

## Exact Scope

- convert DSH actor lock into canonical operations
- avoid copying the full donor API catalog as-is
- lock only what is sufficiently supported by current evidence
- keep finance ownership outside DSH except where DSH triggers or reflects financial side effects
