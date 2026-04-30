---
generatedFrom: governance/07_UI_KIT_AUTHORITY_CONTRACT.md
generatedAt: 2026-04-30T04:48:37.1702903+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# UI Kit Authority Contract

Status: CANONICAL_CONTRACT
Owner: BThwani Governance
Scope: reusable design authority, Tamagui boundary, brand, RTL, and shared direction ownership

## Purpose

`packages/ui-kit` is the single reusable design authority for BThwani.

## Authority

ui-kit owns:

- design tokens
- typography
- spacing
- radius
- elevation
- color roles
- RTL/LTR primitives
- reusable components
- reusable interaction patterns
- base providers when design-related
- component families such as Button, Card, Form, List, Modal, Header, Media, State

## Tamagui Rule

```text
Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only
```

Tamagui primitives, tokens, and variants should be used inside ui-kit. Surfaces and apps should benefit from them through public ui-kit exports.

### Exact-Path Exception

`tamagui.build.ts` is the only approved root-level Tamagui import exception and it is build-time only.

No app, surface, app-shell, or other root file may import `tamagui` or `@tamagui/*` directly without a new governance decision.

## Forbidden in ui-kit

- service-specific content
- DSH/AMN/ARB/KNZ/WLT/ESF/MRF/SND/KWD domain UI bodies
- order/store/product/captain/wallet business flows
- API calls
- app routing
- surface orchestration
- hardcoded product data

## Brand Identity

Core BThwani identity:

- deepBlue `#0A2F5C`
- orange `#FF500D`
- white `#FFFFFF`

Use close tints/shades only through controlled tokens. Avoid random colors and visual drift.

## RTL Contract

Arabic/RTL UI must be directionally correct:

- icon + text clustered on the right when semantically grouped
- text aligned right
- chevron/action on the opposite side when appropriate
- no accidental center alignment in rows
- no `space-between` misuse that separates related icon/text clusters
- safe-area and spacing must be verified visually

## Direction Ownership

Shared direction and i18n foundation logic must be owned centrally and reused through governed shared foundations.

Local consumers may consume direction and i18n utilities, but they must not fork parallel direction systems or duplicate global RTL logic.

## Public Export Rule

Consumers should import from `@bthwani/ui-kit` public exports, not deep internals, unless a temporary migration bridge explicitly allows it.

## Verification
Any local design tokens or reusable component families outside ui-kit are governance violations unless explicitly approved as temporary migration code.

## Provenance

This file now absorbs the live authority previously scattered across `TAMAGUI_INTEGRATION_LAW.md`, `DIRECTION_I18N_OWNERSHIP.md`, and `UI_UX_GUARDRAILS.md`.

This file is the ui-kit and Tamagui authority.

