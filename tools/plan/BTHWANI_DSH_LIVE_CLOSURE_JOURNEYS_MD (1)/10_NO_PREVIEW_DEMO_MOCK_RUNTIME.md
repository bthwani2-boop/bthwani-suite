---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: منع preview/demo/mock runtime
---

# 10 — منع preview/demo/mock runtime

## القاعدة

أي ذكر أو ملف أو fallback runtime باسم:

```text
preview
demo
mock
sample
fixture
fake
fallback
stub
```

يحتاج تصنيفًا. لا يحذف تلقائيًا، ولا يبقى تلقائيًا.

## التصنيف

| الحالة | القرار |
|---|---|
| مستخدم في runtime الطبيعي | يجب استبداله بـ live API/shared runtime |
| مستخدم في test فقط | يعزل داخل test path واضح |
| مستخدم في seed/dev fixture | يبقى خلف flag واضح ولا يستورد من runtime surface |
| غير مستخدم | `DELETE_AFTER_GRAPH_PROOF` |
| اسم مضلل لكن المحتوى حي | `RENAME_ONLY_IF_REQUIRED` مع تحديث imports |

## فحص سريع

```powershell
Select-String -Path "dsh\frontend\**\*.ts","dsh\frontend\**\*.tsx","wlt\frontend\dsh\**\*.ts","wlt\frontend\dsh\**\*.tsx" `
  -Pattern "preview|demo|mock|sample|fixture|fake|fallback|stub" `
  -CaseSensitive:$false
```

## قاعدة عدم الضجيج

لا تنشئ ملفات `*.legacy.ts`, `*.old.ts`, `*.proxy.ts` فقط لتجنب حذف حقيقي. إن كان الملف لم يعد له دور، أثبت graph proof واحذفه.
