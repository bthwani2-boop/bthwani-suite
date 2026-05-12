---
name: bthwani-go-backend-target-boundary
description: Use for BThwani backend/API/runtime/platform decisions. Enforces Go as target backend unless current repo evidence explicitly requires another backend stack.
version: 2026.05.12-v2
---

# BThwani Go Backend Target Boundary

## Target stack lock

```text
Backend Core = Go
Frontend = TypeScript + React + React Native + Expo + Next.js
Database target = PostgreSQL
Cache/Queue target = Valkey or Redis when evidence proves need
Architecture = Modular Monolith first, Services later by evidence
```

## Current reality
Current repo frontend/tooling may still use TypeScript, React, React Native, Expo, Next.js, pnpm, Nx, and Tamagui inside ui-kit. That is current implementation reality, not backend target proof.

## NestJS rule
Do not describe NestJS as canonical BThwani backend unless current repo evidence and an explicit newer governance decision require it. If a file says NestJS is canonical, mark `STACK_CONFLICT_REQUIRES_FIX`.

## Forbidden from this skill alone
Do not implement Go, PostgreSQL, Redis/Valkey, API routes, migrations, Docker, or runtime provider logic from this skill alone. This skill is a boundary and decision skill, not an implementation authorization.
