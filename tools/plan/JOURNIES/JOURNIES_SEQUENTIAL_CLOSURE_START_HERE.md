# BThwani DSH/WLT Sequential Closure — Journey Folder Layout V3.1

Status: HUMAN_EXECUTION_PACKAGE
Decision: NOT_A_CLOSURE_CLAIM
Generated: 2026-06-08
Target repo: `C:\bthwani-suite`
GitHub reference requested: `fix/docker-local-runtime-standardization`

## What changed from V3

تم تغيير التنظيم من مجلد واحد طويل إلى مجلدات رحلات مباشرة تحت `dsh/docs/` حسب النمط الذي طلبته:

```text
dsh/docs/journies-001-store-discovery/xxxxxxxx.slice1.md
```

استخدمت تهجئة `journies` كما طلبت حرفيًا، وليس `journeys`.

## Start order

1. افتح هذا الملف بعد التركيب: `dsh/docs/JOURNIES_SEQUENTIAL_CLOSURE_START_HERE.md`.
2. افتح `dsh/docs/JOURNIES_SEQUENTIAL_CLOSURE_MASTER_INDEX.md`.
3. ابدأ من `dsh/docs/journies-000-foundation-remote-local-evidence-gate/`.
4. داخل كل رحلة: اقرأ `00-journey-overview.md` ثم `01-journey-inventory.md` ثم نفذ ملفات `*.sliceN.md` بالترتيب.
5. لا تنتقل من رحلة إلى التالية قبل إغلاق checklist الرحلة أو وضع BLOCKED_WITH_REASON واضح.

## Package census

- Journey folders: `15`
- Slice files: `84`
- Organization style: one folder per journey.
- Closure rule: لا PASS بدون Git/runtime/visual/evidence proof.

## Important

هذه الحزمة لا تغلق الكود. هي جرد وتشغيل بشري كامل لتنفيذ الإغلاق على الكود الحي. الإغلاق الحقيقي يجب أن ينتج evidence داخل `tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip`.
