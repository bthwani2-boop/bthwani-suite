---
generatedFrom: governance/GOVERNANCE_CANONICAL.md
generatedAt: 2026-04-30T04:48:37.4431091+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# مسودة الهيكل القَنَوني للحوكمة — Governance Canonical Structure

هذه المسودة تقترح بنية قنونية موحّدة لملفّات `governance/`، تُستخدم كمرجع للدمج وإعادة التنظيم.

ملفات أساسية (احتفظ/اجمع/اجعل مرجعاً):

- `00_GOVERNANCE_INDEX.md` — فهرس ونقاط الدخول (KEEP).
- `01_PLATFORM_SSOT.md` — مصدر الحقيقة للمنصة (KEEP).
- `02_BRANCH_AND_EVIDENCE_POLICY.md` — سياسة الفروع وحزم الأدلة (MERGE with 18_EVIDENCE_PACK_STANDARD.md where relevant).
- `18_EVIDENCE_PACK_STANDARD.md` — معيار Evidence Pack (KEEP as normative; link to template `EVIDENCE_PACK_TEMPLATE.md`).
- `GOVERNANCE_GUARD_CATALOG.md` — (NEW) قائمة الحراس الموحّدة؛ يدمج محتويات scattered GUARD_*.md and GUARDS.md.
- `GOVERNANCE_GUARD_EXECUTION_STANDARD.md` — (NEW) كيف تُشغّل الحراس (pre-commit/pre-push/CI) ودرجات الشدة (blocking/warning).
- `14_AGENT_EXECUTION_RULES.md` — (KEEP/EXTEND) اجمع كل Agent & Patch Review policies هنا (merge AGENT_GOVERNANCE_POLICY.md and 19_PATCH_REVIEW_PROTOCOL.md).
- `03_PACKAGE_BOUNDARY_CONTRACT.md` — (KEEP) سياسة حدود الحزم والـshared folders.
- `07_UI_KIT_AUTHORITY_CONTRACT.md` — (KEEP) واجهة التحكم بالـUI Kit وTamagui rules.
- `TAMAGUI_INTEGRATION_LAW.md` — (KEEP) قيود التكامل مع Tamagui وموضع Tamagui داخل ui-kit only.
- `TRACEABILITY_MATRIX_STANDARD.md` — (NEW) قالب ومثال لربط requirement→screen→API→binding→tests→evidence.
- `GOVERNANCE_REORGANIZATION_LEDGER.md` — (KEEP) سجل الدمج/أرشفة التغييرات مع مراجع provenance.
- `EVIDENCE_PACK_TEMPLATE.md` — (KEEP) القالب العملي (أنشئت).

مجلدات تنظيمية:

- `governance/archive/` — للاحتفاظ بالملفات القديمة المندمجة (DO NOT DELETE until 30 days after merge).
- `tools/guards/` — نماذج تنفيذية قابلة للتشغيل للحراس (scripts should live under tools, docs in governance).
- `tools/analysis/` — أدوات التحليل (dedup scanner, reports).

قواعد دمج سريعة (rationale):

- ادمج الملفات المتماثلة نصياً أو الأفضلية للمصدر الأحدث/الأشمل.
- احتفظ بقسم Provenance في كل ملف قنوني يُنشأ: قائمة بالملفات المندمجة ورابط commit.
- لا تحذف الملفات الأصلية دفعة واحدة: انقل إلى `governance/archive/<timestamp>-<name>/` ثم التزم.

ملاحظة: هذه مسودة قابلة للتعديل بعد مراجعة نتائج الفحص التفصيلي للتكرار (`tools/analysis/gov_dedup_output/gov_dedup_report.csv`).

