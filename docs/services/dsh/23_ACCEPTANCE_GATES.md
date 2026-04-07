# 23_ACCEPTANCE_GATES

## Gate A - Document Readiness

- screen row exists in `09_SCREEN_REGISTRY.csv`
- screen file exists under `screens/`
- route target exists in `15_ROUTE_AND_NAV_TARGETS.csv`
- component and viewmodel targets exist
- screen state row exists

## Gate B - Code Readiness

- required UI-Kit prerequisites are marked done or already present
- target path under `packages/surfaces` is explicit
- no unresolved wave blocker remains
- no forbidden runtime or contract dependency is hiding inside the screen bundle

## Gate C - Close Readiness

- state coverage is explicit and reviewed
- screen ownership does not drift across surfaces
- binding target row exists when the queue reaches W08
- proof path row exists when the queue reaches W09

## Wave Pass Rule

A wave passes only when every screen or item in that wave passes Gate A, then Gate B, then Gate C.