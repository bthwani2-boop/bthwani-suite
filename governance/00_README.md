
# Governance (Canonical)

**Canonical repo**: `C:\bthwani-suite`  
**Canonical docs root**: `governance/` (هذا المجلد هو السلطة النصية الوحيدة)  
**Legacy input (read-only)**: `governance/governance-legacy/` (مصدر قراءة/تحليل فقط؛ الهدف أن يصبح حذفه لاحقًا آمنًا بعد الاستخراج)
**Canonical evidence root**: `tools/registry/runs/{SESSION_ID}/` (الشكل في `11_EVIDENCE_AND_TRACEABILITY.md`)

## ما الذي تملكه الحوكمة؟

- **Repository truth**: حقائق الريبو، الأسماء المسموحة/الممنوعة، وحدود الملكية.
- **Architecture**: فصل Screen/Surface/App، وحدود الحزم، وتدفّق الاعتمادات.
- **UI system**: سيادة `@bthwani/ui-kit` + Tamagui داخل ui-kit فقط + هوية العلامة وRTL.
- **API/binding/runtime**: سلسلة العقد→الأنواع→العملاء→الربط→الشاشات→إثبات التشغيل.
- **Evidence-first**: لا “PASS/READY/CLOSED/FINAL/100%” بدون أدلة.

## ثوابت BThwani (ملزمة)

- **Repo**: الحقيقة النشطة الوحيدة هي `C:\bthwani-suite` (ممنوع اعتماد أي repo/مسار قديم باسم `bth` كحقيقة نشطة).
- **Stack**: Node.js / TypeScript / pnpm / Nx / React / React Native / Expo / Next.js / NestJS.
- **Architecture ladder**: Screen/Surface/App → `@bthwani/ui-kit` public exports → Tamagui internally inside ui-kit only.
- **Brand DNA**: deepBlue `#0A2F5C`, orange `#FF500D`, white `#FFFFFF`, RTL صحيح، Premium 2026، صفر ضجيج.

## كيف تقرأ هذه الحزمة؟

ابدأ من:

- `01_GOVERNANCE_INDEX.md` (فهرس السلطة وخريطة الملفات)
- ثم `02_PLATFORM_SSOT.md` (مصدر الحقيقة للمنصة)

## كيف تغيّر الحوكمة بدون فوضى؟

- **قاعدة السلطة الواحدة**: كل قاعدة “قانون” يجب أن يكون لها **ملف مالك واحد** فقط داخل `governance/`.
- **التغيير المسموح**: يقتصر على `governance/` فقط، مع توثيق مصير legacy داخل `99_LEGACY_MERGE_LEDGER.md`.
- **لا أسرار**: ممنوع أي مفاتيح/توكنات/بيانات حساسة داخل docs أو evidence.

## جذور تنفيذية لا تتفوق على الحوكمة

هذه جذور “تنفيذ/اشتقاق/إخراج أدلة” ولا يجوز أن تصبح مصدر سياسة منافس:

- `tools/guards/`
- `tools/scripts/`
- `tools/registry/runs/`
- `.github/workflows/`
- `.github/agents/`
- `.github/skills/`

## Legacy merge ledger

كل ملف تحت `governance-legacy/` له قرار مصير داخل:

- `99_LEGACY_MERGE_LEDGER.md`
