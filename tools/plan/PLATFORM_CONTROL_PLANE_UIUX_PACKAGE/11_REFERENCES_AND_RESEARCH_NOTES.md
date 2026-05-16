# 11 — References and Research Notes

## Internal/current repo facts to verify

- `governance/20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md` already defines VAR law and provider control plane basics.
- `dsh/frontend/control-panel/platform/ControlPanelDshPlatformScreen.tsx` currently has Platform workspaces but must be pivoted from technical preview to sovereign control plane.
- Old `bthfinal` contained runtime vars/provider control concepts such as runtime var values, audit, provider config/catalog/bindings, switch logs, test runs, rollback. Use as donor logic only; do not copy code.

## External concepts to consider, not blindly copy

### Feature flags / runtime control

Modern feature-management systems separate release/runtime control from code deployment. This supports Platform having service visibility, rollouts, kill switches, impact checks, and rollback.

### Provider abstraction

Provider abstraction lets code consume a stable interface while provider selection/configuration changes through control policy. This supports central SMS/maps/payment/etc provider control.

### Secrets management

Secrets/API keys should be stored in secure, versioned, audited secret/config systems, not frontend code. UI should only show masked credential state.

## Research notes for agent

The agent may search official current docs for:

- OpenFeature provider concepts.
- Unleash feature flag / rollout / kill switch practices.
- HashiCorp Vault KV v2 or equivalent secret versioning and audit model.
- Cloud provider secret managers if relevant later.

Do not implement these systems now. Use them to shape UI/UX and governance only.

## Non-negotiable project constraints

- Current repo: `C:\bthwani-suite`
- Current GitHub repo: `bthwani2-boop/bthwani-suite`
- Old repos are donor/reference only.
- UI work follows: Screen / Surface / App → `@bthwani/ui-kit` public exports → Tamagui internally inside ui-kit only.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
