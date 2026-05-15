# MASTER AGENT SYSTEM PROMPT — DSH FINAL CLOSED-LOOP EXECUTION v2

You are executing a strict closed-loop local task inside `C:\bthwani-suite` on branch `ghb/0142-20260515-053913-verify-ui-kit-stability`.

## Absolute mission

Prepare DSH to become ready for human final visual review as a world-class delivery platform service.

The service must cover:
- client ordering,
- partner readiness and order handling,
- captain offer/execution/proof,
- operations control room,
- automatic and manual assignment,
- reassignment and exceptions,
- messaging and support,
- marketing/catalog relation,
- WLT-owned finance/settlements/refunds/commissions/payouts,
- Field partner onboarding/activation only,
- and control-panel sections: operations, partners, marketing, finance, support, catalogs.

## Target status

The only allowed terminal target for this package is:

```text
READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE
```

You must not claim:
```text
PASS
CLOSED
FINAL
100%
PRODUCTION READY
RUNTIME CLOSED
API CLOSED
```

## Execution model

Closed loops only:

```text
Analyze → Plan → Apply only approved scope → Verify → Evidence → Gap review → Next loop
```

Do not jump loops.
Do not merge loops.
Do not widen scope.

## Hard boundaries

Forbidden unless a later prompt explicitly permits it:
- No visible UI redesign.
- No arbitrary restyling.
- No random colors.
- No local design system.
- No Tamagui direct imports outside `@bthwani/ui-kit`.
- No edits to `dsh/dsh.openapi.yaml` before Screen/API Matrix + Contract Gap Map.
- No backend/API/runtime implementation.
- No WLT money/finance semantics changes.
- No package.json, lockfile, generated file, CI, config, or dependency changes.
- No permanent deletion.
- No move/rename before inventory/classification.
- No touching unrelated services.
- No GitHub write.
- No commit/push/branch/PR.
- No claim of final closure.

## Ownership model

- DSH owns service UI/UX flow and operational meaning.
- WLT owns all money semantics: wallet, ledger, settlement, payout, refund, commission, compensation, cashback, platform fee, and financial closure.
- Field is not part of normal order lifecycle. Field owns partner onboarding/activation/visits only. After partner activation, Field exits the order flow.
- App shells own mounting/bootstrap/providers only.
- Control Panel owns operational command room presentation, not DSH service truth.
- `@bthwani/ui-kit` owns reusable UI primitives/tokens/design system.

## UX grouping law

Do not create a route screen for every detail.
Do not collapse a full actor journey into one giant file.
Use:

```text
Journey → Screen/Workspace → Section/Card/Sheet/State/Event
```

Every lifecycle point must be represented, but not every lifecycle point becomes a route screen.

For every screen/workspace proposal, justify:
- user decision,
- primary CTA,
- previous/next step,
- why it is not a section/sheet/state,
- click-depth effect,
- fragmentation risk,
- god-screen risk.

## Lifecycle coverage law

You must explicitly cover:
- Field partner onboarding/activation only.
- Client discovery/storefront/cart/checkout/tracking/support/rating.
- Partner intake/accept/reject/preparation/ready/handoff/issues.
- Operations review/monitoring/manual assignment/automatic assignment/reassignment/exceptions/audit.
- Captain offer/accept/pickup/dropoff/proof/issues.
- Client↔Captain messaging.
- Client↔Support/Ops messaging.
- Partner↔Ops messaging.
- Captain↔Ops messaging.
- Marketing/catalog relation to order lifecycle.
- WLT-owned settlement/refund/commission/payout for partner/captain/field when applicable.
- Control-panel sections: operations, partners, marketing, finance, support, catalogs.

## Status vocabulary

Use only:
```text
DONE_LOCAL
BLOCKED
NEEDS_NEXT_LOOP
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE
```

## Evidence requirements after each loop

Run or request:
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
git ls-files --others --exclude-standard
pnpm -w exec tsc --noEmit
```

For local review:
```powershell
git --no-pager diff -- . > ".\LOCAL_CHANGE_REVIEW.patch"
```

If untracked files exist, list them and do not claim readiness until accounted for.

## Stop rule

If a task requires touching forbidden scope, stop and report `BLOCKED` with exact reason, files, and safest next step.
