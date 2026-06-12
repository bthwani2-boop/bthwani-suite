# BThwani DSH/WLT Journeys — Master Index & Manifest
# الفهرس الشامل والمخطط العام للشرائح والرحلات

> **مسار الملف الحاكم (Canonical Path):** `dsh/docs/JOURNIES/JOURNIES_MASTER_INDEX_AND_MANIFEST.md`
> **حالة الملف:** نشط (ACTIVE) - يحتوي على الفهرس والخرائط والهوية والـ Manifest.

---

## 1. Journey Folder Layout & Order / الفهرس العام للرحلات والشرائح

| Order | Journey ID | Journey Title / Name | Slice Count | Overview Path |
| ---: | :--- | :--- | ---: | :--- |
| 1 | `J-000` | Foundation Remote / Local / Evidence Gate | 5 | `dsh/docs/JOURNIES/journies-000-foundation-remote-local-evidence-gate/00-journey-overview.md` |
| 2 | `J-001` | Store Discovery | 6 | `dsh/docs/JOURNIES/journies-001-store-discovery/00-journey-overview.md` |
| 3 | `J-002` | Catalog Management | 6 | `dsh/docs/JOURNIES/journies-002-catalog-management/00-journey-overview.md` |
| 4 | `J-003` | Checkout, Payment, WLT, and Order | 7 | `dsh/docs/JOURNIES/journies-003-checkout-payment-wlt-order/00-journey-overview.md` |
| 5 | `J-004` | Order Lifecycle, Support, and Refund | 6 | `dsh/docs/JOURNIES/journies-004-order-lifecycle-support-refund/00-journey-overview.md` |
| 6 | `J-005` | Delivery Execution by Captain | 7 | `dsh/docs/JOURNIES/journies-005-delivery-execution-captain/00-journey-overview.md` |
| 7 | `J-006` | Partner Onboarding & Field Readiness | 7 | `dsh/docs/JOURNIES/journies-006-partner-onboarding-field-readiness/00-journey-overview.md` |
| 8 | `J-007` | Data & Media Fixture Governance | 5 | `dsh/docs/JOURNIES/journies-007-data-media-fixture-governance/00-journey-overview.md` |
| 9 | `J-008` | Platform Vars & Provider Policy | 4 | `dsh/docs/JOURNIES/journies-008-platform-vars-provider-policy/00-journey-overview.md` |
| 10 | `J-009` | Control Panel Operations Room | 5 | `dsh/docs/JOURNIES/journies-009-control-panel-operations-room/00-journey-overview.md` |
| 11 | `J-010` | WLT Finance & Settlement Boundary | 5 | `dsh/docs/JOURNIES/journies-010-wlt-finance-settlement-boundary/00-journey-overview.md` |
| 12 | `J-011` | Performance Cleanup & Refactor | 6 | `dsh/docs/JOURNIES/journies-011-performance-cleanup-refactor/00-journey-overview.md` |
| 13 | `J-012` | Auth, Permissions, Account, and Profile | 5 | `dsh/docs/JOURNIES/journies-012-auth-permissions-account-profile/00-journey-overview.md` |
| 14 | `J-013` | Notifications & Signal Layer | 5 | `dsh/docs/JOURNIES/journies-013-notifications-signal-layer/00-journey-overview.md` |
| 15 | `J-014` | Final E2E Regression Readiness | 5 | `dsh/docs/JOURNIES/journies-014-final-e2e-regression-readiness/00-journey-overview.md` |

---

## 2. Platform Control-Panel Role Map / خريطة الصلاحيات وأقسام لوحة التحكم

الهدف من هذه الخريطة هو ضمان عدم تجاوز قسم إدارة المنصة وسياستها (`Platform > Vars`) أثناء إغلاق الشرائح.

| Area / القسم | Why it matters / الأهمية التشغيلية | Related Journeys |
| :--- | :--- | :--- |
| **Platform > Vars** | إدارة وتغيير متغيرات بيئة التشغيل، سياسات الفلاتر، وتدقيق التعديلات والـ Previews | J-008, J-009, J-014 |
| **Operations Room** | متابعة حالة الطلبات النشطة، الاستثناءات، الإسناد، وطلبات الكباتن والشركاء | J-004, J-005, J-006, J-009 |
| **Finance read-only panels** | مراقبة حركات الأرصدة والمحافظ والتسويات من WLT دون وجود صلاحية كتابة داخل DSH | J-003, J-004, J-005, J-010 |
| **Catalog Governance** | مراجعة المنتجات والمتاجر، حل تعارضات تصنيف وتحديث المتاجر والشريكات | J-001, J-002 |
| **Support / SLA** | التذاكر، الدعم، الشكاوى، طلبات الإلغاء، واسترجاع المبالغ وربط العمليات بـ WLT | J-004, J-009, J-013 |
| **Auth / RBAC** | التحكم بالصلاحيات والأدوار للمشغلين، الكباتن، الشركاء، والمندوبين الميدانيين | J-003, J-006, J-009, J-012 |

---

## 3. Design Surface Lens & UI-Kit Gate / معايير التصميم وبوابة الهوية البصرية

لضمان ربط مخرجات التطوير بالهوية البصرية الموحدة وعدم تشتت التصميم:

### 1) تصنيفات الأسطح المعتمدة (Surface Lens):
يجب تصنيف كل نمط واجهة مستخدم (UI Pattern) تحت مسار واحد أو أكثر:
- `control-panel-first` / `website-first` / `webapp-first`
- `mobile-first` (تطبيقات العميل، الشريك، الكابتن، والمندوب الميداني)

### 2) قواعد التصميم الإلزامية:
- **توجب الالتزام بنظام الألوان المركزي.**
- يمنع إنشاء أي نظام تصميم محلي عشوائي؛ يجب أن يأتي الكود القابل لإعادة الاستخدام من `@bthwani/ui-kit`.
- مكتبة `Tamagui` تستخدم داخلياً فقط في الـ `ui-kit` ويمنع استيرادها المباشر في أسطح التطبيقات.
- عدم استخدام استيرادات عميقة مثل `ui-kit/src` أو `@bthwani/ui-kit/src`.

---

## 4. Pre-Store Readiness Gate / بوابة اختبارات الجاهزية للمتاجر العامة

لا يسمح برفع أي حزمة (AAB) أو اختبار داخلي (Google Play / TestFlight) إلا بعد تلبية بوابات الأدلة التالية:

| Gate / البوابة | Required Proof / الأدلة العملية المطلوبة |
| :--- | :--- |
| **Git** | خلو بيئة العمل من التشتت أو ملفات غير متتبعة غير مرغوبة (`git diff --check`). |
| **Typecheck & Tests** | نجاح التجميع الكامل واختبارات الوحدات لجميع مكونات النظام. |
| **Runtime** | استقرار بيئة تشغيل DSH/WLT مع قواعد البيانات والـ API وMinIO محلياً. |
| **Visual** | التقاط لقطات شاشة واضحة لجميع الواجهات والحالات المتأثرة. |
| **WLT Boundary** | التأكد من عدم حدوث تعديلات مالية داخل DSH وإرسال العمليات لـ WLT. |
| **UI Kit** | التحقق من أن جميع المكونات البصرية تتبع المكتبة المركزية دون ألوان عشوائية. |
| **Data / Media** | عزل Fixtures وتجربة رفع الملفات الحقيقية عبر MinIO بنجاح. |

---

## 5. Sequential Closure JSON Manifest / مخطط الشرائح البرمجي

الهيكل البرمجي لجميع الشرائح والرحلات لربط البيانات بأدوات الجرد البرمجي:

```json
{
  "package": "BTHWANI_DSH_WLT_JOURNIES_STYLE_ZERO_GAP_CLOSURE_SLICES_V3_1_20260608",
  "date": "2026-06-08",
  "target_local_repo": "C:\\bthwani-suite",
  "github_repo": "bthwani2-boop/bthwani-suite",
  "github_reference": "fix/docker-local-runtime-standardization",
  "mode": "documentation/spec package; no GitHub write; no code implementation claim",
  "journey_count": 15,
  "slice_count": 84,
  "journeys": [
    {"journey_id": "J-000", "folder_name": "journies-000-foundation-remote-local-evidence-gate", "slice_count": 5},
    {"journey_id": "J-001", "folder_name": "journies-001-store-discovery", "slice_count": 6},
    {"journey_id": "J-002", "folder_name": "journies-002-catalog-management", "slice_count": 6},
    {"journey_id": "J-003", "folder_name": "journies-003-checkout-payment-wlt-order", "slice_count": 7},
    {"journey_id": "J-004", "folder_name": "journies-004-order-lifecycle-support-refund", "slice_count": 6},
    {"journey_id": "J-005", "folder_name": "journies-005-delivery-execution-captain", "slice_count": 7},
    {"journey_id": "J-006", "folder_name": "journies-006-partner-onboarding-field-readiness", "slice_count": 7},
    {"journey_id": "J-007", "folder_name": "journies-007-data-media-fixture-governance", "slice_count": 5},
    {"journey_id": "J-008", "folder_name": "journies-008-platform-vars-provider-policy", "slice_count": 4},
    {"journey_id": "J-009", "folder_name": "journies-009-control-panel-operations-room", "slice_count": 5},
    {"journey_id": "J-010", "folder_name": "journies-010-wlt-finance-settlement-boundary", "slice_count": 5},
    {"journey_id": "J-011", "folder_name": "journies-011-performance-cleanup-refactor", "slice_count": 6},
    {"journey_id": "J-012", "folder_name": "journies-012-auth-permissions-account-profile", "slice_count": 5},
    {"journey_id": "J-013", "folder_name": "journies-013-notifications-signal-layer", "slice_count": 5},
    {"journey_id": "J-014", "folder_name": "journies-014-final-e2e-regression-readiness", "slice_count": 5}
  ]
}
```
*(تم دمج بنية الفهرس والـ JSON Manifest بالكامل للحفاظ على الهوية والهيكل ثنائياً).*
