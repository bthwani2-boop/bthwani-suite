---
name: bthwani-agent-os-2026-v3-execution-memory
description: Records verified execution memory from real runs; use when durable lessons from completed executions should be captured for later governed reuse.
version: 2026.3.0-additive-evolution
fail_closed: true
requires_evidence: true
---

# bthwani-agent-os-2026-v3-execution-memory

## Purpose
Records verified execution memory from real runs.

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
