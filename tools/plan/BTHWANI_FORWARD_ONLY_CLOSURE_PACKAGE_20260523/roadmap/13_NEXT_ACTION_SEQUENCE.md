# 13 — Next Action Sequence

## الخطوة 1

إصلاح `dsh/docs` فقط.

المسموح:
- command.md
- DSH_VISUAL_REVIEW.md
- docs README/index
- quality gates docs
- visual ledger template

الممنوع:
- source UI
- API
- backend
- DB
- ui-kit

## الخطوة 2

إنشاء/تعبئة:

```text
DSH_FILE_SIZE_RISK_MATRIX
DSH_FRONTEND_DECOMPOSITION_STANDARD
DSH_SURFACE_CROSS_IMPACT_MATRIX
DSH_QUALITY_GATES
```

## الخطوة 3

Visual sweep لأول surface group:

```text
control-panel operations
ثم app-client discovery/home/store
```

## الخطوة 4

اختيار أول slice:

```text
DSH Store Discovery
```

## الخطوة 5

Slice Coverage Manifest.

## الخطوة 6

Screen/API row فقط.

## الخطوة 7

بعد الدليل فقط: OpenAPI endpoint واحد.

## الخطوة 8

Postman + typed client + binding.

## الخطوة 9

Docker + PostgreSQL + Go local backend.

## الخطوة 10

Runtime evidence + L7 closure للشريحة فقط.
