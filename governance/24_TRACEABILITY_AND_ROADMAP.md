# Traceability and Roadmap

**Status:** Canonical Governance Payload v2
**Owner:** `Roadmap Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** PLATFORM_BLUEPRINT_EXECUTION_ROADMAP, BTHWANI_GUIDE phases/waves/todolists, VERIFICATION_MATRIX

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Traceability purpose

Traceability prevents scattered work. Every requirement must map to source, owner, implementation path, evidence, and decision.

## Canonical traceability row

```text
id | source | requirement | owner file | implementation paths | evidence | status | next action
```

## Phase model

| Phase | Goal | Output |
|---|---|---|
| 0 Repo truth | branch/paths/status known | evidence snapshot |
| 1 Governance | owner rules closed | governance package + ledger |
| 2 Architecture | boundaries enforced | guard evidence |
| 3 UI/UX/Flow | screens/states mapped | visual/flow matrix |
| 4 Binding | API/client contracts mapped | binding matrix |
| 5 Runtime | logs/tests prove behavior | runtime evidence |
| 6 Production | readiness/ops/security | production pack |
| 7 PR/merge | branch ready | checkpoint evidence |

## Wave discipline

A wave must have:

- one objective,
- exact scope,
- forbidden scope,
- evidence,
- decision,
- next wave.

Do not bundle many unrelated tasks into one broad AI prompt.

## Roadmap closure

A roadmap item is closed only when:

- target files changed or no-change reason exists,
- verification ran,
- evidence saved,
- traceability updated,
- owner decision recorded.

## Anti-noise roadmap rule

Do not use roadmaps to postpone obvious fixes. Roadmap is for sequencing verified work, not hiding gaps.
