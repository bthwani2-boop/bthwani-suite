# Platform SSoT

**Status:** Canonical Governance Payload v2
**Owner:** `Platform Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0106-20260430-221753-governance`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** PLATFORM_BLUEPRINT, PLATFORM_OPERATING_MODEL, ARCHITECTURE_LOCK, BTHWANI_MASTER_EXECUTION_PLAYBOOK

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Platform definition

BThwani is a multi-surface delivery/marketplace platform with service-owned vertical domains and shared app/surface shells. It is not a set of disconnected screens. Every UI, API, provider, policy, fee, order state, and operational action must map to a service, surface, owner, contract, and evidence path.

## Canonical product principles

- Arabic/RTL-first where Arabic UI is presented.
- Premium 2026 low-noise interface.
- One primary action per flow step.
- Critical tasks in one click where possible, two clicks maximum where reasonable.
- No hidden ownership: every feature belongs to a service or surface-owned shared area.
- No money logic outside WLT.
- No hardcoded mutable business policy outside the provider control plane.
- No production-readiness claim without runtime evidence.

## Canonical services

| Service | Name | Surfaces | Canonical responsibility |
| --- | --- | --- | --- |
| dsh | Delivery & Shopping | app-client, app-partner, app-captain, app-field, control-panel | أول vertical slice ذهبي؛ يملك الطلب/المتجر/السلة/التسعير التشغيلي غير المالي/حالة الرحلة. |
| wlt | Wallet & Ledger | app-client, control-panel, cross-service | مالك المال الوحيد: ledger, fees, commissions, refunds, settlements, reconciliation. |
| knz | Kanz / rewards / marketplace value | app-client, control-panel | نطاق قيمة/مكافآت/عروض حسب اعتماد المنتج؛ لا يملك المال الخام. |
| arb | Arabic/content/local commerce operations | app-client, app-partner, app-field, control-panel | نطاق محتوى/تشغيل عربي أو تمكين شريك/ميدان حسب الدليل المثبت. |
| amn | Safety / trust / assurance | app-client, app-captain, control-panel | نطاق الأمان والثقة والحوادث والتحقق. |
| esf | Community services | app-client, webapp, control-panel | خدمة مجتمعية ضمن Community Services. |
| mrf | Community services | app-client, webapp, control-panel | خدمة مجتمعية ضمن Community Services. |
| snd | Community services | app-client, webapp, control-panel | خدمة مجتمعية ضمن Community Services. |
| kwd | Community services | app-client, webapp, control-panel | خدمة مجتمعية ضمن Community Services. |

## Canonical surfaces

| Surface | Kind | Audience | Canonical role |
| --- | --- | --- | --- |
| app-client | Mobile client | عميل نهائي | اكتشاف، طلب، دفع، تتبع، محفظة، تقييم. |
| app-partner | Mobile partner | شريك/متجر | إدارة الطلبات، كتالوج، تشغيل، أوقات، مناطق، محفظة عرضية لا ملكية مالية. |
| app-captain | Mobile captain | كابتن | قبول/التقاط/تسليم/إثبات/حالة رحلة. |
| app-field | Mobile field | مندوب ميداني | تهيئة الشركاء، زيارات، تحقق بيانات، تشغيل ميداني. |
| control-panel | Web admin | تشغيل/إدارة | Control room Web-first، مراقبة، قرارات، ضبط VAR/provider، أدلة. |
| webapp | Web product app | مستخدم/زائر | تجارب ويب لخدمات مختارة حسب نضج الخدمة. |
| website | Marketing website | عام | تعريف، تسويق، وثائق عامة، لا يملك منطق تشغيل حي. |

## Service ownership laws

### DSH

DSH is the first governed golden slice. It owns the delivery/shopping lifecycle, but it must not own financial truth. It may show totals, fees, commissions, and refunds only through WLT-owned outputs.

### WLT

WLT is the only financial truth path. Any fee, commission, wallet balance, refund, settlement, ledger movement, reconciliation, or financial audit belongs to WLT or a WLT-approved public contract.

Forbidden outside WLT:

```text
ledger mutation
wallet balance mutation
fee finalization
commission settlement
refund finalization
financial reconciliation
```

### Community services

`esf`, `mrf`, `snd`, and `kwd` are grouped under Community Services in the control panel unless a later evidence-backed governance change promotes a different model.

## Mutable policy law

Values that change by market, provider, service, store, city, category, season, operation mode, or rollout are `VAR_*` and must follow `20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md`.

Examples:

```text
VAR_DSH_DELIVERY_FEE
VAR_DSH_SERVICE_FEE
VAR_WLT_SETTLEMENT_WINDOW
VAR_AMN_OTP_RETRY_LIMIT
VAR_PROVIDER_PAYMENT_PRIORITY
VAR_STORE_COMMISSION_RATE
VAR_ZONE_SURGE_MULTIPLIER
```

## Source hierarchy

1. Repo evidence on the active branch.
2. Governance folder.
3. Contracts under `contracts/master/`.
4. Package public APIs and tests.
5. Runtime logs and evidence packs.
6. Legacy files only as extraction evidence.

## Platform closure conditions

The platform is not “closed” because files exist. Closure requires:

- Service registry complete.
- Surface registry complete.
- Package boundaries enforced.
- UI system centralized.
- Contracts and binding rules defined.
- Evidence pack standard enforced.
- Guards catalog defined.
- Branch/checkpoint process defined.
- Legacy source accounted for.
- Verification run generated and reviewed.

{standard_footer()}
