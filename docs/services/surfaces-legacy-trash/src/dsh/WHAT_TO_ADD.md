# ما يجب إضافته في packages/surfaces/src/dsh

مرجع: العقد (Master_OpenAPI)، DSH_PARTNER_APP_ANALYSIS، DSH_PRODUCT_UNITS_AND_OPTIONS_WHAT_TO_DO، DSH_OPERATIONS_SCREENS_INVENTORY.  
**تم التحقق من الكود والخريطة والعقد بدقة 100%.**

---

## 1) إضافات جديدة (شاشات/ملفات)

### app-partner/mobile

| الملف المطلوب | العملية | الأولوية | التحقق |
|---------------|---------|----------|--------|
| `auto_dsh_partner_store_service_modes_update.tsx` | dsh_partner_store_service_modes_update | **P1** | الخريطة: `partnerRouteMap.tsx` سطر 151 — حالياً `dsh_partner_store_service_modes_update: AutoDshPartnerStoreUpdate` (Placeholder). لا يوجد ملف بهذا الاسم في `app-partner/mobile/`. |
| شاشة (أو شاشتان) للرد السريع | dsh_partner_quick_reply_config_get، dsh_partner_quick_reply_setup | **P1** | لا يوجد ملف *quick* في `app-partner/mobile/`. لا يوجد في `PartnerRouteKey` ولا في `PARTNER_SCREEN_MAP` أي route لـ quick_reply. رفض الطلب: `auto_dsh_partner_order_reject.tsx` يغطي dsh_partner_quick_reply_post. |

**ملاحظة خريطة الشريك:** الملف `packages/surfaces/src/mobile/app-partner/partnerRouteMap.tsx` — عند إضافة شاشة الرد السريع يجب إضافة: إلى `PartnerRouteKey` نوعاً مثل `'dsh_partner_quick_reply_config_get'` و/أو `'dsh_partner_quick_reply_setup'`، وإلى `PARTNER_SCREEN_MAP` المكوّن المقابل.

### (اختياري) app-partner

| الملف | متى يُضاف | التحقق |
|-------|-----------|--------|
| `auto_dsh_partner_store_create.tsx` | إذا كان تدفق "ترشيح متجر" غير كافٍ لإنشاء متجر | الخريطة سطر 152: `dsh_partner_store_create: AutoDshPartnerStoreNomination`. العقد: dsh_partner_store_create. |

---

## 2) تحسينات على ملفات موجودة

### app-partner (وحدات القياس وخيارات المنتج — DSH_PRODUCT_UNITS_AND_OPTIONS_WHAT_TO_DO)

| الملف | المطلوب | التحقق |
|-------|----------|--------|
| `app-partner/mobile/auto_dsh_partner_items_upsert.tsx` | دعم optionGroups، unitType/uomId عند إضافة/تعديل منتج؛ استدعاء API الموسّع. | تم البحث: لا يوجد في الملف أي استخدام لـ optionGroups أو optionId أو uomId أو unitType. |

### app-client (عرض الخيارات ووحدات القياس)

| الملف | المطلوب | التحقق |
|-------|----------|--------|
| `app-client/mobile/auto_dsh_store_get.tsx` | استكمال: عرض تسمية الوحدة (displayLabel أو من UoM)؛ ربط VAR_DSH_PRODUCT_OPTIONS_FALLBACK عند غياب optionGroups. | الملف يحتوي بالفعل على optionGroups، optionId، و fallback ربع/نصف/حبة (مثلاً سطور 941، 1161، 1170). المطلوب حسب المرحلة 4: تسمية الوحدة من UoM وربط VAR عند الحاجة. |
| `app-client/mobile/auto_dsh_store_items_list.tsx` | إن لزم: نفس منطق عرض الخيارات/الوحدة بما يتوافق مع store_get. | — |
| تدفق السلة/الطلب (cart_item_add، order_create) | التأكد أن العنصر يحمل productId + optionId (أو المعرّف المعتمد) + السعر. | — |

---

## 3) حالة البنود التي لا تحتاج إضافة ملفات (مُتحقَّق)

| البند | الحالة | الدليل |
|-------|--------|--------|
| ترقية اشتراك الشريك | **تم** | `auto_dsh_partner_subscription.tsx`: استيراد `upgradeDshPartnerSubscription` من `@bthwani/api-clients/dsh/dsh-field-partner-api`؛ في `handleUpgrade` (سطر 78) استدعاء `await upgradeDshPartnerSubscription('premium')`. الـ api-clients يربطها بـ `dsh_partner_subscription_upgrade_post`. لا حاجة لـ route منفصل. |
| زر "فتح في الخرائط" (توصيل شريك) | **تم** | `auto_dsh_partner_order_get.tsx`: عند `order.deliveryMode === 'merchant_delivery' && order.delivery_address` (سطور 296–308) يُعرض قسم مع زر "فتح في الخرائط" يفتح Google Maps بالعنوان. |

---

## 4) ملخص تنفيذ مقترح (بدقة)

1. **P1:** إنشاء `packages/surfaces/src/dsh/app-partner/mobile/auto_dsh_partner_store_service_modes_update.tsx` وتعديل `partnerRouteMap.tsx`: استبدال `AutoDshPartnerStoreUpdate` بالمكوّن الجديد لـ `dsh_partner_store_service_modes_update`.
2. **P1:** إنشاء شاشة (أو شاشات) للرد السريع في `app-partner/mobile/` واستدعاء dsh_partner_quick_reply_config_get و dsh_partner_quick_reply_setup؛ إضافة الـ route key(s) والمكوّن(ات) إلى `partnerRouteMap.tsx`.
3. **مرحلة وحدات القياس (بعد العقد والـ backend):** تحسين `auto_dsh_partner_items_upsert.tsx` (خيارات + UoM)؛ ثم استكمال `auto_dsh_store_get.tsx` (تسمية الوحدة + VAR) و store_items_list والسلة/الطلب حسب المرحلة 4.
4. **حسب الحاجة:** إضافة أو توثيق `auto_dsh_partner_store_create.tsx` إذا كان StoreNomination غير كافٍ.

