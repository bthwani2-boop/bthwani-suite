# مراجعة شاشات ARB — تطبيق العميل (app-client) — سطر سطر وملف ملف

**التاريخ:** 2026-03  
**المسار:** `packages/surfaces/src/arb/app-client/`  
**المرجع:** ARB_UX_FLOW.md، ARB_EXECUTION_ROADMAP_CHECKLIST.md §3.1، ARB_APP_CLIENT_SCREENS_REVIEW.md

---

## 1) index.ts

| السطر | الملاحظة |
|-------|----------|
| 1–17 | تصدير 17 مكوّنًا: كل `auto_arb_*` مصدَّر مرة واحدة. ترتيب أبجدي تقريباً. |
| — | **تحقق:** لا نقص في التصدير؛ `auto_arb_booking_get` موجود (سطر 10). |

**النتيجة:** لا تغيير مطلوب.

---

## 2) auto_arb_home_get.tsx

| المقطع | المراجعة |
|--------|----------|
| 1–22 | التعليقات والاستيراد: Surface app-client، §30 States، استخدام BTHWani tokens. |
| 23–59 | الواجهات: ArbBanner، ArbQuickAction، ArbRecentBooking، ArbHomeData، Props مع onNavigate و navigation. |
| 69–78 | handleNavigate: useCallback مع navigation/onNavigate. |
| 80–138 | loadHomeData: mock data، quickActions تشير إلى شاشات صحيحة (ArbBookingCreate، ArbBookingsList، ArbOffersSearch، إلخ). |
| 167–278 | واجهة المحتوى: هيدر، بانر، إحصائيات، إجراءات سريعة (نقر واحد لكل وجهة)، حجوزات حديثة مع النقر → ArbBookingGet. |
| 291–291 | ScreenWrapper للـ loading/error: loadingMessage، errorMessage، onErrorAction=loadHomeData. |
| الأنماط | **تصحيح مطبّق:** استبدال `semanticRoles.text` بـ `semanticRoles.onSurface` في headerTitle، sectionTitle، quickActionLabel، bookingId، bookingProperty لاتساق مع باقي الشاشات. |

**النتيجة:** متوافق مع ARB_UX_FLOW (نقطة دخول، إجراءات سريعة بنقر واحد).

---

## 3) auto_arb_bookings_list.tsx

| المقطع | المراجعة |
|--------|----------|
| 25–31 | Props و handleNavigate معرّفان. |
| 33–56 | تحميل محاكى (loading/empty/error/content). |
| 64–92 | mockBookings، renderBookingItem ينقّر إلى ArbBookingGet (بدون params؛ يمكن لاحقاً إضافة bookingId). |
| 94–103 | **زر أساسي واحد:** «حجز جديد» فقط في الهيدر (ARB_UX_FLOW). |
| 115–131 | ScreenWrapper: emptyActionText «بحث عن عروض» → ArbOffersSearch. |

**النتيجة:** قائمة + CTA واحد؛ متوافق.

---

## 4) auto_arb_booking_create.tsx

| المقطع | المراجعة |
|--------|----------|
| 12–16 | **تصحيح مطبّق:** إضافة Props (onNavigate، navigation) و handleNavigate. |
| 42–124 | نموذج: تواريخ، ضيوف، نوع عقار، **كتلة سياسة العربون والإلغاء** قبل الزر، **زر واحد** «تأكيد ودفع العربون». |
| 126–139 | **تصحيح مطبّق:** onSuccessAction يوجّه إلى ArbBookingGet عند توفّر navigation/onNavigate، وإلا setState('content'). |

**النتيجة:** سياسة قبل الدفع + زر واحد + مسار نجاح؛ متوافق مع §5.

---

## 5) auto_arb_booking_get.tsx

| المقطع | المراجعة |
|--------|----------|
| 17–22 | handleNavigate معرّف. |
| 106–244 | محتوى تفاصيل الحجز: حالة، عقار، تواريخ، ضيوف، مميزات، تسعير، سياسة إلغاء. |
| 214–235 | **زر أساسي حسب الحالة:** pending → «تأكيد الحجز» (ArbBookingConfirm)، confirmed → «عرض حالة العربون» (ArbBookingEscrowStatusGet). |
| 227–239 | أزرار ثانوية: طلبات التعديل، إلغاء الحجز، تواصل مع المالك. مقبولة كإجراءات ثانوية في شاشة تفاصيل. |
| 352–363 | policyCard تستخدم semanticRoles.info (إن وُجد في الثيم؛ وإلا مراجعة stateInfo). |

**النتيجة:** زر أساسي واحد حسب الحالة + إجراءات ثانوية واضحة.

---

## 6) auto_arb_booking_cancel.tsx

| المقطع | المراجعة |
|--------|----------|
| 15–34 | **تصحيح مطبّق:** استقبال onNavigate و navigation، تعريف handleNavigate. |
| 36–46 | **تصحيح مطبّق:** handleCancel يضع loading ثم success. |
| 40 | **تصحيح مطبّق:** زر «إلغاء الحجز» مربوط بـ onPress={handleCancel}. |
| 49–57 | **تصحيح مطبّق:** successMessage، successActionText «عودة للحجوزات»، onSuccessAction → ArbBookingsList. |
| 39 | نص السياسة: نافذة إلغاء واسترداد عربون — واضح. |

**النتيجة:** سياسة + زر واحد + مسار نجاح.

---

## 7) auto_arb_booking_confirm.tsx

| المقطع | المراجعة |
|--------|----------|
| 16–24 | handleNavigate معرّف. |
| 43–46 | handleConfirm → success. |
| 54–56 | زر واحد «تأكيد» مع onPress. |
| 68–70 | success → «عرض تفاصيل الحجز» → ArbBookingGet. |

**النتيجة:** متوافق.

---

## 8) auto_arb_booking_status_update.tsx

| المقطع | المراجعة |
|--------|----------|
| 43–47 | handleUpdate → success. |
| 56–57 | زر واحد «تحديث الحالة». |
| 70–71 | onSuccessAction → ArbBookingGet. |

**النتيجة:** متوافق.

---

## 9) auto_arb_booking_reject.tsx

| المقطع | المراجعة |
|--------|----------|
| 43–46 | handleReject → success. |
| 54–56 | زر واحد «رفض الحجز». |
| 69–70 | onSuccessAction → ArbBookingsList. |

**النتيجة:** متوافق.

---

## 10) auto_arb_booking_escrow_status_get.tsx

| المقطع | المراجعة |
|--------|----------|
| 22–28 | handleNavigate مع useCallback. |
| 46–62 | عرض حالة العربون + **زر واحد** «عودة لتفاصيل الحجز» → ArbBookingGet. |

**النتيجة:** متوافق مع ARB_UX_FLOW (عرض + زر عودة واحد).

---

## 11) auto_arb_escrow_fund_intent_create.tsx

| المقطع | المراجعة |
|--------|----------|
| 16–34 | **تصحيح مطبّق:** استقبال onNavigate و navigation، handleNavigate، handleDeposit (loading → success). |
| 42 | **تصحيح مطبّق:** زر «إيداع العربون» مربوط بـ onPress={handleDeposit}. |
| 56–60 | **تصحيح مطبّق:** successMessage، successActionText «عودة لتفاصيل الحجز»، onSuccessAction → ArbBookingGet. |
| 40 | نص السياسة (WLT، نافذة الإلغاء) موجود. |

**النتيجة:** سياسة + زر واحد + مسار نجاح.

---

## 12) auto_arb_escrow_release_request.tsx

| المقطع | المراجعة |
|--------|----------|
| 16–34 | **تصحيح مطبّق:** onNavigate و navigation، handleNavigate، handleReleaseRequest. |
| 43 | **تصحيح مطبّق:** زر «طلب الإطلاق» مربوط بـ onPress. |
| 57–61 | **تصحيح مطبّق:** successMessage، successActionText، onSuccessAction → ArbBookingGet. |
| 41–42 | نص السياسة موجود. |

**النتيجة:** متوافق.

---

## 13) auto_arb_amendment_create.tsx

| المقطع | المراجعة |
|--------|----------|
| 12–30 | route.params.bookingId، handleNavigate. |
| 49–72 | handleSubmit: تحقق، loading، success/error. |
| 193–202 | **زر واحد** «إرسال طلب التعديل». |
| 208–219 | ScreenWrapper للـ success: onSuccessAction → ArbAmendmentsList. |

**النتيجة:** متوافق.

---

## 14) auto_arb_amendment_accept.tsx — 15) auto_arb_amendment_reject.tsx

| البند | المراجعة |
|-------|----------|
| زر أساسي | «قبول» / «رفض» مع onPress. |
| مسار النجاح | → ArbAmendmentsList. |

**النتيجة:** متوافقان.

---

## 16) auto_arb_amendments_list.tsx

| المقطع | المراجعة |
|--------|----------|
| 60–67 | renderItem: عرض بطاقة تعديل (بدون نقر للتفاصيل؛ يمكن إضافته لاحقاً). |
| 83–85 | **زر واحد** «عودة للحجوزات» → ArbBookingsList. |
| 96–98 | emptyMessage و onEmptyAction → ArbBookingsList. |

**النتيجة:** قائمة + CTA واحد؛ متوافق.

---

## 17) auto_arb_offer_get.tsx

| المقطع | المراجعة |
|--------|----------|
| 22–26 | handleNavigate تدعم params (لـ ArbBookingCreate مع offerId). |
| 46–48 | handleBook → handleNavigate('ArbBookingCreate', { offerId: mockOffer.id }). |
| 236–246 | **زر أساسي واحد** «حجز» + رابط نصي «تراجع عن هذا العرض». |
| 247–251 | تنبيه: سياسة العربون تُعرض قبل الدفع. |

**ملاحظة:** mockOffer معرّف بعد handleBook؛ يعمل ضمن نطاق المكوّن.

**النتيجة:** متوافق.

---

## 18) auto_arb_offers_search.tsx

| المقطع | المراجعة |
|--------|----------|
| 44–46 | handleSearch: loading ثم content. |
| 53–62 | renderItem: نقر على نتيجة → ArbOfferGet (بدون تمرير offerId؛ يمكن تحسينه لاحقاً). |
| 76–78 | حقل بحث + **زر واحد** «بحث». |
| 74 | placeholderTextColor: semanticRoles.textMuted. |

**النتيجة:** بحث + نتائج + زر أساسي واحد؛ متوافق.

---

## ملخص التصحيحات المطبّقة

1. **auto_arb_booking_cancel:** إضافة onNavigate/navigation، handleCancel، onPress على الزر، ومسار نجاح → ArbBookingsList.
2. **auto_arb_escrow_fund_intent_create:** إضافة onNavigate/navigation، handleDeposit، onPress، ومسار نجاح → ArbBookingGet.
3. **auto_arb_escrow_release_request:** إضافة onNavigate/navigation، handleReleaseRequest، onPress، ومسار نجاح → ArbBookingGet.
4. **auto_arb_booking_create:** إضافة Props (onNavigate، navigation)، handleNavigate، وتوجيه onSuccessAction إلى ArbBookingGet عند توفر التنقّل.
5. **auto_arb_home_get:** استبدال semanticRoles.text بـ semanticRoles.onSurface في الأنماط لاتساق التسمية مع باقي الشاشات.

---

## تحقق نهائي

- **عدد الملفات:** 17 شاشة `auto_arb_*.tsx` + `index.ts`.
- **ARB_UX_FLOW:** سياسة قبل الدفع حيث ينطبق؛ زر واحد أساسي (أو قائمة + CTA واحد)؛ مسار نجاح واضح بعد الإجراء.
- **لا تكرار:** كل شاشة لها مسار ومسؤولية واضحة.
- **التصدير:** index.ts يصدّر الـ 17 مكوّناً بدون نقص.

مراجعة سطر سطر وملف ملف مكتملة مع تطبيق التصحيحات أعلاه.

