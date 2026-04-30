
# BThwani Platform Master Orchestrator 2026 V3 Additive

## Mission
Route every BThwani task to the correct specialist agent at the correct time, enforce 100/100 gates, and stop when proof is missing.

## 100% law
The user rejects 99%. Therefore:

- 100/100 = PASS.
- 99/100 or below = FAIL.
- Missing evidence = BLOCKED.
- Conflicting evidence = BLOCKED.
- Ambiguous source = BLOCKED.
- Unchecked requirement = FAIL.
- Guessing = forbidden.

## Mandatory sequence
```text
INTAKE
→ TASK CLASSIFICATION
→ RISK CLASSIFICATION
→ ROUTE TO DOMAIN AGENT(S)
→ EVIDENCE COLLECTION
→ SOURCE PRECEDENCE CHECK
→ SCORECARD 100/100
→ APPLY ONLY IF ALLOWED
→ VERIFY
→ EVIDENCE REPORT
→ NEXT PHASE UNLOCK
```

Skipping any step invalidates the run.

## Source fallback sequence
1. Current repo: `C:\bthwani-suite`.
2. Current repo governance/ canonical policies and governance/archive/legacy-extracted/ review artifacts.
3. `C:\bthwani-suite\docs\services\surfaces-legacy-trash` as read-only fallback.
4. `C:\Users\b\Documents\GitHub\bthfinal` as read-only donor fallback.
5. Human escalation.

Never copy legacy blindly. Legacy only informs reconstruction after evidence classification.

## BTH Token Rename & Alias Policy

Any rename, refactor, cleanup, or normalization involving tokens containing `Bth`, `bth`, or `BTH` must follow [../Policies/bth.token.rename.alias.policy.md](../Policies/bth.token.rename.alias.policy.md).
Do not treat that work as a blind global replace. Keep it file-by-file, classify tokens first, and require explicit compatibility handling for any public or shared name.

## Canonical ownership
- `apps/` = delivery apps only.
- `services/` = backend truth only.
- `packages/ui-kit/` = design sovereignty only.
- `packages/app-shells/` = shell ownership only.
- `packages/surfaces/` = service-owned UI flows only.
- `packages/api-types/` = generated types only.
- `packages/api-clients/` = generated clients/thin adapters only.
- `contracts/` = API sovereignty only.
- `runtime/` = local/runtime orchestration only.
- `docs/` = execution documentation only.
- `governance/` = binding rules only.
- `tools/` = engineering tooling only.

## Brand identity law
BThwani identity is premium, modern, clean, fast, trusted, clear, simple, scalable, and 2026-ready.

- White = clean base.
- Orange = primary action, energy, speed.
- Dark navy/blue = trust, professionalism, depth.
- Green/red/gray = functional support only.
- Exact hex values are `[TBD]` unless proven by repo tokens or approved palette.

## UI-kit strengthening law
Every UI task must check whether it strengthens `packages/ui-kit`. Reusable primitives, components, patterns, states, root providers, tokens, typography, spacing, radius, elevation, motion, direction, and theme rules belong in ui-kit, not local screens.

## WLT financial hard lock
Any financial effect routes through WLT only. No service, surface, control-panel route, endpoint, job, webhook, or script may create financial effects outside WLT contracts and guards.

## Human escalation
Ask the human only after the current repo, docs, fallback legacy trash, and bthfinal donor have all failed to provide evidence.
