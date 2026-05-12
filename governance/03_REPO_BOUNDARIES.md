# Repository Boundaries

**Status:** Canonical Governance Payload v2
**Owner:** `Repository Governance`
**Canonical repo:** `C:\bthwani-suite`
**Execution branch context:** runtime-detected from Git; do not hardcode branch truth.
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** DOCS_GOVERNANCE_* policies, GOVERNANCE_CONTROL_PLANE_STANDARD, ARCHITECTURE_LOCK

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Canonical active roots

| Root | Role | May contain policy? |
|---|---|---|
| `governance/` | Canonical policy/control plane | Yes |
| `app-client` | Client mobile app shell | No, implementation only |
| `app-partner` | Partner mobile app shell | No |
| `app-captain` | Captain mobile app shell | No |
| `app-field` | Field mobile app shell | No |
| `control-panel` | Control panel app shell | No |
| `webapp` | Web app shell | No |
| `website` | Marketing site shell | No |
| `ui-kit` | Design/component authority | Technical source, not governance policy |
| `<service>/frontend` | Service-owned surface flows | Technical source, not governance policy |
| `<service>/backend` | Service-local contracts and typed clients | Derived from contracts/runtime binding |
| `tools/guards` | Guard implementation | Derived from governance |
| `tools/registry/runs` | Evidence output | Evidence only |
| `.github/workflows` | CI implementation | Derived from governance |
| `.github/agents`, `.github/skills` | Agent/skill definitions | Derived from governance |

## Transitional roots

| Root | Status | Rule |
|---|---|---|
| `docs/governance` | Legacy/transitional | Must not be active authority. Migrate or remove references. |
| `kdt/volatile/registry/runs` | Legacy evidence root | Do not create new evidence there. |
| `governance/governance-legacy` | Retired donor root | Removed after extraction; any reintroduction is archive-only and non-authoritative. |

## Legacy bridge roots

- legacy nested mobile app roots from earlier layouts
- legacy nested web app roots from earlier layouts
- legacy packages-based UI/surface/app-shell roots from earlier layouts

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
rg "from ['\"]tamagui['\"]" app-client app-partner app-captain app-field control-panel webapp website dsh wlt knz arb amn esf mrf snd kwd
rg "docs/governance|kdt/volatile|governance-legacy" .
rg "export \*" ui-kit/src dsh/frontend
```

## Deletion and movement rule

Deleting, moving, or quarantining a root requires:

- inventory,
- references scan,
- consumer impact note,
- rollback plan,
- evidence pack,
- explicit owner decision.
