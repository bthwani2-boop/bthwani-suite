# DSH Phase 1 — Flow Registry & Reachability Baseline Execution Prompt

**Target repo:** `C:\bthwani-suite`
**Phase:** `Phase 1`
**Phase name:** `DSH_FLOW_REGISTRY_AND_REACHABILITY_BASELINE`
**Execution type:** Controlled APPLY + VERIFY
**Scope:** DSH frontend shared flow registry, route reachability baseline, and cross-surface visibility mapping only.
**Do not claim:** `PASS`, `CLOSED`, `100%`, or final platform closure without evidence and screenshots where UI is affected.

---

## Copy/paste this prompt into VS Code Copilot / coding agent

```text
نفّذ Phase 1 فقط داخل C:\bthwani-suite.

المهمة:
أنشئ أو وحّد DSH Flow Registry + Route Reachability Baseline لخدمة DSH كمنظومة واحدة مترابطة بين:
- dsh/frontend/app-client
- dsh/frontend/app-partner
- dsh/frontend/app-captain
- dsh/frontend/app-field
- dsh/frontend/control-panel
- dsh/frontend/shared
- wlt/frontend عند وجود أثر مالي preview/reference فقط

هذه المرحلة ليست إعادة تصميم شاشات وليست backend/API. الهدف هو تأسيس مصدر/Mapping مشترك واضح لكل DSH flows/routes/visibility/ownership/on-demand/hidden-compat بحيث تصبح المراحل التالية قابلة للإغلاق بدون تكرار أو تناقض.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المظلة إلزامية:
تعامل مع DSH كمنظومة واحدة مترابطة، وليس كتطبيقات منفصلة. أي flow في العميل أو الشريك أو الكابتن أو الميداني أو لوحة التحكم يجب أن يملك owner واضحًا، visibility واضحًا، escalation owner واضحًا، وcontract on-demand واضحًا. يجب الحفاظ على خيار الاستدعاء: IDs/references/summaries أولًا، والتفاصيل الثقيلة عند الفتح فقط.

اعتمد مخرجات Phase 0:
- التقرير: tools/registry/runs/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/DSH_PHASE_0_SYSTEM_AUDIT_REPORT.md إن كان موجودًا محليًا.
- أو استخدم zip/evidence المرفوع إن لم يكن التقرير موجودًا.
- إن لم توجد أدلة Phase 0 محليًا، نفّذ inspect سريع read-only لنفس نطاق Phase 0 ثم أكمل Phase 1 بناءً على repo evidence، ولا تفترض.

ممنوع:
- ممنوع تعديل backend/API/database/runtime.
- ممنوع تعديل dependencies أو lockfile.
- ممنوع إنشاء design system محلي.
- ممنوع import Tamagui خارج @bthwani/ui-kit.
- ممنوع إنشاء UI-kit files.
- ممنوع broad UI redesign.
- ممنوع حذف flows موجودة.
- ممنوع نقل ملفات أو إعادة هيكلة مجلدات.
- ممنوع حذف أو تغيير معاني مالية في WLT.
- ممنوع تحويل preview إلى runtime mutation.
- ممنوع جعل العميل يرى منطق الشريك الداخلي.
- ممنوع جعل الكابتن يرى مشاكل الشريك الداخلية إلا ما يخص handoff/delivery.
- ممنوع جعل app-field يملك سياسات أو قرارات مالية.
- ممنوع جعل control-panel نسخة من شاشات الموبايل؛ هو owner للسياسات والتصعيد والمراقبة.
- ممنوع استخدام أو ذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر ضمن نطاق هذه المرحلة فقط.

قبل أي تعديل — CHECK:
1) افحص الملفات الحالية التالية إن وجدت:
- dsh/frontend/shared/**
- dsh/frontend/app-client/**/types*
- dsh/frontend/app-client/**/contracts*
- dsh/frontend/app-client/**/screens*
- dsh/frontend/app-partner/dsh-partner.types.ts
- dsh/frontend/app-partner/DshPartnerSurface.tsx
- dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx
- dsh/frontend/app-partner/screens/OperationScreens.tsx
- dsh/frontend/app-captain/**
- dsh/frontend/app-field/**
- dsh/frontend/control-panel/**
- wlt/frontend/** فقط للبحث عن refund/compensation/settlement/commission/wallet references.

2) استخرج قبل التعديل:
- كل flowId / route / screen / panel / tab / section relevant to DSH.
- كل type union للـ routes/flows.
- كل mapping موجود.
- كل hidden compat أو fallback أو placeholder.
- كل flow ظاهر لمستخدم لكن لا يملك owner واضح.
- كل route/screen موجود لكنه غير reachable أو route-only fallback.

3) قبل APPLY اطبع في ردك الداخلي/التنفيذي:
- الملفات التي ستلمسها.
- سبب لمس كل ملف.
- الملفات التي لن تلمسها.
- أي assumption بوضع [TBD].

نطاق APPLY المسموح:

A) Shared Flow Registry / Mapping
ابحث أولًا عن ملف مشترك مناسب داخل:
- dsh/frontend/shared
- dsh/frontend/shared/**

إذا وُجد ملف مناسب للـ DSH shared flow registry/mapping، استخدمه ولا تنشئ ملفًا جديدًا.
إذا لم يوجد، أنشئ ملفًا واحدًا فقط:
- dsh/frontend/shared/dsh-flow-registry.ts

هذا الملف يجب أن يصدّر types وdata فقط، بدون React UI، بدون backend، بدون side effects.

المطلوب داخل registry:
1. type DshSurfaceId:
   - app-client
   - app-partner
   - app-captain
   - app-field
   - control-panel
   - wlt-finance

2. type DshFlowDomain:
   - order-lifecycle
   - cart-checkout
   - tracking
   - delivery-mode
   - partner-operations
   - captain-operations
   - field-onboarding
   - catalog-inventory
   - support-escalation
   - chat-conversation
   - cancellation-rejection
   - finance-preview
   - control-policy

3. type DshFlowVisibility:
   - primary
   - contextual
   - escalation-only
   - hidden-compat
   - internal
   - disabled

4. type DshOnDemandPolicy:
   - summary-only
   - detail-on-open
   - evidence-on-open
   - chat-on-open
   - finance-preview-only

5. type DshFlowRegistryEntry يحتوي على الأقل:
   - id
   - label
   - domain
   - ownerSurface
   - visibleSurfaces
   - visibility
   - routeId optional
   - screenHint optional
   - escalationOwner optional
   - financialImpact optional boolean
   - onDemandPolicy
   - hiddenCompat optional boolean
   - allowedActions
   - forbiddenActions
   - notes optional

6. export const DSH_FLOW_REGISTRY = [...] as const

7. utility functions بدون side effects:
   - getDshFlowById(id)
   - getDshFlowsForSurface(surfaceId)
   - getDshVisibleFlowsForSurface(surfaceId)
   - isDshHiddenCompatFlow(id)
   - getDshEscalationFlows()

8. يجب أن تشمل registry على الأقل flows الموجودة حاليًا في app-partner types/routes مثل:
   - order-accept
   - order-get
   - order-handoff
   - order-alerts
   - order-sla-risk
   - order-issue-queue
   - order-issue-required
   - order-out-for-delivery
   - order-prepare
   - order-ready
   - order-reject
   - order-store-delivered
   - order-chat-read-ack
   - order-chat-send
   - order-quick-reply-config
   - order-quick-reply-settings
   - order-quick-reply-setup
   - inventory-adjust
   - inventory-update
   - items-upsert
   - doc-upload
   - intake-start
   - store-nomination
   - video-upload
   - partner-finance-bridge
   - partner-settlement-summary
   - partner-commission-summary

9. flows القديمة/المربكة مثل:
   - auction-status-update
   - order-rejection
   يجب ألا تظهر primary للمستخدم. اجعلها hidden-compat أو escalation-only حسب evidence الحالي، مع note واضح.

B) Align app-partner types
في dsh/frontend/app-partner/dsh-partner.types.ts:
- لا تحذف union الحالي بشكل يكسر consumers.
- إن أمكن، اربط DSH_PARTNER_OPERATIONAL_FLOW_IDS أو types بمصدر registry أو وثّق compatibility mapping.
- لا تكرر تعريفات ضخمة إذا يمكن استيراد type/ids من shared registry.
- حافظ على public type stability.
- أي alias legacy يجب أن يبقى compatibility فقط مع تعليق قصير.

C) Align app-partner routing reachability
في dsh/frontend/app-partner/DshPartnerSurface.tsx:
- لا تعيد تصميم UI.
- لا تغير bottom nav إلا إذا يوجد route broken.
- تأكد أن routes التي تظهر من PartnerSupportScreen لها mapping في registry.
- أي hidden-compat flow لا يجب أن يظهر primary في PartnerSupportScreen.
- أي route-only fallback يجب أن يتحول إلى documented hidden/internal أو route مرتبط بوضوح.
- حافظ على hardware back behavior.

D) Align PartnerSupportScreen / OperationScreens lightly
في:
- dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx
- dsh/frontend/app-partner/screens/OperationScreens.tsx

نفّذ فقط ما يلزم لـ reachability baseline:
- استهلك registry/mapping لاستخراج visible/contextual flows إن كان مناسبًا.
- لا تعيد تصميم الشاشة الآن.
- لا تضف layout كبير.
- لا تعرض hidden compat flows كخيارات أساسية.
- أضف comments قصيرة فقط حيث يوجد hidden compat / escalation-only.
- اجعل عناوين/labels متسقة مع registry إذا كان هناك تناقض واضح.

E) Cross-surface baseline comments/import-safe alignment
افحص app-client/app-captain/app-field/control-panel:
- إن كان يوجد ملف route/type صغير يحتاج استيراد type مشترك أو mapping خفيف، عدّله بدقة.
- إن كان التعديل سيكبر أو يسبب refactor، لا تعدله الآن؛ أضفه إلى TODO في evidence/summary وليس source.
- لا تغير UI في هذه الأسطح في Phase 1 إلا إذا كان هناك compile break مباشر من shared registry.
- لا تجعل أي سطح يستهلك data ليست تخصه.

F) Control-panel ownership baseline
في control-panel، لا تبني شاشة جديدة.
فقط إن وُجد mapping/registry control-panel مناسب:
- اربط control-panel كـ escalationOwner / policy owner في shared registry.
- لا تضف UI جديد.
- لا تنفذ Vars/backend.

G) WLT/finance preview baseline
- لا تعدل WLT إلا إذا type/reference خفيف جدًا وضروري.
- أي flow مالي في registry يكون financialImpact=true و onDemandPolicy=finance-preview-only.
- لا mutation ولا settlement حقيقي.

H) On-demand contract
لكل registry entry:
- summary-only أو detail-on-open أو evidence-on-open أو chat-on-open أو finance-preview-only.
- لا تضف payloads كبيرة.
- لا تضف arrays ضخمة.
- لا تنسخ preview data من surfaces إلى registry.
- registry = metadata فقط.

I) Evidence outputs داخل repo
أنشئ evidence فقط داخل:
tools/registry/runs/DSH_PHASE_1_FLOW_REGISTRY-YYYYMMDD-HHMMSS/

ويجب أن يحتوي على الأقل:
- SUMMARY.md
- flow-registry-coverage.csv
- route-reachability-baseline.csv
- changed-files.txt
- commands.log
- git-status.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- tsc-noemit.txt
- guard-tamagui-import-boundary.txt أو GUARD_NOT_FOUND
- guard-i18n-direction-mobile-control-panel.txt أو GUARD_NOT_FOUND
- DSH_PHASE_1_FLOW_REGISTRY-YYYYMMDD-HHMMSS.zip

مهم: اسم ملف ZIP يجب أن يساوي اسم SESSION_ID بالضبط.

J) Acceptance Criteria
لا تعتبر المهمة منتهية إلا إذا:
- يوجد shared registry/mapping واحد واضح أو تم إثبات أن الموجود الحالي كافٍ وتعديله.
- كل active partner operational flow له registry entry.
- hidden compat flows مميزة ولا تظهر primary.
- every visible flow has ownerSurface + visibleSurfaces + visibility + onDemandPolicy.
- escalation flows لها escalationOwner=control-panel عندما يناسب.
- finance preview flows لها financialImpact=true ولا mutation.
- لا يوجد route primary يفتح fallback غير موثق.
- لا يوجد surface يعرّف نفس flow semantics محليًا بدون reference/mapping أو سبب واضح.
- لا يوجد تعديل backend/API/dependencies/lockfile.
- لا يوجد import Tamagui خارج ui-kit.
- TypeScript يمر أو أي فشل موثق بدقة ومرتبط/غير مرتبط.
- git diff --check نظيف.

K) Verification commands
بعد APPLY شغّل:
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

ثم افحص package.json. إذا كانت guards موجودة شغّل:
pnpm run guard:tamagui-import-boundary
pnpm run guard:i18n-direction:mobile-control-panel

إذا guard غير موجود، لا تفشل المهمة. اكتب GUARD_NOT_FOUND مع دليل من package.json.

L) ردك النهائي يجب أن يكون مختصرًا جدًا:
- Decision: DONE / BLOCKED فقط، لا PASS ولا CLOSED ولا 100%.
- SESSION_ID
- الملفات التي تغيرت
- أين يوجد registry/mapping
- coverage summary: total flows mapped / hidden compat / escalation / finance preview
- نتائج الأوامر
- zip path
- ما بقي لـ Phase 2
- اطلب review للـ patch/evidence قبل أي مرحلة لاحقة.
```

---

## Required post-execution PowerShell evidence command

Run this after Copilot finishes, even if Copilot says it already ran checks:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

$pkg = Get-Content -LiteralPath ".\package.json" -Raw
if ($pkg -match 'guard:tamagui-import-boundary') {
  pnpm run guard:tamagui-import-boundary
} else {
  Write-Output "GUARD_NOT_FOUND: guard:tamagui-import-boundary"
}
if ($pkg -match 'guard:i18n-direction:mobile-control-panel') {
  pnpm run guard:i18n-direction:mobile-control-panel
} else {
  Write-Output "GUARD_NOT_FOUND: guard:i18n-direction:mobile-control-panel"
}
```

---

## Patch handoff command after Phase 1

Use this after execution so the change can be reviewed before Phase 2:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short > ".\LOCAL_CHANGE_STATUS.txt"
git --no-pager diff --stat > ".\LOCAL_CHANGE_DIFF_STAT.txt"
git --no-pager diff --name-status > ".\LOCAL_CHANGE_NAME_STATUS.txt"
git --no-pager diff --check > ".\LOCAL_CHANGE_DIFF_CHECK.txt"
git --no-pager diff -- . > ".\LOCAL_CHANGE_REVIEW.patch"
git ls-files --others --exclude-standard > ".\LOCAL_CHANGE_UNTRACKED_FILES.txt"
```

Upload:

- `LOCAL_CHANGE_STATUS.txt`
- `LOCAL_CHANGE_DIFF_STAT.txt`
- `LOCAL_CHANGE_NAME_STATUS.txt`
- `LOCAL_CHANGE_DIFF_CHECK.txt`
- `LOCAL_CHANGE_REVIEW.patch`
- `LOCAL_CHANGE_UNTRACKED_FILES.txt`
- The Phase 1 evidence ZIP from `tools\registry\runs\...`
