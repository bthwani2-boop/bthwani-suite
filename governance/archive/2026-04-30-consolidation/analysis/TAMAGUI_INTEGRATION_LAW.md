---
generatedFrom: governance/TAMAGUI_INTEGRATION_LAW.md
generatedAt: 2026-04-30T04:48:37.9317465+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Tamagui Integration Law

- Status: APPROVED
- Scope: `packages/ui-kit`, `apps/**`, `packages/surfaces/**`, `packages/app-shells/**`, and the exact-path build tool exception at `tamagui.build.ts`
- Authority: Governance SSOT
- Primary rule: Tamagui is an internal implementation engine inside `@bthwani/ui-kit` only.

## 1. Final Decision

Tamagui is approved only as a private implementation engine for `packages/ui-kit`.

Tamagui is not a public application API.
Tamagui is not a screen-level dependency.
Tamagui is not a replacement for `@bthwani/ui-kit`.
Tamagui is not allowed to create a second design system.

All applications, surfaces, and app shells must consume UI through:

```ts
@bthwani/ui-kit
@bthwani/ui-kit/mobile
@bthwani/ui-kit/web
@bthwani/ui-kit/next
```

They must not import:

```ts
tamagui
@tamagui/*
```

## 2. Allowed Tamagui Ownership

Direct Tamagui imports are allowed only under:

```txt
packages/ui-kit/**
```

Approved internal locations include:

```txt
packages/ui-kit/src/providers.tsx
packages/ui-kit/src/tamagui-config.ts
packages/ui-kit/src/primitives.tsx
```

## 3. Exact-Path Build-Time Exception

`tamagui.build.ts` is the only documented root-level build-time exception.

It may contain the build-time Tamagui import needed for build configuration only.

It is not a runtime entrypoint.
It is not a screen/component implementation file.
It does not extend the UI authority surface beyond `packages/ui-kit`.

No other root file is granted a direct Tamagui import exception without a separate governance update.

## 4. Forbidden Usage

The following are forbidden outside `packages/ui-kit/**` and the documented exact-path build-time exception in `tamagui.build.ts`:

```txt
from 'tamagui'
from "tamagui"
from '@tamagui/*'
from "@tamagui/*"
TamaguiProvider
createTamagui
```

Forbidden temporary names:

```txt
Temporary Tamagui alias names are forbidden outside governed cleanup work.
```

Internal host names inside primitives must stay neutral:

```txt
HostView
HostText
HostScrollView
```

## 5. Provider Rule

`TamaguiProvider` must be owned by UI Kit only.

TamaguiProvider must be owned by UI Kit only.

Applications must not mount Tamagui providers directly.
Surfaces must not mount Tamagui providers directly.
Provider ownership must flow through UI Kit root/provider exports.

## 6. Token Rule

`foundation.ts` is the design-token source of truth.

foundation.ts is the design-token source of truth.

`tamagui-config.ts` is an adapter only.

tamagui-config.ts is an adapter only.

It must not become a parallel color system, spacing system, radius system, typography system, or shadow/elevation system.

Any Tamagui token bridge must derive from UI Kit foundation decisions or be explicitly marked as adapter-only.

## 7. Screen Development Rule

Screen development may now proceed.

However, screens must never import Tamagui directly.

Screen implementation must use UI Kit public exports and may request UI Kit additions only through a governed CHECK/APPLY cycle.

## 8. Migration Rule

Any future UI Kit Tamagui migration must proceed one file at a time:

```txt
CHECK first
APPLY second
tsc
guards
Metro reload
commit
```

Bulk migration is forbidden.

No Button/Card/Header/Form/List/Field conversion may happen without a dedicated CHECK script first.

## 9. Runtime Rule

The current closure unblocks TypeScript, UI Kit governance, and screen development.

Native runtime proof is deferred until the first suitable EAS/dev-client rebuild.

Do not run EAS only for Tamagui governance.
Do not claim New Architecture runtime proof on a device until the dev client has been rebuilt after the native config decision.

## 10. Protected Brand Rule

The following are protected and must not be renamed, partially deleted, or normalized away:

```txt
bthwani
BThwani
BTHWANI
@bthwani/*
bthwani-suite
com.bthwani
bthwaniDirectionBootstrap
```

## 11. Mandatory Gates

Before any Tamagui-related commit is accepted, these gates must pass:

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm --dir packages/ui-kit exec tsc -p tsconfig.json --noEmit
powershell -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\guards\GUARD_TAMAGUI_IMPORT_BOUNDARY.ps1"
powershell -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\guards\GUARD_TAMAGUI_GOVERNANCE_LAW.ps1"
powershell -ExecutionPolicy Bypass -File "C:\bthwani-suite\tools\guards\GUARD_BTHWANI_PROTECTED_TOKENS.ps1"
```

## 12. Final Operating Statement

Tamagui is locked as a private UI Kit engine.

All product screens must be built through the BThwani UI Kit public surface.

Any violation is a governance blocker.
## Runtime proof

Runtime proof is deferred until the first suitable EAS/dev-client rebuild. This governance lock does not require EAS now, does not authorize a native rebuild, and does not claim device-level New Architecture runtime proof until a compatible dev client has been rebuilt.

