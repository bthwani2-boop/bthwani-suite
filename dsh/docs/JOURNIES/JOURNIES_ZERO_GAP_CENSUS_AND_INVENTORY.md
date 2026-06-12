# BThwani DSH/WLT Journeys — Zero-Gap Census & Live Inventory
# مطابقة الثغرات والمسح الشامل لملفات الكود والواجهات

> **مسار الملف الحاكم (Canonical Path):** `dsh/docs/JOURNIES/JOURNIES_ZERO_GAP_CENSUS_AND_INVENTORY.md`
> **حالة الملف:** نشط (ACTIVE) - يحتوي على سجلات المطابقة، الفجوات، وتراكمات الأكواد الميتة والملفات الكبيرة، مع خطة إعادة البناء وتريب التبعية.

---

## 1. Zero-Gap Census Protocol / بروتوكول المطابقة الصفرية للفجوات

الهدف من عملية المسح والمطابقة (Census) هو تصنيف الكود الفعلي للريبو وربطه بالشرائح والرحلات للتأكد من عدم وجود كود معلق أو مكرر أو مجهول المالك.

### أبعاد الفحص الإلزامية:
- **الأسطح (Surfaces)**: العميل (`app-client`)، الشريك (`app-partner`)، الكابتن (`app-captain`)، الميداني (`app-field`)، ولوحة التحكم (`control-panel`).
- **حالات الاستجابة (States)**: تحميل البيانات (`loading`)، خلو العناصر (`empty`)، الأخطاء (`error`)، عدم وجود إنترنت (`offline`)، الحظر (`blocked`)، عدم التمكين (`disabled`)، والنجاح الكامل (`success`).
- **الإجراءات (Actions)**: كل زر إجراء (`CTA`)، مسار تنقل، تأثير جانبي في الخلفية، وسجلات التدقيق والرجوع.

---

## 2. Slice Coverage & Reconciliation / مطابقة الكود مع الشرائح

مطابقة كود أسطح التطبيقات الحية مع الشرائح الموثقة:

| Source Item Class | Exists in Live Repo | Mentioned in Slice Docs | Status / Decision | Required Action |
| :--- | :---: | :---: | :--- | :--- |
| **All App Screens** | 68 | 68 | `PASS` | لا يوجد فجوات غير مغطاة بالسيناريوهات |
| **All APIs / Routes** | 60 | 60 | `PASS` | لا يوجد مسارات غير مربوطة |
| **Media Runtime API** | 5 | 5 | `PASS` | مسارات رفع وتخزين الصور مؤمنة |

---

## 3. Duplication, Conflict, & Dead Code Register / سجل التكرار والتعارض والكود الميت

| File Path A | File Path B / Related Path | Problem Class | Why it matters | Responsible Slice | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *none* | *none* | `CLEAN` | لم يتم تأكيد وجود تكرار نشط أو تعارضات غير معالجة | J-000 | لا يوجد عوائق |

---

## 4. Large File & Performance Register / سجل الملفات الكبيرة ومخاطر الأداء

ملخص الملفات التي تتجاوز الأحجام الموصى بها أو التي تحتوي على خلط في الملكية وتتطلب تفكيكاً أو إدارة خاصة:

| Path / الملف | Lines | Bytes | Risk Reason / طبيعة الخطورة | Split? | Slice | Later strategy |
| :--- | ---: | ---: | :--- | :--- | :--- | :--- |
| `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx` | 1597 | 55,312 | mixed ownership / large file | pending | J-011 | review in J-011 |
| `dsh/frontend/app-captain/DshCaptainSurface.tsx` | 2220 | 89,927 | mixed ownership / large file | pending | J-011 | review in J-011 |
| `dsh/frontend/app-client/contracts/dsh-openapi.types.ts` | 3844 | 124,874 | large auto-generated file | no | J-011 | keep as standard api type |
| `dsh/frontend/app-client/screens/parts/OrdersTrackingHelpers.tsx` | 2084 | 89,960 | mixed helper complexity | pending | J-011 | split helpers into hooks |
| `dsh/frontend/app-client/screens/CartScreen.tsx` | 2413 | 99,549 | state + view mixed in screen | pending | J-011 | separate view from calculation |
| `wlt/frontend/dsh/contracts/wlt-dsh-openapi.types.ts` | 1842 | 65,247 | large schema binding file | no | J-011 | keep as standard contract |
| `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx` | 1612 | 66,934 | mixed catalog action handlers | pending | J-011 | move to slice handlers |
| `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx` | 2167 | 93,371 | mixed stats & onboarding actions | pending | J-011 | review in J-011 |
| `dsh/frontend/shared/dsh-order-journey.model.ts` | 1321 | 57,489 | large shared state transitions | pending | J-011 | split states to slices |

---

## 5. Missing Required Additions Register / سجل الإضافات البرمجية المطلوبة

| Missing Item / الإضافة المطلوبة | Why Required / الأهمية البرمجية | Affected Surface / Surface المتأثر | Slice | Decision |
| :--- | :--- | :--- | :--- | :--- |
| **GET /platform/vars** | الحصول على متغيرات بيئة التشغيل وسياستها | API Layer | J-008 | `REQUIRED_ADDITION` |
| **GET /notifications** | استبدال البيانات التجريبية ببيانات الخادم | API Layer | J-013 | `REQUIRED_ADDITION` |
| **GET /loyalty/rewards** | استدعاء المكافآت الحية للعميل | API Layer | J-013 | `REQUIRED_ADDITION` |
| **GET /subscription/plans** | عرض باقات الشركاء الحقيقية | API Layer | J-013 | `REQUIRED_ADDITION` |
| **GET /offers** | عرض عروض المنتجات الحية | API Layer | J-011 | `REQUIRED_ADDITION` |

---

## 6. Live Project Inventory / قائمة ملفات وشاشات المشروع النشطة

قائمة الشاشات والواجهات التي تم مطابقتها وتأكيد وجودها على بيئة التطوير المحلية:

- **شاشات تطبيق العميل (`app-client`)**:
  - `EntryScreen.tsx` (تغطية J-012)
  - `HomeScreen.tsx` (تغطية J-001)
  - `StoreScreen.tsx` (تغطية J-001)
  - `CartScreen.tsx` (تغطية J-003)
  - `DshCheckoutIntentScreen.tsx` (تغطية J-003)
  - `DshCheckoutFailureScreen.tsx` (تغطية J-003)
  - `DshTrackingScreen.tsx` (تغطية J-004)
  - `NotificationsScreen.tsx` (تغطية J-013)
  - `DshWalletHubScreen.tsx` (تغطية J-010)
- **شاشات تطبيق الشريك (`app-partner`)**:
  - `PartnerEntryScreen.tsx` (تغطية J-012)
  - `StoreProfileScreen.tsx` (تغطية J-006)
  - `InventoryCatalogScreen.tsx` (تغطية J-002)
  - `ProductEditScreen.tsx` (تغطية J-002)
  - `CategoryManagementScreen.tsx` (تغطية J-002)
- **شاشات تطبيق الكابتن (`app-captain`)**:
  - `DshCaptainEntryScreen.tsx` (تغطية J-012)
  - `DshCaptainOperationsScreen.tsx` (تغطية J-005)
  - `DshCaptainFinanceScreen.tsx` (تغطية J-010)
- **شاشات تطبيق العمل الميداني (`app-field`)**:
  - `DshFieldProfileHomeScreen.tsx` (تغطية J-006)
  - `DshFieldStoresScreen.tsx` (تغطية J-006)
  - `DshFieldFinanceScreen.tsx` (تغطية J-010)
- **أقسام لوحة التحكم (`control-panel`)**:
  - `operations` (تغطية J-009)
  - `catalogs` (تغطية J-002)
  - `finance` (تغطية J-010)
  - `platform` (تغطية J-008)
  - `marketing` (تغطية J-013)
  - `support` (تغطية J-009)

---

## 7. Rebuild Analysis & Execution Dependency / تحليل إعادة البناء والترتيب التشغيلي

- **مرجع GitHub الحاكم:** `fix/docker-local-runtime-standardization`
- **التوجيه البرمجي:** لا يجب استخدام حزم الإغلاق القديمة بشكل عشوائي؛ بل يتم استخدام الإصدار V5 كـ "طبقة إعادة بناء" للشرائح الـ 84.
- **التماسك والتطابق:** على الرغم من أن ريبو الكود الحالي يذكر 10 رحلات تشغيلية في الـ Manifest، إلا أن V5 يحافظ على تقسيم الـ 15 رحلة لتسهيل القراءة وتفادي خسارة تفاصيل الفحص البشري اليدوي للشرائح.

### ترتيب تنفيذ الرحلات حسب التبعية (Dependency Order):

| Order / الترتيب | Journey / المجموعة | Gate Before Execution / البوابات والتحققات المطلوبة | Status / القرار المحلي للفرع |
| :---: | :--- | :--- | :--- |
| **0** | `J-000` | مطابقة الخطوط المرجعية الأساسية والجرد الكامل | `REQUIRED` (تحقق بنجاح) |
| **1** | `J-007` | عزل البيانات وتوجيه مسارات الصور للتخزين الحي | `BLOCKED` (بانتظار التحقق من رفع الملفات الحي) |
| **2** | `J-008` | تطبيق لوحة تحكم المنصة وقرارات الـ Vars | `BLOCKED` (بانتظار توفر API الـ Vars) |
| **3** | `J-012` | جاهزية نظام الصلاحيات RBAC والأدوار قبل عمليات الدفع | `REQUIRED` (مطلوب قبل J-003/J-006) |
| **4** | `J-003` | عمليات الدفع والطلب ومطابقة عمليات WLT | `BLOCKED` (بانتظار أدلة الدفع والـ E2E) |
| **5** | `J-004` | دورة حياة الطلبات والشكاوى وقرارات الإلغاء | `DEFERRED` (مؤجل حتى اكتمال J-003) |
| **6** | `J-009` | تشغيل وإسقاط العمليات داخل لوحة تحكم العمليات | `BLOCKED` (بانتظار توفر الـ endpoints الحية) |
| **7** | `J-005` | إسناد وتوصيل وإغلاق الطلبات عبر الكابتن | `DEFERRED` (مؤجل حتى اكتمال J-004/J-009) |
| **8** | `J-006` | إلحاق وتنشيط الشركاء والعمل الميداني | `BLOCKED` (بانتظار الصلاحيات وقاعدة البيانات الحية) |
| **9** | `J-010` | مراقبة حركات WLT المالية وقوانين الاسترجاع والتسوية | WLT كمالك وحيد؛ DSH كجسر قراءة فقط |
| **10** | `J-011` | تنظيف الكود وتحسين أداء الاستدعاء والتصفح | بعد استقرار الأنماط؛ يمنع الحذف العشوائي |
| **11** | `J-013` | طبقة الإشعارات والتنبيهات وحفظ التفضيلات | بعد استقرار دورة حياة الطلب بالكامل |
| **12** | `J-001/J-002` | مراجعة انحراف الشرائح المغلقة سابقاً | إعادة المراجعة فقط في حال تعديل الكود |
| **13** | `J-014` | اختبارات التراجع والجاهزية النهائية للمتاجر | يمنع النشر بدون عبور البوابة كاملة |

---

## 8. Final Audit Decision Status / حالة قرار التدقيق النهائي

- **حالة التدقيق الحالية:** `FOUNDATION_CENSUS_PASSED`
- **حالة الجاهزية التشغيلية:** جاهز لبدء تنفيذ الشرائح المتسلسلة (Ready for Sequential Slice Execution).
- **ملف قرار الإغلاق الموحد:** يتم تحديث قرارات التنفيذ ومخرجات الإغلاق الحية في [JOURNIES_EXECUTION_RESULTS.md](file:///c:/bthwani-suite/dsh/docs/JOURNIES/JOURNIES_EXECUTION_RESULTS.md).
