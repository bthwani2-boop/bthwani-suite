# أوامر تنفيذ مراحل DSH/WLT Finance — Phase 2B-1 إلى Phase 2B-7

> ملف تجميعي قابل للتنزيل يحتوي أوامر التنفيذ المتسلسلة لمراحل DSH/WLT Finance بعد تشخيص أن المنطق المالي الحالي preview/read-only وليس runtime finance مكتمل.
>
> **قاعدة تشغيل إلزامية:** لا تشغّل كل المراحل دفعة واحدة. نفّذ مرحلة واحدة فقط، ثم شغّل أوامر التحقق، ثم راجع الـ diff والنتيجة قبل الانتقال للمرحلة التالية.

---

## ترتيب التنفيذ

1. Phase 2B-1 — WLT DSH Finance Read Model
2. Phase 2B-2 — Control Panel finance bridge cleanup
3. Phase 2B-3 — app-client financial event visibility cleanup
4. Phase 2B-4 — app-captain finance/COD visibility cleanup
5. Phase 2B-5 — app-field commission visibility cleanup
6. Phase 2B-6 — Platform / Vars finance policy map only
7. Phase 2B-7 — cross-surface finance consistency audit

---

## قاعدة تحقق عامة بعد كل مرحلة

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

---

## أمر التنفيذ — Phase 2B-1 فقط

```text
نفّذ Phase 2B-1 فقط: تثبيت طبقة WLT DSH Finance Read Model لعزل المعاينة عن المنطق المالي الحقيقي، وربط شاشة محفظة الشريك بها، بدون تنفيذ API/backend/runtime/database وبدون أي حركة مالية فعلية.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المسار النشط الوحيد:
C:\bthwani-suite

لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

الهدف:
تثبيت contract/read-model واضح يقول إن WLT هو SSoT المالي، وإن كل ما يظهر الآن في محفظة الشريك هو read-only preview/runtime-unbound، مع منع تضارب الأرقام أو توهم أنها تسويات حقيقية.

النطاق المسموح للتعديل فقط:
- wlt/frontend/shared/finance/dshFinancePreview.ts
- wlt/frontend/shared/finance/index.ts
- wlt/frontend/app-partner/dsh/useWltDshPartnerWalletPreview.ts
- wlt/frontend/app-partner/dsh/wlt-dsh-partner.adapter.ts
- wlt/frontend/app-partner/dsh/wlt-dsh-partner.parts.tsx

إذا احتجت تعديل أي ملف آخر توقف واكتب BLOCKED مع السبب.

النطاق الممنوع:
- لا تعدّل API/backend/runtime/database.
- لا تنفذ ledger أو payment أو payout أو refund حقيقي.
- لا تعدّل control-panel في هذه المرحلة.
- لا تعدّل app-client/app-captain/app-field الآن.
- لا تعدّل ui-kit.
- لا تعدّل package.json أو lockfile أو config.
- لا تنشئ ملفات جديدة إلا إذا كان TypeScript لا يسمح بالحل داخل الملفات الحالية، وفي هذه الحالة توقف واكتب BLOCKED.
- لا تغيّر التصميم البصري الأساسي الذي تم إصلاحه في Phase 1.
- لا تغيّر navigation أو bottom tabs.
- لا تستخدم أو تستورد Tamagui مباشرة.

المطلوب:

1. داخل wlt/frontend/shared/finance/dshFinancePreview.ts:
- أضف/ثبّت نوعًا مركزيًا واضحًا لـ DSH-WLT finance read model، مثل:
  WltDshFinanceBindingState = 'preview_only' | 'contract_tbd' | 'runtime_unbound'
  WltDshFinanceOwnership = يوضح أن ledger/payment/settlement/refund/payout/commission مملوكة لـ WLT.
- أضف helper مركزي يعيد metadata ثابتة:
  dataKind
  runtimeTruth
  backendSource
  bindingSource
  moneySemantics
  ownerKind
  serviceId
  linkedServiceId
  currencyCode
  isPreview
- لا تغيّر الحسابات أو القيم الحالية.
- لا تحذف PREVIEW_SEEDS الآن.
- فقط اجعلها مصنّفة بوضوح كمصدر معاينة وليس مصدر محاسبة.

2. ثبّت Partner finance snapshot:
- تأكد أن getWltPartnerFinanceSnapshot() هو المسار المفضل لمحفظة الشريك بدل الاعتماد المباشر على getWltPartnerSettlementPreview().
- أضف metadata إلى snapshot إن لم تكن موجودة:
  contractState
  dataKind
  runtimeTruth
  backendSource
  bindingSource
  moneySemantics
  sourceLabel
  warnings
- warnings يجب أن توضّح:
  - Preview only
  - لا يمثل تسوية فعلية
  - WLT owns financial truth
  - DSH owns delivery/order context only
- لا تغيّر أسماء الحقول المالية الحالية إلا إذا كان TypeScript يتطلب ذلك.

3. في wlt/frontend/shared/finance/index.ts:
- صدّر أي types/helpers جديدة من dshFinancePreview.ts.
- لا تكسر أي imports حالية.

4. في useWltDshPartnerWalletPreview.ts:
- اجعل hook يستهلك getWltPartnerFinanceSnapshot() أو snapshot موحد بدل getWltPartnerSettlementPreview() مباشرة.
- حافظ على نفس المخرجات الحالية المطلوبة من الشاشة:
  partnerPreview
  previewTransactions
- أضف metadata/warnings ضمن return إن أمكن بدون كسر consumers.
- لا تجعل hook ينفذ أي API أو side effects.

5. في wlt-dsh-partner.adapter.ts:
- حافظ على فصل:
  store-delivery-fee ≠ captain-earning
  store-courier-compensation ≠ captain-payout
  platform-commission يخص خصم التسوية
  refund-adjustment يخص أثر استرداد/خصم
- أضف حقول display آمنة إن لزم:
  sourceTruthLabel
  runtimeBindingLabel
  accountingWarningLabel
- لا تعرض raw enum للمستخدم.
- لا تغيّر حسابات أو amount labels.

6. في wlt-dsh-partner.parts.tsx:
- اعرض تحذير compact وواضح داخل الملخص المالي فقط:
  "معاينة مالية — ليست تسوية منفذة"
- لا تضخم التحذير.
- لا تكرر التحذير في كل row.
- عند عرض التفاصيل، اجعل مصدر الحقيقة واضحًا:
  "WLT preview / runtime غير مربوط"
- لا تغيّر الشكل العام الذي تم إصلاحه إلا بقدر بسيط لعرض metadata الجديدة.
- حافظ على RTL الصحيح.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر داخل نطاق الملفات المسموحة فقط.

قواعد المنظومة:
- WLT هو SSoT المالي.
- DSH يملك سياق الطلب والتوصيل فقط.
- app-partner يعرض read-only summaries فقط.
- لا تنشئ مصدر مالي محلي جديد داخل الشاشة.
- لا تكرر hardcoded finance policy خارج WLT shared finance.
- لا تخلط توصيل المتجر مع كابتن بثواني.
- لا تخلط تعويض موصل المتجر مع captain payout.
- لا تحول preview إلى runtime وهمي.

مبدأ خيار الاستدعاء:
- لا تنقل كل التفاصيل لكل سطح.
- Partner wallet تعرض summary compact فقط.
- التفاصيل المالية الأعمق تبقى قابلة للاستدعاء لاحقًا عبر WLT read endpoint.
- استخدم ids/references/summaries، ولا تضخم payload داخل الشاشة.

بعد التنفيذ:
- اعرض changed files فقط.
- اعرض ملخصًا قصيرًا يثبت:
  - أين أصبح WLT ownership واضحًا؟
  - أين أصبح preview/runtime-unbound واضحًا؟
  - هل تغيرت أي حسابات؟ يجب أن تكون الإجابة: لا.
- لا تدّعي PASS/CLOSED/100%.
- اطلب تشغيل أوامر التحقق والتقاط screenshot جديد.
```

## أوامر التحقق بعد التنفيذ

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
git --no-pager diff -- `
  wlt/frontend/shared/finance/dshFinancePreview.ts `
  wlt/frontend/shared/finance/index.ts `
  wlt/frontend/app-partner/dsh/useWltDshPartnerWalletPreview.ts `
  wlt/frontend/app-partner/dsh/wlt-dsh-partner.adapter.ts `
  wlt/frontend/app-partner/dsh/wlt-dsh-partner.parts.tsx

pnpm -w exec tsc --noEmit
```

---

## أمر التنفيذ — Phase 2B-2

```text
نفّذ Phase 2B-2 فقط: تنظيف وربط عرض مالية لوحة التحكم DSH Finance Control Panel كـ WLT read-only bridge، بدون تنفيذ API/backend/runtime/database وبدون أي ledger/payment/settlement/refund/payout حقيقي.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المسار النشط الوحيد:
C:\bthwani-suite

لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

شرط قبل البدء:
- افحص ناتج Phase 2B-1 داخل:
  wlt/frontend/shared/finance/dshFinancePreview.ts
  wlt/frontend/shared/finance/index.ts
- إذا لم تجد metadata/read-model واضحًا يثبت WLT ownership وpreview/runtime-unbound state، توقف واكتب BLOCKED: Phase 2B-1 not applied.
- لا تعوّض غياب Phase 2B-1 بإعادة تنفيذها هنا.

النطاق المسموح للتعديل فقط:
- dsh/frontend/control-panel/finance/FinanceHubScreen.tsx
- dsh/frontend/control-panel/finance/FinanceHubScreens.tsx
- dsh/frontend/control-panel/finance/finance.registry.ts
- dsh/frontend/control-panel/finance/finance.types.ts
- dsh/frontend/control-panel/finance/PartnerSettlementWorkspace.tsx
- dsh/frontend/control-panel/finance/CaptainPayoutWorkspace.tsx
- dsh/frontend/control-panel/finance/RefundQueueWorkspace.tsx
- dsh/frontend/control-panel/finance/CommissionBreakdownWorkspace.tsx
- dsh/frontend/control-panel/finance/PlatformFeeAuditWorkspace.tsx
- dsh/frontend/control-panel/finance/FieldCommissionWorkspace.tsx

النطاق المسموح للقراءة فقط:
- wlt/frontend/shared/finance/dshFinancePreview.ts
- wlt/frontend/shared/finance/index.ts

إذا احتجت تعديل أي ملف خارج النطاق المسموح، توقف واكتب BLOCKED مع السبب.

الممنوع:
- لا تعدّل API/backend/runtime/database.
- لا تنفذ أي حركة مالية حقيقية.
- لا تنشئ ledger أو payment أو payout أو settlement أو refund runtime.
- لا تغيّر app-client/app-partner/app-captain/app-field الآن.
- لا تعدّل ui-kit.
- لا تعدّل package.json أو lockfile أو config.
- لا تنشئ ملفات جديدة.
- لا تغيّر navigation العام للوحة التحكم.
- لا تحذف أقسام finance من registry.
- لا تستورد Tamagui مباشرة.
- لا تعرض أرقام hardcoded كأنها حقيقة مالية.

الهدف:
جعل لوحة التحكم المالية تعرض الحقيقة الحالية بدقة:
- WLT هو المالك المالي.
- DSH finance control panel هو read-only / inspection / audit bridge فقط.
- كل الأرقام الحالية preview/runtime-unbound وليست مصدر محاسبي.
- منع تضارب hardcoded FINANCE_ROWS مع WLT shared finance.
- الحفاظ على الأقسام الحالية لكن مع source/ownership/preview warnings واضحة ومنخفضة الضجيج.

المطلوب:

1. FinanceHubScreen.tsx:
- استخدم metadata/read-model من WLT shared finance إن كان متاحًا من Phase 2B-1.
- لا تضف حسابات جديدة داخل DSH.
- عدّل header/KPIs بحيث لا توحي بأنها أرقام تشغيل حقيقية.
- أضف label compact مثل:
  "WLT read-only bridge"
  "Preview / runtime غير مربوط"
- حافظ على تصميم control-panel الحالي.
- لا تضخم التحذيرات.

2. FinanceHubScreens.tsx:
- راجع FINANCE_ROWS.
- لا تحذفها الآن، لكن اجعلها واضحة كـ UI_PREVIEW_ONLY / synthetic rows.
- أضف مصدر موحد للـ preview notice داخل هذا الملف بدل تكرار النصوص بعشوائية.
- أي row مالي يجب أن يوضح:
  source: WLT preview / synthetic control-panel row
  runtimeBinding: غير مربوط
  actionSafety: توصية أو فحص فقط، وليس تنفيذ مالي
- لا تجعل primaryActionLabel يوحي بتنفيذ فعلي مثل "اعتماد" أو "إطلاق" إذا كان مجرد محاكاة.
  استخدم صيغ آمنة مثل:
  "معاينة الاعتماد"
  "فتح الأدلة"
  "مراجعة فقط"
  "محاكاة غير منفذة"
- حافظ على WebControlPanel components الحالية ولا تستبدل التصميم.

3. PartnerSettlementWorkspace.tsx:
- أبقه WLT bridge view-only.
- إن أمكن، اجعله يقرأ partner finance snapshot/metadata من WLT shared finance للعرض فقط.
- لا تضف تصفية partnerId حقيقية إذا العقد غير مثبت.
- أظهر BLOCKED_BY_WLT و CONTRACT_TBD بشكل compact ومفهوم.
- لا تضف زر صرف أو اعتماد حقيقي.

4. CaptainPayoutWorkspace.tsx:
- أبقه WLT bridge view-only.
- اجعل الفصل واضحًا:
  كابتن بثواني فقط ≠ موصل المتجر.
- إن أمكن، اعرض snapshot/metadata للكابتن من WLT shared finance للمعاينة فقط.
- لا تضف payout حقيقي.
- لا تضف منطق أهلية runtime.

5. FieldCommissionWorkspace.tsx:
- أبقه WLT bridge view-only.
- إن أمكن، اعرض snapshot/metadata للميداني من WLT shared finance للمعاينة فقط.
- لا تضف payout حقيقي ولا commission runtime.
- كل الأرقام إن وجدت يجب أن تكون preview فقط.

6. RefundQueueWorkspace.tsx:
- حافظ على القاعدة:
  DSH يمكنه فقط flag refund-candidacy لاحقًا، لكن WLT يملك refund money semantics.
- لا تضف refund initiation أو amount logic.
- اجعل حالة BLOCKED_BY_CONTRACT واضحة.
- لا تغير behavior.

7. CommissionBreakdownWorkspace.tsx:
- حافظ على per-mode separation:
  bthwani_delivery: قد يحتوي captain payout.
  partner_delivery: لا يحتوي captain payout، وقد يحتوي partner courier cost.
  pickup: لا delivery fee إلا إذا policy لاحقًا.
- لا تعرض UI_PREVIEW_ONLY كقيمة مالية حقيقية.
- اجعل جدول rates واضحًا أنه structural فقط وليس rate source.
- لا تضف hardcoded commission rates.

8. PlatformFeeAuditWorkspace.tsx:
- اجعله audit/read-only فقط.
- لا تضف platform fee execution.
- اربطه بصريًا ومنطقيًا بـ WLT preview/metadata إذا كان متاحًا.
- أي توصية يجب أن تكون non-mutating.

9. finance.registry.ts و finance.types.ts:
- لا تغيّر بنية الأقسام إلا إذا كانت التسمية توهم بتنفيذ مالي فعلي.
- أضف/حسّن typing للـ binding/view state إن لزم داخل النطاق.
- لا تكسر buildFinanceHref أو active groups.
- لا تضف tax-compliance كقسم نشط.

قواعد المنظومة:
- WLT هو SSoT المالي.
- DSH يملك سياق الطلب والتوصيل فقط.
- Control Panel يعرض read-only bridge/audit/inspection، ولا ينفذ الأموال.
- لا تخلط توصيل المتجر مع كابتن بثواني.
- لا تخلط موصل المتجر مع captain payout.
- لا تكرر hardcoded finance policy خارج WLT shared finance.
- أي hardcoded row يجب أن يكون مصنفًا كـ preview/synthetic.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر داخل نطاق الملفات المسموحة فقط.

مبدأ خيار الاستدعاء:
- لا تضخم payload داخل لوحة التحكم.
- اعرض summary وstatus وids فقط.
- التفاصيل العميقة يجب أن تكون قابلة للاستدعاء لاحقًا من WLT read endpoints.
- لا تنسخ كل financial records لكل workspace إذا يكفي snapshot مختصر.

قبل التعديل:
- اذكر files التي ستلمسها ولماذا.
- إذا ظهر أن Phase 2B-1 غير منفذ، توقف واكتب BLOCKED.

بعد التنفيذ:
- اعرض changed files فقط.
- اذكر باختصار:
  - أين أصبح control-panel read-only bridge واضحًا؟
  - أين تم تقليل خطر hardcoded finance rows؟
  - هل تم تنفيذ أي حركة مالية؟ يجب أن تكون الإجابة: لا.
  - هل تغيرت أي حسابات مالية؟ يجب أن تكون الإجابة: لا.
- لا تدّعي PASS/CLOSED/100%.
- اطلب تشغيل أوامر التحقق.
```

## أوامر التحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
git --no-pager diff -- `
  dsh/frontend/control-panel/finance/FinanceHubScreen.tsx `
  dsh/frontend/control-panel/finance/FinanceHubScreens.tsx `
  dsh/frontend/control-panel/finance/finance.registry.ts `
  dsh/frontend/control-panel/finance/finance.types.ts `
  dsh/frontend/control-panel/finance/PartnerSettlementWorkspace.tsx `
  dsh/frontend/control-panel/finance/CaptainPayoutWorkspace.tsx `
  dsh/frontend/control-panel/finance/RefundQueueWorkspace.tsx `
  dsh/frontend/control-panel/finance/CommissionBreakdownWorkspace.tsx `
  dsh/frontend/control-panel/finance/PlatformFeeAuditWorkspace.tsx `
  dsh/frontend/control-panel/finance/FieldCommissionWorkspace.tsx

pnpm -w exec tsc --noEmit
```

---

## Phase 2B-3 — app-client financial event visibility cleanup

```text
نفّذ Phase 2B-3 فقط: تنظيف ظهور الأثر المالي في تطبيق العميل وربطه كـ WLT preview/read-only visibility، بدون تنفيذ API/backend/runtime/database وبدون ledger/payment/refund حقيقي.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المسار النشط الوحيد:
C:\bthwani-suite

لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

شرط قبل البدء:
- افحص أن Phase 2B-1 و Phase 2B-2 منفذتان.
- إذا لم تجد WLT finance metadata/read-model واضحًا أو لم تجد Control Panel read-only bridge cleanup، توقف واكتب BLOCKED.

النطاق المسموح للتعديل فقط:
- dsh/frontend/app-client/screens/CartScreen.tsx
- dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx
- dsh/frontend/app-client/DshClientSurface.tsx
- dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts
- wlt/frontend/app-client/dsh/index.ts
- wlt/frontend/app-client/dsh/useWltDshWalletPreview.ts
- wlt/frontend/app-client/dsh/wlt-dsh-client.contract.ts
- wlt/frontend/app-client/dsh/wlt-dsh-client.adapter.ts

النطاق المسموح للقراءة فقط:
- wlt/frontend/shared/finance/dshFinancePreview.ts
- wlt/frontend/shared/finance/index.ts

إذا احتجت تعديل أي ملف آخر توقف واكتب BLOCKED مع السبب.

الممنوع:
- لا تنفذ دفع حقيقي.
- لا تنفذ خصم/استرداد/محفظة runtime.
- لا تضف API أو backend.
- لا تغيّر control-panel الآن.
- لا تغيّر app-partner/app-captain/app-field الآن.
- لا تعدّل ui-kit.
- لا تعدّل package.json أو lockfile أو config.
- لا تنشئ ملفات جديدة.
- لا تستورد Tamagui مباشرة.

المطلوب:
1. CartScreen.tsx:
- اجعل checkout/payment display واضحًا أنه WLT preview/runtime-unbound.
- حافظ على payment methods الحالية: cod / wallet / mixed / official-wallets.
- لا تغيّر الحسابات أو order total.
- لا تجعل local wallet payment يظهر كدفع حقيقي.
- أضف compact notice عند الحاجة: "معاينة دفع — غير منفذة ماليًا".
- أي payload مالي يجب أن يبقى display/preview فقط.

2. OrdersTrackingScreens.tsx:
- نظّف عرض wallet impact/refund visibility.
- اجعل الأثر المالي في التتبع واضحًا أنه read-only visibility وليس refund/payment execution.
- لا تكرر التحذير في كل مكان.
- حافظ على UX الحالي وعدم فتح صفحات مستقلة جديدة.

3. DshClientSurface.tsx:
- لا تغيّر navigation.
- تأكد أن انتقالات cart/tracking/orders لا توهم أن WLT نفذ دفعًا حقيقيًا.
- حافظ على order payload الحالي.

4. dsh-client-binding.contracts.ts:
- لا تكسر types الحالية.
- إن لزم أضف metadata typing خفيف يوضح:
  financialVisibilityKind: preview/read-only/runtime-unbound
  financialOwner: WLT
- لا تضف API contract تنفيذي.

5. wlt/frontend/app-client/dsh:
- wlt-dsh-client.contract.ts يجب أن يظل صريحًا أن runtimeTruth=false/backendSource=false إذا لا يوجد runtime.
- wlt-dsh-client.adapter.ts يستخدم localStorage للمعاينة فقط؛ أضف/حسّن comments أو labels كي لا يفهم كـ runtime.
- لا تغيّر behavior إلا لإزالة الوهم المالي.

قواعد المنظومة:
- WLT هو SSoT المالي.
- DSH يملك order/delivery context فقط.
- app-client يعرض payment/refund/wallet visibility فقط.
- لا تخلط COD مع wallet actual settlement.
- لا تضخم payload؛ استخدم summary/ids/references فقط.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر داخل نطاق الملفات المسموحة فقط.

بعد التنفيذ:
- اعرض changed files فقط.
- اذكر هل تم تنفيذ أي دفع/استرداد حقيقي؟ يجب أن تكون: لا.
- اذكر هل تغيرت الحسابات؟ يجب أن تكون: لا.
- لا تدّعي PASS/CLOSED/100%.
```

---

## Phase 2B-4 — app-captain finance/COD visibility cleanup

```text
نفّذ Phase 2B-4 فقط: تنظيف ظهور مالية الكابتن/COD داخل app-captain كعرض WLT preview/read-only، بدون payout أو ledger أو API/runtime.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المسار النشط الوحيد:
C:\bthwani-suite

لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

شرط قبل البدء:
- Phase 2B-1 و Phase 2B-2 يجب أن تكون منفذة.
- إذا لم تجد WLT finance metadata/read-model، توقف واكتب BLOCKED.

النطاق المسموح للتعديل فقط:
- dsh/frontend/app-captain/screens/DshCaptainOperationsScreen.tsx
- أي ملف داخل dsh/frontend/app-captain/ إذا كان مرتبطًا مباشرة بعرض finance/COD فقط
- wlt/frontend/shared/finance/dshFinancePreview.ts فقط إذا احتجت type/export صغير غير تنفيذي
- wlt/frontend/shared/finance/index.ts فقط إذا احتجت export

إذا لم تكن ملفات app-captain المالية موجودة أو كانت مختلفة، توقف واكتب BLOCKED مع قائمة الملفات الموجودة.

الممنوع:
- لا تنفذ captain payout.
- لا تنفذ COD settlement.
- لا تنفذ eligibility runtime.
- لا تضف API/backend/database.
- لا تغيّر app-client/app-partner/control-panel/app-field الآن.
- لا تعدّل ui-kit.
- لا تعدّل package.json أو lockfile أو config.
- لا تنشئ ملفات جديدة إلا إذا توقفت وكتبت BLOCKED.
- لا تستورد Tamagui مباشرة.

المطلوب:
1. افحص app-captain finance/COD visibility.
2. اجعل أي عرض COD أو earnings أو eligibility واضحًا أنه:
   - WLT preview/read-only
   - ليس ذمة مالية منفذة
   - ليس payout حقيقي
3. حافظ على مبدأ:
   - bthwani_delivery فقط قد يرتبط بكابتن بثواني.
   - partner_delivery لا يدخل في محفظة الكابتن.
   - store courier compensation ليس captain payout.
4. لا تغيّر رحلة الطلب أو أزرار القبول/الاستلام/التسليم.
5. لا تضف أرقام مالية hardcoded جديدة.
6. إذا وجدت أرقام hardcoded حالية، صنّفها كـ preview فقط بدل جعلها حقيقة.
7. اجعل المعلومات lean:
   COD summary / earning preview / eligibility preview فقط.
   التفاصيل لاحقًا عبر WLT endpoint عند توفره.

قواعد التصميم:
- Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui داخليًا داخل ui-kit فقط.
- توجب الالتزام بنظام الألوان المركزي.
- RTL صحيح.
- لا تضخم التحذيرات.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر داخل نطاق الملفات المسموحة فقط.

بعد التنفيذ:
- اعرض changed files فقط.
- اذكر هل أضيف payout أو COD runtime؟ يجب أن تكون: لا.
- لا تدّعي PASS/CLOSED/100%.
```

---

## Phase 2B-5 — app-field commission visibility cleanup

```text
نفّذ Phase 2B-5 فقط: تشخيص/تنظيف ظهور عمولات الميداني في app-field كـ WLT preview/read-only، بدون commission runtime أو payout أو API/backend.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المسار النشط الوحيد:
C:\bthwani-suite

لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

شرط قبل البدء:
- Phase 2B-1 و Phase 2B-2 يجب أن تكون منفذة.
- إذا لم تجد app-field أو wlt app-field مرتبطًا، لا تخترع ملفات. اكتب BLOCKED مع الأدلة.

النطاق المسموح للتعديل فقط:
- dsh/frontend/app-field/
- wlt/frontend/app-field/
- wlt/frontend/shared/finance/dshFinancePreview.ts فقط إذا احتجت type/export صغير غير تنفيذي
- wlt/frontend/shared/finance/index.ts فقط إذا احتجت export

الممنوع:
- لا تنشئ سطح app-field جديد إذا غير موجود.
- لا تضف commission runtime.
- لا تضف payout.
- لا تضف API/backend/database.
- لا تغيّر app-client/app-partner/app-captain/control-panel الآن.
- لا تعدّل ui-kit.
- لا تعدّل package.json أو lockfile أو config.
- لا تستورد Tamagui مباشرة.

المطلوب:
1. افحص هل يوجد app-field فعلي وواجهة مالية للميداني.
2. إذا غير موجود:
   - توقف واكتب BLOCKED: app-field finance surface missing.
   - لا تنشئ ملفات.
3. إذا موجود:
   - اجعل عمولات الميداني preview/read-only.
   - فرّق بين:
     approved commission
     pending commission
     rejected commission
     payout preview
   - لا تجعل أي حالة تبدو كصرف فعلي.
   - لا تضف أرقام hardcoded جديدة.
   - اربط العرض بـ WLT shared finance metadata إذا كان متاحًا.
4. حافظ على خيار الاستدعاء:
   - summary فقط في السطح.
   - تفاصيل العمولة لاحقًا عبر WLT read endpoint.

قواعد المنظومة:
- WLT يملك field commission.
- DSH/field surface يعرض فقط.
- لا تنفيذ مالي.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر داخل نطاق الملفات المسموحة فقط.

بعد التنفيذ:
- اعرض changed files فقط أو BLOCKED.
- لا تدّعي PASS/CLOSED/100%.
```

---

## Phase 2B-6 — Platform / Vars finance policy map only

```text
نفّذ Phase 2B-6 فقط: تشخيص وربط وصفي غير تنفيذي بين مالية DSH/WLT و Platform Vars، بدون أي mutation أو runtime binding.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المسار النشط الوحيد:
C:\bthwani-suite

لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

النطاق المسموح للتعديل فقط:
- dsh/frontend/control-panel/platform/
- dsh/frontend/control-panel/platform/Vars/
- control-panel/runtime/app/platform/page.tsx
- wlt/frontend/shared/finance/dshFinancePreview.ts فقط إذا احتجت type/export وصفي غير تنفيذي
- wlt/frontend/shared/finance/index.ts فقط إذا احتجت export

إذا لم تكن Platform/Vars جاهزة أو المسارات غير موجودة، توقف واكتب BLOCKED مع السبب.

الممنوع:
- لا تنفذ provider switching.
- لا تنفذ API/backend/database.
- لا تربط env أو mutation.
- لا تنشئ سياسة مالية حقيقية.
- لا تضف rates حقيقية.
- لا تغيّر app-client/app-partner/app-captain/app-field/control-panel finance الآن.
- لا تعدّل ui-kit.
- لا تعدّل package.json أو lockfile أو config.
- لا تستورد Tamagui مباشرة.

المطلوب:
1. افحص Platform/Vars الحالية.
2. أضف فقط خريطة وصفية/read-only إن كان المكان مناسبًا:
   - commission policy owner: WLT
   - settlement cadence: WLT policy / Vars candidate
   - payout cadence: WLT policy / Vars candidate
   - refund windows: WLT policy / Vars candidate
   - COD limits: WLT policy / Vars candidate
   - captain eligibility threshold: WLT policy / Vars candidate
   - provider control: future WLT/payment provider candidate
3. لا تجعلها قابلة للتنفيذ.
4. لا تعرضها كإعدادات مفعلة.
5. استخدم labels واضحة:
   CONTRACT_TBD
   READ_ONLY_POLICY_MAP
   NOT_RUNTIME_BOUND
6. حافظ على مبدأ خيار الاستدعاء:
   - لا تحمل كل financial rules في كل سطح.
   - Vars تعرض مفاتيح/ملخصات فقط.
   - التفاصيل لاحقًا عبر policy read endpoint.

قواعد التصميم:
- توجب الالتزام بنظام الألوان المركزي.
- RTL صحيح.
- لا تضخم التحذيرات.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر داخل نطاق الملفات المسموحة فقط.

بعد التنفيذ:
- اعرض changed files فقط أو BLOCKED.
- اذكر هل تم تفعيل أي سياسة؟ يجب أن تكون: لا.
- اذكر هل تم ربط provider؟ يجب أن تكون: لا.
- لا تدّعي PASS/CLOSED/100%.
```

---

## Phase 2B-7 — cross-surface finance consistency audit

```text
نفّذ Phase 2B-7 فقط: تدقيق اتساق نهائي Read-only لمنظومة DSH/WLT finance بعد مراحل 2B-1 إلى 2B-6، بدون أي تعديل.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المسار النشط الوحيد:
C:\bthwani-suite

لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

ممنوع:
- لا تعدّل أي ملف.
- لا تنشئ أي ملف.
- لا تحذف أو تنقل أو تعيد تسمية.
- لا تنفذ API/backend/runtime/database.
- لا تعدّل ui-kit/package/config/lockfile.
- لا تدّعي PASS/CLOSED/100% بدون أدلة.

افحص:
- wlt/frontend/shared/finance/
- wlt/frontend/app-client/dsh/
- wlt/frontend/app-partner/dsh/
- dsh/frontend/app-client/
- dsh/frontend/app-partner/
- dsh/frontend/app-captain/
- dsh/frontend/app-field/ إن وجد
- dsh/frontend/control-panel/finance/
- dsh/frontend/control-panel/platform/
- control-panel/runtime/app/platform/

المطلوب:
1. تأكد أن WLT هو SSoT المالي في كل موضع.
2. تأكد أن DSH لا يحسب ledger/payment/settlement/refund/payout.
3. تأكد أن كل preview/hardcoded/synthetic row مصنّف بوضوح.
4. تأكد أن app-client لا يوهم بدفع أو استرداد حقيقي.
5. تأكد أن app-partner wallet لا توهم بتسوية منفذة.
6. تأكد أن app-captain لا يخلط captain payout مع store courier.
7. تأكد أن app-field لا يضيف commission/payout runtime.
8. تأكد أن control-panel finance هو read-only bridge/audit فقط.
9. تأكد أن Platform/Vars لا تنفذ provider/policy فعلي.
10. تأكد من مبدأ خيار الاستدعاء:
    - summaries فقط.
    - ids/references.
    - no broad eager loading.
    - لا تضخيم للبيانات عبر الأسطح.

مخرجات الرد:
- Executive verdict: PASS_WITH_WARNINGS / NEEDS_FIX / BLOCKED
- Cross-surface evidence map.
- أي مخالفات BLOCKER/HIGH/MEDIUM/LOW.
- قائمة الملفات التي تحتاج مرحلة إصلاح لاحقة إن وجدت.
- ممنوع كتابة "CLOSED 100%" إلا إذا كانت الأدلة كاملة.
```

---

## أوامر تحقق عامة بعد كل مرحلة

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

بعد إنهاء 2B-3 إلى 2B-6، نفّذ 2B-7 كتدقيق فقط.

---

## ملاحظات إغلاق

- لا يوجد في هذه المراحل أي تنفيذ مالي حقيقي.
- لا يوجد ledger/payment/settlement/refund/payout runtime.
- WLT يبقى SSoT المالي.
- DSH يبقى مالك سياق الطلب والتوصيل فقط.
- لا يتم إعلان PASS/CLOSED/100% إلا بعد أدلة تحقق فعلية.
