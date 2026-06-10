# J-013 — Journey Closure Checklist

Decision: NOT_CLOSED

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
| Slice count | 5 files | TBD | TBD |
| Missing files | 0 | TBD | TBD |
| Unclassified surfaces | 0 | TBD | TBD |
| Unmapped CTAs | 0 | TBD | TBD |
| Missing states | 0 | TBD | TBD |
| Runtime gaps | 0 unless BLOCKED_WITH_REASON | TBD | TBD |
| Visual gaps | 0 unless NEEDS_VISUAL_EVIDENCE | TBD | TBD |
| WLT boundary violations | 0 | TBD | TBD |
| DSH fixture/media drift | 0 | TBD | TBD |
| Final journey decision | PASS/FIX_REQUIRED/BLOCKED_WITH_REASON | TBD | TBD |
