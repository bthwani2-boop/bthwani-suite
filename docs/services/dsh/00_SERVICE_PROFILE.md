# 00_SERVICE_PROFILE

## Mandatory Header

- WorkMode: `TARGET-FIT MODE`
- CurrentPhase: `Phase 13 complete; Phase 14 next`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `stable service dossier refreshed and aligned with current normalized DSH packs`
- BlockingGaps: `Phase 14 flow compression remains open; Phase 15+ screen, UI Kit, contract, binding, and runtime work remains downstream`
- NextAllowed: `Use this profile to drive Phase 14 - Flow Compression`

## Service Identity

- service slug: `dsh`
- clean working name: `Delivery & Store Hub`
- current target role: first governed service in the active repo

## Current Service Purpose

`dsh` owns the operational order and store hub that starts with customer order intent, moves through partner handling and captain execution, optionally invokes field support, and exposes internal DSH governance through `control-panel` only when oversight or exception handling is needed.

## Confirmed Donor Scope Facts

- donor service scope file states `92` in-scope `dsh_*` operations
- donor service governance contains `92` operation dossier folders under `services/dsh/governance/operations/`
- donor DSH uses five participating surfaces: `APP_USER`, `APP_CAPTAIN`, `APP_PARTNER`, `APP_FIELD`, and `MCPW`
- donor DSH also references five unified wrapper operations outside the `92`: `entity_favorite_toggle`, `entity_list`, `entity_accept`, `entity_get`, and `captain_availability_update`

## Current Normalized Target Model

- normalized actor/context rows: `7`
- normalized operation families: `13`
- normalized surface rows: `7`
- normalized operation/surface coverage rows: `17`
- full screen candidates reviewed: `43`
- canonical screens accepted: `20`

## Primary Job

- govern the end-to-end DSH lifecycle from discovery and checkout through partner handling and captain execution, while keeping ownership clean and internal ops narrow

## Secondary Jobs

- preserve customer-visible lifecycle clarity without giving customer surfaces ownership of partner or captain work
- preserve partner and captain action ownership inside their own surfaces
- keep `control-panel` limited to governance, exceptions, proxy review, and operational controls
- keep `app-field` optional and evidence-backed rather than mandatory by default

## Current Boundary Lock

Inside current DSH scope:

- customer discovery, cart, checkout, submission, tracking, and customer-side chat
- partner order handling and partner store-readiness maintenance
- captain offer acceptance, delivery execution, and proof gating
- optional field activation and visit support
- internal ops governance, proxy review, and peak-mode style controls

Outside current DSH scope:

- wallet, ledger, settlement, payout, and general finance ownership
- website and webapp public ownership in the current first-service model
- donor clusters moved to legacy or future scope after screen rationalization
- current-phase contract, binding, runtime, and closure implementation work

## Donor Implementation Facts

- donor `DSH_SERVICE_SEAL_STATUS.yaml` claims `operations_implemented: 8` and `operations_planned_only: 84`
- donor `DSH_TRACEABILITY.csv` contains `10` rows marked `VERIFIED` and `84` rows marked `PLANNED_ONLY`
- this is a confirmed donor inconsistency and must be recorded rather than flattened into a false single count
- the verified donor implementation cluster is concentrated around proxy-request operations plus field activation support

## Major Dependencies

- approved surface naming and donor-name normalization rules
- `control-panel` internal-ops boundary law
- `WLT` separation law for finance and money movement
- current normalized packs under `kdt/factory/dsh/`
- donor DSH governance and donor master files as evidence sources only, never automatic target truth

## Failure Modes To Keep Visible

- actor or surface ownership drift
- control-panel growth into a second execution app
- field support becoming mandatory without evidence
- donor split-screen sprawl leaking into the clean screen tree
- finance and wallet truth leaking into DSH because checkout exists here
- treating donor master files as cleaner than the current normalized packs

## Current `[TBD]` And Downstream Items

- Phase 14 flow compression over the accepted canonical screen set
- Phase 15 UI Kit expansion only where compressed screens prove demand
- Phase 16 state lock and Phase 17 screen/API matrix after flow compression
- later contract, binding, runtime, and closure phases only when their lawful entry gates open
