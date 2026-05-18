---
name: bthwani-commercial-growth-contract
description: Review marketing, loyalty, offers, subscriptions, campaigns, audiences, eligibility, budget, expiry, redemption, and wallet impact.
version: 2026.05.17-v1
---

# bthwani-commercial-growth-contract

## Purpose

Prevent scattered commercial logic and keep control-panel ownership clear.

## Steps

1. Identify commercial object: campaign, banner, offer, coupon, loyalty, subscription, entitlement, audience, budget, or experiment.
2. Confirm owner path and control-panel governance.
3. Define eligibility, activation, expiry, redemption, financial impact, and audit.
4. Confirm whether Vars/feature flags affect rollout.
5. Reject duplicated local commercial behavior inside apps.

## Universal BThwani constraints

- Active local repo: `C:\bthwani-suite`.
- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local commands.
- Use `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`; use the safest documented launcher; npx is allowed when documented or safest and justified in evidence.
- Read `pnpm-workspace.yaml` before choosing active roots.
- `.agents` is operational guidance; `governance/` is project truth and service/application specialization.
- Do not create mirrors, bridges, long copied donor docs, or duplicate skills.
- Do not modify dependencies, lockfiles, CI, secrets, native config, backend/runtime/API, or generated files unless explicitly in scope.
- No `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` claim without Git diff, verification output, and evidence.
- Unknowns must be `TBD`, `UNPROVEN`, or `BLOCKED`.

## Output contract

```text
skill:
scope:
governance_sources:
evidence_used:
findings:
risks:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```

<!-- BTHWANI_EXTERNAL_MARKETINGSKILLS_ADAPTATION_START -->
## External adaptation: marketing skills

Source: https://github.com/coreyhaines31/marketingskills
Mode: adapted-not-mirrored.

Use this adaptation inside the existing commercial-growth owner. Do not create a duplicate marketing skill.

Additional commercial-growth duties:

- Start with product, audience, positioning, and value proposition before copy or campaign work.
- Review CRO, onboarding, paywall, checkout, activation, retention, referrals, churn, lifecycle messages, loyalty, subscriptions, offers, coupons, campaigns, and experiments when relevant.
- Review SEO, ASO, content strategy, landing pages, app-store listing text, ad creative, and campaign copy when relevant.
- Review analytics, attribution, event names, metrics, experiment hypothesis, holdout/rollback, expiry, eligibility, and measurement plan.
- Check finance impact for any discount, coupon, subscription, wallet, ledger, settlement, refund, fee, budget, or redemption behavior.
- Route configurable campaign or offer behavior to Platform/Vars or the approved control-panel owner.
- Prevent duplicated commercial behavior across app-client, app-partner, control-panel, WLT/finance, DSH/operations, website, and webapp.

Forbidden:

- no hardcoded money-affecting marketing logic inside local screens
- no duplicate campaign/offer/subscription logic across surfaces
- no runtime/API/backend/database change unless explicitly requested
- no claim of conversion, SEO, ASO, retention, or revenue improvement without measurement evidence
<!-- BTHWANI_EXTERNAL_MARKETINGSKILLS_ADAPTATION_END -->
