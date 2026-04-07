# ARCHITECTURE_LOCK

## Mandatory Header

- WorkMode: `NEW-REPO STEWARD MODE`
- CurrentPhase: `Post-Bootstrap Governance Clarification`
- TargetService: `_shared`
- RequestType: `clean-and-package`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Approved current-state architecture lock`
- BlockingGaps: `Web framework lock, backend framework lock, and runtime implementation remain phase-gated until explicitly governed`
- NextAllowed: `Use this file as the canonical current-state architecture lock without treating it as blanket permission for premature implementation expansion`

## Purpose

This file locks the current approved architecture of `bthwani-suite` at the repo-governance level.

It records what is already canonical in the clean repo now:

- workspace foundation
- canonical surface set
- canonical service set
- first governed service
- ownership boundaries
- shared package roles
- contract authority direction
- runtime phase-gating direction
- WLT-owned rates capability isolation

It does not convert donor stack details or future implementation preferences into approved target truth unless they are already locked by repo-local governance artifacts.

## Canonical Workspace Foundation

The canonical workspace foundation for `bthwani-suite` is:

- `pnpm`
- `Nx`
- `TypeScript`

These tools are the governing monorepo foundation for package management, workspace orchestration, task execution, and typed build discipline.

## Canonical Surface Set

The canonical internal surface set is:

- `app-client`
- `app-partner`
- `app-captain`
- `app-field`
- `control-panel`
- `webapp`
- `website`

These are internal architecture names used in code, paths, governance, contracts, and ownership.

## Canonical Service Set

The canonical current clean service set is:

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

Rules:

- these are the current canonical clean service identifiers
- donor-only names may appear in source trace, not as replacement service truth
- `exchangeprice` is not a standalone clean service slug in the target repo architecture lock

## First Governed Service Lock

The current first governed service is:

- `dsh`

All other services remain deferred for implementation packs, contracts, binding, and runtime work until they are separately unlocked by lawful phase progression.

## Ownership Lock

The current architecture lock includes these ownership boundaries:

- app shells are thin delivery shells only
- service and backend truth belong under `services/*`
- shared UI foundation belongs under `packages/ui-kit`
- shared surface-facing structure belongs under `packages/surfaces`
- canonical contract authority belongs under `contracts/master`

This means app shells may render, orchestrate, and deliver approved truth, but they do not become service owners, contract owners, or runtime owners.

## Contract Direction Lock

The canonical contract direction is:

- source authority lives under `contracts/master`
- service and screen truth must expose demand before canonical contract expansion
- generated outputs and binding layers remain derived truth only when introduced later

This file does not authorize API-first rebuild, generated-client-first rebuild, or premature binding expansion.

## Runtime Direction Lock

The canonical runtime direction at this stage is:

- runtime remains phase-gated
- no active `runtime/` tree is currently adopted in the target repo
- runtime may only be introduced through lawful later phases after the required service, screen, contract, and binding steps are complete

This file locks the governance direction for runtime timing and ownership, not a prematurely implemented runtime stack.

## WLT Rates Capability Lock

`exchangeprice` is adopted as a `wlt`-owned capability, not as an independent financial owner and not as a second money-moving path.

The clean split is:

- `wlt-core` owns `ledger`, `balances`, `settlement`, and `payouts`
- `wlt-rates` owns read-only exchange-rate access and rate snapshot records only
- `wlt-rates-adapter` owns provider fetch and synchronization only
- `wlt-rates-store` owns isolated rate storage or tables only

Isolation rules:

- `wlt-rates`, `wlt-rates-adapter`, and `wlt-rates-store` are low-privilege financial support capabilities
- they may not directly read or mutate wallet-sensitive data beyond their approved published interfaces
- they may not own `ledger`, `balances`, `settlement`, `payouts`, or any direct money-moving behavior
- they may not introduce an alternate financial write path outside `wlt-core`
- provider integration for exchange rates must not become a hidden bridge into wallet-sensitive internals

Interpretation rule:

- donor `exchangeprice` remains valid as trace evidence when needed
- clean target-facing architecture treats exchange-rate capability as subordinate to `wlt` rather than as an independent clean service track

## Explicit Non-Locks

This file does not currently lock:

- one final web framework for every web surface
- one final backend framework for every backend service
- a full runtime technology stack implementation
- a blanket implementation unlock for deferred services

Those decisions may be adopted later only through explicit repo-local governance artifacts that match current repo reality and phase law.

## Official Lock Summary

> **BTHWANI ARCHITECTURE LOCK — APPROVED**  
> The canonical foundation for `bthwani-suite` is `pnpm + Nx + TypeScript`. The canonical internal surfaces are `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`, `webapp`, and `website`. The canonical current clean service set is `amn`, `arb`, `dsh`, `esf`, `hr`, `knz`, `kwd`, `mrf`, `snd`, and `wlt`, with `dsh` as the current first governed service. App shells are thin delivery shells only. Service truth belongs to `services/*`, shared UI foundation belongs to `packages/ui-kit`, shared surface structure belongs to `packages/surfaces`, and canonical contract authority belongs to `contracts/master`. Runtime remains phase-gated. `exchangeprice` is adopted as a `wlt`-owned low-privilege rates capability, isolated from wallet-sensitive logic and storage, with `wlt-core` retaining sole ownership of ledger, balances, settlement, and payouts.