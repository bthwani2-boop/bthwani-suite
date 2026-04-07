# BTHWANI GUIDE — Post-Bootstrap Gate Pack

## 1. Purpose

This file defines the pass or fail thresholds for Phases `08` through `24`.

Post-bootstrap work needs gate discipline for:

- donor-exhaustive recovery
- master-registry completeness
- wave and grouping legality
- screen-spec completeness
- UI Kit readiness
- preview and Expo Go boundaries
- contract readiness
- binding readiness
- runtime truth readiness
- production-like proof

## 2. How To Use This Gate Pack

For any phase from `08` through `24`:

1. execute the matching phase manual
2. review the relevant gate section below
3. verify required artifacts and evidence
4. stop if any fail condition applies
5. do not open the next wave or phase merely because files exist

## 3. Gate Quality Rule

No gate passes on file existence alone.

Every gate review must confirm:

- artifact existence
- non-placeholder content
- exact required schema fields
- usable execution depth
- coherence with adjacent artifacts
- donor-coverage proof where required
- completeness counts, duplicate checks, orphan checks, unmapped checks, contradiction checks, and handoff-integrity checks

## 4. Recovery And Registry Gates

### GATE_PHASE_08_ACTOR_CONTEXT_EXHAUSTIVE_EXTRACTION

#### Required artifacts

- `DONOR_EXHAUSTIVE_CENSUS`
- `ACTOR_CONTEXT_MASTER`
- entitlement and visibility rules
- evidence index

#### Pass conditions

- participating actors are explicit
- excluded actors are explicit
- every approved surface has explicit actor legality
- actor/context rows trace back to donor or target evidence
- unresolved actor contradictions are marked `BLOCKED` rather than hidden

#### Fail conditions

- actor visibility is inferred from donor habit only
- any approved surface lacks actor coverage
- donor actor references remain unmapped or unnamed

### GATE_PHASE_09_OPERATION_MASTER_EXTRACTION

#### Required artifacts

- updated `DONOR_EXHAUSTIVE_CENSUS`
- `MASTER_OPERATION_REGISTRY`
- operation duplicate and alias report
- evidence index

#### Pass conditions

- every donor operation row is mapped, rejected, or explicitly deferred
- every canonical operation has one owner
- every canonical operation has one classification and one naming decision
- duplicate canonical names are eliminated
- entry triggers and state effects are explicit enough for surface mapping

#### Fail conditions

- donor operations remain unmapped silently
- duplicate or overlapping canonical operations remain
- operations lack owners, classifications, or source traces

### GATE_PHASE_10_SURFACE_COVERAGE_AND_WAVE_MATRIX

#### Required artifacts

- `SURFACE_COVERAGE_MATRIX`
- `SCREEN_WAVE_MATRIX`
- `OPERATION_TO_SURFACE_CHAIN`
- surface wave decisions

#### Pass conditions

- every approved surface is classified explicitly
- every canonical operation has a lawful surface chain
- `app-field` is explicitly `REQUIRED`, `OPTIONAL`, or `OUT`
- wave order is explicit
- shell-readiness expectations are explicit for any surface that may need preview

#### Fail conditions

- surfaces remain implicit
- wave order is still implied rather than written
- `control-panel` is being used as a catch-all for unresolved ownership

### GATE_PHASE_11_JOURNEY_CHAIN_MASTER

#### Required artifacts

- `JOURNEY_MASTER`
- route entrypoint and transition matrix
- journey risks and blockers

#### Pass conditions

- happy path is explicit
- failure path is explicit
- recovery path is explicit
- support or staff intervention is explicit when relevant
- every canonical operation belongs to at least one journey or explicit no-journey note

#### Fail conditions

- a primary journey branch is still inferred rather than written
- failure or recovery is missing on a critical path
- operations are orphaned outside the journey set

### GATE_PHASE_12_SCREEN_MASTER_CENSUS_AND_NORMALIZATION

#### Required artifacts

- updated `DONOR_EXHAUSTIVE_CENSUS`
- `MASTER_SCREEN_REGISTRY`
- unit classification and normalization report
- duplicate or orphan screen report

#### Pass conditions

- donor UI recovery is exhaustive for the active service scope
- every retained screen has a canonical name and a unit type
- every donor screen or unit is mapped, converted, moved to legacy, or rejected explicitly
- no unnamed retained screen remains
- no orphan screen remains without an operation or journey relation

#### Fail conditions

- screen census is selective or reactive only
- donor screen or unit counts are missing or contradictory with no blocker note
- retained screens still lack canonical naming or unit typing

### GATE_PHASE_13_SCREEN_SPEC_AND_PURPOSE_SYSTEM

#### Required artifacts

- `SCREEN_SPEC_PACKS`
- `SCREEN_SPEC_INDEX`
- `OPERATION_TO_SCREEN_CHAIN`
- spec gaps and blockers report

#### Pass conditions

- every retained screen has one spec file
- every retained screen has one primary purpose and one primary CTA or explicit no-primary-CTA reason
- required states, data blocks, interaction rules, validation rules, and acceptance rules are explicit
- every retained screen maps back to the operation and journey chain cleanly

#### Fail conditions

- retained screens exist without specs
- screens still carry two competing primary jobs
- state requirements remain vague or absent

### GATE_PHASE_14_GROUPING_AND_BUILD_ORDER

#### Required artifacts

- `SCREEN_GROUPING_PLAN`
- `BUILD_ORDER_PLAN`
- dependency lane map
- conversion and compression decisions
- manual execution order

#### Pass conditions

- every retained screen belongs to exactly one group and one build step
- dependency lanes are explicit
- preview, implementation, validation, and seal order are explicit
- conversion and compression decisions are written after registry and spec completion

#### Fail conditions

- build order is implied instead of written
- retained screens are missing from grouping or build order
- dependency cycles remain unresolved

## 5. UI Kit Gates

### GATE_UI_KIT_FOUNDATION_READINESS

#### Required artifacts

- UI Kit Foundation Compatibility Review
- UI Kit foundation evidence from bootstrap

#### Pass conditions

- tokens, spacing, typography, direction, primitives, and state shells are covered enough for the next retained screen group
- no service-specific leakage exists in `packages/ui-kit/`

#### Fail conditions

- readiness is claimed without review
- business logic or service widgets entered the foundation layer

### GATE_UI_KIT_EXPANSION_READINESS

#### Required artifacts

- UI Kit Expansion Review
- current screen-spec evidence
- current build-order evidence

#### Pass conditions

- new shared patterns are justified by retained screen demand
- no duplicate family exists
- direction correctness remains intact

#### Fail conditions

- speculative shared patterns are added
- temporary hacks were promoted into shared law

## 6. Screen Expansion And Contract-Demand Gates

### GATE_PHASE_15_UI_KIT_EXPANSION

#### Required artifacts

- `UI_KIT_EXPANSION_REVIEW`
- `SHARED_PATTERN_DEMAND_MATRIX`
- `NEW_SHARED_PATTERNS`
- duplicate family check

#### Pass conditions

- every shared addition traces back to retained screens and explicit build-order demand
- duplicate family count is `0`
- service-specific widgets did not enter `packages/ui-kit/`
- unresolved expansion blockers are explicit rather than hidden in prose

#### Fail conditions

- speculative shared patterns are added with no retained-screen trace
- a local workaround is promoted into shared law without multi-screen proof
- shared additions outrun grouping or build-order truth

### GATE_PHASE_16_STATE_LOCK

#### Required artifacts

- `STATE_COVERAGE_MATRIX`
- `SCREEN_STATE_ANATOMY`
- state handling notes

#### Pass conditions

- every in-scope retained screen has explicit required-state coverage
- critical state behavior is explicit for loading, empty, error, authorization, stale, and success conditions when relevant
- retry, fallback, and no-fallback rules are explicit where they matter

#### Fail conditions

- state names exist without behavior rules
- critical states are skipped because they are inconvenient
- retained screens are missing state anatomy rows

### GATE_PHASE_17_SCREEN_API_MATRIX

#### Required artifacts

- `SCREEN_API_MATRIX`
- aggregation and overfetch notes
- limited-api preview boundary note when any bounded preview is justified

#### Pass conditions

- every in-scope retained screen has explicit read, write, summary, or aggregation demand rows
- every demand row maps back to retained screens and lawful operation chains
- any limited-api preview remains explicitly bounded and non-proof-bearing

#### Fail conditions

- screen demand stays vague or generic
- limited-api preview is implied rather than bounded in writing
- demand rows exist without retained-screen linkage

### GATE_PHASE_18_GAP_MAP

#### Required artifacts

- `GAP_MAP`
- contract pressure notes
- contract readiness decision

#### Pass conditions

- every gap is tied to a concrete screen, flow, or state pressure
- severity and required change are explicit
- contract blockers are explicit enough to judge Phase `19` readiness

#### Fail conditions

- the gap set contains vague complaints instead of actionable rows
- contract edits are implied before the gap set is complete
- unresolved unnamed gaps remain

## 7. Contract And Binding Gates

### GATE_CONTRACT_READINESS

#### Required artifacts

- Screen/API Matrix
- Gap Map
- contract-update request summary

#### Pass conditions

- every proposed contract change is screen-proven
- naming is clean
- auth and error shape implications are explicit

#### Fail conditions

- contract work is preference-driven
- donor naming leaks into the proposed change set

### GATE_GENERATE_VERIFY_READINESS

#### Required artifacts

- updated canonical contract
- generation scope
- verify plan

#### Pass conditions

- the contract is stable enough to generate from
- generation is reproducible
- parity checks are defined

#### Fail conditions

- generation is attempted from an unstable or partially normalized contract

### GATE_BINDING_READINESS

#### Required artifacts

- generated layer verify report
- binding-chain map
- proxy necessity notes when relevant

#### Pass conditions

- canonical operations have a single explicit chain
- raw fetch is absent from canonical paths
- proxy use is justified rather than habitual

#### Fail conditions

- multiple competing chains exist for one operation
- raw fetch remains on the canonical path

## 8. Runtime And Proof Gates

### GATE_RUNTIME_TRUTH_READINESS

#### Required artifacts

- truth-source register
- truth classification file
- runtime availability lock

#### Pass conditions

- runtime truth sources are explicit
- non-truth sources are explicit
- availability behavior is explicit for critical paths

#### Fail conditions

- fixtures or simulated responses are still acting as hidden truth on canonical paths

### GATE_PRODUCTION_LIKE_PROOF

#### Required artifacts

- verification scope
- end-to-end results
- propagation verification matrix when propagation matters
- runtime health report

#### Pass conditions

- happy path, failure path, and recovery path are proven
- all required participating surfaces are proven
- lifecycle-correct propagation is verified where relevant
- runtime health and functional correctness are both explicit

#### Fail conditions

- proof is claimed from browser-only or fixture-only review
- same-second simultaneity is being mistaken for correct lifecycle propagation

## 9. Exit Note

Phases `25` through `27` are closure phases rather than post-bootstrap growth gates.

Use:

- the main guide
- the phase manuals for `PHASE_25` through `PHASE_27`

to seal evidence, quarantine donor leftovers, and unlock the next service.