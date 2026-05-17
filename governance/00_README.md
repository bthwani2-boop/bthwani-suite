# Governance (Canonical)

**Status:** Canonical Governance Payload v2
**Owner:** `Governance Control Plane`

## Final split

- `governance/` decides policy, scope, acceptance, and decision vocabulary.
- `.agents/` owns operational agent instructions, skills, and adapters.
- `tools/guards/` verifies governance programmatically and must not invent policy.
- `tools/registry/runs/{SESSION_ID}/` stores evidence and historical review artifacts.

## Purpose

This folder is the canonical governance control plane for BThwani. It defines what the repo is allowed to do and how acceptance is decided. It does not replace `.agents/` or `tools/guards/`.

## Canonical roots

```text
C:\bthwani-suite
governance/
.agents/
tools/guards/
tools/registry/runs/{SESSION_ID}/
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
webapp/runtime
website/runtime
ui-kit/
dsh/
wlt/
knz/
arb/
amn/
esf/
mrf/
snd/
kwd/
```

## Authority order

1. Safety and explicit user instruction.
2. Repository evidence from the active branch.
3. This governance folder.
4. `.agents/` operational guidance when execution behavior matters.
5. Historical accounting in `99_LEGACY_MERGE_LEDGER.md` and evidence packs.

## BThwani fixed facts

- Active local repo: `C:\bthwani-suite`.
- Canonical remote: `bthwani2-boop/bthwani-suite`.
- Current frontend/tooling stack: Node.js, TypeScript, pnpm, Nx, React, React Native, Expo Dev Client, Next.js. Target backend stack: Go per `TECH_STACK_LOCK.md`; do not assume NestJS unless current repo evidence explicitly requires it.
- Canonical architecture ladder: Screen / Surface / App → `@bthwani/ui-kit` public exports → Tamagui internally inside ui-kit only.
- Canonical visual identity: `#0A2F5C` deepBlue, `#FF500D` orange, `#FFFFFF` white.
- Canonical language contract: Arabic/RTL correctness is mandatory where Arabic UI exists.
- Canonical evidence root: `tools/registry/runs/{SESSION_ID}/`.

## What governance owns

| Domain | Owner file |
|---|---|
| Platform SSoT and service catalog | `02_PLATFORM_SSOT.md` |
| Repository roots and boundaries | `03_REPO_BOUNDARIES.md` |
| Architecture and ownership | `04_ARCHITECTURE_RULES.md` |
| Packages and public exports | `05_PACKAGE_BOUNDARIES.md` |
| Apps and shells | `06_APPS_AND_SHELLS.md` |
| Surfaces and services | `07_SURFACES_AND_SERVICES.md` |
| UI Kit, brand, RTL | `08_UI_KIT_AND_BRAND.md` |
| API, contracts, binding, runtime | `09_API_BINDING_RUNTIME.md` |
| Service closure | `10_SERVICE_CLOSURE.md` |
| Evidence and traceability | `11_EVIDENCE_AND_TRACEABILITY.md` |
| Testing and production readiness | `12_TESTING_AND_PRODUCTION_READINESS.md` |
| CI and gates | `13_CI_AND_GATES.md` |
| Guards | `14_GUARDS_CATALOG.md` |
| Agent and AI execution boundaries | `15_AGENT_AND_AI_EXECUTION.md` |
| Security and secrets | `16_SECURITY_AND_SECRETS.md` |
| Cleanup and deprecation | `17_CLEANUP_AND_DEPRECATION.md` |
| Branches and checkpoints | `18_BRANCH_AND_CHECKPOINTS.md` |
| Control panel | `19_CONTROL_PANEL_AND_OPERATING_MODEL.md` |
| Mutable policy and providers | `20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md` |
| Target tech stack lock | `TECH_STACK_LOCK.md` |
| Runtime observability and production proof | `09_API_BINDING_RUNTIME.md` |
| DSH golden slice | `22_DSH_GOLDEN_SLICE.md` |
| Warnings and false positives | `23_WARNINGS_AND_FALSE_POSITIVES.md` |
| Roadmap and traceability | `24_TRACEABILITY_AND_ROADMAP.md` |
| Service blueprint and operation catalog | `10_SERVICE_CLOSURE.md` |
| Legacy merge ledger | `99_LEGACY_MERGE_LEDGER.md` |

## Root file types

- Canonical authority files are `00`, `01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `20`, `22`, `23`, `24`, and `99`.
- `TECH_STACK_LOCK.md` is an active governance decision file, not an implementation plan.
- No separate authority file should recreate runtime observability or service blueprint law outside `09_API_BINDING_RUNTIME.md` and `10_SERVICE_CLOSURE.md`.

## Anti-drift law

Do not create a parallel governance root in `docs/governance`, app folders, package folders, or tool-adapter docs. Implementation roots may contain generated evidence or guard source, but they must point back here.

## Change protocol

1. CHECK: capture branch/status/diff/untracked.
2. FORENSICS: prove the exact problem or missing rule.
3. APPLY: change the smallest owner file only.
4. VERIFY: run diff check and governance verification.
5. LEDGER: update `99_LEGACY_MERGE_LEDGER.md` if historical accounting or owner coverage changed.
6. EVIDENCE: save evidence pack under `tools/registry/runs/{SESSION_ID}/`.

## Closure checklist for this file

- [ ] Every rule above has exactly one owner file.
- [ ] Any derived script/guard points back to this file or its owner file.
- [ ] Evidence exists for any claim of compliance.
- [ ] No local app/surface/package silently overrides this file.
- [ ] Any exception is documented with owner, expiry, risk, and rollback.
