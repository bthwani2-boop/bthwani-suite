# Repo Target Ownership - dsh

## Owner Layers
- services/dsh: domain logic and service methods
- packages/api-clients: dsh client contracts
- packages/surfaces: screen composition and viewmodels
- apps/mobile/* and apps/web/control-panel: thin route shells only
- contracts/master: dsh contract deltas

## Ownership Locks
- app shells must not own business truth
- service logic must remain in services/dsh
