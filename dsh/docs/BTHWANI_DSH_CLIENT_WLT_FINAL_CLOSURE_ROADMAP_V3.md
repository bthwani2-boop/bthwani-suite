# BThwani DSH + WLT App-Client Final Closure Roadmap V3

**Status:** `AUTHORITATIVE_LIVING_ROADMAP / HUMAN_CONTROLLED / NO_BIG_RESTRUCTURE_NOW`  
**Repo:** `C:\bthwani-suite`  
**GitHub branch context:** `ghb/0135-20260513-031814-retry-dsh-missing-screens-implem`  
**Primary scope:** `dsh/frontend/app-client/**` + `wlt/frontend/app-client/dsh/**` + `wlt/frontend/shared/finance/**`  
**Related scope:** `app-client shell/composition` + `app-partner` + `app-captain` + `app-field` + `control-panel` visibility  
**Purpose:** خارطة إغلاق نهائي متدرجة، دقيقة، قابلة للتحديث، تمنع التهور، تمنع التسويف، وتحمي التصميم الحالي من التدمير أو التشظي.

---

## 0. Executive Decision

هذه الخطة لا تطلب إعادة تنظيم شاملة الآن.

القرار الحاكم:

```text
لا نعيد هيكلة dsh/frontend/app-client الآن.
لا ننشئ tree واسع مثل sections/discovery أو sections/checkout أو sheets الآن.
لا نضيف شاشات جديدة الآن.
لا نحذف أو ننقل أو نعيد تسمية ملفات الآن.
نبدأ بتشخيص عميق قابل للقياس، ثم قرار بشري، ثم APPLY صغير جدًا عند وجود دليل.
```

السبب: الوضع الحالي لا يحتاج “تنظيفًا شكليًا” بقدر ما يحتاج كشف الحقيقة التشغيلية:

```text
ما الموجود؟
ما القابل للوصول فعليًا؟
من يملك كل قدرة؟
هل هي route أو section أو sheet أو state أو service entry؟
ما علاقته بـ WLT؟
ما تأثيره على app-partner/app-captain/app-field/control-panel؟
هل التصميم الحالي مقبول بصريًا أم يحتاج مراجعة؟
```

---

## 1. Non-Negotiable Rules

### 1.1 Human-Controlled Execution

- لا ينفذ الوكيل كل الخطة دفعة واحدة.
- لا ينتقل الوكيل من مرحلة إلى مرحلة إلا بطلب صريح من الإنسان.
- أي مرحلة تشخيصية تنتهي بتقرير ومصفوفات، لا بتعديل.
- أي APPLY يجب أن يكون صغيرًا، محدودًا، قابلًا للمراجعة، ومصحوبًا بأدلة.
- لا يوجد `CLOSED` أو `100%` قبل evidence + verification + human review عند الحاجة.

### 1.2 No Big Restructure Now

ممنوع حاليًا:

```text
sections/discovery/
sections/order-intake/
sections/checkout/
sections/active-order/
sheets/
```

كمشروع إعادة تنظيم شامل.

هذا التنظيم يمكن أن يصبح مفيدًا لاحقًا فقط إذا أثبت التشخيص أن ملفًا محددًا أصبح عائقًا حقيقيًا للإغلاق، وبشرط أن يتم الاستخراج داخليًا تدريجيًا، دون تغيير التصميم أو الرحلة.

### 1.3 No Blind Merge / No Blind Scatter

ممنوع:

- دمج كل شيء داخل شاشة واحدة حتى تصبح 3000+ سطر.
- تحويل كل capability بسيطة إلى screen/route مستقل.
- إنشاء routes فقط لأن docs ذكرت screen/part.
- إضافة شاشة إجبارية جديدة تزيد النقرات.
- حذف أو نقل ملفات تحت شعار “تنظيف”.
- تغيير ui-kit.
- تغيير package/config.
- تغيير runtime/API/backend/WLT implementation.
- استخدام `git add -A`.
- إدخال `tools/registry/runs` في commit.

---

## 2. Scope Reality

تطبيق العميل المرتبط بـ DSH/WLT ليس “رحلة توصيل مطعم فقط”. هو سطح عميل يحتوي عدة مجالات:

| المجال | المعنى | أمثلة |
|---|---|---|
| App Surface | واجهة العميل المضيفة | `DshClientSurface.tsx`, shell/composition |
| DSH Delivery | المتاجر، المنتجات، السلة، الطلب، التتبع | Home, Store, Cart, Tracking |
| Special Intake Modes | أنماط طلب ليست متجرًا عاديًا | Awnak, Shein/شيء إن, proxy/manual order |
| WLT Integration | المحفظة، الدفع، الرصيد، الاسترداد، finance event | `wlt/frontend/app-client/dsh/**`, `wlt/frontend/shared/finance/**` |
| Active Order Optional Capabilities | قدرات اختيارية داخل الطلب النشط | captain messaging, support, rating, refund, proof |
| Related Surfaces | بقية أطراف الخدمة | partner, captain, field, control-panel |

لذلك لا يجوز اختزال كل شيء في “4 صفحات فقط” كقاعدة عمياء. الصياغة الصحيحة:

```text
الرحلة الأساسية يجب أن تكون قصيرة وواضحة.
القدرات غير القياسية يجب تصنيفها بدقة: route / section / sheet / state / service entry.
```

---

## 3. Ownership Model

### 3.1 DSH Ownership

DSH يملك سياق الطلب والتوصيل:

- discovery للمتاجر/الفئات داخل سياق DSH.
- store/products.
- cart as order context.
- order lifecycle.
- tracking.
- support داخل سياق الطلب.
- captain contact preference / messaging داخل سياق الطلب.
- rating كـ feedback على الطلب/الكابتن/التجربة.

### 3.2 WLT Ownership

WLT يملك الدفع والمحفظة والتسوية:

- wallet linking/preview.
- wallet balance.
- payment method semantics.
- finance event kind.
- refund/wallet visibility.
- settlement/accounting لاحقًا.

DSH لا يملك الدفع الحقيقي ولا ledger ولا settlement.

قاعدة الربط:

```text
DSH may render WLT-owned payment/wallet preview inside checkout context.
WLT remains the owner of financial meaning and future runtime.
```

### 3.3 Awnak / Shein Ownership Classification

Awnak وShein ليستا بالضرورة store/product journey عادية.

تصنيفهما الافتراضي:

```text
Special Intake Modes
```

ولا يتم تحويلهما إلى routes مستقلة إلا إذا أثبت التشخيص أنها تحتاج ذلك دون إطالة الرحلة أو تكرارها.

---

## 4. Current Known Risk Areas

هذه ليست أحكام إغلاق، بل نقاط تحتاج إثبات عبر Matrix:

| المنطقة | الخطر |
|---|---|
| `DshClientSurface.tsx` | قد يكون source of truth الفعلي مختلفًا عن route catalog |
| `dsh-client.routes.ts` | قد يحتوي routes catalog-only |
| `dsh-client.types.ts` | قد لا يطابق routes/registry الجديدة |
| `dsh-client.screen-registry.ts` | قد يسجل screens غير reachable |
| `HomeScreen.tsx` | يحتوي discovery + services + Awnak + Shein + marketing وقد يكون overgrown |
| `CartScreen.tsx` | يحتوي cart + checkout + WLT preview + scheduling + notes وقد يكون overgrown |
| `OrdersTrackingScreens.tsx` | يحتوي tracking + chat + support + rating + refund/proof وقد يكون overgrown |
| `DshCheckoutIntentScreen.tsx` | قد يكون route مكرر أو غير مستخدم فعليًا |
| `DshRatingScreen.tsx` | قد يكون route مكرر إذا rating موجود داخل tracking |
| `OperationScreens.tsx` | يحتوي workspaces ثانوية قد تُستخدم بدل ظهور UX واضح داخل active order |
| WLT bridge | يجب تثبيت أنه owner مالي ولا يوجد leakage إلى DSH |
| control-panel | يجب فحص visibility المطلوبة لكل قرار في العميل |

---

## 5. Closure Strategy

### 5.1 What We Will Not Do Now

- لا نعيد تنظيم كامل.
- لا ننشئ folders جديدة واسعة.
- لا نزيد عدد routes.
- لا نضيف screens.
- لا نفكك الملفات الكبيرة قبل visual review.
- لا نغير علاقة DSH/WLT.
- لا ننفذ ربط الأسطح دفعة واحدة.

### 5.2 What We Will Do First

ننتج خريطة تشخيص عميقة:

1. Capability Ownership Matrix.
2. Route Truth Matrix.
3. Host Reachability Matrix.
4. WLT Boundary Matrix.
5. Related Surface Impact Matrix.
6. File Size / Decomposition Risk Matrix.
7. Visual Review Queue.
8. Human Direction Board.

بعدها فقط يقرر الإنسان ما هو APPLY التالي.

---

## 6. Required Evidence Run

قبل أي APPLY جديد يجب إنشاء evidence run باسم:

```text
APP_CLIENT_DSH_WLT_DEEP_CLOSURE_MAP-YYYYMMDD-HHMMSS
```

ويحفظ داخله:

```text
CLIENT_DSH_WLT_CAPABILITY_OWNERSHIP_MATRIX.csv
CLIENT_ROUTE_TRUTH_MATRIX.csv
CLIENT_HOST_REACHABILITY_MATRIX.csv
CLIENT_WLT_BOUNDARY_MATRIX.csv
DSH_RELATED_SURFACE_IMPACT_MATRIX.csv
CLIENT_DSH_FILE_SIZE_RISK_MATRIX.csv
CLIENT_DSH_VISUAL_REVIEW_QUEUE.csv
CLIENT_HUMAN_DIRECTION_BOARD.md
SUMMARY.md
evidence.json
git-status.txt
git-diff-check.txt
SESSION_ID.zip
```

لا يقوم هذا run بأي تعديل.

---

## 7. Matrix Specifications

### 7.1 CLIENT_DSH_WLT_CAPABILITY_OWNERSHIP_MATRIX.csv

الأعمدة:

```text
capability
domain
owner_kind
owner_id
linked_service_id
current_files
current_route_or_entry
current_screenId
host_reachable_true_false
primary_secondary_special_optional
recommended_classification
risk_level
decision
reason
```

القيم الممكنة لـ `recommended_classification`:

```text
route
section
sheet
state
service_entry
integration_bridge
catalog_only
defer
needs_manual_review
```

القدرات الإلزامية للفحص:

```text
home discovery
service launcher
store discovery
store details
product list
product details
favorites
search
notifications
benefits/subscription
Awnak intake
Shein intake
proxy/manual order
cart
cart details
checkout intent
payment choice
WLT wallet preview
WLT balance preview
COD
mixed payment
official wallets
order creation preview
order confirmation
orders list
tracking
captain messaging
support issue
rating
refund visibility
wallet credit visibility
proof visibility
reorder
retry/recovery
offline state
error state
blocked state
preferences
service settings
```

### 7.2 CLIENT_ROUTE_TRUTH_MATRIX.csv

الأعمدة:

```text
route_or_legacy_route
declared_in_dsh_client_routes
declared_in_dsh_client_types
declared_in_screen_registry
ownerPath
imported_in_DshClientSurface
rendered_in_DshClientSurface
reachable_from_primary_flow
reachable_from_secondary_action
status
issue
recommended_action
```

القيم الممكنة لـ `status`:

```text
ACTIVE
SECONDARY_ACTIVE
CATALOG_ONLY
REGISTRY_ONLY
TYPE_ONLY
DEAD
NEEDS_REVIEW
```

### 7.3 CLIENT_HOST_REACHABILITY_MATRIX.csv

الأعمدة:

```text
entry_point
trigger
from_screen
target_route_or_component
target_file
requires_user_tap
mandatory_or_optional
happy_path_true_false
reachable_true_false
tap_risk
notes
```

يجب فحص:

- Home → Store.
- Home → Awnak.
- Home → Shein.
- Home → WLT service entry.
- Store → Products.
- Products → Cart.
- Cart → Checkout/payment decision.
- Cart → Order creation/tracking.
- Tracking → captain messaging.
- Tracking → support.
- Delivered → rating.
- Failed/refund → WLT/refund visibility.

### 7.4 CLIENT_WLT_BOUNDARY_MATRIX.csv

الأعمدة:

```text
file
usage
wlt_owned_true_false
dsh_owned_true_false
preview_only_true_false
contract_tbd_true_false
financial_runtime_present_true_false
ledger_or_settlement_leak_true_false
wording_risk
decision
```

يجب فحص:

```text
wlt/frontend/app-client/dsh/**
wlt/frontend/shared/finance/**
dsh/frontend/app-client/screens/CartScreen.tsx
dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx
dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx
dsh/frontend/app-client/contracts/**
```

### 7.5 DSH_RELATED_SURFACE_IMPACT_MATRIX.csv

الأعمدة:

```text
surface
capability
client_decision_dependency
current_file_or_area
must_match_client_true_false
control_panel_visibility_needed_true_false
wlt_visibility_needed_true_false
risk_if_not_aligned
next_action
```

الأسطح الإلزامية:

```text
app-client
app-partner
app-captain
app-field
control-panel
wlt/frontend/app-client/dsh
wlt/frontend/shared/finance
```

### 7.6 CLIENT_DSH_FILE_SIZE_RISK_MATRIX.csv

الأعمدة:

```text
file
line_count
role
responsibility_count
risk_level
visual_change_allowed_false
can_split_without_visual_change_true_false
recommended_next
```

القيم:

```text
NO_SPLIT_NOW
PLAN_ONLY
EXTRACT_ONE_SECTION_LATER
NEEDS_MANUAL_REVIEW
```

### 7.7 CLIENT_DSH_VISUAL_REVIEW_QUEUE.csv

الأعمدة:

```text
priority
screen_or_flow
current_status
device_or_surface
what_to_check
related_capabilities
blocking_issues
human_next_action
```

### 7.8 CLIENT_HUMAN_DIRECTION_BOARD.md

يجب أن يحتوي جدولًا مثل:

| Capability | Current Evidence | Proposed Classification | Risk | Human Decision |
|---|---|---|---|---|
| CheckoutIntent | TBD | Route / Section / Defer | TBD | [ ] |
| Rating | TBD | Sheet / Card / Route / Defer | TBD | [ ] |
| Awnak | TBD | Inline / Service Entry / Route / Defer | TBD | [ ] |
| Shein | TBD | Inline / Service Entry / Route / Defer | TBD | [ ] |
| Captain Messaging | TBD | Active order section / sheet / route | TBD | [ ] |
| Support Issue | TBD | Sheet / operation workspace / section | TBD | [ ] |
| WLT Payment Preview | TBD | WLT-owned bridge inside checkout | TBD | [ ] |
| Control Panel Visibility | TBD | Needed / Not now / Blocked | TBD | [ ] |

---

## 8. Phased Closure Plan

### Phase 0 — Freeze + Baseline

**Mode:** Read-only  
**Goal:** تثبيت نقطة البداية.

Tasks:

- [ ] Confirm branch.
- [ ] Confirm HEAD.
- [ ] `git --no-pager status --short`
- [ ] `git --no-pager diff --check`
- [ ] Identify intentional dirty items only.
- [ ] Confirm latest pushed commit.
- [ ] Create evidence ZIP.

Exit decision:

```text
BASELINE_READY
```

---

### Phase 1 — Deep App-client DSH/WLT Map

**Mode:** Read-only  
**Goal:** فهم كل ما في app-client مرتبط بـ DSH/WLT.

Tasks:

- [ ] Build Capability Ownership Matrix.
- [ ] Build Route Truth Matrix.
- [ ] Build Host Reachability Matrix.
- [ ] Build WLT Boundary Matrix.
- [ ] Build File Size Risk Matrix.
- [ ] Build Visual Review Queue.
- [ ] Build Human Direction Board.
- [ ] No APPLY.

Exit decision:

```text
CAPABILITY_MAP_READY
```

---

### Phase 2 — Related Surfaces + Control Panel Impact Map

**Mode:** Read-only  
**Goal:** لا نغلق العميل بمعزل عن بقية الأسطح.

Tasks:

- [ ] Map app-partner impact.
- [ ] Map app-captain impact.
- [ ] Map app-field impact.
- [ ] Map control-panel visibility.
- [ ] Map WLT finance/control visibility.
- [ ] Identify blockers.
- [ ] No APPLY.

Exit decision:

```text
RELATED_SURFACES_MAP_READY
```

---

### Phase 3 — Human Direction Board Review

**Mode:** Human decision only  
**Goal:** الإنسان يقرر التصنيف قبل أي تعديل.

Allowed decisions per capability:

```text
KEEP_CURRENT
MAKE_SECTION_LATER
MAKE_SHEET_LATER
KEEP_ROUTE
MARK_CATALOG_ONLY
DEFER
NEEDS_VISUAL_REVIEW
BLOCKED
```

Exit decision:

```text
HUMAN_DIRECTION_APPROVED
```

---

### Phase 4 — Small APPLY 1: Truth Consistency Only

**Mode:** Small apply if approved  
**Goal:** تصحيح التناقضات الصغيرة بدون تغيير تصميم.

Allowed:

- [ ] Type union consistency.
- [ ] Route catalog status correction.
- [ ] Registry status correction.
- [ ] WLT wording clarification.
- [ ] No visual change.
- [ ] No route increase.
- [ ] No file moves.

Verification:

- [ ] `git --no-pager diff --check`
- [ ] `pnpm -w exec tsc --noEmit`
- [ ] changed files are only approved.

Exit decision:

```text
TRUTH_CONSISTENCY_FIXED
```

---

### Phase 5 — Human Visual Review: Current Design

**Mode:** Human-led  
**Goal:** مراجعة التصميم الحالي قبل refactor.

Review list:

- [ ] Home/service launcher.
- [ ] Awnak.
- [ ] Shein.
- [ ] Search/favorites/benefits.
- [ ] Store.
- [ ] Store items.
- [ ] Cart.
- [ ] Cart details.
- [ ] WLT payment preview.
- [ ] Orders list.
- [ ] Tracking.
- [ ] Captain messaging.
- [ ] Support issue.
- [ ] Rating.
- [ ] Wallet/refund/proof visibility.

Exit decision:

```text
VISUAL_PASS
VISUAL_FIX_REQUIRED
NEEDS_SCREENSHOT_EVIDENCE
```

---

### Phase 6 — Small APPLY 2: Visual Fixes Only

**Mode:** One flow/screen at a time  
**Goal:** إصلاح تصميمي بدون إعادة تنظيم.

Rules:

- [ ] One screen or one flow only.
- [ ] No route changes.
- [ ] No file moves.
- [ ] No WLT ownership changes.
- [ ] No backend/runtime.
- [ ] No broad refactor.

Exit decision:

```text
VISUAL_FIX_COMMITTED
```

---

### Phase 7 — Decomposition Plan Only

**Mode:** Planning only  
**Goal:** إذا بقيت ملفات ضخمة تعيق الإغلاق، نخطط لاستخراج داخلي.

For each overgrown file:

```text
file
line_count
current responsibilities
visual_lock_required
candidate_extractions
risk
recommended_order
human approval required
```

Exit decision:

```text
DECOMPOSITION_PLAN_READY
```

---

### Phase 8 — Small APPLY 3: Internal Extraction Only

**Mode:** One extraction per commit  
**Goal:** تفكيك داخلي بلا تغيير UX.

Allowed:

- [ ] Extract one section/part only.
- [ ] Preserve same visual output.
- [ ] Preserve same props behavior.
- [ ] Preserve route.
- [ ] Preserve WLT boundary.
- [ ] No UI-kit changes.
- [ ] No runtime/API.

Exit decision:

```text
INTERNAL_EXTRACTION_PASS
```

---

### Phase 9 — Surface Alignment

**Mode:** Review/apply per surface  
**Goal:** ضمان أن قرارات العميل لا تكسر بقية DSH.

Tasks:

- [ ] Align partner impact.
- [ ] Align captain impact.
- [ ] Align field impact.
- [ ] Align control-panel visibility.
- [ ] Align WLT finance visibility.
- [ ] No mass change.

Exit decision:

```text
SURFACES_ALIGNED
```

---

### Phase 10 — Final Closure Gate

**Mode:** Final verification  
**Goal:** إغلاق نهائي بالأدلة.

Required:

- [ ] Route truth clean.
- [ ] Host reachability clean.
- [ ] WLT boundary clean.
- [ ] Visual review done.
- [ ] Related surfaces reviewed.
- [ ] Control-panel visibility reviewed.
- [ ] `git --no-pager diff --check` pass.
- [ ] `pnpm -w exec tsc --noEmit` pass.
- [ ] evidence ZIP.
- [ ] commit/push verified if code changed.

Exit decision:

```text
APP_CLIENT_DSH_WLT_FINAL_CLOSURE_PASS
```

---

## 9. Living ToDo

### Diagnosis

- [ ] Capability Ownership Matrix.
- [ ] Route Truth Matrix.
- [ ] Host Reachability Matrix.
- [ ] WLT Boundary Matrix.
- [ ] Related Surface Impact Matrix.
- [ ] File Size Risk Matrix.
- [ ] Visual Review Queue.
- [ ] Human Direction Board.

### App-client

- [ ] Home/service launcher.
- [ ] Awnak.
- [ ] Shein.
- [ ] Search.
- [ ] Favorites.
- [ ] Benefits/subscription.
- [ ] Store/products.
- [ ] Cart/checkout.
- [ ] CartDetails.
- [ ] WLT payment preview.
- [ ] Orders list.
- [ ] Tracking.
- [ ] Captain messaging.
- [ ] Support issue.
- [ ] Rating.
- [ ] Refund/wallet/proof visibility.
- [ ] Preferences/service settings.

### WLT

- [ ] Bridge exports.
- [ ] Payment preview.
- [ ] Wallet preview.
- [ ] Finance event kind.
- [ ] CONTRACT_TBD wording.
- [ ] No DSH accounting leakage.
- [ ] Refund/wallet visibility ownership.

### Related Surfaces

- [ ] app-partner.
- [ ] app-captain.
- [ ] app-field.
- [ ] control-panel.
- [ ] WLT finance/control visibility.

### Execution

- [ ] Human approves phase.
- [ ] One small APPLY only.
- [ ] Evidence ZIP.
- [ ] diff check.
- [ ] tsc.
- [ ] commit/push verified if changed.

---

## 10. Agent Rules

Any agent must obey:

```text
Do not implement the whole roadmap.
Do not move to the next phase without human instruction.
Do not create broad folder structures.
Do not refactor before matrices.
Do not refactor before human visual review.
Do not add screens unless explicitly approved.
Do not add routes unless route truth requires it and human approves.
Do not change WLT ownership.
Do not ignore Awnak/Shein.
Do not ignore related surfaces/control-panel.
Do not use git add -A.
Do not commit evidence.
Do not claim CLOSED without final gate evidence.
```

---

## 11. Change Log

Append after every phase:

```text
- YYYY-MM-DD HH:mm
  phase:
  decision:
  evidence:
  commit:
  next:
```

---

## 12. Final Direction

```text
ابدأ بالتشخيص، لا التنظيم.
ابدأ بالملكية والربط والوصول، لا بإضافة شاشات.
احمِ التصميم الحالي قبل أي refactor.
افصل DSH عن WLT ownership.
صنّف Awnak/Shein كأنماط طلب خاصة.
راجع الأسطح الأخرى ولوحة التحكم.
نفذ خطوة واحدة فقط عند كل طلب بشري.
أغلق نهائيًا بالأدلة فقط.
```
