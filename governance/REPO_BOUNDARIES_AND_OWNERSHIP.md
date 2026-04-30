# Repo Boundaries and Ownership

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Ownership map

| Area | Owner |
|---|---|
| `governance/` | Governance policy |
| `tools/guards/` | Governance guard implementation |
| `tools/scripts/` | Controlled automation/evidence |
| `tools/registry/runs/` | Evidence outputs |
| `.github/workflows/` | CI/CD enforcement |
| `.github/agents/` | Agent instructions |
| `.github/skills/` | Skill instructions |
| `apps/` | Runtime/build hosts |
| `packages/app-shells/` | Shell/root wiring |
| `packages/ui-kit/` | Reusable UI system |
| `packages/surfaces/src/public/` | Public surface contracts |
| `packages/surfaces/src/service-owned/<service>/` | Service-owned experiences |
| `packages/surfaces/src/surface-owned/` | Surface-owned shared experiences |
| `packages/api-types/` | API/shared types |
| `packages/api-clients/` | API clients |
| `services/` | Service runtime/domain |

## 2. Governance/tool split

`governance/` contains policy.

`tools/guards/` contains execution.

A guard may include a short description, but detailed policy belongs in governance.

## 3. Evidence split

Evidence output belongs under:

```text
tools/registry/runs/
```

Source/runtime code must not depend on evidence output.

## 4. Boundary conflict resolution

When ownership is unclear:

1. preserve behavior,
2. classify current owner,
3. classify intended owner,
4. scan references,
5. document decision,
6. migrate only with rollback,
7. verify.

## 5. Forbidden ownership patterns

```text
apps owning reusable UI primitives
service-owned paths owning general UI kit
surface-owned paths hiding service internals
tools/guards becoming policy SSoT
governance containing executable guard logic
evidence files imported by source code
parallel docs/governance policy source
```

## 6. Acceptance

Boundary changes require:

```text
scope proof
import/export proof
reference scan
diff review
typecheck
guard output
decision ledger entry
```
