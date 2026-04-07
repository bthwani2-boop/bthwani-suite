# 02_IMPLEMENTATION_SCOPE

## In Scope

- 13 canonical DSH operation families
- 20 retained clean screens across `app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel`
- one screen-first execution queue
- one wave model
- clean target file targets for screens, route registries, viewmodels, service methods, binding, and runtime classes

## Explicitly Out Of Scope

- wallet, ledger, settlement, payout, and general finance behavior
- `webapp` and `website` DSH execution ownership
- donor customer loyalty, subscription, profile, favorites, promo, and marketing clusters
- donor partner subscription analytics, intake admin, staff invite, and document admin clusters
- donor captain finance, wallet, settlements, and tier spillover as first-service screens
- donor control-panel arrival-bell misc admin and service-catalog spillover as first-service core screens

## Guardrails

- build from KDT evidence only
- normalize donor naming in clean outputs
- keep implementation thin until queue items open lawfully
- record blockers instead of bypassing them