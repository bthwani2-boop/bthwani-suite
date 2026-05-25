# 03 — Slice Coverage Manifest Protocol

## الهدف

منع نسيان أي سطح، شاشة، route، CTA، state، عملية، صلاحية، WLT boundary، أو control-panel entry.

## القاعدة

```text
لا تبدأ شريحة قبل Slice Coverage Manifest.
لا تغلق شريحة إذا بقي أي عنصر TBD بلا سبب.
```

## تعريف الشريحة

الشريحة ليست شاشة فقط. الشريحة هي:

```text
Actor + Goal + Surface group + Operation + Evidence
```

مثال:

```text
Client wants to see available stores.
```

قد تشمل:
- app-client Home/Search/Store
- partner publishing visibility
- control-panel catalog/marketing visibility
- DSH serviceability policy
- no WLT mutation

## الحقول الإلزامية

```text
Slice ID
Service
Business Domain
Actor
Surface
Route
Screen Owner
Primary Action
Secondary Actions
CTA List
Navigation Target
Required States
Control Panel Entry
Auth/Permission
WLT Boundary
Vars/Provider Dependency
Search Dependency
Notification Dependency
Account/Profile Dependency
API Candidate
Binding Status
Runtime Status
Visual Evidence
Git Evidence
Typecheck Evidence
Regression Evidence
Decision
```

## قيم الحالة المسموحة

```text
PASS
FIX_REQUIRED
BLOCKED_WITH_REASON
NOT_APPLICABLE_WITH_REASON
DEFERRED_WITH_REASON
TBD_NOT_ALLOWED_AT_CLOSURE
```

## No-Orphan Rules

```text
لا شاشة بدون flow.
لا flow بدون actor.
لا actor بدون permission.
لا CTA بدون navigation target.
لا route بدون owner.
لا state بدون visual proof.
لا API بدون screen/flow need.
لا binding بدون contract.
لا runtime بدون logs/request evidence.
لا finance بدون WLT.
لا operation مهمة بدون control-panel/audit عند الحاجة.
```

## طريقة الجرد

1. اقرأ service blueprint.
2. اقرأ screen registries.
3. اقرأ flow registry.
4. اقرأ navigation/routes.
5. اقرأ control-panel registries.
6. اقرأ OpenAPI.
7. اقرأ adapters/api-client candidates.
8. افحص ui-kit imports.
9. افحص WLT/Auth references.
10. اربط كل ذلك في manifest واحد.

## Cross-Surface Journey Requirement

كل شريحة DSH هي رحلة تجارية/تشغيلية رأسية متعددة الأسطح — وليست شاشة منفردة، ولا صفًا في matrix، ولا سطحًا منفصلًا.

**قبل البدء في أي شريحة يجب:**

1. تعداد كل الأسطح المرتبطة بالرحلة التجارية من البداية إلى النهاية.
2. تصنيف كل سطح: `primary` / `supporting` / `dependency` / `excluded` / `blocked` / `deferred`.
3. توثيق السبب لكل سطح خارج النطاق أو مؤجل.
4. ملء حقول Cross-Surface Journey Model في `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md`.

**قاعدة اكتشاف النواقص (إلزامية):**

إذا ظهر أثناء إغلاق أي شريحة نقص في شاشة أو عملية أو CTA أو state أو guard أو data owner أو API/runtime boundary أو auth boundary أو WLT boundary أو control-panel owner، يجب توثيقه فورًا كـ:

```text
REQUIRED_ADDITION   — يجب حله قبل إغلاق الشريحة
BLOCKED_WITH_REASON — لا يمكن حله الآن؛ السبب موثق بدقة
```

الإغلاق الصامت لأي نقص محظور تمامًا.

**قاعدة الانتقال للأمام:**

لا يتم الانتقال للشريحة التالية إلا بعد:
- حل كل `REQUIRED_ADDITION` بدليل، أو
- تصنيف كل عنصر غير محلول كـ `BLOCKED_WITH_REASON` مع سبب محدد وموثق.

لا يجوز بقاء أي عنصر كـ TBD عند الانتقال.

## مخرجات هذا البروتوكول

استخدم:
- `templates/SLICE_COVERAGE_MANIFEST_TEMPLATE.csv`
- `evidence/MARKDOWN_TABLE_ROW_INVENTORY.csv`
- `evidence/FORENSIC_FILE_INVENTORY.csv`
- `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md` — Initial Editable Cross-Surface Slice Matrix
