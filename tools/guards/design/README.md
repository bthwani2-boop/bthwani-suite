# BTHWANI Design Guard

This directory owns design guard configuration only.

Rules:
- `ui-kit` is the design authority.
- Runtime code must not import from `.tamagui`, `graphify-out`, `tools/registry/runs`, or `tools/analysis`.
- Tamagui direct imports are allowed inside `ui-kit` only.
- Generated guard outputs are disposable and must stay outside runtime.
- Visual/design acceptance still requires evidence; these guards are not a visual PASS by themselves.
