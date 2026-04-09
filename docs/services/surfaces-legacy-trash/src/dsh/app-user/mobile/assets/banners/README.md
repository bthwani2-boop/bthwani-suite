# بانرات DSH (كاروسيل الصفحة الرئيسية)

**قاعدة RULE_DEV_MEDIA_LOCAL_SERVER_EXPOGO_MCPW:** صور البنرات **لا تُخزَّن داخل المستودع**. يجب أن توجد **فقط** في المجلد الخارجي للأصول.

## المسار الخارجي (الوجهة)

```
C:\Users\b\Documents\bthwaniassets\mock\banners\dsh\
```

خادم الوسائط يخدم الطلبات إلى `EXPO_PUBLIC_DEV_MEDIA_BASE/banners/dsh/banner_002.jpg` … من هذا المجلد.

## أسماء الملفات

الكود يحمّل: `banner_002.jpg`, `banner_003.jpg`, … `banner_008.jpg` (سبعة بنرات).

## بعد التوليد بالذكاء الاصطناعي

الصور المُولَّدة تظهر في مجلد مشروع Cursor (مثل `assets`). لرؤية البنرات في التطبيق، انسخها إلى المجلد الخارجي بتشغيل من جذر المستودع:

```powershell
.\.cursor\scripts\COPY_DSH_BANNERS_TO_MEDIA.ps1
```

السكربت ينسخ من المصادر المُعرَّفة فيه (بما فيها مجلد التوليد) إلى `bthwaniassets\mock\banners\dsh\`.

## إذا لم تظهر الصور في التطبيق (بنرات حمراء بدل الصور)

1. **تأكد من تشغيل الستاك:** `pnpm stack` (خادم الوسائط ومسارات الـ reverse-proxy حسب `runtime/local`).
2. **متغير البيئة:** في `apps/mobile/app-client/.env.local` ضع القيمة الموحّدة عبر الـ reverse-proxy، مثال:
   - `EXPO_PUBLIC_DEV_MEDIA_BASE=http://media.bth.local/mock`
3. **إعادة تشغيل Expo مع مسح الكاش:** `npx expo start --clear` (لأن Expo يخبئ القيم عند البناء).

## مواصفات التصميم

أفقية، نسبة تقريبية 16:9، مناسبة للكاروسيل (ارتفاع ~220px في الواجهة). بدون نصوص أو شعارات في الصورة؛ النصوص تُضاف من الواجهة أو من لوحة التحكم.

