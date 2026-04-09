
# First Screen Rule - dsh

> **ملاحظة توثيقية (2026-04-09):**
> هذا الملف هو المصدر الوحيد لحقيقة أول شاشة تنفيذية (dsh_cart_get) بعد baseline. تم توحيد القرار لمنع التضارب وضمان التسلسل الحوكمي الصارم.

## First Screen
- dsh_cart_get (surface: app-client)

## Why First
- first executable item in deterministic queue order.
- exposes required ui-kit primitives for subsequent screens in same wave.
- minimizes runtime coupling while unlocking downstream flow.

## Must Be Ready Before Start
- list/card primitives
- loading/empty/error state shells
- route handoff to dependent screens in same wave
