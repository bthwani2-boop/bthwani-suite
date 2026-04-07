# W08_BINDING_AND_CONTRACT

## Objective

Open viewmodel, service-method, and contract-pressure work only after screen waves are stable.

## Inputs

- `17_VIEWMODEL_AND_CLIENT_TARGETS.csv`
- `18_SERVICE_METHOD_TARGETS.csv`
- `19_CONTRACT_DELTAS.md`
- `20_BINDING_TARGETS.csv`

## Required Before Open

- W01 through W05 are documented and target-stable
- no unresolved ownership drift remains in screen files

## Forbidden Scope Drift

- no donor client copy-as-is
- no raw fetch from screens
- no contract generation before clean target shapes exist

## Closure Rule

W08 closes only when every binding target is explicit and every service-method target still respects clean ownership.