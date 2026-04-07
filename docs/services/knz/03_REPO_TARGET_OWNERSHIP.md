# Repo Target Ownership - knz

## Owner Layers
- services/knz: domain logic and service methods
- packages/api-clients: knz client contracts
- packages/surfaces: screen composition and viewmodels
- apps/mobile/* and apps/web/control-panel: thin route shells only
- contracts/master: knz contract deltas

## Ownership Locks
- app shells must not own business truth
- service logic must remain in services/knz
