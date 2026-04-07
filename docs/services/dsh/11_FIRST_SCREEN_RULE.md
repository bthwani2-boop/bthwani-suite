# First Screen Rule - dsh

## First Screen
- dsh_cart_get (surface: app-client)

## Why First
- first executable item in deterministic queue order.
- exposes required ui-kit primitives for subsequent screens in same wave.
- minimizes runtime coupling while unlocking downstream flow.

## Must Be Ready Before Start
- list/card primitives
- loading/empty/error state shells
- route handoff to dependent screens in same wave
