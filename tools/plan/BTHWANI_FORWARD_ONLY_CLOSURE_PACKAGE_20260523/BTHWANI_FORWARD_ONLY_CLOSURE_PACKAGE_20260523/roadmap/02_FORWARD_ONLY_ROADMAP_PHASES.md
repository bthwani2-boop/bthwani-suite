# 02 — Forward-Only Roadmap Phases

## المبدأ

التقدم للأمام لا يعني عدم وجود rollback عند كارثة. معناه:

```text
لا ننتقل إلى خطوة جديدة قبل أن تنجح خطوة اليوم بدليل.
```

## Phase 0 — Reality Lock

**الغرض:** تثبيت الواقع قبل التنفيذ.

**المدخلات:**
- snapshot
- Git status
- inventories
- current branch
- file size scan
- guards catalog

**المخرجات:**
- file inventory
- folder inventory
- table row inventory
- risk register
- current state decision

**القرار المطلوب:** `REALITY_LOCKED`

---

## Phase 1 — DSH Docs Drift Fix

**الغرض:** إصلاح تناقضات مستندات DSH.

**المهام:**
- إصلاح `dsh/docs/command.md` ليصبح branch-neutral.
- تحويل `DSH_VISUAL_REVIEW.md` من template إلى ledger فعلي.
- إصلاح أي أمر `diff ---check`.
- إضافة/تحديث ملفات matrix اللازمة دون لمس source code.

**الممنوع:**
- لا UI source changes.
- لا API.
- لا backend.

**القرار المطلوب:** `DOCS_BASELINE_READY`

---

## Phase 2 — Visual + Flow Closure Sweep

**الغرض:** إثبات الشاشات والرحلات بصريًا.

**الأسطح المطلوبة:**
- app-client
- app-partner
- app-captain
- app-field
- control-panel
- WLT/Auth فقط عند وجود علاقة حقيقية

**المخرجات:**
- screenshots
- RTL notes
- state coverage
- overflow/clipping notes
- visual decision per screen

**القرار المطلوب:** `VISUAL_PROVEN_FOR_SELECTED_SLICE`

---

## Phase 3 — Giant Screen Decision

**الغرض:** منع binding فوق ملفات ضخمة غير محسومة.

**القرارات المسموحة:**
- `SPLIT_NOW_BEFORE_BINDING`
- `GIANT_REFACTOR_LATER_NO_BINDING_INSIDE`
- `KEEP_WITH_REASON_AND_MONITOR`

**المخرجات:**
- `DSH_GIANT_SCREEN_RISK_MATRIX.csv`
- decision log

---

## Phase 4 — First Safe Slice Selection

**المرشح المفضل:**

```text
DSH Store Discovery / Store Visibility
```

**لماذا؟**
- لا يبدأ بالماليات.
- لا يصطدم مباشرة بـ WLT.
- يمكن إثباته عبر app-client + control-panel.
- مناسب لأول local runtime.

---

## Phase 5 — Screen/API Candidate

**الغرض:** معرفة endpoint المرشح بدون كتابته بعد.

**مطلوب:**
- actor
- surface
- screen
- CTA
- request/response
- states
- auth
- WLT boundary
- data minimization

**القرار المطلوب:** `READY_FOR_ONE_OPENAPI_ENDPOINT`

---

## Phase 6 — One OpenAPI Endpoint

**الغرض:** كتابة عقد واحد فقط.

**الممنوع:**
- لا endpoints batch.
- لا auth مكرر لكل خدمة.
- لا WLT semantics داخل DSH.

**القرار المطلوب:** `OPENAPI_ENDPOINT_VALIDATED`

---

## Phase 7 — Typed Client + Binding

**الغرض:** الشاشة لا تستدعي API مباشرة.

**السلسلة:**

```text
Screen
→ binding hook
→ typed client
→ OpenAPI endpoint
→ backend later
```

**القرار المطلوب:** `BINDING_CONNECTED_FOR_SLICE`

---

## Phase 8 — Local Runtime

**الغرض:** تحويل المحلي من preview إلى runtime حقيقي.

**المكونات:**
- Docker
- PostgreSQL local
- Go backend local
- Postman evidence
- app-client/control-panel proof
- logs
- screenshots

**القرار المطلوب:** `LOCAL_RUNTIME_PROVEN_FOR_SLICE`

---

## Phase 9 — L7 Slice Closure

**الغرض:** إغلاق الشريحة فقط.

**المطلوب:**
- L0 inventory
- L1 visual
- L2 flow
- L3 binding
- L4 runtime
- L5 ops if applicable
- L6 guards/evidence
- L7 decision

**القرار:** `DSH_SLICE_L7_CLOSED`

---

## Phase 10 — Repeat

بعد 2–3 شرائح محلية ناجحة، نناقش Staging. لا Cloud بعد أول شريحة.
