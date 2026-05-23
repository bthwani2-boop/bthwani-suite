# 08 — Visual Evidence Protocol

## القرار

لا UI PASS بدون دليل بصري.

## كل شاشة تحتاج

```text
review_id
surface
screen_id
file_path
route
state
device
viewport
locale
direction
screenshot_path
human_result
known_warnings
reviewed_at
decision
```

## الحالات المطلوبة

حسب الشاشة:
- default
- loading
- empty
- error
- success
- offline
- disabled
- blocked
- retry
- expanded/detail عند الحاجة

## فحص RTL

يجب توثيق:
- النص يمين.
- icon + text في cluster صحيح.
- chevron/action في الجهة المقابلة.
- لا space-between يكسر العلاقة.
- لا clipping/overflow.
- safe-area صحيح.

## مكان الأدلة

```text
tools/registry/runs/DSH_VISUAL_SWEEP-YYYYMMDD-HHMMSS/
  SUMMARY.md
  evidence.json
  visual-matrix.csv
  screenshots/
  notes/
  DSH_VISUAL_SWEEP-YYYYMMDD-HHMMSS.zip
```

## قرارات الشاشة

```text
VISUAL_PASS
NEEDS_VISUAL_EVIDENCE
NEEDS_RTL_FIX
NEEDS_OVERFLOW_FIX
NEEDS_UIKIT_FIX
NEEDS_STATE_COVERAGE
BLOCKED
```

## المطلوب الآن

تحويل `dsh/docs/DSH_VISUAL_REVIEW.md` من template إلى ledger فعلي.
