# Component Constitution

Parent authority: [BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md](./BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md)

Execution plan: [BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md](./BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md)

## Scope

This constitution governs which component families may exist inside `@bthwani/ui-kit`, how they enter the package, and how they remain lawful shared authority.

## Public API Law

- every shared export must be reachable from `src/index.ts`
- deep imports into `@bthwani/ui-kit/*` internals are forbidden for consumers
- public names must stay semantic and stable, using the `bthwani*` prefix for public component families
- breaking public API changes require explicit review and a migration path

## Admission Rules

A component may enter the package only if it is:

- service-clean
- semantically stable
- reusable across lawful surfaces
- aligned with theme, direction, and accessibility ownership
- documented with usage and anti-usage boundaries

## Required Proof Per Family

Each family must define:

- semantic purpose
- allowed variants
- required states
- accessibility behavior
- RTL/LTR behavior
- theming behavior
- anti-usage boundaries

## Forbidden Content

The package must not absorb:

- business logic
- service-owned widgets before reuse evidence exists
- route-aware screen logic
- duplicate authorities for tokens, themes, direction, or state shells

## Family Classes

Current lawful classes are:

- primitives
- interaction components
- state families
- overlays
- navigation families
- data display families

Screen-pattern families are provisional until pattern promotion evidence passes the contract.

