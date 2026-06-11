# J-014 — Journey Closure Checklist

Decision: BLOCKED_WITH_REASON

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
| Slice count | 5 files | 5 files | PASS |
| Missing files | 0 | 0 | PASS |
| Unclassified surfaces | 0 | 0 | PASS |
| Unmapped CTAs | 0 | 0 | PASS |
| Missing states | 0 | 0 — all screens have loading/error/offline/retry | PASS |
| Runtime gaps | 0 unless BLOCKED_WITH_REASON | GUARD_SERVICE_GO_RUNTIME FAIL: Docker Postgres required for go test ./... | BLOCKED_WITH_REASON |
| Visual gaps | 0 unless NEEDS_VISUAL_EVIDENCE | Device/browser screenshots require Docker stack | NEEDS_VISUAL_EVIDENCE |
| WLT boundary violations | 0 | 0 | PASS |
| DSH fixture/media drift | 0 | 0 | PASS |
| Final journey decision | PASS/FIX_REQUIRED/BLOCKED_WITH_REASON | BLOCKED_WITH_REASON — full E2E needs Docker runtime (014A-014D) | BLOCKED_WITH_REASON |

## Evidence (2026-06-11)

- GUARD_SERVICE_POSTGRES_RUNTIME[dsh]: PASS
- GUARD_SERVICE_L7_CLOSURE[dsh]: PASS
- API-BINDING-RUNTIME: PASS
- DESIGN-TOKEN-DRIFT: PASS
- UI-ARCH-BOUNDARY: PASS
- GUARD_SERVICE_GO_RUNTIME[dsh]: FAIL — postgres_migrations_test.go requires Docker on :15432
- pnpm -w exec tsc --noEmit → exit 0 (0 errors)
- go build ./... → exit 0
- Evidence folder: `tools/registry/runs/DSH-J014-CLOSURE-20260611-001/`

## Blocker

`dsh/backend/internal/store/postgres_migrations_test.go` connects to `localhost:15432`.
Docker Compose with `dsh-postgres` service must be running.
All other code quality gates are green.

## Slice Decisions

- 014A: BLOCKED_WITH_REASON (happy path E2E needs Docker + running services)
- 014B: BLOCKED_WITH_REASON (failure/recovery E2E needs Docker + running services)
- 014C: NEEDS_VISUAL_EVIDENCE (RTL/design regression needs browser/device screenshots)
- 014D: NEEDS_VISUAL_EVIDENCE (performance smoke needs running Next.js + Expo)
- 014E: DEFERRED_WITH_REASON (evidence ZIP + PR readiness deferred until Docker available)
