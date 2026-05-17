# BThwani General Agent Capability Map

Version: 2026.05.17-v1

## Principle

Every current or future agent need must route to exactly one owner:

```text
.agents/skills       -> general executable/review capability
governance/          -> project/domain/service/surface truth
tools/guards         -> programmatic verification
tools/registry/runs  -> evidence
TBD/BLOCKED          -> explicit missing source, never silent guessing
```

## Capability owners

| Capability | Owner |
|---|---|
| Workspace/path authority | `.agents/skills/bthwani-current-workspace-authority` |
| Execution governance | `.agents/skills/bthwani-agent-governance-execution` |
| Evidence pack | `.agents/skills/bthwani-local-evidence-pack` |
| Patch review | `.agents/skills/bthwani-patch-review-and-evidence` |
| Donor extraction | `.agents/skills/bthwani-agent-restoration-forensics` |
| Governance lookup | `.agents/skills/bthwani-domain-governance-reader` |
| UI kit / RTL / color / noise | `.agents/skills/bthwani-ui-kit-surface-contract` |
| Screen flow binding | `.agents/skills/bthwani-screen-flow-binding-contract` |
| Vars/provider control | `.agents/skills/bthwani-platform-vars-control-contract` |
| Runtime provider config | `.agents/skills/bthwani-runtime-provider-config-contract` |
| API/client contract | `.agents/skills/bthwani-api-contract-client-boundary` |
| Backend target | `.agents/skills/bthwani-go-backend-target-boundary` |
| Fixtures/simulation | `.agents/skills/bthwani-data-fixture-simulation-contract` |
| Finance/ledger | `.agents/skills/bthwani-finance-ledger-contract` |
| Marketing/offers/subscriptions | `.agents/skills/bthwani-commercial-growth-contract` |
| Catalog/store/product/cart | `.agents/skills/bthwani-commerce-catalog-contract` |
| Operations/dispatch/manual flows | `.agents/skills/bthwani-operations-dispatch-contract` |
| Mobile navigation/back | `.agents/skills/bthwani-mobile-navigation-back-contract` |
| Security/secrets/privacy | `.agents/skills/bthwani-security-secrets-privacy-contract` |
| Supply-chain/external skill intake | `.agents/skills/bthwani-supply-chain-intake-contract` |
| Test quality gates | `.agents/skills/bthwani-test-quality-gates-contract` |
| Release/runtime gates | `.agents/skills/bthwani-release-runtime-gates` |
| Observability/performance | `.agents/skills/bthwani-observability-performance-contract` |
| Skill authoring | `.agents/skills/bthwani-agent-skill-authoring-contract` |
| Registry validation | `.agents/skills/bthwani-agent-registry-validator` |

## Non-negotiable

If a needed capability is missing, the agent must report `MISSING_CAPABILITY` and stop at proposal/evidence, not improvise.
