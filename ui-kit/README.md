# BThwani ui-kit Root Scaffold

Status: BRIDGE_READY
Target owner root: ui-kit
Current implementation root: packages/ui-kit
Current truth status: BRIDGED / NOT MOVED
Migration phase: Phase 3 pilot

---

## 1. Decision

This folder introduces the root owner for `ui-kit`.

It does not move implementation.

The current implementation remains under:

```text
packages/ui-kit
```

The future target root is:

```text
ui-kit
```

---

## 2. Non-Negotiable Rules

| Rule | Status |
|---|---|
| Do not delete packages/ui-kit yet | REQUIRED |
| Do not delete existing ui-kit imports | REQUIRED |
| Bridge files must only re-export packages/ui-kit | REQUIRED |
| Tamagui remains internal to ui-kit only | REQUIRED |
| No local design systems outside ui-kit | REQUIRED |

---

## 3. Target Compact Structure

```text
ui-kit
└── src
    ├── index.ts
    ├── mobile.ts
    ├── web.ts
    └── next.ts
```

---

## 4. Current Phase Truth

| Area | Status |
|---|---|
| Root scaffold | CREATED |
| Root source bridge | ACTIVE |
| Source move | NOT MOVED |
| Import switch | NOT STARTED |
| TypeScript | PASS REQUIRED |
| Runtime impact | NONE EXPECTED |

---

## 5. Pilot Scope Guard

This pilot keeps all design-system truth inside `packages/ui-kit` and exposes only root bridge files.
