
# Architecture Rules (Canonical)

هذا الملف يملك السلطة على:
- تعريف الطبقات Screen/Surface/App
- قوانين الاعتمادية بين الطبقات
- قوانين TypeScript “كحد أدنى”
- حماية نقاط الدخول runtime (على مستوى معماري)

## Definitions
- **Screen**: وحدة UI تمثل شاشة/حالة عرض.
- **Surface**: مجموعة Screens يملكها فريق واحد.
- **App**: منتج يجمع Surfaces.

## Non-negotiables
- UI consumption: عبر `@bthwani/ui-kit` public exports فقط (تفاصيل السلطة في `08_UI_KIT_AND_BRAND.md`).
- Tamagui: ممنوع خارج `@bthwani/ui-kit`.
- TypeScript: `strict` مطلوب على الأقل في الحزم المشتركة/العامة.
- Runtime entrypoints (routes/handlers): يجب أن تُحمي من تنفيذ غير مصادق/غير مُصرّح.

## Dependency laws (directionality)
- Screen → Surface → App (لا “عكس الاتجاه”).
- Surface/App لا تعتمد على internals لحزم أخرى (تفاصيل deep-import في `05_PACKAGE_BOUNDARIES.md`).
- تغييرات contracts أو exports تعتبر Cross-boundary وتتطلب evidence وفق `11_EVIDENCE_AND_TRACEABILITY.md`.

## Drift examples (forbidden)
- أي استيراد مباشر لـ Tamagui خارج ui-kit.
- نسخ design tokens أو نظام تصميم محلي خارج ui-kit.
- اعتماد apps/surfaces على مسارات داخلية لحزمة (deep import).

## Enforcement (reference)
- Guards ذات الصلة: `GUARD_19_TYPESCRIPT_STRICTNESS`, `GUARD_21_ROUTE_SCREEN_FILE_STRUCTURE`, `GUARD_08_RUNTIME_ROUTE_ENTRYPOINT_PROTECTION` (catalog في `14_GUARDS_CATALOG.md`).


