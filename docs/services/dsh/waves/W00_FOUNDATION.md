# W00_FOUNDATION

## Objective

Lock the handoff, target ownership, route targets, and queue order before any screen bundle opens.

## Inputs

- `26_HANDOFF_FROM_KDT.md`
- `03_REPO_TARGET_OWNERSHIP.md`
- `15_ROUTE_AND_NAV_TARGETS.csv`
- `13_BUILD_QUEUE.csv`

## Must Produce

- one stable canonical screen registry
- one stable route target table tied to real shell files
- one stable queue order with no duplicate screen openings

## Forbidden Early Openings

- no runtime code
- no service methods
- no contract deltas

## Closure Rule

W00 closes only when every retained screen has a route candidate, owner layer, and queue position.