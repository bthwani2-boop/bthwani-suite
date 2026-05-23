# 07 — Local Runtime to Staging Decision

## القرار

```text
استمر محليًا الآن.
لكن اجعل المحلي Local Runtime حقيقيًا، لا preview وهمي.
```

## المحلي الوهمي

خطر إذا اعتمد على:
- fixtures only
- mock only
- localStorage as truth
- hardcoded data
- screen-only state
- no API
- no DB
- no logs
- no control-panel proof

## المحلي الحقيقي

مقبول إذا كان:

```text
Docker
+ PostgreSQL local
+ Go backend local
+ OpenAPI
+ typed client
+ real binding
+ Postman requests
+ app-client/control-panel proof
+ logs
+ screenshots
+ evidence pack
```

## متى نربط Docker؟

يثبت الآن، لكنه لا يشغل stack فعلي إلا عند first runtime slice.

## متى نربط PostgreSQL؟

عند أول slice يحتاج قراءة/كتابة حقيقية:
- بعد visual evidence.
- بعد Screen/API Matrix.
- بعد OpenAPI endpoint.
- بعد binding intent.

## متى نستخدم MongoDB؟

لا الآن. فقط إذا ظهرت حاجة document-heavy مثبتة.

## متى ننتقل إلى Staging؟

بعد 2–3 شرائح runtime محلية ناجحة، وبشرط:
- guards pass
- openapi validated
- typed clients
- migrations/seeds
- Postman evidence
- logs
- screenshots
- rollback plan

## Production

ليست ضمن هذه المرحلة.
