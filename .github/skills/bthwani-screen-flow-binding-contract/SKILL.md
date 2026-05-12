---
name: bthwani-screen-flow-binding-contract
description: Use before any screen, navigation, flow, binding, integration, route, params, or state-machine work in BThwani.
version: 2026.05.12-v2
---

# BThwani Screen / Flow / Binding Contract

## Required contract fields
No screen or flow change is complete without:

```text
screenId
surface
service
ownerPath
route / routeKey
params
entrypoints
exits
permissions
uiKitDependencies
bindingInputs
bindingOutputs
integrationSource
states: loading / empty / error / success / offline / disabled
rtlContract
visualEvidence
verification
status: CONFIRMED / GAP / TBD / BLOCKED
```

## Phase law
UI/UX/Flow-only means:

```text
No API
No binding implementation
No integration
No backend
No runtime provider changes
```

unless the user explicitly asks for binding/integration/API work.

## Merge-safe minimum
A screen change cannot be marked ready unless:

- owner path is known
- route and params are known or marked `TBD` with risk
- entrypoints/exits are known or marked `TBD` with risk
- binding inputs/outputs are known or marked `TBD` with risk
- all required states are addressed
- visual evidence exists for visible UI changes
- git diff and typecheck evidence exist
