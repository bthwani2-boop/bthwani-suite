# Shared Folder Governance

## Purpose

Shared folders reduce duplication only when they have clear ownership. They must not become dumping grounds.

## Allowed Shared Code

Shared code is allowed when:

- it has multiple real consumers, or a documented planned platform role
- it has a stable owner
- it does not duplicate ui-kit
- it does not hide service-owned logic
- it has a clear export path
- it has consumer proof

## Forbidden Shared Code

Shared folders must not contain:

- random service-specific bodies
- one-off screen blocks used by one screen only
- local design-system primitives
- copied legacy UI
- unclear duplicated helpers
- code that exists only because the correct owner was unknown

## Ownership Decision

| Type | Correct Owner |
|---|---|
| reusable visual primitive | `packages/ui-kit` |
| shell-level shared behavior | `packages/app-shells/shared` |
| surface-level shared experience | `packages/surfaces/src/surface-owned/{surface}` |
| service-specific shared part | `packages/surfaces/src/service-owned/{service}/{surface}` or service-local shared folder |
| backend shared logic | `services` or package designed for backend contracts when present |

## Consumer Proof

Before moving code to shared, document or prove:

- consumer paths
- import path
- owner
- reason it is shared
- why it is not ui-kit/app-shell/surface-owned/service-owned

## Deletion Rule

Do not delete shared files before zero-reference proof and semantic owner replacement exist.
