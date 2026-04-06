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
- `exchangeprice`
- `hr`
- `knz`
- `kwd`
- `mrf`
- `snd`
- `wlt`

## Current Bootstrap Status

- selected first service: `dsh`
- deferred services: `amn`, `arb`, `esf`, `exchangeprice`, `hr`, `knz`, `kwd`, `mrf`, `snd`, `wlt`

## Naming Notes

- service slugs are lower-case internal identifiers and must remain stable across governance, contracts, and service packs
- these slugs are governance names, not visible UI labels
- donor naming may appear in source trace only and must not replace the approved service slug set here

## Forbidden Ambiguity

- do not invent alias slugs for an approved service
- do not use donor folder names as canonical service names when they differ from the approved slug set
- do not treat deferred services as active merely because they are listed in the catalog

## Rule

These slugs are the official current service identifiers for bootstrap governance.
They are not permission to start multiple service tracks at once.
