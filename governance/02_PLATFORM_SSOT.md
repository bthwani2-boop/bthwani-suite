
# Platform SSOT (Single Source of Truth)

هذا الملف يحدد **حقائق المنصة** التي لا يجوز تكرارها عبر ملفات متعددة.  
أي تفصيل تنفيذي (خطوات/قوالب/أوامر/مجلدات evidence) يجب أن يعيش في الملف المالك له ويُشار إليه من هنا فقط.

## Scope
- حقائق المنصة المشتركة التي تؤثر على كل apps/packages/services.
- تعريف “السلطة” ومتى نرفع النزاع (انظر `01_GOVERNANCE_INDEX.md`).

## Non-negotiables (platform invariants)
- **Canonical repo**: `C:\bthwani-suite`.
- **Stack**: Node.js / TypeScript / pnpm / Nx / React / React Native / Expo / Next.js / NestJS.
- **UI ladder**: apps/surfaces تستهلك من `@bthwani/ui-kit` public exports فقط (Tamagui داخل ui-kit فقط).
- **Evidence-first**: لا قرار نهائي ولا “READY/CLOSED/100%” بدون evidence (الشكل في `11_EVIDENCE_AND_TRACEABILITY.md`).

## Control-plane responsibilities (textual governance)
- تقرر: سياسات CI/Gates، سياسات guards، حدود الحزم، قواعد الأمن، وسياسات الـ AI execution.
- لا تكرر تفاصيل الملفات الأخرى: SSOT يملك “الحقيقة العليا” ويشير للتفاصيل عبر روابط.

## Change classification (decision-level)
- **Minor**: لا يعبر حدود surfaces/services/contracts/exports.
- **Cross-boundary**: يمس export surface أو boundaries أو contract أو security posture.
- **Breaking**: تغيير كاسر لعقد عام أو exports عامة أو boundary رسمي.

متطلبات الإثبات للتصنيفات أعلاه مملوكة داخل:
- `11_EVIDENCE_AND_TRACEABILITY.md`
- `13_CI_AND_GATES.md`
- `16_SECURITY_AND_SECRETS.md`

## Escalation triggers
- أي غموض في owner لمساحة مشتركة.
- أي تغيير يمس contract أو service registry (راجع `07_SURFACES_AND_SERVICES.md` و`09_API_BINDING_RUNTIME.md`).
- أي محاولة لتجاوز سيادة `@bthwani/ui-kit`.


