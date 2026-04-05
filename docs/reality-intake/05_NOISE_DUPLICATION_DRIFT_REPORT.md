# 05_NOISE_DUPLICATION_DRIFT_REPORT

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 02 - Repo Skeleton And Reality Intake Scaffolding`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 02 active`
- BlockingGaps: `Only initial high-level donor noise review has been performed`
- NextAllowed: `Use these findings as early caution, not final violation packs`

## Initial Noise Observations In Donor Repo

Observed high-noise roots or artifacts in `bthfinal` include:

- build output such as `dist/` and `.next/`
- installed dependency folders such as `node_modules/` and `.pnpm-store/`
- runtime root `runtime/`
- many one-off analysis and remediation scripts at the repo root
- backup and remediation artifacts at the repo root

## Initial Drift Risks

- donor surface naming differs from approved clean naming in at least `app-user` and `mcpw`
- donor repo already contains broad runtime, tools, contracts, services, apps, and package structures together in one mature tree
- blind copying from that tree would carry legacy decisions into the clean repo prematurely

## Initial Duplication Risks

- separate donor package roots such as `screen-catalog/` and `surfaces/` suggest a risk of overlapping screen-structure responsibility
- separate donor package roots such as `api-types/` and `api-clients/` suggest generated-layer coupling that must not be adopted blindly

## Current Target Repo Status

- `bthwani-suite` remains low-noise and bootstrap-scoped
- no donor folder trees have been copied into live target product roots
