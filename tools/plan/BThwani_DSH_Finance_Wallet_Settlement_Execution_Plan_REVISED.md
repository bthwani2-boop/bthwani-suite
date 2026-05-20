# BThwani DSH Finance / Wallet / Settlements — خطة تنفيذ مراجعة ومحدّثة بدقة

> الإصدار: Revised v2
> الهدف: إغلاق منطق المالية والمحفظة والتسويات داخل DSH عبر WLT، تطبيق الشريك، لوحة التحكم، وتطبيقات العميل/الكابتن/الميداني ذات العلاقة.
> الريبو المحلي المعتمد: `C:\bthwani-suite`
> GitHub المعتمد: `bthwani2-boop/bthwani-suite`
> آخر فرع ظاهر في GitHub أثناء المراجعة: `ghb/0161-20260519-054426-dsh`
> القرار: `FIX_REQUIRED` — الموجود جيد كبنية أولية، لكنه ليس إغلاقًا ماليًا كاملًا.

---

## 0) ملخص تنفيذي

تمت مراجعة آخر فرع ظاهر في GitHub ومراجعة ملف الخطة السابق. الخطة السابقة صحيحة في الاتجاه العام، لكنها تحتاج تشديدًا في أربع نقاط أساسية:

1. **الفرع الحالي لا يثبت وجود backend/ledger حقيقي**: الموجود في WLT هو `PREVIEW ONLY`، لذلك يجب منع أي ادعاء إغلاق مالي حقيقي.
2. **يوجد SSoT أولي في WLT لكنه غير مكتمل كمصدر عام**: `getWltDshStoreDeliveryFinancePreview` موجود في `dshFinancePreview.ts`، لكن يجب التأكد من تصديره من `wlt/frontend/shared/finance/index.ts` حتى لا تضطر الأسطح للاستيراد المباشر من ملف داخلي.
3. **هناك فجوة تسوية**: `getWltPartnerSettlementPreview` يعرض أرقامًا ثابتة للتسوية ولا يوضح بصرامة كيف تدخل `store-delivery-fee` أو `store-courier-compensation` في صافي الشريك حسب السياسة. يجب إضافة breakdown/notes واضحة، لا تركها ضمن حركات فقط.
4. **لوحة التحكم لا تزال تحتوي static rows وأزرار توحي بتنفيذ مالي حقيقي** مثل `نفّذ التحويل` أو `تسوية فورية`، وهذا خطر طالما العقود والدفتر الحقيقي غير موجودة.

الملف السابق كان مناسبًا كبداية، لكن هذا الإصدار يجعل الأمر أكثر إلزامًا ودقة: يحدد أين الخلل، ماذا يُسمح بتعديله، ما هو ممنوع، وكيف تُغلق المالية دون اختراع backend أو خلط Store Courier مع BThwani Captain.

---

## 1) Branch Reality — حقيقة الفرع

- لا يوجد فرع `ghb/017` ظاهر وقت المراجعة.
- آخر فرع ظاهر هو `ghb/0161-20260519-054426-dsh`.
- الصور أو التغييرات المحلية قد تكون غير مرفوعة. لذلك أي وكيل تنفيذ يجب أن يبدأ محليًا بـ `git status` و`git diff` قبل الاعتماد على GitHub.

### Preflight محلي إلزامي

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git branch --show-current
git --no-pager log -1 --oneline
```

ثم تنفيذ searches محليًا:

```powershell
rg -n "getWltDshStoreDeliveryFinancePreview|WltDshFinanceEventKind|partner-settlement|store-delivery-fee|store-courier-compensation|captain-earning|captain-cod-liability|field-commission|refund-adjustment|platform-commission|reconciliation-export|CONTRACT_TBD|UI_PREVIEW_ONLY|partner_delivery|bthwani_delivery|pickup|walletHub|PartnerWalletHubSheet|WltDshPartnerBridge|FinanceHubScreen|FINANCE_ROWS|تسوية فورية|نفّذ التحويل|Captain payout|captainPayout" .
```

---

## 2) مراجعة المرفق السابق

المرفق السابق صحيح في المحاور التالية:

- يثبت قاعدة: `WLT owns all money semantics`.
- يرفض اعتبار preview كـ ledger حقيقي.
- يضع Store Delivery Fee وStore Courier Compensation خارج Captain payout.
- يطلب تحليل كل الأسطح، لا تطبيق الشريك فقط.
- يقسم التنفيذ إلى مراحل.

لكن يجب تصحيحه/تقويته في التالي:

### 2.1 يجب إضافة Export Gap صراحة

المرفق السابق قال: تأكد أن `getWltDshStoreDeliveryFinancePreview` مصدّر من index. هذا يجب أن يصبح **إصلاحًا إلزاميًا** إذا كان غير مصدّر.

### 2.2 يجب منع أزرار التنفيذ الوهمي

أي زر مثل:

```text
تسوية فورية
نفّذ التحويل
إطلاق الصرف
فرض الإيقاف
```

لا يجوز عرضه كإجراء حقيقي إذا لا توجد عقود وAPI وledger. يجب تغييره إلى:

```text
مراجعة
فتح الأدلة
محاكاة اعتماد
تجهيز ملف مراجعة
```

### 2.3 يجب معالجة static finance rows

`FINANCE_ROWS` داخل control-panel يجب ألا يصبح مصدر حقيقة موازيًا لـ WLT. إما:

- يوسم بوضوح `preview/static`، أو
- يُعاد ربطه بـ WLT preview helpers، أو
- يُختصر ويترك WLT هو المصدر.

### 2.4 يجب توضيح أن Partner Wallet tab لا يكفي أن يفتح sheet

المحفظة في تطبيق الشريك يجب أن تكون مساحة مالية كاملة مرتبطة بـ `WltDshPartnerBridge`، وليس sheet صغير مشتت، مع بقاء Header + BottomNav في Surface/Shell.

### 2.5 يجب إضافة بوابة “ممنوع raw labels في UI” بشكل أدق

الممنوع ظهور التالي للمستخدم:

```text
partner_delivery
bthwani_delivery
pickup
UI_PREVIEW_ONLY
CONTRACT_TBD
captainPayoutApplies
store-courier-compensation
store-delivery-fee
```

ويتم تحويلها إلى نصوص عربية واضحة.

---

## 3) التشخيص التقني الحالي من الفرع

### 3.1 WLT shared finance model

الموجود في `wlt/frontend/shared/finance/dshFinancePreview.ts` جيد كنواة. الملف يصرّح بوضوح أن النموذج `PREVIEW ONLY` وليس ledger أو payment أو settlement حقيقيًا، ويؤكد أن WLT هو مالك الماليات وأن DSH يملك سياق الطلب/التوصيل فقط.

الأحداث المالية تغطي:

```text
client-payment
wallet-payment
cash-on-delivery
partner-settlement
store-delivery-fee
store-courier-compensation
captain-earning
captain-cod-liability
captain-eligibility-topup
field-commission
field-commission-pending
field-commission-rejected
field-payout
refund-adjustment
platform-commission
reconciliation-export
```

#### التقييم

- جيد كبنية preview.
- غير كافٍ كإغلاق مالي حقيقي.
- يجب أن يبقى مصدر الحقيقة الوحيد للحسابات المالية preview داخل الواجهة.
- أي شاشة DSH لا يجب أن تنشئ دلالات مالية مستقلة.

---

### 3.2 Store Delivery Finance

الموجود صحيح منطقيًا:

```text
store-delivery-fee:
رسوم يدفعها العميل وتذهب للشريك حسب السياسة.

store-courier-compensation:
تعويض داخلي يدفعه المتجر لموصل المتجر.

captainPayoutApplies: false.
```

#### الفجوة

- التعويض والرسوم يظهران كحركات، لكن لا يظهران بشكل كافٍ في دورة التسوية كبنود reconciled.
- يجب توضيح: هل `store-courier-compensation` يخصم من صافي الشريك أم مجرد سجل داخلي؟ الجواب يعتمد على policy ويجب أن يظهر في الواجهة.

---

### 3.3 Public exports

إذا كان `getWltDshStoreDeliveryFinancePreview` موجودًا في `dshFinancePreview.ts` لكنه غير مصدّر من `wlt/frontend/shared/finance/index.ts`، فهذا يضعف SSoT العام. يجب تصديره حتى لا تستورد الأسطح من ملف داخلي عميق.

المطلوب:

```ts
export {
  getWltDshStoreDeliveryFinancePreview,
  // existing exports...
} from './dshFinancePreview';
```

وإن احتجنا نوع snapshot أو policy labels، تُضاف فقط إذا موجودة أو ضرورية، بدون تضخيم.

---

### 3.4 Partner WLT Bridge

الملف `wlt/frontend/app-partner/dsh/wlt-dsh-partner.parts.tsx` يعرض:

- Summary metrics.
- تفصيل الدورة المالية.
- آخر الحركات.
- تفاصيل حركة.
- توزيع العمولة حسب وضع الخدمة.
- إجراءات مالية سريعة.

#### المشاكل

1. كثافة الحاويات عالية.
2. الحركات لا توضّح بوضوح ما يدخل في net settlement.
3. `WLT — عمولة` غير كافية.
4. لا توجد tabs/segments تقلل طول الصفحة.
5. تفاصيل الحركة تظهر كحاوية إضافية كبيرة.
6. actions ضخمة وموجودة كقائمة cards.
7. لا يظهر Store Delivery Policy بوضوح داخل الشاشة المالية.

---

### 3.5 Partner transaction adapter

`wlt-dsh-partner.adapter.ts` ينقل `record.subtitle` كما هو تقريبًا. هذا خطر لأن بعض الـ subtitles تحتوي labels تقنية مثل `partner_delivery` أو IDs raw. المطلوب adapter sanitizer:

```text
partner_delivery => توصيل المتجر
bthwani_delivery => توصيل بثواني
pickup => استلام بنفسي
UI_PREVIEW_ONLY => تقديري
CONTRACT_TBD => يحتاج ربط
```

والأفضل إضافة حقول للعرض:

```ts
kindLabel
sourceLabel
includedInSettlementLabel
isStoreDeliveryFee
isStoreCourierCompensation
isCaptainPayout
```

بدون كسر callers.

---

### 3.6 Control-panel finance

`FinanceHubScreen.tsx` يستورد `getWltControlPanelFinancePreview` ويعرض KPIs، وهذا جيد كبداية.

لكن `FinanceHubScreens.tsx` يحتوي `FINANCE_ROWS` ثابتة، وفيها صفوف وأزرار قد توحي بعمليات حقيقية مثل التنفيذ/الإطلاق/الإيقاف. هذا يجب تصحيحه لأن المالية الآن preview/contract TBD.

المطلوب:

- ألا تكون `FINANCE_ROWS` مصدر حقيقة مستقل.
- إن بقيت، تُوسم بوضوح كـ preview rows.
- أزرار التنفيذ تتحول إلى مراجعة/فتح الأدلة/محاكاة.
- Store Delivery Finance يظهر داخل control-panel كقسم مستقل.
- لا خلط بين Partner settlement وCaptain payout.

---

### 3.7 WLT Control Panel Preview

`WltDshFinanceControlPanelPreview.tsx` يعرض:

- KPI.
- مدفوعات العملاء.
- أهلية الكابتن.
- مالية الكابتن.
- تسويات الشركاء.
- مالية توصيل المتجر.
- مالية الميدانيين.
- عمولة المنصة.
- المطابقة.

هذا جيد جدًا كبنية. لكن يجب:

- منع ظهور `partner_delivery` في title.
- منع ظهور `CONTRACT_TBD` خام في UI.
- تغيير `تسوية فورية` إلى `مراجعة` أو `فتح السجل`.
- إضافة bridge واضح من DSH control-panel finance إلى هذا WLT preview بدل تكرار static rows.

---

## 4) التشخيص البصري المحدّث للمرفقات

### 4.1 المحفظة والحسابات المالية

المظهر الحالي يعطي انطباعًا أن الصفحة مكوّنة من blocks متراكمة، وليس cockpit مالي واضح. يجب تخفيف الحاويات وتحويلها إلى:

```text
Header مختصر
KPI strip مضغوط
Segmented tabs
محتوى حسب التبويب
BottomNav ثابت
```

### 4.2 آخر الحركات

يجب أن تكون الحركات قابلة للفهم فورًا:

```text
تسوية أسبوعية
+ 425,000 ر.ي
تدخل في صافي التسوية
دورة CYC-05-01
```

```text
رسوم توصيل المتجر
+ 12,000 ر.ي
رسوم محصلة للشريك حسب سياسة توصيل المتجر
طلب ORD-2026-SD1
```

```text
تعويض موصل المتجر
- 4,000 ر.ي
داخلي من المتجر لموصله — ليس Captain payout
```

### 4.3 توزيع العمولة

لا يكفي عرض `WLT — عمولة`. يجب عرض matrix مختصرة:

| الوضع | رسوم توصيل | عمولة منصة | Captain payout | Store Courier compensation | يدخل في صافي الشريك |
|---|---|---|---|---|---|
| استلام بنفسي | لا | نعم | لا | لا | نعم |
| توصيل المتجر | حسب السياسة | نعم | لا | حسب السياسة | نعم/داخلي |
| توصيل بثواني | نعم | نعم | نعم | لا | نعم |

### 4.4 إجراءات المحفظة

الأزرار الحالية يجب أن تتحول من cards ثقيلة إلى action strip:

```text
[مراجعة التسويات] [تصدير ملخص] [فتح السجل]
```

زر `إغلاق` لا يكون بنفس وزن الإجراءات المالية.

---

## 5) نموذج الإغلاق المالي المعتمد

### 5.1 قاعدة الملكية

```text
WLT owns all money semantics.
DSH owns order/delivery context only.
Control-panel observes, audits, reconciles, and approves according to WLT contracts.
Apps display scoped financial state only.
```

### 5.2 فصل الأنواع

```text
Client Payment:
دفع العميل عبر COD / wallet / mixed / official-wallets.

Partner Settlement:
صافي الشريك داخل دورة تسوية.

Store Delivery Fee:
رسوم توصيل المتجر المحصلة من العميل.

Store Courier Compensation:
تعويض داخلي لموصل المتجر وليس تسوية كابتن.

Captain Earning:
كابتن بثواني فقط.

Captain COD Liability:
ذمة COD على كابتن بثواني فقط.

Field Commission:
عمولات ميدانية مستقلة.

Platform Commission:
عمولة المنصة.

Refund/Deduction:
تؤثر على صافي التسوية حسب الحالة.
```

### 5.3 سياسات توصيل المتجر المالية

```text
free_delivery:
العميل يدفع 0.
لا Store Delivery Fee.
لا Store Courier Compensation من النظام.

courier_per_delivery_payout:
العميل يدفع رسوم التوصيل.
تسجل Store Delivery Fee للشريك.
يسجل Store Courier Compensation داخليًا لموصل المتجر.
لا Captain payout.

store_retained_fee_salary_courier:
العميل يدفع رسوم التوصيل.
تسجل Store Delivery Fee للشريك.
لا payout لكل طلب لموصل المتجر.
الموصل راتب/اتفاق داخلي.
لا Captain payout.
```

---

# 6) أمر التنفيذ الدقيق والمحدّث

انسخ الأمر التالي إلى VS Code Copilot Chat.

```text
يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

نفّذ هذا الطلب ضمن المظلة: BThwani منظومة واحدة متعددة الأسطح، وليست تطبيقات منفصلة.

المسار المعتمد:
C:\bthwani-suite

نفّذ إغلاقًا مرحليًا لمنطق المالية والمحفظة والتسويات المرتبط بـ DSH على مستوى UI/UX + preview contracts + cross-surface consistency.
لا تدّعِ backend/ledger/payment/settlement حقيقي إذا كان غير موجود.

الهدف:
- جعل WLT هو SSoT الوحيد للماليات.
- منع أي حساب مالي مستقل داخل DSH خارج سياق العرض.
- إصلاح واجهة مالية الشريك لتكون cockpit واضحة لا حاويات متراكمة.
- توضيح صافي التسوية ومكونات الدورة.
- فصل Store Delivery Fee عن Captain Payout.
- فصل Store Courier Compensation عن Captain Settlement.
- تنظيف raw technical labels من UI.
- جعل control-panel finance غرفة رقابة ومراجعة لا شاشة تنفيذ وهمي.
- فحص أثر العميل/الكابتن/الميداني وعدم تجاهل أي سطح.

لا يوجد منع أعمى لأي سطح.
يجوز تعديل أي ملف في:
- wlt/frontend/shared/finance/
- wlt/frontend/app-partner/
- wlt/frontend/app-client/
- wlt/frontend/app-captain/
- wlt/frontend/app-field/
- wlt/frontend/control-panel/
- dsh/frontend/app-partner/
- dsh/frontend/app-client/
- dsh/frontend/app-captain/
- dsh/frontend/app-field/
- dsh/frontend/control-panel/
- contracts/shared إن وجدت
- @bthwani/ui-kit public exports فقط إذا ثبت أن النمط reusable ومطلوب مركزيًا

لكن بشرط:
- إثبات الارتباط قبل APPLY.
- كتابة خريطة أثر.
- عدم تعديل أي سطح بشكل عشوائي.
- عدم إضافة backend/API/database.
- إذا احتاج Ledger/API/Contract حقيقي غير موجود، اكتب BLOCKED ولا تخترع تنفيذًا.

الممنوع:
- لا hardcoded colors.
- لا design system محلي.
- لا استيراد Tamagui مباشرة داخل screens/surfaces/apps.
- لا تضخيم ui-kit أو إنشاء ملفات ui-kit جديدة بدون حاجة مثبتة وموافقة.
- لا تجعل Store Courier Compensation تسوية كابتن بثواني.
- لا تجعل Store Delivery Fee كـ Captain earning.
- لا تعرض رموز تقنية خام للمستخدم مثل partner_delivery أو bthwani_delivery أو pickup أو CONTRACT_TBD أو UI_PREVIEW_ONLY.
- لا تعرض أزرار تنفيذ مالي حقيقي مثل "تسوية فورية" أو "نفّذ التحويل" إذا لا يوجد backend.
- لا تدّعِ أن Preview هو Ledger حقيقي.
- لا تدّعِ PASS/CLOSED/100%/READY بدون أدلة.
- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

التزام التصميم:
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- RTL إلزامي: النص يمين، الأيقونة والنص في نفس الكتلة، chevron/action على الطرف المقابل، لا space-between يفصل الأيقونة عن النص.
- تصميم Premium 2026 عملي، قليل الضجيج، بدون حاويات ثقيلة.
- أي reusable/repeatable pattern يستخدم الموجود في @bthwani/ui-kit أولًا.

==================================================
PHASE 0 — تشخيص وجرد قبل APPLY
==================================================

شغّل:

git --no-pager status --short
git branch --show-current
git --no-pager log -1 --oneline

ثم افحص الملفات التالية إن وجدت:

wlt/frontend/shared/finance/dshFinancePreview.ts
wlt/frontend/shared/finance/index.ts
wlt/frontend/app-partner/dsh/WltDshPartnerBridge.tsx
wlt/frontend/app-partner/dsh/wlt-dsh-partner.parts.tsx
wlt/frontend/app-partner/dsh/useWltDshPartnerWalletPreview.ts
wlt/frontend/app-partner/dsh/wlt-dsh-partner.adapter.ts
wlt/frontend/app-partner/dsh/wlt-dsh-partner.ui-copy.ts
wlt/frontend/app-partner/dsh/wlt-dsh-partner.preview-data.ts
wlt/frontend/control-panel/finance/WltDshFinanceControlPanelPreview.tsx
dsh/frontend/control-panel/finance/FinanceHubScreen.tsx
dsh/frontend/control-panel/finance/FinanceHubScreens.tsx
dsh/frontend/control-panel/finance/PartnerSettlementWorkspace.tsx
dsh/frontend/control-panel/finance/CaptainPayoutWorkspace.tsx
dsh/frontend/control-panel/finance/RefundQueueWorkspace.tsx
dsh/frontend/control-panel/finance/CommissionBreakdownWorkspace.tsx
dsh/frontend/control-panel/finance/PlatformFeeAuditWorkspace.tsx
dsh/frontend/control-panel/finance/FieldCommissionWorkspace.tsx
dsh/frontend/app-partner/DshPartnerSurface.tsx
dsh/frontend/app-partner/screens/PartnerHubScreen.tsx
dsh/frontend/app-partner/screens/DshPartnerStoreCourierScreen.tsx
dsh/frontend/app-client/DshClientSurface.tsx
dsh/frontend/app-captain/DshCaptainSurface.tsx
dsh/frontend/app-field/DshFieldSurface.tsx

ابحث داخل الريبو عن:

getWltPartnerSettlementPreview
getWltControlPanelFinancePreview
getWltDshStoreDeliveryFinancePreview
getWltDshOrderCommissionBreakdown
WltDshFinanceEventKind
partner-settlement
store-delivery-fee
store-courier-compensation
captain-earning
captain-cod-liability
field-commission
refund-adjustment
platform-commission
reconciliation-export
CONTRACT_TBD
UI_PREVIEW_ONLY
partner_delivery
bthwani_delivery
pickup
walletHub
PartnerWalletHubSheet
WltDshPartnerBridge
FINANCE_ROWS
تسوية فورية
نفّذ التحويل
إطلاق الصرف
commission
settlement
payout
refund
cod
cash-on-delivery
finance
wallet

قبل APPLY اكتب Findings:
- ما هو SSoT الحالي للمالية؟
- هل getWltDshStoreDeliveryFinancePreview مصدّر من shared finance index؟
- أين توجد preview فقط؟
- أين توجد CONTRACT_TBD؟
- أين تظهر رموز تقنية خام في UI؟
- كيف تفتح المحفظة من تطبيق الشريك؟
- هل Partner wallet tab يفتح WLT bridge أم sheet محلي؟
- هل Store Delivery Fee منفصل عن Captain Payout؟
- هل Store Courier Compensation منفصل عن Captain Settlement؟
- هل Partner settlement breakdown يوضح store delivery fee/compensation أم لا؟
- هل control-panel finance يستخدم WLT preview أم rows ثابتة؟
- هل توجد أزرار توهم بتنفيذ مالي حقيقي؟
- هل app-client يوضح الدفع/الرسوم/الاسترداد؟
- هل app-captain يفرق Captain Finance عن Store Courier Finance؟
- هل app-field يحتاج تعديلًا أم فقط Finding؟
- ما الملفات التي ستعدلها ولماذا؟

لا تطبق أي تعديل قبل كتابة هذه الأدلة.

==================================================
PHASE 1 — SSoT وExports داخل WLT
==================================================

الهدف:
تثبيت أن WLT هو المالك الوحيد للماليات، وأن كل الأسطح تستهلك helpers واضحة.

في:
wlt/frontend/shared/finance/dshFinancePreview.ts
wlt/frontend/shared/finance/index.ts

نفّذ:
- لا تحذف PREVIEW ONLY أو تحوّله إلى Ledger وهمي.
- لا تحذف الفصل بين:
  store-delivery-fee
  store-courier-compensation
  captain-earning
  captain-cod-liability
  partner-settlement
- تأكد أن getWltDshStoreDeliveryFinancePreview موجود ومصدّر من index.
- تأكد أن getWltDshOrderCommissionBreakdown مصدّر من index.
- إن كانت Store Delivery snapshot/types ناقصة للاستهلاك الآمن، أضفها فقط عند الحاجة وبأقل تعديل.
- أضف helper labels إن كان ضروريًا لمنع raw labels في UI.

قبول المرحلة:
- WLT shared finance index يصدّر جميع helpers المطلوبة.
- لا surface يحتاج import عميق بلا سبب.
- Store Delivery Finance مفصول عن Captain Finance.
- لا يوجد ادعاء Ledger حقيقي.

==================================================
PHASE 2 — Sanitizer للـ UI labels والـ Transactions
==================================================

الهدف:
منع تسرب أي raw technical labels للمستخدم.

في:
wlt/frontend/app-partner/dsh/wlt-dsh-partner.adapter.ts
wlt/frontend/app-partner/dsh/wlt-dsh-partner.ui-copy.ts
وأي UI يستخدم finance records

نفّذ:
- أضف mapper/sanitizer يحوّل:
  partner_delivery => توصيل المتجر
  bthwani_delivery => توصيل بثواني
  pickup => استلام بنفسي
  UI_PREVIEW_ONLY => تقديري / غير مفعّل بعد حسب السياق
  CONTRACT_TBD => يحتاج ربط / غير مفعّل بعد
  store-delivery-fee => رسوم توصيل المتجر
  store-courier-compensation => تعويض موصل المتجر
  captainPayoutApplies false => لا توجد تسوية كابتن بثواني
- لا تغيّر أسماء الأنواع الداخلية إلا إذا كان آمنًا.
- أضف حقول عرض اختيارية للحركة إن احتجت:
  kindLabel
  sourceLabel
  includedInSettlementLabel
  storeDeliveryContextLabel
  payoutSeparationLabel

قبول المرحلة:
- لا raw technical labels في UI.
- الحركات المالية مفهومة بالعربية.
- لا خلط بين Store Courier وCaptain.

==================================================
PHASE 3 — إعادة تصميم Partner Wallet Bridge
==================================================

الهدف:
تحويل شاشة المحفظة والحسابات المالية للشريك إلى cockpit عملي واضح.

في:
wlt/frontend/app-partner/dsh/wlt-dsh-partner.parts.tsx
wlt/frontend/app-partner/dsh/useWltDshPartnerWalletPreview.ts

نفّذ بصريًا:
- قلل Surface nesting.
- لا تجعل كل قسم حاوية ضخمة.
- اجعل الصفحة:
  1. Header واضح: المحفظة والتسويات.
  2. KPI strip مضغوط.
  3. Segments/Tabs داخل الصفحة:
     الملخص
     الدورة
     الحركات
     أوضاع الخدمة
     توصيل المتجر
     الإجراءات
  4. الحركات كـ compact expandable rows.
  5. details inline داخل نفس الصفحة.
  6. actions compact لا أزرار ضخمة.
- لا تعرض panel منفصل في الأسفل كأنه خارج الصفحة.
- زر إغلاق لا يكون بنفس وزن الإجراءات المالية.

نفّذ منطقيًا:
- كل حركة مالية تعرض:
  النوع
  المبلغ
  الحالة
  هل تدخل في صافي التسوية
  هل هي رسوم توصيل متجر
  هل هي تعويض موصل متجر داخلي
  هل هي خصم/استرداد
  مصدر الطلب/الدورة كـ meta صغير
- أضف قسم مستقل:
  مالية توصيل المتجر
  رسوم توصيل المتجر
  تعويض موصل المتجر
  لا توجد تسوية كابتن بثواني
  السياسة الحالية أو حالة عدم تحديد السياسة

قبول المرحلة:
- شاشة الشريك المالية مفهومة بدون شرح خارجي.
- Store Delivery Finance واضح.
- لا حاويات ثقيلة.
- لا raw labels.
- الحركات قابلة للتفاصيل inline.

==================================================
PHASE 4 — دورة التسوية للشريك
==================================================

الهدف:
توضيح من أين جاء صافي التسوية.

في WLT partner UI وpreview helper:
- أظهر breakdown:
  إجمالي المبيعات
  عمولة المنصة
  خصومات/استردادات
  رسوم توصيل المتجر
  تعويض موصل المتجر الداخلي
  صافي التسوية
  التسوية القادمة
  حالة الدورة
  بداية/نهاية الدورة
  موعد الصرف القادم

قواعد مهمة:
- إذا Store Courier Compensation داخلي ولا يخصم من WLT payout، اكتب ذلك بوضوح.
- إذا يخصم حسب policy، اكتب "حسب سياسة توصيل المتجر".
- لا تعرض مبالغ كنقاط أو placeholder غير مفهوم.
- لا تعرض CONTRACT_TBD خامًا.

قبول المرحلة:
- الشريك يفهم الصافي.
- يعرف ما يدخل وما لا يدخل في الصافي.
- يعرف أثر توصيل المتجر.

==================================================
PHASE 5 — أوضاع الخدمة والعمولة
==================================================

الهدف:
توضيح المالية حسب mode.

اعرض لكل mode:
- استلام بنفسي.
- توصيل المتجر.
- توصيل بثواني.

لكل mode أظهر:
- حالة التفعيل.
- هل توجد رسوم توصيل؟
- هل توجد عمولة منصة؟
- هل يوجد Captain payout؟
- هل يوجد Store Courier compensation؟
- هل يدخل في صافي الشريك؟
- هل يحتاج WLT contract؟

ممنوع:
- WLT — عمولة كعبارة وحيدة.
- partner_delivery خام.
- خلط توصيل المتجر مع كابتن بثواني.

قبول المرحلة:
- الفرق المالي بين pickup / partner_delivery / bthwani_delivery واضح.
- لا يلتبس Store Courier مع Captain.

==================================================
PHASE 6 — ربط app-partner بالمحفظة المالية الكاملة
==================================================

الهدف:
Tab المحفظة في app-partner يفتح مساحة WLT المالية الكاملة، وليس sheet مشتتة فقط.

في:
dsh/frontend/app-partner/DshPartnerSurface.tsx
dsh/frontend/app-partner/screens/PartnerHubScreen.tsx
wlt/frontend/app-partner/dsh/WltDshPartnerBridge.tsx

نفّذ:
- افحص route/tab الحالي للمحفظة.
- إذا كان wallet يفتح PartnerWalletHubSheet فقط، أضف route/section واضح يفتح WltDshPartnerBridge.
- حافظ على Header + BottomNav في Surface فقط.
- لا تضع BottomNav داخل WLT screen.
- لا تكسر tabs: حسابي، الطلبات، المخزون، العمليات.
- لا تكرر المالية في أكثر من مكان بلا سبب.

قبول المرحلة:
- الضغط على المحفظة في app-partner يفتح WLT Partner Bridge.
- لا يوجد sheet مالي صغير يكرر الوظيفة إلا كاختصار واضح.
- shell مستقر بدون clipping.

==================================================
PHASE 7 — Store Delivery Policy داخل المالية
==================================================

الهدف:
إظهار السياسات الثلاث لتوصيل المتجر داخل المالية.

اعتمد:
free_delivery
courier_per_delivery_payout
store_retained_fee_salary_courier

في مالية الشريك:
- أظهر السياسة الحالية إن وجدت.
- إن غير موجودة، أظهر:
  لم يتم تحديد سياسة توصيل المتجر بعد.
- أضف CTA إلى إعداد موصل المتجر/سياسة التوصيل إذا موجود.

في:
dsh/frontend/app-partner/screens/DshPartnerStoreCourierScreen.tsx
تأكد أن:
- السياسات الثلاث واضحة.
- مصدر التسعير واضح.
- تعويض الموصل واضح.
- الملخص قبل الحفظ لا يخلط مع Captain payout.

قبول المرحلة:
- الشريك يرى السياسة.
- المالية مرتبطة بتوصيل المتجر.
- لا توجد تسوية كابتن بثواني لموصل المتجر.

==================================================
PHASE 8 — لوحة التحكم المالية
==================================================

الهدف:
قسم المالية في control-panel يجب أن يكون غرفة رقابة، لا تنفيذ مالي وهمي.

في:
dsh/frontend/control-panel/finance/FinanceHubScreen.tsx
dsh/frontend/control-panel/finance/FinanceHubScreens.tsx
dsh/frontend/control-panel/finance/PartnerSettlementWorkspace.tsx
wlt/frontend/control-panel/finance/WltDshFinanceControlPanelPreview.tsx

نفّذ:
- افحص FINANCE_ROWS.
- إن بقيت، اجعلها preview/static بوضوح أو اربطها بـ WLT preview helpers.
- غيّر أزرار التنفيذ الوهمي:
  تسوية فورية => مراجعة
  نفّذ التحويل => محاكاة اعتماد / فتح الأدلة
  إطلاق الصرف => تجهيز ملف مراجعة
  فرض الإيقاف => توصية إيقاف / فتح التحقيق
- أظهر Store Delivery Finance كقسم مستقل.
- أظهر Captain finance منفصل.
- أظهر Partner settlement منفصل.
- لا تعرض CONTRACT_TBD خامًا.
- PartnerSettlementWorkspace يبقى View-only حتى WLT endpoints.

قبول المرحلة:
- control-panel يراقب ولا يدّعي صرفًا حقيقيًا.
- Store Delivery Finance ظاهر ومفصول.
- static rows لا تناقض WLT.

==================================================
PHASE 9 — app-client / app-captain / app-field impact
==================================================

app-client:
- افحص الدفع والرسوم والاسترداد.
- تأكد أن partner_delivery يظهر كـ توصيل بواسطة المتجر.
- لا يوهم بتتبع كابتن بثواني عند Store Delivery.
- رسوم توصيل المتجر لا تظهر كرسوم كابتن.

app-captain:
- store_courier_mode لا يستخدم Captain wallet/settlement.
- لا يدخل Store Courier في captain-earning.
- لا يدخل في captain-cod-liability.
- مستحقاتي من المتجر تظهر فقط إذا السياسة تسمح.

app-field:
- افحص أثر عمولات الميداني.
- لا تضف منطقًا إذا لا يوجد ارتباط مباشر.
- اكتب Finding واضح إذا لا يحتاج تعديل.

قبول المرحلة:
- لا سطح تم تجاهله.
- كل سطح إما معدّل بسبب مثبت أو عليه Finding واضح.

==================================================
PHASE 10 — التحقق والإثبات
==================================================

بعد APPLY شغّل:

git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

ثم جهّز لقطات:
1. app-partner wallet: الملخص المالي.
2. app-partner wallet: تفصيل الدورة.
3. app-partner wallet: آخر الحركات مع تفاصيل inline.
4. app-partner wallet: أوضاع الخدمة والعمولة.
5. app-partner wallet: Store Delivery Finance.
6. app-partner store courier settings: السياسات الثلاث.
7. control-panel finance overview.
8. control-panel partner settlements.
9. control-panel store delivery finance.
10. control-panel captain finance/COD.
11. app-client payment/tracking partner delivery.
12. app-captain store_courier_mode finance view إن وجد.
13. app-field Finding أو screenshot إن تم تعديل شيء.
14. bottom nav visible without clipping.

لا تدّعِ PASS/CLOSED/100%/READY.
اكتب DONE أو BLOCKED لكل Phase مع:
- الملفات المعدلة.
- سبب كل تعديل.
- خريطة الأثر.
- الأسطح التي تم فحصها.
- الأسطح التي تم تعديلها.
- الأسطح التي لم تُعدل ولماذا.
- هل يوجد Backend/Contract blocker؟
- نتيجة أوامر التحقق.
- اللقطات المطلوبة.
```

---

## 7) تسلسل التشغيل الآمن

لا تنفذ كل شيء دفعة واحدة مع وكيل ضعيف.

```text
Run 1:
PHASE 0 + PHASE 1 + PHASE 2

Run 2:
PHASE 3 + PHASE 4

Run 3:
PHASE 5 + PHASE 6 + PHASE 7

Run 4:
PHASE 8

Run 5:
PHASE 9 + PHASE 10
```

---

## 8) شروط الإغلاق

لا تعتبر المنطق المالي مغلقًا إلا إذا تحقق الآتي:

```text
- WLT هو SSoT للماليات.
- WLT shared finance index يصدّر helpers المطلوبة.
- لا توجد حسابات مالية داخل DSH خارج context العرض.
- تطبيق الشريك يعرض المحفظة والتسويات والحركات بوضوح.
- Store Delivery Fee مفصول عن Captain Payout.
- Store Courier Compensation داخلي للشريك وليس تسوية كابتن.
- دورة التسوية توضّح صافي الشريك ومكوّناته.
- Store Delivery Policy تظهر داخل المالية أو يوضح أنها غير محددة.
- لوحة التحكم تعرض المالية كرقابة/مراجعة لا كتنفيذ وهمي.
- العميل لا يرى رسوم توصيل المتجر كتسوية كابتن.
- الكابتن لا يرى موصل المتجر داخل محفظة كابتن بثواني.
- الميداني له أثره فقط في عمولات field إن وجدت.
- لا توجد raw technical labels في UI.
- لا توجد claims كاذبة عن backend/ledger غير موجود.
```
