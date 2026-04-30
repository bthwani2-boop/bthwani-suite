
# Repo Boundaries (Canonical)

هذا الملف يملك السلطة على:
- حدود مساحات الريبو (apps / packages / tools / governance …)
- ملكية المجلدات المشتركة
- قواعد التسمية الممنوعة (legacy drift)

## Canonical repo truth
- الحقيقة النشطة الوحيدة: `C:\bthwani-suite`.
- أي مسارات/مستودعات قديمة (مثل `bth`) ليست حقائق تشغيلية ويجب ألا تُذكر كمرجع نشط.

## Root layout (policy-level)
- `apps/`: تطبيقات قابلة للتشغيل/النشر.
- `packages/`: حزم مشتركة (public/internal).
- `tools/`: أدوات التطوير وCI (تنفيذ، لا سياسات).
- `governance/`: السلطة النصية للحوكمة.

## Ownership law
- كل مجلد مشترك أو “حدودي” يجب أن يكون له **Owner واحد واضح** (فريق/دور).
- تغيير الملكية أو نقل نطاق مسؤولية يعتبر **Cross-boundary change** ويتطلب evidence وفق `11_EVIDENCE_AND_TRACEABILITY.md`.

## Shared folder constraints
- ممنوع نسخ/تكرار design tokens أو UI primitives خارج `@bthwani/ui-kit` (السلطة في `08_UI_KIT_AND_BRAND.md`).
- أي حذف/نقل لمجلد مشترك يتطلب: إثبات عدم وجود مستهلكين + خطة ترحيل + evidence (السلطة في `17_CLEANUP_AND_DEPRECATION.md`).

## Package/import boundary note
قواعد exports/deep-import مملوكة بالكامل داخل `05_PACKAGE_BOUNDARIES.md` (لا تكرر هنا).


