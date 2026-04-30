
# Governance Index (Canonical map)

هذا الملف هو **خريطة السلطة** داخل `governance/`: ما هو “المالك” لكل نوع قرار، وأين تُحل النزاعات، وكيف نتجنب التكرار.

## قواعد الفهرسة (ملزمة)
- **ملف واحد لكل سلطة**: لا تكرر القاعدة نفسها في أكثر من ملف. إذا احتجت تذكيرًا، استخدم رابطًا فقط.
- **ممنوع placeholders**: لا Owners/Approvers وهميين. إن لم يتوفر اسم فريق/دور، استخدم “Platform” ككيان واحد فقط داخل `02_PLATFORM_SSOT.md` ولا تكرره في كل ملف.
- **الإنفاذ**: الإشارة إلى guards/CI تكون مرجعية، والسلطة النصية تبقى هنا فقط.

## حل التعارضات (Canonical order)
1. **التعريفات والتسميات** من `02_PLATFORM_SSOT.md`.
2. **الحدود المعمارية والاعتمادية** من `04_ARCHITECTURE_RULES.md` ثم `05_PACKAGE_BOUNDARIES.md`.
3. **الدليل/الإثبات** من `11_EVIDENCE_AND_TRACEABILITY.md` (لا حكم بدون evidence).
4. **الأمن** من `16_SECURITY_AND_SECRETS.md` (يتقدم عند التعارض مع الراحة/السرعة).
5. إن بقي التعارض: يوثق كتغيير واحد داخل PR، ويُسجل الأثر في evidence pack.

## الملفات الكانونية (18–20 ملفًا فقط)
- `00_README.md`: تعريف السلطة والنطاق وثوابت BThwani.
- `02_PLATFORM_SSOT.md`: SSOT للمنصة (التسميات، المالكين، السجلات الكانونية).
- `03_REPO_BOUNDARIES.md`: حدود الريبو والملكية والمناطق المسموحة.
- `04_ARCHITECTURE_RULES.md`: قواعد المعمارية (الطبقات، الاعتماد، UI ladder).
- `05_PACKAGE_BOUNDARIES.md`: حدود الحزم وexports ومنع deep imports.
- `06_APPS_AND_SHELLS.md`: قواعد التطبيقات وShell-only contract.
- `07_SURFACES_AND_SERVICES.md`: سجل الأسطح والخدمات الكانوني (قائمة واحدة فقط).
- `08_UI_KIT_AND_BRAND.md`: سيادة ui-kit + brand/RTL/i18n + Tamagui داخلي فقط.
- `09_API_BINDING_RUNTIME.md`: قوانين العقد/الربط/التشغيل + “phase law” لحسم OpenAPI/bootstrap.
- `10_SERVICE_CLOSURE.md`: بروتوكول الإغلاق وخطوات golden slice.
- `11_EVIDENCE_AND_TRACEABILITY.md`: شكل evidence pack، مفردات القرارات، traceability.
- `12_TESTING_AND_PRODUCTION_READINESS.md`: جاهزية الاختبار والإنتاج.
- `13_CI_AND_GATES.md`: CI gates والتدرج (report-only → enforce).
- `14_GUARDS_CATALOG.md`: فهرس guards ومبادئها (warning-first، بدون تغييرات destructive).
- `15_AGENT_AND_AI_EXECUTION.md`: حوكمة تشغيل الـ AI والـ patch review.
- `16_SECURITY_AND_SECRETS.md`: سياسات الأمن والأسرار والخصوصية.
- `17_CLEANUP_AND_DEPRECATION.md`: الحذف/النقل/الإهمال بأمان.
- `18_BRANCH_AND_CHECKPOINTS.md`: الفروع، checkpoints، change-entry.
- `99_LEGACY_MERGE_LEDGER.md`: مصير كل ملف legacy مع السبب.

## تغيير/اقتراح استثناء
- **مسار واحد**: PR يغيّر ملفًا “مالكًا” واحدًا + تحديث روابط الإحالات + evidence pack.
- **Legacy**: أي سطر مهم من legacy يجب أن يظهر هنا كقاعدة كانونية (في ملف مالك) أو يُسجل كـ SUPERSEDED/OBSOLETE في `99_LEGACY_MERGE_LEDGER.md`.

