# BThwani Forward-Only Closure Package — الملف القائد

**التاريخ:** 2026-05-23
**المسار المحلي المعتمد:** `C:\bthwani-suite`
**مصدر القراءة:** المرفقات + snapshot `bthwani-suite-ghb-0165-20260522-184334-dsh.zip` + GitHub read-only على `ghb/0165-20260522-184334-dsh`
**نوع الحزمة:** خارطة طريق تشغيلية/منطقية/تقنية منظمة، وليست تنفيذًا داخل الريبو.

---

## 1. القرار الأعلى

```text
Decision: FIX_REQUIRED_BEFORE_API_BACKEND
```

المشروع ليس متوقفًا؛ لكنه لا يحق له الآن ادعاء `100% / CLOSED / READY / PASS` على DSH أو المنصة كاملة.

السبب المختصر:

```text
DSH UI/UX ما زال يحتاج visual evidence.
DSH Screen/API Matrix يقول NOT_READY_FOR_API.
DSH runtime غير مثبت.
DSH backend/domain ما زالا scaffold/TBD.
الشاشات الضخمة تحتاج قرار قبل binding.
لا يوجد Go backend فعلي، ولا go.mod، ولا migrations SQL، ولا docker-compose.local.yml في snapshot.
```

---

## 2. الأرقام الرقمية من المرفق

```text
عدد عناصر ZIP: 1495
عدد الملفات المفحوصة: 1164
عدد المجلدات المفحوصة: 330
عدد صفوف جداول Markdown المفهرسة: 1812
ملفات DSH: 310
ملفات WLT: 78
ملفات ui-kit: 44
ملفات tools: 204
ملفات Go: 0
ملفات SQL migrations: 0
OpenAPI empty paths candidates: 10
Giant files >70KB: 11
Large files >40KB: 16
```

كل ملف وكل مجلد وكل صف جدول مفهرس داخل ملفات CSV في مجلد `evidence/`.

---

## 3. كيف تستخدم هذه الحزمة

ابدأ بهذا الملف فقط، ثم افتح الملف المساعد حسب السؤال:

| المطلوب | الملف |
|---|---|
| الحكم النهائي والتحليل الجنائي | `roadmap/01_EXECUTIVE_FORENSIC_VERDICT.md` |
| مراحل الطريق من الآن إلى الإغلاق | `roadmap/02_FORWARD_ONLY_ROADMAP_PHASES.md` |
| منع نسيان سطح/شاشة/عملية | `roadmap/03_SLICE_COVERAGE_MANIFEST_PROTOCOL.md` |
| الحراس واختبارات الجودة | `roadmap/04_MANDATORY_QUALITY_GATES.md` |
| تقسيم الشاشات الضخمة | `roadmap/05_FRONTEND_SCREEN_DECOMPOSITION_STANDARD.md` |
| API / Binding / Backend / DB | `roadmap/06_API_BINDING_BACKEND_DB_ROADMAP.md` |
| المحلي / Docker / PostgreSQL / Staging | `roadmap/07_LOCAL_RUNTIME_TO_STAGING_DECISION.md` |
| الدليل البصري للشاشات | `roadmap/08_VISUAL_EVIDENCE_PROTOCOL.md` |
| الأمن والحماية من الاختراق | `roadmap/09_SECURITY_AND_GUARDS_PROTOCOL.md` |
| البرامج والإضافات ومتى تثبت | `roadmap/10_PROGRAMS_AND_EXTENSIONS_BY_PHASE.md` |
| الأسرار والمزودين وPlatform/Vars | `roadmap/11_PROVIDER_VARS_AND_SECRETS_POLICY.md` |
| هيكل dsh/backend و dsh/domain | `roadmap/12_DSH_BACKEND_DOMAIN_TARGET_STRUCTURE.md` |
| الخطوات التنفيذية التالية | `roadmap/13_NEXT_ACTION_SEQUENCE.md` |

---

## 4. قاعدة 100% العملية

لا يوجد ضمان رياضي أن الخطأ لا يمكن أن يحدث أبدًا. الضمان العملي المعتمد هنا هو:

```text
لا نسمح بقبول أي شريحة إلا إذا مرّت 100% من الحراس المطلوبة لها.
```

أي:

```text
100% Gate-based acceptance
وليس
100% استحالة وجود خطأ.
```

---

## 5. المسار المختصر من الآن

```text
1. إصلاح DSH docs drift.
2. إنشاء Visual Evidence Ledger فعلي.
3. جرد كل الشاشات والرحلات والـ CTAs والـ states.
4. تصنيف Giant Screens.
5. اختيار أول DSH slice آمن.
6. ملء Slice Coverage Manifest.
7. بعد الدليل فقط: Screen/API Candidate.
8. بعد ذلك فقط: OpenAPI endpoint واحد.
9. بعد ذلك فقط: typed client + binding.
10. بعد ذلك فقط: Docker + PostgreSQL local + Go handler.
11. Runtime proof محلي حقيقي.
12. إغلاق L7 للشريحة فقط.
13. تكرار الشرائح.
```

---

## 6. ممنوعات الآن

```text
لا backend عميق الآن.
لا DB schema الآن.
لا ملء dsh.openapi.yaml الآن.
لا auth.* لكل خدمة.
لا Cloud/Atlas/Production الآن.
لا binding فوق شاشة Giant غير محسومة.
لا WLT mutation داخل DSH.
لا أسرار داخل frontend.
لا PASS بدون Evidence Pack.
```

---

## 7. ملفات الجرد الرقمية

- `evidence/FORENSIC_FILE_INVENTORY.csv`
- `evidence/FORENSIC_FOLDER_INVENTORY.csv`
- `evidence/MARKDOWN_TABLE_ROW_INVENTORY.csv`
- `evidence/DSH_GIANT_SCREEN_RISK_MATRIX.csv`
- `evidence/OPENAPI_CONTRACT_INVENTORY.csv`
- `evidence/GUARD_SCRIPT_INVENTORY.csv`
- `evidence/RISK_REGISTER.csv`

---

## 8. Cross-Surface Journey Slice Model

### تعريف الشريحة الإلزامي

```text
Slice = cross-surface business/operational journey from start to finish.

A slice is NOT:
  - a single screen
  - a surface row in a matrix
  - a single actor surface
  - a matrix row treated as a standalone deliverable

A slice IS:
  Actor Chain + Operation Chain + Multi-Surface Journey + Evidence + Business Outcome
```

كل شريحة يجب أن:
- تحدد business outcome مكتملًا عبر كل الأسطح المرتبطة.
- تصنّف كل سطح مذكور: primary / supporting / dependency / excluded / blocked / deferred.
- توثق أي نقص في شاشة/عملية/CTA/state كـ REQUIRED_ADDITION أو BLOCKED_WITH_REASON.
- لا تُغلق صامتةً بدون حل كل REQUIRED_ADDITION أو تصنيفه بسبب موثق.

### client-checkout — تصحيح إلزامي

```text
client-checkout remains a future cross-surface WLT/Auth/payment slice,
not the immediate next safe slice.
Status: FUTURE_BLOCKED_BY_WLT_AUTH_PAYMENT

لا يجوز معاملة client-checkout كالشريحة الثانية الآمنة المباشرة.
```

### DSH-SLICE-002 — الشريحة الثانية المقترحة

```text
Slice ID:       DSH-SLICE-002-CATALOG-READINESS-CLIENT-VISIBILITY
Status:         PROPOSED_NEXT_SLICE

Primary Outcome:
  Partner/catalog readiness becomes safely visible to client.

Surfaces:
  primary      → app-partner inventory/catalog
  supporting   → control-panel catalog governance
  supporting   → control-panel marketing visibility
  supporting   → app-client visibility consumption
  dependency   → shared DSH data/visibility/serviceability model

Excluded:
  cart                  — belongs to checkout slice
  checkout              — FUTURE_BLOCKED_BY_WLT_AUTH_PAYMENT
  WLT/payment           — future slice
  refund                — future slice
  settlement            — future slice
  captain delivery      — future delivery execution slice
  field visits          — future field readiness slice
  support escalation    — future lifecycle/support slice

Pre-conditions before any implementation:
  □ slice manifest complete (all Cross-Surface Journey Model fields)
  □ cross-surface impact map
  □ screen inventory per surface
  □ CTA/state inventory per surface
  □ data ownership map
  □ API/runtime readiness decision
  □ WLT/Auth/Vars classification per surface
  □ visual evidence plan per surface
  □ missing-process detection section
```

### Slice Sequence (مبدئي — قابل للتحديث بالدليل)

| Slice | Status |
|---|---|
| DSH-SLICE-001-STORE-DISCOVERY | L7_CLOSED (closes client discovery edge only) |
| DSH-SLICE-002-CATALOG-READINESS-CLIENT-VISIBILITY | PROPOSED_NEXT_SLICE |
| Future checkout/payment cross-surface slice | FUTURE_BLOCKED_BY_WLT_AUTH_PAYMENT |
| Future lifecycle/support cross-surface slice | FUTURE_NEEDS_CROSS_SURFACE_PROOF |
| Future delivery execution cross-surface slice | FUTURE_NEEDS_CAPTAIN_PARTNER_CLIENT_CONTROL_PANEL_PROOF |
| Future field readiness cross-surface slice | FUTURE_NEEDS_FIELD_CONTROL_PANEL_PARTNER_PROOF |

المصدر الرسمي لهذه المصفوفة: `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md` — Initial Editable Cross-Surface Slice Matrix.

---

## 9. Future Guard Requirements (توثيق — لا تنفيذ الآن)

الحراس التالية يجب إضافتها في مرحلة لاحقة (لا تُنفَّذ الآن):

```text
GUARD: slice without supporting surfaces classified → BLOCKED
GUARD: slice without data ownership documented → BLOCKED
GUARD: slice without WLT/Auth/Vars classification → BLOCKED
GUARD: slice without visual/runtime evidence mapping → BLOCKED
GUARD: surface row treated as standalone slice → BLOCKED
GUARD: L7_CLOSED at file header while other rows are pending without MIXED status → BLOCKED
GUARD: missing REQUIRED_ADDITION section at closure attempt → BLOCKED
GUARD: unclassified excluded/deferred/blocked surface at closure → BLOCKED
GUARD: client-checkout treated as immediate next safe slice → BLOCKED
GUARD: new slice starts without cross-surface impact map → BLOCKED
```

هذه الحراس موثقة فقط — تُضاف للـ guards عند بدء DSH-SLICE-002 أو ما بعدها.
