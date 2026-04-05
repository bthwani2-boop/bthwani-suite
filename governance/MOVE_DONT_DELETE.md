# MOVE_DONT_DELETE

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 01 - Governance Freeze`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 01 active`
- BlockingGaps: `No quarantine snapshot has been needed yet`
- NextAllowed: `Snapshot before destructive removal`

## Move-Don't-Delete Rule

Destructive removal is not the default response to a mistaken or outdated artifact.

Before deleting a meaningful artifact, preserve traceable evidence first.

## Required Process

1. identify why the artifact is wrong, outdated, or misplaced
2. snapshot or move the artifact into a phase evidence quarantine location when needed
3. record the reason in the relevant phase evidence
4. only then remove the live copy if removal is truly necessary

## Bootstrap Quarantine Location Rule

During bootstrap, the preferred quarantine location is under the current session evidence root, for example:

- `kdt/volatile/registry/runs/{SESSION_ID}/phase-XX/quarantine/`

## Explicit Prohibition

- do not silently delete governance or bootstrap artifacts without evidence
- do not remove files in a way that destroys source trace
- do not bypass evidence just because the file looks small or temporary
