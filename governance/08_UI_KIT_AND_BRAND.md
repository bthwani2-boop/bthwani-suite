
# UI Kit / Tamagui / Brand / RTL (Canonical)

هذا الملف هو **السلطة الوحيدة** لحوكمة نظام الواجهة.

## Authority
- `@bthwani/ui-kit` هو المصدر الوحيد لـ:
  - design tokens
  - themes
  - المكونات المشتركة
- Tamagui:
  - **مسموح فقط داخل `@bthwani/ui-kit`**
  - **ممنوع** الاستهلاك المباشر في `apps/` أو أي package أخرى

## Brand DNA (mandatory)
- deepBlue `#0A2F5C`
- orange `#FF500D`
- white `#FFFFFF`

قانون الاستخدام:
- استهلك tokens عبر public exports لـ ui-kit (لا تكرر hex/tokens خارجها).

## RTL & i18n law
- أي مكوّن “أساسي” في ui-kit يجب أن يكون:
  - RTL-correct (mirroring where required)
  - قابل للاستخدام في اتجاهين
- النصوص لا تُخزن داخل مكونات مشتركة كـ literals إذا كانت ضمن نطاق i18n (تُدار عبر طبقة i18n للمنتج).

## Accessibility baseline
- هدف أدنى: WCAG 2.2 practices (keyboard nav, labels, contrast) ضمن ui-kit.

## Exceptions
- أي استثناء لقاعدة Tamagui:
  - مؤقت
  - موثق بـ evidence
  - له تاريخ انتهاء وخطة إزالة

