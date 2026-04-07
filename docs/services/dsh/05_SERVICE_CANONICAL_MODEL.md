# 05_SERVICE_CANONICAL_MODEL

## Service Core

`dsh` is the platform's first governed delivery and store-operations service.
Its clean model is a single customer-to-delivery system with narrow internal oversight, not a loose bundle of donor route trees.

## Canonical Actor Model

- customer enters in `app-client`
- partner handles store-side work in `app-partner`
- captain executes delivery in `app-captain`
- ops intervene only in `control-panel`
- field participates only when the optional activation branch is explicitly opened

## Canonical Operation Model

- discovery
- cart and checkout gate
- order submission
- customer tracking
- cross-surface order chat
- partner order handling
- partner store maintenance
- captain offer and acceptance
- captain delivery execution
- delivery proof and verification
- field activation support
- proxy request flow
- ops governance controls

## Canonical Screen Model

- 7 client screens
- 4 partner screens
- 3 captain screens
- 1 field screen
- 5 control-panel screens

## Rejected Carryover

- donor route count does not equal clean screen count
- donor MCPW breadth does not equal clean control-panel ownership
- donor finance adjacency does not make DSH a finance owner