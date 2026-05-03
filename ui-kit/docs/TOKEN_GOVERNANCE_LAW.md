# Token Governance Law

Parent authority: [BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md](./BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md)

Execution plan: [BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md](./BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md)

## Source Of Truth

The token source of truth for the current implementation window is `src/foundation/tokens/source.ts`.

No second token system may exist outside `@bthwani/ui-kit`.

## Separation Rules

- raw scales must remain distinct from semantic roles
- semantic colors must resolve from the central token source
- typography, spacing, radius, elevation, motion, sizing, borders, z-index, and opacity must remain centrally owned

## Naming Law

- names must stay stable, semantic, and domain-scoped
- raw scales use scale meaning
- semantic roles use usage meaning
- the same concept must not be renamed differently across files

## Change Law

Adding or changing tokens requires:

- identifying the domain
- confirming no existing semantic role already covers the need
- updating the token source first
- keeping public exports backward-compatible unless a reviewed migration is provided

## Export Law

Current runtime exports may stay thin wrappers around the central token source, but the source must remain the only place where the values are authored.
