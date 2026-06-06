# BThwani DSH + WLT App-Client Final Closure Roadmap V3

Status: HISTORICAL_APP_CLIENT_WLT_REFERENCE

Current use:

- historical app-client + WLT boundary context only
- not the master DSH closure sequence
- current service decisions come from `dsh/docs/DSH_UNIFIED_CLOSURE_MATRIX.md`, `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`, `dsh/docs/DSH_VISUAL_REVIEW.md`, and `tools/plan/BTHWANI_FORWARD_ONLY_CLOSURE_PACKAGE_20260523/**`

Status: ACTIVE_LIVING_ROADMAP / P0_14_TRUTH_REFRESHED
Repo: C:\bthwani-suite
Primary scope: `dsh/frontend/app-client/**` + `wlt/frontend/app-client/dsh/**`
Related scope: `dsh/frontend/shared/**` + control-panel finance visibility

## Current Reality After P0-02 Through P0-14

- app-client discovery, storefront, cart, tracking, and support surfaces are route-proven and screen-proven.
- Cross-surface marketing visibility now resolves through a shared contract instead of scattered local checks.
- Frontend noise blockers in the targeted `dsh/frontend` slice were reduced in P0-13 without changing service ownership.
- Closure truth now distinguishes `preview-ready`, `needs-visual-evidence`, and `blocked-by-wlt` instead of older coarse statuses.
- Checkout, payment, refunds, and all money semantics remain WLT-owned.

## Completed Frontend Closure Work

- route and screen registry coverage across app-client, app-partner, app-captain, and app-field
- cross-surface actor-flow alignment for partner, captain, and field slices
- shared marketing visibility and commercial rendering guards
- final `dsh/frontend` sweep for RTL, token, performance, and noise blockers
- P0-14 closure-truth refresh across live registries and lean docs

## Still Blocked

- trusted current-branch screenshots across all five DSH surfaces

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
wlt/frontend/control-panel/dsh
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
