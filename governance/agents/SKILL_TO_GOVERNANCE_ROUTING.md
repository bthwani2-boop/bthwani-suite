# Skill to Governance Routing

Version: 2026.05.17-v1

## Rule

`.agents` must stay general.
Service, app, and surface details belong in governance.

## Suggested governance owners

```text
governance/services/      -> DSH, WLT, KNZ, ARB, AMN, ESF, MRF, SND, KWD
governance/surfaces/      -> app-client, app-partner, app-captain, app-field, control-panel, webapp, website
governance/domains/       -> finance, marketing, catalog, operations, vars, providers, loyalty, subscriptions
governance/ui-kit/        -> design-system rules, exports, tokens, component ownership
governance/security/      -> secrets, privacy, supply-chain, MCP/hooks/scripts
governance/release/       -> release gates, runtime gates, native/build rules
governance/runtime/       -> local stack, providers, env/config, smoke tests
governance/agents/        -> agent package rules and capability map
```

## If governance is missing

Return:

```text
decision: NEEDS_GOVERNANCE_SOURCE
missing_path:
reason:
minimal_required_doc:
```
