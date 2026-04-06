# PHASE_05_MASTER_FOUNDATION_MINIMAL

## 1. Purpose

Lock the minimum naming and contract-governance layer before detail expansion begins.

## 2. Why This Phase Exists

This phase prevents later contract, screen, and package work from inventing names and ownership independently.

## 3. Preconditions / Entry Conditions

- one first service is selected
- governance core exists
- repo naming is not yet allowed to drift by service preference

## 4. Inputs

- governance core
- service order
- current repo naming reality

## 5. Allowed Work

- define service catalog
- define surface catalog
- define operation catalog template
- define OpenAPI sovereignty
- define direction and i18n ownership
- define approved surface naming explicitly

## 6. Forbidden Work

- full master contract detail build
- generated layers
- per-service contract sprawl
- service-specific UI patterns

## 7. Exact Execution Order

1. create or verify the minimal catalog and governance files
2. write `SERVICE_CATALOG.md`
3. write `SURFACE_CATALOG.md`
4. write `OPERATION_CATALOG_TEMPLATE.md`
5. write `OPENAPI_SOVEREIGNTY.md`
6. write `DIRECTION_I18N_OWNERSHIP.md`
7. write `APPROVED_SURFACE_NAMING.md`
8. cross-check the files for naming contradictions
9. record evidence and stop before detail expansion

## 8. Required Decisions

- the canonical service naming set
- the canonical surface naming set
- who owns OpenAPI truth
- who owns direction and language behavior

## 9. Required Artifacts

- `governance/SERVICE_CATALOG.md`
- `governance/SURFACE_CATALOG.md`
- `governance/OPERATION_CATALOG_TEMPLATE.md`
- `governance/OPENAPI_SOVEREIGNTY.md`
- `governance/DIRECTION_I18N_OWNERSHIP.md`
- `governance/APPROVED_SURFACE_NAMING.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-05/master-foundation-review.md`
- `kdt/volatile/registry/runs/{SESSION_ID}/phase-05/catalog-consistency-check.md`

## 10. Artifact Schema Expectations

`SERVICE_CATALOG.md` must include:

- approved service slugs
- naming notes
- forbidden ambiguity where relevant

`SURFACE_CATALOG.md` must include:

- approved internal surfaces
- internal vs visible label reminder

`OPENAPI_SOVEREIGNTY.md` must include:

- canonical contract location
- prohibition on rogue contract truth elsewhere

## 11. Cross-File Updates

- ensure the main governance guide and approved-surface naming files agree exactly
- ensure any donor naming references remain trace-only rather than canonical naming

## 12. Surface Impact

- surface naming becomes canonical
- no surface execution begins yet

## 13. UI Kit Impact

- UI Kit may now align its naming and direction behavior to canonical law
- no service-specific pattern growth is allowed

## 14. Contract Impact

- contract sovereignty becomes explicit
- contract detail work remains forbidden

## 15. Runtime Impact

- no runtime work is allowed

## 16. Validation Checklist

- catalogs exist
- names are coherent across governance files
- OpenAPI ownership is explicit
- direction and i18n ownership is explicit
- no full detail build has started

## 17. Exit Criteria

- the repo has stable naming and sovereignty rules for later service execution

## 18. Failure Modes / Common Mistakes

- writing naming lists without ownership language
- allowing donor names to remain in canonical files
- expanding contract detail under the banner of "foundation"

## 19. Anti-Patterns

- "we can normalize names after screens exist"
- "surface naming is just UI copy"
- "OpenAPI can live in many places temporarily"

## 20. Handoff To Next Phase

Deliver:

- stable naming layer
- explicit contract sovereignty
- explicit direction and language ownership

Next lawful file: `PHASE_06_UI_KIT_FOUNDATION.md`