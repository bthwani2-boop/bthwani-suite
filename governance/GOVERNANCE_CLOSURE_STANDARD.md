# Governance Closure Standard

Status: CANONICAL
Owner: BThwani Governance
Scope: all repository changes, governance decisions, guards, evidence, and closure decisions

## 1. Binding principle

A decision is binding and closed inside its declared scope only when it is backed by evidence.

A closed decision may be reopened only by one of:

- stronger contradictory evidence
- changed scope
- changed requirement
- discovered safety/security issue
- incorrect prior evidence
- owner-approved superseding policy

This prevents circular debate while preserving correctness when new proof appears.

## 2. Evidence-first rule

No `PASS`, `CLOSED`, `READY`, `READY_FOR_PR`, or `100%` claim is valid without evidence.

Minimum evidence for any code or governance change:

- current branch
- git status before
- changed file list
- diff check
- typecheck when code can affect TypeScript
- applicable guards
- decision file or summary
- evidence zip in `tools/registry/runs/<SESSION_ID>/`

## 3. Source-of-truth rule

Every fact must resolve to one explicit source of truth.

Canonical roots:

| Area | Canonical source |
|---|---|
| Repository | `C:\bthwani-suite` and `bthwani2-boop/bthwani-suite` |
| Governance | `governance/` |
| Transitional governance | `docs/governance/` until extracted and deleted |
| Evidence | `tools/registry/runs/<SESSION_ID>/` |
| UI system | `@bthwani/ui-kit` public exports |
| Tamagui | internal to `@bthwani/ui-kit` only |
| Services | `packages/surfaces/src/service-owned/<service>/` |
| Surface-owned experiences | `packages/surfaces/src/surface-owned/` |
| Public surface contracts | `packages/surfaces/src/public` |

## 4. Scope rule

Every task must declare:

- allowed files
- forbidden files
- allowed actions
- forbidden actions
- verification commands
- expected evidence output
- rollback or restore path when sensitive
- final decision vocabulary

No task may mix unrelated changes in one commit unless the scope explicitly proves they are inseparable.

## 5. Architecture guard

The architecture ladder is:

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

Rules:

- apps and app-shells host runtime wiring
- apps do not own duplicate design systems
- surfaces do not import Tamagui directly
- service-owned code owns service-specific surface logic
- surface-owned code owns shared surface experience
- public contracts must be used instead of deep imports when crossing ownership boundaries

## 6. UI and UX guard

Every UI/UX change must prove:

- BThwani identity alignment
- deepBlue `#0A2F5C`
- orange `#FF500D`
- white `#FFFFFF`
- no random palette drift
- RTL correctness for Arabic surfaces
- correct icon/text/action placement
- spacing, hierarchy, safe area, clipping, overflow
- state coverage: loading, empty, error, success, offline, retry where applicable
- screenshot or visual evidence for meaningful UI changes

No UI/UX claim is closed without visual evidence.

## 7. Flow guard

Every flow must define:

- entry point
- actor/role
- preconditions
- steps
- allowed actions
- success state
- error state
- empty state where relevant
- loading state where relevant
- offline/retry behavior where relevant
- exit/end state
- evidence that the flow works

## 8. API and contract guard

Any data or integration surface must define:

- request schema
- response schema
- error schema
- permissions
- versioning rule
- client binding
- contract tests or equivalent proof

When no API is required, the accepted proof is `NO_API_REQUIRED` with reason and owner scope.

## 9. Binding guard

Any screen or flow that displays runtime data must prove:

- data source
- data ownership
- loading state
- success state
- error state
- empty state
- retry/offline behavior when applicable
- stale data behavior when applicable
- runtime proof through logs, smoke test, or screenshot

## 10. Runtime guard

TypeScript success is not runtime success.

Runtime proof is required for surfaces affected by:

- navigation
- routing
- data binding
- permissions
- payment
- order lifecycle
- wallet/finance
- authentication
- UI/UX critical screens
- app-shell wiring

Accepted runtime proof includes logs, screenshots, smoke tests, or build/run evidence.

## 11. Test guard

Verification must match change type.

Minimum matrix:

| Change type | Required verification |
|---|---|
| docs only | status, diff check, applicable guards |
| TypeScript code | status, diff check, `pnpm -w exec tsc --noEmit` |
| UI/UX | typecheck, runtime/visual evidence, relevant guards |
| API/contracts | typecheck, contract proof, client binding proof |
| scripts | script safety review, dry run where destructive |
| governance | guards, evidence zip, scope isolation |
| CI | workflow syntax, local proxy checks where possible |

## 12. Security guard

Forbidden without explicit approval:

- secrets in repository
- real env values
- sensitive logging
- unreviewed GitHub write operations
- destructive scripts without dry run and owner approval
- force push
- branch deletion without archive proof
- credentials or tokens in evidence files

## 13. Git guard

Before and after changes:

- `git --no-pager status --short`
- `git --no-pager diff --check`
- staged diff check before commit
- explicit untracked file accounting
- commit only scoped paths
- push only after verification
- evidence zip generated inside run root and copied to Downloads when needed

## 14. CI/CD guard

CI should progress in stages:

1. report-only
2. block on guard Errors
3. classify warnings
4. promote selected warnings to Errors
5. require evidence summary in PR
6. reject unclassified new warnings in protected paths
7. enforce release gate only after baseline is stable

## 15. Visual regression guard

Meaningful UI/UX changes require:

- before/after screenshot when possible
- RTL visual check
- common viewport check
- key states visual check
- overflow/clipping check
- brand/token check
- surface consistency check

## 16. Patch review guard

Sensitive changes require patch review before final acceptance:

- scripts
- guards
- CI
- deletion
- migration
- auth/security
- payment/wallet
- public contracts
- shared architecture
- mass refactors

## 17. Warning classification

Every warning must eventually become one of:

- ACCEPTED_BASELINE
- FALSE_POSITIVE
- NEEDS_OWNER_DECISION
- NEEDS_FIX
- PROMOTE_TO_ERROR_LATER
- BLOCKS_CLEANUP

Unclassified warnings may not be treated as clean closure.

## 18. Allowed final decisions

Primary decisions:

- PASS
- PASS_WITH_WARNINGS
- FIX_REQUIRED
- BLOCKED
- READY_FOR_PR
- REVERT_REQUIRED
- NEEDS_EVIDENCE
- NEEDS_VISUAL_EVIDENCE

Additional governance-only internal classifications may exist, but final user-facing decisions must map back to the primary set.

## 19. Closure criteria

No `100%` closure unless all applicable items are true:

- scope clean
- working tree accounted for
- untracked files accounted for
- diff check pass
- typecheck pass when applicable
- tests/build pass when applicable
- runtime proof when applicable
- screenshot proof when UI/UX applicable
- evidence pack created
- warnings classified or explicitly carried forward
- decision recorded
- next step is unambiguous

## 20. Final rule

No UI without visual proof.
No flow without flow matrix.
No API without contract or `NO_API_REQUIRED`.
No binding without runtime proof.
No code without diff/typecheck proof.
No sensitive change without patch review.
No `100%` without evidence pack.