# BTHWANI GUIDE — Binding And Runtime Execution Runbook

## 1. Purpose

This runbook converts the governing law into literal execution grammar for Phases `19` through `24`.

It answers these questions generically for any service:

- when contract work becomes lawful
- how generated layers are validated
- how canonical binding is introduced
- when a proxy is truly necessary
- how runtime truth is classified
- when production-like proof is lawful

## 2. Scope And Authority

This runbook governs:

- Phase `19` Master Contract Update
- Phase `20` Generate / Verify
- Phase `21` Binding Lock
- Phase `22` Runtime Truth Lock
- Phase `23` Runtime Mode Policy
- Phase `24` Production-Like Verification

This runbook does not govern:

- screen inventory and preview setup before Phase `19`
- bootstrap creation order
- final closure and next-service unlock after Phase `24`

When this runbook and a phase manual overlap:

- this runbook owns cross-phase binding and runtime grammar
- the phase manual owns the exact order inside the current phase

## 3. Preconditions Before Contract Work Begins

Do not start Phase `19` unless all of the following are true:

- retained screens are purpose-locked enough to express demand clearly
- state coverage is explicit for critical paths
- Screen/API Matrix exists for in-scope screens
- Gap Map exists and translates screen pressure into contract work
- the post-bootstrap gate pack marks contract readiness as passed

If the screen layer is still ambiguous, contract work is premature.

## 4. Contract Readiness Checklist

Before changing `contracts/master/`, confirm:

- every proposed contract change traces back to screen demand or gap evidence
- operation names align with service ownership
- schema names align with clean naming
- error shapes are explicit and consistent
- auth or trust boundary is explicit
- donor names do not leak into canonical contract truth

If any of these are missing, stop and resolve them before editing the contract.

## 5. Contract Update Order

Use this order in Phase `19`:

1. open the contract-update request and pack
2. list proposed changes before touching canonical contract files
3. normalize names and error shapes before writing YAML or JSON changes
4. update the canonical contract only after the change set is explicit
5. record schema and operation diffs in the phase pack
6. verify that no donor naming or rogue endpoint naming leaked into the result

Do not reverse this order by editing the contract first and explaining it later.

## 6. Generate / Verify Order

Use this order in Phase `20`:

1. define the generation scope
2. generate types and clients from the canonical contract
3. verify parity between generated output and contract truth
4. verify error typing explicitly
5. record all drift or explain why drift is zero
6. reject hand-edited generated truth as canonical

Generation is valid only when it is reproducible.

## 7. Canonical Binding Chain

Every canonical operation must have one lawful primary chain:

`Screen -> ViewModel or Hook -> API Client -> Proxy if needed -> Controller -> Service -> Repository -> Runtime Truth -> Audit or Trace`

Rules:

- one operation must not have multiple hidden competing chains
- one screen must not bypass the chain with raw fetch
- one surface must not invent private contract law for the same operation
- helpers are allowed only if they preserve the same ownership and trace path

## 8. Proxy Necessity Test

A proxy is justified only when at least one of the following is true:

- secret protection is required
- auth normalization is required
- provider switching must remain backend-owned
- same-origin or domain policy requires it
- cross-source orchestration must happen off-surface
- audit or policy enforcement must happen centrally

A proxy is not justified when it only mirrors upstream shape without policy value.

## 9. Raw Fetch Prohibition Test

The following are forbidden on canonical bound paths:

- raw fetch inside canonical screens
- screen-local schema rewriting used as substitute contract law
- surface-specific action chains that bypass the approved client
- donor-era adapters kept alive only because removing them feels risky while they still violate clean ownership

## 10. Runtime Truth Classification Ladder

Every preview or runtime path should be classified as one of:

- `fixture`
- `simulated response`
- `runtime seed`
- `limited-api preview`
- `canonical local truth`
- `production-like proof`

Rules:

- a lower class may support review
- a lower class may not claim a higher-class result
- no canonical path may hide its truth classification

## 11. Runtime Mode Policy Ladder

Keep these modes distinct:

- visual-only preview
- limited-api preview
- canonical local truth
- production-like proof

Production-like proof is never implied by the presence of a running server, app shell, preview route, or limited API wiring.

## 12. Transition Rule: Preview To Contract

Preview work hands off to contract work only when:

- the shortest lawful path is screen-complete enough to describe actual reads and writes
- state coverage is explicit
- contract pressure is written in the Gap Map
- the contract readiness gate has passed

## 13. Transition Rule: Contract To Generated Layers

Do not generate from drafts.

Move from Phase `19` to Phase `20` only when:

- the canonical contract is updated
- the contract change set is recorded
- naming is normalized
- the gate pack marks generate/verify readiness as passed

## 14. Transition Rule: Generated Layers To Binding

Do not bind screens while generation still has unresolved drift.

Binding becomes lawful only when:

- generated layers are reproducible
- parity is verified
- error typing is explicit
- the binding readiness gate has passed

## 15. Transition Rule: Binding To Runtime Truth

Do not treat bound UI alone as runtime truth.

Runtime truth work becomes lawful only when:

- the canonical chain exists for critical operations
- runtime source candidates are identified
- truth classification can be written explicitly
- the runtime truth readiness gate has passed

## 16. Production-Like Verification Model

Production-like verification must prove:

- happy path
- failure path
- recovery path
- staff or internal path when relevant
- all required participating surfaces
- persistence and storage behavior when truly needed
- lifecycle-correct propagation rather than naive same-second simultaneity

The verification pack must keep runtime health separate from functional proof.

## 17. Proof Claim Ladder

Do not claim:

- `end-to-end working` from fixture preview alone
- `runtime verified` from simulated responses alone
- `production-like` when a critical participating surface is absent
- `fully bound` while raw fetch still exists on the canonical path

## 18. Phase-Specific Execution Emphasis

Use these emphases while executing this band:

- Phase `19`: contract work is screen-proven, not preference-driven
- Phase `20`: generated layers are derived truth, not hand-maintained truth
- Phase `21`: canonical binding removes competing chains and raw fetch
- Phase `22`: runtime truth sources and non-truth sources become explicit
- Phase `23`: runtime mode language becomes precise and non-inflated
- Phase `24`: proof is earned across required surfaces and lifecycle moments

## 19. Handoff To Closure Phases

After Phase `24` passes:

- Phase `25` gathers final evidence and guards
- Phase `26` detaches donor leftovers from the live clean tree
- Phase `27` unlocks the next service only after the current service is sealed

Closure phases remain governed by their phase manuals and the main guide.