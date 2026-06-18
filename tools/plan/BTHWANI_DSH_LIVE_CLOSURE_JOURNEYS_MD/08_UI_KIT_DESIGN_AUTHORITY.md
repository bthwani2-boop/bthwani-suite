---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: سلطة UI Kit
---

# 08 — سلطة UI Kit ومنع design drift

## القاعدة

`@bthwani/ui-kit` هو مصدر التصميم المركزي. لا يوجد design system محلي داخل أي app root أو control-panel root.

## ينقل إلى UI Kit إذا كان

```text
reusable UI عام
design primitive
component متكرر بين أكثر من surface
button/card/badge/header/empty-state/error-state/loading-state/modal/sheet/metric-card
```

## يبقى داخل surface إذا كان

```text
layout خاص بصفحة واحدة
copy خاص بالسطح
visual-only wrapper لا يعاد استخدامه
screen composition محدد
```

## ممنوع

```text
Tamagui direct imports داخل apps/control-panel إذا كانت الحدود تمنعه
hardcoded visual drift
local design tokens
duplicated reusable visual primitives
```

## بوابة التصميم

```powershell
pnpm run guard:ui-kit-central-design-ownership
pnpm run guard:tamagui-import-boundary
```

## هوية بثواني

```text
RTL-first
low noise
clean surfaces
consistent spacing
tones/colors من UI Kit
no visual drift
```
