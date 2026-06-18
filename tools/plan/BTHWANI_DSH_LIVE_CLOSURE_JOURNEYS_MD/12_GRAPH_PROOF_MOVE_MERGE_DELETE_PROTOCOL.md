---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: بروتوكول graph proof
---

# 12 — بروتوكول graph proof للنقل والدمج والحذف

## القاعدة

لا حذف ولا نقل ولا دمج بدون دليل. لا يكفي أن الملف يبدو غير مهم.

## دليل إلزامي قبل الحذف

يجب إثبات عدم وجود:

```text
static import
barrel export
dynamic import
route reference
navigation reference
screen registry reference
test/story usage
runtime consumer
API/client binding
OpenAPI generated consumer
textual route/name reference
```

## أوامر محلية مقترحة

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$Target = "relative/path/to/file.ts"
$BaseName = [System.IO.Path]::GetFileNameWithoutExtension($Target)

Select-String -Path "**\*.ts","**\*.tsx","**\*.js","**\*.jsx","**\*.md" -Pattern $BaseName -ErrorAction SilentlyContinue
Select-String -Path "**\*.ts","**\*.tsx" -Pattern $Target.Replace('\','/'),$Target.Replace('/','\') -ErrorAction SilentlyContinue

git --no-pager grep -n $BaseName -- .
```

إذا Graphify متاح محليًا:

```powershell
# استخدم مخرجات C:\bthwani-suite\graphify-out لإثبات العلاقات قبل الحذف/النقل.
```

## النقل الصحيح

```text
1. أنشئ/حدّث الملف الكانوني في shared أو WLT shared أو UI Kit.
2. انقل المنطق الحقيقي لا imports فقط.
3. حدّث المستهلكين إلى المصدر الكانوني.
4. شغّل tsc/build/guards.
5. احذف الملف القديم فقط بعد proof.
6. لا تترك proxy/redirect file إلا إذا كان مطلوبًا مؤقتًا بتصنيف واضح ومدة قصيرة.
```

## الدمج الصحيح

```text
1. حدد canonical owner.
2. قارن APIs/exports.
3. انقل المستهلكين.
4. احذف duplicate بعد graph proof.
5. ضع منع regression في guard أو search check عند الحاجة.
```
