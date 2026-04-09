# أيقونات فئات DSH (كاروسيل الرئيسية)

**قاعدة RULE_DEV_MEDIA_LOCAL_SERVER_EXPOGO_MCPW:** الوسائط (صور الأيقونات) **يُمنع** وجودها داخل المستودع. يجب أن توجد **فقط** في مجلد الأصول خارج المستودع.

## لماذا لا تظهر الصور في الواجهة؟

تظهر الصور **فقط** عندما:

1. **المتغير البيئي مضبوط** على قاعدة الوسائط عبر الـ reverse-proxy، مثال: `EXPO_PUBLIC_DEV_MEDIA_BASE=http://media.bth.local/mock` في تطبيق Expo (مثلاً في `apps/mobile/app-client/.env.local`). تشغيل **`.cursor/scripts/DEV_MEDIA_ENV_SETUP.ps1`** يضبط هذا تلقائياً عندما يكون مُعدّاً لذلك.
2. **خادم الوسائط يعمل:** ضمن الستاك المحلي (`pnpm stack` أو `.cursor/scripts/important/RUN_BTH_STACK.ps1`) بحيث تُوجَّه الطلبات إلى مجلد الأصول خارج الريبو.
3. **الملفات موجودة على القرص:** الأيقونات في المسار أدناه (انظر أسماء الملفات).

إذا لم يُضبط المتغير أو الخادم لا يعمل أو الملف غير موجود، التطبيق يعرض **الإيموجي** بدلاً من الصورة (لا يترك مربعات فارغة).

## المسار المطلوب (خارج المستودع)

```
C:\Users\b\Documents\bthwaniassets\mock\categories\dsh\
```

خادم الوسائط يجعل الطلبات إلى `EXPO_PUBLIC_DEV_MEDIA_BASE/categories/dsh/<id>.png` تُخدم من هذا المجلد.

## أسماء الملفات (بحسب معرف الفئة)

**رئيسية:** `restaurants.png`, `grocery.png`, `sweets_juices.png`, `anaqati.png`, `bthwani_store.png`, `home_projects.png`, `shein.png`, `spare_parts.png`, `honey_dates.png`, `electronics.png`.

**فرعية:** `grocery_vegetables_fruits.png`, `grocery_meat_fish_chicken.png`, `grocery_roasted_spices.png`, `grocery_bakeries.png`, `grocery_deals_bundle.png`, `sweets_juices_fresh.png`, `sweets_juices_sweets.png`, `sweets_juices_icecream.png`, `anaqati_perfumes.png`, `anaqati_accessories_beauty.png`, `anaqati_clothing.png`.

## بعد توليد الأيقونات

الأيقونات تُولَّد (مثلاً من Cursor أو أداة خارجية) وتُحفظ في مجلد staging داخل المستودع (مثل `.cursor/artifacts/dsh-category-icons/`). لرؤية الصور في التطبيق، انسخها إلى المسار أعلاه بتشغيل من جذر المستودع:

```powershell
.\.cursor\scripts\COPY_DSH_CATEGORY_ICONS_TO_MEDIA.ps1
```

البرومبتات وأسماء الملفات موثّقة في `.cursor/scripts/DEV_MEDIA_ON_DEMAND_AI_IMAGES.md` و`.cursor/artifacts/dsh-category-icons/manifest.json`.

## قواعد التصميم

مربعة (بدون إطار دائري)، مناسبة للحجم في الكاروسيل. لا يُسمح بوضع نسخ من هذه الصور داخل المستودع.

