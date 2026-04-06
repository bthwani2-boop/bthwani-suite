# BTHWANI GUIDE — Post-Bootstrap Gate Pack

## 1. Purpose

This file defines the pass or fail thresholds for Phases `08` through `24`.

It exists because bootstrap gates are intentionally limited to Phases `00` through `07`.
Post-bootstrap work needs its own gate discipline for:

- surface activation
- screen grouping
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
- usable execution depth
- coherence with adjacent artifacts
- lawful phase boundaries
- explicit blockers where partial readiness is allowed

## 4. Service-Truth Gates

### GATE_PHASE_08_10_SERVICE_TRUTH

#### Required artifacts

- actor/context pack for the current service
- operations pack for the current service
- surface-responsibility pack for the current service

#### Pass conditions

- participating actors are explicit
- excluded actors are explicit
- every critical operation has one owner
- every approved surface is classified explicitly
- `app-field` is explicitly `REQUIRED`, `OPTIONAL`, or `OUT`
- the current surface activation order is explicit

#### Fail conditions

- actor visibility is inferred from donor habit only
- operations overlap or duplicate under multiple names
- `control-panel` is being used as a catch-all for unresolved ownership
- surface activation waves are still implicit

### GATE_FIRST_SURFACE_READINESS

#### Required artifacts

- surface activation plan
- journey lock for the active branch
- target thin app shell if preview navigation is required

#### Pass conditions

- the first surface is the one that starts the primary job
- its screen-group entry order is explicit
- no downstream surface is being opened because it is easier to mock

#### Fail conditions

- the first opened surface is a reporting or control surface with no primary-job justification
- the first surface still lacks clear entry conditions

## 5. Screen-Layer Gates

### GATE_PHASE_11_14_SCREEN_ENTRY

#### Required artifacts

- journey pack
- UI Kit foundation compatibility review
- screen group plan
- screen catalog
- screen purpose lock when Phase `13` is in scope
- flow compression artifacts when Phase `14` is in scope

#### Pass conditions

- happy path, failure path, and recovery path are documented
- UI Kit Foundation Compatibility Review is `PASS` or bounded `PARTIAL`
- current-wave candidate coverage is complete enough for the active scope
- screen groups are explicit
- every candidate is classified
- route minimization decisions are explicit once compression begins

#### Fail conditions

- preview begins before Journey Lock
- candidate screens exist without grouping or rationalization
- UI Kit readiness is assumed rather than reviewed
- preview registry contains bound logic or runtime truth

### GATE_FIRST_SCREEN_GROUP_READINESS

#### Required artifacts

- current surface wave declaration
- screen group plan
- candidate catalog for the current group
- preview registry notes

#### Pass conditions

- the first group is `entry-discovery` or the first lawful `core-task` group when no discovery exists
- fixtures-only preview scope is explicit
- preview routes are separated from real bound routes
- current group blockers are explicit

#### Fail conditions

- `secondary-optional` opens before the primary path is defined
- Expo Go is being used as proof instead of preview

### GATE_NEXT_SURFACE_UNLOCK

#### Required artifacts

- current-surface purpose lock
- state coverage minimum for the current surface
- UI Kit blocker log or explicit no-blocker result

#### Pass conditions

- the current surface has clear primary flow and purpose
- minimum state coverage is defined
- unresolved ambiguity is not being pushed downstream

#### Fail conditions

- teams are opening the next surface to avoid unresolved work on the current one

### GATE_CONTROL_PANEL_WAVE_UNLOCK

#### Required artifacts

- current wave packs for initiating and execution surfaces
- ops-facing journey notes or staff flow
- control-panel scope note

#### Pass conditions

- `control-panel` opens for oversight, intervention, or governance only
- control-panel screens are not standing in for missing upstream task screens

#### Fail conditions

- control-panel is opened first because it is easier to demo
- control-panel mirrors service execution instead of governing it

### GATE_OPTIONAL_SURFACE_UNLOCK

#### Required artifacts

- surface classification showing `OPTIONAL`
- upstream wave packs showing primary path stability
- explicit reason to open the optional surface now

#### Pass conditions

- the optional surface adds real value without replacing unresolved core lifecycle work

#### Fail conditions

- optional surfaces are opened while core waves remain ambiguous

## 6. UI Kit Gates

### GATE_UI_KIT_FOUNDATION_READINESS

#### Required artifacts

- UI Kit Foundation Compatibility Review
- UI Kit foundation evidence from bootstrap

#### Pass conditions

- tokens, spacing, typography, direction, primitives, and state shells are covered enough for the next screen group
- no service-specific leakage exists in `packages/ui-kit/`

#### Fail conditions

- readiness is claimed without review
- business logic or service widgets entered the foundation layer

### GATE_UI_KIT_EXPANSION_READINESS

#### Required artifacts

- UI Kit Expansion Review
- current screen-group notes

#### Pass conditions

- new shared patterns are justified by retained screen demand
- no duplicate family exists
- direction correctness remains intact

#### Fail conditions

- speculative shared patterns are added
- temporary hacks were promoted into shared law

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