# BThwani Executable Guards

`tools/guards/` يحتوي حراس تنفيذية فقط.

المرجع النصي السيادي للسياسات يبقى داخل:

```text
governance/
```

كل حارس هنا يجب أن يصرّح بملف governance الذي يستند إليه داخل `guard-manifest.json`.

## تشغيل كل الحراس

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\guards\RUN_GOVERNANCE_GUARDS.ps1"
```

## القرارات

- `PASS`: لا توجد مخالفات مؤكدة.
- `WARN`: توجد مخاطر أو نواقص تحتاج مراجعة.
- `FAIL`: توجد مخالفة مؤكدة يجب إصلاحها.

كل تشغيل يكتب evidence داخل `tools/registry/runs/...` وينتج ملف ZIP باسم `SESSION_ID` نفسه.
