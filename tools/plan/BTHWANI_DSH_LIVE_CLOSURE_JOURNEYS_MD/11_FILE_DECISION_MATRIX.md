---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: مصفوفة القرار
---

# 11 — مصفوفة قرار كل ملف

كل ملف داخل الجذور أو shared أو WLT يجب أن يحصل على قرار واحد فقط عند لمسه.

## القرارات المسموحة

```text
KEEP_UI_SCREEN
KEEP_UI_PART
KEEP_SURFACE_SHELL
KEEP_ROUTE_RENDERER
KEEP_TYPE_ONLY_CONTRACT
KEEP_VISUAL_HOOK
SPLIT_OVERSIZED_SCREEN
MOVE_TO_DSH_SHARED_TOPIC
MOVE_TO_WLT_SHARED_TOPIC
MOVE_TO_UI_KIT
MERGE_DUPLICATE
DELETE_AFTER_GRAPH_PROOF
RENAME_ONLY_IF_REQUIRED
BLOCKED_NEEDS_EVIDENCE
```

## قرارات ممنوعة

```text
clean
improve
refactor later
organize
fix later
keep for now
maybe unused
```

## معايير القرار

| السؤال | القرار |
|---|---|
| الملف شاشة UI؟ | `KEEP_UI_SCREEN` |
| جزء UI خاص بسطح واحد؟ | `KEEP_UI_PART` |
| shell أو host؟ | `KEEP_SURFACE_SHELL` |
| route renderer؟ | `KEEP_ROUTE_RENDERER` |
| type-only فقط؟ | `KEEP_TYPE_ONLY_CONTRACT` |
| hook visual-only؟ | `KEEP_VISUAL_HOOK` |
| شاشة ضخمة تحتوي UI ومنطق؟ | `SPLIT_OVERSIZED_SCREEN` ثم نقل المنطق |
| منطق DSH؟ | `MOVE_TO_DSH_SHARED_TOPIC` |
| منطق مالي؟ | `MOVE_TO_WLT_SHARED_TOPIC` |
| UI reusable؟ | `MOVE_TO_UI_KIT` |
| duplicate؟ | `MERGE_DUPLICATE` |
| غير مستخدم بدليل؟ | `DELETE_AFTER_GRAPH_PROOF` |
| rename ضروري فقط؟ | `RENAME_ONLY_IF_REQUIRED` |
| لا يوجد دليل كافٍ؟ | `BLOCKED_NEEDS_EVIDENCE` |

## قالب سجل قرار

```markdown
| path | decision | reason | proof | follow-up |
|---|---|---|---|---|
| dsh/frontend/app-client/... | MOVE_TO_DSH_SHARED_TOPIC | contains marketing policy reused by control-panel | search/import proof | update imports then delete old file |
```
