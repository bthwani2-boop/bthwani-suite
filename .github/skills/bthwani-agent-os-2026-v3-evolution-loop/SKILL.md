---
name: bthwani-agent-os-2026-v3-evolution-loop
description: Adds controlled execution-learning loop to the V3 Agent OS.
version: 2026.3.0-additive-evolution
fail_closed: true
requires_evidence: true
---

# bthwani-agent-os-2026-v3-evolution-loop

## Purpose
Adds controlled execution-learning loop to the V3 Agent OS.

## Procedure
1. Gather evidence first.
2. Classify the signal.
3. Refuse unsupported conclusions.
4. Produce required output fields.
5. Record next action.

## PASS Rules
- Evidence exists.
- No unsupported claim exists.
- Next human action exists.
- 100/100 only.

## FAIL/BLOCK Rules
- Missing evidence.
- 99/100.
- Vague next action.
- Random learning.
