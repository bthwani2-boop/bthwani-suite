# 00_SERVICE_BUILD_ORDER

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 04 - Service Order`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 04 active`
- BlockingGaps: `Phase 05-07 artifacts for the selected service are not created yet`
- NextAllowed: `Use this decision to drive Phase 05-07 only`

## Final First-Service Selection

Selected first service slug:

- `dsh`

## Ordered Service Start Rule

Current governed build order:

1. `dsh`

All other services remain deferred until `dsh` is governed through its allowed bootstrap outputs and later sealed with evidence.

## Selection Reason

`dsh` is selected first because it is the strongest current candidate for exposing the platform's core operational shape.

Its current advantages are:

- strongest observed cross-surface reach among reviewed candidates
- strongest current pressure on UI Kit, screen, contract, and control-plane structure together
- strong fit with approved clean surface naming after donor normalization
- better first-service visibility than `wlt`, which is strategically central but more runtime-heavy and finance-heavy
- broader leverage than `snd`, which is smaller and useful as a fallback but weaker as a first wide-shaping service

## Explicit Rejections In This Phase

- reject parallel start of multiple services
- reject choosing `wlt` first without a stronger reason than current evidence supports
- reject choosing a deferred-bucket service without new evidence
- reject treating this file as permission to start implementation code

## Evidence Basis

- `docs/platform/01_SERVICE_PRIORITY_LIST.md`
- donor `services/dsh/governance/DSH_SERVICE_SCOPE.md`
- donor `services/wlt/governance/WLT_SERVICE_SCOPE.md`
- donor `services/snd/governance/SND_SERVICE_SCOPE.md`
