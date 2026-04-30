---
name: bthwani-agent-os-2026-v3-human-next-action-coach
description: Forces clear next human action after every run.
version: 2026.3.0-additive-evolution
fail_closed: true
requires_evidence: true
---

# bthwani-agent-os-2026-v3-human-next-action-coach

## Purpose
Forces clear next human action after every run.

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
