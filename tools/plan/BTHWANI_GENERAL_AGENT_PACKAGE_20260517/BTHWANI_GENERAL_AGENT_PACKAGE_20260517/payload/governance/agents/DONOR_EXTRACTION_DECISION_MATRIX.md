# Donor Extraction Decision Matrix

Version: 2026.05.17-v1

## Sources

- old branch: `ghb/0102-20260429-015636-packages`
- external official sources
- open-source references
- deleted history

## Categories

| Category | Meaning | Target |
|---|---|---|
| KEEP_AS_GENERAL_SKILL_PATTERN | reusable execution/review method | `.agents/skills` |
| MOVE_TO_GOVERNANCE | service/surface/domain-specific truth | `governance/` |
| MOVE_TO_GUARD | deterministic rule check | `tools/guards` |
| REJECT_AS_NOISE_OR_DUPLICATE | noisy, broad, stale, duplicated, unsafe | none |
| TBD_NEEDS_HUMAN_REVIEW | unclear value/risk | proposal only |

## Forbidden

- direct restore of deleted donor trees
- long copied external docs inside `.agents`
- duplicate active instruction folders
- service-specific skills when governance can own details
