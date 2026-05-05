# TECH STACK LOCK

## 1. Status

- Status: `CANONICAL GOVERNANCE DECISION`
- Scope: governance-only architecture lock
- Implementation state: `NOT STARTED`
- Migration state: `NOT COMPLETE`
- This file records the target BThwani stack and the rules for moving toward it.

## 2. Scope

This file governs the locked target technology stack for BThwani.

It applies to:

- backend platform choice
- frontend, mobile, and control-panel stack choice
- database and cache/queue direction
- AI/data language policy
- macro architecture direction

It does not authorize implementation work.

## 3. Canonical Target Stack

- Backend Core = Go
- Frontend = TypeScript + React + React Native + Expo + Next.js
- Database = PostgreSQL
- Cache/Queue = Valkey or Redis
- AI/Data = Python only when a proven AI/Data requirement exists; otherwise TBD/NEEDS_CONFIRMATION
- Architecture = Modular Monolith first, Services later by evidence

This is the target stack lock for future planning and controlled migration.

## 4. Current Branch Reality

The current repo and branch context still use:

- TypeScript
- React
- React Native
- Expo
- Next.js
- pnpm
- Nx

That current reality is acknowledged as existing branch state only.
It does not override the target stack in this document.

Tamagui may exist currently as a dependency in the repo.
That current dependency state is acknowledged, but Tamagui is not part of the target architecture.

## 5. Explicit Non-Goals

- Do not start implementation.
- Do not claim the migration is complete.
- Do not treat this file as code delivery.
- Do not remove Tamagui now.
- Do not change package managers, workspace layout, or repo shape as part of this lock.
- Do not introduce backend, API, worker, contract, client, or service code.
- Do not add runtime or platform configs for the target stack yet.

## 6. Migration Rules

1. Treat this file as the authoritative target-stack decision until superseded by a later governance decision with evidence.
2. Any future move toward the target stack must be staged and evidence-based.
3. Preserve current working frontend and workspace technologies until a specific migration step is approved.
4. Do not mix governance locking with implementation conversion.
5. Record each migration step only after the required evidence exists.

## 7. Tamagui Decision

Tamagui is classified here as:

- `CURRENT_DEPENDENCY`
- `DEPRECATED_TARGET`
- `FUTURE_REMOVAL_PLAN_REQUIRED`

Rules:

- Do not remove Tamagui now.
- Do not expand Tamagui usage as part of the target architecture.
- Do not treat Tamagui as a future target-stack component.
- Any eventual removal must be planned separately and justified by evidence.

## 8. Python AI/Data Decision

Python is not a default target-language commitment for the full stack.

Policy:

- Python is allowed only when a proven AI/Data requirement exists.
- Until that proof exists, Python remains `TBD/NEEDS_CONFIRMATION`.
- No AI/Data implementation work may start from this file alone.

## 9. Database and Cache Decision

Database policy:

- PostgreSQL is the locked database target.

Cache/queue policy:

- Valkey or Redis is the locked cache/queue target.

Rules:

- Do not introduce PostgreSQL or Redis/Valkey code or configuration now.
- Do not infer a specific operational topology from this lock alone.
- Do not create database migrations, schemas, queue workers, or client bindings yet.

## 10. Modular Monolith First Rule

Architecture policy:

- Start with a Modular Monolith.
- Move to Services only later, and only by evidence.

Rules:

- Do not begin with service sprawl.
- Do not split ownership into services before the monolith evidence baseline exists.
- Service extraction requires explicit evidence that the split is justified.
- The default migration posture is consolidation first, decomposition later.

## 11. Evidence Requirements Before Implementation

Before any implementation begins, the following evidence is required:

1. A confirmed migration inventory for the affected domains.
2. A gap analysis showing current-state versus target-stack impact.
3. A scoped plan that names the smallest safe first step.
4. Proof that the step does not violate current governance or dependency constraints.
5. A separate decision for any Tamagui removal work.
6. A separate decision for any Python adoption work.
7. A separate decision for any database or cache configuration work.

Without this evidence, implementation remains blocked.

## 12. Forbidden Actions

- Do not edit any implementation file.
- Do not edit `package.json`.
- Do not edit `pnpm-workspace.yaml`.
- Do not edit `tsconfig.base.json`.
- Do not remove Tamagui.
- Do not create Go, Rust, Python, PostgreSQL, Redis, or Valkey code.
- Do not rename or move folders.
- Do not delete files.
- Do not modify dependencies or lockfiles.
- Do not perform broad refactors.
- Do not continue to another task.
- Do not claim target-stack completion from this governance lock.

## 13. Final Lock Summary

The BThwani target stack is locked as follows:

- Backend Core = Go
- Frontend = TypeScript + React + React Native + Expo + Next.js
- Database = PostgreSQL
- Cache/Queue = Valkey or Redis
- AI/Data = Python only when a proven AI/Data requirement exists; otherwise TBD/NEEDS_CONFIRMATION
- Architecture = Modular Monolith first, Services later by evidence

Current repo reality remains transitional and does not change this decision.
Tamagui remains a current dependency only, not a target-architecture commitment, and it requires a future removal plan before any elimination is approved.
