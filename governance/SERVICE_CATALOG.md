# SERVICE_CATALOG

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 05 - Master Foundation Minimal`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 05 active`
- BlockingGaps: `Only the first service has been selected; deeper service truth is deferred`
- NextAllowed: `Use these service slugs as the official bootstrap catalog only`

## Official Bootstrap Service Slugs

The current official service catalog for bootstrap is:

- `amn`
- `arb`
- `dsh`
- `esf`
- `hr`
- `knz`
- `kwd`
- `mrf`
- `snd`
- `wlt`

## Current Bootstrap Status

- selected first service: `dsh`
- deferred services: `amn`, `arb`, `esf`, `hr`, `knz`, `kwd`, `mrf`, `snd`, `wlt`
- cross-service operating law may be recorded globally, but deferred services remain deferred for implementation packs, contracts, and runtime work until separately unlocked

## Architectural Ownership Clarification

- donor `exchangeprice` is not carried forward as an independent clean service slug
- clean target architecture adopts exchange-rate behavior as a `wlt`-owned capability under the rates split defined by `governance/ARCHITECTURE_LOCK.md`
- `exchangeprice` may still appear in donor trace or historical evidence, but it does not become a second financial owner or a parallel clean service track

## Naming Notes

- service slugs are lower-case internal identifiers and must remain stable across governance, contracts, and service packs
- these slugs are governance names, not visible UI labels
- donor naming may appear in source trace only and must not replace the approved service slug set here

## Forbidden Ambiguity

- do not invent alias slugs for an approved service
- do not use donor folder names as canonical service names when they differ from the approved slug set
- do not reopen `exchangeprice` as an independent clean service without an explicit governance change that replaces the current `wlt`-owned capability model
- do not treat deferred services as active merely because they are listed in the catalog

## Rule

These slugs are the official current service identifiers for bootstrap governance.
They are not permission to start multiple service tracks at once.
