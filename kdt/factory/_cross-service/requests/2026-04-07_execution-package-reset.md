# Execution Package Reset Request

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Post-bootstrap execution reset`
- TargetService: `_cross-service`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `C:\Users\b\Documents\GitHub\bthwani-suite`
- LegacyRepo: `C:\Users\b\Documents\GitHub\bthfinal`
- PackStatus: `in_progress`
- BlockingGaps: `Old 08-14 phase manuals were weak and had to be replaced; downstream DSH packs remain mixed-depth and require later migration review`
- NextAllowed: `Publish reset pack, validate references, then migrate service-specific execution packs under the new model`

## Request Summary

Reject the old execution package as a literal execution reference, replace the weak 08-14 model with an execution-grade system, and publish a forensic pack that records the diagnostic, replacement strategy, architecture, registries, sequencing model, grouping model, and enforcement model.

## Scope

- Audit and classify the current execution package
- Replace weak canonical execution docs
- Replace phase manuals `08` through `14`
- Publish reset guidance for future service migrations

## Output Class

- implant-ready: `yes`
- reference-only: `no`
- evidence-only: `no`
- advisory-only: `no`