# UI Kit, Brand, Tamagui, RTL

**Status:** Canonical Governance Payload v2
**Owner:** `Design System Governance`

## Design authority

`@bthwani/ui-kit` is the only central design authority. Screens, surfaces, and apps consume public exports only. Tamagui direct imports are allowed only inside `ui-kit` and the root build adapter `tamagui.build.ts` when present. `TamaguiProvider` ownership stays inside ui-kit.

## Brand DNA

| Token | Value | Use |
|---|---|---|
| deepBlue | `#0A2F5C` | trust, headers, primary structure |
| orange | `#FF500D` | primary actions, brand emphasis |
| white | `#FFFFFF` | clean surfaces, secondary headers |

The visual system must be premium, modern, clean, low-noise, practical, and cohesive. Random blues, grays, gradients, or one-off palettes are forbidden unless tokenized centrally.

## RTL contract

For Arabic UI:

- text aligns right unless intentionally centered for hero/headline,
- icon + label are in the same right-side cluster in list rows,
- chevron/action appears on the opposite side,
- do not use `space-between` in a way that separates icon from its label,
- no mixed Arabic/English ordering unless content requires it,
- horizontal filters must start from the correct RTL edge,
- ticker/carousel direction must be explicitly defined,
- safe-area and clipping must be tested.

## Header law

| Header | Use | Rule |
|---|---|---|
| Primary orange header | top-level/high identity surfaces | compact, brand-owned, not over-tall |
| Secondary white header | sub-pages/sub-screens | consistent across mobile apps |
| Control-panel topbar | web admin | dense, functional, not mobile-like |

Headers must be centralized through ui-kit/surface shell patterns, not rewritten per screen.

## Component ownership

Reusable components must live in ui-kit:

```text
Button
Card
Field
Header
List
Media
Modal/Sheet
State
Tabs/Segmented controls
Banner/Ticker
```

Service-specific composition can live in surfaces but must use ui-kit primitives.

## Appearance system contract

Every new screen, page, surface, or visible component is incomplete unless it supports both `lightPremium` and `darkGlass` from day one. The implementation must consume the official appearance/provider source, use `@bthwani/ui-kit` public exports only, avoid local palettes/tokens/theme layers, avoid hardcoded colors when an official role exists, stay RTL-correct, avoid dark text on dark backgrounds and white solid cards inside `darkGlass`, and follow the official rim-light policy. TypeScript and diff-check must pass before the surface can be accepted as done.

## Visual evidence gate

Any UI change must include:

- before screenshot when available,
- after screenshot,
- device/viewport,
- RTL/language note,
- clipping/overflow check,
- spacing/alignment check,
- primary CTA visibility,
- no unrelated visual drift,
- diff evidence.

## Forbidden UI patterns

- local design system inside app/surface,
- direct Tamagui import outside ui-kit,
- hardcoded random color,
- centered Arabic list text without reason,
- oversized headers without functional value,
- long explanatory blocks replacing smart UI,
- duplicated banners/cards per app.

## Closure checklist for this file

- [ ] Every rule above has exactly one owner file.
- [ ] Any derived script/guard points back to this file or its owner file.
- [ ] Evidence exists for any claim of compliance.
- [ ] No local app/surface/package silently overrides this file.
- [ ] Any exception is documented with owner, expiry, risk, and rollback.
