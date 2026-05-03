# UIKIT_CANONICAL_STANDARD

> NOTE (example-only): Token-like strings shown in this document are canonical identifiers or branding references. If a value is used at runtime, replace it with an explicit placeholder (e.g., `__BTHWANI_EXAMPLE_TOKEN__`) and load the real value from a secure vault or CI secret. See kdt/merge-run/.../proposed/remediations/ for proposed placeholder replacements.

## Production entrypoints
- @bthwani/ui-kit
- @bthwani/ui-kit/web
- @bthwani/ui-kit/mobile
- @bthwani/ui-kit/next

## Entrypoint ownership
- index.ts = shared neutral UI only
- web.ts = web visual patterns only
- mobile.ts = mobile root only
- next.ts = next/root integration only

## Forbidden lanes
- adapters
- public root mixing of web/mobile
- preview/lab/dev/proof through production root
- framework integration through web.ts

## Runtime ownership
- language/direction/theme must remain centrally owned
- one concern = one owner = one public entry = one runtime authority
