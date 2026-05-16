# 06 — Visual QA Checklist

Open:

```text
http://localhost:3000/platform
```

## Global screen checks

- [ ] Sidebar appears on correct RTL side.
- [ ] Platform item is highlighted.
- [ ] The page title communicates "قسم التحكم السيادي بالمنصة".
- [ ] Top section is an executive control dashboard, not a technical record list.
- [ ] No obvious horizontal overflow.
- [ ] No clipped content.
- [ ] Scroll is reasonable and not frozen.
- [ ] Main actions are visible but disabled.
- [ ] Arabic text is right-aligned.
- [ ] Icon + text clusters are visually coherent.
- [ ] No excessive centered Arabic inside row cards.
- [ ] The page is understandable by a non-developer administrator.

## Overview

- [ ] Shows active services.
- [ ] Shows hidden services.
- [ ] Shows providers needing setup/test.
- [ ] Shows sensitive warnings.
- [ ] Shows recent rollback/change preview.

## Services

- [ ] Services are named in human language.
- [ ] Service visibility is clear.
- [ ] Service mode is clear.
- [ ] Scope is clear.
- [ ] Impact is clear.
- [ ] Actions are disabled.

## Vars

- [ ] User selects service first.
- [ ] User sees human labels before internal keys.
- [ ] Internal keys are secondary/caption only.
- [ ] Before/after is clear.
- [ ] Impact simulation is clear.
- [ ] No financial ownership confusion: WLT owns money.

## Providers

- [ ] Provider categories are human-readable.
- [ ] API key is masked only.
- [ ] No real secret-like text.
- [ ] Environment is clear.
- [ ] Default/fallback are clear.
- [ ] Test/activate/rollback are disabled.
- [ ] Text says provider keys are not stored in code.

## Appearance

- [ ] This is platform identity, not marketing.
- [ ] App coverage is visible.
- [ ] Header/main/secondary controls are understandable.
- [ ] Preview/approval/rollback flow is clear.
- [ ] No campaign/seasonal/offer language.
- [ ] No hardcoded random color UI.

## Visual decision

Use:

```text
VISUAL_PASS
VISUAL_FIX_REQUIRED
VISUAL_BLOCKED
```

Never claim visual closure without screenshots.

## Adjacent Section Visual Checks

- [ ] Is Platform clearly sovereign and separate from Catalogs/Marketing/Administration?
- [ ] Is Catalogs visually absent from Platform tabs and controls?
- [ ] Is Marketing visually absent from Platform tabs and controls?
- [ ] Is Administration visually absent from Platform tabs and controls?
- [ ] Does any Platform card imply it manages categories, products, or listings? If yes: FIX_REQUIRED
- [ ] Does any Platform card imply it manages campaigns or offers? If yes: FIX_REQUIRED
- [ ] Does any Platform card imply it manages users or roles? If yes: FIX_REQUIRED
- [ ] Does any Marketing element imply it controls platform-wide color identity? If yes: FIX_REQUIRED
- [ ] Are handoff indicators (if present in Overview) clearly informational and non-actionable?

## UI Mock Design Visual QA

- [ ] Does the page open with a sovereign dashboard, not a list of raw technical records?
- [ ] Is the Overview a clear control room entry point?
- [ ] Are there three handoff cards (Catalogs / Marketing / Administration) in Overview?
- [ ] Are the handoff cards informational only (no forms, no navigation, no mutations)?
- [ ] Is the Services workspace visible with human-labeled mock records?
- [ ] Does each Service card show status, scope, visibility, and disabled action buttons?
- [ ] Is the Providers workspace visible with masked credentials?
- [ ] Does each Provider card show environment, priority, fallback, and disabled action buttons?
- [ ] Is the Vars workspace showing human Arabic labels (not raw VAR_ keys) as headings?
- [ ] Does each Var record show current value, proposed value, scope, and effect?
- [ ] Is the Appearance workspace scoped to platform identity only?
- [ ] Does Appearance show token-mapped color records (not campaign colors)?
- [ ] Are Rollouts, Health, Audit & Rollback visible as teasers with disabled controls?
- [ ] Are ALL apply/activate/save/rollback buttons disabled?
- [ ] Is the layout 100% RTL correct (labels right-aligned, icon+text cluster on the right)?
- [ ] Is there no horizontal overflow or content clipping at any viewport?
- [ ] Is there no raw API key, provider ID, or TypeScript entity name as a primary heading?
- [ ] Is there no campaign/offer/banner language inside Appearance?
- [ ] Is there no category/product management form inside Platform?
- [ ] Is there no user/role management form inside Platform?
- [ ] Does the overall design feel like a premium 2026 sovereign control room?
