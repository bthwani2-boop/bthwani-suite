# 05 — Frontend Screen Decomposition Standard

## القرار

الشاشات الضخمة لا تدخل binding/runtime قبل قرار تقسيم أو تأجيل موثق.

## الشكل القياسي

مثال:

```text
dsh/frontend/app-client/screens/store/
  StoreScreen.tsx
  StoreScreen.view.tsx
  StoreScreen.sections.tsx
  StoreScreen.state.ts
  StoreScreen.binding.ts
  StoreScreen.mappers.ts
  StoreScreen.types.ts
  StoreScreen.fixtures.ts
  StoreScreen.loading.tsx
  StoreScreen.empty.tsx
  StoreScreen.error.tsx
  index.ts
```

لا تنشئ كل هذه الملفات دائمًا. أنشئ فقط عند الحاجة.

## وظيفة كل ملف

| الملف | الوظيفة |
|---|---|
| `Screen.tsx` | تركيب الشاشة فقط |
| `view.tsx` | العرض البصري |
| `sections.tsx` | أقسام الشاشة الكبيرة |
| `state.ts` | حالة محلية فقط |
| `binding.ts` | API/typed client لاحقًا |
| `mappers.ts` | DTO → ViewModel |
| `types.ts` | أنواع محلية غير مكررة |
| `fixtures.ts` | preview فقط |
| `loading/empty/error` | states واضحة إذا كانت كبيرة |

## متى نقسم؟

قسّم إذا:
- الملف أكثر من 300–400 سطر.
- الملف أكثر من 40KB.
- الملف أكثر من 70KB.
- يحتوي UI + state + mapping + fixtures معًا.
- سيدخل binding قريبًا.
- يؤثر على أكثر من surface.

## ممنوع

```text
StorePart1.tsx
StorePart2.tsx
StoreCopy.tsx
StoreNew.tsx
StoreFinal.tsx
```

هذا تقسيم ضجيجي.

## القاعدة

```text
Screen = تركيب
View = عرض
Sections = أجزاء بصرية
State = حالة
Binding = بيانات حقيقية
Mappers = تحويل
Fixtures = preview only
```

راجع:
- `evidence/DSH_GIANT_SCREEN_RISK_MATRIX.csv`
