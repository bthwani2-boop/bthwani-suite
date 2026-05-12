# Repository Boundaries

**Status:** Canonical Governance Payload v2
**Owner:** `Repository Governance`

## Canonical active roots

| Root | Role | May contain policy? |
|---|---|---|
| `governance/` | Canonical policy/control plane | Yes |
| `.agents/` | Agent execution, skills, adapters | No, operational guidance only |
| `app-client/runtime` | Client mobile runtime shell | No, implementation only |
| `app-partner/runtime` | Partner mobile runtime shell | No |
| `app-captain/runtime` | Captain mobile runtime shell | No |
| `app-field/runtime` | Field mobile runtime shell | No |
| `control-panel/runtime` | Control panel runtime shell | No |
| `webapp/runtime` | Web app runtime shell | No |
| `website/runtime` | Marketing site runtime shell | No |
| `ui-kit` | Design/component authority | Technical source, not governance policy |
| `dsh/`, `wlt/`, `knz/`, `arb/`, `amn/`, `esf/`, `mrf/`, `snd/`, `kwd/` | Service roots | Technical source, not governance policy |
| `tools/guards/` | Guard implementation | Derived verification only |
| `tools/registry/runs/` | Evidence output and historical review runs | Evidence only |
| `.github/workflows` | CI implementation | Derived from governance |

## Retired locations

| Root | Status | Rule |
|---|---|---|
| `docs/governance` | Retired policy location | Must not be active authority. |
| `kdt/volatile/registry/runs` | Retired evidence location | Do not create new evidence there. |

## Retired path patterns

- nested mobile app roots from earlier layouts
- nested web app roots from earlier layouts
- packages-based UI/surface/app-shell roots from earlier layouts

## Forbidden root behavior

- No policy duplication outside `governance/`.
- No app-local design system that competes with `@bthwani/ui-kit`.
- No surface-local API contract that competes with `contracts/master`.
- No generated evidence treated as policy.
- No `.github` workflow introducing governance rules not defined here.
- No retired GitHub-side agent roots as active agent sources.
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
rg "docs/governance|kdt/volatile|\\.github/" .
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
