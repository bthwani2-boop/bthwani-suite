# J-000 — Journey Closure Checklist

Decision: PASS

## Required Before PASS

1. افتح `00-journey-overview.md` واقرأ الرحلة كاملة.
2. افتح `01-journey-inventory.md` وتحقق أن كل الشرائح موجودة بالعدد والترتيب.
3. نفّذ الشرائح بالترتيب `slice1 → sliceN`.
4. لا تنتقل للشريحة التالية إذا بقي داخل الحالية:
   - نقص شاشة/CTA/state.
   - تعارض بين docs/matrix/runtime.
   - API أو backend غير مثبت.
   - UI بلا screenshot عند تغيّر الواجهة.
   - مال خارج WLT.
   - بيانات/صور DSH متفرقة خارج المصادر المركزية.
5. لكل شريحة، أنشئ evidence مستقل داخل `tools/registry/runs/{SESSION_ID}/slices/{SLICE_ID}/` عند التنفيذ الرحلي.
6. لا تكتب PASS للرحلة إلا إذا كل ملفات `*.sliceN.md` مغلقة أو محظورة بسبب واضح غير قابل للحل داخل الرحلة.

## Human Final Review Table

| Check | Required Result | Actual | Decision |
|---|---|---|---|
| Slice count | 5 files | 5 | PASS |
| Missing files | 0 | 0 | PASS |
| Unclassified surfaces | 0 | 0 | PASS |
| Unmapped CTAs | 0 | 0 | PASS |
| Missing states | 0 | 0 | PASS |
| Runtime gaps | 0 unless BLOCKED_WITH_REASON | 0 | PASS |
| Visual gaps | 0 unless NEEDS_VISUAL_EVIDENCE | 0 | PASS |
| WLT boundary violations | 0 | 0 | PASS |
| DSH fixture/media drift | 0 | 0 | PASS |
| Final journey decision | PASS/FIX_REQUIRED/BLOCKED_WITH_REASON | PASS | PASS |
