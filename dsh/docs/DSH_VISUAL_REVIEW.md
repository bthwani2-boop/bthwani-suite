# DSH Visual Review — Template (مفرغ)

ملف القالب هذا يحتوي رؤوس الحقول والتعليمات اللازمة لتعبئة نظام مراجعة الواجهات البصرية (DSH).
المحتوى الحالي مقصود أن يبقى فارغًا كمكان لملئه لاحقًا — لا يحتوي على بيانات فرعية أو لقطات شاشة.

---

## ملحوظة مهمة

هذا الملف قالب فارغ. عند ملئه لاحقًا، اتبع بروتوكولات المراجعة والحقول المعرّفة في المستند الداخلي للفريق.

---

## الأقسام المتاحة في القالب

- **Status**: حالة الملف (مثال: DRAFT / ACTIVE / ARCHIVED)
- **Purpose**: هدف المراجعة ونطاقها
- **Core Rules**: قواعد عامة (screenshots, PASS/FAIL/BLOCKED/DEFERRED)
- **Allowed result values**: القيم المسموح بها لحقل `result`
- **Master Update Protocol**: خطوات العمل لتحديث السجل والصفوف
- **Failure Tracking Template**: قالب لتسجيل الحالات الفاشلة
- **Signoff Template**: قالب توقيع النجاح بعد مراجعة بشرية
- **Screenshot Filename Convention**: نمط أسماء الملفات
- **Screen Index**: جدول/قائمة بالشاشات القابلة للمراجعة
- **Ledger Snapshot**: CSV المعرّف كالمصدر الفعلي للصفوف
- **Device Profile**: إعدادات الأجهزة واللغة والاتجاه
- **Git Evidence**: مكان لحفظ أدلة Git (فرع، كوميت، حالة)

---

## التوجيهات لملء القالب لاحقًا

1. ضع بيانات موجزة لكل قسم وفق الحقول المذكورة أعلاه.
2. عند إضافة `PASS` أو `FAIL` تأكد من وجود مسار لقطة شاشة حقيقي على القرص.
3. لا تمسح سجلات سابقة — استخدم أسماء ملفات جديدة لكل مراجعة/إصدار.
4. احتفظ بنسخة من `Ledger Snapshot` بصيغة CSV داخل هذا الملف أو كرابط إلى ملف منفصل.

---

## Ledger Snapshot (CSV header placeholder)

```csv
review_id,branch,commit,surface,screen_id,file_path,queue_list,priority,state,device,viewport,locale,direction,screenshot_path,result,issue_type,issue_summary,owner_decision_required,linked_gap_ids,reviewer,reviewed_at,next_action,review_doc_path
# rows to be added here when ready
```

---

## Failure Tracking Template (CSV header placeholder)

```csv
review_id,screen_id,surface,file_path,issue_type,issue_summary,screenshot_path,next_action,status
# rows to be added here when ready
```

---

## Device Profile (placeholder JSON)

```json
{
  "mobile_primary": "TBD",
  "mobile_secondary": "TBD",
  "control_panel_browser": "TBD",
  "locale": "TBD",
  "direction": "TBD",
  "timezone": "TBD"
}
```

---

## Signoff Template (placeholder)

- `screen_id`:
- `surface`:
- `result`:
- `reviewer`:
- `reviewed_at`:
- `notes`:

---

## Git Evidence (placeholder)

افحص وألصق هنا نتائج الأوامر التالية عند الحاجة:

```text
git branch --show-current
git rev-parse --short HEAD
git status --short
git --no-pager diff ---check
```

---

## Screen Index

أضِف هنا جدول الشاشات المراد مراجعتها لاحقًا (Screen Index). اتركه فارغًا حتى يجري تعبئته.

---

## تاريخ الإنشاء

- created_by:
- created_at:
- notes: قالب فارغ محفوظ لإعادة الاستخدام
