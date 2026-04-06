# Adoption Start

## Recommended first adoption order
1. Wrap app roots with `UiKitProvider`
2. Replace local text wrappers with `BthText`
3. Replace local buttons with `BthButton`
4. Replace local field shells with `BthTextField`
5. Adopt `BthStateView` for loading/empty/error/success
6. Adopt `BthListScreenShell` and `BthFormScreenShell` where suitable

## Objective
Reduce local visual decision-making inside screens and progressively move ownership into `ui-kit`.
