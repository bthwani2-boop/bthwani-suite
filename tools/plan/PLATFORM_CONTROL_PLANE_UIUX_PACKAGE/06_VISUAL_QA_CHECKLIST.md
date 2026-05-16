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
