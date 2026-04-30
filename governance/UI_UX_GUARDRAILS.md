---
generatedFrom: governance/UI_UX_GUARDRAILS.md
generatedAt: 2026-04-30T04:48:37.9666212+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# UI/UX Guardrails

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Visual identity

Required brand base:

```text
deepBlue: #0A2F5C
orange:   #FF500D
white:    #FFFFFF
```

Use supporting tints/shades only when centrally defined and justified.

Forbidden:

```text
random colors
screen-local palettes
inconsistent headers
duplicated button/card systems
visual drift between apps
noisy gradients or unowned decorations
```

## 2. UI system ownership

Reusable UI must come from `@bthwani/ui-kit`.

Forbidden outside ui-kit:

```text
local design system
local reusable Header/Button/Card primitives
direct Tamagui imports in screens/surfaces/apps
hardcoded design tokens as a parallel system
```

## 3. RTL law

Arabic/RTL screens must be directionally correct.

Required:

- text aligned right where natural
- icon + label clustered correctly
- chevron/action placed on the opposite side
- no accidental space-between separating icon from text
- no centered Arabic text inside list rows unless intentionally justified
- filters/tabs ordered correctly for RTL
- safe-area respected
- no clipping or overflow

## 4. Screen state law

Every visible screen or data section must consider:

```text
loading
empty
error
success
offline
disabled
retry when applicable
```

## 5. Visual evidence law

No UI change is accepted by code diff alone.

Required evidence:

```text
before screenshot when available
after screenshot
device/viewport
language/direction
state shown
overflow/clipping check
primary action visibility
no unrelated visual drift
```

If screenshots are missing:

```text
NEEDS_VISUAL_EVIDENCE
```

## 6. UX flow law

Every primary flow must have:

```text
start
role
steps
primary action
secondary action if needed
success state
failure state
empty state if applicable
loading state if applicable
offline state if applicable
end/exit
```

## 7. UI acceptance criteria

A UI change is acceptable only when:

```text
scope clean
visual identity respected
RTL correct
states covered or explicitly not affected
no clipping/overflow
no unrelated drift
diff clean
typecheck passes
screenshots reviewed
decision recorded
```

