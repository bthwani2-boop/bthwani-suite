# Shared and Structure Boundary Contract

## Status

Canonical governance contract.

## Purpose

This contract defines the exact structural boundaries for BThwani apps, app-shells, surfaces, public exports, service-owned folders, surface-owned folders, and every shared folder.

This contract is not only a prevention policy. It is also a placement, correction, remediation, and decision system.

The goal is to keep platform growth safe, clear, measurable, and repairable.

## Core Principle

Every file must have one clear owner.

If a developer cannot answer these questions immediately, the file is not correctly placed:

```text
What owns this file?
Who consumes it?
Is it shell, surface, service, ui-kit, API, runtime, or evidence?
Is it reusable or only local?
Is it product experience or infrastructure?
Why is it shared?
What guard proves it is allowed?
```

## Canonical Layers

```text
apps
  -> host / shell entry only

packages/app-shells
  -> root shell, navigation, providers, platform shell composition only

packages/surfaces
  -> screens, flows, product experiences, surface orchestration

packages/surfaces/src/public
  -> public export gateways only

packages/surfaces/src/service-owned
  -> service-specific experiences inside a surface

packages/surfaces/src/surface-owned
  -> surface-level experiences not owned by one service

packages/ui-kit
  -> reusable design system authority

tools/guards
  -> executable governance checks

tools/registry/runs
  -> evidence output only
```

## Non-Negotiable Architecture Rule

```text
Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only
```

Apps and app-shells must consume public package exports. They must not reach into implementation internals.

## Apps Boundary

### Allowed in apps

```text
App.tsx
entry files
platform boot
Expo / Next boot wiring
route host
provider host
environment bridge
minimal shell composition
```

### Forbidden in apps

```text
product screens
service screens
order cards
store cards
wallet cards
captain task boards
service modals
product StyleSheet UI
business/domain logic
fixtures treated as product logic
deep imports into packages/*/src
relative imports into package internals
local design-system tokens
```

### Correction Rule

If an app file contains product UI or service logic:

```text
If it is a service experience -> move later to packages/surfaces/src/service-owned/{service}/{surface}
If it is a surface-global experience -> move later to packages/surfaces/src/surface-owned/{surface}
If it is reusable visual UI -> move later to packages/ui-kit
If it is shell wiring -> keep in apps/app-shells
```

No movement happens without consumer proof and a scoped repair phase.

## app-shells Boundary

### Allowed in packages/app-shells

```text
shell frame
root navigation shell
provider composition
safe area shell
platform shell utilities
surface host composition
web/mobile app-shell public entries
```

### Forbidden in packages/app-shells

```text
service-owned screen bodies
product dashboards
order/store/wallet/captain cards
DSH/WLT/AMN/etc business logic
reusable design system primitives
API/runtime implementation
deep imports into surfaces/src/service-owned
deep imports into surfaces/src/surface-owned
```

### Required Import Model

```text
app-shells -> @bthwani/surfaces public subpaths
app-shells -> @bthwani/ui-kit public exports
```

Allowed examples:

```text
@bthwani/surfaces/app-client
@bthwani/surfaces/app-partner
@bthwani/surfaces/app-captain
@bthwani/surfaces/app-field
@bthwani/surfaces/control-panel
@bthwani/surfaces/webapp
@bthwani/surfaces/website
```

Forbidden examples:

```text
../../../surfaces/src/service-owned/...
../../../surfaces/src/surface-owned/...
packages/surfaces/src/...
```

## app-shells/mobile Boundary

### Allowed

```text
mobile shell host
mobile provider composition
mobile navigation shell
mobile safe-area shell
mobile surface host bridge
```

### Folder Meaning

```text
mobile/client   -> client app shell only
mobile/partner  -> partner app shell only
mobile/captain  -> captain app shell only
mobile/field    -> field app shell only
mobile/shared   -> mobile-shell shared infrastructure only
```

### mobile/shared Allowed

`packages/app-shells/mobile/shared` is allowed only for mobile shell infrastructure shared by multiple mobile app shells.

Allowed examples:

```text
MobileRootShell
MobileSafeAreaFrame
MobileNavigationBridge
MobileAccountShellFrame
MobileShellProviderBridge
```

Forbidden examples:

```text
OrderCard
StoreAccountSheet
CaptainTaskCard
WalletSummaryCard
DshOrderBoard
ProductMediaCard
MarketingGrowthCard
```

If a file in `mobile/shared` is used by only one app shell, it must be local to that app shell unless there is a documented planned second consumer.

## app-shells/shared Boundary

`packages/app-shells/shared` is stricter than `mobile/shared`.

It is allowed only for shell infrastructure shared across platform shells or across web/mobile shell boundaries.

Allowed examples:

```text
shell provider contracts
platform-neutral shell state
root shell utilities
environment shell bridge
```

Forbidden examples:

```text
mobile-only utilities
web-only utilities
service cards
service sheets
account product pages
wallet/product dashboards
```

If it is only mobile, place it under `mobile/shared`.
If it is only web, place it under `web/shared`.
If it is product experience, place it under surfaces.

## app-shells/web Boundary

Allowed:

```text
web shell
control-panel shell
website shell
webapp shell
Next.js host integration
surface host bridge
web provider shell
```

Forbidden:

```text
control-panel product pages
DSH dashboards
WLT finance pages
service body screens
direct import from surfaces/src/service-owned
direct import from surfaces/src/surface-owned
```

## surfaces Boundary

`packages/surfaces` owns screens, flows, and user-facing product experiences.

It must not own reusable design-system primitives, app boot, backend implementation, or shell root behavior.

## surfaces/src/public Boundary

### Purpose

`packages/surfaces/src/public` is the public export gateway.

### Allowed

```text
export statements
named namespace exports
surface public exports
safe explicit re-exports
```

### Forbidden

```text
React components
functions
classes
const runtime logic
StyleSheet
data
fixtures
API calls
business logic
screen bodies
```

### Correction Rule

If public contains logic, move that logic to:

```text
service-owned/{service}/{surface}
surface-owned/{surface}
ui-kit
```

Then public must re-export only the approved public contract.

## surfaces/src/service-owned Boundary

### Purpose

Service-owned code is where a specific service owns a screen, flow, or product experience inside a surface.

Canonical structure:

```text
packages/surfaces/src/service-owned/{service}/{surface}/...
```

Examples:

```text
service-owned/dsh/app-client
service-owned/dsh/app-partner
service-owned/dsh/app-captain
service-owned/dsh/app-field
service-owned/dsh/control-panel
service-owned/wlt/control-panel
```

Allowed:

```text
service screens
service flows
service-specific view models
service states
service-specific cards
service-specific modals
service-specific local composition
```

Forbidden:

```text
ui-kit primitives
global design tokens
app boot
app shell navigation root
backend implementation
another service's implementation
surface-global account/search/notifications unless service-specific
```

### Cross-Service Rule

A service-owned folder must not directly import another service-owned implementation.

If a service needs cross-service data or UI:

```text
Use a public contract
Use a shared API/client contract
Use surface-level composition
Use a later integration protocol
```

Do not shortcut by importing another service folder.

## surfaces/src/surface-owned Boundary

### Purpose

Surface-owned code belongs to a surface as a whole and is not owned by one service.

Examples:

```text
app-client/account
app-client/search
app-client/notifications
app-client/support
control-panel/global-shell
control-panel/global-search
```

Allowed:

```text
surface-global screens
surface-global account/search/notifications/support
cross-service shell experience inside a surface
surface-level navigation composition
```

Forbidden:

```text
DSH-only order experience
WLT-only wallet flow
store/order/captain service logic
service-specific dashboards
local design systems
```

### Correction Rule

If a surface-owned file contains service-specific content:

```text
If DSH-specific -> move later to service-owned/dsh/{surface}
If WLT-specific -> move later to service-owned/wlt/{surface}
If reusable design -> move later to ui-kit
If shell-only -> move later to app-shells
```

## Shared Folder Law

`shared` is forbidden by default until justified.

A shared folder or shared file is allowed only when all conditions are true:

```text
1. It has at least two real consumers, or a documented planned second consumer.
2. The consumers belong to the same architectural layer or same responsibility type.
3. It has a clear owner.
4. It has an explicit export path.
5. It does not duplicate ui-kit.
6. It does not hide service-owned logic.
7. It does not hide product screen fragments.
8. It does not contain API/runtime/backend implementation unless that is its explicit layer.
9. It has no better, more specific owner.
10. It has evidence.
```

## Shared Classification

Every shared folder must be classified as one of:

```text
SHELL_SHARED
MOBILE_SHELL_SHARED
WEB_SHELL_SHARED
SURFACE_SHARED
SERVICE_SHARED
UI_KIT_CANDIDATE
API_CONTRACT_SHARED
RUNTIME_SHARED
ORPHAN_CANDIDATE
DUPLICATE_CANDIDATE
INVALID_SHARED
NEEDS_OWNER_DECISION
```

## Shared Placement Matrix

| Content Type | Correct Owner |
|---|---|
| reusable Button/Card/Form/List/Header/State/Modal/Media | `packages/ui-kit` |
| mobile root shell utility | `packages/app-shells/mobile/shared` |
| web shell utility | `packages/app-shells/web/shared` |
| web+mobile shell utility | `packages/app-shells/shared` |
| surface-global account/search/notifications | `packages/surfaces/src/surface-owned/{surface}` |
| service-specific DSH/WLT/AMN/etc flow | `packages/surfaces/src/service-owned/{service}/{surface}` |
| service-specific helper used within one service | service-local shared folder |
| API type | `packages/api-types` when present |
| API client | `packages/api-clients` when present |
| backend runtime | `services` when present |
| evidence output | `tools/registry/runs/{SESSION_ID}` |

## Single-Consumer Shared Rule

A shared file with one consumer is invalid unless it has a documented planned second consumer.

Default correction:

```text
Move it closer to its only consumer.
```

No move is allowed before proof.

## Product Block Rule

A component inside a screen is not automatically a reusable component.

If it is:

```text
order card
store card
wallet summary
captain task item
checkout block
partner approval card
marketing video card
```

then it is usually service-owned or surface-owned, not ui-kit and not app-shell shared.

## UI Kit Candidate Rule

A file becomes a ui-kit candidate only if it is:

```text
visual reusable
domain-neutral
service-neutral
surface-neutral
token-compatible
RTL-aware
brand-system aligned
```

It must not mention DSH/WLT/order/store/captain/wallet/service-specific terms except in docs/examples.

## Correction Decision Tree

When a file is suspicious, classify it with this order:

```text
1. Is it app boot or host? -> apps
2. Is it shell/root/navigation/provider behavior? -> app-shells
3. Is it reusable visual design? -> ui-kit
4. Is it a service-specific screen/flow? -> service-owned/{service}/{surface}
5. Is it surface-global and not service-specific? -> surface-owned/{surface}
6. Is it API contract/type/client/runtime? -> api/contracts/runtime layer
7. Is it evidence? -> tools/registry/runs
8. If none apply -> NEEDS_OWNER_DECISION
```

## Remediation Statuses

Every structural issue must use one of these:

```text
KEEP_AS_IS
KEEP_WITH_JUSTIFICATION
MOVE_LATER_TO_APP_SHELLS
MOVE_LATER_TO_SURFACES_SERVICE_OWNED
MOVE_LATER_TO_SURFACES_SURFACE_OWNED
MOVE_LATER_TO_UI_KIT
MOVE_LATER_TO_API_LAYER
MERGE_DUPLICATE_LATER
DELETE_AFTER_ZERO_REFERENCE_PROOF
ARCHIVE_REFERENCE
CONFIG_ALLOWLIST
FALSE_POSITIVE
NEEDS_OWNER_DECISION
BLOCKED
```

## No Deletion Rule

Do not delete any folder or file because a guard flags it.

Deletion requires:

```text
zero-reference proof
consumer proof
owner decision
rollback path
evidence pack
diff-check PASS
tsc PASS
```

## Guard Requirements

The next guard must check:

```text
shared folders
single-consumer shared candidates
domain terms inside app-shells/shared
product UI in apps
deep imports into surfaces internals
logic inside surfaces/public
service terms inside surface-owned
surface-global terms inside service-owned
ui-kit candidate drift
```

## Evidence Requirements

Every structure or shared cleanup phase must produce:

```text
SUMMARY.md
status.txt
evidence.json
commands.log
git-status-before.txt
git-status-after.txt
git-diff-check-before.txt
git-diff-check-after.txt
tsc-noemit-before.txt
tsc-noemit-after.txt
guard output
_HANDOFF.zip
```

## Current Rule

This contract creates the law. It does not move, delete, rename, or refactor files.

The next step is:

```text
GUARD-02 — Shared Folder Ownership Guard
```
