# DSH Slice 001 — Full Human-Gated Cross-Surface Re-Closure Command

**Purpose:** أمر تنفيذ مرحلي صارم لإعادة إغلاق `DSH-SLICE-001` كرحلة متعددة الأسطح مع بوابات موافقة بشرية بين المراحل.

**Target repo:** `C:\bthwani-suite`

**Mode:** Human-gated, evidence-first, no GitHub write.

---

## الأمر الجاهز للنسخ إلى VS Code Copilot Chat

```text
نفّذ داخل C:\bthwani-suite فقط وعلى الفرع الحالي.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
ممنوع GitHub write: لا commit، لا push، لا PR، لا merge.

المهمة:
DSH — Full Human-Gated Re-Closure of DSH-SLICE-001 as a true Cross-Surface Journey Slice.

الهدف:
إغلاق كل ما يتعلق بالشريحة الأولى DSH-SLICE-001 إغلاقًا حقيقيًا Gate-based 100% عبر كل الأسطح المتعددة المرتبطة بها، وليس إغلاق app-client فقط.

تعريف الإغلاق المقبول:
لا يجوز إعلان SLICE_001_CROSS_SURFACE_RE_CLOSED إلا إذا تم إثبات الرحلة كاملة عبر:
- app-client discovery/storefront visibility consumption
- app-partner inventory/catalog readiness source
- control-panel catalog governance
- control-panel marketing visibility
- shared DSH data/visibility/serviceability model
- Platform/Vars/provider policy classification
- Auth/permission boundary
- WLT exclusion boundary
- notification/account/profile/cart/checkout/tracking/support/captain/field boundaries
- visual evidence
- runtime/API/data ownership evidence
- rollback/disable path
- no unresolved REQUIRED_ADDITION
- all verification guards passed

مبدأ الموافقة البشرية الإلزامي:
ممنوع الانتقال من أي مرحلة إلى المرحلة التالية بدون توقف صريح وطلب موافقة الإنسان.

في نهاية كل مرحلة يجب أن تخرج فقط:
- ما تم فحصه
- ما تم اكتشافه
- هل يوجد تعديل مقترح
- المخاطر
- قرار المرحلة المقترح
- ثم توقف بعبارة:
  HUMAN_APPROVAL_REQUIRED_TO_CONTINUE_PHASE_X

لا تنفذ المرحلة التالية حتى يوافق الإنسان صراحة بعبارة:
APPROVED_PHASE_X_CONTINUE

ممنوع:
- لا تبدأ APPLY قبل موافقة الإنسان.
- لا تعدّل frontend/backend/API/OpenAPI/runtime قبل مرحلة مخصصة وموافقة صريحة.
- لا تغيّر Status/Decision/L7_CLOSED إلا بعد Phase مخصصة وموافقة صريحة.
- لا تخلط التوثيق مع تنفيذ runtime.
- لا تعتبر app-client runtime proof كافيًا لإغلاق cross-surface journey.
- لا تقدم PASS/CLOSED/100% بدون evidence.
- لا تنتقل للشريحة الثانية.
- لا تفتح WLT/payment/refund/settlement كتنفيذ إلا إذا ثبت أنه مطلوب لهذه الشريحة وبموافقة منفصلة.
- لا تنشئ ملفات كثيرة أو متشعبة.
- لا تغيّر أي ملف خارج نطاق المرحلة الموافق عليها.

النطاق العام المبدئي للفحص:
- dsh/docs/**
- dsh/frontend/app-client/**
- dsh/frontend/app-partner/**
- dsh/frontend/control-panel/**
- dsh/frontend/data/**
- dsh/frontend/shared/**
- tools/plan/BTHWANI_FORWARD_ONLY_CLOSURE_PACKAGE_20260523/**
- packages/surfaces/** عند الحاجة للفحص فقط
- packages/ui-kit/** للفحص فقط عند وجود UI/component ownership issue

ملاحظة:
أي توسيع إلى backend / OpenAPI / DB / runtime implementation يحتاج موافقة بشرية منفصلة بعد إثبات الحاجة.

==============================
PHASE 0 — READ-ONLY REALITY INVENTORY
==============================

نفّذ فحصًا read-only فقط. لا تعدّل أي ملف.

افحص وسجّل بالأدلة:
1. الوضع الحالي لـ DSH-SLICE-001:
   - هل هي L7_CLOSED؟
   - هل الإغلاق الحالي edge-only أم cross-surface؟
   - هل يوجد نص يقول discovery edge فقط؟
   - هل توجد dependencies مؤجلة؟

2. الأسطح والحدود المطلوبة للشريحة الأولى:
   - app-client
   - app-partner
   - control-panel catalog governance
   - control-panel marketing visibility
   - shared DSH visibility/serviceability model
   - dsh/frontend/data
   - Platform/Vars/provider policy
   - Auth/permission
   - WLT
   - Notifications
   - Account/Profile
   - Cart/Checkout
   - Tracking/Support
   - Captain delivery
   - Field readiness/visits

3. لكل سطح/حد:
   - هل هو primary / supporting / dependency / excluded / blocked / deferred؟
   - أين الدليل؟
   - هل يوجد proof فعلي أم مجرد preview/docs؟
   - هل توجد شاشة ناقصة؟
   - هل توجد CTA ناقصة؟
   - هل توجد state ناقصة؟
   - هل توجد data ownership gap؟
   - هل توجد runtime/API gap؟
   - هل توجد visual evidence gap؟
   - هل توجد operation gap؟

4. افحص:
   - dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md
   - dsh/docs/slices/DSH-SLICE-001-STORE-DISCOVERY.md
   - dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md
   - dsh/docs/SCREEN_API_MATRIX.md
   - dsh/docs/RUNTIME_EVIDENCE_MATRIX.md
   - dsh/docs/DSH_VISUAL_REVIEW.md
   - dsh/docs/README.md
   - tools/plan/BTHWANI_FORWARD_ONLY_CLOSURE_PACKAGE_20260523/**

5. افحص code ownership فقط بدون تعديل:
   - app-client discovery/storefront files
   - app-partner inventory/catalog files
   - control-panel catalog/marketing files
   - shared visibility/serviceability logic
   - dsh/frontend/data
   - any registry that defines routes/screens/flows for those surfaces

مخرجات Phase 0:
- files scanned count
- surfaces found
- screens found
- CTAs found
- states found
- data owners found
- missing proof list
- contradiction list
- هل Slice 001 الحالية edge-only؟
- هل يمكن إغلاقها cross-surface الآن بدون تنفيذ؟
- recommended next phase:
  A) docs correction only
  B) docs + frontend/UI flow implementation needed
  C) docs + runtime/API implementation needed
  D) blocked due to missing architecture decision

ثم توقف:
HUMAN_APPROVAL_REQUIRED_TO_CONTINUE_PHASE_1

==============================
PHASE 1 — HUMAN-APPROVED SLICE 001 TARGET MODEL
==============================

لا تبدأ هذه المرحلة إلا بعد موافقة الإنسان:
APPROVED_PHASE_0_CONTINUE

في هذه المرحلة لا تعدّل code. عدّل docs فقط إذا وافق الإنسان.

أنشئ/حدّث نموذج الشريحة الأولى داخل:
dsh/docs/slices/DSH-SLICE-001-STORE-DISCOVERY.md

التعريف الجديد:
DSH-SLICE-001 = Store Discovery & Client Visibility Readiness Journey

Business outcome:
Client can discover only stores/catalogs that are ready, governed, visible, serviceable, and allowed by platform/provider policy.

يجب أن تحتوي الشريحة الأولى على الجداول التالية:

1. Cross-Surface Surface Classification Matrix
الأعمدة:
- Surface/System
- Classification
- Role in Slice 001
- Required Proof
- Current Proof Status
- Missing Proof
- Owner
- Decision

2. Operation Chain Matrix
الأعمدة:
- Step
- Actor
- Surface
- Operation
- Input
- Output
- Data Owner
- Required State
- Required CTA
- Evidence Required
- Decision

3. Screen/CTA/State Inventory Matrix
الأعمدة:
- Surface
- Screen
- Route
- CTA
- Target
- Required States
- Current Evidence
- Missing Evidence
- Decision

4. Data Ownership Matrix
الأعمدة:
- Data Entity
- Canonical Owner
- Preview Owner
- Surface Consumers
- Duplication Risk
- Runtime/API Truth Status
- On-Demand Retrieval Rule
- Decision

5. Boundary Matrix
الأعمدة:
- Boundary
- Status
- Why Included/Excluded
- Required Proof
- Current Proof
- Decision

يجب أن تشمل Boundary Matrix:
- WLT
- Auth/Permission
- Vars/Provider
- Notifications
- Account/Profile
- Cart/Checkout
- Tracking/Support
- Captain Delivery
- Field Readiness
- Control Panel Operations
- Control Panel Finance

6. Missing Logic/Screen/Process Proposal Matrix
الأعمدة:
- Gap ID
- Gap Type
- Related Surface
- Description
- Required Addition
- Blocker Reason
- Target Phase
- Human Approval Needed
- Decision

Status rule:
إذا كانت الأدلة الحالية تثبت app-client فقط:
- لا تكتب أن Slice 001 cross-surface closed.
- اكتب:
  Historical Status: L7_CLOSED for app-client discovery edge only.
  Current Cross-Surface Decision: FULL_CROSS_SURFACE_REOPENED_FOR_PROOF.

إذا ثبتت كل الأسطح المطلوبة فعليًا:
- فقط عندها يمكن اقتراح:
  Status: SLICE_001_CROSS_SURFACE_L7_CLOSED
  Decision: SLICE_001_CROSS_SURFACE_RE_CLOSED

مخرجات Phase 1:
- changed docs only
- هل تغير status؟
- هل تغير معنى L7_CLOSED؟
- ما الأسطح المصنفة؟
- ما النواقص؟
- هل توجد مراحل implementation مطلوبة؟

ثم توقف:
HUMAN_APPROVAL_REQUIRED_TO_CONTINUE_PHASE_2

==============================
PHASE 2 — HUMAN-APPROVED CROSS-SURFACE DOC ALIGNMENT
==============================

لا تبدأ إلا بعد:
APPROVED_PHASE_1_CONTINUE

عدّل docs alignment فقط.

حدّث:
- dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md
- dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md
- dsh/docs/SCREEN_API_MATRIX.md
- dsh/docs/RUNTIME_EVIDENCE_MATRIX.md
- dsh/docs/DSH_VISUAL_REVIEW.md
- dsh/docs/README.md
- tools/plan/BTHWANI_FORWARD_ONLY_CLOSURE_PACKAGE_20260523/**

القواعد:
1. app-client discovery row لا يغلق وحده Slice 001 كاملة.
2. DSH-RUN-P014-01 يثبت app-client runtime فقط، لا يثبت partner/control-panel/Vars readiness.
3. GET /stores لا يكفي لإغلاق cross-surface Slice 001 إذا governance/visibility/provider proof ناقص.
4. visual pass لapp-client لا يساوي visual pass للشريحة كاملة.
5. partner-catalog/control-panel catalog/marketing يجب ربطها بـ Slice 001 إذا قررنا أن Slice 001 = full Store Discovery & Visibility Readiness.
6. إذا أصبحت DSH-SLICE-002 متداخلة مع Slice 001، يجب إعادة تعريفها بدون تكرار:
   - إما DSH-SLICE-002 = deeper catalog management beyond visibility
   - أو DSH-SLICE-002 = removed/superseded by Slice 001 extension
   لكن ممنوع ترك overlap أو contradiction.
7. client-checkout يبقى future WLT/Auth/payment slice وليس الشريحة التالية.

مخرجات Phase 2:
- changed files
- conflicts removed
- هل DSH-SLICE-002 تغير معناها؟
- هل بقي أي row = slice؟
- هل بقي أي L7_CLOSED يوحي بإغلاق كل DSH؟
- required implementation phases

ثم توقف:
HUMAN_APPROVAL_REQUIRED_TO_CONTINUE_PHASE_3

==============================
PHASE 3 — HUMAN-APPROVED IMPLEMENTATION NEEDS DECISION
==============================

لا تبدأ إلا بعد:
APPROVED_PHASE_2_CONTINUE

هذه مرحلة قرار، لا تعدّل code.

حدد بدقة هل إغلاق Slice 001 cross-surface يحتاج تنفيذ فعلي في:
- app-partner inventory/catalog
- control-panel catalog governance
- control-panel marketing visibility
- shared DSH visibility/serviceability model
- dsh/frontend/data
- Platform/Vars preview/control visibility
- runtime/API proof
- visual screenshots
- guards

لكل عنصر:
- هل الموجود كافٍ؟
- هل النقص docs فقط؟
- هل النقص UI/flow؟
- هل النقص data model؟
- هل النقص runtime/API؟
- هل النقص control-panel governance؟
- هل النقص visual evidence؟
- هل النقص guard؟

مخرجات Phase 3:
- Implementation Required: YES/NO
- implementation scope proposal
- exact files likely to change
- forbidden files
- risk level
- rollback strategy
- verification commands
- human decision requested:
  A) تنفيذ docs فقط
  B) تنفيذ UI/flow فقط
  C) تنفيذ data/shared visibility فقط
  D) تنفيذ runtime/API لاحقًا
  E) block and redesign

ثم توقف:
HUMAN_APPROVAL_REQUIRED_TO_CONTINUE_PHASE_4

==============================
PHASE 4 — HUMAN-APPROVED APPLY IMPLEMENTATION
==============================

لا تبدأ إلا بعد موافقة إنسانية صريحة تحدد نوع التنفيذ:
APPROVED_PHASE_3_APPLY_<A/B/C/D/E>

نفّذ فقط النوع الموافق عليه.

إذا كانت الموافقة docs فقط:
- عدّل docs فقط.

إذا كانت الموافقة UI/flow:
- عدّل فقط الملفات المطلوبة للشريحة الأولى.
- لا تنشئ design system محلي.
- التزم بـ @bthwani/ui-kit public exports.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر ضمن النطاق فقط.
- أي reusable/repeatable design يجب أن يكون في @bthwani/ui-kit إذا كان موجودًا، ولا تضف UI-kit file جديد إلا إذا كان ضروريًا وموافقًا عليه.

إذا كانت الموافقة data/shared visibility:
- لا تضخم البيانات.
- التزم بخيار الاستدعاء: references/IDs/lean summaries/lazy loading/pagination/caching.
- لا تكرر customers/products/categories/orders بين الأسطح.
- dsh/frontend/data هو preview owner فقط وليس runtime truth.
- shared visibility/serviceability model يجب أن يكون SSoT منطقيًا داخل DSH.

إذا كانت الموافقة runtime/API:
- توقف قبل التنفيذ واطلب موافقة إضافية؛ لأن هذه مرحلة عالية الخطورة.
- لا تضف endpoint أو OpenAPI أو backend بدون موافقة مستقلة.

ممنوع أثناء Phase 4:
- تعديل خارج النطاق الموافق.
- refactor واسع.
- حذف/نقل ملفات بدون موافقة.
- تغيير dependencies أو lockfile.
- إسكات أخطاء guards.
- claim PASS.

مخرجات Phase 4:
- changed files
- why each file changed
- evidence
- remaining gaps
- rollback path

ثم توقف:
HUMAN_APPROVAL_REQUIRED_TO_CONTINUE_PHASE_5

==============================
PHASE 5 — HUMAN-APPROVED VISUAL/RUNTIME EVIDENCE CAPTURE PLAN
==============================

لا تبدأ إلا بعد:
APPROVED_PHASE_4_CONTINUE

لا تدّعِ visual/runtime closure بدون evidence.

جهّز خطة التقاط أدلة لكل سطح داخل Slice 001:
- app-client
- app-partner catalog
- control-panel catalog governance
- control-panel marketing visibility
- shared visibility/serviceability model evidence
- Vars/provider classification evidence

لكل سطح:
- screen
- route
- state
- CTA
- screenshot required
- runtime action required
- expected result
- log/evidence path
- owner

إذا لا يمكن التقاط evidence الآن:
- وثّقها REQUIRED_ADDITION أو BLOCKED_WITH_REASON.
- لا تغلق الشريحة.

ثم توقف:
HUMAN_APPROVAL_REQUIRED_TO_CONTINUE_PHASE_6

==============================
PHASE 6 — VERIFICATION GATES
==============================

لا تبدأ إلا بعد:
APPROVED_PHASE_5_CONTINUE

شغّل:
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run guard:service-blueprint
pnpm run guard:secret-scan
pnpm run guard:binding-proof

إذا كان هناك UI/frontend change، شغّل أيضًا أي guard متعلق بـ ui-kit/import/design إذا كان موجودًا في package scripts.

إذا كان هناك runtime/API/backend change، لا تكمل قبل تشغيل guards/tests الخاصة بها وتوثيقها.

أي فشل = لا PASS.

ثم توقف:
HUMAN_APPROVAL_REQUIRED_TO_CONTINUE_PHASE_7

==============================
PHASE 7 — FINAL HUMAN-GATED CLOSURE DECISION
==============================

لا تبدأ إلا بعد:
APPROVED_PHASE_6_CONTINUE

راجع كل الأدلة وليس الادعاءات.

ممنوع إخراج SLICE_001_CROSS_SURFACE_RE_CLOSED إذا:
- أي سطح مطلوب غير مصنف.
- أي required screen ناقصة.
- أي CTA ناقصة.
- أي required state ناقصة.
- أي data owner غير واضح.
- أي Vars/provider boundary غير مصنف.
- أي Auth/WLT/notification/account boundary غير مصنف.
- partner catalog readiness غير مثبتة.
- control-panel catalog governance غير مثبت.
- control-panel marketing visibility غير مثبت.
- app-client runtime proof مستخدم كدليل كافٍ لإغلاق كل الشريحة.
- visual evidence لأي سطح مطلوب ناقصة.
- runtime/API proof المطلوب ناقص.
- REQUIRED_ADDITION غير محلول.
- CHECK/guard فشل.
- تغير ملف خارج النطاق.
- بقي overlap أو تناقض بين Slice 001 و Slice 002.
- بقي client-checkout كشريحة ثانية مباشرة.

القرارات النهائية المسموحة فقط:
- SLICE_001_CROSS_SURFACE_RE_CLOSED
- SLICE_001_EDGE_ONLY_REOPENED_FOR_CROSS_SURFACE_PROOF
- FIX_REQUIRED_SLICE_001_CROSS_SURFACE_REBUILD
- BLOCKED_SLICE_001_CONTRADICTION_FOUND
- NEEDS_HUMAN_EVIDENCE_SLICE_001

التقرير النهائي يجب أن يحتوي:
1. files scanned
2. files changed
3. surfaces classified
4. screens/CTAs/states covered
5. data ownership result
6. boundary classification result
7. visual evidence result
8. runtime/API evidence result
9. remaining REQUIRED_ADDITION count
10. guard results
11. final decision
```
