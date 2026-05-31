# BTHWANI CONFLICT RESOLUTION MATRIX TEMPLATE — V7

استخدم هذا القالب لتوثيق كل حالات التعارض المكتشفة في أي Target.
يُملأ في المرحلة 9 (Structural Hygiene) أو المرحلة 12 (Technical/Logic Gap Discovery) حين تُكتشف تعارضات.

---

## 1. متى تستخدم هذه المصفوفة

```text
عند وجود:
  منتج/فئة مكررة بنفس الهوية في أكثر من مكان
  إعداد (var) يمكن ضبطه من مستويين مختلفين بنتائج متعارضة
  بيانات demo مكررة تتعارض مع السجل الأصلي
  offer/promo نشطة في نفس slot
  partner override يتعارض مع catalog truth
  حالة (status) يمكن أن تصدر من أكثر من سطح مالك
  إجراء يمكن تشغيله من سطحين مختلفين بنتيجة مختلفة
  قاعدة حوكمة تتناقض مع قاعدة guard
```

---

## 2. قالب مصفوفة Conflict Resolution

| معرّف | نوع التعارض | وصف التعارض | السطح 1 / المصدر 1 | السطح 2 / المصدر 2 | سلوك حالي | السلوك المطلوب | المالك الحل | إجراء الكشف | طريقة العرض للمستخدم | قرار الحل | هل يلزم API/backend؟ | هل هو UI-only الآن؟ | خطر التنفيذ | أولوية | القرار |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CONF-01 | | | | | | | | | | | | | | | |

### شرح الأعمدة

| العمود | المعنى |
|---|---|
| معرّف | CONF-XX تسلسلي |
| نوع التعارض | انظر Section 3 |
| وصف التعارض | ماذا يحدث بالتحديد |
| السطح 1 / المصدر 1 | المكان الأول الذي يُحدّد القيمة أو الحالة |
| السطح 2 / المصدر 2 | المكان الثاني المتعارض |
| سلوك حالي | ما يحدث الآن فعلياً |
| السلوك المطلوب | ما يجب أن يحدث |
| المالك الحل | من يملك صلاحية الحسم |
| إجراء الكشف | كيف يُكتشف التعارض (برمجياً) |
| طريقة العرض للمستخدم | كيف يرى المستخدم التعارض (toast / validation / badge) |
| قرار الحل | انظر Section 4 |
| هل يلزم API/backend؟ | yes / no / API-later |
| هل هو UI-only الآن؟ | yes / no |
| خطر التنفيذ | low / medium / high |
| أولوية | 1 (حرجة) / 2 (مهمة) / 3 (تحسينية) |
| القرار | FIX_NOW / UI_ONLY_NOW / API_LATER / BLOCKED_WITH_REASON |

---

## 3. أنواع التعارض المدعومة

```text
DUPLICATE_ENTITY
  نفس الكيان (product/category/partner) موجود في أكثر من مكان بهوية مختلفة

SLOT_CONFLICT
  موقع (position/slot) محجوز من طرفين في آن واحد (مثال: banner position)

OVERRIDE_CONFLICT
  override من سطح ثانوي يلغي حقيقة السطح الأساسي بدون وضوح

STATUS_CONFLICT
  نفس الكيان له status مختلف عبر سطحين

DATA_DIVERGENCE
  بيانات demo/fixture تتعارض مع السجل الأصلي في dsh/frontend/data

VARS_PRECEDENCE_CONFLICT
  var مضبوط محلياً يتعارض مع var عالمي بدون قواعد أسبقية واضحة

PERMISSION_CONFLICT
  إجراء مسموح من سطح وممنوع من سطح آخر بدون سبب مُعلن

GOVERNANCE_CONFLICT
  قاعدة في agents/governance تتعارض مع قاعدة في guard

MEDIA_CONFLICT
  نفس mediaKey يشير إلى صورتين مختلفتين
```

---

## 4. قرارات الحل المسموحة

```text
CANONICAL_OWNER_ENFORCED
  حُسم بتحديد المالك الأصلي — السطح الآخر يُزيل أو يرث

MERGE_AND_DEDUPLICATE
  الكيانات المكررة تُدمج في سجل واحد

PRECEDENCE_RULE_ADDED
  أُضيفت قاعدة أسبقية صريحة (مثال: local override يغلب global إلا في finance)

SLOT_RESERVATION_ENFORCED
  المنطق يمنع حجز Slot المحجوز

VALIDATION_BLOCKER_ADDED
  أُضيف validation يمنع الإجراء عند وجود التعارض

WARN_AND_REQUIRE_CONFIRMATION
  التعارض يُعرض للمستخدم ويطلب تأكيداً صريحاً قبل المتابعة

UI_ONLY_NOW_API_LATER
  الحل المؤقت في UI فقط — الحل الكامل يحتاج backend

BLOCKED_WITH_REASON
  التعارض لا يمكن حله على مستوى UI — مُوثّق ومحجوب لحين API
```

---

## 5. قواعد استخدام المصفوفة

```text
[1] لا تعديل كود قبل ملء المصفوفة للتعارضات المكتشفة
[2] كل تعارض له قرار صريح — لا "سنتعامل معه لاحقاً" بدون تصنيف
[3] تعارضات UI-only الآن لا تحتاج موافقة على backend/API
[4] تعارضات تحتاج API/backend تُصنف API_LATER وتُدرج في Runtime/API Readiness Matrix
[5] لا READY على target يحتوي CONF ذو أولوية 1 بدون حل
```

---

## 6. مثال مملوء

| معرّف | نوع التعارض | وصف التعارض | السطح 1 | السطح 2 | سلوك حالي | السلوك المطلوب | المالك الحل | إجراء الكشف | طريقة العرض | قرار الحل | API؟ | UI-only الآن؟ | خطر | أولوية | القرار |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CONF-01 | SLOT_CONFLICT | منتجان نشطان في Banner Position 1 | banners screen | banners editor | كلاهما يُعرض بدون تحذير | يُمنع النشر إذا الموضع محجوز | control-panel-marketing | فحص `status=published AND position=1` عند النشر | رسالة خطأ: "الموضع محجوز بـ [اسم البانر]" | VALIDATION_BLOCKER_ADDED | API-later | yes | low | FIX_NOW |
