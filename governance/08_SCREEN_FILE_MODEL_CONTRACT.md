# Screen File Model Contract

## Purpose

This contract prevents bloated screen files, tiny fragmented block files, and unclear folder ownership.

## Core Rule

A screen is a product route or major product experience. A small block inside a screen is not automatically a screen.

## Recommended Structure

For each service/surface feature:

```text
feature-or-flow/
  index.ts
  ScreenName.tsx
  parts/
    ...
  hooks/
    ...
  data/
    ...
  types.ts
```

Use this structure only when the feature needs it. Do not create folders for noise.

## Naming

Use names that describe product ownership:

- `orders`
- `store`
- `catalog`
- `wallet`
- `availability`
- `tasks`
- `dashboard`

Avoid ambiguous names such as:

- `misc`
- `shared2`
- `new`
- `screen-final`
- `blocks`
- `tmp`

## One File vs Multiple Files

Use one screen file when:

- the screen is small
- parts are not reused
- splitting would reduce clarity

Split into `parts/` when:

- the screen becomes hard to read
- parts are semantically meaningful
- parts are not standalone route screens

Do not create a route/screen file for every small card or visual block.

## Orders Example

All order-related screens/flows for a given service/surface should live under a clear `orders` or `order` feature folder depending on whether the area is a collection or a single order detail.

Do not scatter order screen pieces across unrelated folders.

## Verification

A screen model is valid when a developer can locate the owner, feature, and surface from the path without guessing.
