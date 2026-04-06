# UI Kit Requirement Matrix

## Foundation Requirements

- semantic color roles must cover surface levels, field states, overlays, focus, disabled states, and status tones
- typography must expose durable display, title, body, label, caption, and code roles with stable weight and tracking
- direction must own RTL/LTR resolution, language mapping, logical start/end spacing, text alignment, and row-direction behavior
- shared state ownership must exist under a first-class `states/` domain, not as incidental component props only

## Generic Shared Building Blocks

- primitives must absorb spacing, border, surface, elevation, and direction behavior centrally
- foundational components justified by donor evidence: button, text field, search field, chip, badge, card, list item, headers, state view, and sheet frame
- these blocks may exist now only if they remain service-clean and do not smuggle business logic into the package

## Naming And Continuity

- preserve normalized platform naming: `control-panel`, `app-client`
- preserve simple `Bth*` public naming for current package artifacts
- reject old internal names as target-repo-facing API names

## Explicit Rejections

- no service-owned semantic branches inside shared theme contracts
- no preview gallery or runtime-specific shell as UI-kit authority
- no local per-screen direction/theme/typography systems
- no pilot screens or app-surface validation routes during Phase 06

## Current Blocking Weaknesses Addressed

- weak semantic theme contract
- thin typography roles
- minimal direction helpers
- missing centralized state catalog
- missing workspace alias for `@bthwani/ui-kit`

## Remaining Deferred Items

- screen-family shells under `patterns/` require later Phase 15 validation
- pilot web/mobile validation surfaces remain blocked by the active phase boundary