# Draft Canonical: Platform Overview

This is a draft canonical overview produced by the `kdt/merge-run` process. It is NON-DESTRUCTIVE and intended for human review and consolidation.

Provenance:
- Primary source: governance/PLATFORM_BLUEPRINT.md (extracted canonical candidate)
- Extraction session id: FIX_LEGACY_EXTRACTED_METADATA_SAFE-20260429-220722

---

## Executive Summary (draft)

BThwani is a multi-service, multi-surface platform. It should not be treated as scattered screens. It must be governed as a complete operating system across:

- Mobile apps: `app-client`, `app-partner`, `app-captain`, `app-field`.
- Web apps: `control-panel`, `webapp`, `website`.
- Canonical services: `dsh`, `wlt`, `knz`, `arb`, `amn`, `esf`, `mrf`, `snd`, `kwd`.
- Platform packages: `ui-kit`, `app-shells`, `surfaces`, `api-types`, `api-clients`.
- Runtime/backend/service layer: `services`, `contracts`, generated clients, binding adapters, providers.
- Governance/evidence: `governance`, `docs/governance`, `tools/registry/runs`.

The platform must be closed through evidence, not appearance. The correct high-level model is:

```
apps/*                  = Shell / host only
packages/app-shells     = Root shell behavior only
packages/surfaces       = Screens, flows, service-owned and surface-owned experiences
packages/ui-kit         = Central reusable design authority
contracts/*             = API/domain contracts if present and proven
packages/api-types      = Contract-derived API types
packages/api-clients    = Contract-derived API clients
services/*              = Backend/domain implementation if present and proven
governance              = Canonical standards and policies
docs/governance         = Transitional until reconciled
tools/registry/runs     = Evidence packs only
```

The first closure target should be DSH because it crosses the customer, partner, captain, field/ops, control-panel, wallet/payment, and backend/API boundaries. DSH is the golden vertical slice for proving the whole platform.

## Platform Vision (draft)

### What BThwani is

BThwani is a unified service platform that connects customers, stores/partners, captains, field teams, operations, finance/wallet, marketing, support, and administrators through a consistent design system and governed service architecture.

### Core value (high-level)

- One coherent customer experience.
- One partner/store operating model.
- One captain task/delivery model.
- One field support/inspection model where proven.
- One control-panel governance and operations model.
- One wallet/ledger financial authority.
- One UI kit and visual language.
- One evidence-first execution system.

## Governing principles (draft)

```
Evidence before claims.
No CLOSED without evidence.
No local design system.
No screens inside apps.
No service screen bodies in app-shells.
No direct screen-to-backend coupling.
No deletion before zero-consumer proof.
Anything unproven = [TBD].
```

---

Notes / Next steps for this draft:
- This file is an initial extract and must be reviewed and edited by owners to create final canonical phrasing.
- Preserve provenance comments for every promoted paragraph.
- After review, move `proposed/canonical/GOV_PLATFORM_OVERVIEW.md` into `governance/` as `PLATFORM_OVERVIEW.md` via a PR (dry-run prepared automatically).

-- End Draft --
