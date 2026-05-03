# Adoption Start

## Recommended Phase 06 adoption order

1. Wrap web app roots with `BthWebRootLayout` and mobile app roots with `BthMobileRoot`
2. Replace local text wrappers with `BthText`
3. Replace local surfaces and section frames with `BthSurface` and `BthBox`
4. Replace local buttons and fields with `BthButton`, `BthTextField`, and `BthSearchField`
5. Adopt `BthStateView` and the shared state catalog for loading, empty, recovery, and offline families
6. Defer `patterns/*` adoption until later screen-proven UI Kit expansion

## Objective

Reduce local visual decision-making inside screens and progressively move ownership into `ui-kit`.

## Current blocker

Pilot web/mobile validation interfaces are not lawful in the active Phase 06 window. They should start only after later screen phases unlock real retained-screen validation.
