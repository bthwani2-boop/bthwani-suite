# DSH Global Platform Control Closure — أمر الإغلاق المنطقي/التقني/التشغيلي قبل المراجعة البصرية

> **Target Repo:** `C:\bthwani-suite`
> **Active Scope:** `dsh/frontend` + روابطه اللازمة داخل `wlt/frontend` للعرض المالي فقط
> **Execution Type:** UI/UX/Flow + operational-control preview closure
> **Runtime/API/Backend:** خارج النطاق، ولا يجوز ادعاء جاهزيته
> **Final Target:** `DSH_UIUX_FLOW_LOGIC = READY_FOR_HUMAN_VISUAL_REVIEW`
> **Human Visual Review:** لاحقًا بواسطة المالك البشري فقط
> **Finance Truth:** `WLT_ONLY`
> **Core Principle:** المنظومة تعمل تحت مظلة واحدة متكاملة، بلا تناقض، بلا تشتت، بلا تكرار، بلا فجوات منطقية أو تشغيلية.

---

## 0. الحكم الحالي الذي يبنى عليه هذا الأمر

الحالة الحالية بعد آخر تنفيذ ورفع إلى GitHub:

```text
DSH_LOGIC_STATUS = FIX_REQUIRED
DSH_UIUX_FLOW_STATUS = ADVANCED_BUT_NOT_GLOBAL_PLATFORM_READY
NEXT_TARGET = DSH_GLOBAL_PLATFORM_CONTROL_CLOSURE
VISUAL_REVIEW = NOT_YET
```

التحسن المثبت:
- `status: 'closed' = 0`
- `pending-ui-gap = 0`
- `direct Tamagui imports = 0`
- `console.log = 0`
- `actual raw color hex = 0`
- تم تعزيز SSoT / lifecycle / delivery modes / partner activation / product identity / signal layer.

المتبقي ليس مراجعة شكلية فقط. المتبقي هو إغلاق طبقات التحكم العالمية التي تجعل المنصة قابلة للتشغيل على مستوى عالمي:
- Assisted Order Desk.
- Customer 360.
- Order Rescue.
- Manual Call Intake بدون ربط صوتي أو VoIP.
- Ops Intervention Playbooks.
- Support outcome taxonomy.
- Partner pause/deactivation/capacity/dispute.
- Catalog conflict/duplicate/bulk/publishing/substitution.
- Finance WLT visibility deep-links.
- Marketing eligibility/suppression/audit.
- Platform policy impact/provider degradation/fallback.
- Administration action-role-audit matrix.
- Orphan CTA / route / signal / state guard.
- Performance/noise split للملفات الضخمة بدون refactor بصري.

---

## 1. أمر التنفيذ العام — انسخه إلى Copilot/Agent

```text
نفّذ هذا الطلب تنفيذًا كاملًا وجذريًا من الألف إلى الياء، ولا تتوقف إلا بعد إغلاقه 100% بالأدلة داخل نطاق UI/UX/Flow والمنطق التشغيلي فقط، بصفر فجوات، صفر نقص، صفر تكرار، صفر أخطاء، وبدون الانتقال لأي مهمة أخرى.

المهمة:
DSH_GLOBAL_PLATFORM_CONTROL_CLOSURE

الهدف:
إغلاق كل الفجوات المنطقية والتقنية والتشغيلية المتبقية داخل DSH UI/UX/Flow حتى تصبح الحالة:
DSH_UIUX_FLOW_LOGIC = READY_FOR_HUMAN_VISUAL_REVIEW

النطاق الأساسي:
C:\bthwani-suite\dsh\frontend

النطاق المسموح عند الحاجة فقط:
C:\bthwani-suite\wlt\frontend
لاستخدام WLT read-only visibility فقط، بدون نقل أي money semantics إلى DSH.

ممنوع:
- تعديل backend/API/runtime/database.
- ادعاء runtime/API/backend readiness.
- ادعاء production readiness.
- تنفيذ VoIP أو CTI أو internet calling أو ربط صوت المكالمة بالمنصة.
- إدخال أي money truth داخل DSH.
- تعديل WLT إلا إذا كان رابط read-only أو preview contract موجودًا ويحتاج توصيلًا مرئيًا فقط.
- تعديل @bthwani/ui-kit أو إضافة ملفات ui-kit جديدة.
- إنشاء design system محلي داخل أي screen/surface.
- تضخيم الشاشات الكبيرة.
- نسخ datasets ضخمة إلى كل سطح.
- eager-loading لكل التفاصيل.
- ترك زر بلا route/action/fallback/audit.
- ترك signal بلا route.
- ترك route بلا screen.
- ترك screen بلا registry.
- ترك state بلا CTA أو blocked reason.
- استخدام أو ذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- إعلان CLOSED/PASS/100% للـ UI visual أو runtime بدون evidence.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

قواعد المظلة:
- BThwani منظومة واحدة، وليست تطبيقات منفصلة.
- أي flow يجب أن يربط app-client + app-partner + app-captain + app-field + control-panel + WLT read-only عند الحاجة.
- كل flow يجب أن يملك owner واضح، route واضح، state واضح، allowed/forbidden actions، fallback، signal، audit.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- reusable UI يأتي من @bthwani/ui-kit public exports فقط.
- Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui داخليًا داخل ui-kit فقط.
- خيار الاستدعاء إلزامي: summary first، IDs/references first، detail-on-open، evidence-on-open، chat-on-open، finance-preview-only.
```

---

## 2. تعريف الحالة النهائية المقبولة

بعد التنفيذ يجب أن تصبح الحالة:

```text
DSH_UIUX_FLOW_LOGIC = READY_FOR_HUMAN_VISUAL_REVIEW
DSH_GLOBAL_CONTROL = LOGICALLY_COMPLETE_PREVIEW
DSH_VISUAL_QUALITY = PENDING_HUMAN_REVIEW
DSH_RUNTIME_API_BACKEND = NOT_CLAIMED
DSH_FINANCE_TRUTH = WLT_ONLY
DSH_CALL_CENTER = MANUAL_CALL_INTAKE_ONLY
DSH_SURFACES = CONSISTENT_PREVIEW_FLOW
```

ولا يجوز أن تكون:

```text
CLOSED
PRODUCTION_READY
BACKEND_READY
RUNTIME_READY
FINANCE_OWNED_BY_DSH
VISUAL_PASS
```

---

## 3. المرحلة P0-00 — Evidence + Scope Lock

```text
نفّذ أولًا فحصًا سريعًا داخل C:\bthwani-suite.

المطلوب:
1. اقرأ الملفات ذات العلاقة داخل:
   - .agents
   - skills ذات العلاقة
   - dsh/frontend/shared
   - dsh/frontend/control-panel
   - dsh/frontend/app-client
   - dsh/frontend/app-partner
   - dsh/frontend/app-captain
   - dsh/frontend/app-field

2. لا تعتمد على dsh/docs كمصدر تنفيذ. استخدمها كمرجع ثانوي فقط إذا لزم.

3. احصر الوضع الحالي:
   - status: 'closed'
   - pending-ui-gap
   - needs-visual-evidence
   - blocked-by-wlt
   - blocked-by-contract
   - skeleton
   - placeholder/TODO/TBD/UNPROVEN
   - direct Tamagui imports
   - raw color hex
   - console.log
   - files > 400 lines
   - orphan route/signal/action indicators

4. اكتب baseline evidence داخل:
   tools\registry\runs\DSH_GLOBAL_PLATFORM_CONTROL_CLOSURE-{timestamp}

5. لا تعدل أي ملف قبل إنشاء baseline.

القبول:
- وجود baseline واضح.
- لا تنفيذ عشوائي.
- لا تعديل خارج النطاق.
```

---

## 4. المرحلة P0-01 — Operations Assisted Order Desk

### الهدف

إضافة منطق واجهة تشغيلية يسمح لموظف العمليات بإنشاء طلب نيابة عن العميل، بدون backend claim، وبدون خلط مالي، وبدون تكرار منطق checkout.

### النطاق

```text
dsh/frontend/control-panel/operations/
dsh/frontend/shared/
dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx  للقراءة أو ربط preview فقط عند الحاجة
dsh/frontend/shared/dsh-order-journey.model.ts
dsh/frontend/shared/dsh-delivery-mode.model.ts
dsh/frontend/shared/dsh-product-identity.model.ts
dsh/frontend/shared/dsh-signal-layer.model.ts
```

### المطلوب

أضف أو وحّد workspace باسم:

```text
AssistedOrderDesk
```

بحد أدنى:

```text
AssistedOrderDeskScreen.tsx
assisted-order.preview.ts
assisted-order.types.ts
```

وإذا كان الفصل ضروريًا بدون تضخيم:

```text
AssistedOrderCustomerLookupPanel.tsx
AssistedOrderCartBuilderPanel.tsx
AssistedOrderServiceabilityPanel.tsx
AssistedOrderWltHandoffPanel.tsx
AssistedOrderAuditPreviewPanel.tsx
```

### must-have fields

```text
assistedOrderDraftId
createdByOperatorId
customerLookupMode: phone | customerId | orderId | ticketId
matchedCustomerId
matchedOrderId?
reasonForAssistedOrder
customerConsentStatus
selectedStoreId
selectedItems
deliveryMode
serviceabilityStatus
wltPaymentVisibilityStatus
wltPaymentMethodLabel
orderDraftStatus
auditRequired = true
linkedCallSessionId?
linkedTicketId?
```

### rules

```text
1. لا يتم إنشاء طلب حقيقي.
2. لا يتم خصم/تحصيل/تعديل مالي داخل DSH.
3. كل payment/COD/wallet/payment-link يظهر read-only من WLT.
4. المنتجات يجب أن تكون published/client_visible فقط.
5. المتجر يجب أن يكون client_visible فقط.
6. delivery mode يجب أن يستخدم dsh-delivery-mode.model.
7. كل عملية assisted order تحتاج audit.
8. يجب أن يمكن ربطها بتذكرة دعم أو Manual Call Intake.
9. يجب إنتاج signal للعميل/الشريك/العمليات عند preview creation.
10. لا eager loading؛ lookup يعرض summary فقط والتفاصيل عند الفتح.
```

### registry

أضف workspace داخل operations registry:

```text
id: assisted-order-desk
label: الطلبات بالنيابة
badge: تدخل
description: إنشاء/تجهيز طلب نيابة عن العميل داخل operations preview مع WLT read-only handoff.
```

### acceptance

```text
- يظهر Assisted Order Desk في operations.
- يمكن البحث عن العميل.
- يمكن بناء cart preview.
- يمكن اختيار delivery mode.
- يظهر WLT read-only handoff.
- auditRequired واضح.
- لا يوجد backend/runtime claim.
```

---

## 5. المرحلة P0-02 — Customer 360

### الهدف

إضافة سجل عميل شامل داخل لوحة التحكم بحيث لا يضطر موظف الدعم/العمليات إلى التنقل بين شاشات متفرقة.

### النطاق

```text
dsh/frontend/control-panel/operations/
dsh/frontend/control-panel/support/
dsh/frontend/shared/
```

### المطلوب

أضف workspace باسم:

```text
Customer360Workspace
```

أو شاشة مركبة:

```text
Customer360Workspace.tsx
customer-360.preview.ts
customer-360.types.ts
```

### panels المطلوبة

```text
CustomerIdentitySummaryPanel
CustomerActiveOrderPanel
CustomerOrdersHistoryPanel
CustomerSupportHistoryPanel
CustomerRefundVisibilityPanel
CustomerAddressServiceabilityPanel
CustomerRiskSignalsPanel
CustomerNotesTimelinePanel
```

### filters

```text
customer phone
customer id
order id
ticket id
store
date range
delivery mode
payment status from WLT
refund status from WLT
ticket status
area / zone
failed deliveries
cancelled orders
high-risk customer flags
```

### data policy

```text
1. summary first.
2. آخر 5 طلبات فقط في البداية.
3. تفاصيل الطلب عند الفتح.
4. التذاكر summary فقط حتى تفتح.
5. WLT visibility read-only.
6. لا عرض بيانات حساسة قبل identity verification إذا جاء من call intake.
```

### quick actions

```text
open active order
open latest ticket
create ticket
open assisted order
open order rescue
open WLT visibility
add internal note
```

### acceptance

```text
- موظف الدعم/العمليات يرى من هو العميل.
- يرى هل لديه طلب نشط.
- يرى آخر 5 طلبات.
- يرى آخر التذاكر.
- يرى آخر refund visibility من WLT.
- يرى آخر عنوان/serviceability.
- يستطيع فتح طلب/تذكرة/Assisted Order/Order Rescue.
```

---

## 6. المرحلة P0-03 — Manual Call Intake بدون VoIP/CTI

### القرار المعماري

```text
الاتصال لا يدخل المنصة.
سياق الاتصال يدخل المنصة.
```

ممنوع تنفيذ:
```text
VoIP
CTI
incoming call popup
call recording
internet calling
automatic caller ID
```

### الهدف

دعم مكالمات العملاء الخارجية يدويًا داخل لوحة التحكم عبر إدخال رقم الطلب/الجوال/العميل/التذكرة.

### النطاق

```text
dsh/frontend/control-panel/support/
dsh/frontend/control-panel/operations/
dsh/frontend/shared/
```

### المطلوب

أضف:

```text
CallIntakeCard.tsx
CallIntakeLookupPanel.tsx
CallIntakeResultPanel.tsx
CallIntakeActionPanel.tsx
call-intake.preview.ts
call-intake.types.ts
```

أو نفذها في شاشة واحدة إذا كان ذلك أخف، بشرط عدم التضخيم.

### fields

```text
callSessionId
source = external_phone_manual
createdByOperator
createdAt
callerPhone
enteredOrderId
enteredCustomerId
enteredTicketId
matchedCustomerId
matchedOrderId
identityVerificationStatus
callReason
callPriority
linkedTicketId
linkedSupportFlow
linkedOperationFlow
transferTarget
outcome
followUpRequired
auditRequired
operatorNote
```

### lookup modes

```text
orderId
phone
customerId
ticketId
```

### identity verification

قبل عرض التفاصيل الحساسة:

```text
verify phone
verify customer name
verify latest order marker
verify address hint
```

### quick actions

```text
open order
create ticket
link to existing ticket
open Customer 360
open Assisted Order
open Order Rescue
open WLT visibility read-only
transfer context to operations
add internal note
close call session with outcome
```

### call outcome taxonomy

```text
resolved
ticket_created
transferred_to_operations
assisted_order_started
order_rescue_started
wlt_visibility_opened
needs_follow_up
invalid_or_unknown_caller
duplicate_call
```

### acceptance

```text
- لا يوجد أي ادعاء ربط صوتي.
- يتم إدخال رقم الطلب/الجوال يدويًا.
- تظهر بطاقة سياق المكالمة.
- يمكن إنشاء تذكرة من المكالمة.
- يمكن تحويل السياق للعمليات.
- auditRequired واضح لكل call session مرتبط بطلب.
```

---

## 7. المرحلة P0-04 — Order Rescue Workspace

### الهدف

مساحة إنقاذ الطلب قبل فشله.

### النطاق

```text
dsh/frontend/control-panel/operations/
dsh/frontend/shared/dsh-order-journey.model.ts
dsh/frontend/shared/dsh-delivery-mode.model.ts
dsh/frontend/shared/operations-support.preview.ts
dsh/frontend/shared/dsh-signal-layer.model.ts
```

### المطلوب

أضف:

```text
OrderRescueWorkspace.tsx
order-rescue.preview.ts
order-rescue.types.ts
```

### rescue scenarios

```text
address_change_before_assignment
delivery_mode_change_before_assignment
item_unavailable
store_closed_after_order
customer_not_reachable
captain_no_show
captain_declined
pickup_failed
handoff_mismatch
delivery_failed
payment_failed
refund_pending_wlt
```

### allowed actions

```text
open support ticket
request customer confirmation
remove unavailable item
suggest replacement
wait partner
switch to pickup preview
switch to partner_delivery preview
manual reassignment
mark support_exception
open WLT visibility
cancel order preview
```

### forbidden actions

```text
financial refund mutation
captain payout mutation
settlement mutation
direct backend order mutation
silent cancellation
rescue without audit
```

### acceptance

```text
- كل rescue scenario له owner/action/fallback/audit.
- كل action حساس له reasonRequired.
- كل WLT impact read-only.
- كل انتقال ينتج signal.
```

---

## 8. المرحلة P0-05 — Ops Intervention Playbooks

### الهدف

تحويل العمليات من مراقبة فقط إلى تحكم عالمي منظّم.

### النطاق

```text
dsh/frontend/control-panel/operations/
dsh/frontend/shared/
```

### المطلوب

أضف model:

```text
ops-intervention-playbook.model.ts
```

أو داخل shared owner مناسب إن وجد.

### fields

```text
playbookId
trigger
affectedSurface
affectedActor
allowedActions
forbiddenActions
requiredEvidence
reasonRequired
auditRequired
wltBoundary
customerNotification
partnerNotification
captainNotification
supportTicketRequired
rollbackPreview
nextBestAction
```

### playbooks

```text
late_order
item_unavailable
partner_delay
captain_unavailable
customer_not_reachable
store_closed_after_order
delivery_failed
payment_failed
refund_visibility_request
area_capacity_pressure
provider_degraded
manual_reassignment
```

### acceptance

```text
- Command Center يعرض next best action.
- Exceptions تستخدم playbooks.
- Support escalation يستخدم نفس playbook.
- كل playbook له owner وaudit.
```

---

## 9. المرحلة P0-06 — Support Taxonomy + Quick Actions

### الهدف

تحويل الدعم من queue فقط إلى نظام حل واضح.

### النطاق

```text
dsh/frontend/control-panel/support/
dsh/frontend/shared/operations-support.preview.ts
dsh/frontend/shared/dsh-signal-layer.model.ts
dsh/frontend/control-panel/operations/
```

### issue taxonomy

```text
late_order
missing_item
wrong_item
payment_refund_visibility
delivery_failed
captain_behavior
partner_behavior
app_issue
catalog_issue
address_issue
customer_not_reachable
```

### support outcomes

```text
resolved
escalated_to_operations
escalated_to_partner
escalated_to_captain
wlt_visibility_requested
refund_visibility_opened
order_rescue_started
assisted_order_started
follow_up_required
closed_duplicate
```

### quick actions

```text
open order
open Customer 360
open Order Rescue
create follow-up task
message partner
message captain
transfer to operations
open WLT visibility
open evidence
close with outcome
```

### acceptance

```text
- لا توجد تذكرة بلا issue category.
- لا توجد تذكرة بلا outcome path.
- quick actions مربوطة route/action.
- finance actions read-only.
```

---

## 10. المرحلة P0-07 — Partner Control Completion

### الهدف

إكمال تحكم الشركاء عالميًا.

### المطلوب

أضف/وحّد:

```text
PartnerPerformanceReviewWorkspace
PartnerSuspensionImpactPanel
PartnerCapacityCalendarPanel
PartnerTemporaryClosurePanel
PartnerPreparationSlaHistoryPanel
PartnerDisputeAppealPanel
PartnerVisibilityTimelinePanel
```

### rules

```text
1. app-partner لا يفعّل نفسه.
2. control-panel يقرر activation/deactivation/suspension.
3. temporary closure ينعكس على app-client visibility.
4. capacity calendar ينعكس على delivery availability.
5. partner dispute/appeal له support/audit.
6. visibility timeline يشرح:
   why visible
   why hidden
   since when
   by whom
   affected surfaces
```

### acceptance

```text
- لا يوجد partner hidden/visible بلا سبب.
- لا deactivation بلا impact preview.
- لا pause orders بلا audit.
```

---

## 11. المرحلة P0-08 — Catalog Global Control

### الهدف

إغلاق الكتالوج بمنطق عالمي: bulk review، duplicate merge، barcode conflict، category lane، substitution policy.

### المطلوب

أضف/وحّد:

```text
BulkProductReviewQueue
DuplicateMergeWorkspace
BarcodeConflictResolver
CategoryMappingApprovalLane
ProductSubstitutionPolicyPanel
OutOfStockReplacementPolicyPanel
ProductMediaCompliancePanel
ProductClientVisibilityAuditPanel
```

### rules

```text
1. partner override لا ينشر للعميل بدون approval.
2. barcode conflict يحتاج resolver.
3. duplicate merge لا يحذف بدون audit.
4. product substitution يربط app-client + app-partner + support.
5. out-of-stock policy يربط cart/order rescue.
6. media compliance يربط marketing/catalog.
```

### acceptance

```text
- لا product visible بلا publishing gate.
- لا duplicate بلا review state.
- لا barcode conflict بلا route/action.
- substitution/replacement موجود كflow واضح.
```

---

## 12. المرحلة P0-09 — Finance WLT Visibility Completion

### الهدف

إكمال عرض WLT داخل DSH بدون امتلاك مالي.

### المطلوب

داخل DSH UI فقط:

```text
WltFinanceVisibilityLink
WltRefundVisibilityPanel
WltSettlementVisibilityPanel
WltPayoutVisibilityPanel
WltFinanceAuditReasonPanel
```

### states

```text
refund_requested
refund_approved_by_wlt
refund_rejected_by_wlt
refund_completed_by_wlt
settlement_pending
settlement_ready
payout_pending
payout_completed
```

### rules

```text
1. no DSH financial mutation.
2. open WLT source action فقط.
3. كل finance item يربط:
   order/customer/partner/captain عند الحاجة.
4. audit يشرح لماذا DSH لا يستطيع التعديل.
```

### acceptance

```text
- المالية داخل DSH read-only 100%.
- كل action مالي يفتح WLT visibility/source.
- لا refund/settlement/payout mutation داخل DSH.
```

---

## 13. المرحلة P0-10 — Marketing Global Eligibility + Audit

### الهدف

منع ظهور عروض/حملات مخالفة لحالة المتجر/المنتج/المنطقة.

### المطلوب

أضف/وحّد:

```text
CampaignEligibilityModel
OfferConflictResolver
CampaignSuppressionPanel
MarketingVisibilityAuditPanel
CustomerSegmentSummaryOnlyPanel
```

### rules

```text
1. لا campaign لمتجر غير client_visible.
2. لا product promo لمنتج غير published.
3. لا offer داخل منطقة غير serviceable.
4. store closed/out-of-zone suppresses campaign.
5. loyalty visibility لا يمتلك money truth.
6. customer segment summary-only.
7. audit: why shown / why hidden / approved by whom.
```

### acceptance

```text
- كل campaign/offer/banner/video له eligibility result.
- كل suppression له reason.
- كل approval/rejection يرسل signal/audit.
```

---

## 14. المرحلة P0-11 — Platform Policy / Vars / Provider Control Completion

### الهدف

إكمال المنصة كغرفة سياسة وتحكم آمن بدون runtime mutation.

### المطلوب

أضف/وحّد:

```text
PolicyImpactSimulator
RolloutBlastRadiusPreview
ProviderDegradationPanel
SafeFallbackPolicyPanel
VarsDependencyGraphPanel
```

### provider degradation states

```text
map_provider_down
payment_provider_degraded
notification_provider_delayed
search_provider_degraded
media_provider_degraded
```

### rules

```text
1. no live switching.
2. no env mutation.
3. preview + audit فقط.
4. كل var يوضح:
   affected surfaces
   affected flows
   rollback preview
   blast radius
   owner
   precedence
```

### acceptance

```text
- لا var بلا affected surfaces.
- لا rollout بلا blast radius.
- لا provider degradation بلا fallback.
```

---

## 15. المرحلة P0-12 — Administration / Audit Matrix

### الهدف

كل CTA حساس يجب أن يملك role/action/audit contract.

### المطلوب

أضف/وحّد:

```text
ActionRoleAuditMatrix
MakerCheckerPolicyModel
ReasonRequiredPolicy
EvidenceRequiredPolicy
AuditTimelineExportPreview
```

### sensitive actions

```text
assisted_order
order_rescue
manual_reassignment
partner_activation
partner_deactivation
partner_suspension
catalog_publish
duplicate_merge
barcode_conflict_resolve
refund_visibility_request
wlt_source_open
provider_degradation_fallback
vars_rollback_preview
support_escalation
ticket_closure
```

### fields

```text
actionId
section
allowedRoles
forbiddenRoles
makerCheckerRequired
reasonRequired
evidenceRequired
auditRequired
affectedSurfaces
wltBoundary
rollbackPreview
```

### acceptance

```text
- لا CTA حساس بلا role/audit.
- لا maker/checker مفقود للأفعال الحرجة.
- لا إغلاق تذكرة/قرار بلا reason عند الحساسية.
```

---

## 16. المرحلة P0-13 — Mobile App Logic Completion

### app-client

```text
1. سبب عدم توفر المتجر/المنتج واضح.
2. order created بعد WLT handoff بدون خلط مالي.
3. support داخل سياق الطلب فقط.
4. refund visibility read-only من WLT.
5. replacement/substitution flow عند item_unavailable.
6. customer order history داخل تجربة العميل.
7. notification deep links لكل event.
```

### app-partner

```text
1. item_unavailable flow:
   suggest replacement
   remove item
   wait customer
   escalate support
2. preparation delay reason.
3. store pause / temporarily stop accepting orders.
4. partner_delivery status.
5. handoff checklist.
6. dispute/appeal.
7. catalog conflict resolution.
```

### app-captain

```text
1. decline reason mandatory.
2. failed pickup reason.
3. failed delivery reason.
4. customer not reachable flow.
5. unsafe location / issue report.
6. PoD policy states.
7. no swipe-only action; كل gesture له button بديل.
```

### app-field

```text
1. field visit checklist كامل.
2. evidence quality score.
3. missing document reason.
4. re-visit scheduling.
5. field-to-partner-to-CP handoff timeline.
6. offline draft state.
7. location confidence state.
```

### acceptance

```text
- كل تطبيق يملك flow مكتمل منطقيًا.
- لا يوجد action بلا fallback.
- لا يوجد surface يناقض surface آخر.
```

---

## 17. المرحلة P0-14 — Orphan CTA / Signal / Route / State Guard

### الهدف

إضافة guard يمنع الفجوات الصامتة.

### المطلوب

أضف سكربت تحقق داخل tools أو مكان مناسب موجود:

```text
tools/registry/scripts/verify-dsh-global-control-closure.ps1
```

أو TS script إذا كان نمط الريبو يستخدم ذلك.

### checks

```text
1. signals without routeId.
2. signals without recipientSurface.
3. routes without registry.
4. screens without registry.
5. CTA label without action handler or route.
6. state without primaryAction/blocker/fallback.
7. sensitive action without auditRequired.
8. finance mutation wording inside DSH.
9. support ticket without category/outcome.
10. assisted order without audit.
11. order rescue without reason.
12. call intake without external_phone_manual source.
13. raw colors.
14. direct Tamagui imports outside ui-kit.
15. console.log.
16. pending-ui-gap.
17. status: 'closed'.
```

### output

```text
DSH_GLOBAL_CONTROL_GUARD_RESULT.json
DSH_GLOBAL_CONTROL_GUARD_REPORT.md
```

### acceptance

```text
- guard exists.
- guard can be run locally.
- guard reports PASS/WARN/FAIL.
- no fake PASS if checks fail.
```

---

## 18. المرحلة P0-15 — Performance / Noise Split بدون Refactor بصري

### الهدف

تخفيف الملفات الضخمة بدون تغيير التصميم.

### قواعد

```text
1. لا refactor بصري.
2. لا تغيير layout متعمد.
3. لا تقسيم عشوائي.
4. انقل فقط:
   models
   preview data
   action maps
   large static arrays
   helper mappers
   selector functions
5. اترك screen كcomposition.
6. اجعل التفاصيل on-demand.
7. لا تنشئ ui-kit files.
8. لا duplicate data.
```

### الملفات الأعلى خطرًا

```text
dsh/frontend/app-client/screens/StoreScreen.tsx
dsh/frontend/app-client/screens/CartScreen.tsx
dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx
dsh/frontend/app-client/screens/HomeScreen.tsx
dsh/frontend/app-captain/DshCaptainSurface.tsx
dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx
dsh/frontend/app-partner/screens/PartnerHubScreen.tsx
dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx
dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx
dsh/frontend/app-client/DshClientSurface.tsx
```

### acceptance

```text
- لا يزيد حجم أي ملف ضخم.
- preview data خارج render.
- arrays/static maps خارج component.
- no eager payload.
- no duplicated fixtures.
```

---

## 19. المرحلة P0-16 — Closure Map Update

### الهدف

تحديث `dshCrossSurfaceClosureMap.ts` والـ registries ليعكسا الحقيقة الجديدة بعد الإغلاق.

### المطلوب

كل flow يجب أن يحتوي:

```text
surfaceId
actor
area
domain
step
status
runtimeBindingStatus
title
description
routeHint
screenOwner
primaryAction
requiredStates
evidenceStatus
remainingBlocker
crossSurfaceDependencies
wltBoundary
visualEvidenceRequired
evidenceHint
routeProof
screenProof
stateCoverageProof
crossSurfaceProof
```

### الحالة النهائية المسموحة

```text
needs-visual-evidence
blocked-by-wlt
blocked-by-contract
```

ولا تستخدم:

```text
closed
pending-ui-gap
fake verified-ui-flow
```

إلا إذا توفرت screenshots وvisual evidence، وهذا خارج نطاق هذا التنفيذ.

### acceptance

```text
- pending-ui-gap = 0.
- status: 'closed' = 0.
- كل critical cross-surface proof موجود.
- كل remainingBlocker هو visual evidence أو WLT/backend contract فقط.
```

---

## 20. أوامر التحقق بعد كل مرحلة

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

إذا eslint/prettier متاحان في البيئة:

```powershell
pnpm -w exec eslint dsh/frontend --ext .ts,.tsx
pnpm -w exec prettier --check dsh/frontend
```

إذا فشل eslint/prettier بسبب البيئة أو عدم توفره:

```text
لا تدّع PASS.
اكتب BLOCKED_BY_ENV مع السبب.
```

---

## 21. أمر Evidence النهائي

بعد إنهاء كل المراحل:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$SessionId = "DSH_GLOBAL_PLATFORM_CONTROL_CLOSURE-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$Root = Join-Path "tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $Root | Out-Null

git branch --show-current > (Join-Path $Root "branch.txt")
git rev-parse HEAD > (Join-Path $Root "commit.txt")
git --no-pager status --short > (Join-Path $Root "git-status.txt")
git --no-pager diff --stat > (Join-Path $Root "git-diff-stat.txt")
git --no-pager diff --name-status > (Join-Path $Root "git-name-status.txt")
git --no-pager diff --check > (Join-Path $Root "git-diff-check.txt")
git ls-files --others --exclude-standard > (Join-Path $Root "untracked.txt")
pnpm -w exec tsc --noEmit *> (Join-Path $Root "tsc-noemit.txt")

if (Test-Path ".\tools\registry\scripts\verify-dsh-global-control-closure.ps1") {
  pwsh -NoProfile -ExecutionPolicy Bypass -File ".\tools\registry\scripts\verify-dsh-global-control-closure.ps1" *> (Join-Path $Root "dsh-global-control-guard.txt")
}

git --no-pager diff -- . > (Join-Path $Root "LOCAL_CHANGE_REVIEW.patch")

@"
status=NEEDS_CHATGPT_REVIEW
scope=DSH_GLOBAL_PLATFORM_CONTROL_CLOSURE
target=READY_FOR_HUMAN_VISUAL_REVIEW
runtime_api_backend=NOT_CLAIMED
finance_truth=WLT_ONLY
call_center=MANUAL_CALL_INTAKE_ONLY
required_decision=PASS|PASS_WITH_WARNINGS|FIX_REQUIRED|BLOCKED|NEEDS_VISUAL_EVIDENCE
session_id=$SessionId
"@ > (Join-Path $Root "SUMMARY.txt")

Compress-Archive -Path (Join-Path $Root "*") -DestinationPath (Join-Path $Root "$SessionId.zip") -Force

Write-Host "Evidence ready:"
Write-Host $Root
Write-Host (Join-Path $Root "$SessionId.zip")
```

---

## 22. التقرير النهائي المطلوب من Copilot/Agent

بعد التنفيذ، يجب أن يكون التقرير قصيرًا ودقيقًا:

```text
DSH_GLOBAL_PLATFORM_CONTROL_CLOSURE_RESULT

Decision:
DONE | BLOCKED | FIX_REQUIRED

Changed files:
- ...

New/updated workspaces:
- Assisted Order Desk: ...
- Customer 360: ...
- Manual Call Intake: ...
- Order Rescue: ...
- Ops Playbooks: ...
- Support Taxonomy: ...
- Partner Control: ...
- Catalog Control: ...
- Finance WLT Visibility: ...
- Marketing Eligibility: ...
- Platform Policy: ...
- Administration Audit: ...
- Orphan Guard: ...
- Performance Split: ...

Proof:
- pending-ui-gap = 0
- status: 'closed' = 0
- direct Tamagui outside ui-kit = 0
- raw color hex = 0
- console.log = 0
- every sensitive CTA has audit
- every signal has route/recipient
- every route has screen/registry
- every call intake is external_phone_manual
- every finance action is WLT read-only
- every large-file split is logic/data only, not visual refactor

Verification:
- git diff --check: ...
- tsc --noEmit: ...
- guard: ...
- evidence zip: ...

Remaining:
- Visual screenshots only
- Human spacing/density/RTL/premium review only
- Backend/API/runtime binding not claimed
```

---

## 23. معيار النجاح النهائي

لا تقبل التنفيذ إلا إذا أصبحت الحالة:

```text
DSH_LOGIC_STATUS = READY_FOR_HUMAN_VISUAL_REVIEW
DSH_GLOBAL_CONTROL = LOGICALLY_COMPLETE_PREVIEW
DSH_CALL_INTAKE = MANUAL_EXTERNAL_PHONE_CONTEXT_ONLY
DSH_FINANCE = WLT_READ_ONLY
DSH_VISUAL_REVIEW = PENDING_HUMAN
```

وأي نتيجة دون ذلك تعني:

```text
FIX_REQUIRED
```
