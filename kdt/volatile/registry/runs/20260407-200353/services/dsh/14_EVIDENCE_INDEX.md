# 14_EVIDENCE_INDEX

| Artifact | Purpose | Primary Source Basis | Status | Notes |
| --- | --- | --- | --- | --- |
| `00_SERVICE_EXTRACTION_SCOPE.md` | lock the current DSH extraction scope | current request + inherited run inputs | active | current run authority |
| `01_DONOR_SOURCE_INDEX.md` | donor root inventory | inherited accepted step-1 file | active | copied then updated for current evidence root |
| `02_DONOR_EXHAUSTIVE_CENSUS.csv` | raw donor census | inherited accepted census | active | copied into current run |
| `03_ACTOR_CONTEXT_MASTER.csv` | clean actor and context truth | donor scope + UX flow + coverage + RBAC | active | normalized to approved target surface names |
| `04_MASTER_OPERATION_REGISTRY.csv` | canonical operation families | donor operation catalog + UX flow + census | active | compressed families with trace preserved |
| `05_SURFACE_COVERAGE_MATRIX.csv` | clean surface participation | donor coverage + RBAC + MCPW map | active | explicit control-panel narrowing |
| `06_JOURNEY_MASTER.csv` | journey truth | donor UX flow + operation families + coverage | active | includes mainline, recovery, proxy, and optional field branch |
| `07_MASTER_SCREEN_REGISTRY.csv` | retained clean screen set | target preview candidates + donor aliases | active | 20 retained screens |
| `08_SCREEN_STATE_MATRIX.csv` | screen state coverage | retained screen set + foundation flow + donor failure pressure | active | used again by docs/services pack |
| `09_BINDING_AND_RUNTIME_NOTES.md` | binding and runtime classification | donor controller + api clients + runtime vars | active | reference-only vs extract-partial decisions recorded |
| `10_DISPOSITION_MATRIX.csv` | adoption and rebuild decisions | KDT synthesis + target-fit review | active | target paths explicit |
| `11_DONOR_DRIFT_DUPLICATION_REPORT.md` | donor drift and anti-pattern report | source index + census + donor docs | active | numeric drift and boundary leakage recorded |
| `12_EXTRACTION_COUNTS.json` | measurable counts | current run statistics | active | donor and canonical counts separated |
| `13_BLOCKERS.md` | blocker register | current run synthesis | active | no hidden blockers |

## Source Anchors

- `C:/Users/b/Documents/GitHub/bthfinal/services/dsh/governance/DSH_SERVICE_SCOPE.md`
- `C:/Users/b/Documents/GitHub/bthfinal/services/dsh/governance/DSH_UX_FLOW.md`
- `C:/Users/b/Documents/GitHub/bthfinal/services/dsh/governance/DSH_COVERAGE_MATRIX.csv`
- `C:/Users/b/Documents/GitHub/bthfinal/services/dsh/governance/DSH_OPERATION_CATALOG.csv`
- `C:/Users/b/Documents/GitHub/bthfinal/services/dsh/governance/DSH_RBAC_MATRIX.csv`
- `C:/Users/b/Documents/GitHub/bthfinal/services/dsh/governance/DSH_MCPW_SECTION_MAP.csv`
- `C:/Users/b/Documents/GitHub/bthfinal/services/dsh/src/controllers/dsh.controller.ts`
- `C:/Users/b/Documents/GitHub/bthfinal/packages/api-clients/src/dsh/dsh-orders-api.ts`
- `C:/Users/b/Documents/GitHub/bthfinal/runtime/vars/dsh/shein-proxy.yaml`
- `C:/Users/b/Documents/GitHub/bthwani-suite/packages/surfaces/src/dsh/catalog.ts`

## Current Evidence Verdict

- inherited evidence carried forward: `PASS`
- current-run KDT completion: `PASS`
- ready for `docs/services/dsh` handoff: `PASS`