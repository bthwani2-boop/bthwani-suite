---
name: bthwani-cursor-terminal-2026-v3-additive
description: terminal-first PowerShell CHECK/APPLY/VERIFY flows.
version: 2026.04.18-v3-additive
owner: BThwani
mode: add-only-fail-closed
acceptance_threshold: 100
---

# cursor-terminal

## Purpose
terminal-first PowerShell CHECK/APPLY/VERIFY flows.

## Mandatory intake
- classify task
- identify scope
- identify source evidence
- identify risk
- identify allowed and forbidden paths

## 100/100 pass rules
- all applicable checklist items proven
- no contradiction
- no unverified claim driving action
- no ownership violation
- no skipped phase

## Block rules
Block if evidence is missing, owner is unclear, source conflicts remain, WLT/security risk is unreviewed, or requested change is outside authority.

## Output sections
ROUTING / EVIDENCE / FINDINGS / RISK / DECISION / APPLY PLAN OR BLOCK / VERIFY COMMANDS.
