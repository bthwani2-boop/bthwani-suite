# 17_DONOR_MASTER_REFERENCES

## Mandatory Header

- WorkMode: `REFERENCE-ONLY MODE`
- CurrentPhase: `Phase 13 complete; Phase 14 next`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `donor master support references indexed and usage rules recorded`
- BlockingGaps: `Master files are broad support evidence and must still be filtered through target normalization`
- NextAllowed: `Use these files as support evidence only while Phase 14 proceeds`

## Master Files That Materially Touch DSH

## Contract Sovereignty

- `contracts/master/Master_OpenAPI.yaml`
  role: donor sovereign API definition for `dsh_*` paths
  usage rule: use as contract evidence only; do not treat it as automatic target contract truth before the lawful contract phases

- `contracts/operations_inventory.json`
  role: donor global operation inventory containing `dsh_*` operation IDs
  usage rule: use to confirm donor operation presence, not to override the normalized `13` operation-family model in the target repo

## Screen And Route Support

- `contracts/ui/Master_SCREENS_CATALOG.csv`
  role: donor global screen universe that exposes DSH screen sprawl
  usage rule: use as evidence for candidate discovery only; never adopt it as the clean target screen tree

- `contracts/routing/Master_SURFACE_ROUTE_MAP.json`
  role: donor route reference map spanning multiple surfaces and services
  usage rule: use to trace donor route distribution only; do not import donor route inflation into the target repo

## Traceability And Access

- `contracts/trace/Master_TRACEABILITY.csv`
  role: donor cross-service trace support file with DSH-related references
  usage rule: use as support evidence only because it is broader and noisier than service-local DSH traceability

- `contracts/rbac/RBAC_MATRIX.csv`
  role: donor global RBAC evidence for DSH actor and role access
  usage rule: use to confirm actor access patterns, not to infer clean target screens by itself

- `contracts/rbac/ABAC_MATRIX.csv`
  role: donor global ABAC evidence for conditional access and policy support
  usage rule: use as policy context only

## Runtime And Validation Support

- `contracts/runtime/Master_RUNTIME_VARS_CATALOG.csv`
  role: donor global runtime variable registry used by implemented donor slices
  usage rule: use only as donor runtime evidence until the lawful runtime phases open in the target repo

- `contracts/parity/parity_checks.json`
  role: donor parity support file
  usage rule: supporting evidence only

- `contracts/validation/validation_rules.json`
- `contracts/validation/schema_validation.json`
- `contracts/validation/data_validation.json`
  role: donor validation support files
  usage rule: supporting evidence only

## Clean Usage Rule

The donor master layer is useful for completeness and forensic trace.
It is not clean enough to replace:

- current normalized actor truth
- current normalized operation families
- current canonical screen set
- current target phase law