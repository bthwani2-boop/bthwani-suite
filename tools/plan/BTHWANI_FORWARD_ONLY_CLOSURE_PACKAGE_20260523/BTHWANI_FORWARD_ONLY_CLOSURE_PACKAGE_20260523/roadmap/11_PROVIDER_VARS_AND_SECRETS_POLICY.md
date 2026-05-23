# 11 — Provider Vars and Secrets Policy

## الأسرار

### Backend

مسموح محليًا:

```text
dsh/backend/.env.local
wlt/backend/.env.local
```

بشرط:
- غير متتبع في Git.
- لا production secrets.
- يوجد `.env.example` فقط.

### Frontend

لا أسرار في frontend.

مسموح:
- public API base URL
- environment name
- public non-sensitive flag

ممنوع:
- database password
- JWT secret
- provider secret
- payment secret
- admin token
- private API key

## المزودين

المزودون لا يكونون:
- hardcoded
- env-only
- scattered in screens

المالك الصحيح:
```text
Platform / Vars / Provider Control
```

## محليًا

ابدأ بـ seed policy:
- provider_id
- service
- capability
- priority
- fallback
- scope
- status
- owner
- evidence
- rollback

ثم اعرضها في control-panel preview. لا تستخدم production provider secrets.
