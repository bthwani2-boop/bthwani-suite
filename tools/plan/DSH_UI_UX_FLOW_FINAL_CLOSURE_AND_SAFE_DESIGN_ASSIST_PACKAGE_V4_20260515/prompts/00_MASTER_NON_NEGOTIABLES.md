# MASTER NON-NEGOTIABLES — DSH V4

You are working inside `C:thwani-suite` on branch `ghb/0142-20260515-053913-verify-ui-kit-stability`.

## Mission

Complete all remaining DSH UI/UX Flow closure work after the weak Loops 4–5 execution. The goal is not a verbal 100% claim. The goal is to produce a branch state that is ready for the human to perform final screen-by-screen design review.

Final allowed target:

```text
READY_FOR_HUMAN_FINAL_VISUAL_REVIEW_WITH_EVIDENCE
```

## Absolute boundaries

Forbidden unless this prompt explicitly permits it:

- No edits to `dsh/dsh.openapi.yaml`.
- No backend/API/runtime implementation.
- No WLT money semantics or WLT source edits.
- No ui-kit edits unless the specific prompt says `UI_KIT_EXPLICITLY_ALLOWED`. This package does not allow ui-kit source edits by default.
- No package.json, lockfile, CI, Nx, generated file, dependency, or config edits.
- No GitHub write, no commit, no push, no branch, no PR.
- No random colors, no local design system, no hardcoded brand-only implementation.
- No Tamagui direct imports outside `@bthwani/ui-kit`.
- No screen-per-block.
- No god-screen.
- No deletion without first classifying and proving safety.
- No `PASS`, `CLOSED`, `FINAL`, `100%`, `PRODUCTION READY`, `API CLOSED`, `RUNTIME CLOSED` claims.

## Ownership model

- DSH owns service UI/UX flow, operational meaning, order lifecycle presentation.
- WLT owns wallet, ledger, settlement, payout, refund, commission, compensation, cashback, platform fee, financial closure.
- Field owns partner onboarding/activation only and exits after partner activation.
- App shells own mounting/bootstrap/providers only.
- Control Panel is the operational command room; it is not a parallel service truth owner.
- `@bthwani/ui-kit` owns reusable UI primitives, design tokens, and design system.

## UX model

Use:

```text
Journey → Screen/Workspace → Section/Card/Sheet/State/Event
```

Do not use:

```text
Journey → dozens of tiny route screens
Journey → one massive god file
```

Every lifecycle point must be represented. Representation may be screen, workspace, section, sheet, state, event, notification, ops action, audit record, WLT bridge, or explicit blocker.

## Safe design assist permission

The agent may perform a controlled preliminary visual baseline only after wiring/gap/dead-noise gates are green. The baseline must:

- Preserve current screen intent and route structure.
- Use existing `@bthwani/ui-kit` public exports and existing design tokens/components.
- Avoid creating a new design system.
- Avoid destructive redesign or layout rewrites across many files.
- Avoid changing business logic, API, runtime, WLT, or shell behavior.
- Make screens cleaner, more premium, lower-noise, RTL-correct, and review-ready.
- Prefer small internal sections/sheets/states over new route screens.

## Evidence requirements

Every loop must write evidence under:

```text
dsh/docs/closure/
```

Every loop must run:

```powershell
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
```

At the end, create:

```text
LOCAL_CHANGE_REVIEW.patch
```
