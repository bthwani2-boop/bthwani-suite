# UI Kit, Tamagui, Brand, RTL

## Authority

`@bthwani/ui-kit` is the single design authority.

## Tamagui rule

Tamagui may be used internally inside `@bthwani/ui-kit` only. Screens, surfaces, and apps must consume public UI-kit exports.

## Brand tokens

| Token | Value |
|---|---|
| deepBlue | `#0A2F5C` |
| orange | `#FF500D` |
| white | `#FFFFFF` |

Support colors such as success/warning/error are allowed only through central tokens.

## Premium UX law

BThwani UI must be:

- premium 2026
- RTL-correct
- low-noise
- cohesive
- practical
- elegant
- fast to understand
- easy to operate

## RTL contract

Arabic/RTL UI must enforce:

- text aligned right unless intentionally centered for banners/heroes
- icon + text clustered on the right side for list rows
- chevron/action placed on the opposite side
- no misuse of `space-between` that separates icon from text
- no clipped tabs or filters
- no mixed Arabic/English labels without reason
- safe-area respected
- overflow/clipping checked
- row hierarchy readable at mobile width

## Header law

- Orange primary header: top-level/high-level screens.
- White secondary header: sub-pages/sub-screens.
- Header variants must be centralized in UI-kit.
- Apps/surfaces must not invent parallel header models.

## Component state law

Reusable components must support:

- loading
- empty
- error
- success
- disabled
- selected/active
- focus/press/hover where platform supports it
- offline when relevant

## Visual evidence

UI changes require screenshots or visual proof. Without visual evidence, final decision must be `NEEDS_VISUAL_EVIDENCE`.
