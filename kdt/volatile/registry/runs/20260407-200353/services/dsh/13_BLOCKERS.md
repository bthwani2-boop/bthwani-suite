# 13_BLOCKERS

## Active Blockers

### B01 - Donor Operation Count Drift

- severity: `major`
- confirmed fact: donor uses `92`, `96`, and `98` as competing DSH operation counts
- impact: blocks any claim of donor numerical coherence
- current handling: recorded, not hidden
- closure condition: one reconciled count note or explicit split note is added to the next closure-grade DSH pack

### B02 - Shadow Governance Parity Unproven

- severity: `major`
- confirmed fact: donor `service-level` files duplicate core governance files
- impact: blocks silent reuse of shadow files as equal authority
- current handling: parent governance root is primary; shadow root is secondary only
- closure condition: parity diff is proven or shadow copy is permanently kept reference-only

### B03 - Internal Boundary Risk Around Finance And Partner Store Routes

- severity: `major`
- confirmed fact: donor MCPW includes `finance/dsh`, `partner/store`, and `analytics/dsh-orders`
- impact: risks making `control-panel` a second execution owner and blurring the `DSH`/`WLT` boundary
- current handling: all such carryovers remain governance-only or `[TBD]`
- closure condition: explicit target ownership verdict is recorded in future fit review

### B04 - No Clean Target Service Layer Exists Yet

- severity: `minor`
- confirmed fact: `services/dsh/` does not exist in the target repo
- impact: service method targets remain planned only
- current handling: execution pack records deferred target paths without opening implementation
- closure condition: later lawful binding and service phases open the service layer

## Non-Blockers

- current target preview route registry exists and is sufficient for clean screen candidate naming
- current lack of runtime code is lawful at this stage
- current lack of contract deltas is lawful at this stage

## Current Verdict

- KDT completion blocked by hidden ambiguity: `NO`
- KDT completion blocked by recorded unresolved drift: `NO`
- clean execution pack may proceed with explicit recorded blockers: `YES`