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
DSH-SLICE-001-STORE-DISCOVERY (L7_CLOSED)
```

**لماذا؟**
- لا يبدأ بالماليات.
- لا يصطدم مباشرة بـ WLT.
- يمكن إثباته عبر app-client + control-panel.
- مناسب لأول local runtime.

**Cross-Surface Journey Requirement (إلزامي لكل شريحة قبل الاختيار):**

قبل اختيار أي شريحة، يجب:

1. تعداد كل الأسطح المرتبطة بالرحلة التجارية (وليس مجرد السطح الأساسي).
2. تصنيف كل سطح كـ:
   - `primary` — يملك رحلة المستخدم الرئيسية في هذه الشريحة
   - `supporting` — يشارك في الرحلة لكن لا يملكها
   - `dependency` — يجب إثباته قبل إغلاق الشريحة
   - `excluded` — خارج النطاق صراحةً (السبب إلزامي)
   - `blocked` — لا يمكن تصنيفه الآن (السبب إلزامي)
   - `deferred` — مؤجل لشريحة لاحقة (الشريحة المستهدفة إلزامية)
3. توثيق أي شاشة/عملية/CTA/state/owner ناقصة كـ `REQUIRED_ADDITION` أو `BLOCKED_WITH_REASON` قبل تأكيد اختيار الشريحة.

**تحذير: client-checkout ليس الشريحة الثانية الآمنة المباشرة.**

```text
client-checkout remains a future cross-surface WLT/Auth/payment slice,
not the immediate next safe slice.
Status: FUTURE_BLOCKED_BY_WLT_AUTH_PAYMENT
```

**الشريحة الثانية المقترحة:**

```text
DSH-SLICE-002-CATALOG-READINESS-CLIENT-VISIBILITY
Status: PROPOSED_NEXT_SLICE
Outcome: Partner/catalog readiness becomes safely visible to client.
Surfaces: app-partner inventory/catalog; control-panel catalog governance;
          control-panel marketing visibility; app-client visibility consumption;
          shared DSH data/visibility/serviceability model.
Excluded: cart; checkout; WLT/payment; refund; settlement;
          captain delivery; field visits; support escalation.
Pre-conditions before any implementation:
  - slice manifest complete
  - cross-surface impact map
  - screen inventory
  - CTA/state inventory
  - data ownership map
  - API/runtime readiness decision
  - WLT/Auth/Vars classification
  - visual evidence plan
  - missing-process detection section
```

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
