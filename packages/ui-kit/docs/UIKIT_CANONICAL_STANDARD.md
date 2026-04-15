# UIKIT_CANONICAL_STANDARD

## Production entrypoints
- @bthwani/ui-kit
- @bthwani/ui-kit/web
- @bthwani/ui-kit/mobile
- @bthwani/ui-kit/next

## Governed preview entrypoint
- @bthwani/ui-kit/preview

## Entrypoint ownership
- index.ts = shared neutral UI only
- web.ts = web visual patterns only
- mobile.ts = mobile root only
- next.ts = next/root integration only
- preview.ts = governed preview only

## Forbidden lanes
- adapters
- public root mixing of web/mobile
- preview/lab/dev/proof through production root
- framework integration through web.ts

## Runtime ownership
- language/direction/theme must remain centrally owned
- one concern = one owner = one public entry = one runtime authority
