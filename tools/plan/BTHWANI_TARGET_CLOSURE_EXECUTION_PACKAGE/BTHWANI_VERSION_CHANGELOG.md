# BTHWANI VERSION CHANGELOG

**Package ID:** BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE
**Canonical Path:** `C:\bthwani-suite\tools\plan\BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE`

---

## V7.0.0 — 2026-05-30

### يُلغي
V6 بالكامل. لا استخدام لأي إصدار سابق في دورات التنفيذ.

### ما الذي أضافه V7

| التغيير | السبب |
|---|---|
| 24 خطوة Technical / Logic Closure Stage (Section 9a) | V6 كان لديه gate سطحية بدون 24 خطوة مقيّدة |
| 19-Stage Cross-Surface Navigation Map | V6 لم يتضمن تسلسل closure عبر الأسطح |
| 22 معيار شامل للأداء في Performance Playbook | V6 لديه معايير أضعف وغير مُرقّمة |
| مصفوفة File Boundary صارمة | V6 كان ينقصها أعمدة design preservation |
| مصفوفة Demo Data Centralization صارمة | V6 كان ينقصها تفصيل الأعمدة |
| V7 Hardening Layer (Sections V7.1–V7.9) | تصليب ضد الوكلاء الضعفاء |
| التناقض الصريح في PACKAGE_INVALID_BY_SELF_TEST | V6 لم يكن يُلزم verify ذاتي |

### الملفات المحدثة في V7
```text
BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md  → V7
BTHWANI_AGENT_NAVIGATION_MAP.md              → V7
BTHWANI_PERFORMANCE_PLAYBOOK.md              → V7
BTHWANI_STRUCTURE_REFACTOR_PLAYBOOK.md       → V7
```

### الملفات التي حملت V6 لكن محتواها متوافق مع V7 (تحتاج تحديث رأس)
```text
BTHWANI_EXECUTION_CYCLE_RECORD.md
BTHWANI_AGENT_FAILURE_MODES.md
BTHWANI_OPERATOR_FIELD_MANUAL.md
BTHWANI_TARGET_INPUT_TEMPLATE.md
BTHWANI_QUICK_START_FOR_AGENTS.md
BTHWANI_AGENT_START_COMMAND.md
BTHWANI_MATRICES_TEMPLATE.md
BTHWANI_TARGET_ARCHETYPE_GUIDE.md
BTHWANI_SOURCE_COVERAGE_MATRIX.md
ROLLBACK_PROTOCOL.md
EVIDENCE_STANDARD.md
BTHWANI_PACKAGE_AUDIT_REPORT.md
README.md
```

---

## V6.0.0 — 2026-05-29

### يُلغي
V5 بالكامل.

### ما الذي أضافه V6

| التغيير | السبب |
|---|---|
| BTHWANI_AGENT_NAVIGATION_MAP.md (جديد) | V5 كان يسمح للوكيل بفتح جميع الملفات عشوائياً |
| Navigation Layer في الملف الرئيسي | إلزام ترتيب القراءة |
| Navigation Evidence في كل دورة | لمنع drift بلا دليل |
| Token Budget Rule | تقليل الهدر في قراءة الملفات |
| Stage Navigation States (STARTED / CONFUSED) | recovery من drift |

### الملفات المضافة في V6
```text
BTHWANI_AGENT_NAVIGATION_MAP.md
```

---

## V5.0.0 وما قبله

```text
V1: نسخة بدائية — لا gates، لا matrices محددة
V2: إضافة Gap Matrix الأولى
V3: إضافة Evidence Standard
V4: إضافة Performance Gate
V5: إضافة Clarity Layer وSource Coverage
V6: إضافة Navigation Map (superseded by V7)
```

كل هذه الإصدارات منتهية الصلاحية.

---

## قاعدة الإصدارات

```text
لا يُستخدم إلا الإصدار الأحدث.
يُحظر الرجوع إلى إصدار سابق بدون موافقة صريحة من المستخدم.
عند التحديث يجب:
  1. تحديث manifest.json → version
  2. تحديث رؤوس جميع الملفات
  3. إعادة حساب SHA256SUMS.json
  4. تحديث README.md
  5. إضافة قيد في هذا الملف
```
