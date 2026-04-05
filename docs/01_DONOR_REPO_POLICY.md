# 01_DONOR_REPO_POLICY

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 00 - Repo Reset Decision`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 00 active`
- BlockingGaps: `Legacy donor path is not recorded in this repo yet`
- NextAllowed: `Use this donor policy as the boundary for all later donor consultation`

## Donor Policy

The legacy repository `bthfinal` is a governed donor and reference source only.

Its role is limited to:

- reading and inspection
- comparison against new-repo needs
- selective extraction planning
- anti-pattern discovery
- naming recovery when needed
- evidence-backed source tracing

It is not allowed to function as:

- the active build line
- the source of automatic structure inheritance
- a folder tree to copy wholesale into `bthwani-suite`
- a justification for skipping bootstrap phase boundaries

## Allowed Donor Operations

- read files for evidence
- compare old structure against a defined new-repo need
- extract facts into packs or notes
- classify carryover candidates as `REBUILD_CLEAN`, `EXTRACT_PARTIAL`, `REFERENCE_ONLY`, or `REJECT`

## Forbidden Donor Operations

- blind copy of donor app folders
- blind copy of donor service folders
- blind copy of donor shared packages
- donor naming leakage into clean outputs when approved new-repo naming already exists
- treating donor contracts as automatic new sovereignty
- implementing new work in the donor repo instead of `bthwani-suite`

## Naming Normalization Rule

When legacy donor names appear in source trace, preserve them for forensic clarity only.

When preparing clean adoption-facing output, normalize known legacy names as follows:

- `mcpw` -> `control-panel`
- `app-user` -> `app-client`

## Source Trace Rule

Every important donor-derived claim should be backed by one or more of:

- donor file path
- donor module path
- donor contract path
- donor screen path
- repeated pattern occurrence
- evidence note in this repo

If a fact is not directly observed, mark it as `inferred`, `tentative`, or `[TBD]`.

## Current Donor Path Status

- donor repo name: `bthfinal`
- donor local filesystem path: `C:\Users\b\Documents\GitHub\bthfinal`
- status: repo identity and current local path are recorded

## Enforcement Rule

Any later phase that consults the donor repo must start from a concrete new-repo need first.

Correct order:

1. define what `bthwani-suite` needs
2. inspect the donor for a narrow relevant source
3. classify the source candidate
4. rebuild clean or extract partially
5. verify target fit in `bthwani-suite`
