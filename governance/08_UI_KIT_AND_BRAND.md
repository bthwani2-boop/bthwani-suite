# UI Kit, Brand, Tamagui, RTL

**Status:** Canonical Governance Payload v2
**Owner:** `Design System Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 07_UI_KIT_AUTHORITY_CONTRACT, UI_UX_GUARDRAILS, DIRECTION_I18N_OWNERSHIP

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Design authority

`@bthwani/ui-kit` is the only central design authority. Screens, surfaces, and apps consume public exports only. Tamagui may be used internally inside ui-kit, not directly in apps/surfaces.

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
- [ ] Any derived script/guard points back to this file and not to legacy.
- [ ] Evidence exists for any claim of compliance.
- [ ] No local app/surface/package silently overrides this file.
- [ ] Any exception is documented with owner, expiry, risk, and rollback.
