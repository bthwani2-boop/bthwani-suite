# Repository Boundaries

**Status:** Canonical Governance Payload v2
**Owner:** `Repository Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** DOCS_GOVERNANCE_* policies, GOVERNANCE_CONTROL_PLANE_STANDARD, ARCHITECTURE_LOCK

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Canonical active roots

| Root | Role | May contain policy? |
|---|---|---|
| `governance/` | Canonical policy/control plane | Yes |
| `apps/mobile/app-client` | Client mobile app shell | No, implementation only |
| `apps/mobile/app-partner` | Partner mobile app shell | No |
| `apps/mobile/app-captain` | Captain mobile app shell | No |
| `apps/mobile/app-field` | Field mobile app shell | No |
| `apps/web/control-panel` | Control panel app shell | No |
| `apps/web/webapp` | Web app shell | No |
| `apps/web/website` | Marketing site shell | No |
| `packages/ui-kit` | Design/component authority | Technical source, not governance policy |
| `packages/surfaces` | Surface/service-owned UI flows | Technical source, not governance policy |
| `packages/app-shells` | App shell composition | Technical source, not governance policy |
| `packages/api-types` | Generated/shared API types | Derived from contracts |
| `packages/api-clients` | API clients | Derived from contracts/runtime binding |
| `services/*` | Backend/service implementations | Technical source |
| `contracts/master` | Contract source for public APIs | Contract truth |
| `tools/guards` | Guard implementation | Derived from governance |
| `tools/registry/runs` | Evidence output | Evidence only |
| `.github/workflows` | CI implementation | Derived from governance |
| `.github/agents`, `.github/skills` | Agent/skill definitions | Derived from governance |

## Transitional roots

| Root | Status | Rule |
|---|---|---|
| `docs/governance` | Legacy/transitional | Must not be active authority. Migrate or remove references. |
| `kdt/volatile/registry/runs` | Legacy evidence root | Do not create new evidence there. |
| `governance/governance-legacy` | Source archive only | Must not be active policy after package application. |

## Forbidden root behavior

- No policy duplication outside `governance/`.
- No app-local design system that competes with `@bthwani/ui-kit`.
- No surface-local API contract that competes with `contracts/master`.
- No generated evidence treated as policy.
- No `.github` workflow introducing governance rules not defined here.
- No old repo/path named standalone `bth` as active target.

## Boundary proof

For a boundary-sensitive change, evidence must include:

```powershell
git branch --show-current
git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
git ls-files --others --exclude-standard
```

Plus targeted scans:

```powershell
rg "from ['\"]tamagui['\"]" apps packages/surfaces
rg "docs/governance|kdt/volatile|governance-legacy" .
rg "export \*" packages/ui-kit/src packages/surfaces/src
```

## Deletion and movement rule

Deleting, moving, or quarantining a root requires:

- inventory,
- references scan,
- consumer impact note,
- rollback plan,
- evidence pack,
- explicit owner decision.
