# UI Kit Authority Contract

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

## Public Export Rule

Consumers should import from `@bthwani/ui-kit` public exports, not deep internals, unless a temporary migration bridge explicitly allows it.

## Verification

Any local design tokens or reusable component families outside ui-kit are governance violations unless explicitly approved as temporary migration code.
